'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AlgorithmCard from './components/algorithm-card'
import SummaryCard from './components/summary-card'
import DecisionTreeViewer from './components/decision-tree-viewer'
import RuleCard from './components/rule-card'
import { useTreeStore } from '@/store/useTreeStore'
import { TreeService } from '@/services/treeService'

function parseRuleString(ruleStr: string, index: number) {
    const withoutIf = ruleStr.replace(/^IF\s+/i, '');
    const parts = withoutIf.split(/\s+THEN\s+/i);

    const conditionsStr = parts[0] || "";
    const conclusionStr = parts[1] || "";

    const conditions = conditionsStr.split(/\s+AND\s+/i);

    return {
        id: index + 1,
        conditions: conditions,
        conclusion: conclusionStr,
    };
}

export default function ResultsPage() {
    const router = useRouter()
    const { dataset, treeResult, setTreeResult, clearDataset } = useTreeStore()
    const isLoading = !treeResult;

    useEffect(() => {
        if (!dataset?.session_id) {
            router.push("/workspace");
        }
    }, [dataset?.session_id, router]);

    useEffect(() => {
        if (!dataset?.session_id) {
            router.push("/workspace");
            return;
        }

        if (treeResult) return;

        const fetchTreeResult = async () => {
            try {
                const data = await TreeService.getResult(dataset.session_id);
                setTreeResult(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchTreeResult();
    }, [dataset?.session_id, treeResult, router, setTreeResult]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-muted-foreground">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="font-medium">Fetching Decision Tree data...</p>
            </div>
        )
    }

    if (!dataset || !treeResult) return null;

    const numericCount = dataset.columns.filter((col) => col.type === "numeric").length;
    const totalMissing = dataset.columns.reduce((sum, col) => sum + (col.missing_count || 0), 0);
    const parsedRules = treeResult.rules.map((ruleStr, index) => parseRuleString(ruleStr, index));

    const handleAnalyzeAnother = () => {
        clearDataset()
        router.push('/workspace')
    }

    const handleDownloadResult = () => {
        console.log('Downloading results...', treeResult)
    }

    const handleExportTree = () => {
        console.log('Exporting tree...')
    }

    return (
        <main className="min-h-screen p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div>
                    <h1 className="text-4xl font-bold text-foreground mb-2">Analysis Results</h1>
                    <p className="text-muted-foreground">
                        Your decision tree has been successfully built. Review the results below.
                    </p>
                </div>

                <AlgorithmCard
                    algorithm={treeResult.algorithm}
                    explanation={treeResult.selection_reason}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SummaryCard title="Dataset Rows" value={dataset.row_count.toString()} />
                    <SummaryCard title="Dataset Columns" value={dataset.column_count.toString()} />
                    <SummaryCard title="Numeric Columns" value={numericCount.toString()} />
                    <SummaryCard title="Missing Values" value={totalMissing.toString()} />
                </div>

                <DecisionTreeViewer
                    title="Decision Tree"
                    showMessage={true}
                    onExport={handleExportTree}
                    hasTree={true}
                    treeData={treeResult.tree}
                />

                <div className="space-y-4">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground mb-1">IF-THEN Rules</h2>
                        <p className="text-muted-foreground">
                            Decision rules extracted from the tree for easy interpretation and implementation.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {parsedRules.map((rule) => (
                            <RuleCard key={rule.id} rule={rule} />
                        ))}
                    </div>
                </div>

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
        </main>
    )
}