import React, { useState, useEffect } from 'react';
import { armorTypes } from '../constants/armorTypes';
import { calculateModifier } from '../utils/calculations';

const ArmorClassSection = ({ armorClass, updateArmorClass, dexterity }) => {
  const [armorCategory, setArmorCategory] = useState('unarmored');
  const [selectedArmorType, setSelectedArmorType] = useState('');
  const [customAC, setCustomAC] = useState(10);

  useEffect(() => {
    calculateAndUpdateAC(armorClass.type);
  }, [dexterity, armorClass.type]);

  const calculateAndUpdateAC = (type, customValue = null) => {
    const armorInfo = armorTypes[type];
    let newAC;

    if (type === 'Natural Armor' && customValue !== null) {
      newAC = customValue;
    } else if (armorInfo) {
      newAC = armorInfo.base;
      if (armorInfo.useDex) {
        const dexMod = calculateModifier(dexterity);
        newAC += armorInfo.maxDex ? Math.min(dexMod, armorInfo.maxDex) : dexMod;
      }
    } else {
      // Default to unarmored if type is not recognized
      newAC = 10 + calculateModifier(dexterity);
      type = 'Unarmored';
    }

    updateArmorClass(type, newAC);
  };

  const handleArmorTypeChange = (type) => {
    setSelectedArmorType(type);
    calculateAndUpdateAC(type);
  };

  const handleCustomACChange = (value) => {
    const newAC = parseInt(value);
    setCustomAC(newAC);
    if (armorCategory === 'natural') {
      calculateAndUpdateAC('Natural Armor', newAC);
    }
  };

  const getArmorFormula = (type) => {
    const info = armorTypes[type];
    let formula = `${info.base}`;
    if (info.useDex) {
      formula += ' + DEX';
      if (info.maxDex) {
        formula += ` (max ${info.maxDex})`;
      }
    }
    return formula;
  };

  return (
    <div className="mb-4">
      <label className="block mb-2 font-bold">Armor Class</label>
      <div className="mb-2">
        <select
          value={armorCategory}
          onChange={(e) => setArmorCategory(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="unarmored">Unarmored</option>
          <option value="armor">Armor</option>
          <option value="spell">Spell</option>
          <option value="natural">Natural Armor</option>
        </select>
      </div>
      {armorCategory === 'armor' && (
        <div className="mb-2">
          <select
            value={selectedArmorType}
            onChange={(e) => handleArmorTypeChange(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Armor Type</option>
            {Object.entries(armorTypes)
              .filter(([, info]) => !info.isSpell && !info.isNatural)
              .map(([type]) => (
                <option key={type} value={type}>
                  {type} ({getArmorFormula(type)})
                </option>
              ))}
          </select>
        </div>
      )}
      {armorCategory === 'spell' && (
        <div className="mb-2">
          <select
            value={selectedArmorType}
            onChange={(e) => handleArmorTypeChange(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Spell Effect</option>
            {Object.entries(armorTypes)
              .filter(([, info]) => info.isSpell)
              .map(([type]) => (
                <option key={type} value={type}>
                  {type} ({getArmorFormula(type)})
                </option>
              ))}
          </select>
        </div>
      )}
      {armorCategory === 'natural' && (
        <div className="mb-2">
          <input
            type="number"
            value={customAC}
            onChange={(e) => handleCustomACChange(e.target.value)}
            className="w-full p-2 border rounded"
            min="1"
          />
        </div>
      )}
      <div className="mt-2">
        <strong>Current AC:</strong> {armorClass.value} ({armorClass.type})
      </div>
    </div>
  );
};

export default ArmorClassSection;