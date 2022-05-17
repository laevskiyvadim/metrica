<template>
  <table v-if="type" class="calendar-body">
    <thead :class="{ 'week-day': type != 'Month' }">
      <tr>
        <th v-if="type != 'Month'"></th>
        <th
          v-for="({ dayNumb }, index) in type != 'Month' ? datas : datas[0]"
          :key="index"
        >
          {{ dayToView(dayNumb, type, "head") }}
        </th>

        <th v-if="type != 'Month'"></th>
      </tr>
      <tr v-if="type != 'Month'">
        <td>all-day</td>
        <td
          v-for="({ cssClass }, index) in datas"
          :key="index"
          :class="cssClass"
        ></td>
        <td></td>
      </tr>
    </thead>

    <tbody v-if="type == 'Month'">
      <tr v-for="(date, idx) of datas" :key="idx">
        <td
          v-for="({ dayNumb, off, events, cssClass }, index) of date"
          :key="index"
          :class="[{ off: off }, cssClass]"
        >
          <div class="item">
            <div class="day-number">{{ dayToView(dayNumb, type) }}</div>
            <div class="fc-content">
              <div
                class="event"
                v-for="({ start, title }, idx) of events"
                :key="idx"
              >
                <strong>{{ eventStartTime(start) }}</strong>
                <span>{{ title }}</span>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </tbody>

    <tbody v-else class="week-day">
      <tr>
        <td class="f">
          <template v-for="(time, idx) in times" :key="idx">
            <tr :class="{ t: idx == 0 }">
              <td>
                {{ time }}
              </td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
            </tr>
          </template>
        </td>
        <td
          v-for="({ cssClass, events }, index) in datas"
          :key="index"
          class="f"
        >
          <template v-for="(time, idx) in times" :key="idx">
            <tr :class="{ t: idx == 0 }">
              <td :class="cssClass">
                <div
                  :class="{
                    event: haveEventInThisTime(start, time, allDay),
                  }"
                  v-for="({ start, title, allDay }, idx) of events"
                  :key="idx"
                >
                  <template v-if="haveEventInThisTime(start, time, allDay)">
                    <strong>{{ eventStartTime(start) }}</strong>
                    <span>{{ title }}</span>
                  </template>
                </div>
              </td>
            </tr>
            <tr>
              <td :class="cssClass"></td>
            </tr>
          </template>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import { dayToView, eventStartTime } from "./utils";
export default {
  props: {
    type: { type: String, default: null },
    datas: { type: Array, default: null },
  },

  data() {
    return {
      times: [
        "12am",
        "1am",
        "2am",
        "3am",
        "4am",
        "5am",
        "6am",
        "7am",
        "8am",
        "9am",
        "10am",
        "11am",
        "12pm",
        "1pm",
        "2pm",
        "3pm",
        "4pm",
        "5pm",
        "6pm",
        "7pm",
        "8pm",
        "9pm",
        "10pm",
        "11pm",
      ],
    };
  },

  methods: {
    haveEventInThisTime: function (start, time, allDay) {
      let times;

      let eventTime = eventStartTime(start);

      if (time.length == 3) {
        times = time[0] + time[time.length - 2];
      } else {
        times = time[0] + time[1] + time[time.length - 2];
      }

      return (
        eventTime.split(":")[0] + eventTime[eventTime.length - 1] == times &&
        !allDay
      );
    },
  },

  created() {
    this.dayToView = dayToView;
    this.eventStartTime = eventStartTime;
  },
};
</script>
