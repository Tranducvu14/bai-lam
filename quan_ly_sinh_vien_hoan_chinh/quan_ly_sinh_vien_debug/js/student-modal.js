
import {
    calculateStudentResult,
    formatCurrency
} from "./grade-calculator.js";

export function setupStudentModal(students, subjects, grades) {
    const modal = document.getElementById("studentModal");
    const detail = document.getElementById("studentDetail");
    const tableBody = document.getElementById("studentTableBody");

    function closeModal() {
        modal.hidden = true;
    }

    tableBody.addEventListener("click", event => {
        const button = event.target.closest("[data-student-id]");

        if (!button) return;

        const student = students.find(
            item => item.id === button.dataset.studentId
        );

        const grade = grades.find(
            item => item.student_id === button.dataset.studentId
        );

        if (!student || !grade) return;

        const result = calculateStudentResult(grade, subjects);

        detail.innerHTML = `
            <div class="student-info">
                <p><strong>Mã sinh viên:</strong> ${student.id}</p>
                <p><strong>Họ và tên:</strong> ${student.name}</p>
                <p><strong>Lớp:</strong> ${student.class}</p>
                <p><strong>Email:</strong> ${student.email}</p>
            </div>

            <h3>Chi tiết điểm các môn</h3>

            <div class="table-wrapper">
                <table class="detail-table">
                <thead>
                    <tr>
                    <th>Môn học</th>
                    <th>Chuyên cần</th>
                    <th>Giữa kỳ</th>
                    <th>Cuối kỳ</th>
                    <th>Điểm TB</th>
                    </tr>
                </thead>
                <tbody>
                    ${result.subjectResults.map(item => `
                    <tr>
                        <td>${item.subjectName}</td>
                        <td>${item.scores[0].toFixed(1)}</td>
                        <td>${item.scores[1].toFixed(1)}</td>
                        <td>${item.scores[2].toFixed(1)}</td>
                        <td>${item.average.toFixed(2)}</td>
                    </tr>
                    `).join("")}
                </tbody>
                </table>
            </div>

            <div class="result-summary">
                <p>
                <strong>Điểm trung bình học kỳ:</strong>
                ${result.average.toFixed(2)}
                </p>
                <p>
                <strong>Xếp loại:</strong>
                ${result.classification}
                </p>
                <p>
                <strong>Học bổng:</strong>
                ${formatCurrency(result.scholarship)}
                </p>
            </div>
    `;

        modal.hidden = false;
    });

    document.getElementById("closeModal")
        .addEventListener("click", closeModal);

    modal.addEventListener("click", event => {
        if (event.target.hasAttribute("data-close-modal")) {
            closeModal();
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !modal.hidden) {
            closeModal();
        }
    });
}
