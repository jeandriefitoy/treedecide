import { Card,} from '@/components/ui/card'

interface SummaryCardProps {
  title: string
  value: string
}

export default function SummaryCard({ title, value }: SummaryCardProps) {
  return (
    <Card className="border border-border shadow-md bg-card rounded-xl overflow-hidden hover:border-accent/50 transition-colors">
      <div className="px-6">
        <p className="text-sm text-muted-foreground mb-2">{title}</p>
        <p className="text-4xl font-bold text-foreground">{value}</p>
      </div>
    </Card>
  )
}
