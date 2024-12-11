import type { Charactor } from '@motojouya/kniw/src/domain/charactor';

import { z } from 'zod';

import { NotWearableErorr } from '@motojouya/kniw/src/domain/acquirement';
import { JsonSchemaUnmatchError, DataNotFoundError } from '@motojouya/kniw/src/store/store';
import { getPhysical, validate } from '@motojouya/kniw/src/domain/charactor';
import { getRace, getWeapon, getClothing, getBlessing } from '@motojouya/kniw/src/store/acquirement';

export const charactorFormSchema = z.object({
  name: z.string().min(1),
  race: z.string().min(1),
  blessing: z.string().min(1),
  clothing: z.string().min(1),
  weapon: z.string().min(1),
});
export type CharactorForm = z.infer<typeof charactorFormSchema>;

export type ToCharactorForm = (charactor: Charactor) => CharactorForm;
export const toCharactorForm: ToCharactorForm = charactor => ({
  name: charactor.name,
  race: charactor.race.name,
  blessing: charactor.blessing.name,
  clothing: charactor.clothing.name,
  weapon: charactor.weapon.name,
});

export type ToCharactor = (
  charactorForm: any,
) => Charactor | NotWearableErorr | DataNotFoundError | JsonSchemaUnmatchError;
export const toCharactor: ToCharactor = charactorForm => {

  const result = charactorFormSchema.safeParse(charactorForm);
  if (!result.success) {
    return new JsonSchemaUnmatchError(result.error, 'charactorのデータではありません');
  }

  const charactorFormTyped = result.data;

  const { name } = charactorFormTyped;

  const race = getRace(charactorFormTyped.race);
  if (!race) {
    return new DataNotFoundError(charactorFormTyped.race, 'race', `${charactorFormTyped.race}という種族は存在しません`);
  }

  const blessing = getBlessing(charactorFormTyped.blessing);
  if (!blessing) {
    return new DataNotFoundError(
      charactorFormTyped.blessing,
      'blessing',
      `${charactorFormTyped.blessing}という祝福は存在しません`,
    );
  }

  const clothing = getClothing(charactorFormTyped.clothing);
  if (!clothing) {
    return new DataNotFoundError(
      charactorFormTyped.clothing,
      'clothing',
      `${charactorFormTyped.clothing}という装備は存在しません`,
    );
  }

  const weapon = getWeapon(charactorFormTyped.weapon);
  if (!weapon) {
    return new DataNotFoundError(charactorFormTyped.weapon, 'weapon', `${charactorFormTyped.weapon}という武器は存在しません`);
  }

  const validateResult = validate(name, race, blessing, clothing, weapon);
  if (validateResult instanceof NotWearableErorr) {
    return validateResult;
  }

  const someone: Charactor = {
    name,
    race,
    blessing,
    clothing,
    weapon,
    statuses: [],
    hp: 0,
    mp: 0,
    restWt: 0,
  };

  const someonesPhysical = getPhysical(someone);
  someone.hp = someonesPhysical.MaxHP;
  someone.restWt = someonesPhysical.WT;

  return someone;
};
