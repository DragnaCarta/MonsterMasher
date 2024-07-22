import React from 'react';
import Collapsible from './Collapsible';
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
    actions, updateAction, addNewAction, removeAction
  } = statblock;

  return (
    <div className="space-y-6">
      <Collapsible title="Basic Information">
        <BasicInfoSection name={name} setName={setName} size={size} setSize={setSize} />
      </Collapsible>

      <Collapsible title="Ability Scores">
        <AbilityScoresSection abilityScores={abilityScores} setAbilityScores={setAbilityScores} />
      </Collapsible>

      <Collapsible title="Combat Statistics">
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
      </Collapsible>

      <Collapsible title="Actions">
        <ActionsSection
          actions={actions}
          updateAction={updateAction}
          addNewAction={addNewAction}
          removeAction={removeAction}
        />
      </Collapsible>
    </div>
  );
};