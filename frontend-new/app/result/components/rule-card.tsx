import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { GitBranch } from 'lucide-react'

interface Rule {
  id: number
  conditions: string[]
  conclusion: string
}

interface RuleCardProps {
  rule: Rule
}

export default function RuleCard({ rule }: RuleCardProps) {
  return (
    <Card className="border border-border bg-card rounded-xl overflow-hidden hover:border-accent/50 transition-colors">
      <CardContent className="px-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg  flex items-center justify-center flex-shrink-0 mt-1">
            <GitBranch className="w-8 h-8" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Rule {rule.id}
            </h3>

            <div className="space-y-2 mb-4">
              {rule.conditions.map((condition, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-green-600 font-medium text-sm mt-0.5">
                    {idx === 0 ? 'IF' : 'AND'}
                  </span>
                  <span className="text-foreground text-sm">{condition}</span>
                </div>
              ))}
            </div>

            <Separator className="my-3" />

            <div className="flex items-start gap-2">
              <span className="text-green-500 font-medium text-sm mt-0.5">THEN</span>
              <span className="text-foreground font-medium text-sm">{rule.conclusion}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
