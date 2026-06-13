import { SchoolRow } from '../types';

export const DEFAULT_MOCK_ROWS: SchoolRow[] = [
  {
    rowNumber: 4,
    name: "1. สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน (สพฐ.)",
    rawName: "1. สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน (สพฐ.)",
    level: "ministry",
    studentTiers: { nursery: 0, prePrimary: 0, primary: 0, lowerSecondary: 0, upperSecondary: 0, vocationalCert: 0, highVocationalCert: 0, diploma: 0, bachelor: 0, special: 0, total: 0 },
    staffTiers: { management: 0, teaching: 0, support: 0, total: 0 }
  },
  {
    rowNumber: 5,
    name: "1.1 สำนักงานเขตพื้นที่การศึกษาประถมศึกษาอุตรดิตถ์ เขต 1",
    rawName: "1.1 สำนักงานเขตพื้นที่การศึกษาประถมศึกษาอุตรดิตถ์ เขต 1",
    level: "department",
    studentTiers: { nursery: 0, prePrimary: 0, primary: 0, lowerSecondary: 0, upperSecondary: 0, vocationalCert: 0, highVocationalCert: 0, diploma: 0, bachelor: 0, special: 0, total: 0 },
    staffTiers: { management: 0, teaching: 0, support: 0, total: 0 }
  },
  {
    rowNumber: 6,
    name: "1.1.1 โรงเรียนอนุบาลอุตรดิตถ์",
    rawName: "1.1.1 โรงเรียนอนุบาลอุตรดิตถ์",
    level: "school",
    studentTiers: { nursery: 140, prePrimary: 420, primary: 1250, lowerSecondary: 0, upperSecondary: 0, vocationalCert: 0, highVocationalCert: 0, diploma: 0, bachelor: 0, special: 0, total: 1810 },
    staffTiers: { management: 4, teaching: 78, support: 12, total: 94 }
  },
  {
    rowNumber: 7,
    name: "1.1.2 โรงเรียนอุตรดิตถ์ (สถาบันหลัก)",
    rawName: "1.1.2 โรงเรียนอุตรดิตถ์ (สถาบันหลัก)",
    level: "school",
    studentTiers: { nursery: 0, prePrimary: 0, primary: 0, lowerSecondary: 840, upperSecondary: 920, vocationalCert: 0, highVocationalCert: 0, diploma: 0, bachelor: 0, special: 0, total: 1760 },
    staffTiers: { management: 5, teaching: 92, support: 15, total: 112 }
  },
  {
    rowNumber: 8,
    name: "1.1.3 โรงเรียนอุตรดิตถ์ดรุณี",
    rawName: "1.1.3 โรงเรียนอุตรดิตถ์ดรุณี",
    level: "school",
    studentTiers: { nursery: 0, prePrimary: 0, primary: 0, lowerSecondary: 710, upperSecondary: 890, vocationalCert: 0, highVocationalCert: 0, diploma: 0, bachelor: 0, special: 0, total: 1600 },
    staffTiers: { management: 4, teaching: 85, support: 14, total: 103 }
  },
  {
    rowNumber: 9,
    name: "1.2 สำนักงานเขตพื้นที่การศึกษาประถมศึกษาอุตรดิตถ์ เขต 2",
    rawName: "1.2 สำนักงานเขตพื้นที่การศึกษาประถมศึกษาอุตรดิตถ์ เขต 2",
    level: "department",
    studentTiers: { nursery: 0, prePrimary: 0, primary: 0, lowerSecondary: 0, upperSecondary: 0, vocationalCert: 0, highVocationalCert: 0, diploma: 0, bachelor: 0, special: 0, total: 0 },
    staffTiers: { management: 0, teaching: 0, support: 0, total: 0 }
  },
  {
    rowNumber: 10,
    name: "1.2.1 โรงเรียนวัดท่าปลา (ประชาอุทิศ)",
    rawName: "1.2.1 โรงเรียนวัดท่าปลา (ประชาอุทิศ)",
    level: "school",
    studentTiers: { nursery: 32, prePrimary: 84, primary: 320, lowerSecondary: 140, upperSecondary: 0, vocationalCert: 0, highVocationalCert: 0, diploma: 0, bachelor: 0, special: 0, total: 576 },
    staffTiers: { management: 2, teaching: 28, support: 4, total: 34 }
  },
  {
    rowNumber: 11,
    name: "1.2.2 โรงเรียนชุมชนน้ำปาด",
    rawName: "1.2.2 โรงเรียนชุมชนน้ำปาด",
    level: "school",
    studentTiers: { nursery: 45, prePrimary: 98, primary: 410, lowerSecondary: 110, upperSecondary: 0, vocationalCert: 0, highVocationalCert: 0, diploma: 0, bachelor: 0, special: 0, total: 663 },
    staffTiers: { management: 2, teaching: 32, support: 5, total: 39 }
  },
  {
    rowNumber: 12,
    name: "2. สำนักงานคณะกรรมการการอาชีวศึกษา (สอศ.)",
    rawName: "2. สำนักงานคณะกรรมการการอาชีวศึกษา (สอศ.)",
    level: "ministry",
    studentTiers: { nursery: 0, prePrimary: 0, primary: 0, lowerSecondary: 0, upperSecondary: 0, vocationalCert: 0, highVocationalCert: 0, diploma: 0, bachelor: 0, special: 0, total: 0 },
    staffTiers: { management: 0, teaching: 0, support: 0, total: 0 }
  },
  {
    rowNumber: 13,
    name: "2.1 สถาบันการอาชีวศึกษาภาคเหนือ 3 (อุตรดิตถ์)",
    rawName: "2.1 สถาบันการอาชีวศึกษาภาคเหนือ 3 (อุตรดิตถ์)",
    level: "department",
    studentTiers: { nursery: 0, prePrimary: 0, primary: 0, lowerSecondary: 0, upperSecondary: 0, vocationalCert: 0, highVocationalCert: 0, diploma: 0, bachelor: 0, special: 0, total: 0 },
    staffTiers: { management: 0, teaching: 0, support: 0, total: 0 }
  },
  {
    rowNumber: 14,
    name: "2.1.1 วิทยาลัยเทคนิคอุตรดิตถ์",
    rawName: "2.1.1 วิทยาลัยเทคนิคอุตรดิตถ์",
    level: "school",
    studentTiers: { nursery: 0, prePrimary: 0, primary: 0, lowerSecondary: 0, upperSecondary: 0, vocationalCert: 1250, highVocationalCert: 1850, diploma: 0, bachelor: 120, special: 0, total: 3220 },
    staffTiers: { management: 8, teaching: 145, support: 32, total: 185 }
  },
  {
    rowNumber: 15,
    name: "2.1.2 วิทยาลัยอาชีวศึกษาอุตรดิตถ์",
    rawName: "2.1.2 วิทยาลัยอาชีวศึกษาอุตรดิตถ์",
    level: "school",
    studentTiers: { nursery: 0, prePrimary: 0, primary: 0, lowerSecondary: 0, upperSecondary: 0, vocationalCert: 980, highVocationalCert: 1120, diploma: 0, bachelor: 45, special: 0, total: 2145 },
    staffTiers: { management: 5, teaching: 89, support: 21, total: 115 }
  },
  {
    rowNumber: 16,
    name: "2.1.3 วิทยาลัยการอาชีพพิชัย",
    rawName: "2.1.3 วิทยาลัยการอาชีพพิชัย",
    level: "school",
    studentTiers: { nursery: 0, prePrimary: 0, primary: 0, lowerSecondary: 0, upperSecondary: 0, vocationalCert: 540, highVocationalCert: 620, diploma: 0, bachelor: 0, special: 0, total: 1160 },
    staffTiers: { management: 3, teaching: 45, support: 11, total: 59 }
  },
  {
    rowNumber: 17,
    name: "3. สำนักงานศึกษาธิการอุตรดิตถ์ (ส่วนท้องถิ่นและอื่น ๆ)",
    rawName: "3. สำนักงานศึกษาธิการอุตรดิตถ์ (ส่วนท้องถิ่นและอื่น ๆ)",
    level: "ministry",
    studentTiers: { nursery: 0, prePrimary: 0, primary: 0, lowerSecondary: 0, upperSecondary: 0, vocationalCert: 0, highVocationalCert: 0, diploma: 0, bachelor: 0, special: 0, total: 0 },
    staffTiers: { management: 0, teaching: 0, support: 0, total: 0 }
  },
  {
    rowNumber: 18,
    name: "3.1 กองการศึกษา เทศบาลเมืองอุตรดิตถ์",
    rawName: "3.1 กองการศึกษา เทศบาลเมืองอุตรดิตถ์",
    level: "department",
    studentTiers: { nursery: 0, prePrimary: 0, primary: 0, lowerSecondary: 0, upperSecondary: 0, vocationalCert: 0, highVocationalCert: 0, diploma: 0, bachelor: 0, special: 0, total: 0 },
    staffTiers: { management: 0, teaching: 0, support: 0, total: 0 }
  },
  {
    rowNumber: 19,
    name: "3.1.1 โรงเรียนเทศบาลวัดคลองโพธิ์",
    rawName: "3.1.1 โรงเรียนเทศบาลวัดคลองโพธิ์",
    level: "school",
    studentTiers: { nursery: 60, prePrimary: 120, primary: 580, lowerSecondary: 230, upperSecondary: 0, vocationalCert: 0, highVocationalCert: 0, diploma: 0, bachelor: 0, special: 0, total: 990 },
    staffTiers: { management: 3, teaching: 45, support: 8, total: 56 }
  }
];

export const getStoredOrMockRows = (): SchoolRow[] => {
  const cached = localStorage.getItem('local_school_rows_cache');
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (_) {
      // fallback
    }
  }
  return DEFAULT_MOCK_ROWS;
};

export const saveMockRows = (rows: SchoolRow[]) => {
  localStorage.setItem('local_school_rows_cache', JSON.stringify(rows));
};
