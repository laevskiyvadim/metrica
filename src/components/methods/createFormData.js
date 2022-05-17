export function getElementOfType(data, type = "undefined") {
  let output = [];

  if (type) {
    if (data.type && data.type == type) {
      for (const element of data.children) {
        output.push(element);
      }
    } else {
      for (const element of data.children) {
        output.push(element);
      }
    }
  }

  return output;
}

export function createFormData(data) {
  let formData = new FormData();
  if (data != null) {
    let keys = Object.keys(data);
    let values = Object.values(data);
    for (let i = 0; i < keys.length; i++) {
      formData.append(keys[i], values[i]);
    }
  }
  return formData;
}

export function getAjaxOptions(model, referrer) {
  let formData = createFormData(model);
  const params = new URLSearchParams(formData);
  let options = {
    body: params,
    method: "POST",
    //todo
    referrer: referrer,
  };
  return options;
}

export function POSTToServer(url, data, referrer) {
  let options = getAjaxOptions(data, referrer);

  return new Promise((fullFiled, rejected) => {
    fetch(url, options).then((response) => {
      if (response.ok && response.redirected == false) {
        fullFiled(response);
      } else {
        alert(response.message);
        rejected(response);
      }
    });
  });
}

export function GETOfServer(url) {
  return new Promise((fullFiled, rejected) => {
    fetch(url).then((response) => {
      if (response.ok && response.redirected == false) {
        fullFiled(response);
      } else {
        alert(response.message);
        rejected(response);
      }
    });
  });
}

export async function imgFileFromServer(response, data) {
  let file = window.URL.createObjectURL(await response.blob());
  if (data.fileDownload) {
    const a = document.createElement("a");
    a.href = file;
    a.setAttribute("download", data.fileName);
    a.click();
    return [];
  } else if (data.filePreview) {
    const name = data.fileName.split(".");
    return { type: name[1], file };
  }
}

export function isInt(value) {
  return ["int", "uniqueidentifier", "tinyint", "smallint"].includes(value);
}

export function isString(value) {
  return ["nvarchar", "varchar", "ntext", "char", "nchar"].includes(value);
}

export function isDate(value) {
  return ["date"].includes(value);
}

export function isDateTime(value) {
  return ["datetime", "smalldatetime", "datetime2"].includes(value);
}

export function isBool(value) {
  return ["bit"].includes(value);
}

export function hiddenIfThisIsId(value) {
  if (value != undefined) {
    const id = value.match(
      /[a-f,0-9]{8}-[a-f,0-9]{4}-[a-f,0-9]{4}-[a-f,0-9]{4}-[a-f,0-9]{12}/g
    );
    if (id) {
      return true;
    } else {
      return false;
    }
  }
}

export function dateValue(RowData) {
  if (RowData.useDefault) {
    //todo пока не преобразуем значение RowData.values.defVal
    const date = new Date();

    return `${
      String(date.getDate()).length < 2 ? "0" + date.getDate() : date.getDate()
    }.${
      String(date.getMonth() + 1).length < 2
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1
    }.${date.getFullYear()}`;
  }

  if (!RowData.value) return "";

  return RowData.value;
}

export function dateTimeValue() {
  let date = new Date();

  return [
    `${
      String(date.getDate()).length < 2 ? "0" + date.getDate() : date.getDate()
    }.${
      String(date.getMonth() + 1).length < 2
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1
    }.${date.getFullYear()}`,

    `${
      String(date.getHours()).length < 2
        ? "0" + date.getHours()
        : date.getHours()
    }:${
      String(date.getMinutes()).length < 2
        ? "0" + date.getMinutes()
        : date.getMinutes()
    }`,
  ];
}

export function whatActionsInRow(idx, rowActionsGroups) {
  if (rowActionsGroups.length > 1) {
    for (const element of rowActionsGroups) {
      const group = element.groupString.split(",");
      for (const el of group) {
        const range = el.split("-");
        if ((idx >= range[0] && idx <= range[1]) || range[0] == idx)
          return element.actions;
      }
    }
  } else {
    return rowActionsGroups[0].actions;
  }
}

export function haveEmptyBlock(data) {
  const { state, partBys } = data;
  let groups;
  if (partBys[0]) groups = partBys[0].groups;
  else groups = [];
  const { length } = groups;
  const { pkExists, fkExists } = state;
  return (
    (pkExists && !fkExists) ||
    (!pkExists && fkExists && !(length > 1)) ||
    (pkExists && fkExists)
  );
}
