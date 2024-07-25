import React from 'react';
import ArmorClassSection from './ArmorClassSection';
import HitPointsSection from './HitPointsSection';
import SpeedSection from './SpeedSection';

const CombatStatsSection = ({ armorClass, updateArmorClass, hitDice, setHitDice, size, abilityScores, speed, setSpeed }) => {
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
      <SpeedSection
        speed={speed}
        setSpeed={setSpeed}
      />
    </div>
  );
};

export default CombatStatsSection;