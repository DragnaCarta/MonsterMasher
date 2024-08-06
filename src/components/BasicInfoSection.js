import React from 'react';
import { sizeDice } from '../constants/sizeDice';
import { creatureTypes, alignments } from '../constants/creatureConstants';

const BasicInfoSection = ({ name, setName, size, setSize, type, setType, alignment, setAlignment }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input flex-grow"
          placeholder="Enter creature name"
        />
        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="select"
        >
          {Object.keys(sizeDice).map(s => (
            <option key={s} value={s}>{s.toLowerCase()}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center space-x-2">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="select flex-grow"
        >
          <option value="">Select creature type</option>
          {creatureTypes.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select
          value={alignment}
          onChange={(e) => setAlignment(e.target.value)}
          className="select flex-grow"
        >
          <option value="">Select alignment</option>
          {alignments.map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default BasicInfoSection;