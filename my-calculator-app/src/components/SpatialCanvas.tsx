import React, { useState, useCallback } from 'react';
import ReactFlow, { addEdge, Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

// Default example nodes using generic objects to bypass missing type exports
const initialNodes = [
  { id: '1', position: { x: 50, y: 50 }, data: { label: 'Revenue: $85,000' }, style: { background: '#222', color: '#fff', border: '1px solid #555' } },
  { id: '2', position: { x: 50, y: 150 }, data: { label: 'Tax Rate: 20%' }, style: { background: '#222', color: '#fff', border: '1px solid #555' } },
  { id: '3', position: { x: 300, y: 100 }, data: { label: 'Net Income: $68,000' }, style: { background: '#00d2ff', color: '#000', fontWeight: 'bold' } },
];

const initialEdges = [
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#00d2ff' } },
  { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#00d2ff' } },
];

export const SpatialCanvas: React.FC = () => {
  const [nodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onConnect = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: '600px', height: '500px', background: 'rgba(0,0,0,0.4)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
      <ReactFlow nodes={nodes} edges={edges} onConnect={onConnect} fitView>
        <Background color="rgba(255,255,255,0.1)" gap={16} />
        <Controls style={{ fill: '#fff' }} />
      </ReactFlow>
    </div>
  );
};