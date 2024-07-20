import React from 'react';
import { sizeDice } from '../../constants/sizeDice';

const BasicInfoSection = ({ name, setName, size, setSize }) => {
  return (
    <>
      <div className="mb-4">
        <label className="block mb-2">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Size</label>
        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="w-full p-2 border rounded"
        >
          {Object.keys(sizeDice).map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </>
  );
};

export default BasicInfoSection;