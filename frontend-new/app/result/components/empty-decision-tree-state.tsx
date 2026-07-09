import { Button } from '@/components/ui/button'
import { Trees } from 'lucide-react'

interface EmptyDecisionTreeStateProps {
  onUploadClick?: () => void
}

export default function EmptyDecisionTreeState({
  onUploadClick,
}: EmptyDecisionTreeStateProps) {
  return (
    <div className="w-full flex items-center justify-center min-h-96">
      <div className="text-center max-w-md">
        {/* Tree Icon */}
        <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
          <Trees className="w-10 h-10 text-accent" />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-foreground mb-3">
          No Decision Tree Generated
        </h3>

        {/* Description */}
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Upload a dataset and complete the analysis to generate your Decision Tree.
        </p>

        {/* Button */}
        <Button
          onClick={onUploadClick}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-6 rounded-xl"
        >
          Upload Dataset
        </Button>
      </div>
    </div>
  )
}
