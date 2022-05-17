export function tbodyColumnWidth(header) {
  let { widthIsSet, width } = header;

  return widthIsSet != undefined ? width : "20px";
}

export function firstCharToLowerCase(word) {
  return word[0].toLowerCase() + word.slice(1);
}
