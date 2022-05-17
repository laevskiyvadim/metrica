<template>
  <Desktop v-if="!mobileType" />
  <Mobile v-if="mobileType" />
</template>
<script>
import Desktop from "./Desktop.vue";
import Mobile from "./Mobile.vue";
export default {
  name: "App",
  data() {
    return { mobileType: "" };
  },
  methods: {
    updateViewType: function () {
      if (window.innerWidth < 769) {
        this.mobileType = true;
      } else {
        this.mobileType = false;
      }
    },
  },

  mounted() {
    const { updateViewType } = this;
    window.addEventListener("resize", updateViewType);
    if (window.innerWidth < 769) {
      this.mobileType = true;
    } else {
      this.mobileType = false;
    }
  },

  unmounted() {
    const { updateViewType } = this;
    window.removeEventListener("resize", updateViewType);
  },

  components: {
    Mobile,
    Desktop,
  },
};
</script>
