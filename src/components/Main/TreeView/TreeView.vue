<template>
  <div class="tree">
    <div>
      <div class="right"></div>
      <ul class="children" v-if="rows && rows.length">
        <TreeViewNode
          v-for="(row, idx) in rows"
          :key="idx"
          :row="row"
          :nodeLast="idx + 1 == rows.length"
          :parentID="treeViewData.id"
          :pageId="parentId"
          :onSelectItem="onSelectItem || actionSelectValue"
          :selectValue="selectValue || selected"
          :editable="editable"
          :onEditNode="onEditNode"
          :editableRowInfo="editableRowInfo"
          :changeEditableRowInfo="changeEditableRowInfo"
          :trimTreeNodes="deleteNode"
          :changeNodePosition="changeNodePosition"
          :updatePageDataAfterFetch="updatePageDataAfterFetch"
          :recursionChangeName="onChangedName"
          :changeRowFlags="changeRowFlags"
          :ifThisParent="ifThisParent"
          :dropInChild="dropInChild"
        />
      </ul>
    </div>
  </div>
</template>
<script>
import { fieldToStandard } from "../../../store/utils";
import TreeViewNode from "./TreeViewNode";
import {
  recursionTreeAddNodes,
  recursionDeleteNode,
  recursionAddNode,
  recursionChangeName,
  recursionThisIsParent,
  installedFlagsToRow,
  recursionThisIsChild,
} from "./utils";

export default {
  props: {
    treeViewData: { type: Object, required: true },
    onSelectItem: { type: Function, default: null },
    selectValue: { type: String, default: null },
    parentId: { type: String, default: null },
  },

  data() {
    return {
      selected: "",
      hovered: "",
      editable: "",
      editableRowInfo: {},
      pageData: {},
    };
  },

  created() {
    this.pageData = this.treeViewData;
  },

  computed: {
    rows: function () {
      return this.pageData.rows;
    },
  },

  methods: {
    actionSelectValue: function (v) {
      this.selected = v;
    },

    onEditNode: function (v) {
      this.editable = v;
    },

    changeEditableRowInfo: function (v) {
      this.editableRowInfo = v;
    },

    onChangedName: function (text, parent) {
      recursionChangeName(this.pageData.rows, text, parent);
    },

    changeHovered: function () {
      //param-pam-pam
    },

    changeRowFlags: function changeRowFlags(status, rowId, flag = "") {
      const { pageData } = this;
      installedFlagsToRow(pageData, rowId, status, flag);
    },

    updatePageDataAfterFetch: async function (parentId, obj, added = false) {
      const { pageData, $store, onEditNode, addNode, changeEditableRowInfo } =
        this;
      const el = await $store.dispatch("getSubTree", obj);

      if (added) {
        const {
          Actions: actions,
          Children: children,
          FileId: fileId,
          HasItems: hasItems,
          Id: id,
          ListItem: listItem,
          Navigation: navigation,
          UseDeferredLoadingForChildren: useDeferredLoadingForChildren,
          UseSelfRelation: useSelfRelation,
        } = el;

        const text = "New node";

        const objToAdd = {
          actions: actions.map((el) => fieldToStandard(el)),
          children,
          fileId,
          hasItems,
          id,
          listItem,
          navigation,
          text,
          useDeferredLoadingForChildren,
          useSelfRelation,
        };
        const { quickActionType, id: s } = objToAdd.actions[0];
        changeEditableRowInfo({ quickActionType, id: s });

        onEditNode(objToAdd.id);
        addNode(objToAdd, parentId, added);
      } else {
        recursionTreeAddNodes(pageData.rows, el, parentId);
      }
    },

    changeNodePosition: async function (current, parent, controlId) {
      const { deleteNode, addNode, $store, parentId: pageId } = this;
      deleteNode(current.id);
      addNode(current, parent.id);

      const { listItem } = current;
      const { tname, rowid } = listItem;
      const { rowid: parentid } = parent.listItem;
      const name = "move_node";

      const obj = {
        tname,
        rowid,
        parentid,
        name,
        controlId,
        pageId,
        quickActionType: "Delete",
      };
      await $store.dispatch("getSubTree", obj);
    },

    ifThisParent: function (currentId, dropZoneId) {
      const { pageData } = this;
      let canDrop = true;

      canDrop = recursionThisIsParent(pageData, currentId, dropZoneId);

      return canDrop;
    },

    dropInChild: function (currentId, dropZoneId) {
      const { pageData } = this;
      let canDrop = true;

      canDrop = recursionThisIsChild(pageData, currentId, dropZoneId);

      return canDrop;
    },

    addNode: function (current, parentId, last) {
      recursionAddNode(this.pageData, current, parentId, last);
    },

    deleteNode: function (id) {
      recursionDeleteNode(this.pageData, id);
    },
  },

  components: { TreeViewNode },
};
</script>
