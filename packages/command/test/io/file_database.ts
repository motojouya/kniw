import fs from "fs";
import path from "path";
import { describe, it, expect, beforeEach } from 'vitest'
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
    expect(fs.existsSync(DIRNAME)).toBe(true);

    await database.checkNamespace(NAMESPACE);
    expect(fs.existsSync(path.join(DIRNAME, NAMESPACE))).toBe(true);

    const listResult01 = await database.list(NAMESPACE);
    expect(listResult01.length).toBe(0);

    await database.save(NAMESPACE, "something", { test: "something", check: "anything" });
    await database.save(NAMESPACE, "this", { test: "this", check: "that" });

    const listResult02 = await database.list(NAMESPACE);
    expect(listResult02.length).toBe(2);
    expect(listResult02[0]).toBe("something");
    expect(listResult02[1]).toBe("this");

    const getResult02 = await database.get(NAMESPACE, "something");
    if (!getResult02) {
      expect.unreachable('expect falsy value');
    }
    expect(getResult02.test).toBe("something");
    expect(getResult02.check).toBe("anything");

    await database.remove(NAMESPACE, "something");

    const listResult03 = await database.list(NAMESPACE);
    expect(listResult03.length).toBe(1);
    expect(listResult03[0]).toBe("this");

    const getResult03 = await database.get(NAMESPACE, "something");
    expect(getResult03).toBe(null);

    await database.remove(NAMESPACE, "something");
  });

  it("no namespace", async function () {
    const database = await createDatabase(DIRNAME);

    expect(fs.existsSync(DIRNAME)).toBe(true);

    const _listResult = await database.list(NAMESPACE);

    const _getResult = await database.get(NAMESPACE, "something");

    try {
      await database.save(NAMESPACE, "something", { test: "something", check: "anything" });
      assert.fail();
      expect.unreachable('expect to throw error');
    } catch (e) {
      console.log(e);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = e as any;
      expect(error.code).toBe("ENOENT");
    }

    await database.remove(NAMESPACE, "something");
  });
});
