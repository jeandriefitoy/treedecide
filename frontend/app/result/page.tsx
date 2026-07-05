import AlgorithmBadge from "@/components/result/AlgorithmBadge";
import DecisionTreeViewer from "@/components/result/DecisionTreeViewer";
import RuleList from "@/components/result/RuleList";
import AccuracyCard from "@/components/result/AccuracyCard";

export default function ResultPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold">Hasil Klasifikasi</h1>
        <p className="mt-1 text-gray-600">
          Visualisasi pohon keputusan dan aturan IF-THEN dari algoritma terpilih.
        </p>
      </section>

      <AlgorithmBadge />
      <DecisionTreeViewer />
      <RuleList />
      <AccuracyCard />
    </div>
  );
}
