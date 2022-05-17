<template>
  <div>Pie</div>
  <line-chart :pies="pageData.pies"></line-chart>
</template>
<script>
import lineChart from "./Doughnut.vue";
export default {
  props: {
    pageData: { type: Object, require: true },
    openPopUp: { type: Function, default: null },
    openedPopOver: { type: Function, default: null },
  },
  components: { lineChart },
};
</script>
