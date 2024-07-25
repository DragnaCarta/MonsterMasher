import React from 'react';
import ArmorClassSection from './ArmorClassSection';
import HitPointsSection from './HitPointsSection';

const CombatStatsSection = ({ armorClass, updateArmorClass, hitDice, setHitDice, size, abilityScores }) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default CombatStatsSection;