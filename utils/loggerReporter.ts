/**
 * @file loggerReporter.ts
 * @description Playwright custom reporter that writes structured log entries for every
 * test lifecycle event (suite start, test begin, test end, test step, errors).
 *
 * Runs in the Playwright orchestrator process (not in workers), so it writes
 * directly to the timestamped execution log file using fs.appendFileSync.
 *
 * Log events captured:
 *  - 🚀 Test suite started (total test count, workers, grep)
 *  - 🧪 Each test BEGIN (file + title)
 *  - 👣 Each named test.step() start and finish (with duration)
 *  - ✅ Test PASSED (with duration)
 *  - ❌ Test FAILED (with error message + relevant stack line)
 *  - ⏭️  Test SKIPPED / interrupted
 *  - 🏁 Suite finished (passed / failed / skipped + total duration)
 *
 * Log file format: logs/execution_YYYY-MM-DD_HH-mm-ss.log (new file per execution)
 *
 * Registration in playwright.config.ts:
 *   reporter: [ ['./utils/loggerReporter.ts'], ... ]
 */

import {
    Reporter,
    FullConfig,
    Suite,
    TestCase,
    TestResult,
    TestStep,
    FullResult,
} from '@playwright/test/reporter';

import fs from 'fs';
import { getLogFilePath, purgeOldLogs, LOG_DIR } from './logger';

// ─── Log file setup ───────────────────────────────────────────────────────────

/**
 * Returns two-digit zero-padded string
 */
function pad(n: number): string {
    return String(n).padStart(2, '0');
}

/**
 * Ensures the logs/ directory exists, then appends a timestamped entry to the execution log file.
 * @param level   - Log level label
 * @param message - Message text to record
 */
function log(level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG', message: string): void {
    try {
        if (!fs.existsSync(LOG_DIR)) {
            fs.mkdirSync(LOG_DIR, { recursive: true });
        }
        const now       = new Date();
        const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        const entry     = `[${timestamp}] [${level}] ${message}\n`;
        fs.appendFileSync(getLogFilePath(), entry, 'utf8');
    } catch {
        // Silently swallow — log failures must not break tests
    }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Formats milliseconds to a readable string: "1.23s" or "250ms" */
function formatDuration(ms: number): string {
    return ms >= 1000 ? `${(ms / 1000).toFixed(2)}s` : `${ms}ms`;
}

/** Returns a short relative path starting from "tests/" for readability */
function shortPath(fullPath: string): string {
    const idx = fullPath.indexOf('tests/');
    return idx !== -1 ? fullPath.slice(idx) : fullPath;
}

// ─── Reporter Class ───────────────────────────────────────────────────────────

/**
 * Playwright reporter that pipes all test lifecycle events to the execution log file.
 */
export default class LoggerReporter implements Reporter {

    private passed        = 0;
    private failed        = 0;
    private skipped       = 0;
    private suiteStartMs  = Date.now();

    // ── Suite-level ──────────────────────────────────────────────────────────

    onBegin(config: FullConfig, suite: Suite): void {
        this.suiteStartMs = Date.now();
        purgeOldLogs();

        const total = suite.allTests().length;
        const grep  = config.grep ? String(config.grep) : 'none';

        log('INFO', '═'.repeat(60));
        log('INFO', '🚀 TEST SUITE STARTED');
        log('INFO', `   Total tests  : ${total}`);
        log('INFO', `   Workers      : ${config.workers}`);
        log('INFO', `   Grep filter  : ${grep}`);
        log('INFO', `   Log file     : ${getLogFilePath()}`);
        log('INFO', '═'.repeat(60));
    }

    onEnd(result: FullResult): void {
        const duration = formatDuration(Date.now() - this.suiteStartMs);
        const status   = result.status === 'passed' ? '✅ ALL PASSED' : '❌ SOME FAILED';

        log('INFO', '═'.repeat(60));
        log('INFO', `🏁 TEST SUITE FINISHED — ${status}`);
        log('INFO', `   ✅ Passed  : ${this.passed}`);
        log('INFO', `   ❌ Failed  : ${this.failed}`);
        log('INFO', `   ⏭️  Skipped : ${this.skipped}`);
        log('INFO', `   ⏱️  Duration: ${duration}`);
        log('INFO', `   📁 Saved to : ${getLogFilePath()}`);
        log('INFO', '═'.repeat(60));
    }

    // ── Test-level ───────────────────────────────────────────────────────────

    onTestBegin(test: TestCase): void {
        log('INFO', '─'.repeat(60));
        log('INFO', `🧪 TEST BEGIN : ${test.title}`);
        log('INFO', `   File       : ${shortPath(test.location.file)} (line ${test.location.line})`);
    }

    onTestEnd(test: TestCase, result: TestResult): void {
        const duration = formatDuration(result.duration);

        switch (result.status) {
            case 'passed':
                this.passed++;
                log('INFO', `✅ PASSED    : ${test.title} [${duration}]`);
                break;

            case 'failed':
            case 'timedOut':
                this.failed++;
                log('ERROR', `❌ FAILED    : ${test.title} [${duration}]`);

                if (result.error?.message) {
                    log('ERROR', `   Error     : ${result.error.message.split('\n')[0]}`);
                }
                if (result.error?.stack) {
                    const stackLine = result.error.stack
                        .split('\n')
                        .find(l => l.includes('tests/') || l.includes('pages/') || l.includes('fixtures/'));
                    if (stackLine) {
                        log('ERROR', `   Location  : ${stackLine.trim()}`);
                    }
                }
                if (result.retry > 0) {
                    log('WARN', `   Retry #   : ${result.retry}`);
                }
                break;

            case 'skipped':
            case 'interrupted':
                this.skipped++;
                log('WARN', `⏭️  SKIPPED   : ${test.title}`);
                break;
        }
    }

    // ── Step-level ───────────────────────────────────────────────────────────

    onStepBegin(_test: TestCase, _result: TestResult, step: TestStep): void {
        if (step.category === 'test.step') {
            log('DEBUG', `   👣 STEP     : ${step.title}`);
        }
    }

    onStepEnd(_test: TestCase, _result: TestResult, step: TestStep): void {
        if (step.category === 'test.step') {
            const duration = formatDuration(step.duration);
            if (step.error) {
                log('ERROR', `   💥 STEP FAIL: ${step.title} [${duration}] — ${step.error.message?.split('\n')[0]}`);
            } else {
                log('DEBUG', `   ✔  STEP DONE: ${step.title} [${duration}]`);
            }
        }
    }
}
