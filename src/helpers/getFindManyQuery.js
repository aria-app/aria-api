module.exports = function getFindManyQuery(tableName, ids) {
  const valuePlaceholders = ids.map((key, index) => `$${index + 1}`);

  return `SELECT * FROM ${tableName} WHERE id IN (${valuePlaceholders});`;
};
