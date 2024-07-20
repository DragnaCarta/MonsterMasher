import React from 'react';
import SavingThrowInputFields from './SavingThrowInputFields';

const ReactionInput = ({
  reaction,
  updateReaction,
  removeReaction,
  abilityScores,
  proficiencyBonus,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateReaction({ ...reaction, [name]: value });
  };

  const handleSavingThrowChange = (e) => {
    const { value } = e.target;
    updateReaction({
      ...reaction,
      savingThrow: {
        ...reaction.savingThrow,
        ...value,
      },
    });
  };

  const handleReactionTypeChange = (e) => {
    const reactionType = e.target.value;
    let updatedReaction = { ...reaction, type: reactionType };

    if (reactionType === 'savingThrow') {
      const defaultAbilityScore = 'DEX';
      const defaultAbilityValue = abilityScores[defaultAbilityScore] || 10;
      updatedReaction.savingThrow = {
        abilityScore: defaultAbilityScore,
        saveDC:
          8 + proficiencyBonus + Math.floor((defaultAbilityValue - 10) / 2),
        type: 'targeted',
        targets: 1,
        range: '60 ft',
        damageDice: '8d6',
        damageType: 'fire',
        halfDamageOnSave: true,
      };
    } else {
      updatedReaction.savingThrow = null;
    }
    updateReaction(updatedReaction);
  };

  return (
    <div className="mb-4 p-4 border rounded">
      <div className="flex mb-2">
        <input
          type="text"
          name="name"
          value={reaction.name}
          onChange={handleChange}
          placeholder="Reaction Name"
          className="flex-grow p-2 border rounded mr-2"
        />
        <select
          value={reaction.type || 'custom'}
          onChange={handleReactionTypeChange}
          className="p-2 border rounded"
        >
          <option value="custom">Custom</option>
          <option value="savingThrow">Saving Throw</option>
        </select>
      </div>

      <div className="mb-2">
        <span>In response to </span>
        <input
          type="text"
          name="trigger"
          value={reaction.trigger || ''}
          onChange={handleChange}
          placeholder="Reaction trigger"
          className="p-2 border rounded"
        />
        <span>, this creature </span>
      </div>

      {reaction.type === 'savingThrow' && (
        <SavingThrowInputFields
          savingThrow={reaction.savingThrow}
          handleSavingThrowChange={handleSavingThrowChange}
          abilityScores={abilityScores}
          proficiencyBonus={proficiencyBonus}
        />
      )}

      <textarea
        name="description"
        value={reaction.description}
        onChange={handleChange}
        placeholder="Reaction Description"
        className="w-full p-2 border rounded mb-2"
      />
      <button
        onClick={removeReaction}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Remove Reaction
      </button>
    </div>
  );
};

export default ReactionInput;
