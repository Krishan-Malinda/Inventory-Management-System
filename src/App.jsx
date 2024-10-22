import React, { useState } from 'react';
import QRGenerator from './components/QRGenerator'
import QRScanner from './components/QRScanner'
import './index.css';

function App() {
  const [view, setView] = useState('generator');  // Track whether to show QR generator or scanner

  return (
    <div className="App">
      <h1 className='main_title'>QR Code Inventory Management System</h1>
      <div className='decision_area'>
        <button onClick={() => setView('generator')} className='btn generate_btn'>Generate QR Code</button>
        <button onClick={() => setView('scanner')} className='btn scan_btn'>Scan QR Code</button>
      </div>
      {view === 'generator' ? <QRGenerator /> : <QRScanner />}
    </div>
  );
}

export default App;