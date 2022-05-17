<template>
  <div class="tabset">
    <NavigationTabs
      :navigationTabs="navigationTabs"
      :idxMenuTab="idxMenuTab"
      :changedTab="changedTab"
    />
    <div v-for="(element, idx) in tabSetChildren" :key="idx">
      <Tab
        :tabData="element"
        v-if="element.type == 'Tab' && idxMenuTab == element.id"
        :parentId="parentId"
      />
    </div>
  </div>
</template>
<script>
import NavigationTabs from "./NavigationTabs.vue";
import Tab from "../Tab/Tab.vue";
import { navigationTabsData, tabSetChildrenData } from "./utils";

export default {
  props: {
    pageData: { type: Object, required: true },
    parentId: { type: String, required: true },
  },

  data() {
    return {
      idxMenuTab: "",
    };
  },

  updated() {
    this.setActiveTab();
  },

  mounted() {
    this.setActiveTab();
  },

  computed: {
    navigationTabs: function () {
      return navigationTabsData(this.pageData);
    },

    tabSetChildren: function () {
      return tabSetChildrenData(this.pageData);
    },
  },

  methods: {
    setActiveTab: function () {
      const { pageData } = this;
      const fromLocalStore = JSON.parse(localStorage.getItem("tabs"));

      let tab;
      if (fromLocalStore) {
        tab = fromLocalStore[pageData.parentID];
        if (tab) {
          this.idxMenuTab = tab;
        }
      }
      if (!tab) this.idxMenuTab = this.navigationTabs[0].id;
    },

    setCurrentTabInLocalStorage: function (tabId) {
      const { pageData } = this;

      let tabs = JSON.parse(localStorage.getItem("tabs"));

      if (!tabs) tabs = {};

      tabs[pageData.parentID] = tabId;
      localStorage.setItem("tabs", JSON.stringify(tabs));
    },

    changedTab: function (tabId, changeLocalStorage = true) {
      if (changeLocalStorage) this.setCurrentTabInLocalStorage(tabId);

      this.idxMenuTab = tabId;
    },
  },

  beforeUnmount() {
    if (this.pageData.children.length) {
      this.setCurrentTabInLocalStorage(this.idxMenuTab);
    }
  },
  components: {
    NavigationTabs,
    Tab,
  },
};
</script>
