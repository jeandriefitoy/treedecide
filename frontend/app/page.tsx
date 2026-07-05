import UploadForm from "@/components/upload/UploadForm";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          TreeDecide — SPK Decision Tree
        </h1>
        <p className="mt-2 text-gray-600">
          Upload dataset CSV/Excel. Sistem akan mendeteksi tipe kolom & missing
          value, lalu memilih algoritma ID3 atau C4.5 secara otomatis.
        </p>
      </section>

      <UploadForm />
    </div>
  );
}
