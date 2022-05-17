<template>
  <div class="pos" v-if="helper?.display != 2">
    <div :class="headerStyle" ref="header">
      <a @click.prevent="toggleDrop">
        <span>{{ value() || "Выбрать:" }}</span>
        <abbr @click.stop="clearValue" v-if="canClearValue"> </abbr>

        <span>
          <b>
            <i
              class="icon-sitemap"
              v-if="helper?.display == 1 || assistant?.display == 1"
              @click.stop="openPopover"
              ref="element"
            ></i>
          </b>
        </span>
      </a>
    </div>

    <div class="mask" @click="check = !check" :style="bodyStyle"></div>

    <div class="drop" :style="bodyStyle" :class="bodyClass">
      <div class="search">
        <input type="text" v-model="search" ref="search" />
      </div>
      <ul>
        <li
          v-for="(el, idx) in searchFilter"
          :key="idx"
          @mouseover="() => onHover(idx, true)"
          @mouseout="() => onHover(idx, false)"
          @click.stop="() => changeValue(idx)"
          :class="{ highlighted: hover[idx] }"
        >
          {{ el }}
        </li>
        <li v-if="doNotHaveResult" class="no-results">Нет результатов</li>
      </ul>
    </div>
  </div>
  <TreeView
    v-if="helper?.display == 2"
    :treeViewData="helper?.tree"
    :onSelectItem="onSelectItem"
    :selectValue="selectValue"
    :parentId="parentId"
  />
  <i class="icon-remove-sign" v-if="helper?.display == 2" @click="clearValue">
  </i>
</template>
<script>
import TreeView from "../../TreeView/TreeView.vue";
export default {
  components: { TreeView },
  props: {
    values: {
      type: Object,
      required: true,
    },
    nativeValue: { type: String, default: null },
    changeElements: { type: Function, default: null },
    column: { type: Object, default: null },
    canClearValue: { type: Boolean, default: true },
    updatePopupField: { type: Function, default: null },
    onChangeIntValue: { type: Function, default: null },
    treeViewHelpers: { type: Object, default: null },
    assistants: { type: Object, default: null },
  },

  data() {
    return {
      check: false,
      hover: [],
      selectValue: "",
      search: "",
      direction: false,
    };
  },

  watch: {
    nativeValue() {
      this.selectValue = this.nativeValue != null ? this.nativeValue : null;
    },
  },

  created() {
    this.selectValue = this.nativeValue != null ? this.nativeValue : null;
  },

  computed: {
    parentId: function () {
      const { $store } = this;
      const { state } = $store;
      const { popupData } = state;
      return popupData?.parentID;
    },
    tree: function () {
      const { helper } = this;
      if (!helper) return [];

      const { tree } = helper;
      if (!tree) return [];

      return tree;
    },

    assistant: function () {
      const { column, assistants } = this;
      if (!assistants) return null;
      const { completeLink } = column;

      const assistant = assistants.filter((el) => {
        return el.initiator.split(".")[1] == completeLink;
      });
      return assistant[0];
    },

    helper: function () {
      const { column, treeViewHelpers } = this;
      if (!treeViewHelpers) return null;
      const { completeLink } = column;

      const helper = treeViewHelpers.filter((el) => {
        return el.initiator.split(".")[1] == completeLink;
      });
      return helper[0];
    },

    condition: function () {
      const { completeLink } = this.column;
      let update = {
        Column: completeLink,
        Type: "Equal",
        Values: [this.selectValue],
      };
      return update;
    },

    formCondition: function () {
      const { completeLink } = this.column;
      return { [completeLink]: this.selectValue };
    },

    hasFormCondition: function () {
      return this.selectValue != this.nativeValue && this.selectValue != null;
    },

    hasCondition: function () {
      return this.selectValue != this.nativeValue && this.selectValue != null;
    },

    bodyClass: function () {
      return {
        "drop-up": this.direction,
      };
    },

    bodyStyle: function () {
      return {
        display: this.check ? "block" : "none",
      };
    },

    headerStyle: function () {
      return {
        open: this.check,
        selected: this.selectValue,
      };
    },

    doNotHaveResult: function () {
      return Object.keys(this.searchFilter).length == 0;
    },

    searchFilter() {
      const obj = {};
      const { values } = this;
      for (const el of Object.keys(values)) {
        if (values[el] != null) {
          const currentElement = values[el].toLowerCase();
          const searchInput = this.search.toLowerCase();
          if (currentElement.match(searchInput)) {
            obj[el] = values[el];
          }
        }
      }
      return obj;
    },
  },

  methods: {
    onSelectItem: function (key) {
      const { $store } = this;
      const { commit } = $store;
      this.selectValue = key;

      commit("setSelectPopoverValue", this.selectValue);
    },

    openPopover: function () {
      const { $store, tree, assistant, selectValue } = this;
      const { elementCoordinates, onSelectItem, onChangePopoverIntValue } =
        this;
      const { commit } = $store;
      const { top, left } = elementCoordinates();
      commit("setPopoverData", {
        tree,
        assistant,
        top,
        left,
        selectValue,
        onSelectItem,
        onChangeIntValue: onChangePopoverIntValue,
      });
    },

    toggleDrop: function () {
      const { header, search } = this.$refs;
      const { assistant = {}, column } = this;
      const { completeLink } = column;

      if (
        assistant?.initiator &&
        assistant.initiator.split(".")[1] == completeLink
      )
        return;

      this.check = !this.check;

      const difference =
        document.body.clientHeight - header.getBoundingClientRect().top;

      if (difference < 240) {
        this.direction = true;
      } else {
        this.direction = false;
      }
      setTimeout(() => (this.check ? search.focus() : null), 0);
    },

    value: function () {
      return this.values[this.selectValue];
    },

    clearValue: function () {
      const { $store } = this;
      const { state } = $store;
      const { popoverData } = state;
      const { length } = Object.keys(popoverData);

      if (length) popoverData.selectValue = null;

      this.selectValue = null;

      if (this.changeElements != null) {
        this.changeElements({ Values: [] });
      }
    },

    changeValue: function (idx, rowNumber = 0) {
      const { column } = this;
      const { onChangeIntValue, changeElements, updatePopupField } = this;
      const { completeLink } = column;

      this.selectValue = idx;
      this.check = false;

      if (changeElements) changeElements({ Values: [this.selectValue] });

      if (onChangeIntValue) onChangeIntValue(idx, rowNumber);

      if (updatePopupField) updatePopupField(completeLink, idx);
    },

    onChangePopoverIntValue: function (val, rowNumber) {
      const { $store, assistant } = this;
      const { id, hieararchies } = assistant;
      const { dispatch, commit } = $store;
      const { header: firstHeader } = hieararchies[0];
      const { foreignKeyToPreviousTable: fkToPrev, header: lastHeader } =
        hieararchies[1];
      const { tableName: prevTable } = firstHeader;
      const { tableName: table } = lastHeader;

      const data = {
        data: JSON.stringify({ id, val, prevTable, table, fkToPrev }),
      };

      commit("onChangePopoverIntSelectValue", { val, rowNumber });

      if (!rowNumber) dispatch("assistant", data);
    },

    elementCoordinates: function () {
      const { bottom: top, left } =
        this.$refs["element"].getBoundingClientRect();

      return { top, left };
    },

    onHover: function (idx, bool) {
      this.hover[idx] = bool;
    },
  },
};
</script>
