<template>
  <String
    v-if="isString(relatedHeader.dataType)"
    :nativeValue="values.nativeValue"
    :column="column"
    :maxLength="relatedHeader.stringMaxLength"
    :disabled="disabled"
    :changeElements="changeElements"
    :settingsForEditor="settingsForEditor"
    ref="field"
  />
  <Bool
    v-else-if="isBool(relatedHeader.dataType)"
    :nativeValue="values.value"
    :values="relatedHeader"
    :changeElements="changeElements"
    ref="field"
  />
  <Date
    v-else-if="isDate(relatedHeader.dataType)"
    :column="column"
    :value="dateValue(values)"
    :disabled="disabled"
    :changeElements="changeElements"
    ref="field"
  />
  <DateTime
    v-else-if="isDateTime(relatedHeader.dataType)"
    :value="genericPreselected(values)"
    :column="column"
    :disabled="disabled"
    :useDefault="values.useDefault"
    :changeElements="changeElements"
    ref="field"
  />
  <Int
    v-else-if="isInt(relatedHeader)"
    :values="intValues"
    :nativeValue="values?.nativeValue || values?.defVal"
    :canClearValue="canClearValue"
    :column="column"
    :changeElements="changeElements"
    :updatePopupField="updatePopupField"
    :treeViewHelpers="treeViewHelpers"
    :assistants="assistants"
    :onChangeIntValue="onChangeIntValue"
    ref="field"
  />
  <Generic
    v-else
    :relatedHeader="relatedHeader"
    :preselectedValue="genericPreselected(values)"
    :isDefault="true"
    :column="column"
    :changeElements="changeElements"
    ref="field"
  />
</template>
<script>
import String from "../Form/FormRowDataType/String.vue";
import Bool from "../Form/FormRowDataType/Bool.vue";
import Date from "../Form/FormRowDataType/Date.vue";
import DateTime from "../Form/FormRowDataType/DateTime.vue";
import Int from "../Form/FormRowDataType/Int.vue";
import Generic from "../Form/FormRowDataType/Generic.vue";
import {
  isString,
  dateValue,
  isDate,
  isDateTime,
  isBool,
} from "../../methods/createFormData";
import { genericPreselected } from "../Form/utils";
export default {
  props: {
    disabled: { type: Boolean, default: false },
    column: { type: Object, default: null },
    values: { type: Object, default: null },
    relatedHeader: { type: Object, default: null },
    relatedValues: { type: Object, default: null },
    changeElements: { type: Function, default: null },
    canClearValue: { type: Boolean, default: true },
    settingsForEditor: { type: Object, default: null },
    treeViewHelpers: { type: Object, default: null },
    assistants: { type: Object, default: null },
    updatePopupField: { type: Function, default: null },
    onChangeIntValue: { type: Function, default: null },
  },

  created() {
    this.isString = isString;
    this.dateValue = dateValue;
    this.isDate = isDate;
    this.isDateTime = isDateTime;
    this.isBool = isBool;
    this.genericPreselected = genericPreselected;
  },

  computed: {
    field: function () {
      return this.$refs["field"];
    },
    intValues: function () {
      const { values, relatedValues } = this;
      const obj = { ...relatedValues };

      if (values?.nativeValue && values?.value) {
        obj[values.nativeValue] = values.value;
      }
      return obj;
    },
  },

  methods: {
    isInt: function (relatedHeader) {
      return !relatedHeader?.isIdentity && this.hasValues(this.relatedValues);
    },

    hasValues: function (relatedValues) {
      return relatedValues != null && Object.keys(relatedValues).length > 0;
    },
  },

  components: {
    String,
    Bool,
    Date,
    DateTime,
    Int,
    Generic,
  },
};
</script>
