<template>
  <ul class="nav-tabs">
    <li
      :class="activeNavLi(tab)"
      v-for="(tab, index) in navigationTabs"
      :key="index"
      :tabindex="index"
      @focusout="show[index] = false"
    >
      <a class="navigate" @click.prevent="changeTab(tab, index)">
        {{ tab?.title ? tab.title : title(tab).title }}

        <span v-if="!tab?.title" class="caret"></span>
      </a>

      <ul v-if="Object.keys(tab).length == 1" :class="showSubUl(index)">
        <li v-for="(subTab, idx) in tab[Object.keys(tab)[0]]" :key="idx">
          <a
            @click.prevent="changeSubTab(tab, index, idx)"
            :class="{ active: idxMenuTab == subTab.id }"
          >
            {{ subTab.title }}
          </a>
        </li>
      </ul>
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    navigationTabs: { type: Object, required: true },
    idxMenuTab: { type: String, required: true },
    changedTab: { type: Function, default: null },
  },

  data() {
    return { show: [], currentTitle: {} };
  },

  methods: {
    showSubUl: function (index) {
      return { subUl: true, show: this.show[index] };
    },

    activeNavLi: function (tab) {
      let keys = Object.keys(tab);
      let current = this.currentTitle[keys[0]];
      return {
        active:
          tab.id == this.idxMenuTab ||
          tab[keys[0]][current ? current : 0].id == this.idxMenuTab ||
          tab.title == this.idxMenuTab,
      };
    },

    title: function (tab) {
      let keys = Object.keys(tab);
      let index = this.currentTitle[keys[0]];
      if (index) {
        return tab[keys[0]][index];
      } else {
        return tab[keys[0]][0];
      }
    },

    openUl: function (idx) {
      this.show[idx] = !this.show[idx];
    },

    changeSubTab: function (tab, index, idx) {
      let keys = Object.keys(tab);

      this.changedTab(tab[keys[0]][idx].id);

      this.currentTitle[keys[0]] = idx;

      this.openUl(index);
    },

    changeTab: function (tab, index) {
      const { id } = tab;

      if (id) {
        this.changedTab(id);
      } else {
        let keys = Object.keys(tab);
        let arrayOfSubUl = tab[keys[0]];
        let currentTab = this.currentTitle[keys[0]];

        if (arrayOfSubUl[currentTab]?.id) {
          this.changedTab(arrayOfSubUl[currentTab].id);
        } else {
          this.changedTab(arrayOfSubUl, false);
        }

        this.openUl(index);
      }
    },
  },
  created() {
    const { navigationTabs } = this;

    for (const tab of navigationTabs) {
      let keys = Object.keys(tab);

      if (keys.length == 1) {
        let currentTab = tab[keys[0]];
        let foundIndex = currentTab.findIndex((el) => el.id == this.idxMenuTab);

        if (foundIndex != -1) {
          this.currentTitle[keys[0]] = foundIndex;
        } else {
          this.currentTitle[keys[0]] = 0;
        }
      }
    }
  },
};
</script>
