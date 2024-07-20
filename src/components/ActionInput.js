import React, { useState } from 'react';
import { validateAction } from '../utils/actionHelpers';
import AttackInputFields from './AttackInputFields';

export const ActionInput = ({ newAction, setNewAction, handleAddAction }) => {
  const [isAttack, setIsAttack] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleAttackChange = (e) => {
    const { name, value } = e.target;
    setNewAction(prev => ({
      ...prev,
      attack: {
        ...prev.attack,
        [name]: value
      }
    }));
  };

  const adjustDamageDice = (amount) => {
    const currentDice = parseInt(newAction.attack?.damageDice?.split('d')[0] || '0');
    const newDice = Math.max(1, currentDice + amount);
    const diceType = newAction.attack?.damageDice?.split('d')[1] || '6';
    setNewAction(prev => ({
      ...prev,
      attack: {
        ...prev.attack,
        damageDice: `${newDice}d${diceType}`
      }
    }));
  };

  const handleSubmit = () => {
    const validationErrors = validateAction(newAction);
    if (validationErrors.length === 0) {
      handleAddAction();
      setErrors([]);
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={newAction.name}
        onChange={(e) => setNewAction({ ...newAction, name: e.target.value })}
        placeholder="Action Name"
        className="w-full p-2 border rounded mb-2"
      />
      <div className="mb-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isAttack}
            onChange={() => {
              setIsAttack(!isAttack);
              if (!isAttack) {
                setNewAction(prev => ({
                  ...prev,
                  attack: {
                    type: 'melee',
                    range: '',
                    targets: '1',
                    abilityScore: 'STR',
                    damageDice: '1d6',
                    damageType: 'slashing',
                    addAbilityToDamage: true
                  }
                }));
              } else {
                setNewAction(prev => {
                  const { attack, ...rest } = prev;
                  return rest;
                });
              }
            }}
            className="mr-2"
          />
          Attack
        </label>
      </div>
      {isAttack && (
        <AttackInputFields
          attack={newAction.attack}
          handleAttackChange={handleAttackChange}
          adjustDamageDice={adjustDamageDice}
        />
      )}
      <textarea
        value={newAction.description}
        onChange={(e) => setNewAction({ ...newAction, description: e.target.value })}
        placeholder="Action Description"
        className="w-full p-2 border rounded mb-2"
      />
      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
        Add Action
      </button>
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