import React from 'react';
import ReactionInput from './ReactionInput';

const ReactionsSection = ({
  reactions,
  updateReaction,
  addNewReaction,
  removeReaction,
  abilityScores,
  proficiencyBonus,
}) => {
  return (
    <div className="mb-4">
      <h3 className="text-xl font-bold mb-2">Reactions</h3>
      <div className="space-y-4">
        {reactions.map((reaction, index) => (
          <ReactionInput
            key={index}
            reaction={reaction}
            updateReaction={(updatedReaction) =>
              updateReaction(index, updatedReaction)
            }
            removeReaction={() => removeReaction(index)}
            abilityScores={abilityScores}
            proficiencyBonus={proficiencyBonus}
          />
        ))}
      </div>
      <button
        onClick={addNewReaction}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Add New Reaction
      </button>
    </div>
  );
};

export default ReactionsSection;
