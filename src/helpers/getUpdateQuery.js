module.exports = function getUpdateQuery(tableName, id, values) {
  const keys = Object.keys(values);
  const assignments = keys.map((key, index) => `${key} = $${index + 1}`);
  return `
    UPDATE ${tableName} SET ${assignments.join(', ')}
    WHERE id = ${id}
    RETURNING *;
  `;
};
