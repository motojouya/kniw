import type { FC } from 'react';
import type { Acquirement } from '@motojouya/kniw-core/model/acquirement';
import type { Charactor } from '@motojouya/kniw-core/model/charactor';
import type { PartyForm } from '../form/party';

import { useState } from 'react';
import {
  FieldError,
  FieldErrors,
  Merge,
  FieldErrorsImpl,
  UseFormRegister,
  UseFormRegisterReturn,
  UseFormGetValues,
} from 'react-hook-form';
import {
  Input,
  Button,
  Card,
  Text,
  Table,
  createListCollection,
} from '@chakra-ui/react';

import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "./ui/select"
import { Tag } from "./ui/tag"
import { Field } from "./ui/field"
import { NotWearableErorr } from '@motojouya/kniw-core/model/acquirement';
import { DataNotFoundError } from '@motojouya/kniw-core/store_utility/schema';
import {
  raceRepository,
  blessingRepository,
  clothingRepository,
  weaponRepository,
} from '@motojouya/kniw-core/store/acquirement';
import {
  isBattling,
  getPhysical,
  getAbilities,
  getSkills,
} from '@motojouya/kniw-core/model/charactor';
import { toCharactor } from '../form/charactor';
import { EmptyParameter } from '../io/window_dialogue';

type GetCharactorError = (errors: FieldErrors, i: number, property: string) => FieldError | undefined;
const getCharactorError: GetCharactorError = (errors, i, property) => {
  const errorsCharactors = errors.charactors;
  if (!errorsCharactors) {
    return errorsCharactors;
  }
  // FIXME
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errorsCharactorIndexed = (errorsCharactors as Merge<FieldError, FieldErrorsImpl<any>>)[i];
  if (!errorsCharactorIndexed) {
    return errorsCharactorIndexed;
  }
  // FIXME
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const error = (errorsCharactorIndexed as Merge<FieldError, FieldErrorsImpl<any>>)[property];
  if (!error) {
    return error;
  }

  return error as FieldError;
};

// TODO working select tag https://www.chakra-ui.com/docs/components/select
const SelectAcquirement: FC<{
  name: string,
  keyPrefix: string,
  allAcquirements: Acquirement[],
  selectProps: UseFormRegisterReturn,
  error: FieldError | undefined,
}> = ({ name, keyPrefix, allAcquirements, selectProps, error }) => {
  const collection = createListCollection({ items: allAcquirements });
  return (
    <Field invalid={!!error} label={name} errorText={!!error && error.message}>
      <SelectRoot {...selectProps} collection={collection}>
        <SelectLabel>{name}</SelectLabel>
        <SelectTrigger>
          <SelectValueText placeholder={name} />
        </SelectTrigger>
        <SelectContent>
          {collection.items.map(acquirement => (
            <SelectItem key={`${keyPrefix}.${acquirement.name}`} item={{ label: acquirement.label, value: acquirement.name }}>
              {acquirement.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
    </Field>
  );
}

export const CharactorDetail: FC<{ charactor: Charactor }> = ({ charactor }) => {
  const physical = getPhysical(charactor);

  const abilities = getAbilities(charactor);
  const abilitiesText = abilities.map(ability => ability.label).join(', ');

  const skills = getSkills(charactor);
  const skillsText = skills.map(skill => skill.label).join(', ');

  let hpText: string;
  let mpText: string;
  let wtText: string;
  let statusesText: string;
  let isVisitorTag;

  if (isBattling(charactor)) {
    hpText = `${charactor.hp}/${physical.MaxHP}`;
    mpText = `${charactor.mp}/${physical.MaxMP}`;
    wtText = `${charactor.restWt}(${physical.WT})`;
    statusesText = charactor.statuses.map(attachedStatus => `${attachedStatus.status.label}(${attachedStatus.restWt})`).join(', ');
    isVisitorTag = charactor.isVisitor ? (<Tag>{'VISITOR'}</Tag>) : (<Tag>{'HOME'}</Tag>);

  } else {
    hpText = `${physical.MaxHP}`;
    mpText = `${physical.MaxMP}`;
    wtText = `${physical.WT}`;
    statusesText = 'No Status';
    isVisitorTag = null;
  }

  return (
    <Table.Root variant='line'>
      <Table.Body>
        <Table.Row>
          <Table.ColumnHeader>名前      </Table.ColumnHeader><Table.Cell>{`${charactor.name}`}{isVisitorTag}    </Table.Cell>
          <Table.ColumnHeader>HP        </Table.ColumnHeader><Table.Cell>{hpText}                               </Table.Cell>
          <Table.ColumnHeader>MP        </Table.ColumnHeader><Table.Cell>{mpText}                               </Table.Cell>
          <Table.ColumnHeader>WT        </Table.ColumnHeader><Table.Cell>{wtText}                               </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.ColumnHeader colSpan={2}>ステータス</Table.ColumnHeader><Table.Cell colSpan={6}>{statusesText} </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.ColumnHeader>種族      </Table.ColumnHeader><Table.Cell>{charactor.race.label}                 </Table.Cell>
          <Table.ColumnHeader>祝福      </Table.ColumnHeader><Table.Cell>{charactor.blessing.label}             </Table.Cell>
          <Table.ColumnHeader>装備      </Table.ColumnHeader><Table.Cell>{charactor.clothing.label}             </Table.Cell>
          <Table.ColumnHeader>武器      </Table.ColumnHeader><Table.Cell>{charactor.weapon.label}               </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.ColumnHeader>STR       </Table.ColumnHeader><Table.Cell>{physical.STR}                         </Table.Cell>
          <Table.ColumnHeader>VIT       </Table.ColumnHeader><Table.Cell>{physical.VIT}                         </Table.Cell>
          <Table.ColumnHeader>DEX       </Table.ColumnHeader><Table.Cell>{physical.DEX}                         </Table.Cell>
          <Table.ColumnHeader>AGI       </Table.ColumnHeader><Table.Cell>{physical.AGI}                         </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.ColumnHeader>AVD       </Table.ColumnHeader><Table.Cell>{physical.AVD}                         </Table.Cell>
          <Table.ColumnHeader>INT       </Table.ColumnHeader><Table.Cell>{physical.INT}                         </Table.Cell>
          <Table.ColumnHeader>MND       </Table.ColumnHeader><Table.Cell>{physical.MND}                         </Table.Cell>
          <Table.ColumnHeader>RES       </Table.ColumnHeader><Table.Cell>{physical.RES}                         </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.ColumnHeader>刺突耐性  </Table.ColumnHeader><Table.Cell>{physical.StabResistance}              </Table.Cell>
          <Table.ColumnHeader>斬撃耐性  </Table.ColumnHeader><Table.Cell>{physical.SlashResistance}             </Table.Cell>
          <Table.ColumnHeader>打撃耐性  </Table.ColumnHeader><Table.Cell>{physical.BlowResistance}              </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.ColumnHeader>火属性    </Table.ColumnHeader><Table.Cell>{physical.FireSuitable}                </Table.Cell>
          <Table.ColumnHeader>岩属性    </Table.ColumnHeader><Table.Cell>{physical.RockSuitable}                </Table.Cell>
          <Table.ColumnHeader>水属性    </Table.ColumnHeader><Table.Cell>{physical.WaterSuitable}               </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.ColumnHeader>氷属性    </Table.ColumnHeader><Table.Cell>{physical.IceSuitable}                 </Table.Cell>
          <Table.ColumnHeader>風属性    </Table.ColumnHeader><Table.Cell>{physical.AirSuitable}                 </Table.Cell>
          <Table.ColumnHeader>雷属性    </Table.ColumnHeader><Table.Cell>{physical.ThunderSuitable}             </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.ColumnHeader colSpan={2}>アビリティ</Table.ColumnHeader><Table.Cell colSpan={6}>{abilitiesText}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.ColumnHeader colSpan={2}>スキル    </Table.ColumnHeader><Table.Cell colSpan={6}>{skillsText}   </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.ColumnHeader>移動距離  </Table.ColumnHeader><Table.Cell>{physical.move}                        </Table.Cell>
          <Table.ColumnHeader>移動高さ  </Table.ColumnHeader><Table.Cell>{physical.jump}                        </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
};

export const CharactorCard: FC<{
  register: UseFormRegister<PartyForm>,
  getValues: UseFormGetValues<PartyForm>,
  remove: (index?: number | number[]) => void,
  errors: FieldErrors<PartyForm>,
  index: number,
}> = ({ register, getValues, remove, errors, index, }) => {

  const nameError = getCharactorError(errors, index, 'name');
  const [charactor, setCharactor] = useState<Charactor | string>('入力してください');

  const onBlur = () => {
    const hiredCharactor = toCharactor(getValues(`charactors.${index}` as const));

    if (hiredCharactor instanceof DataNotFoundError || hiredCharactor instanceof EmptyParameter) {
      setCharactor('入力してください');
      return;
    }
    if (hiredCharactor instanceof NotWearableErorr) {
      setCharactor('選択できない組み合わせです');
      return;
    }
    setCharactor(hiredCharactor);
  };

  return (
    <Card.Root p={3} border='solid'>
      <Card.Header>
        <Button type="button" onClick={() => remove(index)}>Fire</Button>
      </Card.Header>
      <Card.Body>
        <Field invalid={!!nameError} label="name" errorText={!!nameError && nameError.message}>
          <Input {...register(`charactors.${index}.name` as const, { onBlur })} placeholder="name" />
        </Field>
        <SelectAcquirement
          name={'race'}
          keyPrefix={`charactors.${index}.race`}
          allAcquirements={raceRepository.all}
          error={getCharactorError(errors, index, 'race')}
          selectProps={register(`charactors.${index}.race` as const, { onBlur })}
        />
        <SelectAcquirement
          name={'blessing'}
          keyPrefix={`charactors.${index}.blessing`}
          allAcquirements={blessingRepository.all}
          error={getCharactorError(errors, index, 'blessing')}
          selectProps={register(`charactors.${index}.blessing` as const, { onBlur })}
        />
        <SelectAcquirement
          name={'clothing'}
          keyPrefix={`charactors.${index}.clothing`}
          allAcquirements={clothingRepository.all}
          error={getCharactorError(errors, index, 'clothing')}
          selectProps={register(`charactors.${index}.clothing` as const, { onBlur })}
        />
        <SelectAcquirement
          name={'weapon'}
          keyPrefix={`charactors.${index}.weapon`}
          allAcquirements={weaponRepository.all}
          error={getCharactorError(errors, index, 'weapon')}
          selectProps={register(`charactors.${index}.weapon` as const, { onBlur })}
        />
      </Card.Body>
      <Card.Footer>
        {typeof charactor === 'string' ? <Text>{charactor}</Text> : <CharactorDetail charactor={charactor} />}
      </Card.Footer>
    </Card.Root>
  );
};
