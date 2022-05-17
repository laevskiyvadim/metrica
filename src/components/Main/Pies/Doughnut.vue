<template>
  <div
    style="
      height: 600px;
      width: 600px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    "
  >
    <vue3-chart-js :type="doughnutChart.type" :data="doughnutChart.data"
      >a</vue3-chart-js
    >
  </div>
</template>
<script>
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";
export default {
  props: {
    pies: { type: Array },
  },
  components: {
    Vue3ChartJs,
  },
  computed: {
    doughnutChart: function () {
      return {
        type: "doughnut",
        data: {
          labels: this.pies[0].values.map((el) => el.label),
          datasets: [
            {
              backgroundColor: ["#41B883", "#E46651"],
              borderWidth: 4,
              rotation: 180,
              hoverBorderWidth: 5,
              hoverBorderColor: "#000",
              data: this.pies[0].values.map((el) => el.value),
            },
          ],
        },
      };
    },
  },
};
</script>
