import assert from 'assert';
import { createRepository } from 'src/io/file_repository'

// export const createRepository: CreateRepository = async basePath => {
//   await createDirctory(basePath);
//   //await Promise.all(tables.map(async table => await createDirectory(path.join(basePath, table))));
//   return {
//     checkNamespace: createCheckNamespace(basePath),
//     save: createSave(basePath),
//     list: createList(basePath),
//     get: createGet(basePath),
//     remove: createRemove(basePath),
//   };
// };

const DIRNAME = 'temp';
const NAMESPACE = 'temp';

describe('Repository#checkNamespace', function () {

  beforeEach(function () {
    if (fs.existsSync(DIRNAME)) {
      return await fs.promises.rm(DIRNAME, { recursive: true });
    }
  });

  it('minus test', function () {
    const repository = createRepository(DIRNAME);

    assert.true(fs.existsSync(DIRNAME));

    repository.checkNamespace(NAMESPACE);

    assert.true(fs.existsSync(path.join(DIRNAME, NAMESPACE)));

    try {
      const result = changeClimate({
        times: 0.1,
        damage: 0.1,
        accuracy: -0.5,
      });
      assert.fail();
    } catch (e) {
      const error = e as Error;
      assert.equal(error.message, 'accuracyの値は0から1です');
    }
  });
  it('over test', function () {
    try {
      const result = changeClimate({
        times: 0.1,
        damage: 0.1,
        accuracy: 1.5,
      });
      assert.fail();
    } catch (e) {
      const error = e as Error;
      assert.equal(error.message, 'accuracyの値は0から1です');
    }
  });
});

