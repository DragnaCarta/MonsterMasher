import React from 'react';
import { calculateModifier, calculateHP, calculateCR, getHitDieSize, formatCR, getProficiencyBonus, getXPFromCR, calculateAverageDamage } from '../utils/calculations';

export const StatblockPreview = ({ statblock }) => {
  const { name, size, abilityScores, armorClass, hitDice, actions } = statblock;
  const hitDieSize = getHitDieSize(size);
  const conModifier = calculateModifier(abilityScores.CON);
  const hp = calculateHP(size, hitDice, conModifier);
  const { cr, ocr, dcr } = calculateCR(hp, armorClass.value, actions, abilityScores);
  const proficiencyBonus = getProficiencyBonus(cr);
  const xp = getXPFromCR(cr);

  const renderAttack = (attack) => {
    if (!attack) return null;

    const abilityMod = calculateModifier(abilityScores[attack.abilityScore] || 10);
    const attackBonus = proficiencyBonus + abilityMod;
    const damageBonus = attack.addAbilityToDamage ? abilityMod : 0;
    const averageDamage = calculateAverageDamage(attack.damageDice, damageBonus);

    return (
      <>
        <em>{attack.type.charAt(0).toUpperCase() + attack.type.slice(1)} Weapon Attack:</em> +{attackBonus} to hit, 
        range {attack.range}, {attack.targets} target{attack.targets > 1 ? 's' : ''}. 
        <em>&nbsp;Hit:</em> {averageDamage} ({attack.damageDice}
        {damageBonus !== 0 ? (damageBonus > 0 ? ' + ' : ' - ') + Math.abs(damageBonus) : ''}) {' '}
        {attack.damageType || 'bludgeoning'} damage.
      </>
    );
  };

  const renderSavingThrow = (savingThrow) => {
    if (!savingThrow) return null;
  
    const averageDamage = calculateAverageDamage(savingThrow.damageDice, 0);
    const saveDC = 8 + proficiencyBonus + calculateModifier(abilityScores[savingThrow.abilityScore]);
  
    let effectDescription = '';
    if (savingThrow.type === 'targeted') {
      effectDescription = `${savingThrow.targets || 1} target${(savingThrow.targets || 1) > 1 ? 's' : ''} within ${savingThrow.range || 60} feet`;
    } else if (savingThrow.type === 'aoe') {
      const aoeSize = savingThrow.aoeSize || 20;
      const aoeType = savingThrow.aoeType || 'sphere';
      effectDescription = `a ${aoeSize}-foot ${aoeType}`;
      if (savingThrow.aoeOrigin === 'point') {
        effectDescription += ` centered on a point within ${savingThrow.range || 60} feet`;
      } else {
        effectDescription += ` originating from you`;
      }
    }
  
    return (
      <>
        {savingThrow.type === 'targeted' ? effectDescription : `All creatures in ${effectDescription}`} must make a DC {saveDC} {savingThrow.abilityScore} saving throw. 
        A target takes {averageDamage} ({savingThrow.damageDice}) {savingThrow.damageType || 'fire'} damage on a failed save
        {savingThrow.halfDamageOnSave ? `, or half as much damage on a successful one.` : '.'}
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
        <p><strong>Hit Points</strong> {hp} ({hitDice}d{hitDieSize} + {conModifier * hitDice})</p>
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
            <strong>{action.name}.</strong> {' '}
            {action.attack && renderAttack(action.attack)}
            {action.savingThrow && renderSavingThrow(action.savingThrow)}
            {' '}{action.description}
          </div>
        ))}
      </div>

      <div className="border-t-2 border-accent pt-2">
        <p><strong>Challenge</strong> {formatCR(cr, ocr, dcr)} ({xp} XP)</p>
        <p><strong>Proficiency Bonus</strong> +{proficiencyBonus}</p>
      </div>
    </div>
  );
};