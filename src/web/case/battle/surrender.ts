import type { Battle } from '@motojouya/kniw/src/domain/battle';
import type { CharactorBattling } from '@motojouya/kniw/src/domain/charactor';
import type { BattleRepository } from '@motojouya/kniw/src/store/battle';
import type { Dialogue } from '@motojouya/kniw/src/io/window_dialogue';

import { GameHome, GameVisitor, surrender as domainSurrender } from '@motojouya/kniw/src/domain/battle';
import { UserCancel } from '@motojouya/kniw/src/io/window_dialogue';

export type Surrender = (
  battleRepository: BattleRepository,
  dialogue: Dialogue,
) => (battle: Battle, actor: CharactorBattling, actionDate: Date) => Promise<null | UserCancel>;
export const surrender: Surrender = (battleRepository, dialogue) => async (battle, actor, actionDate) => {
  if (!dialogue.confirm('降参してもよいですか？')) {
    return new UserCancel('降参していません');
  }

  const turn = domainSurrender(battle, actor, actionDate);
  battle.turns.push(turn);
  await battleRepository.save({
    ...battle,
    result: actor.isVisitor ? GameHome : GameVisitor,
  });
  return null;
};

// // test
// describe('surrender', () => {
//   it('should surrender', async () => {
//     const battleRepository: BattleRepository = {
//       async save(battle) {
//         expect(battle.result).toBe(GameHome);
//       },
//     };
//     const dialogue: Dialogue = {
//       confirm: () => true,
//     };
//     const battle: Battle = {
//       turns: [],
//       result: null,
//     };
//     const actor: CharactorBattling = {
//       isVisitor: true,
//     };
//     const actionDate = new Date();
// 
//     const result = await surrender(battleRepository, dialogue)(battle, actor, actionDate);
//     expect(result).toBeNull();
//   });
// 
//   it('should not surrender', async () => {
//     const battleRepository: BattleRepository = {
//       async save() {
//         throw new Error('should not save');
//       },
//     };
//     const dialogue: Dialogue = {
//       confirm: () => false,
//     };
//     const battle: Battle = {
//       turns: [],
//       result: null,
//     };
//     const actor: CharactorBattling = {
//       isVisitor: true,
//     };
//     const actionDate = new Date();
// 
//     const result = await surrender(battleRepository, dialogue)(battle, actor, actionDate);
//     expect(result).toBeInstanceOf(UserCancel);
//   });
// }
