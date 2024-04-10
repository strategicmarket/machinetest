import test from 'node:test'
import assert from 'node:assert'
import esmock from 'esmock'


test('package, alias and local file mocks', async () => {
  const cookup = await esmock('../../src/mocks/cookup.js', {
    '../../src/mocks/mathlib.js': {addpkg: (a, b) => a + b},
    '../../src/mocks/icons.js': { coffee: '☕', bacon: '🥓' },
    '../../src/mocks/breakfast.js': {
      default: () => ['coffee', 'bacon'],
      addSalt: meal => meal + '🧂'
    }
  })

  assert.equal(cookup('breakfast'), '☕🥓🧂')
})

test('full import tree mocks —third param', async () => {
  const { getFile } = await esmock('../../src/mocks/main.mjs', {}, {
    // mocks *every* fs.readFileSync inside the import tree
    fs: { readFileSync: () => 'returned to 🌲 every caller in the tree' }
  })

  assert.equal(getFile(), 'returned to 🌲 every caller in the tree')
})

test('mock fetch, Date, setTimeout and any globals', async () => {
  // https://github.com/iambumblehead/esmock/wiki#call-esmock-globals
  const { userCount } = await esmock('../../src/mocks/Users.js', {
    '../../src/mocks/req.js': await esmock('../../src/mocks/req.js', {
      import: { // define globals like 'fetch' on the import namespace
        fetch: async () => ({
          status: 200,
          json: async () => [['jim','😄'],['jen','😊']]
        })
      }
    })
  })

  assert.equal(await userCount(), 2)
})

test('mocks "await import()" using esmock.p', async () => {
  // using esmock.p, mock definitions are kept in cache
  const doAwaitImport = await esmock.p('../awaitImportLint.js', {
    eslint: { ESLint: cfg => cfg }
  })

  // mock definition is returned from cache, when import is called
  assert.equal(await doAwaitImport('cfg🛠️'), 'cfg🛠️')
  // a bit more info are found in the wiki guide
})

test('esmock.strict mocks', async () => {
  // replace original module definitions and do not merge them
  const pathWrapper = await esmock.strict('../src/pathWrapper.js', {
    path: { dirname: () => '/path/to/file' }
  })

  // error, because "path" mock above does not define path.basename
  assert.rejects(() => pathWrapper.basename('/dog.🐶.png'), {
    name: 'TypeError',
    message: 'path.basename is not a function'
  })
})