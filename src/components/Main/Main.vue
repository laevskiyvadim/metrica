<template>
  <MainTitle v-if="title" :title="title" :parentId="pageData.parentID" />
  <div class="main-row">
    <div class="main-col" v-if="pageData">
      <Tabset
        v-if="pageData.type == 'Tabset'"
        :pageData="pageData"
        :parentId="pageData.parentID"
      />
      <GeneralController
        v-else
        :page="pageData"
        :parentId="pageData.parentID"
      />
    </div>
  </div>
</template>
<script>
import MainTitle from "./MainTitle.vue";
import Tabset from "./TabSet/TabSet.vue";
import GeneralController from "../GeneralController.vue";
import { getElementOfType } from "../methods/createFormData";
export default {
  props: {
    page: { type: Object, required: true },
    title: { type: Object, default: null },
  },
  computed: {
    pageData: function () {
      const { page } = this;
      const { actionsUsedInCompilation } = page;

      if (typeof actionsUsedInCompilation == "boolean") {
        return getElementOfType(page)[0];
      }
      return page;
    },
  },

  components: {
    MainTitle,
    Tabset,
    GeneralController,
  },
};
</script>
