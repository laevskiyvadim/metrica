<template>
  <nav class="nav-header">
    <TheHeaderNavSearch />
    <TheHeaderNavSettings />
  </nav>
</template>
<script>
import TheHeaderNavSearch from "./TheHeaderNavSearch.vue";
import TheHeaderNavSettings from "./TheHeaderNavSettings.vue";
export default {
  components: { TheHeaderNavSearch, TheHeaderNavSettings },
};
</script>
