import { calculateModifier } from './calculations';

export const generateHTMLStatblock = (statblock) => {
  const {
    name,
    size,
    type,
    alignment,
    abilityScores,
    armorClass,
    hitDice,
    speed,
    savingThrows,
    skills,
    damageResistances,
    senses,
    languages,
    cr,
    proficiencyBonus,
    features,
    actions,
    bonusActions,
    reactions,
    lairActions,
  } = statblock;

  const formatModifier = (score) => {
    const mod = calculateModifier(score);
    return mod >= 0 ? `+${mod}` : mod.toString();
  };

  const formatSavingThrows = () => {
    if (!savingThrows || savingThrows.length === 0) return '';
    return `<strong>Saving Throws</strong> ${savingThrows.join(', ')}<br>`;
  };

  const formatSkills = () => {
    if (!skills || skills.length === 0) return '';
    return `<strong>Skills</strong> ${skills.join(', ')}<br>`;
  };

  const formatDamageResistances = () => {
    if (!damageResistances || damageResistances.length === 0) return '';
    return `<strong>Damage Resistances</strong> ${damageResistances.join(', ')}<br>`;
  };

  const formatFeatures = () => {
    if (!features || features.length === 0) return '';
    return features.map(feature => 
      `<p><strong><em>${feature.name}.</em></strong> ${feature.description}</p>`
    ).join('');
  };

  const formatActions = () => {
    if (!actions || actions.length === 0) return '';
    return `<h3>Actions</h3>` + actions.map(action => 
      `<p><strong><em>${action.name}.</em></strong> ${action.description}</p>`
    ).join('');
  };

  const formatBonusActions = () => {
    if (!bonusActions || bonusActions.length === 0) return '';
    return `<h3>Bonus Actions</h3>` + bonusActions.map(action => 
      `<p><strong><em>${action.name}.</em></strong> ${action.description}</p>`
    ).join('');
  };

  const formatReactions = () => {
    if (!reactions || reactions.length === 0) return '';
    return `<h3>Reactions</h3>` + reactions.map(reaction => 
      `<p><strong><em>${reaction.name}.</em></strong> ${reaction.description}</p>`
    ).join('');
  };

  const formatLairActions = () => {
    if (!lairActions || lairActions.length === 0) return '';
    return `<h3>Lair Actions</h3>` + lairActions.map(action => 
      `<p><strong><em>${action.name}.</em></strong> ${action.description}</p>`
    ).join('');
  };

  return `
<div class="statblock">
<h2>${name}</h2>
<em>${size} ${type}, ${alignment}</em>
<hr>
<strong>Armor Class</strong> ${armorClass.value} (${armorClass.type})
<br>
<strong>Hit Points</strong> ${hitDice}
<br>
<strong>Speed</strong> ${speed}
<hr>
<table class="ability-table">
  <thead>
    <tr>
      <th>STR</th>
      <th>DEX</th>
      <th>CON</th>
      <th>INT</th>
      <th>WIS</th>
      <th>CHA</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>${abilityScores.STR} (${formatModifier(abilityScores.STR)})</td>
      <td>${abilityScores.DEX} (${formatModifier(abilityScores.DEX)})</td>
      <td>${abilityScores.CON} (${formatModifier(abilityScores.CON)})</td>
      <td>${abilityScores.INT} (${formatModifier(abilityScores.INT)})</td>
      <td>${abilityScores.WIS} (${formatModifier(abilityScores.WIS)})</td>
      <td>${abilityScores.CHA} (${formatModifier(abilityScores.CHA)})</td>
    </tr>
  </tbody>
</table>
<hr>
${formatSavingThrows()}
${formatSkills()}
${formatDamageResistances()}
<strong>Senses</strong> ${senses}<br>
<strong>Languages</strong> ${languages}<br>
<strong>Challenge</strong> ${cr}<br>
<strong>Proficiency Bonus.</strong> +${proficiencyBonus}<br>
<hr>
${formatFeatures()}
${formatActions()}
${formatBonusActions()}
${formatReactions()}
${formatLairActions()}
</div>
  `;
};