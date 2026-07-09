import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ZoomIn, ZoomOut, RotateCcw, Share2 } from 'lucide-react'

interface TreeVisualizationCardProps {
  zoomLevel: number
  onZoomIn: () => void
  onZoomOut: () => void
  onResetView: () => void
  onExportTree: () => void
}

export default function TreeVisualizationCard({
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onResetView,
  onExportTree,
}: TreeVisualizationCardProps) {
  return (
    <Card className="border border-border bg-card rounded-2xl overflow-hidden">
      <CardHeader className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Decision Tree Visualization</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Zoom: {zoomLevel}%
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Visualization Controls */}
        <div className="flex gap-2 mb-6 pb-4 border-b border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={onZoomIn}
            className="gap-2"
          >
            <ZoomIn className="w-4 h-4" />
            Zoom In
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onZoomOut}
            className="gap-2"
          >
            <ZoomOut className="w-4 h-4" />
            Zoom Out
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onResetView}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onExportTree}
            className="gap-2 ml-auto"
          >
            <Share2 className="w-4 h-4" />
            Export Tree
          </Button>
        </div>

        {/* Placeholder for react-d3-tree */}
        <div
          className="w-full bg-gradient-to-br from-accent/5 to-transparent rounded-xl border border-dashed border-accent/30 flex items-center justify-center"
          style={{ minHeight: '500px' }}
        >
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Tree Visualization</h3>
            <p className="text-sm text-muted-foreground">
              react-d3-tree will render here at {zoomLevel}% zoom level
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
