<template>
  <MobHeader />
</template>
<script>
import MobHeader from "../components/App/Mob/MobHeader.vue";
export default {
  computed: {
    page() {
      const { $store } = this;
      return $store.state.currentPage?.page;
    },
  },

  mounted() {
    const { $store } = this;
    $store.dispatch("getPage", location.pathname);
  },

  methods: {},

  components: { MobHeader },
};
</script>
<style lang="scss" scoped>
a {
  b {
    text-decoration: none;
  }
}
</style>
