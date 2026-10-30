import { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';

export default class CustomReporter implements Reporter {
  onBegin(config: any, suite: any): void {
    console.log(`[CustomReporter] Starting test run with ${suite.allTests().length} tests`);
  }

  onTestBegin(test: TestCase): void {
    console.log(`[CustomReporter] Starting test: ${test.title}`);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    console.log(`[CustomReporter] Finished test: ${test.title} - Status: ${result.status}`);
  }

  onEnd(result: FullResult): void {
    console.log(`[CustomReporter] Test run completed with status: ${result.status}`);
  }
}

