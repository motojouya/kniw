import assert from 'assert';
import {
  Physical,
  addPhysicals,
} from 'src/domain/physical';

const basePhysical: Physical = {
  MaxHP: 100,
  MaxMP: 100,
  STR: 100,
  VIT: 100,
  DEX: 100,
  AGI: 100,
  AVD: 100,
  INT: 100,
  MND: 100,
  RES: 100,
  WT: 100,
  StabResistance: 0,
  SlashResistance: 0,
  BlowResistance: 0,
  FireSuitable: 0,
  RockSuitable: 0,
  WaterSuitable: 0,
  IceSuitable: 0,
  AirSuitable: 0,
  ThunderSuitable: 0,
  move: 4,
  jump: 3,
};

describe('Physical#addPhysicals', function () {
  it('add', function () {
    const result = addPhysicals([
      basePhysical,
      {
        MaxHP: 10,
        MaxMP: 10,
        STR: 10,
        VIT: 10,
        DEX: 10,
        AGI: 10,
        AVD: 10,
        INT: 10,
        MND: 10,
        RES: 10,
        WT: 10,
        StabResistance: 10,
        SlashResistance: 10,
        BlowResistance: 10,
        FireSuitable: 10,
        RockSuitable: 10,
        WaterSuitable: 10,
        IceSuitable: 10,
        AirSuitable: 10,
        ThunderSuitable: 10,
        move: 1,
        jump: 1,
      },
      {
        MaxHP: 1,
        MaxMP: 1,
        STR: 1,
        VIT: 1,
        DEX: 1,
        AGI: 1,
        AVD: 1,
        INT: 1,
        MND: 1,
        RES: 1,
        WT: 1,
        StabResistance: 1,
        SlashResistance: 1,
        BlowResistance: 1,
        FireSuitable: 1,
        RockSuitable: 1,
        WaterSuitable: 1,
        IceSuitable: 1,
        AirSuitable: 1,
        ThunderSuitable: 1,
        move: 2,
        jump: 2,
      },
    ]);

    assert.equal(result.MaxHP, 111);
    assert.equal(result.MaxMP, 111);
    assert.equal(result.STR, 111);
    assert.equal(result.VIT, 111);
    assert.equal(result.DEX, 111);
    assert.equal(result.AGI, 111);
    assert.equal(result.AVD, 111);
    assert.equal(result.INT, 111);
    assert.equal(result.MND, 111);
    assert.equal(result.RES, 111);
    assert.equal(result.WT, 111);
    assert.equal(result.StabResistance, 11);
    assert.equal(result.SlashResistance, 11);
    assert.equal(result.BlowResistance, 11);
    assert.equal(result.FireSuitable, 11);
    assert.equal(result.RockSuitable, 11);
    assert.equal(result.WaterSuitable, 11);
    assert.equal(result.IceSuitable, 11);
    assert.equal(result.AirSuitable, 11);
    assert.equal(result.ThunderSuitable, 11);
    assert.equal(result.move, 7);
    assert.equal(result.jump, 6);
  });

  it('minus', function () {
    const result = addPhysicals([
      basePhysical,
      {
        MaxHP: -10,
        MaxMP: -10,
        STR: -10,
        VIT: -10,
        DEX: -10,
        AGI: -10,
        AVD: -10,
        INT: -10,
        MND: -10,
        RES: -10,
        WT: -10,
        StabResistance: 10,
        SlashResistance: 10,
        BlowResistance: 10,
        FireSuitable: 10,
        RockSuitable: 10,
        WaterSuitable: 10,
        IceSuitable: 10,
        AirSuitable: 10,
        ThunderSuitable: 10,
        move: 1,
        jump: 1,
      },
      {
        MaxHP: 1,
        MaxMP: 1,
        STR: 1,
        VIT: 1,
        DEX: 1,
        AGI: 1,
        AVD: 1,
        INT: 1,
        MND: 1,
        RES: 1,
        WT: 1,
        StabResistance: -1,
        SlashResistance: -1,
        BlowResistance: -1,
        FireSuitable: -1,
        RockSuitable: -1,
        WaterSuitable: -1,
        IceSuitable: -1,
        AirSuitable: -1,
        ThunderSuitable: -1,
        move: -1,
        jump: -1,
      },
    ]);

    assert.equal(result.MaxHP, 91);
    assert.equal(result.MaxMP, 91);
    assert.equal(result.STR, 91);
    assert.equal(result.VIT, 91);
    assert.equal(result.DEX, 91);
    assert.equal(result.AGI, 91);
    assert.equal(result.AVD, 91);
    assert.equal(result.INT, 91);
    assert.equal(result.MND, 91);
    assert.equal(result.RES, 91);
    assert.equal(result.WT, 91);
    assert.equal(result.StabResistance, 9);
    assert.equal(result.SlashResistance, 9);
    assert.equal(result.BlowResistance, 9);
    assert.equal(result.FireSuitable, 9);
    assert.equal(result.RockSuitable, 9);
    assert.equal(result.WaterSuitable, 9);
    assert.equal(result.IceSuitable, 9);
    assert.equal(result.AirSuitable, 9);
    assert.equal(result.ThunderSuitable, 9);
    assert.equal(result.move, 4);
    assert.equal(result.jump, 3);
  });
});

