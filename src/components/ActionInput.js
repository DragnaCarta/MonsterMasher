import React, { useState } from 'react';
import { validateAction } from '../utils/actionHelpers';
import AttackInputFields from './AttackInputFields';

export const ActionInput = ({ action, updateAction, removeAction }) => {
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

  const adjustDamageDice = (amount) => {
    const currentDice = parseInt(action.attack?.damageDice?.split('d')[0] || '0');
    const newDice = Math.max(1, currentDice + amount);
    const diceType = action.attack?.damageDice?.split('d')[1] || '6';
    updateAction({
      ...action,
      attack: {
        ...action.attack,
        damageDice: `${newDice}d${diceType}`
      }
    });
  };

  const toggleAttack = () => {
    if (action.attack) {
      updateAction({ ...action, attack: null });
    } else {
      updateAction({
        ...action,
        attack: {
          type: 'melee',
          range: '5 ft.',
          targets: '1',
          abilityScore: 'STR',
          damageDice: '1d6',
          damageType: 'slashing',
          addAbilityToDamage: true
        }
      });
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
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={!!action.attack}
            onChange={toggleAttack}
            className="mr-2"
          />
          Attack
        </label>
      </div>
      {action.attack && (
        <AttackInputFields
          attack={action.attack}
          handleAttackChange={handleAttackChange}
          adjustDamageDice={adjustDamageDice}
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