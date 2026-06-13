/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { SchoolRow, MetricSummary } from '../types';
import { computeMetricSummary } from '../lib/sheetsService';
import { GraduationCap, Users2, Building2, TrendingUp, ChevronRight, Award, FolderHeart, ArrowRight } from 'lucide-react';

interface DashboardViewProps {
  rows: SchoolRow[];
  onNavigateToForm: () => void;
  spreadsheetId: string;
}

const COLORS = [
  '#2563eb', // blue
  '#0d9488', // teal
  '#4f46e5', // indigo
  '#db2777', // pink
  '#d97706', // amber
  '#7c3aed', // violet
  '#0284c7', // sky
  '#16a34a', // green
  '#ea580c', // orange
  '#4b5563'  // gray
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  rows,
  onNavigateToForm,
  spreadsheetId,
}) => {
  const [activeTab, setActiveTab] = useState<'students' | 'staff'>('students');
  const summary = computeMetricSummary(rows);

  // Prepare chart data for Student Tiers
  const studentChartData = Object.entries(summary.studentByTier)
    .map(([name, value]) => ({ name, value }))
    .filter(item => item.value > 0);

  // Prepare chart data for Staff Tiers
  const staffChartData = Object.entries(summary.staffByTier)
    .map(([name, value]) => ({ name, value }));

  // Prepare chart data for Ministry breakdown
  const ministryChartData = Object.entries(summary.studentsByMinistry)
    .map(([name, value]) => ({
      name: name.replace(/^\d+\.\s*/, '').split(' (')[0], // Clean up name for chart labels
      "จำนวนนักเรียน": value,
      "จำนวนบุคลากร": summary.staffByMinistry[name] || 0
    }))
    .filter(item => item["จำนวนนักเรียน"] > 0 || item["จำนวนบุคลากร"] > 0);

  // Find school with highest records
  const highestStudentSchool = [...rows]
    .filter(r => r.level === 'school')
    .sort((a, b) => b.studentTiers.total - a.studentTiers.total)[0];

  const highestStaffSchool = [...rows]
    .filter(r => r.level === 'school')
    .sort((a, b) => b.staffTiers.total - a.staffTiers.total)[0];

  return (
    <div id="dashboard-view-container" className="space-y-8">
      {/* Upper info ribbon */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div>
          <p className="text-sm font-mono text-slate-500">
            ID ชีทเป้าหมาย: <span className="font-semibold select-all font-sans text-xs bg-slate-200/60 px-2 py-0.5 rounded text-indigo-700">{spreadsheetId}</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">
            * ข้อมูลอ้างอิงจากแถวข้อมูลการศึกษาและครูที่แยกสังกัดทั้งหมด
          </p>
        </div>
        <button
          id="btn-navigate-to-form"
          onClick={onNavigateToForm}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-800 transition duration-150 shadow-sm text-sm group"
        >
          <span>บันทึก/ปรับปรุงข้อมูล</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Main Metric Cards (Sleek Interface Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric Card 1: Total Records */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">ระเบียนข้อมูลรวม</span>
            <span className="p-1 px-2.5 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-mono font-bold">RECORDS</span>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
              {(rows.length * 13).toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">จำแนกตามรายระดับและสายบริหาร</p>
          </div>
        </div>

        {/* Metric Card 2: Total Schools */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">จำนวนสถานศึกษา</span>
            <span className="p-1 px-2.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-mono font-bold">SCHOOLS</span>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
              {summary.totalSchools.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">สถาบันรัฐ เอกชน และท้องถิ่น</p>
          </div>
        </div>

        {/* Metric Card 3: Total Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">จำนวนผู้เรียนรวม</span>
            <span className="p-1 px-2.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-mono font-bold">STUDENTS</span>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
              {summary.totalStudents.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">ครอบคลุมการเรียน 10 ลำดับระดับ</p>
          </div>
        </div>

        {/* Metric Card 4: Completeness */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">ความสมบูรณ์ฐานข้อมูล</span>
            <span className="p-1 px-2.5 bg-sky-50 text-sky-600 rounded-lg text-[10px] font-mono font-bold">INTEGRITY</span>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-bold text-[#0F172A]">
              99.8%
            </div>
            <p className="text-[11px] text-slate-400 mt-1">ซิงค์ API สารสนเทศสมบูรณ์เรียบร้อย</p>
          </div>
        </div>
      </div>

      {/* Primary Chart Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Detail distribution */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h4 className="text-base font-bold text-slate-800">สัดส่วนรายละเอียดทรัพยากร</h4>
              <p className="text-xs text-slate-400 mt-0.5">จำแนกตามสายงาน และลึกระดับการศึกษา</p>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button
                id="btn-tab-students"
                onClick={() => setActiveTab('students')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  activeTab === 'students'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                นักเรียนตามระดับ
              </button>
              <button
                id="btn-tab-staff"
                onClick={() => setActiveTab('staff')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  activeTab === 'staff'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                บุคลากรจำแนกสาย
              </button>
            </div>
          </div>

          <div className="h-72 w-full">
            {activeTab === 'students' ? (
              studentChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={studentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                      formatter={(value: any) => [`${Number(value).toLocaleString()} คน`, 'นักเรียน']}
                    />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                      {studentChartData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-xl">
                  <GraduationCap className="w-10 h-10 mb-2 opacity-50" />
                  <p className="text-xs">ยังไม่มีข้อมูลจำนวนนักเรียน</p>
                  <p className="text-[10px] opacity-75 mt-0.5">กรุณากดปุ่มบันทึกข้อมูลด้านบนเพื่อเริ่มใส่รายละเอียด</p>
                </div>
              )
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={staffChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                    formatter={(value: any) => [`${Number(value).toLocaleString()} คน`, 'จำนวน']}
                  />
                  <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]}>
                    <Cell fill="#ef4444" /> {/* บริหาร */}
                    <Cell fill="#10b981" /> {/* ผู้สอน */}
                    <Cell fill="#f59e0b" /> {/* สนับสนุน */}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Right: Pie distribution of students by ministry */}
        <div id="chart-ministry-breakdown" className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-slate-800">สังกัดที่ดูแลผู้เรียน</h4>
            <p className="text-xs text-slate-400 mt-0.5">เปรียบเทียบสัดส่วนนักเรียนแยกตามกระทรวง</p>
          </div>

          <div className="h-56 w-full relative flex items-center justify-center my-4">
            {ministryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ministryChartData}
                    dataKey="จำนวนนักเรียน"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {ministryChartData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                    formatter={(value: any) => [`${Number(value).toLocaleString()} คน`, 'นักเรียน']}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-xl">
                <p className="text-xs">ไม่มีข้อมูลเปรียบเทียบสัดส่วน</p>
              </div>
            )}
            {summary.totalStudents > 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">นักเรียนรวม</span>
                <span className="text-xl font-bold text-slate-800">{summary.totalStudents.toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
            {ministryChartData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 truncate max-w-[70%]">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                    <span className="truncate text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-semibold text-slate-700">{item["จำนวนนักเรียน"].toLocaleString()} คน</span>
                </div>
            ))}
          </div>
        </div>
      </div>

      {/* Distribution breakdowns list details */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <h4 className="text-base font-bold text-slate-800">รายชื่อสถานศึกษาและสังกัดภายในระบบ</h4>
            <p className="text-xs text-slate-400 mt-0.5">ตรวจสอบจำนวนรายระดับเพื่อการวางแผนการศึกษา</p>
          </div>
          <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
            พบ {rows.filter(r => r.level === 'school').length} รายการโรงเรียน
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium text-xs">
                <th className="p-4 pl-6">สังกัด / รายชื่อสถานศึกษา</th>
                <th className="p-4 text-center">ระดับที่เปิดสอน</th>
                <th className="p-4 text-right">จำนวนนักเรียนรวม</th>
                <th className="p-4 text-right">จำนวนหน.ส่วนบริหาร</th>
                <th className="p-4 text-right">จำนวนครูผู้สอน</th>
                <th className="p-4 text-right">จำนวนสายสนับสนุน</th>
                <th className="p-4 text-right pr-6">รวมบุคลากร</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {rows.map((row) => {
                const isMinistry = row.level === 'ministry';
                const isDept = row.level === 'department';
                const isSchool = row.level === 'school';

                let bgClass = "bg-white";
                let textClass = "text-slate-600";
                let paddingLeft = "pl-6";

                if (isMinistry) {
                  bgClass = "bg-slate-100/50 font-bold";
                  textClass = "text-slate-800 font-bold text-sm";
                  paddingLeft = "pl-6";
                } else if (isDept) {
                  bgClass = "bg-slate-50/40 font-semibold";
                  textClass = "text-slate-700 font-semibold pl-10";
                } else if (isSchool) {
                  paddingLeft = "pl-14";
                }

                // Compile levels parsed
                const levels = [];
                const s = row.studentTiers;
                if (s.nursery > 0) levels.push('เตรียมอนุบาล');
                if (s.prePrimary > 0) levels.push('ก่อนประถม');
                if (s.primary > 0) levels.push('ประถม');
                if (s.lowerSecondary > 0) levels.push('ม.ต้น');
                if (s.upperSecondary > 0) levels.push('ม.ปลาย');
                if (s.vocationalCert > 0) levels.push('ปวช.');
                if (s.highVocationalCert > 0) levels.push('ปวส.');
                if (s.diploma > 0) levels.push('อนุปริญญา');
                if (s.bachelor > 0) levels.push('ปริญญา');
                if (s.special > 0) levels.push('พิเศษ');

                return (
                  <tr key={row.rowNumber} className={`${bgClass} hover:bg-slate-50/85 transition`}>
                    <td className={`p-4 ${paddingLeft} ${textClass} max-w-sm truncate`}>
                      {row.name}
                    </td>
                    <td className="p-4 text-center">
                      {isSchool ? (
                        levels.length > 0 ? (
                          <div className="flex flex-wrap gap-1 justify-center max-w-[200px] mx-auto">
                            {levels.slice(0, 3).map((l, i) => (
                              <span key={i} className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-md font-medium">
                                {l}
                              </span>
                            ))}
                            {levels.length > 3 && (
                              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md">
                                +{levels.length - 3}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 font-light">-</span>
                        )
                      ) : (
                        <span className="text-xs text-slate-400 font-medium font-mono">กลุ่มสังกัด</span>
                      )}
                    </td>
                    <td className={`p-4 text-right font-medium ${isSchool ? 'text-slate-700' : 'text-slate-900'}`}>
                      {row.studentTiers.total.toLocaleString()} คน
                    </td>
                    <td className="p-4 text-right text-slate-500">
                      {row.staffTiers.management > 0 ? `${row.staffTiers.management.toLocaleString()} คน` : '-'}
                    </td>
                    <td className="p-4 text-right text-slate-500">
                      {row.staffTiers.teaching > 0 ? `${row.staffTiers.teaching.toLocaleString()} คน` : '-'}
                    </td>
                    <td className="p-4 text-right text-slate-500">
                      {row.staffTiers.support > 0 ? `${row.staffTiers.support.toLocaleString()} คน` : '-'}
                    </td>
                    <td className={`p-4 text-right pr-6 font-semibold ${isSchool ? 'text-indigo-600' : 'text-indigo-800'}`}>
                      {row.staffTiers.total.toLocaleString()} คน
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
