<template>
  <div class="upsert" v-if="formData.stolbIsTab && formData.tabs.length > 0">
    <NavigationTabs
      v-if="navigationTabs.length > 1"
      :idxMenuTab="idxMenuTab"
      :changedTab="changedTab"
      :navigationTabs="navigationTabs"
    />
    <table v-for="(tab, index) of formData.tabs" :key="index">
      <h3 v-if="tab.idLikeName && formData.isHidden">{{ tab.accordName }}</h3>
      <tbody v-show="tab.accordName == idxMenuTab">
        <FormRow
          v-for="(row, idx) in tab.headers"
          :key="idx"
          :rowData="row"
          :settingsForEditor="settingsForEditor"
          :updatePopupField="updatePopupField"
          :treeViewHelpers="treeViewHelpers"
          :assistants="assistants"
          :ref="'row' + index + idx"
        />
      </tbody>
    </table>

    <File
      v-if="formData.files.files && formData.files.configuration"
      :file="formData.files.files"
      :config="formData.files.configuration"
    />
    <div class="section"></div>
  </div>
  <div class="ups-btn-cnt">
    <input
      class="submit-btn"
      type="button"
      :value="buttonName"
      @click="onSubmitForm"
    />
  </div>
</template>
<script>
import NavigationTabs from "../TabSet/NavigationTabs.vue";
import { navigationTabsData } from "../TabSet/utils";
import FormRow from "./FormRow.vue";
import File from "./FormRowDataType/File.vue";
import { rowsDataToResponse, tablesDataToResponse, timeStamp } from "./utils";
export default {
  props: {
    formData: { type: Object, required: true },
    onSubmitForm: { type: Function, default: null },
    updatePopupField: { type: Function, default: null },
  },

  data() {
    return { popupOpenTime: "", idxMenuTab: "" };
  },
  watch: {},

  created() {
    this.popupOpenTime = timeStamp(Date.now());
  },

  mounted() {
    const { navigationTabs } = this;
    const { length } = navigationTabs;
    const { accordName } = navigationTabs[0];

    this.idxMenuTab = length > 1 ? accordName : "";
  },

  computed: {
    toRequestFields: function () {
      const { formData } = this;
      const { toRequest } = formData;

      return toRequest;
    },

    assistants: function () {
      const { formData } = this;
      const { assistants } = formData;

      return assistants;
    },

    treeViewHelpers: function () {
      const { formData } = this;
      const { treeViewHelpers } = formData;

      return treeViewHelpers;
    },

    navigationTabs: function () {
      const { formData } = this;
      return navigationTabsData(formData);
    },

    settingsForEditor: function () {
      const { formData } = this;
      const { fieldsConfig } = formData;

      return fieldsConfig;
    },

    buttonName: function () {
      const { formData } = this;
      const { isUpdate } = formData;
      return isUpdate ? "Обновить" : "Добавить";
    },
  },

  methods: {
    changedTab: function (v) {
      this.idxMenuTab = v;
    },

    getRow: function (index, idx) {
      return this.$refs["row" + index + idx];
    },

    tablesData: function () {
      const { formData, getRow, navigationTabs } = this;

      return { ...tablesDataToResponse(formData, navigationTabs, getRow) };
    },

    rowsData: function () {
      const { formData, getRow, navigationTabs } = this;

      return rowsDataToResponse(formData, navigationTabs, getRow);
    },
  },

  components: { FormRow, File, NavigationTabs },
};
</script>
