interface FilePreviewTableProps {
  preview: Record<string, unknown>[];
  columns: string[];
}

export default function FilePreviewTable({
  preview,
  columns,
}: FilePreviewTableProps) {
  if (!preview.length) return null;

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="font-semibold text-gray-800">Preview Data</h2>
        <p className="text-sm text-gray-500">
          Menampilkan {preview.length} baris pertama
        </p>
      </div>
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="px-4 py-2 text-left font-medium text-gray-700"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {preview.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col} className="px-4 py-2 text-gray-600">
                  {String(row[col] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
