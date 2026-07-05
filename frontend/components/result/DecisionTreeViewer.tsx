"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import { getResult } from "@/lib/api";
import type { TreeNode } from "@/lib/types";
import LoadingState from "@/components/ui/LoadingState";

// ---- Custom node: atribut (branch) & class (leaf) ----
function BranchNode({ data }: { data: { label: string } }) {
  return (
    <div className="rounded-lg border-2 border-primary-600 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-800 shadow-sm">
      <Handle type="target" position={Position.Top} />
      {data.label}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function LeafNode({ data }: { data: { label: string } }) {
  return (
    <div className="rounded-lg border-2 border-green-600 bg-green-50 px-4 py-2 text-sm font-bold text-green-800 shadow-sm">
      <Handle type="target" position={Position.Top} />
      ✅ {data.label}
    </div>
  );
}

const nodeTypes = { branch: BranchNode, leaf: LeafNode };

// ---- Ubah TreeNode (rekursif) jadi nodes[] + edges[] datar ----
let idCounter = 0;
function flattenTree(node: TreeNode, parentId: string | null, edgeLabel = "") {
  const id = `node-${idCounter++}`;
  const nodes: any[] = [
    {
      id,
      type: node.is_leaf ? "leaf" : "branch",
      data: {
        label: node.is_leaf
          ? node.class_label ?? node.name
          : node.attribute ?? node.name,
      },
      position: { x: 0, y: 0 }, // posisi asli akan dihitung Dagre di bawah
    },
  ];
  const edges: any[] = [];

  if (parentId) {
    edges.push({
      id: `edge-${parentId}-${id}`,
      source: parentId,
      target: id,
      label: edgeLabel,
      type: "smoothstep",
    });
  }

  node.children?.forEach((child) => {
    const branchLabel = child.name.includes("➔")
      ? child.name.split("➔")[0].trim()
      : "";
    const { nodes: childNodes, edges: childEdges } = flattenTree(
      child,
      id,
      branchLabel
    );
    nodes.push(...childNodes);
    edges.push(...childEdges);
  });

  return { nodes, edges };
}

// ---- Auto-layout pakai Dagre (top-to-bottom) ----
function layoutWithDagre(nodes: any[], edges: any[]) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "TB", nodesep: 60, ranksep: 80 });

  const nodeWidth = 180;
  const nodeHeight = 44;

  nodes.forEach((n) => g.setNode(n.id, { width: nodeWidth, height: nodeHeight }));
  edges.forEach((e) => g.setEdge(e.source, e.target));

  dagre.layout(g);

  return nodes.map((n) => {
    const pos = g.node(n.id);
    return { ...n, position: { x: pos.x - nodeWidth / 2, y: pos.y - nodeHeight / 2 } };
  });
}

function TreeFlow({ tree }: { tree: TreeNode }) {
  idCounter = 0;
  const { nodes: rawNodes, edges: rawEdges } = useMemo(
    () => flattenTree(tree, null),
    [tree]
  );
  const layoutedNodes = useMemo(
    () => layoutWithDagre(rawNodes, rawEdges),
    [rawNodes, rawEdges]
  );

  const [nodes, , onNodesChange] = useNodesState(layoutedNodes);
  const [edges, , onEdgesChange] = useEdgesState(rawEdges);

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

export default function DecisionTreeViewer() {
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = sessionStorage.getItem("treedecide_session");
    if (!sessionId) {
      setLoading(false);
      return;
    }
    getResult(sessionId)
      .then((res) => setTree(res.tree))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState message="Memuat visualisasi pohon..." />;

  if (!tree) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-500">
        Belum ada pohon keputusan. Jalankan training terlebih dahulu.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-semibold">Visualisasi Pohon Keputusan</h2>
      <p className="mt-1 text-sm text-gray-500">
        Drag node untuk geser, scroll untuk zoom, lihat minimap di pojok kanan bawah.
      </p>
      <div className="mt-4">
        <ReactFlowProvider>
          <TreeFlow tree={tree} />
        </ReactFlowProvider>
      </div>
    </div>
  );
}