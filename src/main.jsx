import React from 'react';
import { createRoot } from 'react-dom/client';
import TrueFocus from './components/TrueFocus';

const container = document.getElementById('true-focus-root');
if (container) {
  const root = createRoot(container);
  root.render(<TrueFocus sentence="True Focus" />);
}
