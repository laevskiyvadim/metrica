<template>
  <div @click.stop ref="popover" class="popover" :style="popoverStyle">
    <div class="arrow" :style="arrowStyle"></div>
    <div class="int">
      <div v-for="({ header }, idx) of assistant?.hieararchies" :key="idx">
        <RowTypes
          :relatedHeader="header"
          :relatedValues="
            idx == 0
              ? assistant?.firstHierarchyRelated
              : assistant?.lastHierarchyRelated
          "
          :column="{ completeLink: header.columnFullName }"
          :canClearValue="header.isNull"
          :onChangeIntValue="(val) => popoverData.onChangeIntValue(val, idx)"
          :values="{
            nativeValue: assistant?.values ? assistant.values[idx] : '',
          }"
        />
      </div>
      <button
        class="assistant-btn"
        v-if="assistant?.hieararchies"
        @click="setActiveAccount"
      >
        Выбрать
      </button>

      <ul>
        <TreeView
          v-if="popoverData?.tree?.id"
          :treeViewData="popoverData?.tree"
          :selectValue="popoverData.selectValue"
          :onSelectItem="popoverData.onSelectItem"
          :parentId="pageId"
        />
        <li
          v-for="({ icon, text, toExcel }, id) in popoverData.actions"
          :key="id"
        >
          <a @click="actionInPopover(popoverData.actions[id])">
            <i :class="toExcel ? 'fas icon-table' : 'fa ' + icon"> </i>
            <span>{{ toExcel ? "EXCEL" : text }}</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import TreeView from "../../Main/TreeView/TreeView.vue";
import RowTypes from "../../Main/shared/RowTypes.vue";
import { ref, toRefs } from "@vue/reactivity";
import { computed, onMounted } from "@vue/runtime-core";
import { useStore } from "vuex";
export default {
  props: { pageId: { type: String, required: true } },

  setup(props) {
    const store = useStore();
    const pos = ref("");
    const popover = ref("");
    const popoverData = computed(() => store.state.popoverData);
    const popupData = computed(() => store.state.popupData);
    const assistant = computed(() => popoverData.assistant);
    const popoverStyle = computed(() => {
      const { left, right } = positionLeft();

      return {
        top: popoverData.value.top + "px",
        left: right ? "" : left + "px",
        right: right + "px",
        display: "block",
        width: assistant.value ? "360px" : "",
        padding: assistant.value ? "10px" : "",
      };
    });
    const arrowStyle = computed(() => {
      return { left: positionLeft().arrow + "%" };
    });

    onMounted(() => {
      pos.value = popover.value.getBoundingClientRect().width;
      // todo mutation computed property ata-ta-ta
      if (assistant && !assistant.values) assistant.values = [];
    });

    const { pageId: generalPageId } = toRefs(props);
    const { commit, dispatch } = store;

    //methods
    const setActiveAccount = () => {
      commit("updatePopupFieldFromPopover"), commit("setPopoverData", {});
    };

    const actionInPopover = (action) => {
      const { id, serverSide, gridId, controlId, confirm } = action;
      const { rowPKValue, pageId: actionPageId } = action;
      const { fileDownload, filePreview, toExcel } = action;
      const { value, table, fetchGridUpdate, tableName, treeAction, fileName } =
        popoverData.value;

      const { length } = Object.keys(popupData.value);

      commit("setPopoverData", {});

      if (toExcel) {
        fetchGridUpdate(null, null, {}, toExcel);
        return;
      }

      if (treeAction) {
        treeAction(action);
        return;
      }

      if (!serverSide) {
        if (fileDownload || filePreview) {
          const file = { fid: rowPKValue, fileDownload, filePreview, fileName };

          dispatch("fetchFile", file);
          return;
        }

        const obj = {
          actionId: id,
          gridId,
          controlId,
          pageId: actionPageId || generalPageId.value,
        };

        if (value) obj.value = value;

        length
          ? dispatch("setSubPopupData", obj)
          : dispatch("setPopupData", obj);
        return;
      }

      if (serverSide) {
        const obj = { action: id, pageId: generalPageId.value, gridID: gridId };

        if (table) obj.table = table;
        if (tableName && !table) obj.table = tableName;
        if (rowPKValue) obj.row = rowPKValue;

        if (confirm) {
          const { text } = confirm;
          commit("setConfirmationData", { text, obj, fetchGridUpdate });
          return;
        }

        dispatch("serverSideAction", obj);
        if (fetchGridUpdate) fetchGridUpdate();
      }
    };

    const positionLeft = () => {
      const { actions = [[]], left } = popoverData.value;
      const { actionType } = actions[0];
      const { length } = Object.keys(popupData.value);

      let K = 2.5;
      let arrow = 0;
      let right;
      const actionsLeft = ["GridActionRow", "TreeViewActionRow"];
      const actionsRight = ["GridZoneAction"];

      if (actionsLeft.includes(actionType)) {
        arrow = 25;
        let z = length ? null : left - (pos.value / 10) * K + 10;

        return { left: z, right, arrow };
      }

      if (actionsRight.includes(actionType)) {
        (K = 8.5), (arrow = 85);
        let z = length ? null : left - (pos.value / 10) * K + 10;
        right = length ? (pos.value / 10) * 7 : null;

        return { left: z, right, arrow };
      }

      if (!actionType) {
        (arrow = 86), (right = 1);
        return { left: left - (pos.value / 10) * K + 10, right, arrow };
      }
    };

    return {
      popoverData,
      assistant,
      popoverStyle,
      arrowStyle,
      popover,
      //func
      setActiveAccount,
      actionInPopover,
    };
  },

  components: { TreeView, RowTypes },
};
</script>
