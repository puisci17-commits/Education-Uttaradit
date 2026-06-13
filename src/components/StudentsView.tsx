import React, { useState, useEffect } from 'react';
import { SchoolRow } from '../types';
import { Search, Plus, UserCheck, Trash2, Edit2, X, Filter, Sparkles, AlertCircle, Check } from 'lucide-react';

export interface Student {
  id: string;
  name: string;
  gender: 'ชาย' | 'หญิง';
  schoolName: string;
  grade: string;
  status: 'มีสถานะเรียน' | 'พักการเรียน' | 'พ้นสภาพ';
  phone?: string;
  updatedAt: string;
}

interface StudentsViewProps {
  rows: SchoolRow[];
}

const DEFAULT_STUDENTS: Student[] = [
  { id: "65001", name: "นายสมชาย รักดี", gender: "ชาย", schoolName: "โรงเรียนอนุบาลอุตรดิตถ์", grade: "ประถมศึกษาปีที่ 6", status: "มีสถานะเรียน", phone: "081-234-5678", updatedAt: "14/06/2026 09:30" },
  { id: "65023", name: "นางสาวอรัญญา วิริยะ", gender: "หญิง", schoolName: "โรงเรียนอุตรดิตถ์ดรุณี", grade: "มัธยมศึกษาปีที่ 4", status: "มีสถานะเรียน", phone: "089-876-5432", updatedAt: "14/06/2026 09:15" },
  { id: "65012", name: "นายธีรภัทร ชูใจ", gender: "ชาย", schoolName: "โรงเรียนอุตรดิตถ์ (สถาบันหลัก)", grade: "มัธยมศึกษาปีที่ 3", status: "มีสถานะเรียน", phone: "095-432-1098", updatedAt: "14/06/2026 08:45" },
  { id: "65045", name: "นางสาวจรรยา วงศ์ดี", gender: "หญิง", schoolName: "โรงเรียนอนุบาลอุตรดิตถ์", grade: "ประถมศึกษาปีที่ 4", status: "มีสถานะเรียน", phone: "082-345-6789", updatedAt: "14/06/2026 08:30" },
  { id: "65009", name: "นายกวี ทัศนา", gender: "ชาย", schoolName: "โรงเรียนอุตรดิตถ์ดรุณี", grade: "มัธยมศึกษาปีที่ 6", status: "พักการเรียน", phone: "086-111-2222", updatedAt: "13/06/2026 16:20" },
  { id: "65031", name: "นางสาวปิยะพร แซ่ลิ้ม", gender: "หญิง", schoolName: "โรงเรียนวัดท่าปลา (ประชาอุทิศ)", grade: "มัธยมศึกษาปีที่ 1", status: "มีสถานะเรียน", phone: "083-999-8888", updatedAt: "13/06/2026 10:15" },
  { id: "65077", name: "เด็กชายวินัย เลิศสกุล", gender: "ชาย", schoolName: "โรงเรียนชุมชนน้ำปาด", grade: "ประถมศึกษาปีที่ 2", status: "มีสถานะเรียน", phone: "081-777-6666", updatedAt: "12/06/2026 15:30" }
];

export const StudentsView: React.FC<StudentsViewProps> = ({ rows }) => {
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('eic_students');
    return saved ? JSON.parse(saved) : DEFAULT_STUDENTS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState('');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState('');

  // Form states for creating/editing student
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formGender, setFormGender] = useState<'ชาย' | 'หญิง'>('ชาย');
  const [formSchool, setFormSchool] = useState('');
  const [formGrade, setFormGrade] = useState('');
  const [formStatus, setFormStatus] = useState<'มีสถานะเรียน' | 'พักการเรียน' | 'พ้นสภาพ'>('มีสถานะเรียน');
  const [formPhone, setFormPhone] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Filter school rows to populate school selection options
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

  useEffect(() => {
    localStorage.setItem('eic_students', JSON.stringify(students));
  }, [students]);

  const handleOpenAddForm = () => {
    setEditingStudentId(null);
    setFormId(`STD${Math.floor(10000 + Math.random() * 90000)}`);
    setFormName('');
    setFormGender('ชาย');
    setFormSchool(schoolOptions[0] || 'โรงเรียนอนุบาลอุตรดิตถ์');
    setFormGrade(gradeOptions[2]);
    setFormStatus('มีสถานะเรียน');
    setFormPhone('');
    setErrorMsg(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (student: Student) => {
    setEditingStudentId(student.id);
    setFormId(student.id);
    setFormName(student.name);
    setFormGender(student.gender);
    setFormSchool(student.schoolName);
    setFormGrade(student.grade);
    setFormStatus(student.status);
    setFormPhone(student.phone || '');
    setErrorMsg(null);
    setIsFormOpen(true);
  };

  const handleDeleteStudent = (id: string, name: string) => {
    if (confirm(`คุณต้องการลบข้อมูลของ ${name} หรือไม่?`)) {
      setStudents(prev => prev.filter(s => s.id !== id));
      triggerToast('ลบข้อมูลนักเรียนเรียบร้อย');
    }
  };

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 3000);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setErrorMsg('กรุณากรอกชื่อ-นามสกุลนักศึกษา');
      return;
    }

    const timestamp = new Date().toLocaleString('th-TH', { hour12: false });

    if (editingStudentId) {
      // Edit mode
      setStudents(prev => prev.map(s => {
        if (s.id === editingStudentId) {
          return {
            ...s,
            name: formName.trim(),
            gender: formGender,
            schoolName: formSchool,
            grade: formGrade,
            status: formStatus,
            phone: formPhone.trim(),
            updatedAt: timestamp
          };
        }
        return s;
      }));
      triggerToast('แก้ไขข้อมูลนักเรียนเรียบร้อย');
    } else {
      // Create mode
      if (students.some(s => s.id === formId)) {
        setErrorMsg('รหัสนักเรียน/นักศึกษาซ้ำในระบบ');
        return;
      }
      const newStudent: Student = {
        id: formId,
        name: formName.trim(),
        gender: formGender,
        schoolName: formSchool,
        grade: formGrade,
        status: formStatus,
        phone: formPhone.trim(),
        updatedAt: timestamp
      };
      setStudents(prev => [newStudent, ...prev]);
      triggerToast('เพิ่มนักเรียนในฐานข้อมูลสำเร็จ');
    }

    setIsFormOpen(false);
  };

  // Filtering Logic
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.id.includes(searchTerm);
    const matchesSchool = selectedSchoolFilter ? student.schoolName === selectedSchoolFilter : true;
    const matchesGrade = selectedGradeFilter ? student.grade === selectedGradeFilter : true;
    return matchesSearch && matchesSchool && matchesGrade;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters panel */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
          <input
            id="student-search-input"
            type="text"
            placeholder="ค้นหาชื่อ หรือ รหัสนักเรียน..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs p-2.5 pl-10 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* School filter */}
          <div className="relative flex-1 md:flex-initial">
            <select
              id="filter-school-select"
              value={selectedSchoolFilter}
              onChange={(e) => setSelectedSchoolFilter(e.target.value)}
              className="text-xs p-2.5 rounded-xl border border-slate-200 bg-white w-full md:w-56 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">กรองตามโรงเรียน (ทั้งหมด)</option>
              {schoolOptions.map((school, idx) => (
                <option key={idx} value={school}>{school.replace(/^\d+\.\d+\.\d+\s*/, '')}</option>
              ))}
            </select>
          </div>

          {/* Grade Filter */}
          <div className="relative flex-1 md:flex-initial">
            <select
              id="filter-grade-select"
              value={selectedGradeFilter}
              onChange={(e) => setSelectedGradeFilter(e.target.value)}
              className="text-xs p-2.5 rounded-xl border border-slate-200 bg-white w-full md:w-44 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">ระดับการเรียน (ทั้งหมด)</option>
              {gradeOptions.map((grade, idx) => (
                <option key={idx} value={grade}>{grade}</option>
              ))}
            </select>
          </div>

          <button
            id="btn-add-student"
            onClick={handleOpenAddForm}
            className="px-4 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition duration-150 w-full sm:w-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มนักเรียนใหม่</span>
          </button>
        </div>
      </div>

      {/* Main Database Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/85 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <UserCheck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-[#0F172A] text-sm sm:text-base">
              ฐานข้อมูลทะเบียนผู้เรียนรายคน ({filteredStudents.length} รายการที่ตรงเงื่อนไข)
            </h3>
          </div>
          <span className="text-[10px] bg-slate-100 text-slate-500 font-bold tracking-wider px-2 py-1 rounded">
            STUDENTS DATABASE
          </span>
        </div>

        {/* Data list Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-sans text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-slate-100 text-[#64748B] font-semibold text-left">
                <th className="p-4 px-6">รหัสนักศึกษา</th>
                <th className="p-4 px-6">ชื่อ-นามสกุล</th>
                <th className="p-4 px-6">เพศ</th>
                <th className="p-4 px-6">สถาบันการศึกษา</th>
                <th className="p-4 px-6">ระดับชั้นเรียน</th>
                <th className="p-4 px-6">ผู้ติดต่อ / โทรศัพท์</th>
                <th className="p-4 px-6 text-center">สถานะภาพ</th>
                <th className="p-4 px-6 text-right">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#334155]">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-400 font-light">
                    ไม่พบรายการข้อมูลที่ค้นหาในสารสนเทศฐานข้อมูล
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-50/70 transition duration-150">
                    <td className="p-4 px-6 font-mono font-medium text-slate-500">
                      <span className="bg-[#F1F5F9] px-2 py-0.5 rounded text-[11px] border border-slate-200 font-bold">{std.id}</span>
                    </td>
                    <td className="p-4 px-6 font-semibold text-[#0F172A]">{std.name}</td>
                    <td className="p-4 px-6 text-slate-500">{std.gender}</td>
                    <td className="p-4 px-4 px-6 text-slate-600 truncate max-w-[200px]" title={std.schoolName}>
                      {std.schoolName.replace(/^\d+\.\d+\.\d+\s*/, '')}
                    </td>
                    <td className="p-4 px-6 text-slate-600 italic">{std.grade}</td>
                    <td className="p-4 px-6 text-slate-500 font-mono">{std.phone || '-'}</td>
                    <td className="p-4 px-6 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide ${
                        std.status === 'มีสถานะเรียน' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : std.status === 'พักการเรียน'
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : 'bg-red-50 text-red-700 border border-red-100'
                      }`}>
                        {std.status}
                      </span>
                    </td>
                    <td className="p-4 px-6 text-right space-x-2 shrink-0">
                      <button
                        onClick={() => handleOpenEditForm(std)}
                        className="p-1.5 hover:bg-slate-100 text-blue-600 hover:text-blue-800 rounded-lg transition"
                        title="แก้ไขรายละเอียด"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(std.id, std.name)}
                        className="p-1.5 hover:bg-red-50 text-red-600 hover:text-red-800 rounded-lg transition"
                        title="ลบออกจากระบบ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Success Toast HUD */}
      {successToast && (
        <div className="fixed bottom-6 right-6 bg-[#0F172A] text-white p-4 py-3 rounded-xl flex items-center gap-2 text-xs shadow-xl animate-bounce z-50 border border-slate-700">
          <div className="p-1 bg-emerald-500 text-white rounded-full">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{successToast}</span>
        </div>
      )}

      {/* Interactive Modal Form for Add/Edit */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 transition-all animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 max-w-md w-full overflow-hidden animate-slideUp">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-800 to-slate-900 text-white flex items-center justify-between">
              <h4 className="font-bold text-sm sm:text-base">
                {editingStudentId ? 'แก้ไขข้อมูลนักศึกษาประวัติ' : 'ลงทะเบียนนักศึกษาใหม่เข้าระบบ'}
              </h4>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveForm} className="p-6 space-y-4 font-sans text-xs">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Student ID */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-500 block">รหัสประจำตัวนักเรียน</label>
                <input
                  type="text"
                  value={formId}
                  onChange={(e) => setFormId(e.target.value.trim())}
                  disabled={!!editingStudentId}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-500 block">ชื่อ-นามสกุลจริง</label>
                <input
                  type="text"
                  placeholder="ตัวอย่าง นายสมพงศ์ ดีใจ"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Gender & Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-500 block">เพศ</label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value as 'ชาย' | 'หญิง')}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="ชาย">ชาย</option>
                    <option value="หญิง">หญิง</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-500 block">เบอร์ติดต่อผู้ปกครอง</label>
                  <input
                    type="text"
                    placeholder="08X-XXX-XXXX"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* School Unit Select */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-500 block">ระบุกรอบสถาบัน / โรงเรียน</label>
                <select
                  value={formSchool}
                  onChange={(e) => setFormSchool(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {schoolOptions.map((school, idx) => (
                    <option key={idx} value={school}>{school.replace(/^\d+\.\d+\.\d+\s*/, '')}</option>
                  ))}
                </select>
              </div>

              {/* Grade Level Select */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-500 block">ระดับการศึกษารายปีหลัก</label>
                <select
                  value={formGrade}
                  onChange={(e) => setFormGrade(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {gradeOptions.map((grade, idx) => (
                    <option key={idx} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>

              {/* Status Select */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-500 block">สถานะปัจจุบันในระบบศึกษา</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as 'มีสถานะเรียน' | 'พักการเรียน' | 'พ้นสภาพ')}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="มีสถานะเรียน">มีสถานะเรียน (ปกติ)</option>
                  <option value="พักการเรียน">พักการเรียน / รักษาสภาพ</option>
                  <option value="พ้นสภาพ">พ้นสภาพ / จำหน่ายออก</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-semibold transition"
                >
                  ยกเลิกการแก้ไข
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition shadow-sm"
                >
                  {editingStudentId ? 'บันทึกการปรับปรุง' : 'ลงทะเบียนเรียน'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
