import type { FC } from 'react';
import type { Acquirement } from '@motojouya/kniw/src/domain/acquirement';
import type { Charactor } from '@motojouya/kniw/src/domain/charactor';
import type { PartyForm } from '@motojouya/kniw/src/form/party';

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
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
//  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Select,
//  Heading,
  Text,
  Table,
//  Thead,
  Tbody,
//  Tfoot,
  Tr,
  Th,
  Td,
//  TableCaption,
  TableContainer,
  Tag,
} from '@chakra-ui/react';

import { NotWearableErorr } from '@motojouya/kniw/src/domain/acquirement';
import { DataNotFoundError } from '@motojouya/kniw/src/store/schema/schema';
import {
  raceRepository,
  blessingRepository,
  clothingRepository,
  weaponRepository,
} from '@motojouya/kniw/src/store/acquirement';
import {
  getPhysical,
  getAbilities,
  getSkills,
} from '@motojouya/kniw/src/domain/charactor';
import { hireCharactor } from '@motojouya/kniw/src/web/case/charactor/hire';

type GetCharactorError = (errors: FieldErrors, i: number, property: string) => FieldError | undefined;
const getCharactorError: GetCharactorError = (errors, i, property) => {
  const errorsCharactors = errors.charactors;
  if (!errorsCharactors) {
    return errorsCharactors;
  }
  const errorsCharactorIndexed = (errorsCharactors as Merge<FieldError, FieldErrorsImpl<any>>)[i];
  if (!errorsCharactorIndexed) {
    return errorsCharactorIndexed;
  }
  const error = (errorsCharactorIndexed as Merge<FieldError, FieldErrorsImpl<any>>)[property];
  if (!error) {
    return error;
  }

  return error as FieldError;
};

const SelectAcquirement: FC<{
  name: string,
  keyPrefix: string,
  allAcquirements: Acquirement[],
  selectProps: UseFormRegisterReturn,
  error: FieldError | undefined,
}> = ({ name, keyPrefix, allAcquirements, selectProps, error }) => (
  <FormControl isInvalid={!!error}>
    <FormLabel htmlFor={keyPrefix}>{name}</FormLabel>
    <Select {...selectProps} placeholder={name}>
      {allAcquirements.map(acquirement => (
        <option key={`${keyPrefix}.${acquirement.name}`} value={acquirement.name}>
          {acquirement.label}
        </option>
      ))}
    </Select>
    <FormErrorMessage>{!!error && error.message}</FormErrorMessage>
  </FormControl>
);

export const CharactorDetail: FC<{ charactor: Charactor }> = ({ charactor }) => {
  const physical = getPhysical(charactor);

  const abilities = getAbilities(charactor);
  const abilitiesText = abilities.map(ability => ability.label).join(', ');

  const skills = getSkills(charactor);
  const skillsText = skills.map(skill => skill.label).join(', ');

  const statusesText = charactor.statuses.map(attachedStatus => `${attachedStatus.status.label}(${attachedStatus.restWt})`).join(', ');

  // eslint-disable-next-line no-nested-ternary
  const isVisitorTag = charactor.isVisitor === undefined ? null
    : charactor.isVisitor ? (<Tag>{'VISITOR'}</Tag>)
    : (<Tag>{'HOME'}</Tag>);

  return (
    <TableContainer>
      <Table variant='simple'>
        <Tbody>
          <Tr>
            <Th>名前      </Th><Td>{`${charactor.name}`}{isVisitorTag}    </Td>
            <Th>HP        </Th><Td>{`${charactor.hp}/${physical.MaxHP}`}  </Td>
            <Th>MP        </Th><Td>{`${charactor.mp}/${physical.MaxMP}`}  </Td>
            <Th>WT        </Th><Td>{`${charactor.restWt}(${physical.WT})`}</Td>
          </Tr>
          <Tr>
            <Th colSpan={2}>ステータス</Th><Td colSpan={6}>{statusesText} </Td>
          </Tr>
          <Tr>
            <Th>種族      </Th><Td>{charactor.race.label}                 </Td>
            <Th>祝福      </Th><Td>{charactor.blessing.label}             </Td>
            <Th>装備      </Th><Td>{charactor.clothing.label}             </Td>
            <Th>武器      </Th><Td>{charactor.weapon.label}               </Td>
          </Tr>
          <Tr>
            <Th>STR       </Th><Td>{physical.STR}                         </Td>
            <Th>VIT       </Th><Td>{physical.VIT}                         </Td>
            <Th>DEX       </Th><Td>{physical.DEX}                         </Td>
            <Th>AGI       </Th><Td>{physical.AGI}                         </Td>
          </Tr>
          <Tr>
            <Th>AVD       </Th><Td>{physical.AVD}                         </Td>
            <Th>INT       </Th><Td>{physical.INT}                         </Td>
            <Th>MND       </Th><Td>{physical.MND}                         </Td>
            <Th>RES       </Th><Td>{physical.RES}                         </Td>
          </Tr>
          <Tr>
            <Th>刺突耐性  </Th><Td>{physical.StabResistance}              </Td>
            <Th>斬撃耐性  </Th><Td>{physical.SlashResistance}             </Td>
            <Th>打撃耐性  </Th><Td>{physical.BlowResistance}              </Td>
          </Tr>
          <Tr>
            <Th>火属性    </Th><Td>{physical.FireSuitable}                </Td>
            <Th>岩属性    </Th><Td>{physical.RockSuitable}                </Td>
            <Th>水属性    </Th><Td>{physical.WaterSuitable}               </Td>
          </Tr>
          <Tr>
            <Th>氷属性    </Th><Td>{physical.IceSuitable}                 </Td>
            <Th>風属性    </Th><Td>{physical.AirSuitable}                 </Td>
            <Th>雷属性    </Th><Td>{physical.ThunderSuitable}             </Td>
          </Tr>
          <Tr>
            <Th colSpan={2}>アビリティ</Th><Td colSpan={6}>{abilitiesText}</Td>
          </Tr>
          <Tr>
            <Th colSpan={2}>スキル    </Th><Td colSpan={6}>{skillsText}   </Td>
          </Tr>
          <Tr>
            <Th>移動距離  </Th><Td>{physical.move}                        </Td>
            <Th>移動高さ  </Th><Td>{physical.jump}                        </Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
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
    const charactor = hireCharactor(getValues(`charactors.${index}` as const));
    if (charactor instanceof DataNotFoundError) {
      setCharactor('入力してください');
      return;
    }
    if (charactor instanceof NotWearableErorr) {
      setCharactor('選択できない組み合わせです');
      return;
    }
    setCharactor(charactor);
  };

  return (
    <Card p={3} border='solid'>
      <CardHeader>
        <Button type="button" onClick={() => remove(index)}>Fire</Button>
      </CardHeader>
      <CardBody>
        <FormControl isInvalid={!!nameError}>
          <FormLabel htmlFor={`charactors.${index}.name`}>name</FormLabel>
          <Input {...register(`charactors.${index}.name` as const, { onBlur })} placeholder="name" />
          <FormErrorMessage>{!!nameError && nameError.message}</FormErrorMessage>
        </FormControl>
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
      </CardBody>
      <CardFooter>
        {typeof charactor === 'string' ? <Text>{charactor}</Text> : <CharactorDetail charactor={charactor} />}
      </CardFooter>
    </Card>
  );
};
