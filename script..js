initData();

/* ===== อ้างอิง element ===== */
const subjectForm = document.getElementById("subjectForm");
const fSubjectName = document.getElementById("fSubjectName");
const fDay = document.getElementById("fDay");
const fPeriod = document.getElementById("fPeriod");
const fTime = document.getElementById("fTime");

const newStudentName = document.getElementById("newStudentName");
const addStudentBtn = document.getElementById("addStudentBtn");
const studentTableBody = document.getElementById("studentTableBody");
const attendanceTableBody = document.getElementById("attendanceTableBody");
const resetBtn = document.getElementById("resetBtn");

/* ===== โหลดข้อมูลวิชาลงฟอร์ม ===== */
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

/* ===== แสดงรายชื่อนักเรียน (สำหรับจัดการชื่อ) ===== */
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
            }
        });
    });
}

/* ===== เพิ่มนักเรียนใหม่ ===== */
addStudentBtn.addEventListener("click", function () {
    const name = newStudentName.value.trim();
    if (name === "") {
        alert("กรุณาพิมพ์ชื่อนักเรียนก่อน");
        return;
    }
    addStudent(name);
    newStudentName.value = "";
    renderStudentTable();
    renderAttendanceTable();
});

// กด Enter ในช่องกรอกชื่อ ก็เพิ่มนักเรียนได้เลย
newStudentName.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        addStudentBtn.click();
    }
});

/* ===== ตารางเช็คชื่อวันนี้ (ครูกดสถานะเอง) ===== */
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

/* ===== รีเซ็ตข้อมูลทั้งหมด ===== */
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

/* ===== เริ่มต้นแสดงผล ===== */
loadSubjectForm();
renderStudentTable();
renderAttendanceTable();