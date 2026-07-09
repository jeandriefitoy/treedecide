'use client'

import { useRouter } from 'next/navigation'
import { Brain, Download } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import AlgorithmCard from './components/algorithm-card'
import SummaryCard from './components/summary-card'
import DecisionTreeViewer from './components/decision-tree-viewer'
import RuleCard from './components/rule-card'

interface Rule {
  id: number
  conditions: string[]
  conclusion: string
}

const SAMPLE_RULES: Rule[] = [
  {
    id: 1,
    conditions: ['Age <= 30', 'Student = Yes'],
    conclusion: 'Buy = Yes',
  },
  {
    id: 2,
    conditions: ['Age > 30', 'Income > 50000'],
    conclusion: 'Buy = Yes',
  },
  {
    id: 3,
    conditions: ['Age <= 25', 'Credit Score < 600'],
    conclusion: 'Buy = No',
  },
  {
    id: 4,
    conditions: ['Employment Status = Unemployed', 'Income <= 30000'],
    conclusion: 'Buy = No',
  },
]

export default function ResultsPage() {
  const router = useRouter()

  const handleAnalyzeAnother = () => {
    router.push('/dataset')
  }

  const handleDownloadResult = () => {
    console.log('Downloading results...')
  }

  const handleExportTree = () => {
    console.log('Exporting tree...')
  }

  return (
    <main className="min-h-screen">   
      <div className="">
        <div className=" mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Analysis Results</h1>
            <p className="text-muted-foreground">
              Your decision tree has been successfully built. Review the results below.
            </p>
          </div>

          <AlgorithmCard
            algorithm="C4.5"
            explanation="C4.5 was selected because it provides the best accuracy for your dataset with excellent handling of missing values and categorical features."
          />

          {/* Summary Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard title="Dataset Rows" value="150" />
            <SummaryCard title="Dataset Columns" value="5" />
            <SummaryCard title="Numeric Columns" value="3" />
            <SummaryCard title="Missing Values" value="8" />
          </div>

          {/* Decision Tree Visualization */}
          <DecisionTreeViewer
            title="Decision Tree"
            showMessage={true}
            onExport={handleExportTree}
            minZoom={50}
            maxZoom={200}
            initialZoom={100}
          />

          {/* IF-THEN Rules Section */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">IF-THEN Rules</h2>
              <p className="text-muted-foreground">
                Decision rules extracted from the tree for easy interpretation and implementation.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SAMPLE_RULES.map((rule) => (
                <RuleCard key={rule.id} rule={rule} />
              ))}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col sm:flex-row gap-8">
            <Button
              onClick={handleAnalyzeAnother}
              variant="outline"
              className="flex-1 shadow-md cursor-pointer"
              size="lg"
            >
              Analyze Another Dataset
            </Button>
            <Button
            variant="default"
              onClick={handleDownloadResult}
              className="flex-1 cursor-pointer shadow-md"
              size="lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Result
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
