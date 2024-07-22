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

  const calculateAverageDamage = (damageDice, bonus) => {
    const [diceCount, dieType] = damageDice.split('d');
    const averageDieRoll = (parseInt(dieType) + 1) / 2;
    return Math.floor(diceCount * averageDieRoll) + bonus;
  };

  const renderAttack = (attack) => {
    if (!attack) return null;

    const abilityMod = calculateModifier(abilityScores[attack.abilityScore] || 10);
    const attackBonus = proficiencyBonus + abilityMod;
    const damageBonus = attack.addAbilityToDamage ? abilityMod : 0;
    const averageDamage = calculateAverageDamage(attack.damageDice, damageBonus);

    return (
      <>
        <em>{attack.type.charAt(0).toUpperCase() + attack.type.slice(1)} Weapon Attack:</em> +{attackBonus} to hit, 
        range {attack.range || '5 ft.'}, {attack.targets || 1} target{attack.targets > 1 ? 's' : ''}. 
        <em>&nbsp;Hit:</em> {averageDamage} ({attack.damageDice}
        {damageBonus !== 0 ? (damageBonus > 0 ? ' + ' : ' - ') + Math.abs(damageBonus) : ''}) {' '}
        {attack.damageType || 'bludgeoning'} damage.
      </>
    );
  };

  return (
    <div className="statblock-preview font-serif">
      <div className="border-b-2 border-accent pb-2 mb-4">
        <h2 className="text-3xl font-bold">{name}</h2>
        <p className="italic">{size} creature</p>
      </div>
      
      <div className="mb-4">
        <p><strong>Armor Class</strong> {armorClass.value} ({armorClass.type})</p>
        <p><strong>Hit Points</strong> {hp} ({hitDice}d{getHitDieSize(size)} + {calculateModifier(abilityScores.CON) * hitDice})</p>
        <p><strong>Speed</strong> 30 ft.</p>
      </div>

      <div className="grid grid-cols-6 gap-2 mb-4 text-center border-y-2 border-accent py-2">
        {Object.entries(abilityScores).map(([ability, score]) => (
          <div key={ability}>
            <div className="font-bold">{ability}</div>
            <div>{score} ({calculateModifier(score) >= 0 ? '+' : ''}{calculateModifier(score)})</div>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-bold border-b border-accent">Actions</h3>
        {actions.map((action, index) => (
          <div key={index} className="mb-2">
            <strong>{action.name}.</strong> {action.attack ? renderAttack(action.attack) : ''} {action.description}
          </div>
        ))}
      </div>

      <div className="border-t-2 border-accent pt-2">
        <p><strong>Challenge</strong> {cr} ({xp} XP)</p>
        <p><strong>Proficiency Bonus</strong> +{proficiencyBonus}</p>
      </div>
    </div>
  );
};