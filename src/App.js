import React from 'react';
import { StatblockForm } from './components/StatblockForm';
import { StatblockPreview } from './components/StatblockPreview';
import { useStatblock } from './hooks/useStatblock';
import { generateStatblockText, downloadTextFile } from './utils/exportHelpers';
import { Save, Download } from 'lucide-react';

function App() {
  const statblock = useStatblock();

  const handleExport = () => {
    const statblockText = generateStatblockText(statblock);
    downloadTextFile(`${statblock.name}_statblock.txt`, statblockText);
  };

  const handleSave = () => {
    const data = JSON.stringify(statblock);
    localStorage.setItem('monsterMasherStatblock', data);
    alert('Statblock saved!');
  };

  const handleLoad = () => {
    const data = JSON.parse(localStorage.getItem('monsterMasherStatblock'));
    if (data) {
      statblock.loadStatblock(data);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Monster Masher</h1>
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-3/5 lg:pr-4 mb-4 lg:mb-0">
          <StatblockForm statblock={statblock} />
          <div className="flex space-x-2 mt-4">
            <button onClick={handleSave} className="btn btn-primary flex items-center">
              <Save className="mr-2" /> Save
            </button>
            <button onClick={handleLoad} className="btn btn-secondary">
              Load
            </button>
            <button onClick={handleExport} className="btn btn-primary flex items-center">
              <Download className="mr-2" /> Export
            </button>
          </div>
        </div>
        <div className="w-full lg:w-2/5 lg:pl-4">
          <div className="lg:sticky lg:top-4">
            <StatblockPreview statblock={statblock} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;