<template>
  <ul class="node" :class="{ last: nodeLast }">
    <li style="display: flex">
      <i class="icon ocl" :class="arrowView" @click="loadChildren"> </i>

      <a
        @click="selectCurrentElement(row)"
        @dblclick="loadChildren"
        :class="clicked"
        :draggable="!row.selfRel"
        @dragstart="dragStart($event, row)"
        @dragend.prevent="dragEnd($event, row)"
        @dragenter.prevent="dragEnter"
        @dragover.prevent="dragOver($event, row)"
        @dragleave.prevent="dragLeave"
        @drop="drop($event, row)"
      >
        <TreeNodeRow
          :row="row"
          :editable="editable"
          :editableRowInfo="editableRowInfo"
          :onEditNode="onEditNode"
          :changeEditableRowInfo="changeEditableRowInfo"
          :addFolder="addFolder"
          :removeFolder="removeFolder"
          :parentID="parentID"
          :pageId="pageId"
          :hovered="hovered"
          :recursionChangeName="recursionChangeName"
        />
      </a>
    </li>
    <!-- <transition name="fade"> -->
    <ul class="group" v-show="open" v-if="rowsNodes && rowsNodes.length">
      <TreeViewNode
        v-for="(row, idx) of rowsNodes"
        :key="idx"
        :row="row"
        :nodeLast="idx + 1 == rowsNodes.length"
        :parentID="parentID"
        :pageId="pageId"
        :selectValue="selectValue"
        :onSelectItem="onSelectItem"
        :onEditNode="onEditNode"
        :changeEditableRowInfo="changeEditableRowInfo"
        :editableRowInfo="editableRowInfo"
        :editable="editable"
        :trimTreeNodes="trimTreeNodes"
        :changeNodePosition="changeNodePosition"
        :updatePageDataAfterFetch="updatePageDataAfterFetch"
        :recursionChangeName="recursionChangeName"
        :changeRowFlags="changeRowFlags"
        :ifThisParent="ifThisParent"
        :dropInChild="dropInChild"
      />
    </ul>
    <!-- </transition> -->
  </ul>
</template>
<script>
import TreeViewNode from "./TreeViewNode";
import TreeNodeRow from "./TreeNodeRow.vue";
import { useStore } from "vuex";
import { computed, onMounted, ref, toRefs, watch } from "vue";
export default {
  props: {
    onSelectItem: { type: Function, default: null },
    onEditNode: { type: Function, default: null },
    changeEditableRowInfo: { type: Function, default: null },
    row: { type: Object, required: true },
    editableRowInfo: { type: Object, default: null },
    parentID: { type: String, default: null },
    pageId: { type: String, default: null },
    selectValue: { type: String, default: null },
    nodeLast: { type: Boolean, default: false },
    editable: { type: String, default: "" },
    trimTreeNodes: { type: Function, default: null },
    changeNodePosition: { type: Function, default: null },
    updatePageDataAfterFetch: { type: Function },
    recursionChangeName: { type: Function },
    changeRowFlags: { type: Function },
    ifThisParent: { type: Function },
    dropInChild: { type: Function },
  },

  setup(props) {
    const store = useStore();
    // data
    let hovered = ref(false);
    let timerId = ref("");
    const open = ref(false);
    const load = ref(false);
    const loaded = ref(false);

    const { parentID: controlId, selectValue, pageId, row } = toRefs(props);
    const { trimTreeNodes, onSelectItem, changeNodePosition } = toRefs(props);
    const { updatePageDataAfterFetch, changeRowFlags } = toRefs(props);
    const { ifThisParent, dropInChild } = toRefs(props);
    const { commit, dispatch, state } = store;

    // mounted
    onMounted(() => {
      const { listItem } = row.value;
      const { tname } = listItem;
      const { loaded: L, open: o } = row.value;

      loaded.value = L ? L : false;
      open.value = o ? o : false;

      if (tname == "File") loaded.value = true;
    });

    // watchers
    watch(row, () => {
      const { loaded: L, open: o } = row.value;

      loaded.value = L ? L : false;
      open.value = o ? o : false;
    });

    watch(open, () => {
      changeRowFlags.value(open.value, row.value.id, "open");
    });

    watch(loaded, () => {
      changeRowFlags.value(loaded.value, row.value.id, "loaded");
    });

    // computed
    const clicked = computed(() => {
      const { id, listItem } = row.value;
      const { rowid } = listItem;
      return id == selectValue.value || rowid == selectValue.value
        ? { clicked: true }
        : { clicked: false };
    });

    const rowsNodes = computed(() =>
      row.value.children.length ? row.value.children : row.value.rows
    );

    const arrowView = computed(() => {
      const { jsData } = row.value;
      const icon = jsData?.icon;

      return {
        load: load.value,
        openAndEmpty:
          (loaded.value && !rowsNodes.value?.length) || (loaded.value && icon),
        open: open.value,
      };
    });

    // functions

    const drop = async (event, item) => {
      // элемент сброшен
      const { treeNode } = state;
      const { listItem } = item;
      const { tname } = listItem;
      const isParent = ifThisParent.value(treeNode.id, item.id);
      const isChild = dropInChild.value(treeNode.id, item.id);

      hovered.value = false;
      if (!loaded.value) await loadChildren();

      const none =
        treeNode.id != item.id || tname == "File" || isParent || isChild;
      if (none) changeNodePosition.value(treeNode, item, controlId.value);

      commit("setTreeNode", {});
    };

    const dragStart = (event, item) => {
      // начало перетаскивания элемента
      commit("setTreeNode", item);
    };

    const dragEnd = async (event, item) => {
      // завершение перетаскивания элемента
      // if (rowid != parentid) dispatch("dragAndDrop", data);
      //условие куда можно перемещать папку

      item;
    };

    const dragOver = (event, item) => {
      // элемент над допустимой зоной сброса

      const { treeNode } = state;
      const { id: parId } = treeNode;

      const { useSelfRelation, listItem: childListItem, id: childId } = item;
      const { selfRel, tname } = childListItem;

      const isParent = ifThisParent.value(treeNode.id, item.id);
      const isChild = dropInChild.value(treeNode.id, item.id);

      const none = parId == childId || tname == "File" || isParent || isChild;

      if (none) {
        event.dataTransfer.dropEffect = "none";
      } else if (useSelfRelation || selfRel) {
        hovered.value = true;
      }
    };

    const dragLeave = function () {
      // элемент покинул допустимую зону сброса

      hovered.value = false;
      clearTimeout(timerId);
    };

    const dragEnter = () => {
      // перетаскиваемый элемент попадает в область перетаскивания

      if (!open.value && !timerId.value) {
        timerId = setTimeout(loadChildren, 500);
      }
    };

    const loadChildren = async () => {
      const { listItem } = row.value;
      const { tname, rowid } = listItem;
      const obj = {
        tname,
        rowid,
        name: "node_open",
        controlId: controlId.value,
        pageId: pageId.value,
      };

      if (!loaded.value) {
        load.value = true;
        open.value = true;

        const { id } = row.value;

        if (!rowsNodes.value?.length) {
          await updatePageDataAfterFetch.value(id, obj);
        }

        loaded.value = true;
        load.value = false;
      } else {
        open.value = !open.value;
      }
    };

    const removeFolder = async (action) => {
      const { id: qaid, quickActionType } = action;
      const { listItem } = row.value;
      const { rowid } = listItem;

      const del = {
        qaid,
        rowid,
        controlId: controlId.value,
        pageId: pageId.value,
        quickActionType,
      };

      const { id } = row.value;

      trimTreeNodes.value(id);
      await dispatch("getSubTree", del);
    };

    const addFolder = async (action) => {
      const { id: qaid, quickActionType: q } = action;
      const { rowid, partname: parenttname } = row.value.listItem;
      const text = "New node";

      const add = {
        qaid,
        text,
        parentid: rowid,
        parenttname,
        controlId: controlId.value,
        pageId: pageId.value,
        quickActionType: q,
      };

      if (rowsNodes.value) {
        open.value = true;
      } else {
        load.value = true;
        await loadChildren();

        open.value = true;
        load.value = false;
      }

      updatePageDataAfterFetch.value(row.value.id, add, true);
    };

    const selectCurrentElement = (row) => {
      const { popoverData } = state;
      const { length } = Object.keys(popoverData);
      const { listItem, id } = row;
      const { isSelectable, rowid } = listItem;

      if (onSelectItem && isSelectable) onSelectItem.value(length ? rowid : id);
    };

    return {
      //functions
      drop,
      dragStart,
      dragEnd,
      dragOver,
      dragLeave,
      dragEnter,
      loadChildren,
      removeFolder,
      addFolder,
      selectCurrentElement,
      //data
      hovered,
      timerId,
      open,
      load,
      rowsNodes,
      //computed
      clicked,
      arrowView,
    };
  },

  components: {
    TreeNodeRow,
    TreeViewNode,
  },
};
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s linear;
  animation-delay: 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
