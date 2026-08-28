/* ===== ไฟล์นี้ใช้กับ manage.html เท่านั้น (ต้องโหลดหลัง data.js) ===== */

/* ===== เช็คว่าล็อกอินหรือยัง ถ้ายังไม่ล็อกอินให้เด้งกลับไปหน้า login ===== */
if (sessionStorage.getItem("ontime_logged_in") !== "true") {
    window.location.href = "login.html";
}

initData();

const subjectForm = document.getElementById("subjectForm");
const fSubjectName = document.getElementById("fSubjectName");
const fDay = document.getElementById("fDay");
const fPeriod = document.getElementById("fPeriod");
const fTime = document.getElementById("fTime");

const newStudentName = document.getElementById("newStudentName");
const addStudentBtn = document.getElementById("addStudentBtn");
const addFeedback = document.getElementById("addStudentFeedback");
const studentTableBody = document.getElementById("studentTableBody");
const attendanceTableBody = document.getElementById("attendanceTableBody");
const resetBtn = document.getElementById("resetBtn");

function loadSubjectForm() {
    const subject = getSubject();
    fSubjectName.value = subject.subjectName;
    fDay.value = subject.day;
    fPeriod.value = subject.period;
    fTime.value = subject.time;
}

subjectForm.addEventListener("submit", function (e) {
    e.preventDefault();
    saveSubject({
        className: "ป.6",
        subjectName: fSubjectName.value,
        day: fDay.value,
        period: fPeriod.value,
        time: fTime.value
    });
    alert("บันทึกข้อมูลวิชาเรียบร้อยแล้ว");
});

function renderStudentTable() {
    const students = getStudents();
    studentTableBody.innerHTML = "";

    if (students.length === 0) {
        studentTableBody.innerHTML = `<tr><td colspan="3">ยังไม่มีรายชื่อนักเรียน</td></tr>`;
        return;
    }

    students.forEach((s, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${s.name}</td>
            <td>
                <button class="edit-btn" data-id="${s.id}">แก้ไข</button>
                <button class="delete-btn" data-id="${s.id}">ลบ</button>
            </td>
        `;
        studentTableBody.appendChild(tr);
    });

    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            const id = Number(this.dataset.id);
            const students = getStudents();
            const target = students.find(s => s.id === id);
            const newName = prompt("แก้ไขชื่อนักเรียน:", target.name);
            if (newName && newName.trim() !== "") {
                editStudent(id, newName.trim());
                renderStudentTable();
                renderAttendanceTable();
                showFeedback(`แก้ไขชื่อเป็น "${newName.trim()}" เรียบร้อยแล้ว ✓`, "success");
            }
        });
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            const id = Number(this.dataset.id);
            if (confirm("ต้องการลบนักเรียนคนนี้หรือไม่?")) {
                deleteStudent(id);
                renderStudentTable();
                renderAttendanceTable();
                showFeedback("ลบรายชื่อนักเรียนเรียบร้อยแล้ว", "success");
            }
        });
    });
}

addStudentBtn.addEventListener("click", function () {
    const name = newStudentName.value.trim();

    if (name === "") {
        showFeedback("กรุณาพิมพ์ชื่อนักเรียนก่อน", "error");
        return;
    }

    addStudent(name);
    newStudentName.value = "";
    renderStudentTable();
    renderAttendanceTable();

    showFeedback(`เพิ่ม "${name}" เข้าระบบเรียบร้อยแล้ว ✓`, "success");
    newStudentName.focus();
});

newStudentName.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        addStudentBtn.click();
    }
});

function showFeedback(message, type) {
    addFeedback.textContent = message;
    addFeedback.className = `feedback-box show feedback-${type}`;

    clearTimeout(window._feedbackTimeout);
    window._feedbackTimeout = setTimeout(() => {
        addFeedback.classList.remove("show");
    }, 2500);
}

function renderAttendanceTable() {
    const students = getStudents();
    attendanceTableBody.innerHTML = "";

    if (students.length === 0) {
        attendanceTableBody.innerHTML = `<tr><td colspan="4">ยังไม่มีรายชื่อนักเรียน</td></tr>`;
        return;
    }

    students.forEach(s => {
        const record = getStudentStatusToday(s.id);
        const statusLabel = record ? statusText(record.status) : "ยังไม่เช็คชื่อ";
        const timeLabel = record ? record.time : "--:--:--";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${s.name}</td>
            <td><span class="status-badge status-${record ? record.status : 'none'}">${statusLabel}</span></td>
            <td>${timeLabel}</td>
            <td>
                <button class="mark-btn mark-present" data-id="${s.id}" data-name="${s.name}">มา</button>
                <button class="mark-btn mark-late" data-id="${s.id}" data-name="${s.name}">สาย</button>
                <button class="mark-btn mark-absent" data-id="${s.id}" data-name="${s.name}">ขาด</button>
            </td>
        `;
        attendanceTableBody.appendChild(tr);
    });

    document.querySelectorAll(".mark-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            const id = Number(this.dataset.id);
            const name = this.dataset.name;
            let status = "present";
            if (this.classList.contains("mark-late")) status = "late";
            if (this.classList.contains("mark-absent")) status = "absent";

            markAttendance(id, name, status);
            renderAttendanceTable();
        });
    });
}

function statusText(status) {
    if (status === "present") return "มาเรียน";
    if (status === "late") return "มาสาย";
    if (status === "absent") return "ขาดเรียน";
    return "ยังไม่เช็คชื่อ";
}

resetBtn.addEventListener("click", function () {
    const confirmed = confirm("ต้องการล้างข้อมูลทั้งหมดและเริ่มต้นใหม่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้");
    if (confirmed) {
        resetAllData();
        loadSubjectForm();
        renderStudentTable();
        renderAttendanceTable();
        alert("รีเซ็ตข้อมูลเรียบร้อยแล้ว");
    }
});

/* ===== ปุ่มออกจากระบบ ===== */
document.getElementById("logoutBtn").addEventListener("click", function () {
    if (confirm("ต้องการออกจากระบบหรือไม่?")) {
        sessionStorage.removeItem("ontime_logged_in");
        window.location.href = "login.html";
    }
});

loadSubjectForm();
renderStudentTable();
renderAttendanceTable();