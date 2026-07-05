import ColumnSelector from "@/components/configure/ColumnSelector";
import DataSummaryCard from "@/components/configure/DataSummaryCard";

export default function ConfigurePage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold">Konfigurasi Dataset</h1>
        <p className="mt-1 text-gray-600">
          Pilih kolom target klasifikasi dan tinjau ringkasan deteksi otomatis.
        </p>
      </section>

      <DataSummaryCard />
      <ColumnSelector />
    </div>
  );
}
