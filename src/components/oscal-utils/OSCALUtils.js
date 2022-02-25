export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 *
 * @param data data to be updated with new value, for later use in a REST request
 * @param editedFieldJsonPath path to the field that is being updated
 * @param newValue updated value for the edited field
 * @param appendToLastFieldInPath boolean indicating if the updated value should be appended to an array or replace an existing value
 */
export function populatePartialRestData(
  data,
  editedFieldJsonPath,
  newValue = null,
  appendToLastFieldInPath = false
) {
  if (editedFieldJsonPath.length === 1) {
    const editData = data;

    if (typeof editedFieldJsonPath.at(0) === "function") {
      editedFieldJsonPath.at(0)(data);
    } else if (appendToLastFieldInPath) {
      editData[editedFieldJsonPath].push(newValue);
    } else {
      editData[editedFieldJsonPath] = newValue;
    }

    return;
  }

  if (Number.isInteger(editedFieldJsonPath.at(0))) {
    populatePartialRestData(
      data[Number(editedFieldJsonPath.shift())],
      editedFieldJsonPath,
      newValue,
      appendToLastFieldInPath
    );
  } else if (typeof editedFieldJsonPath.at(0) === "function") {
    populatePartialRestData(
      editedFieldJsonPath.shift()(data),
      editedFieldJsonPath,
      newValue,
      appendToLastFieldInPath
    );
  } else {
    populatePartialRestData(
      data[editedFieldJsonPath.shift()],
      editedFieldJsonPath,
      newValue,
      appendToLastFieldInPath
    );
  }
}
