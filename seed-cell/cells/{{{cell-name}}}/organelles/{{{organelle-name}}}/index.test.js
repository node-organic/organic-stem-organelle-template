const Organelle = require('./index')

test('the organelle instantiates', async () => {
  let instance = new Organelle()
  expect(instance).toBeDefined()
  expect(instance.dna).toBeDefined()
  expect(instance.plasma).toBeDefined()
})
