export function groupedActions(actions) {
  if (actions && actions.length && actions[0]) {
    return actions.reduce(
      (acc, val) => {
        const { group } = val;
        let idx = 0;
        if (typeof group == "string") idx = 1;

        acc[idx].push(val);
        return acc;
      },
      [[], []]
    );
  } else {
    return [];
  }
}
