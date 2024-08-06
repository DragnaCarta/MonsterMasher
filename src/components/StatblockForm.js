import React from 'react';
import Collapsible from './Collapsible';
import BasicInfoSection from './BasicInfoSection';
import AbilityScoresSection from './AbilityScoresSection';
import CombatStatsSection from './CombatStatsSection';
import ActionsSection from './ActionsSection';
import BonusActionsSection from './BonusActionsSection';
import ReactionsSection from './ReactionsSection';

export const StatblockForm = ({ statblock }) => {
  const {
    name,
    setName,
    size,
    setSize,
    type,
    setType,
    alignment,
    setAlignment,
    abilityScores,
    setAbilityScores,
    armorClass,
    updateArmorClass,
    proficiencyBonus,
    hitDice,
    setHitDice,
    speed,
    setSpeed,
    actions,
    updateAction,
    addNewAction,
    removeAction,
    bonusActions,
    updateBonusAction,
    addNewBonusAction,
    removeBonusAction,
    reactions,
    updateReaction,
    addNewReaction,
    removeReaction,
  } = statblock;

  return (
    <div className="space-y-6">
      <Collapsible title="Basic Information">
        <BasicInfoSection
          name={name}
          setName={setName}
          size={size}
          setSize={setSize}
          type={type}
          setType={setType}
          alignment={alignment}
          setAlignment={setAlignment}
        />
      </Collapsible>

      <Collapsible title="Ability Scores">
        <AbilityScoresSection
          abilityScores={abilityScores}
          setAbilityScores={setAbilityScores}
        />
      </Collapsible>

      <Collapsible title="Combat Statistics">
        <CombatStatsSection
          armorClass={armorClass}
          updateArmorClass={updateArmorClass}
          hitDice={hitDice}
          setHitDice={setHitDice}
          size={size}
          abilityScores={abilityScores}
          speed={speed}
          setSpeed={setSpeed}
        />
      </Collapsible>

      <Collapsible title="Actions">
        <ActionsSection
          actions={actions}
          updateAction={updateAction}
          addNewAction={addNewAction}
          removeAction={removeAction}
          abilityScores={abilityScores}
          proficiencyBonus={proficiencyBonus}
        />
      </Collapsible>

      <Collapsible title="Bonus Actions">
        <BonusActionsSection
          bonusActions={bonusActions}
          updateBonusAction={updateBonusAction}
          addNewBonusAction={addNewBonusAction}
          removeBonusAction={removeBonusAction}
          abilityScores={abilityScores}
          proficiencyBonus={proficiencyBonus}
        />
      </Collapsible>

      <Collapsible title="Reactions">
        <ReactionsSection
          reactions={reactions}
          updateReaction={updateReaction}
          addNewReaction={addNewReaction}
          removeReaction={removeReaction}
          abilityScores={abilityScores}
          proficiencyBonus={proficiencyBonus}
        />
      </Collapsible>
    </div>
  );
};
