const path = require('path')
const os = require('os')

const generateCore = require('organic-stem-core-template')

test('stack upgrade stem cell', async () => {
  let tempDir = path.join(os.tmpdir(), 'test-stack-upgrade-' + Math.random())
  jest.setTimeout(60 * 1000)
  await generateCore({
    destDir: tempDir,
    answers: {
      'project-name': 'test'
    }
  })
  let execute = require('../index')
  await execute({
    destDir: tempDir,
    answers: {
      'organelle-name': 'test',
      'organelle-description': 'desc',
      'scope': 'stem repo'
    }
  })
})
