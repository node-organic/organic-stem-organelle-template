const path = require('path')
const os = require('os')

const generateCore = require('organic-stem-core-template')
const generateApiCell = require('organic-stem-server-express-http-api-cell-template')

const execa = require('execa')
const request = require('async-request')
const terminate = require('terminate')

const get = async function (url) {
  return request(url)
}

const timeout = function (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

test('stack upgrade stem cell', async () => {
  let tempDir = path.join(os.tmpdir(), 'test-stack-upgrade-' + Math.random())
  jest.setTimeout(60 * 1000)
  await generateCore({
    destDir: tempDir,
    answers: {
      'project-name': 'test'
    }
  })
  await generateApiCell({
    destDir: tempDir,
    answers: {
      'cell-name': 'test',
      'cell-port': 13371,
      'cell-groups': 'default'
    }
  })
  let execute = require('../index')
  await execute({
    destDir: tempDir,
    answers: {
      'organelle-name': 'test',
      'organelle-description': 'desc',
      'cell-name': 'test',
      'scope': 'stem cell'
    }
  })
  let cmds = [
    'cd ' + tempDir + '/cells/test',
    'node ./index'
  ]
  let child = execa.shell(cmds.join(' && '))
  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)
  await timeout(1000)
  let result = await get('http://localhost:13371/version')
  expect(result.body).toBe('"1.0.0"')
  terminate(child.pid)
})
