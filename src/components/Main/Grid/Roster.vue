<template>
  <div class="roster">
    <HavePartBy
      v-if="pageData.partBys.length != 0"
      :gridRows="rosterData.gridRows"
      :openedPopOver="openedPopOver"
      :checkVisible="checkVisible"
      :visible="visible"
      :actions="actions"
    />
    <DoNotHavePartBy
      v-if="pageData.partBys.length == 0"
      :openedPopOver="openedPopOver"
      :gridRows="rosterData.gridRows"
      :actions="actions"
    />
  </div>
</template>
<script>
import HavePartBy from "./Roster/HavePartBy.vue";
import DoNotHavePartBy from "./Roster/DoNotHavePartBy.vue";
import { groupedRosterRows } from "./Roster/utils";
export default {
  props: {
    pageData: { type: Object, required: true },
    openedPopOver: { type: Function, default: null },
  },
  data() {
    return {
      visible: [],
    };
  },

  computed: {
    rosterData: function () {
      if (this.pageData.partBys.length == 0) {
        return this.pageData;
      }

      this.clearVisible();

      return groupedRosterRows(this.pageData);
    },

    actions: function () {
      return this.rosterData.rowActionsGroups[0].actions;
    },
  },
  methods: {
    checkVisible: function (idx) {
      this.visible[idx] = !this.visible[idx];
    },

    clearVisible: function () {
      const partByGroupsCount = this.pageData.partBys[0].groups.length;
      for (let i = 0; i < partByGroupsCount; i++) {
        this.visible[i] = !this.pageData.partBys[0].collapsedOnStart;
      }
    },
  },
  components: { HavePartBy, DoNotHavePartBy },
};
</script>
