/* ===============================================
   DATA LAYER — จัดการข้อมูลทั้งหมดผ่าน localStorage
   ไฟล์นี้ต้องถูกโหลดก่อน home.js และ script.js เสมอ
   =============================================== */

const STORAGE_KEYS = {
    subject: "ontime_subject",
    students: "ontime_students",
    attendance: "ontime_attendance"
};

/* ----- ตั้งค่าเริ่มต้น (ทำงานครั้งแรกที่ยังไม่มีข้อมูล) ----- */
function initData() {
    if (!localStorage.getItem(STORAGE_KEYS.subject)) {
        const defaultSubject = {
            className: "ป.6",
            subjectName: "การเขียนโปรแกรมเว็บ",
            day: "จันทร์",
            period: "คาบที่ 1",
            time: "08:30 - 09:20"
        };
        localStorage.setItem(STORAGE_KEYS.subject, JSON.stringify(defaultSubject));
    }

    if (!localStorage.getItem(STORAGE_KEYS.students)) {
        const defaultStudents = [
            { id: 1, name: "เด็กชายกันตพงศ์ วงศ์สุวรรณ" },
            { id: 2, name: "เด็กหญิงปาริชาติ บุญมี" },
            { id: 3, name: "เด็กชายนพรุจ แก้วมณี" },
            { id: 4, name: "เด็กหญิงศศิธร ทองคำ" },
            { id: 5, name: "เด็กชายกฤษฎา รุ่งเรือง" }
        ];
        localStorage.setItem(STORAGE_KEYS.students, JSON.stringify(defaultStudents));
    }

    if (!localStorage.getItem(STORAGE_KEYS.attendance)) {
        const today = getTodayKey();
        const defaultAttendance = [
            { studentId: 1, studentName: "เด็กชายกันตพงศ์ วงศ์สุวรรณ", date: today, time: "08:28:10", status: "present" },
            { studentId: 2, studentName: "เด็กหญิงปาริชาติ บุญมี",       date: today, time: "08:29:45", status: "present" },
            { studentId: 3, studentName: "เด็กชายนพรุจ แก้วมณี",         date: today, time: "08:35:02", status: "late" },
            { studentId: 4, studentName: "เด็กหญิงศศิธร ทองคำ",          date: today, time: "08:40:00", status: "absent" }
        ];
        localStorage.setItem(STORAGE_KEYS.attendance, JSON.stringify(defaultAttendance));
    }
}

/* ----- ล้างข้อมูลทั้งหมดแล้วเริ่มต้นใหม่ ----- */
function resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.subject);
    localStorage.removeItem(STORAGE_KEYS.students);
    localStorage.removeItem(STORAGE_KEYS.attendance);
    initData();
}

/* ----- ข้อมูลวิชา ----- */
function getSubject() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.subject));
}
function saveSubject(subject) {
    localStorage.setItem(STORAGE_KEYS.subject, JSON.stringify(subject));
}

/* ----- รายชื่อนักเรียน ----- */
function getStudents() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.students));
}
function saveStudents(students) {
    localStorage.setItem(STORAGE_KEYS.students, JSON.stringify(students));
}
function addStudent(name) {
    const students = getStudents();
    const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
    students.push({ id: newId, name: name });
    saveStudents(students);
}
function editStudent(id, newName) {
    const students = getStudents();
    const target = students.find(s => s.id === id);
    if (target) target.name = newName;
    saveStudents(students);
}
function deleteStudent(id) {
    let students = getStudents();
    students = students.filter(s => s.id !== id);
    saveStudents(students);
}

/* ----- การเช็คชื่อ ----- */
function getTodayKey() {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

function getAttendance() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.attendance));
}

function saveAttendance(records) {
    localStorage.setItem(STORAGE_KEYS.attendance, JSON.stringify(records));
}

function markAttendance(studentId, studentName, status) {
    const records = getAttendance();
    const today = getTodayKey();
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    const existing = records.find(r => r.studentId === studentId && r.date === today);
    if (existing) {
        existing.status = status;
        existing.time = time;
    } else {
        records.push({ studentId, studentName, date: today, time, status });
    }
    saveAttendance(records);
}

function getTodayAttendance() {
    const today = getTodayKey();
    return getAttendance().filter(r => r.date === today);
}

function getStudentStatusToday(studentId) {
    const today = getTodayAttendance();
    const record = today.find(r => r.studentId === studentId);
    return record || null;
}