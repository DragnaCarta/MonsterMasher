import React from 'react';
import { ActionInput } from '../ActionInput';

const ActionsSection = ({ actions, setActions, newAction, setNewAction, handleAddAction }) => {
  return (
    <div className="mb-4">
      <label className="block mb-2 font-bold">Actions</label>
      <ActionInput
        newAction={newAction}
        setNewAction={setNewAction}
        handleAddAction={handleAddAction}
      />
      {actions.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Current Actions:</h3>
          {actions.map((action, index) => (
            <div key={index} className="mb-2 p-2 border rounded">
              <h4 className="font-semibold">{action.name}</h4>
              <p>{action.description}</p>
              {action.attack && (
                <p className="mt-1">
                  <span className="font-semibold">Attack:</span> {action.attack.type}, {action.attack.range}, 
                  {action.attack.targets} target(s), {action.attack.damageDice} {action.attack.damageType} damage
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionsSection;