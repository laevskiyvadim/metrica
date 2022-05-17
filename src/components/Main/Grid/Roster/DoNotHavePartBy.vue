<template>
  <RosterRow
    v-for="(row, idx) in gridRows"
    :key="idx"
    :row="row"
    :openedPopOver="openedPopOver"
    :actions="actions"
  />
</template>
<script>
import RosterRow from "./RosterRow.vue";
export default {
  props: {
    gridRows: { type: Object, required: true },
    openedPopOver: { type: Function, default: null },
    actions: { type: Object, required: true },
  },
  components: {
    RosterRow,
  },
};
</script>
