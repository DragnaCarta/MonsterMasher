import React from 'react';
import { StatblockForm } from './components/StatblockForm/StatblockForm';
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
    <div className="container mx-auto p-4 flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 pr-4">
        <h1 className="text-2xl font-bold mb-4">Monster Masher</h1>
        <StatblockForm statblock={statblock} />
        <div className="flex space-x-2 mt-4">
          <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded flex items-center">
            <Save className="mr-2" /> Save
          </button>
          <button onClick={handleLoad} className="bg-yellow-500 text-white px-4 py-2 rounded">
            Load
          </button>
          <button onClick={handleExport} className="bg-purple-500 text-white px-4 py-2 rounded flex items-center">
            <Download className="mr-2" /> Export
          </button>
        </div>
      </div>
      <div className="w-full md:w-1/2 mt-4 md:mt-0">
        <StatblockPreview statblock={statblock} />
      </div>
    </div>
  );
}

export default App;