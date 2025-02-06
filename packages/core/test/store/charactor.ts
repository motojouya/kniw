import { describe, it, expect } from 'vitest'

import type { Charactor } from "../../src/model/charactor";
import type { Database } from "../../src/io/database";
import { toCharactor } from "../../src/store_schema/charactor";
import { createRepository } from "../../src/store/charactor";

const dbMock: Database = {
  save: (_namespace, _objctKey, _obj) => new Promise((resolve, _reject) => resolve()),
  get: (_namespace, _objctKey) =>
    new Promise((resolve, _reject) =>
      resolve({
        name: "sam",
        race: "human",
        blessing: "earth",
        clothing: "redRobe",
        weapon: "rubyRod",
        statuses: [],
        hp: 100,
        mp: 0,
        restWt: 115,
      }),
    ),
  remove: (_namespace, _objctKey) => new Promise((resolve, _reject) => resolve()),
  list: (_namespace) => new Promise((resolve, _reject) => resolve(["sam", "john"])),
  checkNamespace: (_namespace) => new Promise((resolve, _reject) => resolve()),
  importJson: (_fileName) =>
    new Promise((resolve, _reject) =>
      resolve({
        name: "sam",
        race: "human",
        blessing: "earth",
        clothing: "redRobe",
        weapon: "rubyRod",
        statuses: [],
        hp: 100,
        mp: 0,
        restWt: 115,
      }),
    ),
  exportJson: (_obj, _fileName) => new Promise((resolve, _reject) => resolve(null)),
};

describe("Charctor#createRepository", function () {
  it("save", async () => {
    const repository = await createRepository(dbMock);
    const charactor = toCharactor({
      name: "sam",
      race: "human",
      blessing: "earth",
      clothing: "redRobe",
      weapon: "rubyRod",
      statuses: [],
      hp: 100,
      mp: 0,
      restWt: 115,
    }) as Charactor;
    await repository.save(charactor);
    expect(true, true);
  });
  it("get", async () => {
    const repository = await createRepository(dbMock);
    const charactor = await repository.get("sam");
    const typedCharactor = charactor as Charactor;
    if (typedCharactor) {
      expect(typedCharactor.name, "sam");
      expect(typedCharactor.race.name, "human");
      expect(typedCharactor.blessing.name, "earth");
      expect(typedCharactor.clothing.name, "redRobe");
      expect(typedCharactor.weapon.name, "rubyRod");
    } else {
      expect(true, false);
    }
  });
  it("remove", async () => {
    const repository = await createRepository(dbMock);
    await repository.remove("sam");
    expect(true, true);
  });
  it("list", async () => {
    const repository = await createRepository(dbMock);
    const charactorList = await repository.list();
    expect(charactorList.length, 2);
    expect(charactorList[0], "sam");
    expect(charactorList[1], "john");
  });
});
