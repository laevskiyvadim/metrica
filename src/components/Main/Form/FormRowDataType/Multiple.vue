<template>
  <tr>
    <td :class="tableNameWidth" class="multiple">
      <span>{{ rowData?.accordName }}:</span>
    </td>

    <MultiSelect v-if="multiSelect" :rowData="rowData" ref="table" />
    <RowTable v-if="rowTable && !nameAtTop" :rowData="rowData" ref="table" />
  </tr>
  <RowTable v-if="rowTable && nameAtTop" :rowData="rowData" ref="table" />
</template>
<script>
import RowTable from "./MultiTable/RowTable.vue";
import MultiSelect from "./MultiTable/MultiSelect.vue";
export default {
  props: { rowData: { type: Object, required: true } },

  computed: {
    hasFormCondition: function () {
      return this.$refs["table"].hasFormCondition;
    },
    formCondition: function () {
      return this.$refs["table"].formCondition;
    },
    multiSelect: function () {
      return this.rowData?.multiSelect;
    },
    rowTable: function () {
      return this.rowData?.rowTable;
    },
    nameAtTop: function () {
      return this.rowData?.nameAtTop;
    },
    tableNameWidth: function () {
      return this.nameAtTop ? "" : "add";
    },
  },
  components: {
    RowTable,
    MultiSelect,
  },
};
</script>
<style scoped>
td {
  padding: 0;
  padding-right: 25px;
  font-size: 13px;
  cursor: auto;
  color: black;
  text-transform: uppercase;
  vertical-align: top;
  padding-top: 11px;
}
.add {
  width: 10%;
}
</style>
