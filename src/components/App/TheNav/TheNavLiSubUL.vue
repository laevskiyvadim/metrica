<template>
  <ul class="ul-sub">
    <li class="label">{{ theNavLi.title }}</li>
    <li
      @click.stop
      v-for="({ isActive, url, title }, idx) in theNavLi.children"
      :key="idx"
      :class="{ active: isActive }"
    >
      <a :href="url" @click.prevent="navigate(url)">
        <i></i>
        <p>{{ title }}</p>
      </a>
    </li>
  </ul>
</template>
<script>
export default {
  props: { theNavLi: { type: Object, required: true } },

  methods: {
    navigate: function (url) {
      const { $router } = this;
      $router.push(url);
    },
  },
};
</script>
