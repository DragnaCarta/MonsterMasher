import React from 'react';
import { ActionInput } from './ActionInput';

const ActionsSection = ({ actions, updateAction, addNewAction, removeAction, abilityScores }) => {
  return (
    <div className="mb-4">
      <label className="block mb-2 font-bold">Actions</label>
      <div className="space-y-4">
        {actions.map((action, index) => (
          <ActionInput
            key={index}
            action={action}
            updateAction={(updatedAction) => updateAction(index, updatedAction)}
            removeAction={() => removeAction(index)}
            abilityScores={abilityScores}
          />
        ))}
      </div>
      <button 
        onClick={addNewAction} 
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Add New Action
      </button>
    </div>
  );
};

export default ActionsSection;