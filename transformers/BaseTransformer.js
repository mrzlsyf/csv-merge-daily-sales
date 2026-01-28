import { FINAL_HEADERS } from "../config/headers.js";

export class BaseTransformer {
  constructor(data) {
    this.data = data || [];
  }

  mapRow(originalRow, explicitMappings = {}) {
    const result = {};

    const rowLower = {};
    Object.keys(originalRow).forEach((key) => {
      const val = originalRow[key];
      rowLower[key.trim().toLowerCase()] = val;
    });

    FINAL_HEADERS.forEach((h) => {
      const hLower = h.toLowerCase();

      if (h in explicitMappings) {
        result[h] =
          explicitMappings[h] !== undefined && explicitMappings[h] !== null
            ? explicitMappings[h]
            : "";
      } else if (originalRow[h] !== undefined && originalRow[h] !== null) {
        result[h] = originalRow[h];
      } else if (rowLower[hLower] !== undefined && rowLower[hLower] !== null) {
        result[h] = rowLower[hLower];
      } else {
        result[h] = "";
      }
    });

    return result;
  }

  transform() {
    throw new Error("Transform method must be implemented by subclass");
  }
}
