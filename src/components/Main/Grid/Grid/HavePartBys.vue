<template>
  <tr class="have-part-by" @click="show = !show">
    <td class="inner">
      <i class="icon-some" :class="{ open: !show }"></i>
      <h3>{{ gridRow.title }}</h3>
    </td>
  </tr>
  <TableBodyRow
    v-show="show"
    v-for="(row, idx) in gridRow.rows"
    :key="idx"
    :gridRow="row"
    :addCheckbox="addCheckbox"
    :addActions="addActions"
    :headers="headers"
    :actions="chooseActions(idx)"
    :openPopUp="openPopUp"
    :openedPopOver="openedPopOver"
    :onEditRow="onEditRow"
  />
</template>
<script>
import { whatActionsInRow } from "../../../methods/createFormData";
import TableBodyRow from "./TableBody/TableBodyRow.vue";
export default {
  props: {
    gridRow: { type: Object, required: true },
    openPopUp: { type: Function, default: null },
    addActions: { type: Boolean, default: true },
    actions: { type: Object },
    addCheckbox: { type: Boolean, default: null },
    headers: { type: Object, required: true },
    openedPopOver: { type: Function, default: null },
    onEditRow: { type: Function, default: null },
  },

  data() {
    return {
      show: true,
    };
  },

  methods: {
    chooseActions: function (idx) {
      return whatActionsInRow(idx, this.actions);
    },
  },
  components: {
    TableBodyRow,
  },
};
</script>
