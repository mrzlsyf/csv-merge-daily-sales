export class CSVUtil {
  static async read(file, delimiter = ",") {
    if (!file) return [];
    const text = await file.text();
    return this.parse(text, delimiter);
  }

  static parse(csvText, delimiter = ",") {
    const cleanText = csvText.replace(/^\ufeff/, "");

    if (!cleanText.trim()) return [];

    const lines = [];
    let currentLine = [];
    let currentField = "";
    let inQuotes = false;

    for (let i = 0; i < cleanText.length; i++) {
      const char = cleanText[i];
      const nextChar = cleanText[i + 1];

      if (inQuotes) {
        if (char === '"' && nextChar === '"') {
          currentField += '"';
          i++;
        } else if (char === '"') {
          inQuotes = false;
        } else {
          currentField += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === delimiter) {
          currentLine.push(currentField);
          currentField = "";
        } else if (char === "\n" || char === "\r") {
          currentLine.push(currentField);
          if (currentLine.some((f) => f.trim() !== "")) {
            lines.push(currentLine);
          }
          currentLine = [];
          currentField = "";
          if (char === "\r" && nextChar === "\n") i++;
        } else {
          currentField += char;
        }
      }
    }

    if (currentField || currentLine.length) {
      currentLine.push(currentField);
      if (currentLine.some((f) => f.trim() !== "")) {
        lines.push(currentLine);
      }
    }

    if (lines.length === 0) return [];

    const headers = lines[0].map((h) => h.trim());
    return lines.slice(1).map((row) => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] !== undefined ? row[index].trim() : "";
      });
      return obj;
    });
  }

  static write(data) {
    if (!data || !data.length) return "";

    const delimiter = ";";
    const headers = Object.keys(data[0]);

    const csvRows = [
      headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(delimiter),
    ];

    for (const row of data) {
      const values = headers.map((header) => {
        const val = String(row[header] ?? "");
        const noNewlines = val.replace(/\r?\n|\r/g, " ");
        const escaped = noNewlines.replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(delimiter));
    }

    return csvRows.join("\n");
  }

  static download(content, filename) {
    const blob = new Blob(["\ufeff" + content], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }
}
