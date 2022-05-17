<template>
  <div class="calendar-title">
    <table>
      <tbody>
        <tr>
          <td>
            <span class="cor-l" @click="prev"> prev </span>
            <span class="cor-r" @click="next"> next </span>
            <em></em>
            <span class="cor-l cor-r" :class="todayBtnClass" @click="today">
              today
            </span>
          </td>
          <td>
            <div>
              <h2>
                {{ title }}
              </h2>
            </div>
          </td>
          <td>
            <span
              class="cor-l"
              @click="changeType('Month')"
              :class="{ active: type == 'Month' }"
            >
              month
            </span>
            <span
              @click="changeType('Week')"
              :class="{ active: type == 'Week' }"
            >
              week
            </span>
            <span
              class="cor-r"
              @click="changeType('Day')"
              :class="{ active: type == 'Day' }"
            >
              day
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <CalendarBody
    :type="type"
    :datas="dataToBody(type, datas, weekOffset, daysOffset)"
  />
</template>
<script>
import CalendarBody from "./CalendarBody.vue";
import {
  timestamps,
  titleCalendar,
  setDefOffsets,
  groupingTasksByDates,
} from "./utils";
export default {
  props: {
    calendarData: { type: Object, require: true },
    parentId: { type: String, required: true },
  },

  data() {
    return {
      type: "",
      monthOffset: 0,
      weekOffset: 0,
      daysOffset: 0,
      defDay: 0,
      defWeek: 0,
      event: "",
    };
  },

  watch: {
    monthOffset() {
      const { fetchToServer } = this;

      let offsets = setDefOffsets(this.monthOffset, this.event);
      this.defWeek = this.weekOffset = offsets.weeks;
      this.defDay = this.daysOffset = offsets.days;
      fetchToServer();
    },
  },

  computed: {
    datas: function () {
      const { $store, monthOffset } = this;
      const calendarData = $store.state.calendarEvents;

      return groupingTasksByDates(calendarData, monthOffset);
    },

    title: function () {
      return this.type
        ? titleCalendar(this.type, this.datas, this.weekOffset, this.daysOffset)
        : "";
    },

    todayBtnClass: function () {
      let flag = false;

      if (this.type == "Month" && !this.monthOffset) flag = true;

      if (
        this.type == "Week" &&
        !this.monthOffset &&
        this.weekOffset == this.defWeek
      )
        flag = true;

      if (
        this.type == "Day" &&
        !this.monthOffset &&
        this.weekOffset == this.defWeek &&
        this.daysOffset == this.defDay
      )
        flag = true;

      return {
        disabled: flag,
      };
    },

    curPeriod: function () {
      const { monthOffset } = this;
      return timestamps(monthOffset);
    },

    infoToFetchData: function () {
      const obj = {
        start: this.curPeriod.start,
        end: this.curPeriod.end,
        controlId: this.calendarData.id,
        referer: "https://my.corpgen.ua/iaa" + location.pathname,
        pageId: this.parentId,
      };

      return obj;
    },
  },

  methods: {
    dataToBody: function (type, datas, weekOffset, daysOffset) {
      let data =
        type == "Day"
          ? [datas[weekOffset][daysOffset]]
          : type == "Week"
          ? datas[weekOffset]
          : datas;
      return data;
    },

    changeType: function (type) {
      this.type = type;
    },

    today: function () {
      this.event = "";

      if (this.monthOffset == 0) {
        this.weekOffset = this.defWeek;
        this.daysOffset = this.defDay;
      }

      this.monthOffset = 0;
    },

    prev: function () {
      const { type, datas } = this;
      this.event = "prev";

      if (type == "Month") {
        this.monthOffset--;
      }

      if (type == "Week") {
        if (this.weekOffset == 0) {
          this.monthOffset--;
        } else {
          this.weekOffset--;
          if (datas[this.weekOffset][0].off) this.monthOffset--;
        }
      }

      if (type == "Day") {
        if (this.daysOffset == 0) {
          this.weekOffset--;
          this.daysOffset = 6;
        } else {
          this.daysOffset--;
        }
        if (datas[this.weekOffset][0].off) {
          this.monthOffset--;
        }
      }
    },

    next: function () {
      const { type, datas } = this;
      this.event = "next";

      if (type == "Month") {
        this.monthOffset++;
      }

      if (type == "Week") {
        this.weekOffset++;
        if (datas[this.weekOffset][6].off) this.monthOffset++;
      }

      if (type == "Day") {
        if (this.daysOffset == 6) {
          this.daysOffset = 0;
          this.weekOffset++;
        } else {
          this.daysOffset++;
        }

        if (datas[this.weekOffset][this.daysOffset].off) {
          this.monthOffset++;
          this.weekOffset = 0;
        }
      }
    },

    fetchToServer: function () {
      const { infoToFetchData, monthOffset, event, $store } = this;

      $store.dispatch("setCalendarEvents", infoToFetchData);

      let offsets = setDefOffsets(monthOffset, event);
      this.defWeek = this.weekOffset = offsets.weeks;
      this.defDay = this.daysOffset = offsets.days;
    },
  },

  created() {
    const calendar = this.$store.state.calendar;
    if (calendar) {
      this.type = calendar.type;
      this.monthOffset = calendar.monthOffset;
      this.weekOffset = calendar.weekOffset;
      this.daysOffset = calendar.daysOffset;
      this.defDay = calendar.defDay;
      this.defWeek = calendar.defWeek;
    } else {
      this.fetchToServer();
    }
  },

  mounted() {
    this.titleCalendar = titleCalendar;
  },

  beforeUnmount() {
    this.$store.commit("saveCalendar", {
      datas: this.datas,
      type: this.type,
      monthOffset: this.monthOffset,
      weekOffset: this.weekOffset,
      daysOffset: this.daysOffset,
      defDay: this.defDay,
      defWeek: this.defWeek,
    });
  },

  components: {
    CalendarBody,
  },
};
</script>
