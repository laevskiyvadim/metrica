export function recursionTreeAddNodes(rows, el, parentId) {
  for (let i = 0; i < rows.length; i++) {
    const child = rows[i];

    if (child.rows && child.rows[0]) {
      recursionTreeAddNodes(child.rows, el, parentId);
    } else if (child.id == parentId) {
      child.rows = el.rows;
      break;
    }
  }
}

export function recursionDeleteNode(pageData, deleteId) {
  let { rows, children } = pageData;
  const RoC = children.length ? false : true;
  const length = rows?.length || children?.length;

  for (let i = 0; i < length; i++) {
    const row = RoC ? rows[i] : children[i];

    if (row.id != deleteId) {
      const { rows: z } = row;
      const bool = row[z?.length ? "rows" : "children"];

      if (bool && bool[0]) {
        recursionDeleteNode(RoC ? rows[i] : children[i], deleteId);
      }
    } else if (row.id == deleteId) {
      pageData[RoC ? "rows" : "children"] = pageData[
        RoC ? "rows" : "children"
      ].filter((el) => el.id != deleteId);
      break;
    } else {
      return;
    }
  }
}

export function recursionAddNode(pageData, current, parentId, last = false) {
  const { rows, children } = pageData;
  const RoC = rows ? true : false;
  const length = rows?.length || children?.length;

  for (let i = 0; i < length; i++) {
    const row = RoC ? rows[i] : children[i];

    if (row.id != parentId) {
      const bool = row[row?.rows ? "rows" : "children"];

      if (bool && bool[0]) {
        recursionAddNode(row, current, parentId, last);
      }
    } else if (row.id == parentId) {
      let cur = row[row?.rows ? "rows" : "children"];

      last ? cur.push(current) : cur.unshift(current);
      break;
    } else {
      return;
    }
  }
}

export function recursionChangeName(rows, text, parent) {
  // no children
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    row;
    if (row.id != parent) {
      if (row.rows && row.rows[0]) {
        recursionChangeName(row.rows, text, parent);
      }
    } else if (row.id == parent) {
      row.text = text;
      break;
    } else {
      return;
    }
  }
}

export function installedFlagsToRow(pageData, rowId, status, flag) {
  const { rows, children } = pageData;
  const RoC = rows ? true : false;
  const length = rows?.length || children?.length;

  for (let i = 0; i < length; i++) {
    const row = RoC ? rows[i] : children[i];

    if (row.id != rowId) {
      const bool = row[row?.rows ? "rows" : "children"];

      if (bool && bool[0]) {
        installedFlagsToRow(row, rowId, status, flag);
      }
    } else if (row.id == rowId) {
      row[flag] = status;
      break;
    } else {
      return;
    }
  }
}

export function recursionThisIsParent(pageData, currentId, dropZoneId) {
  const { rows, children } = pageData;
  const RoC = children && children.length ? false : true;
  const length = rows?.length || children?.length;
  let param = false;

  for (let i = 0; i < length; i++) {
    const row = RoC ? rows[i] : children[i];
    const bool = row[row.children?.length ? "children" : "rows"];

    if (row.id == dropZoneId) {
      if (bool && bool[0]) {
        param = parentHaveCurrent(row, currentId);
      }
      break;
    } else if (row.id != dropZoneId) {
      if (bool && bool[0]) {
        param = recursionThisIsParent(row, currentId, dropZoneId);
        if (param) break;
      }
    }
  }
  return param;
}

function parentHaveCurrent(data, currentId) {
  const { rows, children } = data;
  const RoC = children && children.length ? false : true;
  const length = rows?.length || children?.length;
  let param = false;

  for (let i = 0; i < length; i++) {
    const row = RoC ? rows[i] : children[i];

    if (row.id == currentId) {
      param = true;
      break;
    }
  }
  return param;
}

export function recursionThisIsChild(pageData, currentId, dropZoneId) {
  const { rows, children } = pageData;
  const RoC = children && children.length ? false : true;
  const length = rows?.length || children?.length;
  let param = false;

  for (let i = 0; i < length; i++) {
    const row = RoC ? rows[i] : children[i];
    const bool = row[row.children?.length ? "children" : "rows"];

    if (row.id == currentId) {
      if (bool) param = checkThisChild(row, dropZoneId);
      break;
    } else if (bool && bool[0]) {
      param = recursionThisIsChild(row, currentId, dropZoneId);
      if (param) break;
    }
  }

  return param;
}

function checkThisChild(data, dropZoneId) {
  const { rows, children } = data;
  const RoC = children && children.length ? false : true;
  const length = rows?.length || children?.length;

  let param = false;
  for (let i = 0; i < length; i++) {
    const row = RoC ? rows[i] : children[i];
    const bool = row[row.children?.length ? "children" : "rows"];
    if (row.id == dropZoneId) {
      param = true;
      break;
    } else if (bool && bool[0]) {
      param = checkThisChild(row, dropZoneId);
      if (param) break;
    }
  }
  return param;
}
