export function timestamps(mOffset = 0) {
  const curDate = new Date();

  let tzOffsets = getTimezoneOffset();

  //fist day month
  let startDate = new Date(
    curDate.getFullYear(),
    curDate.getMonth() + mOffset,
    1
  );
  //last day month
  let endDate = new Date(
    curDate.getFullYear(),
    curDate.getMonth() + 1 + mOffset,
    0
  );

  let start = Date.UTC(
    curDate.getFullYear(),
    curDate.getMonth() + mOffset,
    -startDate.getDay() + 1,
    tzOffsets[0],
    tzOffsets[1]
  );

  let end = Date.UTC(
    curDate.getFullYear(),
    curDate.getMonth() + 1 + mOffset,
    7 - endDate.getDay(),
    tzOffsets[0],
    tzOffsets[1]
  );

  let countWeeks = ((end - start) / (24 * 3600 * 1000) + 1) / 7;

  if (countWeeks != 6) {
    end = Date.UTC(
      curDate.getFullYear(),
      curDate.getMonth() + 1 + mOffset,
      7 - endDate.getDay() + 7 * (6 - countWeeks),
      tzOffsets[0],
      tzOffsets[1]
    );
  }

  return { start, end };
}

function ISOString(y, m, d, h, min) {
  return new Date(y, m, d, h, min).toISOString();
}

function getTimezoneOffset() {
  let tzOffsets = new Date().getTimezoneOffset() / 60;
  //смещение может быть не целым числом
  return [Math.floor(tzOffsets), (tzOffsets * 10) % 10];
}

export function groupingTasksByDates(tasks, mOffset = 0) {
  let startAndEndTime = timestamps(mOffset);
  let startDate = new Date(startAndEndTime.start);

  let startMonth = new Date(startAndEndTime.start).getMonth();
  let endMonth = new Date(startAndEndTime.end).getMonth();

  let startYear = startDate.getFullYear();
  let startDay = startDate.getDate();
  let tOf = getTimezoneOffset();

  startMonth > endMonth ? (endMonth += 12) : null;

  let output = pushDaysInArray(startMonth, endMonth, startYear, startDay, tOf);

  addTasksInOutput(tasks, output);

  return groupingOutputArrayToView(output);
}

function pushDaysInArray(startMonth, endMonth, startYear, startDay, tOf) {
  const curDate = new Date().toISOString();

  let output = [];

  for (let i = startMonth; i < endMonth + 1; i++) {
    let endDay = new Date(startYear, i + 1, 0).getDate();

    if (i == startMonth && startDay != 1) {
      for (let k = startDay; k < endDay + 1; k++) {
        output.push({
          dayNumb: ISOString(startYear, i, k, -tOf[0], tOf[1]),
          off: true,
        });
      }
    } else if (i == endMonth) {
      for (let k = 1; output.length < 42; k++) {
        output.push({
          dayNumb: ISOString(startYear, i, k, -tOf[0], tOf[1]),
          off: true,
        });
      }
    } else {
      for (let k = 1; k < endDay + 1; k++) {
        const objToPush = {
          dayNumb: ISOString(startYear, i, k, -tOf[0], tOf[1]),
          off: false,
        };

        if (objToPush.dayNumb.split("T")[0] == curDate.split("T")[0]) {
          objToPush.cssClass = "highlight";
        }
        output.push(objToPush);
      }
    }
  }

  return output;
}

function addTasksInOutput(tasks, output) {
  if (tasks.data && tasks.data[0]) {
    tasks.data[0].events.forEach((el) => {
      output.find((day) => {
        if (day.dayNumb.split("T")[0] == el.start.split("T")[0]) {
          if (!day.events) {
            day.events = [];
          }

          day.events.push(el);
        }
      });
    });
  }
}

function groupingOutputArrayToView(output) {
  let toView = [];

  for (let i = 0; i < output.length; i++) {
    let idx = 0;

    if (i != 0) {
      idx = Math.floor(i / 7);
    }

    if (!toView[idx]) {
      toView[idx] = [];
    }

    toView[idx].push(output[i]);
  }

  return toView;
}

export function eventStartTime(time) {
  let date = new Date(time);

  let hours = date.getHours();
  let minutes = date.getMinutes();
  let postfix = "a";

  if (hours > 12) {
    hours -= 12;
    postfix = "p";
  }

  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  return `${hours}:${minutes}${postfix}`;
}

function weekRange(datas, weekOffset) {
  // todo стреляет при переходе между месяцами
  let weekView = "";
  let options = {};
  let first = datas[weekOffset] ? datas[weekOffset][0] : "";
  let last = datas[weekOffset] ? datas[weekOffset][6] : "";

  let a = new Date(first.dayNumb);
  let b = new Date(last.dayNumb);

  options = { month: "short" };

  weekView += " " + internalizationDate(options, a);
  options = { day: "numeric" };
  weekView += internalizationDate(options, a);
  weekView += " - ";

  if (a.getMonth() == b.getMonth()) {
    weekView += internalizationDate(options, b);
  } else {
    options = { month: "short" };
    weekView += internalizationDate(options, b);
    options = { day: "numeric" };
    weekView += internalizationDate(options, b);
  }

  options = { year: "numeric" };
  weekView += " " + internalizationDate(options, b);
  weekView = weekView.replaceAll(".", " ");
  return weekView;
}

export function titleCalendar(type, datas, weekOffset, daysOffset) {
  let options = {
    year: "numeric",
    month: "long",
  };

  if (type == "Week") {
    options.month = "short";
  }

  if (type == "Day") {
    options.month = "short";
    options.day = "numeric";
    options.weekday = "long";
  }

  let currentDay;
  let a;
  let weekView = "";

  if (type != "Week" && datas[0]) {
    currentDay = datas[weekOffset][daysOffset];
    a = new Date(currentDay.dayNumb);
  }
  if (type == "Week" && datas[0]) {
    weekView = weekRange(datas, weekOffset);
  }

  if (type != "Week") {
    return internalizationDate(options, a);
  } else {
    return weekView;
  }
}

export function dayToView(date, type, h = "") {
  const a = new Date(date);

  let options = {};

  if (type == "Month") {
    if (!h) {
      options.day = "numeric";
    } else {
      options.weekday = "short";
    }
  }

  if (type == "Week") {
    options.day = "numeric";
    options.month = "2-digit";
    options.weekday = "short";
  }

  if (type == "Day") {
    options.day = "numeric";
    options.month = "2-digit";
    options.weekday = "long";
  }
  return internalizationDate(options, a);
}

function internalizationDate(options, a) {
  let language;
  if (navigator.languages != undefined) {
    language = navigator.languages[0];
  } else {
    language = navigator.language;
  }

  return new Intl.DateTimeFormat(language, options).format(a);
}

export function setDefOffsets(monthOffset, event) {
  const curDate = new Date();
  const firstDayOfMonth = new Date(
    curDate.getFullYear(),
    curDate.getMonth() + monthOffset,
    1
  );

  const lastDayOfMonth = new Date(
    curDate.getFullYear(),
    curDate.getMonth() + monthOffset + 1,
    0
  );

  //prev next

  let date;
  if (monthOffset == 0 && !event) {
    date = {
      weeks: Math.floor((curDate.getDate() + firstDayOfMonth.getDay()) / 7),
      days: curDate.getDay(),
    };
  } else {
    date = {
      weeks:
        event == "prev"
          ? Math.floor(
              (lastDayOfMonth.getDate() + firstDayOfMonth.getDay()) / 7
            )
          : 0,
      days:
        event == "prev"
          ? lastDayOfMonth.getDay() % 7
          : firstDayOfMonth.getDay(),
    };
  }
  return date;
}
