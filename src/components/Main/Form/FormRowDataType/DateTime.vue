<template>
  <Date
    :value="dateValue"
    :changeElements="onChangeValue"
    :disabled="disabled"
  />
  <Time
    :value="timeValue"
    :changeElements="onChangeValue"
    :disabled="disabled"
  />
</template>
<script>
import Date from "./Date.vue";
import Time from "./Time.vue";
import { timeStamp } from "../utils";
import { dateTimeValue } from "../../../methods/createFormData";
export default {
  props: {
    value: { type: String, default: null },
    column: { type: Object, default: null },
    disabled: { type: Boolean, default: false },
    changeElements: { type: Function, default: null },
    useDefault: { type: Boolean, default: false },
  },
  data() {
    return { dateValue: "", timeValue: "" };
  },
  created() {
    this.timeStamp = timeStamp;
    if (this.value) {
      let values = this.splitMethod(this.value);
      this.dateValue = this.useDefault ? dateTimeValue()[0] : values[0];
      this.timeValue = this.useDefault ? dateTimeValue()[1] : values[1];
    }
  },
  computed: {
    formCondition: function () {
      const { completeLink } = this.column;
      const currentDateTime = `${this.dateValue} ${this.timeValue}`;
      let update = {
        [completeLink]: timeStamp(currentDateTime),
      };
      return update;
    },
    hasFormCondition: function () {
      if (this.value) {
        let values = this.splitMethod(this.value);
        return this.dateValue != values[0] || this.timeValue != values[1];
      } else {
        return this.dateValue != "" || this.timeValue != "";
      }
    },

    dateTimeValues: function () {
      return this.currentValue.split(" ");
    },
  },
  methods: {
    splitMethod: function (val) {
      return val.split(" ");
    },
    onChangeValue: function (value, flag = false) {
      if (flag) {
        this.timeValue = value;
      } else {
        this.dateValue = value;
      }
    },
  },
  components: {
    Date,
    Time,
  },
};
</script>
