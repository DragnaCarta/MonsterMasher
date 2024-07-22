import React from 'react';
import { sizeDice } from '../constants/sizeDice';

const BasicInfoSection = ({ name, setName, size, setSize }) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input w-full"
          placeholder="Enter creature name"
        />
      </div>
      <div>
        <label htmlFor="size" className="block text-sm font-medium mb-1">Size</label>
        <select
          id="size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="select w-full"
        >
          {Object.keys(sizeDice).map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default BasicInfoSection;