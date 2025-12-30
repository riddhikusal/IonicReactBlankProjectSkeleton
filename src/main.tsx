import { StatusBar, Style } from '@capacitor/status-bar';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Initialize Status Bar
const initStatusBar = async () => {
  try {
    await StatusBar.setStyle({ style: Style.Light });
    await StatusBar.setBackgroundColor({ color: '#f2f8f8' });
    await StatusBar.setOverlaysWebView({ overlay: false });
  } catch (error) {
    console.log('Status bar not available on this platform', error);
  }
};

// Initialize status bar before app renders
initStatusBar();

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);