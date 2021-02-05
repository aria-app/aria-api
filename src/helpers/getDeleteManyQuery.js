module.exports = function getDeleteManyQuery(tableName, ids) {
  const valuePlaceholders = ids.map((key, index) => `$${index + 1}`);

  return `DELETE FROM ${tableName} WHERE id IN (${valuePlaceholders});`;
};
