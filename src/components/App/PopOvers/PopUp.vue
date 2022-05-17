<template>
  <div class="popup" @click="closePopover">
    <div class="wrap">
      <div v-if="hasThePrevWindow" class="left" @click.stop="prevPage">
        <img src="/Image/ArrowPage.png" />
      </div>

      <div class="body" :style="bodyStyle">
        <div class="red colour"></div>
        <div class="orange colour"></div>
        <div class="yellow colour"></div>

        <div class="close" @click="closePopup">
          <i class="icon-remove-sign"></i>
        </div>
        <div class="upsert" v-if="haveBody">
          <h3>
            {{ title }}
          </h3>
          <div class="section"></div>
          <Main :page="popupData" :title="popupData?.compiledLineFormats" />
        </div>
        <div class="upsert" v-else-if="!haveBody && !files.type">
          <div class="block">
            <div style="margin-bottom: 40px">
              <i class="far fa-question-circle"></i>
            </div>
            <div>
              <span>{{ popupData.text }}</span>
            </div>
          </div>
          <div class="buttons">
            <button class="ok" value="Подтверждаю" @click="confirmation(true)">
              Подтверждаю
            </button>
            <button class="cancel" value="Отмена" @click="confirmation(false)">
              Отмена
            </button>
          </div>
        </div>
        <ActionsPopOver v-if="hasActions" :pageId="popupData.parentID" />
        <img v-if="files.type" :src="files.file" class="img" />
      </div>

      <div v-if="hasTheNextWindow" class="right sl" @click.stop="nextPage">
        <img src="/Image/ArrowPage.png" />
      </div>
    </div>
  </div>
</template>
<script>
import ActionsPopOver from "../PopOvers/ActionsPopOver.vue";
import Main from "../../Main/Main.vue";
import { getElementOfType } from "../../methods/createFormData";
export default {
  props: {
    popupData: { type: Object, default: null },
    files: { type: Object, default: null },
  },

  data() {
    return {
      currentPage: 0,
      pages: [],
      gridId: "",
    };
  },

  created() {
    const { popupData } = this;
    const { actionsUsedInCompilation, pages, currentPage, gridId } = popupData;

    if (typeof actionsUsedInCompilation == "boolean") {
      this.currentPage = currentPage;
      this.pages = pages;
      this.gridId = gridId;
    }
  },

  computed: {
    title: function () {
      const { popupData } = this;
      const { actionsUsedInCompilation, title } = popupData;

      return typeof actionsUsedInCompilation == "boolean" ? "" : title;
    },

    haveBody: function () {
      const { hasBody } = this;

      if (hasBody()) return true;
      else return null;
    },

    popoverData: function () {
      const { $store } = this;
      return $store.state.popoverData;
    },

    hasThePrevWindow: function () {
      const { pages, currentPage } = this;

      return pages.indexOf(currentPage) > 0;
    },

    hasTheNextWindow: function () {
      const { pages, currentPage } = this;

      return (
        pages.indexOf(currentPage) >= 0 &&
        pages.indexOf(currentPage) < pages.length - 1
      );
    },

    hasActions: function () {
      const { popoverData, popupData, files } = this;
      const { type } = files;
      const { keys } = Object;

      return (
        keys(popoverData).length &&
        (keys(popupData).length || (type && type != "pdf"))
      );
    },

    bodyStyle: function () {
      const { popupData } = this;
      const { width } = popupData;

      return { "min-width": width ? width : "" };
    },
  },

  methods: {
    closePopover: function () {
      this.$store.commit("setPopoverData", {});
    },

    confirmation: function (val) {
      const { closePopup, popupData, $store } = this;
      const { obj, fetchGridUpdate } = popupData;

      if (val) {
        $store.dispatch("serverSideAction", obj);
        fetchGridUpdate();
      }

      closePopup();
    },

    closePopup: function () {
      const { $store } = this;
      const { commit, state } = $store;
      const { subPopupData } = state;
      const { length: hasSubPopup } = Object.keys(subPopupData);

      hasSubPopup
        ? commit("setSubPopupData", {})
        : (commit("setPopupData", {}),
          commit("dataToFetchGridUpdate", {}),
          commit("setRowsIds", []),
          commit("setFiles", []));
    },

    prevPage: async function () {
      const { currentPage, pages, $store, popupData, gridId } = this;
      const { dispatch } = $store;
      const { parentID } = popupData;
      const idx = pages.indexOf(currentPage);

      const data = {
        pageId: parentID,
        value: pages[idx - 1],
        actionId: gridId + "_a_4", //todo
        gridId,
        controlId: gridId,
      };

      if (idx > 0) {
        await dispatch("setPopupData", { data, pages, value: pages[idx - 1] });

        this.currentPage = pages[idx - 1];
      }
    },

    nextPage: async function () {
      const { pages, currentPage, $store, popupData, gridId } = this;
      const { dispatch } = $store;
      const { parentID } = popupData;
      const idx = pages.indexOf(currentPage);
      const { length } = pages;

      const data = {
        pageId: parentID,
        value: pages[idx + 1],
        actionId: gridId + "_a_4", //todo
        gridId,
        controlId: gridId,
      };

      if (length && idx < length) {
        await dispatch("setPopupData", { data, pages, value: pages[idx + 1] });
        this.currentPage = pages[idx + 1];
      }
    },

    hasBody: function () {
      const { popupData } = this;
      const { actionsUsedInCompilation } = popupData;

      let modalWindow;
      typeof actionsUsedInCompilation == "boolean"
        ? (modalWindow = getElementOfType(popupData)[0])
        : (modalWindow = popupData);

      return ["Tabset", "Form", "Grid", "Tab", "Page", "Treeview"].includes(
        modalWindow.type
      );
    },
  },
  components: {
    ActionsPopOver,
    Main,
  },
};
</script>
