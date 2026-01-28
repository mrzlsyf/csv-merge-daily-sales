export class DateUtil {
  static getYesterday() {
    const d = new Date();
    d.setDate(d.getDate());
    return d;
  }

  static formatIndonesian(date) {
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  static yesterdayLabel() {
    return this.formatIndonesian(this.getYesterday());
  }
}
