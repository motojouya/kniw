import type {
  Skill,
  ActionToCharactor,
  GetAccuracy,
} from 'src/domain/skill'

const action: ActionToCharactor = (self, actor, randoms, field, receiver) => {
};

const getAccuracy: GetAccuracy = (self, actor, field, receiver) => {
};

export const chop: Skill = {
  name: 'chop',
  label: '斬りつける',
  action: action,
  receiverCount: 1,
  additionalWt: 100,
  getAccuracy: getAccuracy,
  description: '斬りつける',
};

