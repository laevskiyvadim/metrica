<template>
  <li
    class="has-children"
    :class="childrenClass"
    @click.prevent="$emit('menuActiveElement', theNavLi.title)"
    @mouseover="hoverIfMin(true)"
    @mouseleave="hoverIfMin(false)"
  >
    <a :href="theNavLi.url">
      <i :class="theNavLi.icon"></i>
      <p>{{ theNavLi.title }}</p>
    </a>
    <TheNavLiSubUL :theNavLi="theNavLi" />
  </li>
</template>
<script>
import TheNavLiSubUL from "./TheNavLiSubUL.vue";
export default {
  props: {
    theNavLi: { type: Object, required: true },
    activeParentLi: { type: String, required: true },
    activeLI: { type: Object, required: true },
    min: { type: Boolean, required: true },
  },
  data() {
    return { hover: false };
  },
  computed: {
    childrenClass: function () {
      return {
        active: this.activeParentLi === this.theNavLi.title,
        selected: this.selectedClasses,
        hover: this.hover,
      };
    },
    selectedClasses: function () {
      return !this.min
        ? this.activeLI[this.theNavLi.title] ^
            (this.activeParentLi == this.theNavLi.title)
        : this.activeLI[this.theNavLi.title];
    },
  },
  methods: {
    hoverIfMin: function (element) {
      if (this.min) {
        this.hover = element;
      }
    },
  },
  components: { TheNavLiSubUL },
};
</script>
