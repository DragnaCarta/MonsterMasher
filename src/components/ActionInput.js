import React from 'react';
import { damageTypes, diceTypes } from '../utils/actionHelpers';
import { calculateModifier, calculateAverageDamage } from '../utils/calculations';
import AttackInputFields from './AttackInputFields';
import SavingThrowInputFields from './SavingThrowInputFields';

const ActionInput = ({ action, updateAction, removeAction, abilityScores = {}, proficiencyBonus = 2 }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateAction({ ...action, [name]: value });
  };

  const handleAttackChange = (e) => {
    const { name, value } = e.target;
    updateAction({
      ...action,
      attack: {
        ...(action.attack || {}),
        [name]: value
      }
    });
  };

  const handleSavingThrowChange = (e) => {
    const { name, value } = e.target;
    updateAction({
      ...action,
      savingThrow: {
        ...action.savingThrow,
        ...value
      }
    });
  };

  const handleActionTypeChange = (e) => {
    const actionType = e.target.value;
    let updatedAction = { ...action };

    if (actionType === 'attack') {
      updatedAction.attack = {
        type: 'melee',
        range: '5 ft.',
        targets: '1',
        abilityScore: 'STR',
        damageDice: '1d6',
        damageType: 'slashing',
        addAbilityToDamage: true
      };
      updatedAction.savingThrow = null;
    } else if (actionType === 'savingThrow') {
      const defaultAbilityScore = 'DEX';
      const defaultAbilityValue = abilityScores[defaultAbilityScore] || 10;
      updatedAction.savingThrow = {
        abilityScore: defaultAbilityScore,
        saveDC: 8 + proficiencyBonus + Math.floor((defaultAbilityValue - 10) / 2),
        type: 'targeted',
        targets: 1,
        range: '60 ft',
        damageDice: '8d6',
        damageType: 'fire',
        halfDamageOnSave: true
      };
      updatedAction.attack = null;
    } else {
      updatedAction.attack = null;
      updatedAction.savingThrow = null;
    }

    updateAction(updatedAction);
  };

  const getActionType = () => {
    if (action.attack) return 'attack';
    if (action.savingThrow) return 'savingThrow';
    return 'custom';
  };

  return (
    <div className="mb-4 p-4 border rounded">
      <div className="flex mb-2">
        <input
          type="text"
          name="name"
          value={action.name}
          onChange={handleChange}
          placeholder="Action Name"
          className="flex-grow p-2 border rounded mr-2"
        />
        <select
          value={getActionType()}
          onChange={handleActionTypeChange}
          className="p-2 border rounded"
        >
          <option value="custom">Custom</option>
          <option value="attack">Attack</option>
          <option value="savingThrow">Saving Throw</option>
        </select>
      </div>
      
      {action.attack && (
        <AttackInputFields
          attack={action.attack}
          handleAttackChange={handleAttackChange}
          abilityScores={abilityScores}
          proficiencyBonus={proficiencyBonus}
        />
      )}
      {action.savingThrow && (
        <SavingThrowInputFields
          savingThrow={action.savingThrow}
          handleSavingThrowChange={handleSavingThrowChange}
          abilityScores={abilityScores}
          proficiencyBonus={proficiencyBonus}
        />
      )}
      <textarea
        name="description"
        value={action.description}
        onChange={handleChange}
        placeholder="Action Description"
        className="w-full p-2 border rounded mb-2"
      />
      <button onClick={removeAction} className="bg-red-500 text-white px-4 py-2 rounded">
        Remove Action
      </button>
    </div>
  );
};

export default ActionInput;