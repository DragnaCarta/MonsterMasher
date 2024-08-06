import { useState } from 'react';
import {
  calculateCR,
  calculateHP,
  calculateModifier,
  getProficiencyBonus,
} from '../utils/calculations';

export const useStatblock = () => {
  const [name, setName] = useState('');
  const [size, setSize] = useState('Medium');
  const [type, setType] = useState(''); // New state for creature type
  const [alignment, setAlignment] = useState(''); // New state for alignment
  const [abilityScores, setAbilityScores] = useState({
    STR: 10,
    DEX: 10,
    CON: 10,
    INT: 10,
    WIS: 10,
    CHA: 10,
  });
  const [armorClass, setArmorClass] = useState({
    type: 'Natural Armor',
    value: 10,
  });
  const [hitDice, setHitDice] = useState(1);
  const [speed, setSpeed] = useState(30);
  const [actions, setActions] = useState([
    {
      name: '',
      description: '',
      attack: null,
      savingThrow: null,
    },
  ]);
  const [bonusActions, setBonusActions] = useState([
    {
      name: '',
      description: '',
      attack: null,
      savingThrow: null,
    },
  ]);
  const [reactions, setReactions] = useState([
    {
      name: '',
      description: '',
      trigger: '',
      type: 'custom',
      savingThrow: null,
    },
  ]);

  const updateArmorClass = (type, value) => {
    setArmorClass({ type, value });
  };

  const addNewAction = () => {
    setActions((prev) => [
      ...prev,
      {
        name: '',
        description: '',
        attack: null,
        savingThrow: null,
      },
    ]);
  };

  const updateAction = (index, updatedAction) => {
    setActions((prev) =>
      prev.map((action, i) => (i === index ? updatedAction : action))
    );
  };

  const removeAction = (index) => {
    setActions((prev) => prev.filter((_, i) => i !== index));
  };

  const addNewBonusAction = () => {
    setBonusActions((prev) => [
      ...prev,
      {
        name: '',
        description: '',
        attack: null,
        savingThrow: null,
      },
    ]);
  };

  const updateBonusAction = (index, updatedBonusAction) => {
    setBonusActions((prev) =>
      prev.map((action, i) => (i === index ? updatedBonusAction : action))
    );
  };

  const removeBonusAction = (index) => {
    setBonusActions((prev) => prev.filter((_, i) => i !== index));
  };

  const addNewReaction = () => {
    setReactions((prev) => [
      ...prev,
      {
        name: '',
        description: '',
        trigger: '',
        type: 'custom',
        savingThrow: null,
      },
    ]);
  };

  const updateReaction = (index, updatedReaction) => {
    setReactions((prev) =>
      prev.map((reaction, i) => (i === index ? updatedReaction : reaction))
    );
  };

  const removeReaction = (index) => {
    setReactions((prev) => prev.filter((_, i) => i !== index));
  };

  const loadStatblock = (data) => {
    setName(data.name);
    setSize(data.size);
    setType(data.type); // Load type
    setAlignment(data.alignment); // Load alignment
    setAbilityScores(data.abilityScores);
    setArmorClass(data.armorClass);
    setHitDice(data.hitDice);
    setActions(
      data.actions.map((action) => ({
        ...action,
        attack: action.attack || null,
        savingThrow: action.savingThrow || null,
      }))
    );
    setBonusActions(
      data.bonusActions?.map((action) => ({
        ...action,
        attack: action.attack || null,
        savingThrow: action.savingThrow || null,
      })) || []
    );
    setReactions(
      data.reactions?.map((reaction) => ({
        ...reaction,
        savingThrow: reaction.savingThrow || null,
      })) || []
    );
  };

  const conModifier = calculateModifier(abilityScores.CON);
  const hp = calculateHP(size, hitDice, conModifier);
  const { cr, ocr, dcr } = calculateCR(
    hp,
    armorClass.value,
    actions,
    bonusActions,
    reactions,
    abilityScores
  );
  const proficiencyBonus = getProficiencyBonus(cr);

  return {
    name,
    setName,
    size,
    setSize,
    type, 
    setType, 
    alignment, 
    setAlignment,
    abilityScores,
    setAbilityScores,
    armorClass,
    updateArmorClass,
    hitDice,
    setHitDice,
    speed,
    setSpeed,
    actions,
    proficiencyBonus,
    cr,
    ocr,
    dcr,
    hp,
    setActions,
    updateAction,
    addNewAction,
    removeAction,
    bonusActions,
    setBonusActions,
    updateBonusAction,
    addNewBonusAction,
    removeBonusAction,
    reactions,
    setReactions,
    updateReaction,
    addNewReaction,
    removeReaction,
    loadStatblock,
  };
};
