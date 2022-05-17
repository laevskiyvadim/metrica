export function recursionUpdateGrid(page, gridChildren) {
  for (let i = 0; i < page.length; i++) {
    const pageChildren = page[i];
    if (pageChildren.children && pageChildren.children[0]) {
      recursionUpdateGrid(pageChildren.children, gridChildren);
    } else if (pageChildren.id == gridChildren.id) {
      page[i] = gridChildren;
      break;
    } else {
      return;
    }
  }
}

export function recursionUpdatePopup(grid, popupChildren) {
  for (let i = 0; i < popupChildren.length; i++) {
    const currentList = popupChildren[i];
    if (currentList.id == grid.id) {
      popupChildren[i] = grid;
      break;
    } else if (currentList.children && currentList.children[0]) {
      recursionUpdatePopup(grid, currentList.children);
    } else {
      return;
    }
  }
}

export function updateFormField(tabs, field) {
  const { relatedHeader, values } = returnStandardFieldToUpdateFormField(field);

  for (let i = 0; i < tabs.length; i++) {
    let headers = tabs[i].headers;

    for (let k = 0; k < headers.length; k++) {
      let header = headers[k];

      if (header.relatedHeader.columnName == field.Header.ColumnName) {
        tabs[i].headers[k].relatedHeader = relatedHeader;
        tabs[i].headers[k].values = values;
        break;
      }
    }
  }
}

function returnStandardFieldToUpdateFormField(field) {
  const standardField = fieldToStandard(field);
  let { header, selectValues, values, ...data } = standardField;
  values.resultingPkRelatedValues = selectValues;
  header.dataType = "int";

  return { relatedHeader: header, values, ...data };
}

export function fieldToStandard(field) {
  const standardField = {};

  for (let item in field) {
    let itemLower = toLowerFirstCharset(item);

    if (typeof field[item] == "object") {
      if (field[item] != null) {
        standardField[itemLower] = {};

        for (let subItem in field[item]) {
          let subItemLower = toLowerFirstCharset(subItem);
          standardField[itemLower][subItemLower] = field[item][subItem];
        }
      }
    } else {
      standardField[itemLower] = field[item];
    }
  }

  return standardField;
}

function toLowerFirstCharset(item) {
  return item[0].toLowerCase() + item.slice(1, item.length);
}
