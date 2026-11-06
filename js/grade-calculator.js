export const WEIGHTS = { attendance: 0.1, midterm: 0.4, final: 0.5 };
export function calculateSubjectAverage(scores) {
  if (!Array.isArray(scores) || scores.length < 3) return 0;
  return scores[0]*WEIGHTS.attendance + scores[1]*WEIGHTS.midterm + scores[2]*WEIGHTS.final;
}
export function calculateStudentResult(student, subjects, gradeRecord) {
  const subjectResults = subjects.map(subject => {
    const scores = gradeRecord?.scores?.[subject.id] || [0,0,0];
    return { subject, scores, average: calculateSubjectAverage(scores) };
  });
  const semesterAverage = subjectResults.reduce((sum, x)=>sum+x.average,0) / (subjectResults.length || 1);
  let classification = semesterAverage >= 8.5 ? "Giỏi" : semesterAverage >= 7 ? "Khá" : semesterAverage >= 5 ? "Trung bình" : "Yếu";
  return { student, subjectResults, semesterAverage, classification };
}
export function calculateScholarships(results) {
  const sorted = [...results].sort((a,b)=>b.semesterAverage-a.semesterAverage || a.student.id.localeCompare(b.student.id,"vi"));
  const n=sorted.length, c10=Math.ceil(n*.1), c30=Math.ceil(n*.3), c50=Math.ceil(n*.5);
  const groups=[
    {name:"Top 10%", start:0, end:c10, fund:40000000},
    {name:"Top 30%", start:c10, end:c30, fund:40000000},
    {name:"Top 50%", start:c30, end:c50, fund:20000000}
  ];
  sorted.forEach((r,i)=>{r.rank=i+1;r.scholarshipGroup="Không nhận";r.scholarship=0;});
  groups.forEach(g=>{
    const members=sorted.slice(g.start,g.end);
    if(!members.length)return;
    const base=Math.floor((g.fund/members.length)/1000)*1000;
    let remainder=g.fund-base*members.length;
    members.forEach((r,i)=>{r.scholarshipGroup=g.name;r.scholarship=base+(remainder>=1000?1000:0);remainder-=remainder>=1000?1000:0;});
  });
  return sorted;
}
export const formatCurrency = value => new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND",maximumFractionDigits:0}).format(value);
export function sortByVietnameseName(a,b) {
  const collator=new Intl.Collator("vi",{sensitivity:"base"});
  const parts=n=>n.trim().split(/\s+/);
  const pa=parts(a.name), pb=parts(b.name);
  const givenA=pa.pop()||"", givenB=pb.pop()||"";
  return collator.compare(givenA,givenB)||collator.compare(pa.join(" "),pb.join(" "))||a.id.localeCompare(b.id);
}
