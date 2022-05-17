export function tabsData(tabData) {
  if (tabData && tabData.children?.length) {
    let output = [];

    for (const element of tabData.children) {
      output.push(element);
    }

    return output;
  } else if (tabData && tabData.tabs?.length) {
    return [tabData];
  } else {
    return [];
  }
}
