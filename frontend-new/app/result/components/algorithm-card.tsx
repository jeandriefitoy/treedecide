import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
// import { Brain } from 'lucide-react'

interface AlgorithmCardProps {
  algorithm: string
  explanation: string
}

export default function AlgorithmCard({
  algorithm,
  explanation,
}: AlgorithmCardProps) {
  return (
    <Card className="border border-border bg-card rounded-2xl shadow-md overflow-hidden">
      <CardContent className="px-6">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className='flex flex-col items-start'>
                <p className="text-sm text-muted-foreground">Algorithm Selected</p>
                <h3 className="text-3xl font-bold text-foreground">{algorithm}</h3>
              </div>
            </div>
            <p className="text-base text-foreground leading-relaxed">{explanation}</p>
          </div>
          <div>
            <Badge className="bg-accent/10 text-accent border-accent/20 hover:bg-accent/20">
              Selected
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
