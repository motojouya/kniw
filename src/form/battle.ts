import type { Battle } from 'src/domain/battle';
import type { Party } from 'src/domain/party';
import type { Charactor, CharactorBattling } from 'src/domain/charactor';
import type { PartyForm } from 'src/form/party';
import type { CharactorForm } from 'src/form/charactor';
import type { Store } from 'src/store/store';
import type { SelectOption } from 'src/io/standard_dialogue';
import type { Skill } from 'src/domain/skill';

import Ajv, { JSONSchemaType } from 'ajv';

import { DataExistError, JsonSchemaUnmatchError, DataNotFoundError } from 'src/store/store';
import { NotWearableErorr } from 'src/domain/acquirement';
import { charactorFormSchema, toCharactor, toCharactorForm } from 'src/form/charactor';
import { isVisitorString } from 'src/domain/charactor';
import { getSkill } from 'src/store/skill';
import { ACTION_DO_NOTHING } from 'src/domain/turn';

export const DO_NOTHING = 'NOTHING';

export class ReceiverDuplicationError {
  constructor(
    readonly message: string,
  ) {}
}

export type DoSkillForm = {
  skillName: string;
  receiversWithIsVisitor: { value: string }[];
};

export const doSkillFormSchema: JSONSchemaType<DoSkillForm> = {
  type: 'object',
  properties: {
    skillName: {
      type: 'string',
      minLength: 1,
      errorMessage: { minLength: 'skillName field is required' },
    },
    receiversWithIsVisitor: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          value: {
            type: 'string',
            minLength: 1,
            errorMessage: { minLength: 'receiversWithIsVisitor field is required' },
          },
        },
        required: ['value'],
      },
    },
  },
  required: ['skillName', 'receiversWithIsVisitor'],
} as const;


export type ReceiverSelectOption = (receiver: CharactorBattling) => SelectOption;
export const receiverSelectOption: ReceiverSelectOption = receiver => ({
  value: `${receiver.name}__${isVisitorString(receiver.isVisitor)}`,
  label: `${receiver.name}(${isVisitorString(receiver.isVisitor)})`,
});

export type ToReceiver = (receiver: string, candidates: CharactorBattling[]) => CharactorBattling | DataNotFoundError;
export const toReceiver: ToReceiver = (receiver, candidates) => {
  const matches = receiver.match(new RegExp('^(.*)__(HOME|VISITOR)$'));

  if (!matches) {
    throw new Error(`no match`);
  }

  const name = matches[0];
  if (!name) {
    throw new Error(`no name`);
  }

  const isVisitorStr = matches[1];
  if (isVisitorStr !== 'HOME' && isVisitorStr !== 'VISITOR') {
    throw new Error(`isVisitorStr must be HOME or VISITOR. (${isVisitorStr})`);
  }
  const isVisitor = isVisitorStr === 'VISITOR';

  const willReceiver = candidates.find(candidate => candidate.name === name && candidate.isVisitor === isVisitor);
  if (!willReceiver) {
    return new DataNotFoundError(name, 'charactor', `${name}というcharactorは存在しません`);
  }
  return willReceiver;
};


export type DoAction = {
  skill: Skill,
  receivers: CharactorBattling[],
} | null;

export type ToAction = (
  doSkillForm: any,
  candidates: CharactorBattling[]
) => DoAction | JsonSchemaUnmatchError | DataNotFoundError | ReceiverDuplicationError;
export const toAction: ToAction = (doSkillForm, candidates) => {
  const ajv = new Ajv();
  const validateSchema = ajv.compile<DoSkillForm>(doSkillFormSchema);
  if (!validateSchema(doSkillForm)) {
    // @ts-ignore
    const { errors } = validateSchema;
    console.debug(errors);
    return new JsonSchemaUnmatchError(errors, 'partyのformデータではありません');
  }

  const { skillName } = doSkillForm;
  if (skillName === ACTION_DO_NOTHING) {
    return null;
  }

  const skill = getSkill(skillName);
  if (!skill) {
    return new DataNotFoundError(skillName, 'skill', `${skillName}というskillは存在しません`);
  }

  const receiverSet = new Set(doSkillForm.receiversWithIsVisitor.map(obj => obj.value));
  if (receiverSet.size !== doSkillForm.receiversWithIsVisitor.length) {
    return new ReceiverDuplicationError('同じキャラクターを複数回えらべません');
  }

  const receivers: CharactorBattling[] = [];
  for (const receiverObj of doSkillForm.receiversWithIsVisitor) {
    const receiver = toReceiver(receiverObj.value, candidates);
    if (receiver instanceof DataNotFoundError) {
      return receiver;
    }
    receivers.push(receiver);
  }

  return {
    skill,
    receivers,
  };
};

