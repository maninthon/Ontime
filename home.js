initData();

/* ===== แสดงข้อมูลวิชาที่สอน ===== */
function renderSubjectSummary() {
    const subject = getSubject();
    document.getElementById("infoClass").textContent = subject.className;
    document.getElementById("infoSubject").textContent = subject.subjectName;
    document.getElementById("infoDayPeriod").textContent = `วัน${subject.day} • ${subject.period}`;
    document.getElementById("infoTime").textContent = subject.time;
}

/* ===== แสดงสรุปตัวเลขการเช็คชื่อวันนี้ ===== */
function renderStatsSummary() {
    const students = getStudents();
    const todayRecords = getTodayAttendance();

    const total = students.length;
    const present = todayRecords.filter(r => r.status === "present").length;
    const late = todayRecords.filter(r => r.status === "late").length;
    const absent = todayRecords.filter(r => r.status === "absent").length;
    const pending = total - todayRecords.length;

    document.getElementById("statTotal").textContent = total;
    document.getElementById("statPresent").textContent = present;
    document.getElementById("statLate").textContent = late;
    document.getElementById("statAbsent").textContent = absent;
    document.getElementById("statPending").textContent = pending;
}

renderSubjectSummary();
renderStatsSummary();