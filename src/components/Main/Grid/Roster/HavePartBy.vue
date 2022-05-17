<template>
  <div class="part-by-rooster" v-for="(partBy, idx) in gridRows" :key="idx">
    <div class="inner" @click="() => checkVisible(idx)">
      <i class="icon-some" :class="open(idx)"></i>
      <h3>{{ partBy.title || " " }}</h3>
    </div>
    <div
      :style="{
        display: visible[idx] ? 'block' : 'none',
      }"
    >
      <RosterRow
        v-for="(row, idx) in partBy.rows"
        :key="idx"
        :row="row"
        :actions="actions"
        :openedPopOver="openedPopOver"
      />
    </div>
  </div>
</template>
<script>
import RosterRow from "./RosterRow.vue";
export default {
  props: {
    gridRows: { type: Object, required: true },
    checkVisible: { type: Function, default: null },
    visible: { type: Object, required: true },
    actions: { type: Object, required: true },
    openedPopOver: { type: Function, default: null },
  },

  methods: {
    open: function (idx) {
      return { open: this.visible[idx] };
    },
  },
  components: { RosterRow },
};
</script>
