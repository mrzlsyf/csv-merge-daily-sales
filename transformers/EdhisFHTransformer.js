import { BaseTransformer } from "./BaseTransformer.js";

export class EdhisFHTransformer extends BaseTransformer {
  transform() {
    const seenOrders = new Set();

    return this.data.map((row) => {
      const orig = {};
      Object.keys(row).forEach((k) => {
        orig[k.trim().toLowerCase()] = row[k];
      });

      const orderNumber = row["OrderNumber"] ?? orig["ordernumber"] ?? "";

      let closingValue = "0";
      if (orderNumber && !seenOrders.has(orderNumber)) {
        closingValue = "1";
        seenOrders.add(orderNumber);
      }

      const mappings = {
        Status: "Pending Pickup",
        PLATFORM: "",
        PlatformCrm: "",
        "BM PER TEAM": "",
        "NAMA CS": "",
        PRODUK: "",
        CLOSING: closingValue,
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
