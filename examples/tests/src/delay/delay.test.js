const delay = require('./delay');

describe('Delay', () => {
  test('should return the number of delays', async () => {
    const result = await delay(() => 5 + 5, 1000);
    expect(result).toBe(10);
  })
})
