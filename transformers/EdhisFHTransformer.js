import { BaseTransformer } from "./BaseTransformer.js";

export class EdhisFHTransformer extends BaseTransformer {
  transform() {
    return this.data.map((row) => {
      const orig = {};
      Object.keys(row).forEach((k) => {
        orig[k.trim().toLowerCase()] = row[k];
      });
      const mappings = {
        Status: "Pending Pickup",
        PLATFORM: "",
        PlatformCrm: "",
        "BM PER TEAM": "",
        "NAMA CS": "",
        PRODUK: "",
        CLOSING: "1",
        "JENIS INPUT": "",
        ADV_PLATFORM: "",
        "Last CRM": "",
        "Last Team": "",
        source: "edhis_fh",
      };

      const result = this.mapRow(row, mappings);
      result.No = "";

      return result;
    });
  }
}
