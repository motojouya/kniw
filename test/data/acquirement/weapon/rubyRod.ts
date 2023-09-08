import assert from 'assert';
import { NotWearableErorr } from 'src/domain/acquirement';

// import { earth } from 'src/data/acquirement/blessing/earth';
// import { mind } from 'src/data/acquirement/blessing/mind';
// import { sea } from 'src/data/acquirement/blessing/sea';
import { sky } from 'src/data/acquirement/blessing/sky';
import { redRobe } from 'src/data/acquirement/clothing/redRobe';
import { steelArmor } from 'src/data/acquirement/clothing/steelArmor';
// import { fairy } from 'src/data/acquirement/race/fairy';
// import { golem } from 'src/data/acquirement/race/golem';
// import { hawkman } from 'src/data/acquirement/race/hawkman';
import { human } from 'src/data/acquirement/race/human';
// import { lizardman } from 'src/data/acquirement/race/lizardman';
// import { merman } from 'src/data/acquirement/race/merman';
// import { werewolf } from 'src/data/acquirement/race/werewolf';
import { rubyRod } from 'src/data/acquirement/weapon/rubyRod';
// import { swordAndShield } from 'src/data/acquirement/weapon/swordAndShield';

describe('rubyRod#validateWearable', function () {
  it('ok', function () {
    const result = rubyRod.validateWearable(human, sky, redRobe, rubyRod);
    assert.equal(result, null);
  });
  //it('ng', function () {
  //  const result = rubyRod.validateWearable(human, sky, steelArmor, rubyRod);
  //  if (result instanceof NotWearableErorr) {
  //    assert.equal(result.acquirement.name, 'rubyRod');
  //    assert.equal(result.cause.name, 'steelArmor');
  //    assert.equal(result.message, 'このキャラクターの設定ではrubyRodを装備できません');
  //  } else {
  //    assert.equal(true, false);
  //  }
  //});
});
