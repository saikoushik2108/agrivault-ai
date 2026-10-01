import React from 'react';
import { Box } from 'lucide-react';
import { useAgrivaultStore } from '../../store/storageStore';

export const Floating3DTab: React.FC = () => {
  const { open3DModal, is3DModalOpen } = useAgrivaultStore();

  if (is3DModalOpen) return null;

  return (
    <button
      onClick={open3DModal}
      title="Open 3D Digital Twin Workspace"
      className="floating-3d-tab"
      style={{
        boxShadow: '-2px 0 12px rgba(15, 23, 42, 0.12)'
      }}
    >
      <Box className="w-5 h-5 text-sky-400" />
      <span className="text-[11px] font-bold tracking-widest uppercase leading-none [writing-mode:vertical-rl] rotate-180 py-1">
        3D VIEW
      </span>
    </button>
  );
};
