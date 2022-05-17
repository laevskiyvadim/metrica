<template>
  <Multiple
    v-for="(multiTable, idx) of multiTablesBefore"
    :key="idx"
    :rowData="multiTable"
    :ref="'table' + idx"
  />
  <tr class="tr" v-if="!rowData.isHidden">
    <td class="td" v-if="!rowData.isTop">
      <span v-if="!rowData.isNameHidden">
        {{ rowData.accordName
        }}<span style="color: red" v-if="rowData.isRequired">*: </span
        ><span v-else>:</span>
      </span>
    </td>

    <td class="td" :colspan="rowData.isTop ? 2 : 1">
      <RowTypes
        :disabled="rowData.isReadonly"
        :column="{ completeLink: completeLink(rowData) }"
        :values="rowData.values"
        :relatedHeader="rowData.relatedHeader"
        :relatedValues="rowData.values.resultingPkRelatedValues"
        :canClearValue="rowData.relatedHeader.isNull"
        :settingsForEditor="settingsForEditor"
        :updatePopupField="updatePopupField"
        :treeViewHelpers="treeViewHelpers"
        :assistants="assistants"
        ref="row"
      />
    </td>

    <td class="td" v-if="rowData.isTop">
      <span v-if="!rowData.isNameHidden">
        {{ rowData.accordName
        }}<span style="color: red" v-if="rowData.isRequired">*: </span
        ><span v-else>:</span>
      </span>
    </td>
  </tr>
  <Multiple
    v-for="(multiTable, idx) of multiTablesAfter"
    :key="idx"
    :rowData="multiTable"
    :ref="'table' + idx"
  />
</template>

<script>
import Multiple from "./FormRowDataType/Multiple.vue";
import RowTypes from "../shared/RowTypes.vue";
import { completeLink } from "./utils";

export default {
  props: {
    rowData: {
      type: Object,
      required: true,
    },
    settingsForEditor: { type: Object, default: null },
    treeViewHelpers: { type: Object, default: null },
    assistants: { type: Object, default: null },
    updatePopupField: { type: Function, default: null },
  },

  computed: {
    hasFormCondition: function () {
      return this.$refs["row"]?.field?.hasFormCondition;
    },

    formCondition: function () {
      return this.$refs["row"].field?.formCondition;
    },

    hasTableCondition: function () {
      for (let i = 0; i < this.counter; i++) {
        if (this.$refs["table" + i][0].hasFormCondition) {
          return true;
        }
      }
      return false;
    },

    tableCondition: function () {
      let output = [];

      for (let i = 0; i < this.counter; i++) {
        if (this.$refs["table" + i][0].hasFormCondition) {
          output.push(this.$refs["table" + i][0].formCondition);
        }
      }
      return output;
    },

    counter: function () {
      return this.multiTablesBefore.length > this.multiTablesAfter.length
        ? this.multiTablesBefore.length
        : this.multiTablesAfter.length;
    },

    multiTablesBefore: function () {
      const { rowData } = this;
      let multiTable = [];
      for (const el in rowData.multiTablesBefore) {
        multiTable.push(rowData.multiTablesBefore[el]);
      }
      return multiTable;
    },

    multiTablesAfter: function () {
      const { rowData } = this;
      let multiTable = [];
      for (const el in rowData.multiTablesAfter) {
        multiTable.push(rowData.multiTablesAfter[el]);
      }
      return multiTable;
    },
  },

  beforeMount() {
    this.completeLink = completeLink;
  },
  methods: {},

  components: {
    Multiple,
    RowTypes,
  },
};
</script>
