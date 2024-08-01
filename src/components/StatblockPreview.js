import React from 'react';
import {
  calculateModifier,
  getHitDieSize,
  formatCR,
  getXPFromCR,
  calculateAverageDamage,
  calculateSaveDC,
} from '../utils/calculations';

export const StatblockPreview = ({ statblock }) => {
  const {
    name,
    size,
    abilityScores,
    armorClass,
    hitDice,
    actions,
    bonusActions,
    reactions,
    speed,
    proficiencyBonus,
    cr,
    ocr,
    dcr,
    hp,
  } = statblock;

  const hitDieSize = getHitDieSize(size);
  const conModifier = calculateModifier(abilityScores.CON);
  const xp = getXPFromCR(cr);

  const renderAttack = (attack) => {
    if (!attack) return null;

    const abilityMod = calculateModifier(
      abilityScores[attack.abilityScore] || 10
    );
    const attackBonus = proficiencyBonus + abilityMod;
    const damageBonus = attack.addAbilityToDamage ? abilityMod : 0;
    const averageDamage = calculateAverageDamage(
      attack.damageDice,
      damageBonus
    );

    return (
      <>
        <em>
          {attack.type.charAt(0).toUpperCase() + attack.type.slice(1)} Weapon
          Attack:
        </em>{' '}
        +{attackBonus} to hit, range {attack.range}, {attack.targets} target
        {attack.targets > 1 ? 's' : ''}.<em>&nbsp;Hit:</em> {averageDamage} (
        {attack.damageDice}
        {damageBonus !== 0
          ? (damageBonus > 0 ? ' + ' : ' - ') + Math.abs(damageBonus)
          : ''}
        ) {attack.damageType || 'bludgeoning'} damage.
      </>
    );
  };

  const renderSavingThrow = (savingThrow) => {
    if (!savingThrow) return null;

    const averageDamage = calculateAverageDamage(savingThrow.damageDice, 0);
    const saveDC = calculateSaveDC(
      savingThrow,
      proficiencyBonus,
      abilityScores
    );

    console.log(savingThrow);
    let effectDescription = '';
    if (savingThrow.type === 'targeted') {
      effectDescription = `${savingThrow.targets || 1} ${
        savingThrow.targetType || 'target'
      }${(savingThrow.targets || 1) > 1 ? 's' : ''} within ${
        savingThrow.range || 60
      } feet`;
    } else if (savingThrow.type === 'aoe') {
      const aoeSize = savingThrow.aoeSize || 20;
      const aoeType = savingThrow.aoeType || 'sphere';
      effectDescription = `a ${aoeSize}-foot ${aoeType}`;
      if (savingThrow.aoeOrigin === 'point') {
        effectDescription += ` centered on a point within ${
          savingThrow.range || 60
        } feet`;
      } else {
        effectDescription += ` originating from the creature`;
      }
    }

    return (
      <>
        {savingThrow.type === 'targeted'
          ? effectDescription
          : `Each creature in ${effectDescription}`}{' '}
        must make a DC {saveDC} {savingThrow.abilityScore} saving throw. A
        target takes {averageDamage} ({savingThrow.damageDice}){' '}
        {savingThrow.damageType || 'fire'} damage on a failed save
        {savingThrow.damageOnSuccess === 'half'
          ? `, or half as much damage on a successful one.`
          : '.'}
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
        <p>
          <strong>Armor Class</strong> {armorClass.value} ({armorClass.type})
        </p>
        <p>
          <strong>Hit Points</strong> {hp} ({hitDice}d{hitDieSize} +{' '}
          {conModifier * hitDice})
        </p>
        <p>
          <strong>Speed</strong> {speed} ft.
        </p>
      </div>

      <div className="grid grid-cols-6 gap-2 mb-4 text-center border-y-2 border-accent py-2">
        {Object.entries(abilityScores).map(([ability, score]) => (
          <div key={ability}>
            <div className="font-bold">{ability}</div>
            <div>
              {score} ({calculateModifier(score) >= 0 ? '+' : ''}
              {calculateModifier(score)})
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-bold border-b border-accent">Actions</h3>
        {actions.map((action, index) => (
          <div key={index} className="mb-2">
            <strong>{action.name}.</strong>{' '}
            {action.attack && renderAttack(action.attack)}
            {action.savingThrow && renderSavingThrow(action.savingThrow)}{' '}
            {action.description}
          </div>
        ))}
      </div>

      {bonusActions.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-bold border-b border-accent">
            Bonus Actions
          </h3>
          {bonusActions.map((action, index) => (
            <div key={index} className="mb-2">
              <strong>{action.name}.</strong>{' '}
              {action.attack && renderAttack(action.attack)}
              {action.savingThrow && renderSavingThrow(action.savingThrow)}{' '}
              {action.description}
            </div>
          ))}
        </div>
      )}

      {reactions.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-bold border-b border-accent">
            Reactions
          </h3>
          {reactions.map((reaction, index) => (
            <div key={index} className="mb-2">
              <strong>{reaction.name}.</strong> In response to{' '}
              {reaction.trigger}, this creature{' '}
              {reaction.savingThrow && renderSavingThrow(reaction.savingThrow)}{' '}
              {reaction.description}
            </div>
          ))}
        </div>
      )}

      <div className="border-t-2 border-accent pt-2">
        <p>
          <strong>Challenge</strong> {formatCR(cr, ocr, dcr)} ({xp} XP)
        </p>
        <p>
          <strong>Proficiency Bonus</strong> +{proficiencyBonus}
        </p>
      </div>
    </div>
  );
};
