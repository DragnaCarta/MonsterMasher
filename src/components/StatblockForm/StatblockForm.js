import React from 'react';
import BasicInfoSection from './BasicInfoSection';
import AbilityScoresSection from './AbilityScoresSection';
import ArmorClassSection from './ArmorClassSection';
import HitPointsSection from './HitPointsSection';
import ActionsSection from './ActionsSection';

export const StatblockForm = ({ statblock }) => {
  const {
    name, setName,
    size, setSize,
    abilityScores, setAbilityScores,
    armorClass, updateArmorClass,
    hitDice, setHitDice,
    actions, setActions,
    newAction, setNewAction,
    handleAddAction
  } = statblock;

  return (
    <div>
      <BasicInfoSection name={name} setName={setName} size={size} setSize={setSize} />
      <AbilityScoresSection abilityScores={abilityScores} setAbilityScores={setAbilityScores} />
      <ArmorClassSection 
        armorClass={armorClass} 
        updateArmorClass={updateArmorClass}
        dexterity={abilityScores.DEX}
      />
      <HitPointsSection
        hitDice={hitDice}
        setHitDice={setHitDice}
        size={size}
        constitutionScore={abilityScores.CON}
      />
      <ActionsSection
        actions={actions}
        setActions={setActions}
        newAction={newAction}
        setNewAction={setNewAction}
        handleAddAction={handleAddAction}
      />
    </div>
  );
};