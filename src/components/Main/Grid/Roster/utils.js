export function groupedRosterRows(data) {
  const { gridRows, partBys } = data;
  let groups = [];
  for (const el of partBys[0].groups) {
    groups.push(el);
  }

  const newGrouping = [];

  for (let groupElement of groups) {
    const rows = [];
    const arr = groupElement.groupString.split("-");
    if (arr.length > 1) {
      for (let i = Number(arr[0]); i <= Number(arr[1]); i++) {
        rows.push({ ...gridRows[i] });
      }
      const objectToGroup = { ...groupElement, rows };
      newGrouping.push(objectToGroup);
    } else {
      rows.push({ ...gridRows[groupElement.groupString] });
      const objectToGroup = {
        ...groupElement,
        rows,
      };
      newGrouping.push(objectToGroup);
    }
  }

  const newData = { ...data };
  newData.gridRows = [...newGrouping];
  return newData;
}
