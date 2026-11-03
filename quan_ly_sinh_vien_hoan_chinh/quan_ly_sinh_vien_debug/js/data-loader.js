export async function loadData() {
  const base = "./data/";
  const [studentsR, subjectsR, gradesR] = await Promise.all([
    fetch(base + "students.json"), fetch(base + "subjects.json"), fetch(base + "grades.json")
  ]);
  if (![studentsR, subjectsR, gradesR].every(r => r.ok)) throw new Error("Không tải được JSON. Hãy chạy bằng Live Server và kiểm tra thư mục data.");
  const [students, subjects, originalGrades] = await Promise.all([studentsR.json(), subjectsR.json(), gradesR.json()]);
  let grades = originalGrades;
  try {
    const saved = localStorage.getItem("gradeManagerGrades");
    if (saved) grades = JSON.parse(saved);
  } catch (e) { console.warn("Không đọc được điểm đã lưu", e); }
  return { students, subjects, grades, originalGrades };
}
export function saveGrades(grades) {
  localStorage.setItem("gradeManagerGrades", JSON.stringify(grades));
}
export function resetGrades() { localStorage.removeItem("gradeManagerGrades"); }
