export function parseNoticeDate(rawDate) {
    try {
      // Example input: "Fri, Dec 12, 2025"
      const parts = rawDate.replace(",", "").split(" "); 
      // ["Fri", "Dec", "12", "2025"]
  
      const monthMap = {
        Jan: "01", Feb: "02", Mar: "03", Apr: "04",
        May: "05", Jun: "06", Jul: "07", Aug: "08",
        Sep: "09", Oct: "10", Nov: "11", Dec: "12",
      };
  
      const month = monthMap[parts[1]];
      const day = parts[2].padStart(2, "0");
      const year = parts[3];
  
      return `${year}-${month}-${day}`; // ISO Format
    } catch (err) {
      return null;
    }
  }
  