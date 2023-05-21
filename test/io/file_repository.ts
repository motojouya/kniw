import assert from 'assert';
import fs from 'fs'
import path from 'path';
import { createRepository } from 'src/io/file_repository'

const DIRNAME = 'temp';
const NAMESPACE = 'test';

describe('Repository#checkNamespace', function () {

  beforeEach(async function () {
    if (fs.existsSync(DIRNAME)) {
      return await fs.promises.rm(DIRNAME, { recursive: true });
    }
  });

  it('normal', async function () {
    const repository = await createRepository(DIRNAME);
    assert.equal(fs.existsSync(DIRNAME), true);

    await repository.checkNamespace(NAMESPACE);
    assert.equal(fs.existsSync(path.join(DIRNAME, NAMESPACE)), true);

    const listResult01 = await repository.list(NAMESPACE);
    assert.equal(listResult01.length, 0);

    await repository.save(NAMESPACE, 'something', { test: 'something', check: 'anything' });
    await repository.save(NAMESPACE, 'this', { test: 'this', check: 'that' });

    const listResult02 = await repository.list(NAMESPACE);
    assert.equal(listResult02.length, 2);
    assert.equal(listResult02[0], 'something');
    assert.equal(listResult02[1], 'this');

    const getResult02 = await repository.get(NAMESPACE, 'something');
    if (!getResult02) {
      assert.fail();
    }
    assert.equal(getResult02.test, 'something');
    assert.equal(getResult02.check, 'anything');

    await repository.remove(NAMESPACE, 'something');

    const listResult03 = await repository.list(NAMESPACE);
    assert.equal(listResult03.length, 1);
    assert.equal(listResult03[0], 'this');

    const getResult03 = await repository.get(NAMESPACE, 'something');
    assert.equal(getResult03, null);

    await repository.remove(NAMESPACE, 'something');
  });

  it('no namespace', async function () {
    const repository = await createRepository(DIRNAME);

    assert.equal(fs.existsSync(DIRNAME), true);

    const listResult = await repository.list(NAMESPACE);

    const getResult = await repository.get(NAMESPACE, 'something');

    try {
      await repository.save(NAMESPACE, 'something', { test: 'something', check: 'anything' });
      assert.fail();
    } catch(e) {
      console.log(e);
      const error = e as any
      assert.equal(error.code, 'ENOENT');
    }

    await repository.remove(NAMESPACE, 'something');
  });
});

