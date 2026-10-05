export function downloadCsv(filename, columns, rows) {
  const quote = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const lines = [
    columns.map((column) => quote(column.label)).join(","),
    ...rows.map((row) =>
      columns.map((column) => quote(row[column.key])).join(","),
    ),
  ];

  const url = URL.createObjectURL(
    new Blob([lines.join("\n")], { type: "text/csv" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
