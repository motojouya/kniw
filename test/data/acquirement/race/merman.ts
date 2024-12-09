import { describe, it } from "node:test";
import assert from "node:assert";

// import { earth } from '@motojouya/kniw/src/data/acquirement/blessing/earth';
// import { mind } from '@motojouya/kniw/src/data/acquirement/blessing/mind';
// import { sea } from '@motojouya/kniw/src/data/acquirement/blessing/sea';
import { sky } from '@motojouya/kniw/src/data/acquirement/blessing/sky';
import { redRobe } from '@motojouya/kniw/src/data/acquirement/clothing/redRobe';
// import { steelArmor } from '@motojouya/kniw/src/data/acquirement/clothing/steelArmor';
// import { fairy } from '@motojouya/kniw/src/data/acquirement/race/fairy';
// import { golem } from '@motojouya/kniw/src/data/acquirement/race/golem';
// import { hawkman } from '@motojouya/kniw/src/data/acquirement/race/hawkman';
// import { human } from '@motojouya/kniw/src/data/acquirement/race/human';
// import { lizardman } from '@motojouya/kniw/src/data/acquirement/race/lizardman';
import { merman } from '@motojouya/kniw/src/data/acquirement/race/merman';
// import { werewolf } from '@motojouya/kniw/src/data/acquirement/race/werewolf';
import { rubyRod } from '@motojouya/kniw/src/data/acquirement/weapon/rubyRod';
// import { swordAndShield } from '@motojouya/kniw/src/data/acquirement/weapon/swordAndShield';

describe('merman#validateWearable', function () {
  it('ok', function () {
    const result = merman.validateWearable(merman, sky, redRobe, rubyRod);
    assert.strictEqual(result, null);
  });
});

