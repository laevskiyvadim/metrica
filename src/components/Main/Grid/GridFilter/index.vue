<template>
  <DropDown>
    <template v-slot:icon> <i class="faq icon-filter"></i> </template>
    <template v-slot:content>
      <FilterDropdown
        :filters="filters"
        :changeFilter="changeFilter"
        :storage="storage"
        ref="dropdown"
      />
    </template>
  </DropDown>
</template>
<script>
import DropDown from "../../shared/DropDown.vue";
import FilterDropdown from "./FilterDropdown.vue";
export default {
  props: {
    filters: { type: Object, required: true },
    changeFilter: { type: Function, default: null },
    storage: { type: Object, required: true },
  },
  computed: {
    condition: function () {
      let filter = this.$refs["dropdown"];
      return filter.condition;
    },
  },

  components: { DropDown, FilterDropdown },
};
</script>
