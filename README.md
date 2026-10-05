# Dry Dock Management

Aplikasi manajemen dry dock kapal: data kapal dan shipyard, spesifikasi pekerjaan (work order),
ringkasan biaya dengan grafik, task, RFQ, laporan, purchase order, dan update progres pekerjaan.

| Bagian   | Teknologi                              |
| -------- | -------------------------------------- |
| Frontend | Vue 3 + Vite + Vue Router              |
| Backend  | Express.js (Node.js), pola MVC dan OOP |
| Database | MySQL / MariaDB                        |

## Struktur proyek

```
backend/
  database/     schema.sql (struktur tabel) dan seed.sql (data contoh)
  src/
    config/       koneksi database (class Database)
    models/       BaseModel + model tiap tabel (DryDock, WorkOrder, ...)
    controllers/  BaseController + DryDockController
    routes/       definisi endpoint /api/*
    middlewares/  error handler
frontend/
  src/
    views/        halaman (Dashboard, Dry Docks, detail, master data)
    components/   CrudPage, CostSummary, DonutChart, BarChart, ...
    services/     akses API (ApiService + DryDockService)
    composables/  logika CRUD yang dipakai ulang
    config/       definisi field form dan tabel tiap halaman
docker-compose.yml
```

## Prasyarat

- Node.js 20 atau lebih baru (cek dengan `node -v`)
- MySQL 8 atau MariaDB, dan kita tahu user serta passwordnya
- Git
- Docker Desktop (hanya jika ingin menjalankan lewat Docker)

## Menjalankan tanpa Docker

1. **Unduh proyek**

   ```
   git clone <url-repository>
   cd drydock
   ```

2. **Siapkan database.** Perintah ini membuat database `drydock` beserta data contoh.
   Jika tabel sudah ada, isinya dihapus dan dibuat ulang.

   ```
   mysql -u root -p < backend/database/schema.sql
   mysql -u root -p < backend/database/seed.sql
   ```

   Alternatif: buka kedua file itu di MySQL Workbench dan jalankan berurutan.

3. **Jalankan backend** (terminal pertama)

   ```
   cd backend
   cp .env.example .env
   ```

   Buka `.env`, isi `DB_USER` dan `DB_PASSWORD` sesuai MySQL, lalu:

   ```
   npm install
   npm run dev
   ```

   Backend berjalan di http://localhost:3000. Cek di http://localhost:3000/api/vessels,
   hasilnya daftar kapal dalam bentuk JSON.

4. **Jalankan frontend** (terminal kedua)

   ```
   cd frontend
   npm install
   npm run dev
   ```

5. **Buka** http://localhost:5173

> Pengguna Windows PowerShell: jika `npm` diblokir (script disabled), gunakan Git Bash
> atau jalankan `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` sekali.

## Menjalankan dengan Docker

Backend dan frontend berjalan di container terpisah. Database tetap di komputer (host).

1. Siapkan database seperti langkah 2 di atas.

2. Buat user MySQL yang boleh diakses dari container (di MySQL, mode SQL):

   ```sql
   CREATE USER 'drydock'@'%' IDENTIFIED BY 'ganti_password';
   GRANT ALL PRIVILEGES ON drydock.* TO 'drydock'@'%';
   FLUSH PRIVILEGES;
   ```

3. Buat `backend/.env`:

   ```
   cp backend/.env.example backend/.env
   ```

   Isi `DB_USER=drydock` dan `DB_PASSWORD` sesuai langkah 2. `DB_HOST` tidak perlu diubah,
   nilainya diatur otomatis oleh `docker-compose.yml`.

4. Pastikan `npm run dev` tidak sedang berjalan (port 3000 akan bentrok), lalu:

   ```
   docker compose up --build -d
   ```

5. Buka http://localhost:8080

Perintah berguna:

| Perintah                         | Fungsi                               |
| -------------------------------- | ------------------------------------ |
| `docker compose logs -f backend` | melihat log backend                  |
| `docker compose up --build -d`   | membangun ulang setelah kode berubah |
| `docker compose down`            | menghentikan dan menghapus container |

## Endpoint API

Semua resource mendukung `GET`, `POST`, `GET /:id`, `PUT /:id`, `PATCH /:id`, dan `DELETE /:id`:
`vessels`, `shipyards`, `spec-groups`, `work-order-masters`, `work-orders`, `attachments`,
`purchase-orders`, `checklists`, `tasks`, `rfqs`, `quotation-details`, `reports`,
`execution-records`, `spec-updates`, dan `dry-docks`.

Tambahan untuk dry dock:

- `GET /api/dry-docks/:id/summary`: ringkasan biaya, status work order, dan perbandingan per grup
- `POST /api/dry-docks/:id/start`: mulai dry dock (status menjadi execution)
- `POST /api/dry-docks/:id/copy-estimates`: salin Yard Estimates ke Actual Yard Costs

Filter daftar lewat query, misalnya `GET /api/work-orders?dry_dock_id=1`.
Membuat `spec-updates` otomatis memperbarui progress dan status work order terkait.

## Masalah yang sering muncul

| Pesan                         | Penyebab dan solusi                                                                                            |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `mysql: command not found`    | folder `bin` MySQL belum ada di PATH. Pakai path lengkap ke `mysql.exe`, atau gunakan MySQL Workbench          |
| `Access denied for user`      | `DB_USER` atau `DB_PASSWORD` di `backend/.env` salah. Untuk Docker, pastikan user `'drydock'@'%'` sudah dibuat |
| `ECONNREFUSED`                | MySQL belum berjalan, atau `DB_PORT` salah                                                                     |
| `Unknown database 'drydock'`  | langkah 2 (import `schema.sql`) belum dijalankan                                                               |
| Halaman kosong atau error 500 | cek log backend, dan pastikan `seed.sql` sudah diimpor                                                         |
| `port is already allocated`   | port 3000, 5173, atau 8080 dipakai aplikasi lain                                                               |
