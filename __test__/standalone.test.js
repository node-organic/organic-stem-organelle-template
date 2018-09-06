const path = require('path')
const os = require('os')

test('stack upgrade standalone', async () => {
  let tempDir = path.join(os.tmpdir(), 'test-stack-upgrade-' + Math.random())
  jest.setTimeout(60 * 1000)
  let execute = require('../index')
  await execute({
    destDir: tempDir,
    answers: {
      'organelle-name': 'test',
      'organelle-description': 'desc',
      'scope': 'standalone'
    }
  })
})
