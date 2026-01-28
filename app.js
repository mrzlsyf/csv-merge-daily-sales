import { CSVUtil } from "./core/CSVUtil.js";
import { ProgressTracker } from "./core/ProgressTracker.js";
import { DateUtil } from "./core/DateUtil.js";
import { EdhisFHTransformer } from "./transformers/EdhisFHTransformer.js";
import { WebotTransformer } from "./transformers/WebotTransformer.js";

class App {
  constructor() {
    this.form = document.getElementById("uploadForm");
    this.progress = new ProgressTracker("progressBar", "statusText");
    this.percentText = document.getElementById("percentText");
    this.progressSection = document.getElementById("progressSection");
    this.submitBtn = document.getElementById("submitBtn");

    this.files = {
      edhisFH: null,
      webotEDX: null,
      webotEDM: null,
      webotShipper: null,
    };

    this.init();
  }

  init() {
    this._setupEventListeners();
  }

  _setupEventListeners() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));

    const fileConfigs = [
      { id: "edhisFH", zone: "zone-edhisFH" },
      { id: "webotEDX", zone: "zone-webotEDX" },
      { id: "webotEDM", zone: "zone-webotEDM" },
      { id: "webotShipper", zone: "zone-webotShipper" },
    ];

    fileConfigs.forEach((cfg) => {
      const input = document.getElementById(cfg.id);
      const zone = document.getElementById(cfg.zone);
      const label = zone.querySelector("label");
      const nameDisplay = zone.querySelector(".file-name");

      input.addEventListener("change", (e) => {
        if (e.target.files.length) {
          this._handleFileSelection(
            cfg.id,
            e.target.files[0],
            zone,
            nameDisplay,
          );
        }
      });

      label.addEventListener("dragover", (e) => {
        e.preventDefault();
        label.classList.add("dragover");
      });

      label.addEventListener("dragleave", () =>
        label.classList.remove("dragover"),
      );

      label.addEventListener("drop", (e) => {
        e.preventDefault();
        label.classList.remove("dragover");
        if (e.dataTransfer.files.length) {
          const file = e.dataTransfer.files[0];
          if (file.name.toLowerCase().endsWith(".csv")) {
            this._handleFileSelection(cfg.id, file, zone, nameDisplay);
          } else {
            alert("Harap upload file CSV.");
          }
        }
      });
    });
  }

  _handleFileSelection(key, file, zone, nameDisplay) {
    this.files[key] = file;
    zone.classList.add("has-file");
    nameDisplay.textContent = file.name;
    this._checkReady();
  }

  _checkReady() {
    const isReady = Object.values(this.files).every((f) => f !== null);
    this.submitBtn.disabled = !isReady;
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.submitBtn.disabled = true;
    this.progressSection.style.display = "block";

    try {
      this._updateProgress(20, "Membaca file...");

      const [edhisRaw, edxRaw, edmRaw, shipperRaw] = await Promise.all([
        CSVUtil.read(this.files.edhisFH, ","),
        CSVUtil.read(this.files.webotEDX, ";"),
        CSVUtil.read(this.files.webotEDM, ";"),
        CSVUtil.read(this.files.webotShipper, ";"),
      ]);

      this._updateProgress(60, "Processing data...");

      const edhisData = new EdhisFHTransformer(edhisRaw).transform();
      const edxData = new WebotTransformer(edxRaw, "webot_edx").transform();
      const edmData = new WebotTransformer(edmRaw, "webot_edm").transform();
      const shipperData = new WebotTransformer(
        shipperRaw,
        "webot_shipper",
      ).transform();

      const mergedData = [...edhisData, ...edxData, ...edmData, ...shipperData];

      this._updateProgress(90, "Menyimpan...");

      const csvContent = CSVUtil.write(mergedData);
      const filename = `DATA JADI SALES DAILY ${DateUtil.yesterdayLabel()}.csv`;

      CSVUtil.download(csvContent, filename);

      this._updateProgress(100, "Selesai!");

      setTimeout(() => {
        this.submitBtn.disabled = false;
      }, 1000);
    } catch (err) {
      console.error(err);
      this.progress.error(err.message);
    }
  }

  _updateProgress(percent, message) {
    this.progress.update(percent, message);
    if (this.percentText) this.percentText.textContent = `${percent}%`;
  }
}

new App();
