<template>
  <ul class="ul-search">
    <li>
      <div @focusout="closeDropDown($event)" ref="dropdown" tabindex="0">
        <input @keyup.enter="searchResult" v-model="input" />
        <div class="dialog" :style="{ display: visible ? 'block' : 'none' }">
          <div class="body" @click.stop v-html="response"></div>
        </div>
      </div>
    </li>
  </ul>
</template>
<script>
export default {
  data() {
    return {
      input: "",
    };
  },

  computed: {
    response: function () {
      const { $store } = this;
      return $store.state.search;
    },
    visible: function () {
      return this.response.length;
    },
  },

  methods: {
    closeDropDown($event) {
      if (
        !this.$refs["dropdown"].contains($event.target) ||
        !$event.relatedTarget ||
        !this.$refs["dropdown"].contains($event.relatedTarget)
      ) {
        this.$store.commit("setSearch", "");
      }
    },
    searchResult: function () {
      const { $store, input } = this;

      const request = {
        text: input,
        pageId: "MyCommitteeView",
      };

      $store.dispatch("search", request);
    },
  },
};
</script>
