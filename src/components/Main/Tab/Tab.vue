<template>
  <div class="responsive" v-for="(element, idx) in tabs" :key="idx">
    <GeneralController
      :page="element"
      :parentId="parentId"
      :ref="'general' + idx"
    />
  </div>
</template>
<script>
import GeneralController from "../../GeneralController.vue";
import { tabsData } from "./utils";
export default {
  props: {
    tabData: { type: Object, required: true },
    parentId: { type: String, required: true },
  },

  computed: {
    dataToFetchGrid: function () {
      const { $refs } = this;
      let tab;

      if ($refs["general0"]) {
        tab = $refs["general0"][0].dataToFetchGrid;
      }
      return tab;
    },

    tabs: function () {
      const { tabData } = this;
      return tabsData(tabData);
    },
  },

  components: {
    GeneralController,
  },
};
</script>
