import { describe, it, expect } from 'vitest'

import type { Party } from "../../src/model/party";
import type { Database } from "../../src/io/database";
import { toParty } from "../../src/store_schema/party";
import { createRepository } from "../../src/store/party";

const dbMock: Database = {
  save: (_namespace, _objctKey, _obj) => new Promise((resolve, _reject) => resolve()),
  get: (_namespace, _objctKey) =>
    new Promise((resolve, _reject) =>
      resolve({
        name: "team01",
        charactors: [
          {
            name: "sam",
            race: "human",
            blessing: "earth",
            clothing: "steelArmor",
            weapon: "swordAndShield",
            statuses: [],
            hp: 100,
            mp: 0,
            restWt: 120,
          },
          {
            name: "john",
            race: "human",
            blessing: "earth",
            clothing: "redRobe",
            weapon: "rubyRod",
            statuses: [],
            hp: 100,
            mp: 0,
            restWt: 115,
          },
        ],
      }),
    ),
  remove: (_namespace, _objctKey) => new Promise((resolve, _reject) => resolve()),
  list: (_namespace) => new Promise((resolve, _reject) => resolve(["team01", "team02"])),
  checkNamespace: (_namespace) => new Promise((resolve, _reject) => resolve()),
  importJson: (_fileName) =>
    new Promise((resolve, _reject) =>
      resolve({
        name: "team01",
        charactors: [
          {
            name: "sam",
            race: "human",
            blessing: "earth",
            clothing: "steelArmor",
            weapon: "swordAndShield",
            statuses: [],
            hp: 100,
            mp: 0,
            restWt: 120,
          },
          {
            name: "john",
            race: "human",
            blessing: "earth",
            clothing: "redRobe",
            weapon: "rubyRod",
            statuses: [],
            hp: 100,
            mp: 0,
            restWt: 115,
          },
        ],
      }),
    ),
  exportJson: (_obj, _fileName) => new Promise((resolve, _reject) => resolve(null)),
};

describe("Party#createRepository", function () {
  it("save", async () => {
    const repository = await createRepository(dbMock);
    const party = toParty({
      name: "team01",
      charactors: [
        {
          name: "sam",
          race: "human",
          blessing: "earth",
          clothing: "steelArmor",
          weapon: "swordAndShield",
          statuses: [],
          hp: 100,
          mp: 0,
          restWt: 120,
        },
        {
          name: "john",
          race: "human",
          blessing: "earth",
          clothing: "redRobe",
          weapon: "rubyRod",
          statuses: [],
          hp: 100,
          mp: 0,
          restWt: 115,
        },
      ],
    }) as Party;
    await repository.save(party);
    assert.strictEqual(true, true);
  });
  it("get", async () => {
    const repository = await createRepository(dbMock);
    const party = await repository.get("team01");
    const typedParty = party as Party;
    if (typedParty) {
      assert.strictEqual(typedParty.name, "team01");
      const charactors = typedParty.charactors;
      assert.strictEqual(charactors.length, 2);
      assert.strictEqual(charactors[0].name, "sam");
      assert.strictEqual(charactors[0].race.name, "human");
      assert.strictEqual(charactors[0].blessing.name, "earth");
      assert.strictEqual(charactors[0].clothing.name, "steelArmor");
      assert.strictEqual(charactors[0].weapon.name, "swordAndShield");
      assert.strictEqual(charactors[1].name, "john");
      assert.strictEqual(charactors[1].race.name, "human");
      assert.strictEqual(charactors[1].blessing.name, "earth");
      assert.strictEqual(charactors[1].clothing.name, "redRobe");
      assert.strictEqual(charactors[1].weapon.name, "rubyRod");
    } else {
      assert.strictEqual(true, false);
    }
  });
  it("remove", async () => {
    const repository = await createRepository(dbMock);
    await repository.remove("team01");
    assert.strictEqual(true, true);
  });
  it("list", async () => {
    const repository = await createRepository(dbMock);
    const partyList = await repository.list();
    assert.strictEqual(partyList.length, 2);
    assert.strictEqual(partyList[0], "team01");
    assert.strictEqual(partyList[1], "team02");
  });
});
