<template>
  <ul class="popover-actions">
    <li
      v-if="groupingActions[1][0]"
      ref="element"
      @click.stop="openPopoverWindow([...groupingActions[1]])"
    >
      <span style="order: 2">
        <span class="caret"></span>
      </span>
      <i :class="groupIcon" style="order: 1"></i>
    </li>
    <li v-for="(action, index) in groupingActions[0]" :key="index">
      <a
        @click="startOpenPopup(action)"
        :alt="action.text"
        :title="action.text"
      >
        <i :class="action.icon"></i>
        <span class="text" v-if="!action.isAlt">{{ action.text }}</span>
      </a>
    </li>
  </ul>
</template>
<script>
import { groupedActions } from "./utils";
export default {
  props: {
    actions: { type: Object, required: true },
    openPopUp: { type: Function, default: null },
    openedPopOver: { type: Function, default: null },
    value: { type: String, default: null },
    fileName: { type: String, default: null },
  },

  data() {
    return { top: 0, left: 0 };
  },

  computed: {
    groupingActions: function () {
      const { actions } = this;
      return groupedActions(actions);
    },

    groupIcon: function () {
      const { groupingActions } = this;
      const el = groupingActions[1];
      let groupIcon;

      if (el[0]) groupIcon = el[0].groupIcon;

      return groupIcon || "fas fa-bars";
    },
  },

  methods: {
    openPopoverWindow: function (actions) {
      const { elementCoordinates, openedPopOver } = this;
      const { $store, value, fileName } = this;
      const { commit, state } = $store;
      const { length } = Object.keys(state.popoverData);

      if (length) {
        commit("setPopoverData", {});
        commit("dataToFetchGridUpdate", {});
      } else {
        const { top, left } = elementCoordinates();

        const obj = { actions, top, left };

        if (fileName) obj.fileName = fileName;
        if (value) obj.value = value;

        openedPopOver(obj);
      }
    },

    startOpenPopup: function (action) {
      const { openPopUp, value, fileName } = this;
      const { id, serverSide, multiRow, filePreview, fileDownload, slider } =
        action;

      if (openPopUp) {
        openPopUp({
          actionId: id,
          serverSide,
          multiRow,
          filePreview,
          fileDownload,
          value,
          fileName,
          slider,
        });
      }
    },

    elementCoordinates: function () {
      const { $store, $refs } = this;
      const { bottom, left } = $refs["element"].getBoundingClientRect();
      const { popupData } = $store.state;
      const { length } = Object.keys(popupData);

      const scroll = window.pageYOffset;
      const top = length ? bottom - 20 : bottom + scroll;

      return { top, left };
    },
  },
};
</script>
