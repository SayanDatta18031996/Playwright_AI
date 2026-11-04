/**
 * @file logger.ts
 * @description Centralized logging utility for the Playwright test automation framework.
 *
 * Features:
 *  - Creates a brand new, timestamped log file on EVERY execution:
 *    Format: logs/execution_YYYY-MM-DD_HH-mm-ss.log
 *  - Automatically purges log files older than 30 days to prevent disk bloat
 *  - Excluded from git commits via .gitignore (logs/*.log)
 *  - Supports four log levels: INFO, WARN, ERROR, DEBUG
 *  - Each log entry is written to both the console and the current execution log file
 *
 * Usage:
 *   import { logger } from './logger';
 *   logger.info('Test started');
 *   logger.error('Something went wrong', error);
 */

import fs from 'fs';
import path from 'path';

// ─── Constants ────────────────────────────────────────────────────────────────

/** Root directory of the project */
const PROJECT_ROOT = path.resolve(__dirname, '..');

/** Directory where log files are stored */
export const LOG_DIR = path.join(PROJECT_ROOT, 'logs');

/** Number of days after which log files are automatically deleted */
const LOG_RETENTION_DAYS = 30;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns two-digit zero-padded string
 */
function pad(n: number): string {
    return String(n).padStart(2, '0');
}

/**
 * Returns the current timestamp formatted as YYYY-MM-DD HH:MM:SS
 */
function getTimestamp(): string {
    const now = new Date();
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

/**
 * Resolves the full path to the log file for the current execution.
 * Naming convention: execution_YYYY-MM-DD_HH-mm-ss.log
 * Uses process.env.EXECUTION_LOG_FILE so all parallel worker processes write to the same file.
 */
export function getLogFilePath(): string {
    if (!process.env.EXECUTION_LOG_FILE) {
        const now = new Date();
        const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
        process.env.EXECUTION_LOG_FILE = `execution_${timestamp}.log`;
    }
    return path.join(LOG_DIR, process.env.EXECUTION_LOG_FILE);
}

/**
 * Deletes log files in the logs/ directory that are older than LOG_RETENTION_DAYS (30 days).
 * Evaluates file modification time (mtime) for all .log files.
 * Runs silently — errors during cleanup are suppressed to avoid blocking tests.
 */
export function purgeOldLogs(): void {
    if (!fs.existsSync(LOG_DIR)) return;

    const cutoffMs = LOG_RETENTION_DAYS * 24 * 60 * 60 * 1000; // 30 days in ms
    const now = Date.now();

    try {
        const files = fs.readdirSync(LOG_DIR);

        for (const file of files) {
            // Only examine .log files, ignore .gitkeep or other files
            if (!file.endsWith('.log')) continue;

            const filePath = path.join(LOG_DIR, file);
            const stat = fs.statSync(filePath);
            const ageMs = now - stat.mtimeMs;

            if (ageMs > cutoffMs) {
                fs.unlinkSync(filePath);
                console.log(`[Logger] 🗑️  Deleted old log (>30 days): ${file}`);
            }
        }
    } catch (err) {
        // Silently swallow cleanup errors — log purge failure should not break tests
        console.warn(`[Logger] ⚠️  Could not purge old logs: ${err}`);
    }
}

// ─── Logger Class ─────────────────────────────────────────────────────────────

/**
 * Log level type — determines the severity prefix in log output
 */
type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

/**
 * Centralized logger class.
 * Writes logs to both the console and the timestamped execution log file.
 * Old log files (>30 days) are purged automatically on first use.
 */
class Logger {
    constructor() {
        // Ensure the logs directory exists
        if (!fs.existsSync(LOG_DIR)) {
            fs.mkdirSync(LOG_DIR, { recursive: true });
        }

        // Purge log files older than 30 days
        purgeOldLogs();
    }

    /**
     * Writes a log entry to both the console and the execution log file.
     * @param level    - Log severity level (INFO | WARN | ERROR | DEBUG)
     * @param message  - Primary log message
     * @param context  - Optional extra data (error object, metadata, etc.)
     */
    private write(level: LogLevel, message: string, context?: unknown): void {
        const timestamp = getTimestamp();
        const contextStr = context ? ` | ${JSON.stringify(context, null, 0)}` : '';
        const entry = `[${timestamp}] [${level}] ${message}${contextStr}`;

        // Write to console with appropriate method
        switch (level) {
            case 'ERROR': console.error(entry); break;
            case 'WARN':  console.warn(entry);  break;
            default:      console.log(entry);   break;
        }

        // Append to the current execution's log file
        try {
            const filePath = getLogFilePath();
            fs.appendFileSync(filePath, entry + '\n', 'utf8');
        } catch (err) {
            console.error(`[Logger] ❌ Failed to write to log file: ${err}`);
        }
    }

    /**
     * Logs an informational message
     * @param message - Message to log
     * @param context - Optional extra data
     */
    info(message: string, context?: unknown): void {
        this.write('INFO', message, context);
    }

    /**
     * Logs a warning message
     * @param message - Message to log
     * @param context - Optional extra data
     */
    warn(message: string, context?: unknown): void {
        this.write('WARN', message, context);
    }

    /**
     * Logs an error message
     * @param message - Message to log
     * @param context - Optional extra data (e.g. the caught Error object)
     */
    error(message: string, context?: unknown): void {
        this.write('ERROR', message, context instanceof Error ? context.message : context);
    }

    /**
     * Logs a debug message (useful during local development)
     * @param message - Message to log
     * @param context - Optional extra data
     */
    debug(message: string, context?: unknown): void {
        this.write('DEBUG', message, context);
    }
}

// ─── Singleton Export ─────────────────────────────────────────────────────────

/**
 * Singleton logger instance — import this in any file that needs logging.
 *
 * @example
 *   import { logger } from '../utils/logger';
 *   logger.info('Navigating to home page');
 *   logger.error('Login failed', error);
 */
export const logger = new Logger();
