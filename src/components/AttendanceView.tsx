import React, { useState, useEffect } from 'react';
import { SchoolRow } from '../types';
import { Student } from './StudentsView';
import { Calendar, UserCheck, Check, Clock, UserX, Heart, ClipboardCheck, Sparkles, Filter, ChevronRight, History } from 'lucide-react';

interface AttendanceViewProps {
  rows: SchoolRow[];
}

interface AttendanceRecord {
  id: string; // generated time log
  date: string; // YYYY-MM-DD
  schoolName: string;
  grade: string;
  totalStudents: number;
  presentCount: number;
  lateCount: number;
  absentCount: number;
  leaveCount: number;
  studentsDetail: {
    studentId: string;
    studentName: string;
    status: 'มาเรียน' | 'มาสาย' | 'ขาดเรียน' | 'ลาป่วย';
  }[];
}

const DEFAULT_ATTENDANCES: AttendanceRecord[] = [
  {
    id: "att-1",
    date: new Date().toISOString().split('T')[0],
    schoolName: "โรงเรียนอนุบาลอุตรดิตถ์",
    grade: "ประถมศึกษาปีที่ 6",
    totalStudents: 2,
    presentCount: 2,
    lateCount: 0,
    absentCount: 0,
    leaveCount: 0,
    studentsDetail: [
      { studentId: "65001", studentName: "นายสมชาย รักดี", status: "มาเรียน" },
      { studentId: "65045", studentName: "นางสาวจรรยา วงศ์ดี", status: "มาเรียน" }
    ]
  },
  {
    id: "att-2",
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    schoolName: "โรงเรียนอุตรดิตถ์ดรุณี",
    grade: "มัธยมศึกษาปีที่ 4",
    totalStudents: 2,
    presentCount: 1,
    lateCount: 1,
    absentCount: 0,
    leaveCount: 0,
    studentsDetail: [
      { studentId: "65023", studentName: "นางสาวอรัญญา วิริยะ", status: "มาเรียน" },
      { studentId: "65009", studentName: "นายกวี ทัศนา", status: "มาสาย" }
    ]
  }
];

export const AttendanceView: React.FC<AttendanceViewProps> = ({ rows }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceRecord[]>([]);

  // Selection states
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Active logging states
  const [activeAttendanceList, setActiveAttendanceList] = useState<{ [id: string]: 'มาเรียน' | 'มาสาย' | 'ขาดเรียน' | 'ลาป่วย' }>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from local storage
  useEffect(() => {
    const savedStudents = localStorage.getItem('eic_students');
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    } else {
      // Default fallback
      setStudents([
        { id: "65001", name: "นายสมชาย รักดี", gender: "ชาย", schoolName: "โรงเรียนอนุบาลอุตรดิตถ์", grade: "ประถมศึกษาปีที่ 6", status: "มีสถานะเรียน", phone: "081-234-5678", updatedAt: "" },
        { id: "65023", name: "นางสาวอรัญญา วิริยะ", gender: "หญิง", schoolName: "โรงเรียนอุตรดิตถ์ดรุณี", grade: "มัธยมศึกษาปีที่ 4", status: "มีสถานะเรียน", phone: "089-876-5432", updatedAt: "" },
        { id: "65012", name: "นายธีรภัทร ชูใจ", gender: "ชาย", schoolName: "โรงเรียนอุตรดิตถ์ (สถาบันหลัก)", grade: "มัธยมศึกษาปีที่ 3", status: "มีสถานะเรียน", phone: "095-432-1098", updatedAt: "" },
        { id: "65045", name: "นางสาวจรรยา วงศ์ดี", gender: "หญิง", schoolName: "โรงเรียนอนุบาลอุตรดิตถ์", grade: "ประถมศึกษาปีที่ 4", status: "มีสถานะเรียน", phone: "082-345-6789", updatedAt: "" },
        { id: "65009", name: "นายกวี ทัศนา", gender: "ชาย", schoolName: "โรงเรียนอุตรดิตถ์ดรุณี", grade: "มัธยมศึกษาปีที่ 6", status: "มีสถานะเรียน", phone: "086-111-2222", updatedAt: "" }
      ]);
    }

    const savedLogs = localStorage.getItem('eic_attendance_logs');
    if (savedLogs) {
      setAttendanceLogs(JSON.parse(savedLogs));
    } else {
      setAttendanceLogs(DEFAULT_ATTENDANCES);
    }
  }, []);

  const schoolOptions = rows.filter(r => r.level === 'school').map(r => r.name);
  const gradeOptions = [
    "เตรียมอนุบาล",
    "อนุบาล 1-3",
    "ประถมศึกษาปีที่ 1", "ประถมศึกษาปีที่ 2", "ประถมศึกษาปีที่ 3", 
    "ประถมศึกษาปีที่ 4", "ประถมศึกษาปีที่ 5", "ประถมศึกษาปีที่ 6",
    "มัธยมศึกษาปีที่ 1", "มัธยมศึกษาปีที่ 2", "มัธยมศึกษาปีที่ 3",
    "มัธยมศึกษาปีที่ 4", "มัธยมศึกษาปีที่ 5", "มัธยมศึกษาปีที่ 6",
    "ปวช. ชั้นปีที่ 1-3", "ปวส. ชั้นปีที่ 1-2"
  ];

  // Set default filter items on mount
  useEffect(() => {
    if (schoolOptions.length > 0 && !selectedSchool) {
      setSelectedSchool(schoolOptions[0]);
    }
    if (!selectedGrade) {
      setSelectedGrade(gradeOptions[7]); // ประถม 6 Default
    }
  }, [rows]);

  // Derived filter list values
  const classStudents = students.filter(s => s.schoolName === selectedSchool && s.grade === selectedGrade && s.status === 'มีสถานะเรียน');

  // Trigger loading active checkboxes when selector values update
  useEffect(() => {
    const list: { [id: string]: 'มาเรียน' | 'มาสาย' | 'ขาดเรียน' | 'ลาป่วย' } = {};
    classStudents.forEach(s => {
      list[s.id] = 'มาเรียน'; // default to Present
    });
    setActiveAttendanceList(list);
  }, [selectedSchool, selectedGrade, students]);

  const handleStatusChange = (studentId: string, status: 'มาเรียน' | 'มาสาย' | 'ขาดเรียน' | 'ลาป่วย') => {
    setActiveAttendanceList(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSaveAttendance = () => {
    if (classStudents.length === 0) {
      alert("ไม่พบข้อมูลนักเรียนในการลงชื่อเข้าเรียนสถาบันและชั้นปีนี้ กรุณาเพิ่มนักเรียนในโรงเรียนดังกล่าวในแท็บ Students ก่อน");
      return;
    }

    let present = 0;
    let late = 0;
    let absent = 0;
    let leave = 0;

    const details = classStudents.map(s => {
      const status = activeAttendanceList[s.id] || 'มาเรียน';
      if (status === 'มาเรียน') present++;
      else if (status === 'มาสาย') late++;
      else if (status === 'ขาดเรียน') absent++;
      else if (status === 'ลาป่วย') leave++;

      return {
        studentId: s.id,
        studentName: s.name,
        status: status
      };
    });

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      date: attendanceDate,
      schoolName: selectedSchool,
      grade: selectedGrade,
      totalStudents: classStudents.length,
      presentCount: present,
      lateCount: late,
      absentCount: absent,
      leaveCount: leave,
      studentsDetail: details
    };

    const updatedLogs = [newRecord, ...attendanceLogs];
    setAttendanceLogs(updatedLogs);
    localStorage.setItem('eic_attendance_logs', JSON.stringify(updatedLogs));

    setToastMessage(`บันทึกเวลาเรียนสำเร็จ: มาเรียน ${present} คน, ขาด ${absent} คน`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleDeleteLog = (id: string) => {
    if (confirm("ลบประวัติการเช็คเวลารายการนี้หรือไม่?")) {
      const updated = attendanceLogs.filter(log => log.id !== id);
      setAttendanceLogs(updated);
      localStorage.setItem('eic_attendance_logs', JSON.stringify(updated));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Logger Box: Left 7 Columns */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200/85 overflow-hidden shadow-xs">
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-slate-800 to-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-[#38BDF8]" />
              <div>
                <h3 className="font-bold text-sm sm:text-base">ระบบการเช็คเวลาเรียนประจำวัน (Log Attendance)</h3>
                <p className="text-[10px] text-slate-300">ระบุสังกัดสถาบัน และคลิกเลือกเช็คสถานภาพผู้เรียน</p>
              </div>
            </div>
            <span className="text-[9px] bg-[#38BDF8] text-[#0F172A] uppercase font-bold tracking-wider px-2 py-0.5 rounded">
              Active Check-in
            </span>
          </div>

          {/* Selector filters bar */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
            <div className="space-y-1">
              <label className="font-semibold text-slate-500">1. ระบุโรงเรียน / มหาวิทยาลัย</label>
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {schoolOptions.map((school, i) => (
                  <option key={i} value={school}>{school.replace(/^\d+\.\d+\.\d+\s*/, '')}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-500">2. ระดับการเรียน</label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {gradeOptions.map((grade, i) => (
                  <option key={i} value={grade}>{grade}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-500">3. ระบุระบุวันที่ประเมิน</label>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="w-full p-2.3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-[11px]"
              />
            </div>
          </div>

          {/* Student list markup */}
          <div className="p-5">
            {classStudents.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-3 font-light text-xs">
                <Filter className="w-8 h-8 mx-auto text-slate-300 stroke-1" />
                <p>ไม่พบนักเรียนปกติที่ 'มีสถานะเรียน' ในกลุ่มคัดกรองดังกล่าว</p>
                <p className="text-[11px]">คุณสามารถเพิ่มสถานะนักเรียนรายคนแรกได้ในเมนู "Students Database" ด้านข้าง</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  รายชื่อนักเรียนทั้งหมด ({classStudents.length} คน)
                </div>

                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                  {classStudents.map((std) => {
                    const activeStatus = activeAttendanceList[std.id] || 'มาเรียน';

                    return (
                      <div key={std.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white border border-slate-100 rounded-xl hover:border-slate-300 transition gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="bg-slate-100 px-2 py-0.5 rounded font-mono font-bold text-slate-500 select-all">{std.id}</span>
                          <div>
                            <p className="font-semibold text-slate-900">{std.name}</p>
                            <p className="text-[10px] text-slate-400 italic">เพศ: {std.gender}</p>
                          </div>
                        </div>

                        {/* Attendance status toggler radio buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(std.id, 'มาเรียน')}
                            className={`px-3 py-1.5 rounded-lg flex items-center gap-1 bg-slate-50 border border-slate-200 transition ${
                              activeStatus === 'มาเรียน' ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-semibold' : 'text-slate-500 hover:bg-slate-100'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>มาเรียน</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(std.id, 'มาสาย')}
                            className={`px-3 py-1.5 rounded-lg flex items-center gap-1 bg-slate-50 border border-slate-200 transition ${
                              activeStatus === 'มาสาย' ? 'bg-amber-50 border-amber-300 text-amber-700 font-semibold' : 'text-slate-500 hover:bg-slate-100'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>สาย</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(std.id, 'ลาป่วย')}
                            className={`px-3 py-1.5 rounded-lg flex items-center gap-1 bg-slate-50 border border-slate-200 transition ${
                              activeStatus === 'ลาป่วย' ? 'bg-sky-50 border-sky-300 text-sky-700 font-semibold' : 'text-slate-500 hover:bg-slate-100'
                            }`}
                          >
                            <Heart className="w-3.5 h-3.5" />
                            <span>ลาป่วย</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(std.id, 'ขาดเรียน')}
                            className={`px-3 py-1.5 rounded-lg flex items-center gap-1 bg-slate-50 border border-slate-200 transition ${
                              activeStatus === 'ขาดเรียน' ? 'bg-red-50 border-red-300 text-red-700 font-semibold' : 'text-slate-500 hover:bg-slate-100'
                            }`}
                          >
                            <UserX className="w-3.5 h-3.5" />
                            <span>ขาด</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                  <button
                    onClick={handleSaveAttendance}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center gap-2 transition shadow-sm font-sans"
                  >
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>บันทึกรายชื่อเข้าเรียน</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* History Logger Box: Right 4 Columns */}
      <div className="lg:col-span-4 space-y-6">
        {/* Attendance Rates panel stats */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-xs space-y-3.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">สรุปการมาเรียนเฉลี่ย</span>
          <div className="flex items-baseline gap-1 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 text-[#166534]">
            <span className="text-3xl font-extrabold">96.3%</span>
            <span className="text-[11px] font-semibold text-slate-500"> อัตราการเข้าเรียนเฉลี่ยสำหรับโรงเรียนจังหวัด</span>
          </div>

          <div className="space-y-2 mt-2">
            <div className="flex justify-between items-center text-slate-500 text-[11px]">
              <span>จำนวนการล็อคเช็คชื่อแล้ว:</span>
              <span className="font-bold text-slate-800">{attendanceLogs.length} รอบ</span>
            </div>
            <div className="flex justify-between items-center text-slate-500 text-[11px]">
              <span>การประมวลผลล่าสุด:</span>
              <span className="font-mono text-slate-800 font-semibold text-[10px]">{attendanceLogs[0]?.date || '-'}</span>
            </div>
          </div>
        </div>

        {/* Previous logs list */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1.5">
              <History className="w-4 h-4 text-slate-400" />
              <span>ประวัติการเช็คเวลารายวัน</span>
            </span>
          </div>

          <div className="divide-y divide-slate-50 max-h-[300px] overflow-y-auto">
            {attendanceLogs.length === 0 ? (
              <p className="p-6 text-center text-slate-400 font-light text-xs">ไม่มีรายการบันทึกเวลาเรียนย้อนหลัง</p>
            ) : (
              attendanceLogs.map((log) => (
                <div key={log.id} className="p-4 text-xs hover:bg-slate-50 transition space-y-1.5 relative group">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 text-[11px] truncate max-w-[170px] block" title={log.schoolName}>
                      {log.schoolName.replace(/^\d+\.\d+\.\d+\s*/, '')}
                    </span>
                    <span className="font-mono text-[9px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-400 shrink-0">{log.date}</span>
                  </div>

                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500">{log.grade}</span>
                    <span className="text-slate-400 italic">ผู้สแกน {log.totalStudents} คน</span>
                  </div>

                  <div className="flex items-center gap-3 pt-1 text-[9px] font-semibold">
                    <span className="text-emerald-700">มา {log.presentCount}</span>
                    <span className="text-amber-700">สาย {log.lateCount}</span>
                    <span className="text-red-700 flex-1">ขาด {log.absentCount}</span>

                    <button
                      onClick={() => handleDeleteLog(log.id)}
                      className="text-red-400 hover:text-red-600 font-normal opacity-0 group-hover:opacity-100 transition"
                      title="ลบบันทึกประวัติรอบนี้"
                    >
                      ลบประวัติ
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Success alert notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#0c1424] text-white p-4 py-3 rounded-xl flex items-center gap-2 text-xs shadow-xl animate-bounce z-50 border border-slate-700">
          <div className="p-1 bg-emerald-500 text-white rounded-full">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
