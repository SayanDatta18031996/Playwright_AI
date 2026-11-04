/**
 * @file DataReader.ts
 * @description Static utility class for reading test data from external files.
 *
 * Supports three file formats:
 *  - JSON  : Parsed directly with JSON.parse
 *  - CSV   : Parsed using the csv-parse library (returns array of row objects)
 *  - Excel : Parsed using the xlsx library (returns array of row arrays from Sheet 1)
 *
 * Usage:
 *   import { DataProvider } from '../utils/DataReader';
 *   const data = DataProvider.readJson('tests/data/users.json');
 *   const rows = DataProvider.readCsv('tests/data/logins.csv');
 */

import fs from 'fs';
import { parse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';

export class DataProvider {
  static readJson(filePath: string) {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  }

  static readCsv(filePath: string) {
    const data = fs.readFileSync(filePath);
    return parse(data, {
      columns: true,
      skip_empty_lines: true,
    });
  }

  static readExcel(filePath: string) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  }
}

