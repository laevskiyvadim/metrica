export function groupTabs(navigationTabs) {
  return navigationTabs.reduce((acc, val) => {
    const { group, id, title } = val;

    if (group) {
      const found = acc.find((el) => {
        return Object.keys(el)[0] == val.group;
      });

      if (!found) acc.push({ [group]: [{ id, title }] });
      else found[group].push({ id, title });
    } else {
      acc.push(val);
    }

    return acc;
  }, []);
}

export function navigationTabsData(pageData) {
  let output = [];
  if (pageData && pageData.children.length) {
    for (const { title, id, group } of pageData.children) {
      output.push({ title, id, group });
    }
    return groupTabs(output);
  } else if (pageData && pageData.tabs.length) {
    for (const { key, accordName } of pageData.tabs) {
      output.push({ title: key, accordName });
    }

    return output;
  } else {
    return [];
  }
}

export function tabSetChildrenData(pageData) {
  if (pageData && pageData.children.length) {
    let output = [];
    for (const element of pageData.children) {
      output.push(element);
    }

    return output;
  } else if (pageData && pageData.tabs.length) {
    let output = [];

    for (const currentElement of pageData.tabs) {
      const elem = { ...pageData };
      elem.tabs = [currentElement];
      output.push(elem);
    }

    return output;
  } else {
    return [];
  }
}
