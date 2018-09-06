#!/usr/bin/env node

const StackUpgrade = require('organic-stack-upgrade')
const path = require('path')
const fs = require('fs')
const Radio = require('prompt-radio')

const pathExists = async function (filepath) {
  return new Promise((resolve, reject) => {
    fs.stat(filepath, (err, stats) => {
      if (err) return reject(err)
      resolve(stats)
    })
  })
}

const execute = async function ({destDir = process.cwd(), answers} = {}) {
  let stack = new StackUpgrade({
    destDir: destDir,
    name: 'organic-stem-organelle-template',
    version: '1.0.0'
  })
  if (!answers.scope) {
    let organelleScopePrompt = new Radio({
      name: 'scope',
      message: 'scaffold Organelle scope?',
      choices: [
        'standalone',
        'stem cell',
        'stem repo'
      ]
    })
    Object.assign(answers, await organelleScopePrompt.run())
  }
  if (answers.scope === 'standalone') {
    await stack.configureMergeAndUpdateJSON({
      sourceDir: path.join(__dirname, 'seed-standalone'),
      answers
    })
    console.info('run npm install...')
    await stack.exec('npm install')
  }
  if (answers.scope === 'stem cell') {
    let resulted_answers = await stack.configure({
      sourceDir: path.join(__dirname, 'seed-cell'),
      answers
    })
    let cellName = resulted_answers['cell-name']
    let cellBuildDNAPath = path.join(destDir, 'dna', 'cells', cellName + '.json')
    let cellBuildDNAPathExists = await pathExists(cellBuildDNAPath)
    if (!cellBuildDNAPathExists) throw new Error(cellBuildDNAPath + ' required')
    await stack.merge({
      sourceDir: path.join(__dirname, 'seed-cell'),
      answers: resulted_answers
    })
    await stack.updateJSON()
    console.info(`run npm install on ${cellName}...`)
    await stack.exec(`npx angel repo cell ${cellName} -- npm install`)
  }
  if (answers.scope === 'stem repo') {
    await stack.configureMergeAndUpdateJSON({
      sourceDir: path.join(__dirname, 'seed-repo'),
      answers
    })
    console.info('run npm install...')
    await stack.exec('npm install')
  }
}

if (module.parent) {
  module.exports = execute
} else {
  execute().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
