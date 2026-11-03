import {loadData} from "./data-loader.js";import {calculateStudentResult} from "./grade-calculator.js";
const $=id=>document.getElementById(id);
try{const {students,subjects,grades}=await loadData();const res=students.map(s=>{const g=grades.find(x=>x.student_id===s.id);return calculateStudentResult(s,subjects,g)});
const max=Math.max(...res.map(x=>x.semesterAverage));$("topStudent").innerHTML=res.filter(x=>x.semesterAverage===max).map(x=>`<p><b>${x.student.id} — ${x.student.name}</b>: ${x.semesterAverage.toFixed(2)}</p>`).join("");
const types=["Giỏi","Khá","Trung bình","Yếu"];$("classification").innerHTML=types.map(t=>`<p>${t}: <b>${res.filter(x=>x.classification===t).length}</b> sinh viên</p>`).join("");
const failed=res.filter(x=>x.subjectResults.some(s=>s.average<5));$("failedStudents").innerHTML=failed.length?failed.map(x=>`<p>${x.student.id} — ${x.student.name} (${x.subjectResults.filter(s=>s.average<5).map(s=>s.subject.name).join(", ")})</p>`).join(""):"<p>Không có sinh viên.</p>";
let html="<thead><tr><th>Môn học</th><th>Điểm TB</th><th>Thấp nhất</th><th>Cao nhất</th></tr></thead><tbody>";
subjects.forEach(s=>{const arr=res.map(x=>x.subjectResults.find(y=>y.subject.id===s.id).average);html+=`<tr><td>${s.name}</td><td>${(arr.reduce((a,b)=>a+b,0)/arr.length).toFixed(2)}</td><td>${Math.min(...arr).toFixed(2)}</td><td>${Math.max(...arr).toFixed(2)}</td></tr>`});$("subjectStats").innerHTML=html+"</tbody>";
}catch(e){document.querySelector("main").insertAdjacentHTML("afterbegin",`<p class="message error">${e.message}</p>`);console.error(e)}
