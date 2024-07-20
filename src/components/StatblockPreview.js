import React from 'react';
import { calculateModifier, calculateHP, calculateCR, getHitDieSize, calculateDCR, calculateOCR, getXPFromCR, getProficiencyBonus } from '../utils/calculations';

export const StatblockPreview = ({ statblock }) => {
  const { name, size, abilityScores, armorClass, hitDice, actions } = statblock;
  const hp = calculateHP(size, hitDice, calculateModifier(abilityScores.CON));
  const dcr = calculateDCR(hp, armorClass.value);
  
  // TODO: Implement proper DPR and attack bonus calculations
  const dpr = 10; // Placeholder
  const attackBonus = 3 + calculateModifier(abilityScores.STR); // Placeholder
  
  const ocr = calculateOCR(dpr, attackBonus);
  const cr = calculateCR(hp, armorClass.value, dpr, attackBonus);
  const xp = getXPFromCR(cr);
  const proficiencyBonus = getProficiencyBonus(cr);

  const renderAttack = (attack) => {
    const abilityMod = calculateModifier(abilityScores[attack.abilityScore]);
    const attackBonus = proficiencyBonus + abilityMod;
    const damageBonus = attack.addAbilityToDamage ? abilityMod : 0;

    return (
      <>
        <em>{attack.type} Weapon Attack:</em> +{attackBonus} to hit, 
        range {attack.range}, {attack.targets} target{attack.targets > 1 ? 's' : ''}. 
        <em>Hit:</em> {attack.damageDice}
        {damageBonus !== 0 ? (damageBonus > 0 ? ' + ' : ' - ') + Math.abs(damageBonus) : ''} 
        {attack.damageType} damage.
      </>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Statblock Preview</h2>
      <div className="border p-4 rounded bg-gray-100">
        <h3 className="text-lg font-bold">{name}</h3>
        <p>{size} creature</p>
        <p>Armor Class {armorClass.value} ({armorClass.type})</p>
        <p>Hit Points {hp} ({hitDice}d{getHitDieSize(size)} + {calculateModifier(abilityScores.CON) * hitDice})</p>
        <p>Speed 30 ft.</p>
        <div className="grid grid-cols-3 gap-2 my-2">
          {Object.entries(abilityScores).map(([ability, score]) => (
            <div key={ability}>
              <strong>{ability}</strong> {score} ({calculateModifier(score) >= 0 ? '+' : ''}{calculateModifier(score)})
            </div>
          ))}
        </div>
        <h4 className="font-bold mt-2">Actions</h4>
        {actions.map((action, index) => (
          <div key={index} className="mb-2">
            <strong>{action.name}.</strong> {action.attack ? renderAttack(action.attack) : ''} {action.description}
          </div>
        ))}
        <p className="mt-2">
          <strong>Challenge</strong> {cr} ({xp} XP)
        </p>
        <p>
          <strong>Proficiency Bonus:</strong> +{proficiencyBonus}
        </p>
        <p>
          <strong>Defensive CR:</strong> {dcr}
        </p>
        <p>
          <strong>Offensive CR:</strong> {ocr}
        </p>
      </div>
    </div>
  );
};