import React from 'react';
import ActionInput from './ActionInput';

const BonusActionsSection = ({ bonusActions, updateBonusAction, addNewBonusAction, removeBonusAction, abilityScores, proficiencyBonus }) => {
  return (
    <div className="mb-4">
      <h3 className="text-xl font-bold mb-2">Bonus Actions</h3>
      <div className="space-y-4">
        {bonusActions.map((action, index) => (
          <ActionInput
            key={index}
            action={action}
            updateAction={(updatedAction) => updateBonusAction(index, updatedAction)}
            removeAction={() => removeBonusAction(index)}
            abilityScores={abilityScores}
            proficiencyBonus={proficiencyBonus}
          />
        ))}
      </div>
      <button 
        onClick={addNewBonusAction} 
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Add New Bonus Action
      </button>
    </div>
  );
};

export default BonusActionsSection;