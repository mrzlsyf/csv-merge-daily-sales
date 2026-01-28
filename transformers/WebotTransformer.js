import { BaseTransformer } from "./BaseTransformer.js";

export class WebotTransformer extends BaseTransformer {
  constructor(data, sourceCode) {
    super(data);
    this.sourceCode = sourceCode;
  }

  transform() {
    return this.data.map((row) => {
      const orig = {};
      Object.keys(row).forEach((k) => {
        orig[k.trim().toLowerCase()] = row[k];
      });
      const mappings = {
        ADV: orig["adv"] ?? "",
        PLATFORM: orig["platform adv"] ?? "",
        PlatformCrm: orig["platform crm"] ?? "",
        NamaCS: orig["fullname"] ?? "",
        PRODUK: orig["productname"] ?? "",
        "Total+ShippingFee": orig["total+ongkir"] ?? "",
        "BM PER TEAM": orig["ja per team"] ?? "",
        "NAMA CS": orig["namacs"] ?? "",
        "JENIS INPUT": orig["source"] ?? "",
        KecamatanCustomer: "",
        KabupatenCustomer: "",
        ProvinsiCustomer: "",
        CLOSING: orig["closing"] ?? "",
        Status: orig["status"] ?? "",
        ADV_PLATFORM: orig["platform adv"] ?? "",
        source: this.sourceCode,
      };

      return this.mapRow(row, mappings);
    });
  }
}
