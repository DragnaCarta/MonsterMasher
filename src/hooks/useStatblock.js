import { useState, useEffect } from 'react';
import { armorTypes } from '../constants/armorTypes';
import { calculateModifier } from '../utils/calculations';

export const useStatblock = () => {
  const [name, setName] = useState('');
  const [size, setSize] = useState('Medium');
  const [abilityScores, setAbilityScores] = useState({
    STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10
  });
  const [armorClass, setArmorClass] = useState({ type: 'Natural Armor', value: 10 });
  const [hitDice, setHitDice] = useState(1);
  const [actions, setActions] = useState([{ name: '', description: '', attack: null }]);

  useEffect(() => {
    updateArmorClass(armorClass.type);
  }, [abilityScores.DEX, armorClass.type]);

  const updateArmorClass = (type, customValue) => {
    const armorInfo = armorTypes[type];
    let newAC = armorInfo.base;
    if (armorInfo.useDex) {
      const dexMod = calculateModifier(abilityScores.DEX);
      newAC += armorInfo.maxDex ? Math.min(dexMod, armorInfo.maxDex) : dexMod;
    }
    setArmorClass({ type, value: type === 'Custom' ? customValue : newAC });
  };

  const addNewAction = () => {
    setActions(prev => [...prev, { name: '', description: '', attack: null }]);
  };

  const updateAction = (index, updatedAction) => {
    setActions(prev => prev.map((action, i) => i === index ? updatedAction : action));
  };

  const removeAction = (index) => {
    setActions(prev => prev.filter((_, i) => i !== index));
  };

  const loadStatblock = (data) => {
    setName(data.name);
    setSize(data.size);
    setAbilityScores(data.abilityScores);
    setArmorClass(data.armorClass);
    setHitDice(data.hitDice);
    setActions(data.actions);
  };

  return {
    name, setName,
    size, setSize,
    abilityScores, setAbilityScores,
    armorClass, setArmorClass,
    hitDice, setHitDice,
    actions, setActions,
    updateArmorClass,
    addNewAction,
    updateAction,
    removeAction,
    loadStatblock
  };
};