import React, { useState, useEffect } from 'react';
import { armorTypes } from '../constants/armorTypes';
import { calculateModifier } from '../utils/calculations';

const ArmorClassSection = ({ armorClass, updateArmorClass, dexterity }) => {
  const [armorCategory, setArmorCategory] = useState('unarmored');
  const [selectedArmorType, setSelectedArmorType] = useState('');

  useEffect(() => {
    calculateAndUpdateAC(armorClass.type);
  }, [dexterity, armorClass.type]);

  const calculateAndUpdateAC = (type) => {
    const armorInfo = armorTypes[type];
    let newAC;

    if (armorInfo) {
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

  return (
    <div className="flex items-center space-x-2">
      <span className="font-bold">Armor Class</span>
      <span>{armorClass.value}</span>
      <select
        value={armorCategory}
        onChange={(e) => setArmorCategory(e.target.value)}
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
          {Object.keys(armorTypes).map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      )}
    </div>
  );
};

export default ArmorClassSection;