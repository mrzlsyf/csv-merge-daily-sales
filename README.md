# CSV Merger Sales Daily (Static Web App)

Aplikasi web statis berbasis **HTML, CSS, dan JavaScript (ES Modules)** untuk menggabungkan **4 sumber file CSV** menjadi **1 file CSV** dengan struktur kolom yang sudah distandarisasi.

Aplikasi ini **100% client-side**, aman untuk **GitHub Pages**, dan dirancang dengan prinsip **OOP, clean architecture, dan scalable**.


## ✨ Fitur Utama

- Upload CSV via **Browse** atau **Drag & Drop**
- **Progress bar & status proses real-time**
- **Auto-detect delimiter CSV** (`;` atau `,`)
- Transformasi data per sumber (Edhis & Webot)
- Export CSV otomatis dengan nama:
  ```
  DATA JADI SALES DAILY <H-1>.csv
  ```
- Tanpa backend & tanpa library eksternal


## 🗂️ Struktur Folder

```
/
├─ index.html              # UI utama
├─ style.css               # Styling
├─ app.js                  # Orchestrator
│
├─ core/                   
│   ├─ CSVUtil.js          # Parse, write, download CSV
│   ├─ DateUtil.js         # Utility tanggal (H-1)
│   └─ ProgressTracker.js  # Progress bar & status
│
├─ transformers/
│   ├─ BaseTransformer.js  # transformasi data
│   ├─ EdhisFHTransformer.js
│   └─ WebotTransformer.js
│
└─ config/
    └─ headers.js          # Final header CSV
```


## 🧠 Arsitektur & Best Practices

### 1️⃣ Separation of Concerns
- **UI Layer** → `index.html`, `style.css`
- **Orchestration Layer** → `app.js`
- **Core Utilities** → `/core`
- **Business Logic** → `/transformers`
- **Configuration** → `/config`

### 2️⃣ Object-Oriented Design (OOP)
#### `BaseTransformer`
- Bertindak sebagai abstract layer
- Menjamin semua output mengikuti `FINAL_HEADERS`

#### Transformer per sumber
- `EdhisFHTransformer`
- `WebotTransformer`

Jika ada sumber baru:
1. Buat file transformer baru
2. Extend `BaseTransformer`
3. Daftarkan di `app.js`

### 3️⃣ Single Source of Truth (SSOT)
- Urutan & nama kolom final **hanya didefinisikan sekali** di:
  ```js
  config/headers.js
  ```
- Semua transformer wajib mengikuti konfigurasi ini

### 4️⃣ Robust CSV Handling

#### Auto delimiter detection
```js
const delimiter = text.includes(';') ? ';' : ',';
```

Mendukung:
- CSV Excel Indonesia (`;`)
- CSV Export Sistem (` , `)

### 5️⃣ User Experience (UX)

- Drag & Drop per file (tidak bisa tertukar)
- Progress visual + status teks
- Save dialog native browser


## 🚀 Cara Deploy ke GitHub Pages

1. Push semua file ke repository GitHub
2. Masuk ke **Settings → Pages**
3. Pilih:
   - Source: `main`
   - Folder: `/root`
4. Akses via:
   ```
   https://<username>.github.io/<repo-name>/
   ```

## 📌 Catatan Teknis

- Browser modern (Chrome, Edge, Firefox)
- Tidak mendukung IE
- File CSV diasumsikan memiliki header di baris pertama


## 🔜 Pengembangan Lanjutan (Opsional)

- Header validation & error message
- Preview data sebelum download
- Config mapping via JSON
- Multi-language UI
- Unit test transformer


## 👨‍💻 Author

Mohamad Rizal Syafi'i <br>
Data Engineer Erdigma Indonesia