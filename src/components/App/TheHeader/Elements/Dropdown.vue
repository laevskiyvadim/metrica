<template>
  <li
    class="drop"
    @focusout="closeDropDown($event)"
    ref="dropdown"
    tabindex="0"
    @click="dropdown = !dropdown"
    :class="{ open: dropdown }"
  >
    <a class="toggle">
      <i></i>
      <b class="caret"></b>
    </a>
    <ul class="menu" @click.stop>
      <li
        @click.stop
        v-for="item of items"
        :key="item.id"
        :class="{ divider: item.cssClass ? true : false }"
      >
        <a @click.stop :href="item.link" v-if="item.cssClass ? false : true">{{
          item.name
        }}</a>
      </li>
    </ul>
  </li>
</template>
<script>
export default {
  data() {
    return {
      dropdown: false,
      items: [
        {
          id: 1,
          link: "/admin/edit-configs.aspx",
          name: "Administration",
          cssClass: false,
        },
        {
          id: 2,
          link: "/admin/reanalyze.aspx?pid=35",
          name: "ReAnalyze",
          cssClass: false,
        },
        {
          id: 3,
          link: "",
          name: "",
          cssClass: true,
        },
        {
          id: 4,
          link: "/admin/edit-configs.aspx?pid=35",
          name: "Configs",
          cssClass: false,
        },
        {
          id: 5,
          link: "/admin/edit-pages.aspx",
          name: "Pages",
          cssClass: false,
        },
        {
          id: 6,
          link: "/admin/edit-pack-class.aspx",
          name: "Pack Class",
          cssClass: false,
        },
        {
          id: 7,
          link: "/admin/debug-page.aspx",
          name: "Debug Log",
          cssClass: false,
        },
        {
          id: 8,
          link: "/admin/snippets.aspx",
          name: "Snippets",
          cssClass: false,
        },
        {
          id: 9,
          link: "",
          name: "",
          cssClass: true,
        },
        {
          id: 10,
          link: "/admin/change-password.aspx",
          name: "Change Password",
          cssClass: false,
        },
      ],
    };
  },
  methods: {
    closeDropDown($event) {
      if (
        !this.$refs["dropdown"].contains($event.target) ||
        !$event.relatedTarget ||
        !this.$refs["dropdown"].contains($event.relatedTarget)
      ) {
        this.dropdown = false;
      }
    },
  },
};
</script>
