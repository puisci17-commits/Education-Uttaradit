import React, { useState } from 'react';
import { Sliders, RefreshCw, Trash2, Calendar, FileText, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

interface SettingsViewProps {
  spreadsheetId: string;
  onSpreadsheetIdChange: (id: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  spreadsheetId,
  onSpreadsheetIdChange,
}) => {
  const [governorName, setGovernorName] = useState(() => localStorage.getItem('eic_governor_name') || 'นายอุดมฤทธิ์ เด่นดี');
  const [eduYear, setEduYear] = useState(() => localStorage.getItem('eic_edu_year') || '2569');
  const [provName, setProvName] = useState(() => localStorage.getItem('eic_province') || 'จังหวัดอุตรดิตถ์');
  
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('eic_governor_name', governorName);
    localStorage.setItem('eic_edu_year', eduYear);
    localStorage.setItem('eic_province', provName);

    setSuccessMsg('บันทึกการตั้งค่าลงเครื่องเรียบร้อยแล้ว');
    setTimeout(() => {
      setSuccessMsg(null);
    }, 3000);
  };

  const handleClearCache = () => {
    if (confirm("คุณต้องการล้างแคชสารสนเทศและประวัติการเช็คเวลาทั้งหมด รวมทั้งรายชื่อนักเรียนรายบนระบบจำลองหรือไม่? (ข้อมูลใน Google Sheet จริงจะไม่สูญหาย)")) {
      localStorage.removeItem('eic_students');
      localStorage.removeItem('eic_attendance_logs');
      localStorage.removeItem('local_school_rows_cache');
      alert("รีเซ็ตฐานข้อมูลเรียบร้อยแล้ว ระบบกำลังจะโหลดซ้ำ");
      window.location.reload();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-xs">
      {/* Settings Form */}
      <div className="bg-white rounded-2xl border border-slate-200/85 overflow-hidden shadow-xs">
        <div className="p-5 bg-gradient-to-r from-slate-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#38BDF8]" />
            <div>
              <h3 className="font-bold text-sm sm:text-base">ตั้งค่าระบบทั่วไป (General System Settings)</h3>
              <p className="text-[10px] text-slate-300">ปรับเปลี่ยนการแสดงคำและค่าคงที่ทั้งหมดในแดชบอร์ด</p>
            </div>
          </div>
          <span className="text-[9px] bg-[#38BDF8] text-[#0F172A] uppercase font-bold tracking-wider px-2 py-0.5 rounded">
            Configuration
          </span>
        </div>

        <form onSubmit={handleSaveSettings} className="p-6 space-y-5">
          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2.5 font-semibold">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form Fields row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-600 block">จังหวัดที่วิเคราะห์ศึกษา</label>
              <input
                type="text"
                value={provName}
                onChange={(e) => setProvName(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-slate-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-600 block">ปีงบประมาณและข้อมูล (พ.ศ.)</label>
              <input
                type="text"
                value={eduYear}
                onChange={(e) => setEduYear(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-600 block">ชื่อตำแหน่งผู้มีอำนาจตรวจสอบ / ผู้ว่าราชการจังหวัด</label>
            <input
              type="text"
              value={governorName}
              onChange={(e) => setGovernorName(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-slate-800 animate-pulse-slow"
            />
          </div>

          {/* Google spreadsheet ID direct link configuration */}
          <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <label className="font-bold text-slate-600 block">การเชื่อมโยงระบบบันทึกสด Google Sheets</label>
            <p className="text-[11px] text-slate-400 mb-2">ระบุ Google Sheets ID แหล่งกลางเพื่อใช้งานร่วมกับ Google Credentials</p>
            <input
              id="settings-sheet-id"
              type="text"
              value={spreadsheetId}
              onChange={(e) => onSpreadsheetIdChange(e.target.value)}
              className="w-full p-2.5 font-mono border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl transition shadow-sm font-sans"
            >
              บันทึกปรับเปลี่ยนตั้งค่า
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl border border-slate-200/85 p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-red-50 text-red-600 rounded-xl shrink-0">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">ส่วนกู้คืนระบบ (System Maintenance)</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-xl mt-1">
              ล้างแคชข้อมูลการลงทะเบียนนักเรียนจำลอง ประวัติการเช็คชื่อ และตัวแปรจำหน่ายของตารางแถว เพื่อรีเฟรชกลับสู่ค่าจาก Google Sheets และตัวแปรดั้งเดิมจากทาง EIC Uttaradit
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={handleClearCache}
            className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold rounded-xl flex items-center gap-2 transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>ลบกระบวนการและล้างแคชสารสนเทศ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
