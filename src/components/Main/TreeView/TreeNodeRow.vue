<template>
  <i :class="icon" class="i"> </i>
  <i class="fas fa-arrow-circle-down" v-if="row.fileId" @click="downloadFile">
  </i>
  <span v-if="row.actions[0]" v-show="editable != row.id">
    <ActionsActions :actions="row.actions" :openedPopOver="openedPopOver" />
  </span>
  <span @focusout="closeEditable($event)" ref="span">
    <EditableInput
      :defaultValue="row.text"
      :editable="editable == row.id"
      :onEditRow="editFolder"
      :editableRowInfo="editableRowInfo"
      :isDefault="false"
    />
  </span>
</template>
<script>
import ActionsActions from "../Actions/ActionsActions.vue";
import EditableInput from "../shared/EditableInput.vue";
export default {
  props: {
    row: { type: Object, default: null },
    editableRowInfo: { type: Object, default: null },
    editable: { type: String, default: "" },
    onEditNode: { type: Function },
    changeEditableRowInfo: { type: Function, default: null },
    addFolder: { type: Function },
    removeFolder: { type: Function },
    parentID: { type: String, default: null },
    pageId: { type: String, default: null },
    hovered: { type: Boolean, default: false },
    recursionChangeName: { type: Function },
  },

  computed: {
    icon: function () {
      const { row } = this;
      const { jsData } = row;
      const icon = jsData?.icon;

      return [{ "icon theme": !icon, hovered: this.hovered }, icon];
    },
  },

  methods: {
    closeEditable: function ($event) {
      const { $refs, onEditNode } = this;
      const { span } = $refs;
      const { target, relatedTarget } = $event;

      if (
        !span.contains(target) ||
        !relatedTarget ||
        !span.contains(relatedTarget)
      ) {
        onEditNode("");
      }
    },

    openedPopOver: function (val) {
      const { $store, treeAction } = this;

      $store.commit("setPopoverData", { ...val, treeAction });
    },

    treeAction: function (action) {
      const {
        addFolder,
        onStartEdit,
        removeFolder,
        changeEditableRowInfo,
        openEditPopup,
      } = this;

      const { id, quickActionType, text } = action;

      switch (quickActionType) {
        case "Add":
          addFolder({ quickActionType, id, text });
          break;
        case "Edit":
          changeEditableRowInfo({ quickActionType, id });
          onStartEdit();
          break;
        case "Delete":
          removeFolder({ quickActionType, id, text });
          break;
        default:
          openEditPopup({ id });
      }
    },

    onStartEdit: function () {
      const { editable, onEditNode, row } = this;

      editable ? onEditNode("") : onEditNode(row.id);
    },

    editFolder: async function (action) {
      const { row, parentID: controlId, pageId, $store, editable } = this;
      const { onEditNode, changeEditableRowInfo, recursionChangeName } = this;
      const { dispatch } = $store;
      const { text, id: qaid, quickActionType } = action;
      const { listItem, id } = row;
      const { rowid } = listItem;

      editable ? (onEditNode(""), changeEditableRowInfo({})) : onEditNode(id);

      const edit = { qaid, text, rowid, controlId, pageId, quickActionType };

      if (row.text != text) {
        recursionChangeName(text, row.id);
        await dispatch("getSubTree", edit);
      }
    },

    openEditPopup: function ({ id: actionId }) {
      const { parentID: controlId, pageId, row, $store } = this;
      const { listItem } = row;
      const { rowid: value, tname } = listItem;

      const data = { actionId, controlId, pageId, value, tname };

      $store.dispatch("setPopupData", data);
    },

    downloadFile: function () {
      const { row, $store } = this;
      const { text: fileName, fileId: fid } = row;
      const data = { fileDownload: true, fileName, fid };

      $store.dispatch("fetchFile", data);
    },
  },
  components: { ActionsActions, EditableInput },
};
</script>
<style scoped>
.i {
  position: relative;
}
.hovered::after {
  content: "";
  position: absolute;
  height: 12px;
  width: 14px;
  background: url(/assets/32px.png) -73px -73px;
  left: -4px;
  top: 5px;
}
</style>
