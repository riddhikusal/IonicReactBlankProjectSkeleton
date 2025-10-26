// src/components/SelectionTooltip.tsx

import React from 'react';
import './SelectionTooltip.css';

type Props = {
  top: number;
  left: number;
  selectedText: string;
  onAction: (action: string, text: string) => void;
};

const SelectionTooltip: React.FC<Props> = ({ top, left, selectedText, onAction }) => {
  return (
    <div className="custom-tooltip" style={{ top, left }}>
      <button onClick={() => onAction('Translate', selectedText)}>Translate</button>
      <button onClick={() => onAction('Ask Expert', selectedText)}>Ask Expert</button>
      <button onClick={() => navigator.clipboard.writeText(selectedText)}>Copy</button>
    </div>
  );
};

export default SelectionTooltip;
