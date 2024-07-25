import { useState } from 'react';

export const useStatblock = () => {
  const [name, setName] = useState('');
  const [size, setSize] = useState('Medium');
  const [abilityScores, setAbilityScores] = useState({
    STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10
  });
  const [armorClass, setArmorClass] = useState({ type: 'Natural Armor', value: 10 });
  const [hitDice, setHitDice] = useState(1);
  const [actions, setActions] = useState([{ 
    name: '', 
    description: '', 
    attack: null, 
    savingThrow: null 
  }]);

  const updateArmorClass = (type, value) => {
    setArmorClass({ type, value });
  };

  const addNewAction = () => {
    setActions(prev => [...prev, { 
      name: '', 
      description: '', 
      attack: null, 
      savingThrow: {
        abilityScore: 'DEX',
        type: 'targeted',
        targets: 1,
        range: 60,
        damageDice: '8d6',
        damageType: 'fire',
        halfDamageOnSave: true
      }
    }]);
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
    setActions(data.actions.map(action => ({
      ...action,
      attack: action.attack || null,
      savingThrow: action.savingThrow || null
    })));
  };

  return {
    name, setName,
    size, setSize,
    abilityScores, setAbilityScores,
    armorClass, updateArmorClass,
    hitDice, setHitDice,
    actions, setActions,
    updateAction,
    addNewAction,
    removeAction,
    loadStatblock
  };
};