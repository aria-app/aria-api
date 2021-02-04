module.exports = function getMockDb() {
  const client = { query: jest.fn() };
  return {
    client,
    withTransaction(callback) {
      return new Promise((resolve) => resolve(callback(client)));
    },
  };
};
