/* ===== ไฟล์นี้ใช้กับ index.html เท่านั้น (ต้องโหลดหลัง data.js) ===== */

/* ===== เช็คว่าล็อกอินหรือยัง ถ้ายังไม่ล็อกอินให้เด้งกลับไปหน้า login ===== */
if (sessionStorage.getItem("ontime_logged_in") !== "true") {
    window.location.href = "login.html";
}

initData();

function renderSubjectSummary() {
    const subject = getSubject();
    document.getElementById("infoClass").textContent = subject.className;
    document.getElementById("infoSubject").textContent = subject.subjectName;
    document.getElementById("infoDayPeriod").textContent = `วัน${subject.day} • ${subject.period}`;
    document.getElementById("infoTime").textContent = subject.time;
}

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

/* ===== ปุ่มออกจากระบบ ===== */
document.getElementById("logoutBtn").addEventListener("click", function () {
    if (confirm("ต้องการออกจากระบบหรือไม่?")) {
        sessionStorage.removeItem("ontime_logged_in");
        window.location.href = "login.html";
    }
});

renderSubjectSummary();
renderStatsSummary();