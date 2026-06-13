/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SchoolRow, HierarchyNode } from '../types';
import { buildHierarchy } from '../lib/sheetsService';
import { Save, AlertTriangle, RefreshCw, Layers, GraduationCap, Users2, ArrowLeft, CheckCircle2, ClipboardPen } from 'lucide-react';

interface InputFormViewProps {
  rows: SchoolRow[];
  onUpdateRow: (
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
  ) => Promise<boolean>;
  onBackToDashboard: () => void;
  isUpdating: boolean;
}

export const InputFormView: React.FC<InputFormViewProps> = ({
  rows,
  onUpdateRow,
  onBackToDashboard,
  isUpdating,
}) => {
  // Cascading hierarchy dropdown levels
  const hierarchy = buildHierarchy(rows);

  const [selectedMinistryId, setSelectedMinistryId] = useState<string>('');
  const [selectedDeptId, setSelectedDeptId] = useState<string>('');
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('');

  const [departmentsList, setDepartmentsList] = useState<HierarchyNode[]>([]);
  const [schoolsList, setSchoolsList] = useState<HierarchyNode[]>([]);

  // Find the currently selected active row
  const [activeRow, setActiveRow] = useState<SchoolRow | null>(null);

  // Form Inputs - Students
  const [nursery, setNursery] = useState<number>(0);
  const [prePrimary, setPrePrimary] = useState<number>(0);
  const [primary, setPrimary] = useState<number>(0);
  const [lowerSecondary, setLowerSecondary] = useState<number>(0);
  const [upperSecondary, setUpperSecondary] = useState<number>(0);
  const [vocationalCert, setVocationalCert] = useState<number>(0);
  const [highVocationalCert, setHighVocationalCert] = useState<number>(0);
  const [diploma, setDiploma] = useState<number>(0);
  const [bachelor, setBachelor] = useState<number>(0);
  const [special, setSpecial] = useState<number>(0);

  // Form Inputs - Staff
  const [management, setManagement] = useState<number>(0);
  const [teaching, setTeaching] = useState<number>(0);
  const [support, setSupport] = useState<number>(0);

  // Dialog and confirmation State
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Handle Ministry cascade Selection
  const handleMinistryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const minId = e.target.value;
    setSelectedMinistryId(minId);
    setSelectedDeptId('');
    setSelectedSchoolId('');

    const minNode = hierarchy.find(h => h.id === minId);
    if (minNode) {
      // Find row for Ministry itself (Level 1)
      const activeItem = rows.find(r => `row-${r.rowNumber}` === minId);
      if (activeItem) {
        setActiveRow(activeItem);
      } else {
        setActiveRow(null);
      }

      const depts = minNode.children || [];
      setDepartmentsList(depts);

      // If the ministry has directly school children without subdivision (like standard ones)
      const schools = depts.filter(d => d.type === 'school');
      if (schools.length > 0) {
        setSchoolsList(depts);
      } else {
        setSchoolsList([]);
      }
    } else {
      setDepartmentsList([]);
      setSchoolsList([]);
      setActiveRow(null);
    }
  };

  // Handle Department cascade Selection
  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const deptId = e.target.value;
    setSelectedDeptId(deptId);
    setSelectedSchoolId('');

    const deptNode = departmentsList.find(d => d.id === deptId);
    if (deptNode) {
      const activeItem = rows.find(r => `row-${r.rowNumber}` === deptId);
      if (activeItem) {
        setActiveRow(activeItem);
      } else {
        setActiveRow(null);
      }

      if (deptNode.type !== 'school') {
        const schools = deptNode.children || [];
        setSchoolsList(schools);
      } else {
        setSchoolsList([]);
      }
    } else {
      setSchoolsList([]);
      // fallback to parent ministry if they select empty
      const parentMinItem = rows.find(r => `row-${r.rowNumber}` === selectedMinistryId);
      if (parentMinItem) {
        setActiveRow(parentMinItem);
      } else {
        setActiveRow(null);
      }
    }
  };

  // Handle ultimate School/Institution Selection
  const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const schoolId = e.target.value;
    setSelectedSchoolId(schoolId);

    if (schoolId) {
      const activeItem = rows.find(r => `row-${r.rowNumber}` === schoolId);
      if (activeItem) {
        setActiveRow(activeItem);
      } else {
        setActiveRow(null);
      }
    } else {
      // fallback to parent department / level 2
      const parentDeptItem = rows.find(r => `row-${r.rowNumber}` === selectedDeptId);
      if (parentDeptItem) {
        setActiveRow(parentDeptItem);
      } else {
        setActiveRow(null);
      }
    }
  };

  // Sync inputs with the database row state whenever active school selection updates
  useEffect(() => {
    if (activeRow) {
      const s = activeRow.studentTiers;
      const st = activeRow.staffTiers;

      setNursery(s.nursery);
      setPrePrimary(s.prePrimary);
      setPrimary(s.primary);
      setLowerSecondary(s.lowerSecondary);
      setUpperSecondary(s.upperSecondary);
      setVocationalCert(s.vocationalCert);
      setHighVocationalCert(s.highVocationalCert);
      setDiploma(s.diploma);
      setBachelor(s.bachelor);
      setSpecial(s.special);

      setManagement(st.management);
      setTeaching(st.teaching);
      setSupport(st.support);
    } else {
      // Reset
      setNursery(0);
      setPrePrimary(0);
      setPrimary(0);
      setLowerSecondary(0);
      setUpperSecondary(0);
      setVocationalCert(0);
      setHighVocationalCert(0);
      setDiploma(0);
      setBachelor(0);
      setSpecial(0);

      setManagement(0);
      setTeaching(0);
      setSupport(0);
    }
  }, [activeRow]);

  // Compute live computed values
  const liveStudentTotal =
    nursery +
    prePrimary +
    primary +
    lowerSecondary +
    upperSecondary +
    vocationalCert +
    highVocationalCert +
    diploma +
    bachelor +
    special;

  const liveStaffTotal = management + teaching + support;

  const handleApplyUpdate = async () => {
    if (!activeRow) return;

    try {
      setShowConfirmModal(false);
      const isSuccess = await onUpdateRow(
        activeRow.rowNumber,
        {
          nursery,
          prePrimary,
          primary,
          lowerSecondary,
          upperSecondary,
          vocationalCert,
          highVocationalCert,
          diploma,
          bachelor,
          special,
        },
        {
          management,
          teaching,
          support,
        }
      );

      if (isSuccess) {
        setSuccessMsg(`อัปเดตข้อมูลของสถานศึกษา "${activeRow.name.replace(/^\d+(\.\d+)*\s*/, '')}" สำเร็จ! ส่งข้อมูลไปยังตารางแถวที่ ${activeRow.rowNumber} เรียบร้อย`);
        setTimeout(() => setSuccessMsg(null), 5000); // 5 sec banner
      }
    } catch (e: any) {
      alert(`ไม่สามารถเชื่อมต่อเพื่อบันทึกข้อมูล: ${e.message || e}`);
    }
  };

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRow) return;
    setShowConfirmModal(true);
  };

  return (
    <div id="input-form-view-container" className="space-y-6 max-w-4xl mx-auto">
      {/* Header Back Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <button
            id="btn-back-dashboard"
            onClick={onBackToDashboard}
            className="p-2 text-slate-500 hover:text-slate-800 bg-slate-100/80 hover:bg-slate-200/50 rounded-lg transition duration-150"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h4 className="text-lg font-bold text-slate-800">เครื่องมือบันทึกและปรับปรุงตาราง</h4>
            <p className="text-xs text-slate-400 mt-0.5">กรอกระบุตัวเลข ข้อมูลจะเชื่อมต่อไปยัง ID ชีทโดยตรง</p>
          </div>
        </div>
        <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          เชื่อมต่อ Google Sheet แล้ว
        </span>
      </div>

      {/* Success banner alert */}
      {successMsg && (
        <div id="banner-success" className="bg-emerald-50/90 text-emerald-800 border border-emerald-200 p-4 rounded-xl flex items-start gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold">ดำเนินการสำเร็จ</p>
            <p className="text-xs mt-0.5 opacity-90">{successMsg}</p>
          </div>
        </div>
      )}

      {/* Primary Grid columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column: Selection Cascades */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs md:col-span-1 space-y-4">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-50">
            <Layers className="w-4 h-4 text-indigo-500" />
            <h5 className="text-sm font-bold text-slate-700">ลำดับโครงสร้างสังกัดตัวเลือก</h5>
          </div>

          {/* Selector 1: Ministry */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500">1. สังกัดหลัก</label>
            <select
              id="select-ministry"
              value={selectedMinistryId}
              onChange={handleMinistryChange}
              className="w-full text-sm p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-slate-700"
            >
              <option value="">-- เลือกสายงานหลัก --</option>
              {hierarchy.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Selector 2: Subdivision department */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500">
              {schoolsList.length === 0 && selectedDeptId
                ? '2. สถานศึกษา / หน่วยปฏิบัติ (ชั้นที่ 2)'
                : '2. หน่วยงานแยกแผนก'}
            </label>
            <select
              id="select-department"
              value={selectedDeptId}
              onChange={handleDeptChange}
              disabled={!selectedMinistryId || departmentsList.length === 0}
              className="w-full text-sm p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400 transition-colors bg-white text-slate-700 font-sans"
            >
              <option value="">
                {departmentsList.length === 0 ? '- ไม่มีข้อมูลย่อย -' : '-- เลือกผู้กำกับดูแล --'}
              </option>
              {departmentsList.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name.replace(/^\d+(\.\d+)*\s*/, '')}
                </option>
              ))}
            </select>
            {selectedDeptId && schoolsList.length === 0 && (
              <p className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded border border-emerald-100 flex items-center gap-1 mt-1">
                <span>✨ โครงสร้างนี้สิ้นสุดที่ 2 ส่วน (ชั้นที่ 2 เป็นสถานศึกษาแล้ว)</span>
              </p>
            )}
          </div>

          {/* Selector 3: Ultimate School/Institution */}
          {selectedDeptId && schoolsList.length > 0 && (
            <div className="space-y-1.5 animate-fadeIn">
              <label className="text-xs font-semibold text-blue-600">3. สถานศึกษา / หน่วยปฏิบัติ (ชั้นที่ 3)</label>
              <select
                id="select-school"
                value={selectedSchoolId}
                onChange={handleSchoolChange}
                disabled={schoolsList.length === 0}
                className="w-full text-sm p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400 transition-colors bg-white text-slate-700"
              >
                <option value="">
                  {schoolsList.length === 0 ? '- ไม่มีโรงเรียน -' : '-- เลือกผู้ปฏิบัติย่อย/โรงเรียน --'}
                </option>
                {schoolsList.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name.replace(/^\d+(\.\d+)*\s*/, '')}
                  </option>
                ))}
              </select>
              {selectedSchoolId && (
                <p className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded border border-emerald-100 flex items-center gap-1 mt-1">
                  <span>✨ โครงสร้างนี้สิ้นสุดที่ 3 ส่วน (ชั้นที่ 3 เป็นสถานศึกษาแล้ว)</span>
                </p>
              )}
            </div>
          )}

          {activeRow && (
            <div className="mt-4 p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100 flex flex-col gap-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-indigo-700 font-bold">
                <ClipboardPen className="w-3.5 h-3.5" />
                <span>รายละเอียดแถวกฎตัวชี้วัด</span>
              </div>
              <p className="text-slate-600">ตำแหน่งเป้าหมายในตาราง:</p>
              <span className="font-semibold text-slate-800 font-mono text-[11px] bg-indigo-100/50 py-0.5 px-2 rounded w-fit">
                แถวที่ {activeRow.rowNumber} (Row {activeRow.rowNumber})
              </span>
              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                * การปรับปรุงจะแก้ไขเฉพาะคอลัมน์ B ถึง P (ค่าตัวเลขจัดสรรนักศึกษาและและครูอาจารย์) โดยคงชื่อสังกัดแถวตัวเลือกไว้คงเดิมเพื่อความระเบียบเรียบร้อย
              </p>
            </div>
          )}
        </div>

        {/* Right column: Form Content */}
        <div className="md:col-span-2">
          {activeRow ? (
            <form id="form-data-entry" onSubmit={handleOpenConfirm} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] uppercase tracking-wider text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">
                  กำลังแก้ไขข้อมูล
                </span>
                <h5 className="text-base font-bold text-slate-800 mt-1 max-w-lg truncate">
                  {activeRow.name.replace(/^\d+(\.\d+)*\s*/, '')}
                </h5>
              </div>

              {/* SECTION A: Students distribution */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span>1. จำนวนนักเรียน/นักศึกษา จำแนกตามระดับย่อย (คน)</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {/* Nursery */}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-medium">เตรียมอนุบาล</label>
                    <input
                      type="number"
                      min="0"
                      value={nursery}
                      onChange={e => setNursery(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full text-sm p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Pre-Primary */}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-medium">ก่อนประถม</label>
                    <input
                      type="number"
                      min="0"
                      value={prePrimary}
                      onChange={e => setPrePrimary(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full text-sm p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Primary */}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-medium">ประถม</label>
                    <input
                      type="number"
                      min="0"
                      value={primary}
                      onChange={e => setPrimary(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full text-sm p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Junior high (ม.ต้น) */}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-medium">ม.ต้น</label>
                    <input
                      type="number"
                      min="0"
                      value={lowerSecondary}
                      onChange={e => setLowerSecondary(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full text-sm p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Senior high (ม.ปลาย) */}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-medium">ม.ปลาย</label>
                    <input
                      type="number"
                      min="0"
                      value={upperSecondary}
                      onChange={e => setUpperSecondary(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full text-sm p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* ปวช. */}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-medium">ปวช.</label>
                    <input
                      type="number"
                      min="0"
                      value={vocationalCert}
                      onChange={e => setVocationalCert(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full text-sm p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* ปวส. */}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-medium">ปวส.</label>
                    <input
                      type="number"
                      min="0"
                      value={highVocationalCert}
                      onChange={e => setHighVocationalCert(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full text-sm p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Diploma อนุปริญญา */}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-medium">อนุปริญญา</label>
                    <input
                      type="number"
                      min="0"
                      value={diploma}
                      onChange={e => setDiploma(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full text-sm p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Bachelor Degree ปริญญา */}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-medium">ปริญญา</label>
                    <input
                      type="number"
                      min="0"
                      value={bachelor}
                      onChange={e => setBachelor(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full text-sm p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Special education พิเศษ */}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-medium">พิเศษ</label>
                    <input
                      type="number"
                      min="0"
                      value={special}
                      onChange={e => setSpecial(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full text-sm p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="p-3 bg-blue-50/50 rounded-xl flex items-center justify-between text-xs font-semibold text-blue-700">
                  <span>ผู้เข้าศึกษาทั้งหมด:</span>
                  <span className="text-sm bg-blue-100/70 px-2.5 py-0.5 rounded-md">{liveStudentTotal.toLocaleString()} คน</span>
                </div>
              </div>

              {/* SECTION B: Staff counts */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                  <Users2 className="w-4 h-4 text-indigo-600" />
                  <span>2. จำนวนครูและบุคลากรทางการศึกษา (คน)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Management */}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-medium">สายบริหาร</label>
                    <input
                      type="number"
                      min="0"
                      value={management}
                      onChange={e => setManagement(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full text-sm p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Teachers */}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-medium">สายผู้สอน</label>
                    <input
                      type="number"
                      min="0"
                      value={teaching}
                      onChange={e => setTeaching(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full text-sm p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Support */}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-medium">สายสนับสนุน</label>
                    <input
                      type="number"
                      min="0"
                      value={support}
                      onChange={e => setSupport(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full text-sm p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="p-3 bg-indigo-50/50 rounded-xl flex items-center justify-between text-xs font-semibold text-indigo-700">
                  <span>บุคลากรรวมทั้งหมด:</span>
                  <span className="text-sm bg-indigo-100/70 px-2.5 py-0.5 rounded-md">{liveStaffTotal.toLocaleString()} คน</span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onBackToDashboard}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm transition"
                >
                  ย้อนกลับ
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none transition-colors duration-150 flex items-center gap-2 text-sm shadow-sm"
                >
                  {isUpdating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>กำลังบันทึก...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>บันทึกลงใน Google Sheet</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-slate-50/70 border border-slate-200 border-dashed rounded-2xl p-12 text-center text-slate-400 flex flex-col items-center justify-center h-full">
              <Layers className="w-12 h-12 mb-3.5 text-slate-300" />
              <h6 className="font-semibold text-slate-700 text-sm">ยังไม่ได้เลือกสถานศึกษาเป้าหมาย</h6>
              <p className="text-xs mt-1 max-w-sm leading-relaxed">
                กรุณาทำตามขั้นตอนสังกัดตัวเลือก (1-3) ในโครงสร้างด้านซ้ายมือ เพื่อระบุแถวสถานศึกษาในตารางก่อนทำการป้อนข้อมูล
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Google-styled Confirmation Dialog Modal */}
      {showConfirmModal && activeRow && (
        <div id="modal-confirm-dialog" className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-slideUp">
            <div className="flex items-center gap-3 text-amber-600 mb-4">
              <div className="p-2 bg-amber-50 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h6 className="text-base font-bold text-slate-800">ยืนยันการบันทึกทับข้อมูล?</h6>
            </div>

            <div className="space-y-3.5 text-sm my-4 text-slate-600">
              <p className="leading-relaxed">
                คุณกำลังจะส่งข้อมูลป้อนเข้าแก้ไขในไฟล์ Google Sheet โดยบันทึกทับข้อมูลปัจจุบันของโรงเรียน:
              </p>
              <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1 text-slate-700 font-medium">
                <div className="flex justify-between">
                  <span>ชื่อผู้เรียน/สถานบัน:</span>
                  <span className="text-slate-900 font-bold max-w-[200px] truncate">{activeRow.name.replace(/^\d+(\.\d+)*\s*/, '')}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200/50 pt-1 mt-1 font-mono">
                  <span>ลำดับแถวชีท:</span>
                  <span className="text-indigo-700 font-bold">แถวที่ {activeRow.rowNumber}</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 flex font-bold text-xs justify-between">
                <div className="flex flex-col">
                  <span className="text-slate-400 font-semibold uppercase">จำนวนนักเรียนใหม่</span>
                  <span className="text-blue-600 text-sm mt-0.5">{liveStudentTotal} คน</span>
                </div>
                <div className="flex flex-col border-l border-slate-100 pl-4">
                  <span className="text-slate-400 font-semibold uppercase">จำนวนครูใหม่</span>
                  <span className="text-indigo-600 text-sm mt-0.5">{liveStaffTotal} คน</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleApplyUpdate}
                className="px-4.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition"
              >
                ยืนยันเพื่อบันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
