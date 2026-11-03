import {loadData,saveGrades,resetGrades} from "./data-loader.js";
import {calculateStudentResult,calculateScholarships,formatCurrency,sortByVietnameseName} from "./grade-calculator.js";
const $=id=>document.getElementById(id);
let students=[],subjects=[],grades=[],results=[];
function gradeFor(id){return grades.find(g=>g.student_id===id)}
function compute(){results=students.map(s=>calculateStudentResult(s,subjects,gradeFor(s.id)));calculateScholarships(results);}
function render(list=results){
 const head=$("tableHead"),body=$("studentTableBody");head.innerHTML="";body.innerHTML="";
 const tr=document.createElement("tr");["Mã SV","Họ tên",...subjects.map(s=>s.name),"Điểm TB HK","Xếp loại","Hạng","Nhóm HB","Học bổng",""].forEach(t=>{let th=document.createElement("th");th.textContent=t;tr.append(th)});head.append(tr);
 list.forEach(r=>{const row=document.createElement("tr");const cells=[r.student.id,r.student.name,...r.subjectResults.map(x=>x.average.toFixed(2)),r.semesterAverage.toFixed(2),r.classification,r.rank,r.scholarshipGroup,formatCurrency(r.scholarship)];
 cells.forEach((v,i)=>{const td=document.createElement("td");td.textContent=v;if(i===subjects.length+1)td.className="badge "+r.classification.toLowerCase();row.append(td)});
 const td=document.createElement("td");const btn=document.createElement("button");btn.textContent="Sửa điểm";btn.className="small-button";btn.onclick=()=>openEditor(r);td.append(btn);row.append(td);body.append(row)});
 $("resultCount").textContent=`Hiển thị ${list.length}/${students.length} sinh viên`;
}
function openEditor(r){
 $("modalTitle").textContent=`Chỉnh sửa điểm · ${r.student.name}`;const area=$("studentDetail");area.innerHTML="";
 const form=document.createElement("form");form.className="edit-form";
 r.subjectResults.forEach(x=>{const field=document.createElement("fieldset");const legend=document.createElement("legend");legend.textContent=x.subject.name;field.append(legend);
 ["Chuyên cần","Giữa kỳ","Cuối kỳ"].forEach((label,i)=>{const l=document.createElement("label");l.textContent=label;const inp=document.createElement("input");inp.type="number";inp.min=0;inp.max=10;inp.step=.1;inp.required=true;inp.value=x.scores[i];inp.dataset.subject=x.subject.id;inp.dataset.index=i;l.append(inp);field.append(l)});form.append(field)});
 const save=document.createElement("button");save.textContent="Lưu điểm";save.type="submit";form.append(save);
 form.onsubmit=e=>{e.preventDefault();form.querySelectorAll("input").forEach(inp=>{const val=Number(inp.value);if(val<0||val>10)return;gradeFor(r.student.id).scores[inp.dataset.subject][Number(inp.dataset.index)]=val;});
 saveGrades(grades);compute();render();fillCompare();$("studentModal").hidden=true;};
 area.append(form);$("studentModal").hidden=false;
}
function fillCompare(){const opts=students.map(s=>`<option value="${s.id}">${s.id} — ${s.name}</option>`).join("");$("compare1").innerHTML=opts;$("compare2").innerHTML=opts;if(students.length>1)$("compare2").selectedIndex=1;}
function compare(){const a=results.find(r=>r.student.id===$("compare1").value),b=results.find(r=>r.student.id===$("compare2").value);if(!a||!b)return;
 let html=`<div class="table-wrapper"><table><thead><tr><th>Môn</th><th>${a.student.name}</th><th>${b.student.name}</th></tr></thead><tbody>`;
 a.subjectResults.forEach((x,i)=>html+=`<tr><td>${x.subject.name}</td><td>${x.average.toFixed(2)}</td><td>${b.subjectResults[i].average.toFixed(2)}</td></tr>`);
 html+=`<tr><th>Điểm TB học kỳ</th><th>${a.semesterAverage.toFixed(2)}</th><th>${b.semesterAverage.toFixed(2)}</th></tr></tbody></table></div>`;$("comparison").innerHTML=html;}
async function init(){try{({students,subjects,grades}=await loadData());compute();students.sort(sortByVietnameseName);results.sort((a,b)=>sortByVietnameseName(a.student,b.student));$("totalStudents").textContent=students.length;$("classAverage").textContent=(results.reduce((s,r)=>s+r.semesterAverage,0)/results.length).toFixed(2);$("scholarshipCount").textContent=results.filter(r=>r.scholarship>0).length;render();
 $("searchInput").addEventListener("input",()=>{const q=$("searchInput").value.toLocaleLowerCase("vi");render(results.filter(r=>r.student.name.toLocaleLowerCase("vi").includes(q)||r.student.id.toLowerCase().includes(q)))});fillCompare();$("compareButton").onclick=compare;
 $("closeModal").onclick=()=> $("studentModal").hidden=true;document.querySelector("[data-close-modal]").onclick=()=> $("studentModal").hidden=true;
 $("loadingMessage").hidden=true;
 }catch(e){$("loadingMessage").hidden=true;$("errorMessage").hidden=false;$("errorMessage").textContent=e.message;console.error(e)}}
init();
