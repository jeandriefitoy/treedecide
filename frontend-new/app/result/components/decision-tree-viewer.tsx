'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Maximize2, Trees } from 'lucide-react'
import EmptyDecisionTreeState from './empty-decision-tree-state'
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  BackgroundVariant,
} from '@xyflow/react'
import type { Node, Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import dagre from 'dagre'

interface TreeNodeData {
  name?: string
  is_leaf?: boolean
  class_label?: string
  children?: TreeNodeData[]
}

interface DecisionTreeViewerProps {
  title?: string
  showMessage?: boolean
  onExport?: () => void
  onUploadClick?: () => void
  treeData?: TreeNodeData
  hasTree?: boolean
}

interface CustomNodeData {
  label: string
  isLeaf: boolean
  classLabel: string
}

const CustomTreeNode = ({ data }: { data: Record<string, unknown> }) => {
  const { label, isLeaf, classLabel } = data as unknown as CustomNodeData;

  return (
    <>
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <div
        className={`flex flex-col items-center justify-center w-[180px] h-[85px] p-3 border rounded-xl shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1 ${
          isLeaf 
            ? 'bg-gradient-to-b from-emerald-50 to-emerald-100/60 border-emerald-300' 
            : 'bg-gradient-to-b from-white to-slate-50 border-slate-200'
        }`}
      >
        <span className={`text-sm font-bold text-center break-words ${isLeaf ? 'text-emerald-800' : 'text-slate-700'}`}>
          {label}
        </span>
        {isLeaf && (
          <span className="mt-2 text-[10px] font-bold tracking-widest text-emerald-700 uppercase bg-emerald-200/70 px-3 py-1 rounded-full">
            {classLabel}
          </span>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </>
  );
};

const nodeTypes = { customNode: CustomTreeNode };


const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  dagreGraph.setGraph({ rankdir: direction, nodesep: 60, ranksep: 100 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 180, height: 85 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 180 / 2,
        y: nodeWithPosition.y - 85 / 2,
      },
    };
  });

  return { nodes: newNodes, edges };
};

export default function DecisionTreeViewer({
  title = 'Decision Tree',
  onUploadClick,
  treeData,
  hasTree = true,
}: DecisionTreeViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  const processTreeData = useCallback((rootNode: TreeNodeData) => {
    const initialNodes: Node[] = [];
    const initialEdges: Edge[] = [];
    let idCounter = 0;

    const traverse = (node: TreeNodeData, parentId: string | null = null) => {
      if (!node) return;

      const currentId = `node-${idCounter++}`;
      const nameParts = node.name ? node.name.split(' ➔ ') : ['Unknown'];
      const condition = nameParts.length > 1 ? nameParts[0] : '';
      const nodeLabel = nameParts.length > 1 ? nameParts[1] : nameParts[0];

      initialNodes.push({
        id: currentId,
        type: 'customNode',
        data: {
          label: nodeLabel,
          isLeaf: node.is_leaf || false,
          classLabel: node.class_label || '',
        },
        position: { x: 0, y: 0 },
      });

      if (parentId) {
        initialEdges.push({
          id: `edge-${parentId}-${currentId}`,
          source: parentId,
          target: currentId,
          label: condition,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#cbd5e1', strokeWidth: 2 },
          labelStyle: { fill: '#475569', fontWeight: 600, fontSize: 12 },
          labelBgStyle: { fill: '#ffffff', stroke: '#e2e8f0', strokeWidth: 1, rx: 6, ry: 6 },
          labelBgPadding: [8, 4],
        });
      }

      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => traverse(child, currentId));
      }
    };

    traverse(rootNode);

    const layouted = getLayoutedElements(initialNodes, initialEdges);
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
  }, [setNodes, setEdges]);

  useEffect(() => {
    if (treeData) {
      processTreeData(treeData);
    }
  }, [treeData, processTreeData]);

  const handleFullscreen = () => {
    const element = document.getElementById('decision-tree-container')
    if (element) {
      if (!isFullscreen) {
        element.requestFullscreen().catch(() => setIsFullscreen(true))
      } else {
        document.exitFullscreen()
      }
      setIsFullscreen(!isFullscreen)
    }
  }

  const cardClasses = isFullscreen
    ? 'fixed inset-0 z-50 rounded-none bg-background'
    : 'border border-border bg-card rounded-2xl overflow-hidden'

  const shouldRenderTree = hasTree && treeData;

  return (
    <Card id="decision-tree-container" className={cardClasses}>
      <CardHeader className="border-b border-border px-6 py-4 sticky top-0 bg-card z-10 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Trees className="w-5 h-5 text-accent" />
            </div>
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleFullscreen} className="gap-2">
              <Maximize2 className="w-4 h-4" />
              <span className="hidden sm:inline">Fullscreen</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {shouldRenderTree ? (
          <div 
            className="w-full relative" 
            style={{ height: isFullscreen ? 'calc(100vh - 80px)' : '600px' }}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              minZoom={0.1}
            >
              <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
              <Controls className="bg-white shadow-md border-slate-200 rounded-lg" />
            </ReactFlow>
          </div>
        ) : (
          <div className="p-6">
            <EmptyDecisionTreeState onUploadClick={onUploadClick} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}