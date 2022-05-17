<template>
  <div class="nav">
    <nav :class="{ min: size }">
      <div></div>
      <ul v-for="menu of navigationMenuData.children" :key="menu.id">
        <TheNavLi
          v-for="(theNavLi, idx) in menu.children"
          :key="idx"
          :theNavLi="theNavLi"
          :activeParentLi="activeParentLi"
          :activeLI="activeLI"
          :min="size"
          @menuActiveElement="menuActiveElement"
        />
      </ul>
    </nav>
  </div>
</template>
<script>
import TheNavLi from "./TheNavLi.vue";
export default {
  props: {
    size: { type: Boolean, required: true },
    navigationMenuData: { type: Object, default: null },
  },
  data() {
    return {
      activeLI: {},
    };
  },

  computed: {
    activeParentLi: function () {
      let tit;
      for (const menu of this.navigationMenuData.children)
        for (const { title, children } of menu.children)
          for (const { isActive } of children) if (isActive) tit = title;

      return tit;
    },
  },

  updated() {
    const { menuActiveElement } = this;
    menuActiveElement();
  },

  created() {
    this.closeAllActiveLi = function () {
      for (const el of Object.keys(this.activeLI)) {
        this.activeLI[el] = false;
      }
    };
  },

  watch: {
    size() {
      if (this.size) {
        this.closeAllActiveLi();
      }
    },
    navigationMenuData() {},
  },

  methods: {
    menuActiveElement: function (element) {
      for (const el of Object.keys(this.activeLI)) {
        if (el != element) this.activeLI[el] = false;
      }
      if (!this.size) {
        if (this.activeLI[element]) {
          this.activeLI[this.activeParentLi] = true;
          this.activeLI[element] = false;
        } else {
          this.activeLI[this.activeParentLi] = true;
          this.activeLI[element] = true;
        }
      }
    },
  },
  components: { TheNavLi },
};
</script>
