module.exports = function getCreateQuery(tableName, values) {
  const keys = Object.keys(values);
  const valuePlaceholders = keys.map((key, index) => `$${index + 1}`);
  return `
    INSERT INTO ${tableName}(${keys.join(', ')})
    VALUES(${valuePlaceholders})
    RETURNING *;
  `;
};
