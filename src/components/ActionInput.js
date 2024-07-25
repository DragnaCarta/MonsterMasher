import React, { useState } from 'react';
import { validateAction } from '../utils/actionHelpers';
import AttackInputFields from './AttackInputFields';
import SavingThrowInputFields from './SavingThrowInputFields';

export const ActionInput = ({ action, updateAction, removeAction, abilityScores = {}, proficiencyBonus = 2 }) => {
  const [errors, setErrors] = useState([]);

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

  const toggleActionType = (type) => {
    if (action[type]) {
      updateAction({ ...action, [type]: null });
    } else {
      const newAction = { ...action };
      if (type === 'attack') {
        newAction.attack = {
          type: 'melee',
          range: '5 ft.',
          targets: '1',
          abilityScore: 'STR',
          damageDice: '1d6',
          damageType: 'slashing',
          addAbilityToDamage: true
        };
        newAction.savingThrow = null;
      } else if (type === 'savingThrow') {
        const defaultAbilityScore = 'DEX';
        const defaultAbilityValue = abilityScores[defaultAbilityScore] || 10;
        newAction.savingThrow = {
          abilityScore: defaultAbilityScore,
          saveDC: 8 + proficiencyBonus + Math.floor((defaultAbilityValue - 10) / 2),
          type: 'targeted',
          targets: 1,
          range: '60 ft',
          damageDice: '8d6',
          damageType: 'fire',
          halfDamageOnSave: true
        };
        newAction.attack = null;
      }
      updateAction(newAction);
    }
  };

  const handleSubmit = () => {
    const validationErrors = validateAction(action);
    if (validationErrors.length === 0) {
      setErrors([]);
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="mb-4 p-4 border rounded">
      <input
        type="text"
        name="name"
        value={action.name}
        onChange={handleChange}
        placeholder="Action Name"
        className="w-full p-2 border rounded mb-2"
      />
      <div className="mb-2">
        <label className="flex items-center mr-4 inline-block">
          <input
            type="checkbox"
            checked={!!action.attack}
            onChange={() => toggleActionType('attack')}
            className="mr-2"
          />
          Attack
        </label>
        <label className="flex items-center inline-block">
          <input
            type="checkbox"
            checked={!!action.savingThrow}
            onChange={() => toggleActionType('savingThrow')}
            className="mr-2"
          />
          Saving Throw
        </label>
      </div>
      {action.attack && (
        <AttackInputFields
          attack={action.attack}
          handleAttackChange={handleAttackChange}
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
      <div className="flex justify-between">
        <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
          Validate Action
        </button>
        <button onClick={removeAction} className="bg-red-500 text-white px-4 py-2 rounded">
          Remove Action
        </button>
      </div>
      {errors.length > 0 && (
        <div className="mt-2 text-red-500">
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionInput;