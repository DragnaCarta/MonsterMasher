import React from 'react';
import { sizeDice } from '../constants/sizeDice';

const BasicInfoSection = ({ name, setName, size, setSize }) => {
  return (
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
      <span className="text-sm">creature</span>
    </div>
  );
};

export default BasicInfoSection;