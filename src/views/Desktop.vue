<template>
  <div id="form" v-if="page && isDynamic" @click.prevent="closePopover">
    <TheHeader :min="min" @toggleSize="toggleSize" />

    <template v-for="element in pageElements" :key="element.type">
      <TheNav
        :navigationMenuData="element"
        :size="min"
        v-if="element.type == 'Menus'"
      />
      <div
        class="content"
        v-if="element.type != 'Menus'"
        :class="{ max: min }"
        :style="{
          paddingRight: Object.keys(popupData).length ? '36px' : '18px',
        }"
      >
        <Main :page="element" :title="page.compiledLineFormats" />
      </div>
    </template>
    <Pdf v-if="files.type == 'pdf'" :files="files" :closePdf="closePopup" />
    <PopUp v-if="hasPopup" :popupData="popupData" :files="files" />
    <PopUp v-if="hasSubPopup" :popupData="subPopupData" :files="{}" />

    <ActionsPopOver v-if="hasActions" :pageId="page.id" />
  </div>

  <Login v-if="!isDynamic" />
</template>
<script>
import Login from "./Login.vue";
import TheHeader from "../components/App/TheHeader/TheHeader.vue";
import TheNav from "../components/App/TheNav/TheNav.vue";
import Main from "../components/Main/Main.vue";
import { getElementOfType } from "../components/methods/createFormData";
import PopUp from "../components/App/PopOvers/PopUp.vue";
import ActionsPopOver from "../components/App/PopOvers/ActionsPopOver.vue";
import Pdf from "../components/App/Pdf.vue";
// import { getCookie } from "./utils";
export default {
  data() {
    return {
      login: false,
      min: false,
      minFlag: false,
      mobileType: false,
    };
  },

  watch: {
    popupData() {
      const { popupData } = this;
      const { length } = Object.keys(popupData);

      const bodyOverflow = document.querySelector("#app").style;
      if (length) {
        bodyOverflow.overflow = "hidden";
      } else {
        bodyOverflow.overflow = "auto";
      }
    },

    async $route() {
      const { $store, isDynamic } = this;
      const { dispatch, commit } = $store;

      if (isDynamic) await dispatch("getPage", location.pathname);
      commit("setPopupData", {});
    },
  },

  computed: {
    files: function () {
      const { $store } = this;
      return $store.state.files;
    },

    isDynamic: function () {
      const { $store } = this;
      return $store.state.currentPage.isDynamic;
    },

    popupData: function () {
      const { $store } = this;
      const { state } = $store;
      const { popupData } = state;

      return popupData;
    },

    subPopupData: function () {
      const { $store } = this;
      const { state } = $store;
      const { subPopupData } = state;

      return subPopupData;
    },

    popoverData: function () {
      const { $store } = this;
      return $store.state.popoverData;
    },

    page: function () {
      const { $store } = this;
      return $store.state.currentPage?.page;
    },

    pageElements: function () {
      const { page } = this;
      return getElementOfType(page, "Page");
    },

    hasActions: function () {
      const { popoverData, popupData, files } = this;
      const { type } = files;
      const { keys } = Object;

      return (
        keys(popoverData).length &&
        !(keys(popupData).length || (type && type != "pdf"))
      );
    },

    hasPopup: function () {
      const { popupData, files } = this;
      const { type } = files;

      return Object.keys(popupData).length || (type && type != "pdf");
    },

    hasSubPopup: function () {
      const { subPopupData } = this;
      return Object.keys(subPopupData).length;
    },
  },

  methods: {
    closePopover: function () {
      const { commit, state } = this.$store;
      const popoverData = state.popoverData;
      const { length } = Object.keys(popoverData);

      if (length) commit("dataToFetchGridUpdate", {});
      commit("setPopoverData", {});
    },

    closePopup: function () {
      const { $store } = this;
      const { commit } = $store;

      commit("setPopupData", {});
      commit("dataToFetchGridUpdate", {});
      commit("setFiles", {});
    },

    toggleSize: function () {
      if (window.innerWidth > 1169) {
        this.min = !this.min;
        this.minFlag = this.min;
      }
    },

    updateWidth: function () {
      const { $store, minFlag } = this;
      const { commit } = $store;

      commit("setPopoverData", {});
      commit("dataToFetchGridUpdate", {});

      if (window.innerWidth > 768 && window.innerWidth < 1170) {
        this.min = true;
      }
      if (window.innerWidth > 1169) {
        this.min = minFlag;
      }
      if (window.innerWidth < 769) {
        this.min = false;
      }
    },
  },

  created() {
    //todo костыль
    // const { $store } = this;
    // const { dispatch } = $store;
    // const haveCookie = getCookie("Metrica.Auth");
    // haveCookie ? commit("setDynamic", true) : commit("setDynamic", true);
    // haveCookie
    //   ? null
    //   : location.pathname == "/iaa/sign-in.aspx"
    //   ? null
    //   : (location.pathname = "/iaa/sign-in.aspx");
    // haveCookie
    //   ? null
    //   : dispatch("getLoginPage", "/iaa/sign-in.aspx?isApi=true");
    // dispatch("getPage", location.pathname);

    location.pathname == "/" ? (location.pathname = "/iaa") : null;
  },

  mounted() {
    const { updateWidth } = this;
    window.addEventListener("resize", updateWidth);

    if (window.innerWidth > 768 && window.innerWidth < 1170) {
      this.min = true;
    }
  },

  unmounted() {
    const { updateWidth } = this;
    window.removeEventListener("resize", updateWidth);
  },

  components: {
    TheHeader,
    TheNav,
    Main,
    PopUp,
    ActionsPopOver,
    Pdf,
    Login,
  },
};
</script>
