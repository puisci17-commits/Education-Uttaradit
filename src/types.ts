/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SchoolRow {
  rowNumber: number; // 1-based index in the spreadsheet
  name: string;      // Trimmed name
  rawName: string;   // Original name as shown in the sheet
  level: "ministry" | "department" | "school" | "summary" | "unknown";
  studentTiers: {
    nursery: number;      // เตรียมอนุบาล
    prePrimary: number;   // ก่อนประถม
    primary: number;      // ประถม
    lowerSecondary: number; // ม.ต้น
    upperSecondary: number; // ม. ปลาย
    vocationalCert: number; // ปวช.
    highVocationalCert: number; // ปวส.
    diploma: number;      // อนุปริญญา
    bachelor: number;     // ปริญญา
    special: number;      // พิเศษ
    total: number;        // รวม
  };
  staffTiers: {
    management: number;   // สายบริหาร
    teaching: number;     // สายผู้สอน
    support: number;      // สายสนับสนุน
    total: number;        // รวม
  };
}

export interface HierarchyNode {
  id: string;
  name: string;
  rowNumber: number;
  type: "ministry" | "department" | "school";
  children?: HierarchyNode[];
}

export interface MetricSummary {
  totalSchools: number;
  totalStudents: number;
  totalStaff: number;
  studentByTier: { [key: string]: number };
  staffByTier: { [key: string]: number };
  studentsByMinistry: { [name: string]: number };
  staffByMinistry: { [name: string]: number };
}
