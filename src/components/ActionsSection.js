import React from 'react';
import { ActionInput } from './ActionInput';

const ActionsSection = ({ actions, updateAction, addNewAction, removeAction }) => {
  return (
    <div className="mb-4">
      <label className="block mb-2 font-bold">Actions</label>
      {actions.map((action, index) => (
        <ActionInput
          key={index}
          action={action}
          updateAction={(updatedAction) => updateAction(index, updatedAction)}
          removeAction={() => removeAction(index)}
        />
      ))}
      <button 
        onClick={addNewAction} 
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add New Action
      </button>
    </div>
  );
};

export default ActionsSection;