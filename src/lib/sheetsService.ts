/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SchoolRow, HierarchyNode, MetricSummary } from '../types';

const parseNumber = (val: any): number => {
  if (val === undefined || val === null) return 0;
  const str = String(val).trim();
  if (str === '' || str === '-' || str === ' - ' || str === '0') return 0;
  const cleanStr = str.replace(/,/g, '').replace(/\s+/g, '');
  const num = Number(cleanStr);
  return isNaN(num) ? 0 : num;
};

const getRowLevel = (name: string): "ministry" | "department" | "school" | "summary" | "unknown" => {
  const trimmed = name.trim();
  if (trimmed === '' || trimmed === 'รวมทั้งหมด') return "summary";
  if (/^\d+\.\d+\.\d+/.test(trimmed)) return "school";
  if (/^\d+\.\d+/.test(trimmed)) return "department";
  if (/^\d+\./.test(trimmed)) return "ministry";
  return "unknown";
};

export const fetchSpreadsheetData = async (
  spreadsheetId: string,
  accessToken: string
): Promise<{ rows: SchoolRow[]; sheetTitle: string }> => {
  // 1. Get spreadsheet metadata to find the first sheet's title
  const metaUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`;
  const metaRes = await fetch(metaUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!metaRes.ok) {
    throw new Error(`Failed to fetch spreadsheet metadata: ${metaRes.statusText}`);
  }

  const metaData = await metaRes.json();
  const sheets = metaData.sheets;
  if (!sheets || sheets.length === 0) {
    throw new Error("No sheets found in this Google Spreadsheet.");
  }

  const sheetTitle = sheets[0].properties.title;

  // 2. Fetch sheet content
  const range = `'${sheetTitle}'!A1:P200`;
  const fetchUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`;
  const res = await fetch(fetchUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch spreadsheet data: ${res.statusText}`);
  }

  const data = await res.json();
  const values: any[][] = data.values || [];

  const parsedRows: SchoolRow[] = [];

  // Data row starts from row 4 (1-based index) -> index 3 of values array
  for (let i = 3; i < values.length; i++) {
    const rawRow = values[i];
    if (!rawRow || rawRow.length === 0) continue;

    const rawName = String(rawRow[0] || '').trim();
    if (!rawName) continue;

    const name = rawName;
    const rowNumber = i + 1; // 1-based index for spreadsheet API
    const level = getRowLevel(name);

    if (level === "unknown") continue;

    const studentTiers = {
      nursery: parseNumber(rawRow[1]),
      prePrimary: parseNumber(rawRow[2]),
      primary: parseNumber(rawRow[3]),
      lowerSecondary: parseNumber(rawRow[4]),
      upperSecondary: parseNumber(rawRow[5]),
      vocationalCert: parseNumber(rawRow[6]),
      highVocationalCert: parseNumber(rawRow[7]),
      diploma: parseNumber(rawRow[8]),
      bachelor: parseNumber(rawRow[9]),
      special: parseNumber(rawRow[10]),
      total: parseNumber(rawRow[11] || 0),
    };

    const staffTiers = {
      management: parseNumber(rawRow[12]),
      teaching: parseNumber(rawRow[13]),
      support: parseNumber(rawRow[14]),
      total: parseNumber(rawRow[15] || 0),
    };

    // Calculate totals just in case they're not calculated in the sheet
    const calculatedStudentTotal =
      studentTiers.nursery +
      studentTiers.prePrimary +
      studentTiers.primary +
      studentTiers.lowerSecondary +
      studentTiers.upperSecondary +
      studentTiers.vocationalCert +
      studentTiers.highVocationalCert +
      studentTiers.diploma +
      studentTiers.bachelor +
      studentTiers.special;

    const calculatedStaffTotal =
      staffTiers.management +
      staffTiers.teaching +
      staffTiers.support;

    // Use calculated totals if sheet total sits at 0 or empty is passed
    if (studentTiers.total === 0 && calculatedStudentTotal > 0) {
      studentTiers.total = calculatedStudentTotal;
    }
    if (staffTiers.total === 0 && calculatedStaffTotal > 0) {
      staffTiers.total = calculatedStaffTotal;
    }

    parsedRows.push({
      rowNumber,
      name,
      rawName: String(rawRow[0]),
      level,
      studentTiers,
      staffTiers,
    });
  }

  return { rows: parsedRows, sheetTitle };
};

// Update a school row with new student and staff data of length 15 columns (Col B to P)
export const updateSchoolRow = async (
  spreadsheetId: string,
  accessToken: string,
  sheetTitle: string,
  rowNumber: number,
  studentData: {
    nursery: number;
    prePrimary: number;
    primary: number;
    lowerSecondary: number;
    upperSecondary: number;
    vocationalCert: number;
    highVocationalCert: number;
    diploma: number;
    bachelor: number;
    special: number;
  },
  staffData: {
    management: number;
    teaching: number;
    support: number;
  }
): Promise<boolean> => {
  const studentTotal =
    studentData.nursery +
    studentData.prePrimary +
    studentData.primary +
    studentData.lowerSecondary +
    studentData.upperSecondary +
    studentData.vocationalCert +
    studentData.highVocationalCert +
    studentData.diploma +
    studentData.bachelor +
    studentData.special;

  const staffTotal =
    staffData.management +
    staffData.teaching +
    staffData.support;

  // Row values corresponding from Column B to P:
  // Col B-K: 10 student tiers
  // Col L: student total
  // Col M-O: 3 staff tiers
  // Col P: staff total
  const values = [
    [
      studentData.nursery,              // B
      studentData.prePrimary,           // C
      studentData.primary,              // D
      studentData.lowerSecondary,       // E
      studentData.upperSecondary,       // F
      studentData.vocationalCert,       // G
      studentData.highVocationalCert,   // H
      studentData.diploma,              // I
      studentData.bachelor,             // J
      studentData.special,              // K
      studentTotal,                     // L
      staffData.management,             // M
      staffData.teaching,               // N
      staffData.support,                // O
      staffTotal,                       // P
    ],
  ];

  const range = `'${sheetTitle}'!B${rowNumber}:P${rowNumber}`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      range,
      majorDimension: 'ROWS',
      values,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to update sheet cells: ${errText}`);
  }

  return true;
};

// Build high-level hierarchy structure for the cascading dropdowns
export const buildHierarchy = (rows: SchoolRow[]): HierarchyNode[] => {
  const hierarchy: HierarchyNode[] = [];
  let currentMinistry: HierarchyNode | null = null;
  let currentDepartment: HierarchyNode | null = null;

  for (const row of rows) {
    if (row.level === "ministry") {
      currentMinistry = {
        id: `row-${row.rowNumber}`,
        name: row.name,
        rowNumber: row.rowNumber,
        type: "ministry",
        children: [],
      };
      hierarchy.push(currentMinistry);
      currentDepartment = null; // reset
    } else if (row.level === "department") {
      if (currentMinistry) {
        currentDepartment = {
          id: `row-${row.rowNumber}`,
          name: row.name,
          rowNumber: row.rowNumber,
          type: "department",
          children: [],
        };
        currentMinistry.children?.push(currentDepartment);
      }
    } else if (row.level === "school") {
      const schoolNode: HierarchyNode = {
        id: `row-${row.rowNumber}`,
        name: row.name,
        rowNumber: row.rowNumber,
        type: "school",
      };

      if (currentDepartment) {
        currentDepartment.children?.push(schoolNode);
      } else if (currentMinistry) {
        currentMinistry.children?.push(schoolNode);
      } else {
        // standalone school
        hierarchy.push(schoolNode);
      }
    }
  }

  return hierarchy;
};

// Compute aggregated dashboard statistics
export const computeMetricSummary = (rows: SchoolRow[]): MetricSummary => {
  let totalSchools = 0;
  let totalStudents = 0;
  let totalStaff = 0;

  const studentByTier = {
    "เตรียมอนุบาล": 0,
    "ก่อนประถม": 0,
    "ประถม": 0,
    "ม.ต้น": 0,
    "ม.ปลาย": 0,
    "ปวช.": 0,
    "ปวส.": 0,
    "อนุปริญญา": 0,
    "ปริญญา": 0,
    "พิเศษ": 0,
  };

  const staffByTier = {
    "สายบริหาร": 0,
    "สายผู้สอน": 0,
    "สายสนับสนุน": 0,
  };

  const studentsByMinistry: { [name: string]: number } = {};
  const staffByMinistry: { [name: string]: number } = {};

  let currentMinistryName = "อื่นๆ / ไม่ระบุ";

  for (const row of rows) {
    if (row.level === "ministry") {
      currentMinistryName = row.name;
      // Initialize ministry counts
      if (!studentsByMinistry[currentMinistryName]) studentsByMinistry[currentMinistryName] = 0;
      if (!staffByMinistry[currentMinistryName]) staffByMinistry[currentMinistryName] = 0;
    } else if (row.level === "school") {
      totalSchools++;
      const s = row.studentTiers;
      const st = row.staffTiers;

      // Add to overall totals
      totalStudents += s.total;
      totalStaff += st.total;

      // Add to specific level tiers
      studentByTier["เตรียมอนุบาล"] += s.nursery;
      studentByTier["ก่อนประถม"] += s.prePrimary;
      studentByTier["ประถม"] += s.primary;
      studentByTier["ม.ต้น"] += s.lowerSecondary;
      studentByTier["ม.ปลาย"] += s.upperSecondary;
      studentByTier["ปวช."] += s.vocationalCert;
      studentByTier["ปวส."] += s.highVocationalCert;
      studentByTier["อนุปริญญา"] += s.diploma;
      studentByTier["ปริญญา"] += s.bachelor;
      studentByTier["พิเศษ"] += s.special;

      staffByTier["สายบริหาร"] += st.management;
      staffByTier["สายผู้สอน"] += st.teaching;
      staffByTier["สายสนับสนุน"] += st.support;

      // Add to ministry totals
      if (!studentsByMinistry[currentMinistryName]) studentsByMinistry[currentMinistryName] = 0;
      if (!staffByMinistry[currentMinistryName]) staffByMinistry[currentMinistryName] = 0;

      studentsByMinistry[currentMinistryName] += s.total;
      staffByMinistry[currentMinistryName] += st.total;
    }
  }

  return {
    totalSchools,
    totalStudents,
    totalStaff,
    studentByTier,
    staffByTier,
    studentsByMinistry,
    staffByMinistry,
  };
};
