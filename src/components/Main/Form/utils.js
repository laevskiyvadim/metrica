export function timeStamp(value) {
  let timeStamp;
  if (value && value != "" && typeof value != "number") {
    const dateTime = value.split(" ");
    let date;
    let time;
    if (dateTime[0]) {
      date = dateTime[0].split(".");
    }
    if (dateTime[1]) {
      time = dateTime[1].split(":");
    }
    timeStamp = Date.UTC(date[2], date[1] - 1, date[0], time[0], time[1]);
  } else if (typeof value == "number") {
    timeStamp = value;
  }
  return timeStamp;
}
export function dataType(element) {
  return element.relatedHeader.dataType;
}
export function nativeValue(element) {
  return element.values.nativeValue || "";
}
export function completeLink(element) {
  return element.relatedHeader.columnNamePseudo;
}
export function maxLength(element) {
  return element.relatedHeader.stringMaxLength;
}

export function genericPreselected(values) {
  if (values?.useDefault) return values.defVal;
  return values?.nativeValue;
}

export function tablesDataToResponse(formData, navigationTabs, getRow) {
  let condition = {};

  for (let k = 0; k < navigationTabs.length; k++) {
    const { length } = formData.tabs[k].headers;
    for (let i = 0; i < length; i++) {
      let table = getRow(k, i)[0];
      if (table && table.hasTableCondition) {
        for (const tablet of table.tableCondition) {
          let key = Object.keys(tablet);
          let value = tablet[key];
          condition[key] = value;
        }
      }
    }
  }
  return condition;
}

export function rowsDataToResponse(formData, navigationTabs, getRow) {
  let condition = {};

  for (let k = 0; k < navigationTabs.length; k++) {
    const { length } = formData.tabs[k].headers;
    for (let i = 0; i < length; i++) {
      let row = getRow(k, i)[0];
      if (row && row.hasFormCondition) {
        let key = Object.keys(row.formCondition);
        let value = Object.values(row.formCondition);
        condition[key] = String(value);
      }
    }
  }
  return condition;
}
