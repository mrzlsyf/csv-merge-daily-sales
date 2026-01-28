export class ProgressTracker {
  constructor(barId, textId) {
    this.bar = document.getElementById(barId);
    this.text = document.getElementById(textId);
  }

  start() {
    this.update(0, "Memulai penggabungan file...");
  }

  update(percent, message) {
    if (this.bar) this.bar.style.width = `${percent}%`;
    if (this.text) this.text.textContent = message;
  }

  finish() {
    this.update(100, "Penggabungan selesai! File siap diunduh.");
  }

  error(message) {
    this.update(100, `Kesalahan: ${message}`);
    if (this.bar) this.bar.style.backgroundColor = "#ef4444";
  }
}
