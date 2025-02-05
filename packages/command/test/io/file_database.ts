import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";

import fs from "fs";
import path from "path";
import { createDatabase } from "../../src/io/file_database";

const DIRNAME = "temp";
const NAMESPACE = "test";

describe("Database#checkNamespace", function () {
  beforeEach(async function () {
    if (fs.existsSync(DIRNAME)) {
      return await fs.promises.rm(DIRNAME, { recursive: true });
    }
  });

  it("normal", async function () {
    const database = await createDatabase(DIRNAME);
    assert.strictEqual(fs.existsSync(DIRNAME), true);

    await database.checkNamespace(NAMESPACE);
    assert.strictEqual(fs.existsSync(path.join(DIRNAME, NAMESPACE)), true);

    const listResult01 = await database.list(NAMESPACE);
    assert.strictEqual(listResult01.length, 0);

    await database.save(NAMESPACE, "something", { test: "something", check: "anything" });
    await database.save(NAMESPACE, "this", { test: "this", check: "that" });

    const listResult02 = await database.list(NAMESPACE);
    assert.strictEqual(listResult02.length, 2);
    assert.strictEqual(listResult02[0], "something");
    assert.strictEqual(listResult02[1], "this");

    const getResult02 = await database.get(NAMESPACE, "something");
    if (!getResult02) {
      assert.fail();
    }
    assert.strictEqual(getResult02.test, "something");
    assert.strictEqual(getResult02.check, "anything");

    await database.remove(NAMESPACE, "something");

    const listResult03 = await database.list(NAMESPACE);
    assert.strictEqual(listResult03.length, 1);
    assert.strictEqual(listResult03[0], "this");

    const getResult03 = await database.get(NAMESPACE, "something");
    assert.strictEqual(getResult03, null);

    await database.remove(NAMESPACE, "something");
  });

  it("no namespace", async function () {
    const database = await createDatabase(DIRNAME);

    assert.strictEqual(fs.existsSync(DIRNAME), true);

    const _listResult = await database.list(NAMESPACE);

    const _getResult = await database.get(NAMESPACE, "something");

    try {
      await database.save(NAMESPACE, "something", { test: "something", check: "anything" });
      assert.fail();
    } catch (e) {
      console.log(e);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = e as any;
      assert.strictEqual(error.code, "ENOENT");
    }

    await database.remove(NAMESPACE, "something");
  });
});
