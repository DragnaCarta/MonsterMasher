import React, { useState, useEffect } from 'react';
import { armorTypes } from '../constants/armorTypes';
import { calculateModifier } from '../utils/calculations';

const ArmorClassSection = ({ armorClass, updateArmorClass, dexterity }) => {
  const [armorCategory, setArmorCategory] = useState('unarmored');
  const [selectedArmorType, setSelectedArmorType] = useState('');
  const [manualAC, setManualAC] = useState(armorClass.value);

  useEffect(() => {
    calculateAndUpdateAC(armorClass.type);
  }, [dexterity, armorClass.type]);

  const calculateAndUpdateAC = (type) => {
    const armorInfo = armorTypes[type];
    let newAC;

    if (armorInfo) {
      if (type === 'Natural Armor' && armorCategory === 'natural') {
        newAC = manualAC;
      } else {
        newAC = armorInfo.base;
        if (armorInfo.useDex) {
          const dexMod = calculateModifier(dexterity);
          newAC += armorInfo.maxDex ? Math.min(dexMod, armorInfo.maxDex) : dexMod;
        }
      }
    } else {
      newAC = 10 + calculateModifier(dexterity);
      type = 'Unarmored';
    }

    updateArmorClass(type, newAC);
  };

  const handleArmorTypeChange = (type) => {
    setSelectedArmorType(type);
    calculateAndUpdateAC(type);
  };

  const handleArmorCategoryChange = (category) => {
    setArmorCategory(category);
    if (category === 'natural') {
      setSelectedArmorType('Natural Armor');
      calculateAndUpdateAC('Natural Armor');
    } else {
      setSelectedArmorType('');
      calculateAndUpdateAC('');
    }
  };

  const handleManualACChange = (e) => {
    const newAC = parseInt(e.target.value) || 10;
    setManualAC(newAC);
    updateArmorClass('Natural Armor', newAC);
  };

  return (
    <div className="flex flex-wrap items-center space-x-2">
      <span className="font-bold">Armor Class</span>
      <span>{armorClass.value}</span>
      <select
        value={armorCategory}
        onChange={(e) => handleArmorCategoryChange(e.target.value)}
        className="select"
      >
        <option value="unarmored">Unarmored</option>
        <option value="armor">Armor</option>
        <option value="natural">Natural Armor</option>
      </select>
      {armorCategory === 'armor' && (
        <select
          value={selectedArmorType}
          onChange={(e) => handleArmorTypeChange(e.target.value)}
          className="select"
        >
          <option value="">Select Armor Type</option>
          {Object.keys(armorTypes).filter(type => type !== 'Natural Armor').map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      )}
      {armorCategory === 'natural' && (
        <input
          type="number"
          value={manualAC}
          onChange={handleManualACChange}
          className="input w-16 text-center"
          min="1"
        />
      )}
    </div>
  );
};

export default ArmorClassSection;