import { describe, it } from "node:test";
import assert from "node:assert";

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
    assert.strictEqual(true, true);
  });
  it("get", async () => {
    const repository = await createRepository(dbMock);
    const charactor = await repository.get("sam");
    const typedCharactor = charactor as Charactor;
    if (typedCharactor) {
      assert.strictEqual(typedCharactor.name, "sam");
      assert.strictEqual(typedCharactor.race.name, "human");
      assert.strictEqual(typedCharactor.blessing.name, "earth");
      assert.strictEqual(typedCharactor.clothing.name, "redRobe");
      assert.strictEqual(typedCharactor.weapon.name, "rubyRod");
    } else {
      assert.strictEqual(true, false);
    }
  });
  it("remove", async () => {
    const repository = await createRepository(dbMock);
    await repository.remove("sam");
    assert.strictEqual(true, true);
  });
  it("list", async () => {
    const repository = await createRepository(dbMock);
    const charactorList = await repository.list();
    assert.strictEqual(charactorList.length, 2);
    assert.strictEqual(charactorList[0], "sam");
    assert.strictEqual(charactorList[1], "john");
  });
});
