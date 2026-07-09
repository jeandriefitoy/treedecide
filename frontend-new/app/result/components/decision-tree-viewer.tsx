'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Trees } from 'lucide-react'
import EmptyDecisionTreeState from './empty-decision-tree-state'

interface DecisionTreeViewerProps {
  title?: string
  showMessage?: boolean
  onExport?: () => void
  onUploadClick?: () => void
  hasTree?: boolean
  minZoom?: number
  maxZoom?: number
  initialZoom?: number
  children?: React.ReactNode
}

export default function DecisionTreeViewer({
  title = 'Decision Tree',
  showMessage = true,
  onExport,
  onUploadClick,
  hasTree = true,
  minZoom = 50,
  maxZoom = 200,
  initialZoom = 100,
  children,
}: DecisionTreeViewerProps) {
  const [zoomLevel, setZoomLevel] = useState(initialZoom)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 10, maxZoom))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 10, minZoom))
  }

  const handleResetView = () => {
    setZoomLevel(initialZoom)
  }

  const handleFullscreen = () => {
    const element = document.getElementById('decision-tree-container')
    if (element) {
      if (!isFullscreen) {
        element.requestFullscreen().catch(() => {
          setIsFullscreen(true)
        })
      } else {
        document.exitFullscreen()
      }
      setIsFullscreen(!isFullscreen)
    }
  }

  const cardClasses = isFullscreen
    ? 'fixed inset-0 z-50 rounded-none'
    : 'border border-border bg-card rounded-2xl overflow-hidden'

  return (
    <Card id="decision-tree-container" className={cardClasses}>
      <CardHeader className="border-b border-border px-6 py-4 sticky top-0 bg-card z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Trees className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
              {zoomLevel}%
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {hasTree && (
        <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-border">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoomLevel >= maxZoom}
              className="gap-2"
              title="Zoom in (keyboard: +)"
            >
              <ZoomIn className="w-4 h-4" />
              <span className="hidden sm:inline">Zoom In</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoomLevel <= minZoom}
              className="gap-2"
              title="Zoom out (keyboard: -)"
            >
              <ZoomOut className="w-4 h-4" />
              <span className="hidden sm:inline">Zoom Out</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetView}
              className="gap-2"
              title="Reset to default zoom"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          </div>

          <div className="flex gap-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleFullscreen}
              className="gap-2"
              title="Toggle fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
              <span className="hidden sm:inline">Fullscreen</span>
            </Button>
            {onExport && (
              <Button
                onClick={onExport}
                size="sm"
                className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
                title="Export tree as image"
              >
                Download
              </Button>
            )}
          </div>
        </div>
        )}

        {hasTree ? (
          <div
            className="w-full transition-all duration-200"
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
              minHeight: isFullscreen ? 'calc(100vh - 180px)' : '500px',
            }}
          >
            {children ? (
              children
            ) : (
              <div className="w-full bg-gradient-to-br from-accent/5 via-transparent to-accent/5 rounded-xl border border-dashed border-accent/30 flex items-center justify-center" style={{ minHeight: '500px' }}>
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-10 h-10 text-accent"
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
                  {showMessage && (
                    <>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Decision Tree Visualization
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        The generated Decision Tree will appear here after the analysis is complete.
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <EmptyDecisionTreeState onUploadClick={onUploadClick} />
        )}

        {hasTree && (
        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Zoom range: {minZoom}% - {maxZoom}%</span>
          <span>Current zoom: {zoomLevel}%</span>
        </div>
        )}
      </CardContent>
    </Card>
  )
}
