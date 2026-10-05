const mysqlErrors = {
  ER_DUP_ENTRY: [409, 'Data sudah ada (duplikat)'],
  ER_NO_REFERENCED_ROW_2: [422, 'Data referensi tidak ditemukan'],
  ER_ROW_IS_REFERENCED_2: [409, 'Data masih dipakai oleh data lain'],
};

function errorHandler(err, req, res, next) {
  if (mysqlErrors[err.code]) {
    const [status, message] = mysqlErrors[err.code];
    return res.status(status).json({ message });
  }

  if (err.status) {
    return res.status(err.status).json({ message: err.message, details: err.details });
  }

  console.error(err);
  res.status(500).json({ message: 'Terjadi kesalahan pada server' });
}

module.exports = errorHandler;
