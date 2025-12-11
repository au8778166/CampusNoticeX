export function detectCategory(title) {
    const t = title.toLowerCase();
  
    if (t.includes("exam") || t.includes("timetable") || t.includes("schedule") || t.includes("result"))
      return "Exam";
  
    if (t.includes("holiday") || t.includes("vacation") || t.includes("closed"))
      return "Holiday";
  
    if (t.includes("hostel") || t.includes("allotment") || t.includes("warden"))
      return "Hostel";
  
    if (t.includes("fee") || t.includes("payment") || t.includes("fine"))
      return "Fees";
  
    if (t.includes("placement") || t.includes("drive") || t.includes("recruitment"))
      return "Placement";
  
    if (t.includes("registration") || t.includes("orientation") || t.includes("classes"))
      return "Academics";
  
    return "General";
  }
  