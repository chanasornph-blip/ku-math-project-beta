// ⚠️ Web App URL เชื่อมต่อ Google Apps Script
const GAS_API_URL = "https://script.google.com/a/macros/ku.th/s/AKfycbxzLRLU8UQCFDElOeV-fjNrExLBYYhkHNkcWcFQlS2MhxB8lseajX__QcAqIq3cJAlK/exec";

function normalizeCourseId(id) {
  if (!id) return "";
  let clean = id.toString().trim();
  if (clean.length === 7) clean = "0" + clean;
  return clean;
}

const COURSE_DATABASE = [
  // --- หมวดวิชาศาสตร์แห่งแผ่นดิน (2 หน่วยกิต) ---
  { id: "01999111", name: "ศาสตร์แห่งแผ่นดิน", credits: 2, prereq: [], coreq: [], offered: [1, 2, 3], offeredStr: "เปิดทุกเทอม", recSem: 1, type: "land", gradeType: "pass_fail", difficulty: "ง่าย", tags: ["onsite", "work"] },

  // --- 2.1 วิชาแกน (26 หน่วยกิต) ---
  { id: "01417111", name: "แคลคูลัส I", credits: 3, prereq: [], coreq: [], offered: [1, 2, 3], offeredStr: "เทอม 1, เทอม 2 & Summer", recSem: 1, type: "core" },
  { id: "01424111", name: "หลักชีววิทยา", credits: 3, prereq: [], coreq: [], offered: [1, 2, 3], offeredStr: "เทอม 1, เทอม 2 & Summer", recSem: 1, type: "core", isFlexible: true },
  { id: "01424112", name: "ชีววิทยาภาคปฏิบัติการ", credits: 1, prereq: [], coreq: ["01424111"], offered: [1, 2, 3], offeredStr: "เทอม 1, เทอม 2 & Summer", recSem: 1, type: "core", isFlexible: true },
  { id: "01420117", name: "ฟิสิกส์พื้นฐาน I", credits: 2, prereq: [], coreq: [], offered: [1, 2, 3], offeredStr: "เทอม 1, เทอม 2 & Summer", recSem: 1, type: "core", isFlexible: true },
  
  { id: "01417112", name: "แคลคูลัส II", credits: 3, prereq: ["01417111"], coreq: [], offered: [1, 2, 3], offeredStr: "เทอม 1, เทอม 2 & Summer", recSem: 2, type: "core" },
  { id: "01420118", name: "ฟิสิกส์พื้นฐาน II", credits: 2, prereq: ["01420117"], coreq: [], offered: [1, 2, 3], offeredStr: "เทอม 1, เทอม 2 & Summer", recSem: 2, type: "core", isFlexible: true },
  { id: "01420113", name: "ปฏิบัติการฟิสิกส์ I", credits: 1, prereq: [], coreq: ["01420117"], offered: [1, 2, 3], offeredStr: "เทอม 1, เทอม 2 & Summer", recSem: 2, type: "core", isFlexible: true },
  
  { id: "01417211", name: "แคลคูลัส III", credits: 3, prereq: ["01417112"], coreq: [], offered: [1, 2, 3], offeredStr: "เทอม 1, เทอม 2 & Summer", recSem: 3, type: "core" },
  { id: "01422111", name: "หลักสถิติ", credits: 3, prereq: [], coreq: [], offered: [1, 2, 3], offeredStr: "เทอม 1, เทอม 2 & Summer", recSem: 3, type: "core" },
  { id: "01420114", name: "ปฏิบัติการฟิสิกส์ II", credits: 1, prereq: [], coreq: ["01420118"], offered: [1, 2, 3], offeredStr: "เทอม 1, เทอม 2 & Summer", recSem: 3, type: "core", isFlexible: true },

  { id: "01403111", name: "เคมีทั่วไป", credits: 3, prereq: [], coreq: [], offered: [1, 2, 3], offeredStr: "เทอม 1, เทอม 2 & Summer", recSem: 4, type: "core", isFlexible: true },
  { id: "01403112", name: "ปฏิบัติการเคมีทั่วไป", credits: 1, prereq: [], coreq: ["01403111"], offered: [1, 2, 3], offeredStr: "เทอม 1, เทอม 2 & Summer", recSem: 4, type: "core", isFlexible: true },

  // --- 2.2 วิชาเฉพาะบังคับ (42 หน่วยกิต) ---
  { id: "01418111", name: "วิทยาการคอมพิวเตอร์เบื้องต้น", credits: 2, prereq: [], coreq: [], offered: [1, 2], offeredStr: "ภาคต้น & ภาคปลาย", recSem: 1, type: "mandatory", isFlexible: true },
  { id: "01418112", name: "แนวคิดการโปรแกรมเบื้องต้น", credits: 3, prereq: ["01418111"], coreq: [], offered: [1, 2], offeredStr: "ภาคต้น & ภาคปลาย", recSem: 2, type: "mandatory", isFlexible: true },
  { id: "01417231", name: "หลักคณิตศาสตร์", credits: 3, prereq: [], coreq: [], offered: [2], offeredStr: "ภาคปลาย (เทอม 2)", recSem: 2, type: "mandatory" },
  
  { id: "01417212", name: "แคลคูลัส IV", credits: 3, prereq: ["01417211"], coreq: [], offered: [1], offeredStr: "ภาคต้น (เทอม 1)", recSem: 3, type: "mandatory" },
  { id: "01417271", name: "วิยุตคณิตเบื้องต้น", credits: 3, prereq: [], coreq: [], offered: [1], offeredStr: "ภาคต้น (เทอม 1)", recSem: 3, type: "mandatory" },
  
  { id: "01417222", name: "พีชคณิตเชิงเส้น I", credits: 3, prereq: ["01417231"], coreq: [], offered: [2], offeredStr: "ภาคปลาย (เทอม 2)", recSem: 4, type: "mandatory" },
  { id: "01417242", name: "สมการเชิงอนุพันธ์ I", credits: 3, prereq: ["01417112"], coreq: [], offered: [2], offeredStr: "ภาคปลาย (เทอม 2)", recSem: 4, type: "mandatory" },
  { id: "01417321", name: "พีชคณิตนามธรรม I", credits: 3, prereq: ["01417231"], coreq: [], offered: [2], offeredStr: "ภาคปลาย (เทอม 2)", recSem: 4, type: "mandatory" },
  { id: "01417343", name: "การวิเคราะห์เชิงตัวเลข I", credits: 3, prereq: ["01417112"], coreq: [], offered: [2], offeredStr: "ภาคปลาย (เทอม 2)", recSem: 4, type: "mandatory" },
  
  { id: "01417311", name: "การวิเคราะห์เชิงจริง I", credits: 3, prereq: ["01417211", "01417231"], coreq: [], offered: [1], offeredStr: "ภาคต้น (เทอม 1)", recSem: 5, type: "mandatory" },
  { id: "01422341", name: "สถิติเชิงคณิตศาสตร์ I", credits: 3, prereq: ["01422111"], coreq: [], offered: [1], offeredStr: "ภาคต้น (เทอม 1)", recSem: 5, type: "mandatory" },
  
  { id: "01417312", name: "การวิเคราะห์เชิงซ้อน I", credits: 3, prereq: ["01417211", "01417231"], coreq: [], offered: [2], offeredStr: "ภาคปลาย (เทอม 2)", recSem: 6, type: "mandatory" },
  { id: "01417342", name: "สมการเชิงอนุพันธ์ II", credits: 3, prereq: ["01417242"], coreq: [], offered: [2], offeredStr: "ภาคปลาย (เทอม 2)", recSem: 6, type: "mandatory" },
  
  { id: "01417497", name: "สัมมนา", credits: 1, prereq: [], coreq: [], offered: [1], offeredStr: "ภาคต้น (เทอม 1)", recSem: 7, type: "mandatory" },
  { id: "01417499", name: "โครงงานคณิตศาสตร์", credits: 3, prereq: ["01417497"], coreq: [], offered: [2], offeredStr: "ภาคปลาย (เทอม 2)", recSem: 8, type: "mandatory" },

  // --- หมวดภาษาอังกฤษ (ENG 1 - ENG 4) ---
  { id: "01355101", name: "ภาษาอังกฤษเพื่อการสื่อสาร 1 (ENG 1)", credits: 3, prereq: [], coreq: [], offered: [1, 2], offeredStr: "ภาคต้น & ภาคปลาย", recSem: 1, type: "eng", subType: "eng1", engLevel: 1 },
  { id: "01355102", name: "ภาษาอังกฤษเพื่อการสื่อสาร 2 (ENG 2)", credits: 3, prereq: ["01355101"], coreq: [], offered: [1, 2], offeredStr: "ภาคต้น & ภาคปลาย", recSem: 2, type: "eng", subType: "eng2", engLevel: 2 },
  
  { id: "01355201", name: "การอ่านภาษาอังกฤษเบื้องต้น (ENG 3)", credits: 3, prereq: ["01355102"], coreq: [], offered: [1, 2], offeredStr: "ภาคต้น & ภาคปลาย", recSem: 3, type: "eng", subType: "eng_adv", engLevel: 3 },
  { id: "01355202", name: "การเขียนภาษาอังกฤษเบื้องต้น [กลุ่ม ENG 4]", credits: 3, prereq: ["01355102"], coreq: [], offered: [1, 2], offeredStr: "ภาคต้น & ภาคปลาย", recSem: 4, type: "eng", subType: "eng_adv", engLevel: 3 },
  { id: "01355203", name: "โครงสร้างภาษาอังกฤษเบื้องต้น [กลุ่ม ENG 4]", credits: 3, prereq: ["01355102"], coreq: [], offered: [1, 2], offeredStr: "ภาคต้น & ภาคปลาย", recSem: 4, type: "eng", subType: "eng_adv", engLevel: 3 },
  { id: "01355208", name: "ภาษาอังกฤษจากเพลง [กลุ่ม ENG 4]", credits: 3, prereq: ["01355102"], coreq: [], offered: [1, 2], offeredStr: "ภาคต้น & ภาคปลาย", recSem: 4, type: "eng", subType: "eng_adv", engLevel: 3 },
  { id: "01355209", name: "ภาษาอังกฤษเพื่อการสื่อสารในงานอาชีพ [กลุ่ม ENG 4]", credits: 3, prereq: ["01355102"], coreq: [], offered: [1, 2], offeredStr: "ภาคต้น & ภาคปลาย", recSem: 4, type: "eng", subType: "eng_adv", engLevel: 3 },
  { id: "01355308", name: "ภาษาอังกฤษผ่านภาพยนตร์ [กลุ่ม ENG 4]", credits: 3, prereq: ["01355102"], coreq: [], offered: [1, 2], offeredStr: "ภาคต้น & ภาคปลาย", recSem: 4, type: "eng", subType: "eng_adv", engLevel: 3 },
  { id: "01355107", name: "ทักษะการเขียนภาษาอังกฤษที่จำเป็น [กลุ่ม ENG 4]", credits: 3, prereq: ["01355101"], coreq: [], offered: [1, 2], offeredStr: "ภาคต้น & ภาคปลาย", recSem: 4, type: "eng", subType: "eng_adv", engLevel: 3 },

  // --- 2.3.1 (1) วิชาเลือก Pure Math ---
  { id: "01417325", name: "ทฤษฎีจำนวนเบื้องต้น", credits: 3, prereq: ["01417231"], coreq: [], offered: [1], offeredStr: "ภาคต้น (เทอม 1)", recSem: 5, type: "pure", difficulty: "ง่าย" },
  { id: "01417472", name: "ทฤษฎีกราฟ", credits: 3, prereq: ["01417231"], coreq: [], offered: [1], offeredStr: "ภาคต้น (เทอม 1)", recSem: 5, type: "pure", difficulty: "ง่าย" },
  { id: "01417331", name: "ทฤษฎีเซตเบื้องต้น", credits: 3, prereq: ["01417231"], coreq: [], offered: [1], offeredStr: "ภาคต้น (เทอม 1)", recSem: 5, type: "pure", difficulty: "ปานกลาง" },
  { id: "01417471", name: "คอมบิเนทอริกส์", credits: 3, prereq: ["01417271"], coreq: [], offered: [2], offeredStr: "ภาคปลาย (เทอม 2)", recSem: 6, type: "pure", difficulty: "ปานกลาง" },
  { id: "01417424", name: "ทฤษฎีกรุปเบื้องต้น", credits: 3, prereq: ["01417321"], coreq: [], offered: [2], offeredStr: "ภาคปลาย (เทอม 2)", recSem: 6, type: "pure", difficulty: "ปานกลาง" },
  { id: "01417426", name: "ทฤษฎีเมทริกซ์", credits: 3, prereq: ["01417222"], coreq: [], offered: [2], offeredStr: "ภาคปลาย (เทอม 2)", recSem: 6, type: "pure", difficulty: "ปานกลาง" },
  { id: "01417413", name: "โทโพโลยีเบื้องต้น", credits: 3, prereq: ["01417311"], coreq: [], offered: [2], offeredStr: "ภาคปลาย (เทอม 2)", recSem: 6, type: "pure", difficulty: "ยาก" },
  { id: "01417322", name: "พีชคณิตนามธรรม II", credits: 3, prereq: ["01417321"], coreq: [], offered: [1], offeredStr: "ภาคต้น (เทอม 1)", recSem: 7, type: "pure", difficulty: "ยาก" },
  { id: "01417411", name: "การวิเคราะห์เชิงจริง II", credits: 3, prereq: ["01417311"], coreq: [], offered: [2], offeredStr: "ภาคปลาย (เทอม 2)", recSem: 6, type: "pure", difficulty: "ยาก" },
  { id: "01417412", name: "การวิเคราะห์เชิงซ้อน II", credits: 3, prereq: ["01417312"], coreq: [], offered: [1], offeredStr: "ภาคต้น (เทอม 1)", recSem: 7, type: "pure", difficulty: "ยาก" },

  // --- 2.3.1 (2) วิชาเลือก Applied Math ---
  { id: "01417281", name: "คณิตศาสตร์สำหรับการลงทุน", credits: 3, prereq: ["01417111"], coreq: [], offered: [1, 2], offeredStr: "ภาคต้น & ภาคปลาย", recSem: 3, type: "applied", isLevel200: true, difficulty: "ง่าย" },
  { id: "01417481", name: "คณิตศาสตร์การเงิน I", credits: 3, prereq: ["01417211"], coreq: [], offered: [1], offeredStr: "ภาคต้น (เทอม 1)", recSem: 5, type: "applied", difficulty: "ง่าย" },
  { id: "01417361", name: "โปรแกรมสำเร็จรูปทางคณิตศาสตร์", credits: 3, prereq: ["01418111"], coreq: [], offered: [1], offeredStr: "ภาคต้น (เทอม 1)", recSem: 5, type: "applied", difficulty: "ง่าย" },
  { id: "01417482", name: "คณิตศาสตร์การเงิน II", credits: 3, prereq: ["01417481"], coreq: [], offered: [2], offeredStr: "ภาคปลาย (เทอม 2)", recSem: 6, type: "applied", difficulty: "ปานกลาง" },
  { id: "01417485", name: "การเพิ่มประสิทธิภาพเชิงตัวเลข", credits: 3, prereq: ["01417222", "01417343"], coreq: [], offered: [2], offeredStr: "ภาคปลาย (เทอม 2)", recSem: 6, type: "applied", difficulty: "ปานกลาง" },
  { id: "01417441", name: "สมการอนุพันธ์ย่อยเบื้องต้น", credits: 3, prereq: ["01417242"], coreq: [], offered: [2], offeredStr: "ภาคปลาย (เทอม 2)", recSem: 6, type: "applied", difficulty: "ปานกลาง" },
  { id: "01417443", name: "สมการปริพันธ์เบื้องต้น", credits: 3, prereq: ["01417242"], coreq: [], offered: [2], offeredStr: "ภาคปลาย (เทอม 2)", recSem: 6, type: "applied", difficulty: "ปานกลาง" },
  { id: "01417381", name: "กำหนดการเชิงเส้น I", credits: 3, prereq: ["01417222"], coreq: [], offered: [2], offeredStr: "ภาคปลาย (เทอม 2)", recSem: 6, type: "applied", difficulty: "ยาก" },
  { id: "01417444", name: "การสร้างตัวแบบเชิงคณิตศาสตร์เบื้องต้น", credits: 3, prereq: ["01417242"], coreq: [], offered: [2], offeredStr: "ภาคปลาย (เทอม 2)", recSem: 6, type: "applied", difficulty: "ยาก" },
  { id: "01417382", name: "กำหนดการเชิงเส้น II", credits: 3, prereq: ["01417381"], coreq: [], offered: [1], offeredStr: "ภาคต้น (เทอม 1)", recSem: 7, type: "applied", difficulty: "ยาก" },

  // --- หมวดวิชาศึกษาทั่วไป (GE) แยก 5 สาระ ---
  { id: "01173151", name: "เอดส์ศึกษา", credits: 2, prereq: [], coreq: [], offered: [1, 2, 3], offeredStr: "เปิดทุกเทอม", recSem: 1, type: "ge", subType: "ge_wellness", subTypeName: "สาระอยู่ดีมีสุข", difficulty: "ง่าย", tags: ["onsite", "work"] },
  { id: "01453102", name: "กฎหมายในชีวิตประจำวัน", credits: 3, prereq: [], coreq: [], offered: [1, 2, 3], offeredStr: "เปิดทุกเทอม", recSem: 1, type: "ge", subType: "ge_wellness", subTypeName: "สาระอยู่ดีมีสุข", difficulty: "ปานกลาง", tags: ["onsite", "hybrid"] },
  { id: "01999012", name: "สุขภาพเพื่อชีวิต", credits: 3, prereq: [], coreq: [], offered: [1, 2, 3], offeredStr: "เปิดทุกเทอม", recSem: 1, type: "ge", subType: "ge_wellness", subTypeName: "สาระอยู่ดีมีสุข", difficulty: "ง่าย", tags: ["onsite", "work"] },
  { id: "01999033", name: "ศิลปะการดำเนินชีวิต", credits: 3, prereq: [], coreq: [], offered: [1, 2, 3], offeredStr: "เปิดทุกเทอม", recSem: 1, type: "ge", subType: "ge_wellness", subTypeName: "สาระอยู่ดีมีสุข", difficulty: "ง่าย", tags: ["onsite", "work"] },

  { id: "01177141", name: "การแสวงหาความรู้", credits: 3, prereq: [], coreq: [], offered: [1, 2, 3], offeredStr: "เปิดทุกเทอม", recSem: 1, type: "ge", subType: "ge_entrepreneur", subTypeName: "สาระศาสตร์แห่งผู้ประกอบการ", difficulty: "ง่าย", tags: ["onsite", "work"] },
  { id: "01390104", name: "การพัฒนาบุคลิกภาพเพื่อการเป็นผู้ประกอบการสมัยใหม่", credits: 3, prereq: [], coreq: [], offered: [1, 2, 3], offeredStr: "เปิดทุกเทอม", recSem: 1, type: "ge", subType: "ge_entrepreneur", subTypeName: "สาระศาสตร์แห่งผู้ประกอบการ", difficulty: "ง่าย", tags: ["onsite", "hybrid"] },
  { id: "01254101", name: "สวัสดีซีฟู้ด", credits: 3, prereq: [], coreq: [], offered: [1, 2, 3], offeredStr: "เปิดทุกเทอม", recSem: 1, type: "ge", subType: "ge_entrepreneur", subTypeName: "สาระศาสตร์แห่งผู้ประกอบการ", difficulty: "ง่าย", tags: ["onsite", "work"] },

  { id: "01001317", name: "พระมหากษัตริย์และผู้นำประเทศกับการพัฒนาภาคการเกษตร", credits: 3, prereq: [], coreq: [], offered: [1, 2, 3], offeredStr: "เปิดทุกเทอม", recSem: 1, type: "ge", subType: "ge_citizen", subTypeName: "สาระพลเมืองไทยและพลเมืองโลก", difficulty: "ปานกลาง", tags: ["onsite", "hybrid"] },
  { id: "01015202", name: "เกษตรวิถีไทย", credits: 3, prereq: [], coreq: [], offered: [1, 2, 3], offeredStr: "เปิดทุกเทอม", recSem: 1, type: "ge", subType: "ge_citizen", subTypeName: "สาระพลเมืองไทยและพลเมืองโลก", difficulty: "ปานกลาง", tags: ["online", "work"] },

  { id: "01999021", name: "ภาษาไทยเพื่อการสื่อสาร", credits: 3, prereq: [], coreq: [], offered: [1, 2, 3], offeredStr: "เปิดทุกเทอม", recSem: 1, type: "ge", subType: "ge_language", subTypeName: "สาระภาษากับการสื่อสาร", difficulty: "ปานกลาง", tags: ["onsite", "hybrid"] },
  { id: "01371111", name: "สื่อสารสนเทศเพื่อการเรียนรู้", credits: 1, prereq: [], coreq: [], offered: [1, 2, 3], offeredStr: "เปิดทุกเทอม", recSem: 1, type: "ge", subType: "ge_language", subTypeName: "สาระภาษากับการสื่อสาร", difficulty: "ง่าย", tags: ["onsite", "hybrid"] },

  { id: "01007101", name: "พืชเพื่อการสร้างคุณค่าในชีวิต", credits: 3, prereq: [], coreq: [], offered: [1, 2, 3], offeredStr: "เปิดทุกเทอม", recSem: 1, type: "ge", subType: "ge_aesthetic", subTypeName: "สาระสุนทรียศาสตร์", difficulty: "ง่าย", tags: ["online", "work"] },
  { id: "01009102", name: "ทรัพยากรการเกษตรและสิ่งแวดล้อม", credits: 3, prereq: [], coreq: [], offered: [1, 2, 3], offeredStr: "เปิดทุกเทอม", recSem: 1, type: "ge", subType: "ge_aesthetic", subTypeName: "สาระสุนทรียศาสตร์", difficulty: "ง่าย", tags: ["onsite", "hybrid"] },
  { id: "01999035", name: "วัฒนธรรมดนตรีกับชีวิต", credits: 3, prereq: [], coreq: [], offered: [1, 2, 3], offeredStr: "เปิดทุกเทอม", recSem: 1, type: "ge", subType: "ge_aesthetic", subTypeName: "สาระสุนทรียศาสตร์", difficulty: "ง่าย", tags: ["online", "work"] },
  { id: "01416101", name: "พันธุศาสตร์ในสื่อ", credits: 3, prereq: [], coreq: [], offered: [1, 2, 3], offeredStr: "เปิดทุกเทอม", recSem: 1, type: "ge", subType: "ge_aesthetic", subTypeName: "สาระสุนทรียศาสตร์", difficulty: "ง่าย", tags: ["onsite", "work"] },
  { id: "01255101", name: "มนุษย์กับทะเล", credits: 3, prereq: [], coreq: [], offered: [1, 2, 3], offeredStr: "เปิดทุกเทอม", recSem: 1, type: "ge", subType: "ge_aesthetic", subTypeName: "สาระสุนทรียศาสตร์", difficulty: "ปานกลาง", tags: ["onsite", "hybrid"] }
];

let userGrades = {};
let termCustomCourses = {};
let courseShiftOverrides = {}; 
let enabledSummerTerms = {};
let expectedCourseGrades = {};
let maxExtraYears = 0;
let allReviews = [];
let maxUnlockedStep = 1;
let termGeneratedSchedule = {};

const GRADE_POINTS = { "A": 4.0, "B+": 3.5, "B": 3.0, "C+": 2.5, "C": 2.0, "D+": 1.5, "D": 1.0, "F": 0.0 };

function initApp() {
  onCurriculumChange();
  onUserYearChange();
  checkFreshmanLock();
  onMainCategoryChange();
  populateReviewCourseDropdown();
  renderReviews();
  setTimeout(loadFromGoogleSheet, 300);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

function toggleAccordion(accId) {
  const contents = document.querySelectorAll(".accordion-content");
  const headers = document.querySelectorAll(".accordion-header");
  const target = document.getElementById(accId);
  if (!target) return;
  const isOpen = target.classList.contains("open");

  contents.forEach(c => c.classList.remove("open"));
  headers.forEach(h => h.classList.remove("active"));

  if (!isOpen) {
    target.classList.add("open");
    if (target.previousElementSibling) {
      target.previousElementSibling.classList.add("active");
    }
  }
}

function switchMainTab(tabName) {
  const t1 = document.getElementById("main-tab-1");
  const t2 = document.getElementById("main-tab-2");
  const s1 = document.getElementById("section-planner");
  const s2 = document.getElementById("section-review");

  if (t1) t1.classList.remove("active");
  if (t2) t2.classList.remove("active");
  if (s1) s1.classList.remove("active");
  if (s2) s2.classList.remove("active");

  if (tabName === 'planner') {
    if (t1) t1.classList.add("active");
    if (s1) s1.classList.add("active");
  } else {
    if (t2) t2.classList.add("active");
    if (s2) s2.classList.add("active");
    renderReviews();
  }
}

function onCurriculumOrEngChange() {
  userGrades = {};
  termCustomCourses = {};
  courseShiftOverrides = {};
  enabledSummerTerms = {};
  expectedCourseGrades = {};
  maxExtraYears = 0;
  termGeneratedSchedule = {};
  renderAddedCoursesList();

  const curYearEl = document.getElementById("curriculum-year-select");
  const curYear = curYearEl ? curYearEl.value : "2565";
  const engBox = document.getElementById("eng-curriculum-2565-box");
  if (engBox) engBox.style.display = (curYear === "2569") ? "none" : "block";

  filterCourseDropdown();
  resetDownstreamSteps();
}

function onCurriculumChange() {
  onCurriculumOrEngChange();
}

function onUserYearChange() {
  const yearSelect = document.getElementById("user-year-select");
  const semSelect = document.getElementById("user-semester-select");
  if (!yearSelect || !semSelect) return;

  const y = parseInt(yearSelect.value) || 1;

  if (y === 1) {
    semSelect.innerHTML = `
      <option value="0">🌟 ยังไม่เริ่มเรียนสักเทอม (กำลังจะเริ่มปี 1 เทอม 1)</option>
      <option value="1">จบภาคต้น (เทอม 1) ของปี 1 แล้ว</option>
      <option value="2">จบภาคปลาย (เทอม 2) ของปี 1 แล้ว</option>
    `;
  } else {
    semSelect.innerHTML = `
      <option value="0">🌟 ยังไม่เริ่มเรียนเทอมใดของปี ${y} (เพิ่งขึ้นปี ${y} / กำลังเริ่มเทอม 1)</option>
      <option value="1">จบภาคต้น (เทอม 1) ของปี ${y} แล้ว</option>
      <option value="2">จบภาคปลาย (เทอม 2) ของปี ${y} แล้ว</option>
    `;
  }

  checkFreshmanLock();
  resetDownstreamSteps();
}

function checkFreshmanLock() {
  const yearSelect = document.getElementById("user-year-select");
  const semSelect = document.getElementById("user-semester-select");
  const entrySection = document.getElementById("passed-course-entry-section");
  const noticeBox = document.getElementById("freshman-notice-box");

  if (!yearSelect || !semSelect) return;

  const y = parseInt(yearSelect.value) || 1;
  const s = parseInt(semSelect.value) || 0;

  if (y === 1 && s === 0) {
    userGrades = {};
    renderAddedCoursesList();
    if (entrySection) entrySection.style.display = "none";
    if (noticeBox) noticeBox.style.display = "block";
  } else {
    if (entrySection) entrySection.style.display = "block";
    if (noticeBox) noticeBox.style.display = "none";
  }
}

function goToStep(stepNum) {
  if (stepNum > maxUnlockedStep) {
    alert("⚠️ กรุณากรอกข้อมูลและผ่านขั้นตอนก่อนหน้าให้เรียบร้อยก่อนครับ");
    return;
  }

  document.querySelectorAll(".wizard-step").forEach(el => el.classList.remove("active"));
  document.querySelectorAll(".step-node").forEach(el => el.classList.remove("active"));

  const targetStep = document.getElementById(`step-${stepNum}`);
  const targetNode = document.getElementById(`step-node-${stepNum}`);
  if (targetStep) targetStep.classList.add("active");
  if (targetNode) targetNode.classList.add("active");

  if (stepNum === 3) processRecommendations();
}

function unlockStep(stepNum) {
  if (stepNum > maxUnlockedStep) maxUnlockedStep = stepNum;
  const node = document.getElementById(`step-node-${stepNum}`);
  if (node) node.classList.remove("disabled");
}

function completeStep1() {
  unlockStep(2);
  goToStep(2);
}

function completeStep2() {
  unlockStep(3);
  goToStep(3);
}

function resetDownstreamSteps() {
  checkFreshmanLock();
  maxUnlockedStep = 1;
  const n2 = document.getElementById("step-node-2");
  const n3 = document.getElementById("step-node-3");
  if (n2) n2.classList.add("disabled");
  if (n3) n3.classList.add("disabled");
}

function resetDownstreamFromStep2() {
  maxUnlockedStep = 2;
  const n3 = document.getElementById("step-node-3");
  if (n3) n3.classList.add("disabled");
}

function checkGradeType() {
  const courseSelect = document.getElementById("add-course-select");
  const gradeSelect = document.getElementById("add-grade-select");
  if (!courseSelect || !gradeSelect) return;

  const courseId = courseSelect.value;
  const course = COURSE_DATABASE.find(c => c.id === courseId);

  if (course && course.gradeType === "pass_fail") {
    gradeSelect.value = "P";
    gradeSelect.disabled = true;
  } else {
    gradeSelect.disabled = false;
    if (gradeSelect.value === "P") gradeSelect.value = "A";
  }
}

function onMainCategoryChange() {
  const catEl = document.getElementById("add-category-select");
  const cat = catEl ? catEl.value : "core";
  const subGroup = document.getElementById("sub-category-group");
  const otherFields = document.getElementById("step1-other-course-fields");
  const courseSelectBox = document.getElementById("course-select-box");

  if (cat === "ge") {
    if (subGroup) subGroup.style.display = "block";
    if (otherFields) otherFields.style.display = "none";
    if (courseSelectBox) courseSelectBox.style.display = "block";
  } else if (cat === "other") {
    if (subGroup) subGroup.style.display = "none";
    if (otherFields) otherFields.style.display = "block";
    if (courseSelectBox) courseSelectBox.style.display = "none";
  } else {
    if (subGroup) subGroup.style.display = "none";
    if (otherFields) otherFields.style.display = "none";
    if (courseSelectBox) courseSelectBox.style.display = "block";
  }

  filterCourseDropdown();
}

function onOtherCategoryChange() {
  const otherCatEl = document.getElementById("step1-other-category");
  const otherCat = otherCatEl ? otherCatEl.value : "free";
  const otherSubGroup = document.getElementById("step1-other-subcat-group");
  if (otherSubGroup) {
    otherSubGroup.style.display = (otherCat === "ge") ? "block" : "none";
  }
}

function onOtherReviewCategoryChange() {
  const otherCatEl = document.getElementById("other-course-category");
  const otherCat = otherCatEl ? otherCatEl.value : "free";
  const otherSubGroup = document.getElementById("other-course-subcat-group");
  if (otherSubGroup) {
    otherSubGroup.style.display = (otherCat === "ge") ? "block" : "none";
  }
}

function filterCourseDropdown() {
  const catEl = document.getElementById("add-category-select");
  const courseSelect = document.getElementById("add-course-select");
  const curYearEl = document.getElementById("curriculum-year-select");

  if (!catEl || !courseSelect) return;
  const cat = catEl.value;
  const curYear = curYearEl ? curYearEl.value : "2565";

  if (cat === "other") return;

  courseSelect.innerHTML = "";
  let filtered = [];

  if (cat === "ge") {
    const subCatEl = document.getElementById("add-subcategory-select");
    const subCat = subCatEl ? subCatEl.value : "ge_wellness";
    filtered = COURSE_DATABASE.filter(c => c.type === "ge" && c.subType === subCat);
  } else if (cat === "free") {
    filtered = COURSE_DATABASE.filter(c => c.type === "free" || c.type === "ge");
  } else {
    filtered = COURSE_DATABASE.filter(c => c.type === cat);
  }

  if (cat === "eng") {
    if (curYear === "2569") {
      filtered = filtered.filter(c => c.id !== "01355101" && c.id !== "01355102");
    } else {
      const startLevelEl = document.getElementById("eng-start-level");
      const startLevel = startLevelEl ? startLevelEl.value : "ENG1";
      if (startLevel === "ENG2") {
        filtered = filtered.filter(c => c.id !== "01355101");
      } else if (startLevel === "ENG3") {
        filtered = filtered.filter(c => c.id !== "01355101" && c.id !== "01355102");
      }
    }
  }

  if (filtered.length === 0) {
    courseSelect.innerHTML = `<option value="">-- ไม่มีรายวิชาในหมวดนี้ --</option>`;
  } else {
    filtered.forEach(c => {
      courseSelect.innerHTML += `<option value="${c.id}">${c.id} - ${c.name}</option>`;
    });
  }

  checkGradeType();
}

// 🟢 ตรวจสอบ Prerequisite โดยรองรับโครงสร้าง Object หรือ String ของเกรดอย่างปลอดภัย
function checkUnpassedPrereqs(courseId, passedLookup) {
  const course = COURSE_DATABASE.find(c => c.id === courseId);
  if (!course || !course.prereq || course.prereq.length === 0) return [];

  const curYear = document.getElementById("curriculum-year-select") ? document.getElementById("curriculum-year-select").value : "2565";
  const startLevel = document.getElementById("eng-start-level") ? document.getElementById("eng-start-level").value : "ENG1";
  const lookup = passedLookup || userGrades;

  let missingPrereqs = [];
  function tracePrereq(reqId) {
    if (curYear === "2565") {
      if (startLevel === "ENG2" && reqId === "01355101") return;
      if (startLevel === "ENG3" && (reqId === "01355101" || reqId === "01355102")) return;
    } else if (curYear === "2569") {
      if (reqId === "01355101" || reqId === "01355102") return;
    }

    let isPassed = false;
    if (lookup[reqId]) {
      const item = lookup[reqId];
      const g = (typeof item === "object" && item !== null) ? item.grade : item;
      if (g && g !== "F") isPassed = true;
    }

    if (!isPassed) {
      const reqCourse = COURSE_DATABASE.find(c => c.id === reqId);
      const reqName = reqCourse ? reqCourse.name : reqId;
      if (!missingPrereqs.includes(reqName)) missingPrereqs.push(reqName);
      if (reqCourse && reqCourse.prereq) reqCourse.prereq.forEach(subId => tracePrereq(subId));
    }
  }

  course.prereq.forEach(reqId => tracePrereq(reqId));
  return missingPrereqs;
}

// 🟢 รวมวิชาที่ผ่านแล้ว + วิชาที่ถูกจัดอยู่ในแผนของเทอมก่อนหน้า เพื่อปลดล็อกวิชาตัวต่อในเทอมอนาคต
function getCumulativePassedMapBeforeTerm(targetTermKey) {
  const map = { ...userGrades };

  const match = targetTermKey.match(/Y(\d+)S(\d+)/);
  if (!match) return map;
  const targetY = parseInt(match[1]);
  const targetS = parseInt(match[2]);

  for (let y = 1; y <= 6; y++) {
    for (let s = 1; s <= 3; s++) {
      if (y > targetY || (y === targetY && s >= targetS)) return map;
      const tKey = `Y${y}S${s}`;
      const plannedList = termGeneratedSchedule[tKey] || [];
      plannedList.forEach(cid => {
        map[cid] = "P";
      });
    }
  }
  return map;
}

function addCourseToList() {
  const cat = document.getElementById("add-category-select").value;
  const grade = document.getElementById("add-grade-select").value;
  const failedBefore = document.getElementById("add-failed-before") ? document.getElementById("add-failed-before").checked : false;

  let targetId = "";
  if (cat === "other") {
    const code = normalizeCourseId(document.getElementById("step1-other-code").value.trim());
    const name = document.getElementById("step1-other-name").value.trim();
    const credits = parseInt(document.getElementById("step1-other-credits").value) || 3;
    const itemCat = document.getElementById("step1-other-category").value;
    const itemSubCat = (itemCat === "ge") ? document.getElementById("step1-other-subcategory").value : "";

    if (!code || !name) {
      alert("กรุณากรอกรหัสวิชาและชื่อวิชาให้ครบถ้วน");
      return;
    }

    if (!COURSE_DATABASE.some(c => c.id === code)) {
      COURSE_DATABASE.push({
        id: code,
        name: name,
        credits: credits,
        prereq: [], coreq: [], offered: [1, 2, 3], offeredStr: "วิชาเลือก/เสรี",
        type: itemCat,
        subType: itemSubCat,
        difficulty: "ปานกลาง"
      });
    }

    targetId = code;
    document.getElementById("step1-other-code").value = "";
    document.getElementById("step1-other-name").value = "";
  } else {
    targetId = document.getElementById("add-course-select").value;
    if (!targetId) return;

    const missingPrereqs = checkUnpassedPrereqs(targetId);
    if (missingPrereqs.length > 0) {
      alert(`⚠️ ไม่สามารถบันทึกเกรดวิชานี้ได้!\n\nคุณต้องผ่านวิชาตัวต่อก่อน ได้แก่:\n• ${missingPrereqs.join("\n• ")}`);
      return;
    }
  }

  userGrades[targetId] = {
    grade: grade,
    failedBefore: failedBefore
  };

  if (document.getElementById("add-failed-before")) {
    document.getElementById("add-failed-before").checked = false;
  }

  resetDownstreamSteps();
  renderAddedCoursesList();
}

function removeCourse(courseId) {
  delete userGrades[courseId];
  resetDownstreamSteps();
  renderAddedCoursesList();
}

function renderAddedCoursesList() {
  const container = document.getElementById("added-courses-list");
  const countEl = document.getElementById("added-course-count");
  const keys = Object.keys(userGrades);

  if (countEl) countEl.innerText = keys.length;

  if (keys.length === 0) {
    if (container) container.innerHTML = `<p style="color:#888; padding: 10px;">ยังไม่มีรายวิชาที่เลือก</p>`;
    return;
  }

  let html = "";
  keys.forEach(id => {
    const course = COURSE_DATABASE.find(c => c.id === id);
    const name = course ? course.name : id;
    const item = userGrades[id];
    const grade = typeof item === "object" ? item.grade : item;
    const hasF = typeof item === "object" ? item.failedBefore : false;

    html += `
      <div class="added-item">
        <div>
          <b>${id} ${name}</b>
          <span style="margin-left: 10px; background:#006633; color:white; padding: 2px 8px; border-radius:4px; font-size:0.85rem;">เกรดที่ได้: ${grade}</span>
          ${hasF ? '<span style="margin-left: 6px; background:#fee2e2; color:#b91c1c; padding: 2px 8px; border-radius:4px; font-size:0.82rem; font-weight:bold;">⚠️ เคยติด F ในวิชานี้</span>' : ''}
        </div>
        <button class="del-btn" onclick="removeCourse('${id}')">ลบออก</button>
      </div>`;
  });

  if (container) container.innerHTML = html;
}

function formatGradeLetter(gpa) {
  if (!gpa || gpa <= 0) return "-";
  if (gpa >= 3.75) return "A";
  if (gpa >= 3.25) return "B+";
  if (gpa >= 2.75) return "B";
  if (gpa >= 2.25) return "C+";
  if (gpa >= 1.75) return "C";
  if (gpa >= 1.25) return "D+";
  if (gpa >= 0.75) return "D";
  return "F";
}

function getCourseReviewStats(courseId) {
  const normId = normalizeCourseId(courseId);
  const revs = allReviews.filter(r => normalizeCourseId(r.courseId) === normId);
  
  let easyCount = 0, medCount = 0, hardCount = 0, gpaSum = 0, gpaCount = 0;
  revs.forEach(r => {
    if (r.difficulty && r.difficulty.includes("ง่าย")) easyCount++;
    else if (r.difficulty && r.difficulty.includes("ยาก")) hardCount++;
    else medCount++;

    if (r.gradeGot && GRADE_POINTS[r.gradeGot] !== undefined) {
      gpaSum += GRADE_POINTS[r.gradeGot];
      gpaCount++;
    }
  });

  const revCount = revs.length;
  const avgGPA = gpaCount > 0 ? parseFloat((gpaSum / gpaCount).toFixed(2)) : 0.00;

  let diffLabel = "ปานกลาง";
  if (revCount === 0) {
    const c = COURSE_DATABASE.find(x => x.id === courseId);
    diffLabel = c ? (c.difficulty || "ปานกลาง") : "ปานกลาง";
  } else {
    const scoreAvg = ((easyCount * 1) + (medCount * 2) + (hardCount * 3)) / revCount;
    if (scoreAvg <= 1.66) diffLabel = "ง่าย";
    else if (scoreAvg >= 2.34) diffLabel = "ยาก";
    else diffLabel = "ปานกลาง";
  }

  return { revCount, easyCount, medCount, hardCount, avgGPA, diffLabel };
}

function getCourseDifficultyLabel(course) {
  return getCourseReviewStats(course.id).diffLabel;
}

function getCourseReviewGPA(courseId) {
  return getCourseReviewStats(courseId).avgGPA;
}

function getCoursePreferenceScore(courseId) {
  const prefOnline = document.getElementById("pref-online-rating") ? document.getElementById("pref-online-rating").value : "ALL";
  const prefExam = document.getElementById("pref-exam-rating") ? document.getElementById("pref-exam-rating").value : "ALL";

  const normId = normalizeCourseId(courseId);
  const reviews = allReviews.filter(r => normalizeCourseId(r.courseId) === normId);
  if (reviews.length === 0) return { score: 0, matchRate: 0 };

  let totalMatchPoints = 0;
  let criteriaCount = 0;

  if (prefOnline !== "ALL") criteriaCount++;
  if (prefExam !== "ALL") criteriaCount++;

  if (criteriaCount === 0) return { score: reviews.length, matchRate: 0 };

  reviews.forEach(r => {
    if (prefOnline !== "ALL" && r.onlineRating === prefOnline) totalMatchPoints++;
    if (prefExam !== "ALL" && r.examRating === prefExam) totalMatchPoints++;
  });

  const maxPossible = reviews.length * criteriaCount;
  const matchRate = maxPossible > 0 ? (totalMatchPoints / maxPossible) : 0;

  return {
    score: matchRate * 100,
    matchRate: Math.round(matchRate * 100)
  };
}

function sortRecommendedCourses(coursesList) {
  return coursesList.map(c => {
    const stats = getCourseReviewStats(c.id);
    const pref = getCoursePreferenceScore(c.id);
    return { ...c, ...stats, prefScore: pref.score };
  }).sort((a, b) => {
    if (b.prefScore !== a.prefScore) return b.prefScore - a.prefScore;
    const hasRevA = a.revCount > 0 ? 1 : 0;
    const hasRevB = b.revCount > 0 ? 1 : 0;
    if (hasRevB !== hasRevA) return hasRevB - hasRevA;

    if (b.easyCount !== a.easyCount) return b.easyCount - a.easyCount;
    if (b.avgGPA !== a.avgGPA) return b.avgGPA - a.avgGPA;

    const defaultDiffVal = { "ง่าย": 3, "ปานกลาง": 2, "ยาก": 1 };
    return (defaultDiffVal[b.difficulty || "ปานกลาง"] || 2) - (defaultDiffVal[a.difficulty || "ปานกลาง"] || 2);
  });
}

function getCurriculumRemainingStats(currentPassedMap) {
  let stats = {
    core: { name: "วิชาแกน", req: 26, earned: 0 },
    mandatory: { name: "วิชาเฉพาะบังคับ", req: 42, earned: 0 },
    land: { name: "ศาสตร์แห่งแผ่นดิน", req: 2, earned: 0 },
    eng: { name: "ภาษาอังกฤษ (ENG)", req: 9, earned: 0 },
    pure: { name: "วิชาเลือก Pure Math", req: 9, earned: 0 },
    applied: { name: "วิชาเลือก Applied Math", req: 9, earned: 0 },
    ge_wellness: { name: "สาระอยู่ดีมีสุข", req: 3, earned: 0 },
    ge_entrepreneur: { name: "สาระผู้ประกอบการ", req: 3, earned: 0 },
    ge_citizen: { name: "สาระพลเมือง", req: 3, earned: 0 },
    ge_language: { name: "สาระภาษาและการสื่อสาร", req: 3, earned: 0 },
    ge_aesthetic: { name: "สาระสุนทรียศาสตร์", req: 3, earned: 0 },
    free: { name: "วิชาเลือกเสรี", req: 6, earned: 0 }
  };

  let allPlannedMap = { ...userGrades };
  if (currentPassedMap) {
    allPlannedMap = { ...currentPassedMap };
  } else {
    Object.values(termCustomCourses).forEach(arr => {
      arr.forEach(cid => { allPlannedMap[cid] = "P"; });
    });
  }

  let level200Count = 0;

  Object.keys(allPlannedMap).forEach(id => {
    let isPassed = false;
    const item = allPlannedMap[id];
    if (item) {
      const g = typeof item === "object" ? item.grade : item;
      if (g && g !== "F") isPassed = true;
    }

    if (isPassed) {
      const c = COURSE_DATABASE.find(x => x.id === id);
      if (c) {
        if (c.isLevel200) {
          level200Count++;
          if (level200Count > 1) {
            stats.free.earned += c.credits;
            return;
          }
        }

        if (stats[c.type]) stats[c.type].earned += c.credits;
        if (c.subType && stats[c.subType]) stats[c.subType].earned += c.credits;
      }
    }
  });

  return stats;
}

function processRecommendations() {
  const yearEl = document.getElementById("user-year-select");
  const semEl = document.getElementById("user-semester-select");
  const targetEl = document.getElementById("pref-target-gpax");

  const currentYear = yearEl ? parseInt(yearEl.value) : 1;
  const currentSem = semEl ? parseInt(semEl.value) : 0;
  const targetGPAX = targetEl ? parseFloat(targetEl.value) : 3.25;

  let earnedCredits = 0, totalPoints = 0, totalAttemptedCredits = 0;
  
  COURSE_DATABASE.forEach(course => {
    const item = userGrades[course.id];
    if (item) {
      const grade = typeof item === "object" ? item.grade : item;
      const failedBefore = typeof item === "object" ? item.failedBefore : false;

      if (failedBefore && course.gradeType !== "pass_fail") {
        totalAttemptedCredits += course.credits;
      }

      if (grade && grade !== "F") {
        earnedCredits += course.credits;
        if (GRADE_POINTS[grade] !== undefined && course.gradeType !== "pass_fail") {
          totalPoints += GRADE_POINTS[grade] * course.credits;
          totalAttemptedCredits += course.credits;
        }
      }
    }
  });

  const currentGPAX = totalAttemptedCredits > 0 ? (totalPoints / totalAttemptedCredits) : 0;
  
  const totalCreditsEl = document.getElementById("total-credits");
  const gpaxValEl = document.getElementById("gpax-val");
  const statusDescEl = document.getElementById("academic-status-desc");

  if (totalCreditsEl) totalCreditsEl.innerText = `${earnedCredits} / 128 หน่วยกิต`;
  if (gpaxValEl) gpaxValEl.innerText = currentGPAX.toFixed(2);

  const isPostYear1Sem1 = (currentYear > 1) || (currentYear === 1 && currentSem >= 2);
  if (statusDescEl) {
    if (currentSem === 0 || !isPostYear1Sem1 || totalAttemptedCredits === 0) {
      statusDescEl.innerText = "สถานะ: เริ่มต้นใหม่ / ปกติ (ยังไม่คิดเกณฑ์โปร)";
      statusDescEl.style.color = "#0284c7";
    } else if (currentGPAX >= 2.00) {
      statusDescEl.innerText = "สถานะ: ปกติ (พ้นเกณฑ์วิทยาทัณฑ์)";
      statusDescEl.style.color = "#16a085";
    } else if (currentGPAX >= 1.75 && currentGPAX < 2.00) {
      statusDescEl.innerText = "⚠️ ติดวิทยาทัณฑ์: โปรสูง (1.75 - 1.99) ต้องทำเกรดเฉลี่ยสะสมให้ถึง 2.00 ก่อนจบ";
      statusDescEl.style.color = "#d97706";
    } else if (currentGPAX >= 1.50 && currentGPAX < 1.75) {
      statusDescEl.innerText = "🚨 ติดวิทยาทัณฑ์: โปรต่ำ (1.50 - 1.74) เสี่ยงพ้นสภาพนิสิตหากติด 2 ภาคติดต่อกัน";
      statusDescEl.style.color = "#dc2626";
    } else {
      statusDescEl.innerText = "🛑 พ้นสภาพนิสิต (เกรดเฉลี่ยต่ำกว่า 1.50)";
      statusDescEl.style.color = "#991b1b";
    }
  }

  const remainingCredits = Math.max(0, 128 - earnedCredits);
  const targetValEl = document.getElementById("required-gpa-val");
  const targetDescEl = document.getElementById("required-gpa-desc");

  let neededAvg = 0;
  if (remainingCredits > 0 && !isNaN(targetGPAX)) {
    const totalFinalAttemptedCredits = totalAttemptedCredits + remainingCredits;
    neededAvg = ((targetGPAX * totalFinalAttemptedCredits) - totalPoints) / remainingCredits;
    
    const maxPossiblePoints = totalPoints + (4.0 * remainingCredits);
    const maxPossibleGPAX = maxPossiblePoints / totalFinalAttemptedCredits;

    if (targetValEl && targetDescEl) {
      if (neededAvg > 4.0) {
        targetValEl.innerText = `ทำได้สูงสุด ${maxPossibleGPAX.toFixed(2)}`;
        targetValEl.style.color = "#dc2626";
        
        const extraCreditsNeededForA = Math.ceil(((targetGPAX * totalFinalAttemptedCredits) - maxPossiblePoints) / (4.0 - targetGPAX));
        const safeExtra = Math.min(extraCreditsNeededForA > 0 ? extraCreditsNeededForA : 6, 15);

        targetDescEl.innerHTML = `
          ⚠️ เป้าหมาย ${targetGPAX.toFixed(2)} ใน 4 ปีปกติ สูงเกินเพดาน (ได้ A ทุกวิชาที่เหลือจะจบที่ ${maxPossibleGPAX.toFixed(2)})<br>
          <span style="color:#7e22ce; font-weight:bold; display:block; margin-top:4px;">
            💡 ทางเลือกแนะนำ: ลงเรียนภาคฤดูร้อน (Summer) เก็บวิชาเสรี/GE เพิ่มอีก ~${safeExtra} หน่วยกิต (เก็บ A) เพื่อดึงเกรดเฉลี่ยสะสมให้ถึงเป้าหมายได้!
          </span>`;
      } else if (neededAvg <= 0) {
        targetValEl.innerText = "บรรลุแล้ว";
        targetValEl.style.color = "#16a085";
        targetDescEl.innerText = "🎉 เกรดสะสมผ่านเป้าหมายเรียบร้อยแล้ว";
      } else {
        targetValEl.innerText = neededAvg.toFixed(2);
        targetValEl.style.color = "#006633";
        targetDescEl.innerText = `เฉลี่ยขั้นต่ำในอีก ${remainingCredits} หน่วยกิตที่เหลือ เพื่อจบ 4 ปี`;
      }
    }
  }

  renderCategoryRemainingSummary();
  renderRemainingTermsSchedule(currentYear, currentSem, Math.min(neededAvg, 4.0));
  renderCategorizedRecommendations();
}

function renderCategoryRemainingSummary() {
  const container = document.getElementById("category-remaining-summary");
  if (!container) return;
  container.innerHTML = "";

  const stats = getCurriculumRemainingStats();

  Object.values(stats).forEach(cat => {
    const remCredits = Math.max(0, cat.req - cat.earned);
    const remCourses = Math.ceil(remCredits / 3);

    container.innerHTML += `
      <div style="background: white; padding: 12px 14px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem;">
        <b style="color: #0f172a;">${cat.name}</b><br>
        <span style="color: #64748b;">สะสมแล้ว: ${cat.earned} / ${cat.req} หน่วยกิต</span><br>
        <span style="color: ${remCredits === 0 ? '#16a085' : '#e11d48'}; font-weight: bold;">
          ${remCredits === 0 ? '✅ ครบตามเกณฑ์แล้ว' : `ยังขาดอีก: ${remCredits} หน่วยกิต (~${remCourses} วิชา)`}
        </span>
      </div>`;
  });
}

function buildCourseReviewBadges(course, gradeLetter) {
  const matchedReviews = (typeof allReviews !== "undefined" ? allReviews : []).filter(r => (r.courseId || "").toString().replace(/[^0-9]/g, "") === (course.id || "").toString().replace(/[^0-9]/g, ""));
  const latestRev = matchedReviews.length > 0 ? matchedReviews[matchedReviews.length - 1] : null;

  const onlineVal = (latestRev && latestRev.onlineRating) || course.onlineMode || "";
  const examVal = (latestRev && latestRev.examRating) || course.examMode || "";

  const onlineTag = onlineVal === 'onsite' ? '🏫 Onsite' : (onlineVal === 'online' ? '💻 Online' : (onlineVal === 'hybrid' ? '🔄 Hybrid' : '🏫 Onsite'));
  const examTag = examVal === 'exam' ? '📝 เน้นสอบ' : (examVal === 'work' ? '📂 เน้นงาน' : (examVal === 'hybrid' ? '⚖️ สอบ+งาน' : '📝 เน้นสอบ'));
  const diffLabel = (latestRev && latestRev.difficulty) || course.avgDiff || course.diffLabel || course.difficulty || 'ปานกลาง';

  return `
    <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 5px;">
      <span style="background:#fef08a; color:#854d0e; padding:2px 8px; border-radius:4px; font-size:0.8rem; font-weight:bold;">ระดับความยาก: ${diffLabel}</span>
      <span style="background:#dbeafe; color:#1e40af; padding:2px 8px; border-radius:4px; font-size:0.8rem; font-weight:bold;">📚 เกรดเฉลี่ยรีวิว: ${gradeLetter}</span>
      <span style="background:#e0f2fe; color:#0369a1; padding:2px 8px; border-radius:4px; font-size:0.8rem; font-weight:bold;">${onlineTag}</span>
      <span style="background:#fef3c7; color:#b45309; padding:2px 8px; border-radius:4px; font-size:0.8rem; font-weight:bold;">${examTag}</span>
    </div>
  `;
}

// 🟢 แสดงคลังวิชาแนะนำ — เชื่อมโยงเกรดคาดการณ์ที่ผู้ใช้เลือกในตารางเพื่อปลดล็อกตัวต่อแบบ Real-time
function renderCategorizedRecommendations() {
  const stats = getCurriculumRemainingStats();
  const curYear = document.getElementById("curriculum-year-select") ? document.getElementById("curriculum-year-select").value : "2565";

  // รวบรวมวิชาที่ผ่านแล้ว + วิชาที่ระบุเกรดคาดว่าจะได้ (ตั้งแต่ D ขึ้นไป)
  const effectivePassedLookup = { ...userGrades };
  Object.keys(expectedCourseGrades).forEach(cid => {
    const g = expectedCourseGrades[cid];
    if (g && g !== "F") {
      effectivePassedLookup[cid] = g;
    }
  });

  // 1. Pure Math
  const pureRem = Math.max(0, 9 - stats.pure.earned);
  const pureTitle = document.getElementById("pure-header-title");
  if (pureTitle) {
    pureTitle.innerText = pureRem > 0 
      ? `📘 รายวิชาเลือก Pure Math (ต้องลงอีกอย่างน้อย ${pureRem} หน่วยกิต)` 
      : `📘 รายวิชาเลือก Pure Math (✅ ครบตามเกณฑ์แล้ว)`;
  }

  const rawPureCourses = COURSE_DATABASE.filter(c => c.type === "pure" && (!userGrades[c.id] || (typeof userGrades[c.id] === "object" ? userGrades[c.id].grade === "F" : userGrades[c.id] === "F")));
  const sortedPureCourses = sortRecommendedCourses(rawPureCourses);

  const pureList = document.getElementById("pure-elective-list");
  if (pureList) {
    pureList.innerHTML = "";
    sortedPureCourses.forEach((c, idx) => {
      const missing = checkUnpassedPrereqs(c.id, effectivePassedLookup);
      const prereqText = missing.length > 0 ? `<span style="color:#d97706; font-weight:bold;">🔒 ติดตัวต่อ: ยังไม่ได้ผ่าน ${missing.join(", ")}</span>` : `<span style="color:#16a085; font-weight:bold;">✅ พร้อมลงเรียนได้</span>`;
      const gradeLetter = formatGradeLetter(c.avgGPA);
      const badgesHtml = buildCourseReviewBadges(c, gradeLetter);

      pureList.innerHTML += `
        <li style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
          <b>อันดับ ${idx + 1}: ${c.id} ${c.name}</b> (${c.credits} หน่วยกิต)
          ${badgesHtml}
          <small style="display:block; margin-top:4px;">เปิดสอน: <b>${c.offeredStr}</b> | ${prereqText}</small>
        </li>
      `;
    });
  }

  // 2. Applied Math
  const appliedRem = Math.max(0, 9 - stats.applied.earned);
  const appliedTitle = document.getElementById("applied-header-title");
  if (appliedTitle) {
    appliedTitle.innerText = appliedRem > 0 
      ? `📙 รายวิชาเลือก Applied Math (ต้องลงอีกอย่างน้อย ${appliedRem} หน่วยกิต)` 
      : `📙 รายวิชาเลือก Applied Math (✅ ครบตามเกณฑ์แล้ว)`;
  }

  const rawAppliedCourses = COURSE_DATABASE.filter(c => c.type === "applied" && (!userGrades[c.id] || (typeof userGrades[c.id] === "object" ? userGrades[c.id].grade === "F" : userGrades[c.id] === "F")));
  const sortedAppliedCourses = sortRecommendedCourses(rawAppliedCourses);

  const appliedList = document.getElementById("applied-elective-list");
  if (appliedList) {
    appliedList.innerHTML = "";
    sortedAppliedCourses.forEach((c, idx) => {
      const missing = checkUnpassedPrereqs(c.id, effectivePassedLookup);
      const prereqText = missing.length > 0 ? `<span style="color:#d97706; font-weight:bold;">🔒 ติดตัวต่อ: ยังไม่ได้ผ่าน ${missing.join(", ")}</span>` : `<span style="color:#16a085; font-weight:bold;">✅ พร้อมลงเรียนได้</span>`;
      const gradeLetter = formatGradeLetter(c.avgGPA);
      const rule200Badge = c.isLevel200 ? `<span style="background:#f3e8ff; color:#7e22ce; padding:2px 6px; border-radius:4px; font-size:0.78rem; margin-left:4px;">📌 รหัส 200 (นับได้ตัวเดียว)</span>` : "";
      const badgesHtml = buildCourseReviewBadges(c, gradeLetter);

      appliedList.innerHTML += `
        <li style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
          <b>อันดับ ${idx + 1}: ${c.id} ${c.name}</b> (${c.credits} หน่วยกิต) ${rule200Badge}
          ${badgesHtml}
          <small style="display:block; margin-top:4px;">เปิดสอน: <b>${c.offeredStr}</b> | ${prereqText}</small>
        </li>`;
    });
  }

  // 3. หมวดภาษาอังกฤษ (ENG)
  const engRem = Math.max(0, stats.eng.req - stats.eng.earned);
  const engTitle = document.getElementById("eng-header-title");
  if (engTitle) {
    engTitle.innerText = engRem > 0 
      ? `🇬🇧 หมวดวิชาภาษาอังกฤษ (ENG) (ต้องลงอีกอย่างน้อย ${engRem} หน่วยกิต)` 
      : `🇬🇧 หมวดวิชาภาษาอังกฤษ (ENG) (✅ ครบตามเกณฑ์แล้ว)`;
  }

  const engList = document.getElementById("eng-elective-list");
  if (engList) {
    engList.innerHTML = "";

    let unpassedEng = COURSE_DATABASE.filter(c => c.type === "eng" && (!userGrades[c.id] || (typeof userGrades[c.id] === "object" ? userGrades[c.id].grade === "F" : userGrades[c.id] === "F")));
    
    if (curYear === "2569") {
      unpassedEng = unpassedEng.filter(c => c.id !== "01355101" && c.id !== "01355102");
    }

    const advEngCourses = unpassedEng.filter(c => c.subType === "eng_adv");
    const sortedAdvEng = sortRecommendedCourses(advEngCourses);

    if (curYear === "2565") {
      const basicEng = unpassedEng.filter(c => c.subType === "eng1" || c.subType === "eng2");
      if (basicEng.length > 0) {
        engList.innerHTML += `<li style="background:#f8fafc; font-weight:bold; color:#475569;">🔹 รายวิชาภาษาอังกฤษพื้นฐาน</li>`;
        basicEng.forEach(c => {
          const missing = checkUnpassedPrereqs(c.id, effectivePassedLookup);
          const prereqText = missing.length > 0 ? `<span style="color:#d97706; font-weight:bold;">🔒 ติดตัวต่อ: ยังไม่ได้ผ่าน ${missing.join(", ")}</span>` : `<span style="color:#16a085; font-weight:bold;">✅ พร้อมลงเรียนได้</span>`;
          const gradeLetter = formatGradeLetter(c.avgGPA);
          const badgesHtml = buildCourseReviewBadges(c, gradeLetter);

          engList.innerHTML += `
            <li style="margin-left: 15px; padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
              <b>• ${c.id} ${c.name}</b> (${c.credits} หน่วยกิต)
              ${badgesHtml}
              <small style="display:block; margin-top:4px;">เปิดสอน: <b>${c.offeredStr}</b> | ${prereqText}</small>
            </li>`;
        });
      }
    }

    if (sortedAdvEng.length > 0) {
      engList.innerHTML += `
        <li style="background:#f0fdf4; border: 1.5px solid #86efac; font-weight:bold; color:#166534; margin-top: 10px;">
          🔹 รายวิชาภาษาอังกฤษกลุ่มขั้นสูง (ENG 3 และ ENG 4 อยู่ในระดับเดียวกัน)
        </li>`;

      sortedAdvEng.forEach((c, idx) => {
        const missing = checkUnpassedPrereqs(c.id, effectivePassedLookup);
        const prereqText = missing.length > 0 ? `<span style="color:#d97706; font-weight:bold;">🔒 ติดตัวต่อ: ยังไม่ได้ผ่าน ${missing.join(", ")}</span>` : `<span style="color:#16a085; font-weight:bold;">✅ พร้อมลงเรียนได้</span>`;
        const gradeLetter = formatGradeLetter(c.avgGPA);
        const badgesHtml = buildCourseReviewBadges(c, gradeLetter);

        engList.innerHTML += `
          <li style="margin-left: 15px; padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
            <b>อันดับ ${idx + 1}: ${c.id} ${c.name}</b> (${c.credits} หน่วยกิต)
            ${badgesHtml}
            <small style="display:block; margin-top:4px;">เปิดสอน: <b>${c.offeredStr}</b> | ${prereqText}</small>
          </li>`;
      });
    }
  }

  // 4. GE และ วิชาเลือกเสรี
  const extraList = document.getElementById("extra-elective-list");
  if (extraList) {
    extraList.innerHTML = "";

    const geCatDefs = [
      { key: "ge_wellness", name: "สาระอยู่ดีมีสุข" },
      { key: "ge_entrepreneur", name: "สาระศาสตร์แห่งผู้ประกอบการ" },
      { key: "ge_citizen", name: "สาระพลเมืองไทยและพลเมืองโลก" },
      { key: "ge_language", name: "สาระภาษากับการสื่อสาร" },
      { key: "ge_aesthetic", name: "สาระสุนทรียศาสตร์" }
    ];

    geCatDefs.forEach(gDef => {
      const gCourses = COURSE_DATABASE.filter(c => c.subType === gDef.key && (!userGrades[c.id] || (typeof userGrades[c.id] === "object" ? userGrades[c.id].grade === "F" : userGrades[c.id] === "F")));
      const sortedGE = sortRecommendedCourses(gCourses);
      
      const earnedCredits = stats[gDef.key] ? stats[gDef.key].earned : 0;
      const remCredits = Math.max(0, 3 - earnedCredits);
      const isComplete = remCredits === 0;

      extraList.innerHTML += `
        <li style="background:#faf5ff; border: 1px solid #d8b4fe; font-weight:bold; color:#6b21a8; margin-top: 10px;">
          🌿 หมวด ${gDef.name} ${isComplete ? '<span style="color:#16a085; font-size:0.85rem;">(✅ ครบแล้ว)</span>' : `<span style="color:#e11d48; font-size:0.85rem;">(🚨 ขาดอีก ${remCredits} หน่วยกิต)</span>`}
        </li>`;

      sortedGE.forEach((c) => {
        const gradeLetter = formatGradeLetter(c.avgGPA);
        const badgesHtml = buildCourseReviewBadges(c, gradeLetter);

        extraList.innerHTML += `
          <li style="margin-left: 15px; padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
            <b>• ${c.id} ${c.name}</b> (${c.credits} หน่วยกิต)
            ${badgesHtml}
          </li>`;
      });
    });
  }
}

function addCustomCourseToTerm(termKey, courseId) {
  if (!courseId) return;
  if (!termCustomCourses[termKey]) termCustomCourses[termKey] = [];

  if (termCustomCourses[termKey].includes(courseId)) {
    alert("วิชานี้ถูกเลือกในเทอมนี้แล้วครับ");
    return;
  }

  // 🟢 ตรวจสอบเงื่อนไขการลง ENG ในเทอมเดียวกัน
  const targetCourse = COURSE_DATABASE.find(c => c.id === courseId);
  if (targetCourse && targetCourse.type === "eng") {
    const existingTermCourseIds = [
      ...(termGeneratedSchedule[termKey] || []),
      ...(termCustomCourses[termKey] || [])
    ];

    for (let cid of existingTermCourseIds) {
      const existCourse = COURSE_DATABASE.find(c => c.id === cid);
      if (existCourse && existCourse.type === "eng") {
        const bothAdv = (existCourse.subType === "eng_adv" && targetCourse.subType === "eng_adv");
        if (!bothAdv) {
          alert(`⚠️ ไม่สามารถลงวิชาภาษาอังกฤษนี้ในเทอมเดียวกันได้!\n\nหลักสูตรไม่อนุญาตให้ลง ENG 1 หรือ ENG 2 ซ้อนกับวิชา ENG อื่นในภาคการศึกษาเดียวกัน (อนุญาตเฉพาะกลุ่มวิชา ENG 3 และ ENG 4 เท่านั้นที่สามารถลงคู่กันได้ครับ)`);
          return;
        }
      }
    }
  }

  termCustomCourses[termKey].push(courseId);
  processRecommendations();
}

function removeCustomCourseFromTerm(termKey, courseId) {
  if (!termCustomCourses[termKey]) return;
  termCustomCourses[termKey] = termCustomCourses[termKey].filter(id => id !== courseId);
  delete expectedCourseGrades[courseId];
  processRecommendations();
}

function shiftFlexibleCourse(courseId, targetTermNum) {
  const targetTerm = parseInt(targetTermNum);
  if (!targetTerm) return;
  courseShiftOverrides[courseId] = targetTerm;
  processRecommendations();
}

function toggleSummerTerm(summerKey) {
  enabledSummerTerms[summerKey] = !enabledSummerTerms[summerKey];
  processRecommendations();
}

function addExtraYear() {
  if (maxExtraYears < 2) {
    maxExtraYears++;
    processRecommendations();
  } else {
    alert("ระบบจำลองการศึกษาได้สูงสุด 6 ปีตามระเบียบมหาวิทยาลัยครับ");
  }
}

function updateExpectedGrade(courseId, gradeVal) {
  if (gradeVal === "") {
    delete expectedCourseGrades[courseId];
  } else {
    expectedCourseGrades[courseId] = gradeVal;
  }
  processRecommendations();
}

function onTermCategoryChange(termKey, selectedCategory) {
  const courseDropdown = document.getElementById(`course-select-${termKey}`);
  if (!courseDropdown) return;

  if (!selectedCategory) {
    courseDropdown.innerHTML = `<option value="">-- กรุณาเลือกหัวข้อหมวดวิชาก่อน --</option>`;
    courseDropdown.disabled = true;
    courseDropdown.style.background = "#f8fafc";
    return;
  }

  const cumulativePassedMap = getCumulativePassedMapBeforeTerm(termKey);
  const currentTermCourses = [
    ...(termGeneratedSchedule[termKey] || []),
    ...(termCustomCourses[termKey] || [])
  ];

  let filtered = [];
  if (selectedCategory === "pure" || selectedCategory === "applied" || selectedCategory === "eng") {
    filtered = COURSE_DATABASE.filter(c => c.type === selectedCategory);
  } else {
    filtered = COURSE_DATABASE.filter(c => c.subType === selectedCategory);
  }

  // 🟢 กรองวิชาที่เคยผ่าน หรือถูกจัดในเทอมก่อนหน้า หรืออยู่ในเทอมปัจจุบันออกทั้งหมด (กันเลือกซ้ำ)
  filtered = filtered.filter(c => {
    const isPassedEarlier = cumulativePassedMap[c.id] && cumulativePassedMap[c.id] !== "F";
    const isInCurrentTerm = currentTermCourses.includes(c.id);
    return !isPassedEarlier && !isInCurrentTerm;
  });

  const sortedList = sortRecommendedCourses(filtered);

  courseDropdown.innerHTML = `<option value="">-- เลือกวิชาในหมวดนี้ --</option>`;

  if (sortedList.length === 0) {
    courseDropdown.innerHTML = `<option value="">-- คุณลงเรียนวิชาในหมวดนี้ครบแล้ว --</option>`;
    courseDropdown.disabled = true;
    return;
  }

  sortedList.forEach(c => {
    const missing = checkUnpassedPrereqs(c.id, cumulativePassedMap);
    const revNote = c.revCount > 0 ? `(ง่าย: ${c.easyCount}/${c.revCount})` : "";
    if (missing.length === 0) {
      courseDropdown.innerHTML += `<option value="${c.id}">${c.id} ${c.name} (${c.credits} หน่วยกิต) [${c.diffLabel} ${revNote}]</option>`;
    } else {
      courseDropdown.innerHTML += `<option value="" disabled style="color:#94a3b8;">${c.id} ${c.name} 🔒 [ต้องผ่าน: ${missing.join(", ")}]</option>`;
    }
  });

  courseDropdown.disabled = false;
  courseDropdown.style.background = "#ffffff";
}

function getNextRecommendedEngFlow(passedLookup) {
  const curYear = document.getElementById("curriculum-year-select") ? document.getElementById("curriculum-year-select").value : "2565";
  const startLevel = document.getElementById("eng-start-level") ? document.getElementById("eng-start-level").value : "ENG1";

  let passedEngList = [];
  Object.keys(passedLookup).forEach(id => {
    const item = passedLookup[id];
    const g = typeof item === "object" ? item.grade : item;
    if (g && g !== "F") {
      const c = COURSE_DATABASE.find(x => x.id === id);
      if (c && c.type === "eng") passedEngList.push(c);
    }
  });

  if (curYear === "2569") {
    if (passedEngList.length < 3) return "ENG 3 หรือ ENG 4";
    return null;
  }

  if (startLevel === "ENG1") {
    const hasEng1 = passedEngList.some(c => c.id === "01355101");
    if (!hasEng1) return "ENG 1 (01355101)";
    const hasEng2 = passedEngList.some(c => c.id === "01355102");
    if (!hasEng2) return "ENG 2 (01355102)";
    if (passedEngList.length < 3) return "ENG 3 หรือ ENG 4";
    return null;
  } else if (startLevel === "ENG2") {
    const hasEng2 = passedEngList.some(c => c.id === "01355102");
    if (!hasEng2) return "ENG 2 (01355102)";
    if (passedEngList.length < 3) return "ENG 3 หรือ ENG 4";
    return null;
  } else {
    if (passedEngList.length < 3) return "ENG 3 หรือ ENG 4";
    return null;
  }
}

function calculateDynamicTargetRange(targetAvg) {
  if (targetAvg > 3.65) return "A";
  if (targetAvg > 3.25) return "B+ – A";
  if (targetAvg > 2.85) return "B – A";
  if (targetAvg > 2.35) return "C+ – A";
  if (targetAvg > 1.85) return "C – A";
  if (targetAvg > 1.35) return "D+ – A";
  return "D – A";
}

function renderRemainingTermsSchedule(startYear, startSem, targetAvg) {
  const container = document.getElementById("remaining-terms-schedule");
  if (!container) return;
  container.innerHTML = "";

  const curYear = document.getElementById("curriculum-year-select") ? document.getElementById("curriculum-year-select").value : "2565";
  const targetGPAX = document.getElementById("pref-target-gpax") ? parseFloat(document.getElementById("pref-target-gpax").value) : 3.25;

  let unpassedCourses = COURSE_DATABASE.filter(c => {
    const isBasicType = (c.type === "core" || c.type === "mandatory" || c.type === "land");
    const item = userGrades[c.id];
    let isPassed = false;
    if (item) {
      const g = typeof item === "object" ? item.grade : item;
      if (g && g !== "F") isPassed = true;
    }
    return isBasicType && !isPassed;
  });

  let passedMap = { ...userGrades };
  termGeneratedSchedule = {};
  
  let currentY = startYear;
  let currentS = 1;

  if (startSem === 0) {
    currentY = startYear;
    currentS = 1;
  } else if (startSem === 1) {
    currentY = startYear;
    currentS = 2;
  } else if (startSem === 2) {
    currentY = startYear + 1;
    currentS = 1;
  }

  let totalAccumulatedCredits = 0;
  let simAttemptedCredits = 0;
  let simTotalPoints = 0;

  COURSE_DATABASE.forEach(c => {
    const item = userGrades[c.id];
    if (item) {
      const g = typeof item === "object" ? item.grade : item;
      const failed = typeof item === "object" ? item.failedBefore : false;
      if (failed && c.gradeType !== "pass_fail") simAttemptedCredits += c.credits;
      if (g && g !== "F") {
        totalAccumulatedCredits += c.credits;
        if (GRADE_POINTS[g] !== undefined && c.gradeType !== "pass_fail") {
          simTotalPoints += GRADE_POINTS[g] * c.credits;
          simAttemptedCredits += c.credits;
        }
      }
    }
  });

  let safetyCounter = 0;
  const maxYearAllowed = 4 + maxExtraYears;

  let userLockedPoints = 0;
  let userLockedCredits = 0;
  Object.keys(expectedCourseGrades).forEach(cid => {
    const g = expectedCourseGrades[cid];
    const c = COURSE_DATABASE.find(x => x.id === cid);
    if (c && c.gradeType !== "pass_fail" && GRADE_POINTS[g] !== undefined) {
      userLockedPoints += GRADE_POINTS[g] * c.credits;
      userLockedCredits += c.credits;
    }
  });

  let totalRemainingCreditsOverall = Math.max(0, 128 - totalAccumulatedCredits);
  let unsetCredits = Math.max(1, totalRemainingCreditsOverall - userLockedCredits);
  let totalPointsNeededOverall = (targetGPAX * (simAttemptedCredits + totalRemainingCreditsOverall)) - (simTotalPoints + userLockedPoints);
  let dynamicNeededAvg = totalPointsNeededOverall / unsetCredits;
  dynamicNeededAvg = Math.max(1.0, Math.min(4.0, dynamicNeededAvg));

  while (safetyCounter < 35) {
    safetyCounter++;

    let isSummerTerm = (currentS === 3);

    if (currentY > maxYearAllowed) break;
    if (currentY === maxYearAllowed && currentS > (enabledSummerTerms[`Y${maxYearAllowed}S3`] ? 3 : 2)) break;

    let termKey = `Y${currentY}S${currentS}`;
    termGeneratedSchedule[termKey] = [];
    let termCourses = [];
    let remainingAfterTerm = [];

    let maxCreditsPerTerm = isSummerTerm ? 9 : 22;
    let currentTermCreditSum = 0;

    let currentAbsoluteTerm = (currentY - 1) * 2 + (isSummerTerm ? 2 : currentS);

    unpassedCourses.sort((a, b) => {
      const semA = courseShiftOverrides[a.id] || a.recSem || 1;
      const semB = courseShiftOverrides[b.id] || b.recSem || 1;
      return semA - semB;
    });

    for (let c of unpassedCourses) {
      const isOfferedInThisSem = c.offered && c.offered.includes(currentS);

      const isPrereqPassed = (!c.prereq || c.prereq.length === 0) || c.prereq.every(reqId => {
        const item = passedMap[reqId];
        if (!item) return false;
        const g = typeof item === "object" ? item.grade : item;
        return g && g !== "F";
      });

      const isCoreqPassed = (!c.coreq || c.coreq.length === 0) || c.coreq.every(reqId => {
        const item = passedMap[reqId];
        const g = item ? (typeof item === "object" ? item.grade : item) : null;
        return (g && g !== "F") || termCourses.some(tc => tc.id === reqId);
      });

      const effectiveRecSem = courseShiftOverrides[c.id] || c.recSem;
      const isTimeReached = (effectiveRecSem <= currentAbsoluteTerm);

      if (isOfferedInThisSem && isTimeReached && isPrereqPassed && isCoreqPassed && (currentTermCreditSum + c.credits) <= maxCreditsPerTerm) {
        termCourses.push(c);
        currentTermCreditSum += c.credits;
      } else {
        remainingAfterTerm.push(c);
      }
    }

    termCourses.forEach(c => { 
      passedMap[c.id] = "P"; 
      termGeneratedSchedule[termKey].push(c.id);
    });

    let customSelectedInThisTerm = termCustomCourses[termKey] || [];
    let customCourseObjects = [];
    customSelectedInThisTerm.forEach(cid => {
      const c = COURSE_DATABASE.find(x => x.id === cid);
      if (c) {
        customCourseObjects.push(c);
        currentTermCreditSum += c.credits;
        passedMap[c.id] = "P";
        termGeneratedSchedule[termKey].push(c.id);
      }
    });

    let termGradedCredits = 0;
    termCourses.concat(customCourseObjects).forEach(c => {
      if (c.gradeType !== "pass_fail") {
        termGradedCredits += c.credits;
        const expG = expectedCourseGrades[c.id];
        const pts = (expG && GRADE_POINTS[expG] !== undefined) ? GRADE_POINTS[expG] : dynamicNeededAvg;
        simTotalPoints += (pts * c.credits);
      }
    });
    simAttemptedCredits += termGradedCredits;
    const termSimGPAX = simAttemptedCredits > 0 ? (simTotalPoints / simAttemptedCredits) : 0;

    totalAccumulatedCredits += currentTermCreditSum;
    let remainingCreditQuota = maxCreditsPerTerm - currentTermCreditSum;
    const currentStats = getCurriculumRemainingStats(passedMap);

    const geCategories = [
      { key: "ge_wellness", name: "GE สาระอยู่ดีมีสุข" },
      { key: "ge_entrepreneur", name: "GE สาระศาสตร์แห่งผู้ประกอบการ" },
      { key: "ge_citizen", name: "GE สาระพลเมืองไทยและพลเมืองโลก" },
      { key: "ge_language", name: "GE สาระภาษากับการสื่อสาร" },
      { key: "ge_aesthetic", name: "GE สาระสุนทรียศาสตร์" }
    ];
    const anyGeIncomplete = geCategories.some(g => currentStats[g.key].earned < 3);

    let availableCourses = COURSE_DATABASE.filter(c => 
      !passedMap[c.id] &&
      c.credits <= remainingCreditQuota &&
      c.offered && c.offered.includes(currentS)
    );

    let termTitle = isSummerTerm ? `☀️ ภาคฤดูร้อน (Summer) หลังปีที่ ${currentY}` : `ปีที่ ${currentY} ภาคการศึกษาที่ ${currentS}`;
    let summerBadge = isSummerTerm ? `<span style="background:#fef3c7; color:#d97706; padding:2px 8px; border-radius:6px; font-size:0.85rem; font-weight:bold;">☀️ ภาคฤดูร้อน</span>` : "";

    let termProWarningHtml = "";
    if (currentY > 1 || (currentY === 1 && currentS >= 2)) {
      if (termSimGPAX < 1.50) {
        termProWarningHtml = `<span style="background:#fee2e2; color:#991b1b; padding:2px 8px; border-radius:4px; font-size:0.8rem; font-weight:bold; margin-left:8px;">🛑 เสี่ยงรีไทร์ (GPAX จำลอง ${termSimGPAX.toFixed(2)})</span>`;
      } else if (termSimGPAX < 1.75) {
        termProWarningHtml = `<span style="background:#fef3c7; color:#b45309; padding:2px 8px; border-radius:4px; font-size:0.8rem; font-weight:bold; margin-left:8px;">🚨 เสี่ยงโปรต่ำ (GPAX จำลอง ${termSimGPAX.toFixed(2)})</span>`;
      } else if (termSimGPAX < 2.00) {
        termProWarningHtml = `<span style="background:#fff7ed; color:#c2410c; padding:2px 8px; border-radius:4px; font-size:0.8rem; font-weight:bold; margin-left:8px;">⚠️ ติดโปรสูง (GPAX จำลอง ${termSimGPAX.toFixed(2)})</span>`;
      }
    }

    let termHtml = `<div class="term-block" style="${isSummerTerm ? 'border: 2px dashed #f59e0b; background: #fffbeb;' : ''}">
      <h4>${termTitle} ${summerBadge} ${termProWarningHtml}</h4>`;

    const renderGradeExpectedSelect = (courseId, isPassFail) => {
      if (isPassFail) return `<span style="font-size:0.82rem; color:#16a085; font-weight:bold; margin-left:10px;">(P/F)</span>`;
      const currentSelected = expectedCourseGrades[courseId] || "";
      return `
        <div style="display:inline-flex; align-items:center; gap:4px; margin-left:8px;">
          <label style="font-size:0.82rem; color:#475569; font-weight:bold;">🎯 เกรดคาดว่าจะได้:</label>
          <select onchange="updateExpectedGrade('${courseId}', this.value)" style="padding:2px 6px; font-size:0.82rem; border-radius:4px; border:1px solid #94a3b8; font-weight:bold; color:#0369a1; background:#fff; cursor:pointer;">
            <option value="">-- แนะนำตามเป้า --</option>
            <option value="A" ${currentSelected === 'A' ? 'selected' : ''}>A (4.0)</option>
            <option value="B+" ${currentSelected === 'B+' ? 'selected' : ''}>B+ (3.5)</option>
            <option value="B" ${currentSelected === 'B' ? 'selected' : ''}>B (3.0)</option>
            <option value="C+" ${currentSelected === 'C+' ? 'selected' : ''}>C+ (2.5)</option>
            <option value="C" ${currentSelected === 'C' ? 'selected' : ''}>C (2.0)</option>
            <option value="D+" ${currentSelected === 'D+' ? 'selected' : ''}>D+ (1.5)</option>
            <option value="D" ${currentSelected === 'D' ? 'selected' : ''}>D (1.0)</option>
          </select>
        </div>`;
    };

    if (termCourses.length > 0) {
      termCourses.forEach(c => {
        let reqNotice = [];
        if (c.prereq && c.prereq.length > 0) reqNotice.push(`ผ่านวิชาตัวต่อ: ${c.prereq.join(", ")}`);
        if (c.coreq && c.coreq.length > 0) reqNotice.push(`ต้องเรียนคู่กับ: ${c.coreq.join(", ")}`);
        const reqStr = reqNotice.length > 0 ? reqNotice.join(" | ") : "ไม่มีวิชาตัวต่อ (ลงได้เลย)";

        let shiftBoxHtml = "";
        if (c.isFlexible) {
          shiftBoxHtml = `
            <div style="display:inline-block; margin-left: 8px;">
              <select onchange="shiftFlexibleCourse('${c.id}', this.value)" style="padding: 2px 6px; font-size: 0.78rem; border-radius: 4px; border: 1px solid #cbd5e1; background: #fff; color: #475569; cursor: pointer;">
                <option value="">🔄 โยกย้ายไปเทอมอื่น</option>
                <option value="2">ย้ายไป ปี 1 เทอม 2</option>
                <option value="3">ย้ายไป ปี 2 เทอม 1</option>
                <option value="4">ย้ายไป ปี 2 เทอม 2</option>
                <option value="5">ย้ายไป ปี 3 เทอม 1</option>
                <option value="6">ย้ายไป ปี 3 เทอม 2</option>
              </select>
            </div>`;
        }

        let displayTargetGrade = c.gradeType === 'pass_fail' ? 'ผ่าน (P)' : calculateDynamicTargetRange(dynamicNeededAvg);
        if (expectedCourseGrades[c.id]) {
          displayTargetGrade = `คุณตั้งไว้ที่ [ ${expectedCourseGrades[c.id]} ]`;
        }

        termHtml += `
          <div class="course-card-item">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:4px;">
              <div>
                <b>${c.id} ${c.name}</b> (${c.credits} หน่วยกิต) 
                <span style="background:#e0f2fe; color:#0369a1; padding:2px 6px; border-radius:4px; font-size:0.8rem;">${c.type === 'land' ? 'ศาสตร์แห่งแผ่นดิน (P/F)' : (c.isFlexible ? 'วิชานอกสาขา' : 'วิชาบังคับ')}</span>
                ${shiftBoxHtml}
              </div>
              <div>
                ${renderGradeExpectedSelect(c.id, c.gradeType === 'pass_fail')}
              </div>
            </div>
            <div style="margin-top: 4px;">
              <span class="prereq-tag">🔒 ${reqStr}</span>
              <span class="target-grade-tag">🎯 ช่วงเกรดที่แนะนำ: <b style="color:#0284c7;">${displayTargetGrade}</b></span>
            </div>
          </div>`;
      });
    }

    if (customCourseObjects.length > 0) {
      customCourseObjects.forEach(c => {
        let displayTargetGrade = c.gradeType === 'pass_fail' ? 'ผ่าน (P)' : calculateDynamicTargetRange(dynamicNeededAvg);
        if (expectedCourseGrades[c.id]) {
          displayTargetGrade = `คุณตั้งไว้ที่ [ ${expectedCourseGrades[c.id]} ]`;
        }

        termHtml += `
          <div class="course-card-item" style="border-left-color: #10b981; background: #f0fdf4;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:4px;">
              <div>
                <b>${c.id} ${c.name}</b> (${c.credits} หน่วยกิต)
                <span style="background:#dcfce7; color:#15803d; padding:2px 6px; border-radius:4px; font-size:0.8rem;">${c.subTypeName || (c.type === 'pure' ? 'Pure Math' : (c.type === 'applied' ? 'Applied Math' : (c.type === 'eng' ? 'ENG' : 'วิชาเลือก')))}</span>
              </div>
              <div style="display:flex; align-items:center; gap:6px;">
                ${renderGradeExpectedSelect(c.id, c.gradeType === 'pass_fail')}
                <button onclick="removeCustomCourseFromTerm('${termKey}', '${c.id}')" style="background:#fee2e2; color:#dc2626; border:none; padding:3px 8px; border-radius:6px; cursor:pointer; font-size:0.8rem; font-weight:bold;">❌ ลบ</button>
              </div>
            </div>
            <div style="margin-top: 4px;">
              <span class="target-grade-tag">🎯 ช่วงเกรดที่แนะนำ: <b style="color:#0284c7;">${displayTargetGrade}</b></span>
            </div>
          </div>`;
      });
    }

    if (remainingCreditQuota > 0) {
      let isEarlyYear = (currentY === 1 && !isSummerTerm);

      let suggestedCategories = [];
      if (currentStats.pure.earned < 9 && currentY >= 2) suggestedCategories.push("วิชาเลือก Pure Math");
      if (currentStats.applied.earned < 9 && currentY >= 2) suggestedCategories.push("วิชาเลือก Applied Math");
      
      geCategories.forEach(g => {
        if (currentStats[g.key].earned < 3) suggestedCategories.push(g.name);
      });

      const nextEngTarget = getNextRecommendedEngFlow(passedMap);

      let adviceLines = [];

      if (isSummerTerm) {
        adviceLines.push(`☀️ <b>เป้าหมายหลัก:</b> เหมาะสำหรับเก็บวิชาศึกษาทั่วไป (GE) หรือวิชาเลือกเสรี เพื่อแบ่งเบาภาระในเทอมปกติ หรือเก็บเกรด A ดึง GPAX`);
      } else {
        if (nextEngTarget) {
          adviceLines.push(`🇬🇧 <b>วิชาภาษาอังกฤษ:</b> แนะนำให้ลง <b>${nextEngTarget}</b> ในเทอมนี้ตามขั้นตอน`);
        }
        if (isEarlyYear) {
          adviceLines.push(`🌿 <b>หมวดวิชาศึกษาทั่วไป:</b> ในชั้นปีที่ 1 แนะนำเก็บกลุ่ม <b>GE และวิชาเลือกเสรี</b> ให้ครบหน่วยกิต`);
        } else if (suggestedCategories.length > 0) {
          adviceLines.push(`🎯 <b>หมวดวิชาแนะนำเพิ่มเติม:</b> แนะนำลงวิชาในกลุ่ม <b>${suggestedCategories.slice(0, 2).join(" หรือ ")}</b>`);
        } else {
          adviceLines.push(`🎉 <b>หมวดบังคับและ GE ครบแล้ว:</b> สามารถเลือกลงวิชาเลือกเสรีใดก็ได้ตามความสนใจ`);
        }
      }

      let adviceBoxHtml = `
        <div style="margin-top: 10px; font-size: 0.88rem; background: #ffffff; padding: 10px 14px; border-radius: 8px; border: 1px solid #e9d5ff;">
          <b style="color: #6b21a8; display: block; margin-bottom: 4px;">💡 ข้อแนะนำการจัดตารางในเทอมนี้:</b>
          <ul style="margin: 0; padding-left: 20px; color: #475569; line-height: 1.6;">
            ${adviceLines.map(line => `<li>${line}</li>`).join("")}
          </ul>
        </div>
      `;

      let categoryOptionsHtml = `<option value="">-- เลือกหัวข้อหมวดวิชา --</option>`;

      const engCount = availableCourses.filter(c => c.type === "eng").length;
      if (engCount > 0) {
        const rem = Math.max(0, 9 - currentStats.eng.earned);
        categoryOptionsHtml += `<option value="eng">🇬🇧 หมวดภาษาอังกฤษ (ENG) (${rem > 0 ? `🚨 ยังขาด ${rem} หน่วยกิต` : 'ครบแล้ว'})</option>`;
      }

      const puresCount = availableCourses.filter(c => c.type === "pure").length;
      if (puresCount > 0) {
        const rem = Math.max(0, 9 - currentStats.pure.earned);
        categoryOptionsHtml += `<option value="pure">สาย Pure Math (${rem > 0 ? `🚨 ยังขาด ${rem} หน่วยกิต` : 'ครบแล้ว'})</option>`;
      }

      const appliedsCount = availableCourses.filter(c => c.type === "applied").length;
      if (appliedsCount > 0) {
        const rem = Math.max(0, 9 - currentStats.applied.earned);
        categoryOptionsHtml += `<option value="applied">สาย Applied Math (${rem > 0 ? `🚨 ยังขาด ${rem} หน่วยกิต` : 'ครบแล้ว'})</option>`;
      }

      geCategories.forEach(g => {
        const list = availableCourses.filter(c => c.subType === g.key);
        const earned = currentStats[g.key].earned;
        const isCompleted = earned >= 3;
        const shouldLock = isCompleted && anyGeIncomplete;

        if (list.length > 0) {
          if (shouldLock) {
            categoryOptionsHtml += `<option value="${g.key}" disabled style="color:#94a3b8;">🔒 ${g.name} (ครบแล้ว - เก็บหมวดอื่นก่อน)</option>`;
          } else {
            const rem = Math.max(0, 3 - earned);
            categoryOptionsHtml += `<option value="${g.key}">${g.name} (${rem > 0 ? `🚨 ยังขาด ${rem} หน่วยกิต` : 'ครบแล้ว'})</option>`;
          }
        }
      });

      termHtml += `
        <div style="margin-top: 12px; padding: 14px; background: #faf5ff; border: 1.5px dashed #c084fc; border-radius: 10px; width: 100%; box-sizing: border-box; overflow: hidden;">
          <label style="font-size: 0.92rem; font-weight: bold; color: #6b21a8; display: block; margin-bottom: 8px;">➕ เพิ่มวิชาเลือกลงในเทอมนี้ (ลงเพิ่มได้อีกสูงสุด ${remainingCreditQuota} หน่วยกิต):</label>
          
          <div style="display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr) auto; gap: 8px; width: 100%; align-items: center; box-sizing: border-box;">
            <select id="cat-select-${termKey}" onchange="onTermCategoryChange('${termKey}', this.value)" style="width: 100%; min-width: 0; max-width: 100%; height: 42px; padding: 6px 10px; border-radius: 6px; border: 1px solid #d8b4fe; font-size: 0.88rem; box-sizing: border-box; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
              ${categoryOptionsHtml}
            </select>

            <select id="course-select-${termKey}" disabled style="width: 100%; min-width: 0; max-width: 100%; height: 42px; padding: 6px 10px; border-radius: 6px; border: 1px solid #d8b4fe; font-size: 0.88rem; background: #f8fafc; box-sizing: border-box; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
              <option value="">-- กรุณาเลือกหัวข้อหมวดวิชาก่อน --</option>
            </select>

            <button onclick="addCustomCourseToTerm('${termKey}', document.getElementById('course-select-${termKey}').value)" style="background:#9333ea; color:white; border:none; height: 42px; padding: 0 16px; border-radius: 6px; cursor:pointer; font-weight:bold; font-size:0.9rem; flex-shrink: 0; white-space: nowrap;">เพิ่มวิชา</button>
          </div>
          ${adviceBoxHtml}
        </div>`;
    }

    termHtml += `
      <div style="margin-top: 14px; font-size: 0.88rem; color: #475569; display: flex; justify-content: space-between; background: #f8fafc; padding: 10px 14px; border-radius: 6px; border: 1px solid #e2e8f0; flex-wrap:wrap; gap:8px;">
        <span>📊 หน่วยกิตรวมเทอมนี้: <b>${currentTermCreditSum}</b> หน่วยกิต ${currentTermCreditSum >= maxCreditsPerTerm ? '<span style="color:#e11d48; font-weight:bold;">(เต็มเพดาน)</span>' : ''}</span>
        <span>🎓 หน่วยกิตสะสม: <b>${totalAccumulatedCredits}</b> / 128 หน่วยกิต (คงเหลือ: <b>${Math.max(0, 128 - totalAccumulatedCredits)}</b>)</span>
        <span>🎯 GPAX สะสมจบเทอมนี้ (จำลอง): <b style="color:${termSimGPAX >= 2.0 ? '#15803d' : '#b91c1c'};">${termSimGPAX.toFixed(2)}</b></span>
      </div>
    </div>`;

    if (currentS === 2) {
      const summerKey = `Y${currentY}S3`;
      const isSummerActive = !!enabledSummerTerms[summerKey];

      termHtml += `
        <div style="text-align: center; margin: -6px 0 16px 0;">
          <button onclick="toggleSummerTerm('${summerKey}')" style="background: ${isSummerActive ? '#ef4444' : '#f59e0b'}; color: white; border: none; padding: 8px 16px; border-radius: 20px; font-size: 0.88rem; font-weight: bold; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            ${isSummerActive ? '❌ ลบภาคฤดูร้อน (Summer) นี้ออก' : `☀️ + แทรกเรียนภาคฤดูร้อน (Summer) หลังปี ${currentY} เพื่อแบ่งเบา/ดึงเกรด`}
          </button>
        </div>`;
    }

    container.innerHTML += termHtml;
    unpassedCourses = remainingAfterTerm;

    if (currentS === 1) {
      currentS = 2;
    } else if (currentS === 2) {
      const summerKey = `Y${currentY}S3`;
      if (enabledSummerTerms[summerKey]) {
        currentS = 3;
      } else {
        currentS = 1;
        currentY++;
      }
    } else if (currentS === 3) {
      currentS = 1;
      currentY++;
    }
  }

  if (maxExtraYears < 2) {
    container.innerHTML += `
      <div style="text-align: center; margin: 20px 0;">
        <button onclick="addExtraYear()" style="background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-size: 0.95rem; font-weight: bold; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">
          ➕ ขยายแผนการเรียนเพิ่มชั้นปี (เรียนต่อปี ${4 + maxExtraYears + 1}) เพื่อผ่อนหน่วยกิต
        </button>
      </div>`;
  }

  if (totalAccumulatedCredits >= 128) {
    container.innerHTML += `<div class="term-block" style="border-color:#22c55e; background:#f0fdf4;"><b style="color:#15803d; font-size:1.05rem;">🎉 ยินดีด้วย! แผนการเรียนนี้สะสมหน่วยกิตครบ 128 หน่วยกิตตามโครงสร้างหลักสูตรเรียบร้อยแล้ว</b></div>`;
  }
}

function switchReviewMode(mode) {
  const tRead = document.getElementById("toggle-read-btn");
  const tWrite = document.getElementById("toggle-write-btn");
  const sRead = document.getElementById("review-read-section");
  const sWrite = document.getElementById("review-write-section");

  if (tRead) tRead.classList.remove("active");
  if (tWrite) tWrite.classList.remove("active");

  if (mode === 'read') {
    if (tRead) tRead.classList.add("active");
    if (sRead) sRead.style.display = "block";
    if (sWrite) sWrite.style.display = "none";
    renderReviews();
  } else {
    if (tWrite) tWrite.classList.add("active");
    if (sRead) sRead.style.display = "none";
    if (sWrite) sWrite.style.display = "block";
  }
}

function populateReviewCourseDropdown() {
  const select = document.getElementById("review-course-id");
  const filterSelect = document.getElementById("review-filter-course");
  if (!select) return;

  select.innerHTML = "";
  if (filterSelect) filterSelect.innerHTML = `<option value="ALL">-- แสดงรีวิวทุกวิชา --</option>`;

  COURSE_DATABASE.forEach(c => {
    select.innerHTML += `<option value="${c.id}">${c.id} - ${c.name}</option>`;
    if (filterSelect) filterSelect.innerHTML += `<option value="${c.id}">${c.id} - ${c.name}</option>`;
  });

  select.innerHTML += `<option value="OTHER">➕ [วิชาอื่นๆ นอกเหนือจากคลังวิชา]</option>`;
}

function onReviewFilterCatChange() {
  const catEl = document.getElementById("review-filter-cat");
  const cat = catEl ? catEl.value : "ALL";
  const filterSelect = document.getElementById("review-filter-course");
  if (!filterSelect) return;

  filterSelect.innerHTML = `<option value="ALL">-- แสดงรีวิวทุกวิชา --</option>`;

  let list = COURSE_DATABASE;
  if (cat !== "ALL") {
    list = COURSE_DATABASE.filter(c => c.type === cat);
  }

  list.forEach(c => {
    filterSelect.innerHTML += `<option value="${c.id}">${c.id} - ${c.name}</option>`;
  });

  renderReviews();
}

function toggleOtherCourseInputs() {
  const courseSelect = document.getElementById("review-course-id");
  const courseId = courseSelect ? courseSelect.value : "";
  const otherFields = document.getElementById("other-course-fields");
  const otherCode = document.getElementById("other-course-code");
  const otherName = document.getElementById("other-course-name");

  if (courseId === "OTHER") {
    if (otherFields) otherFields.style.display = "block";
    if (otherCode) otherCode.required = true;
    if (otherName) otherName.required = true;
  } else {
    if (otherFields) otherFields.style.display = "none";
    if (otherCode) otherCode.required = false;
    if (otherName) otherName.required = false;
  }
}

function loadFromGoogleSheet() {
  try {
    fetch(GAS_API_URL)
      .then(res => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        return res.json();
      })
      .then(data => {
        allReviews = (data.reviews || []).map(r => ({
          ...r,
          courseId: normalizeCourseId(r.courseId)
        }));

        if (data.approvedCourses && data.approvedCourses.length > 0) {
          data.approvedCourses.forEach(appCourse => {
            const normAppId = normalizeCourseId(appCourse.id);
            if (!COURSE_DATABASE.some(c => c.id === normAppId)) {
              COURSE_DATABASE.push({
                id: normAppId,
                name: appCourse.name,
                credits: appCourse.credits,
                prereq: appCourse.prereq || [], coreq: [], offered: [1, 2, 3], offeredStr: "วิชาผ่านอนุมัติ",
                type: appCourse.type,
                subType: appCourse.subType || "",
                difficulty: "ปานกลาง"
              });
            }
          });
          filterCourseDropdown();
          populateReviewCourseDropdown();
        }

        renderReviews();
      })
      .catch(err => {
        console.warn("ไม่สามารถซิงก์กับ Google Sheet ได้ (ใช้งานฐานข้อมูลในเครื่อง):", err);
      });
  } catch (e) {
    console.warn("Local offline mode active.");
  }
}

function submitReview(event) {
  event.preventDefault();

  const commentInput = document.getElementById("review-comment");
  const commentText = commentInput ? commentInput.value.trim() : "";
  const checkboxes = document.querySelectorAll('input[name="offered_semesters"]:checked');

  if (!commentText) {
    alert("⚠️ กรุณาระบุข้อความรีวิวก่อนส่งครับ");
    if (commentInput) commentInput.focus();
    return;
  }

  if (checkboxes.length === 0) {
    alert("⚠️ กรุณาเลือกภาคการศึกษาที่เปิดสอน/ลงเรียน อย่างน้อย 1 ภาคครับ");
    return;
  }

  const isConfirm = confirm("คุณต้องการยืนยันการส่งรีวิวนี้ใช่หรือไม่?");
  if (!isConfirm) return;

  const selectedCourseId = document.getElementById("review-course-id").value;
  const isOther = selectedCourseId === "OTHER";
  const finalCourseId = isOther ? normalizeCourseId(document.getElementById("other-course-code").value.trim()) : normalizeCourseId(selectedCourseId);

  const offeredSemesters = Array.from(checkboxes).map(cb => cb.value).join(", ");
  const prereqVal = isOther ? document.getElementById("other-course-prereq").value.trim() : "";
  const userYearVal = document.getElementById("review-user-year") ? document.getElementById("review-user-year").value : "";

  const payload = {
    type: "review",
    courseId: finalCourseId,
    userYear: userYearVal,
    gradeGot: document.getElementById("review-grade-got").value,
    difficulty: document.getElementById("review-difficulty").value,
    onlineRating: document.getElementById("review-online-rating").value,
    examRating: document.getElementById("review-exam-rating").value,
    comment: commentText,
    offeredSemesters: offeredSemesters,
    isOtherCourse: isOther,
    otherCourseName: isOther ? document.getElementById("other-course-name").value.trim() : "",
    otherCoursePrereq: prereqVal,
    otherCourseCredits: isOther ? document.getElementById("other-course-credits").value : 3,
    otherCourseCategory: isOther ? document.getElementById("other-course-category").value : "",
    otherCourseSubCategory: (isOther && document.getElementById("other-course-category").value === "ge") ? document.getElementById("other-course-subcategory").value : ""
  };

  alert("⏳ กำลังบันทึกรีวิวลง Google Sheet กรุณารอสักครู่...");

  fetch(GAS_API_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: JSON.stringify(payload)
  })
  .then(() => {
    allReviews.push({
      courseId: finalCourseId,
      userYear: payload.userYear,
      gradeGot: payload.gradeGot,
      difficulty: payload.difficulty,
      onlineRating: payload.onlineRating,
      examRating: payload.examRating,
      comment: payload.comment,
      offeredSemesters: payload.offeredSemesters
    });

    alert("✅ บันทึกรีวิวสำเร็จเรียบร้อยแล้ว!");
    document.getElementById("review-form").reset();
    toggleOtherCourseInputs();

    setTimeout(() => {
      loadFromGoogleSheet();
      switchReviewMode('read');
    }, 1200);
  })
  .catch(err => {
    console.error(err);
    alert("❌ ส่งรีวิวล้มเหลว กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต");
  });
}

function renderReviews() {
  const container = document.getElementById("reviews-display-list");
  const countEl = document.getElementById("review-count");
  const filterCatSelect = document.getElementById("review-filter-cat");
  const filterCourseSelect = document.getElementById("review-filter-course");
  if (!container) return;

  const rawCourseId = filterCourseSelect ? filterCourseSelect.value : "ALL";
  const filterCat = filterCatSelect ? filterCatSelect.value : "ALL";
  const filterCourseId = (rawCourseId === "ALL") ? "ALL" : normalizeCourseId(rawCourseId);

  let filteredReviews = allReviews;

  if (filterCourseId && filterCourseId !== "ALL") {
    filteredReviews = filteredReviews.filter(r => normalizeCourseId(r.courseId) === filterCourseId);
  } else if (filterCat && filterCat !== "ALL") {
    const validCourseIdsInCat = COURSE_DATABASE.filter(c => c.type === filterCat).map(c => normalizeCourseId(c.id));
    filteredReviews = filteredReviews.filter(r => validCourseIdsInCat.includes(normalizeCourseId(r.courseId)));
  }

  if (countEl) countEl.innerText = filteredReviews.length;

  if (filteredReviews.length === 0) {
    container.innerHTML = `<p style='color:#888; padding: 15px;'>ยังไม่มีรีวิวที่ตรงกับเงื่อนไขการค้นหา</p>`;
    return;
  }

  let html = "";
  filteredReviews.slice().reverse().forEach(rev => {
    const semInfo = rev.offeredSemesters ? `📅 เปิดสอน: <b>${rev.offeredSemesters}</b> | ` : "";
    const gradeInfo = rev.gradeGot ? `🎯 เกรดที่ได้: <b>${rev.gradeGot}</b> | ` : "";
    const displayId = normalizeCourseId(rev.courseId);
    const matchedCourse = COURSE_DATABASE.find(c => normalizeCourseId(c.id) === displayId);
    const courseNameStr = matchedCourse ? ` - ${matchedCourse.name}` : "";

    html += `
      <div style="border-left: 4px solid #006633; padding: 14px; background: #fff; border-radius: 8px; margin-bottom: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); border-top:1px solid #f1f5f9; border-right:1px solid #f1f5f9; border-bottom:1px solid #f1f5f9;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <b style="font-size:1.05rem; color:#006633;">${displayId}${courseNameStr}</b>
          <span style="background:#e8f8f5; color:#16a085; padding:3px 8px; border-radius:4px; font-size:0.85rem; font-weight:bold;">ระดับความยาก: ${rev.difficulty || 'ปานกลาง'}</span>
        </div>
        <div style="font-size:0.85rem; color:#666; margin: 6px 0;">
          ${semInfo}${gradeInfo}รูปแบบ: <b>${rev.onlineRating || 'onsite'}</b> | การวัดผล: <b>${rev.examRating || 'hybrid'}</b>
        </div>
        <p style="margin-top: 8px; color:#333; line-height: 1.4; background:#f8fafc; padding: 10px; border-radius:6px;">"${rev.comment}"</p>
      </div>`;
  });
  container.innerHTML = html;
}