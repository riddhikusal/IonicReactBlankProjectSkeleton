// src/components/SelectionTooltip.tsx

import React from 'react';
import './SelectionTooltip.css';
import { useChatsStore } from '../../../services/store/chats.store';

type Props = {
  top: number;
  left: number;
  selectedText: string;
  onAction: (action: string, text: string) => void;
};

const SelectionTooltip: React.FC<Props> = ({ top, left, selectedText, onAction }) => {
  const setSelectedText = useChatsStore((state: any) => state.setSelectedText);;
  const setIsChatOpen = useChatsStore((state: any) => state.setIsChatOpen);
  const onSelectedTextClick = () => {
    setSelectedText(selectedText);
    setIsChatOpen?.(true);
    onAction?.('Ask Expert', selectedText);
  }
  return (
    <div className="custom-tooltip" style={{ top, left }}>
      {/* <button onClick={() => onAction('Translate', selectedText)}>Translate</button> */}
      <button onClick={() => onSelectedTextClick()}>Ask Expert</button>
      {/* <button onClick={() => navigator.clipboard.writeText(selectedText)}>Copy</button> */}
    </div>
  );
};

export default SelectionTooltip;
