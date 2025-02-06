import { describe, it, expect } from 'vitest'

// import { NotWearableErorr } from '../../../src/model/acquirement';

// import { earth } from '../../../src/store_data/acquirement/blessing/earth';
// import { mind } from '../../../src/store_data/acquirement/blessing/mind';
// import { sea } from '../../../src/store_data/acquirement/blessing/sea';
import { sky } from "../../../src/store_data/acquirement/blessing/sky";
import { redRobe } from "../../../src/store_data/acquirement/clothing/redRobe";
// import { steelArmor } from '../../../src/store_data/acquirement/clothing/steelArmor';
// import { fairy } from '../../../src/store_data/acquirement/race/fairy';
// import { golem } from '../../../src/store_data/acquirement/race/golem';
// import { hawkman } from '../../../src/store_data/acquirement/race/hawkman';
import { human } from "../../../src/store_data/acquirement/race/human";
// import { lizardman } from '../../../src/store_data/acquirement/race/lizardman';
// import { merman } from '../../../src/store_data/acquirement/race/merman';
// import { werewolf } from '../../../src/store_data/acquirement/race/werewolf';
import { rubyRod } from "../../../src/store_data/acquirement/weapon/rubyRod";
// import { swordAndShield } from '../../../src/store_data/acquirement/weapon/swordAndShield';

describe("rubyRod#validateWearable", function () {
  it("ok", function () {
    const result = rubyRod.validateWearable(human, sky, redRobe, rubyRod);
    expect(result, null);
  });
  //it('ng', function () {
  //  const result = rubyRod.validateWearable(human, sky, steelArmor, rubyRod);
  //  if (result instanceof NotWearableErorr) {
  //    expect(result.acquirement.name, 'rubyRod');
  //    expect(result.cause.name, 'steelArmor');
  //    expect(result.message, 'このキャラクターの設定ではrubyRodを装備できません');
  //  } else {
  //    expect(true, false);
  //  }
  //});
});
