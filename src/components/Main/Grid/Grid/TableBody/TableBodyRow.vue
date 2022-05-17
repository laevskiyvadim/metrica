<template>
  <tr class="t-body-row">
    <td v-if="addCheckbox">
      <input
        type="checkbox"
        @click.stop="onSelectRow(valueChecked)"
        :disabled="gridRow.isCheckboxDisabled ?? false"
        :checked="isCheckboxSelected"
      />
    </td>
    <td v-if="actions[0]">
      <ActionsActions
        v-if="addActions"
        :actions="actions"
        :value="primaryKeyValue"
        :fileName="gridRow.cells[1].value"
        :openedPopOver="openedPopOver"
        :openPopUp="openPopUp"
      />
    </td>
    <td
      v-for="(
        { value, iconValue, badgeValue, navigateUrl }, idx
      ) in gridRow.cells"
      :key="idx"
      :hidden="isHidden(value, idx)"
    >
      <div v-if="isEditable(idx)">
        <EditableInput
          :defaultValue="value"
          :primaryKeyValue="primaryKeyValue"
          :onEditRow="onEditRow"
        />
      </div>
      <div
        class="grid-field"
        v-else-if="value || navigateUrl"
        :style="{ backgroundColor: badgeValue }"
      >
        <i v-if="iconValue" :class="iconValue"></i>
        <input
          type="checkbox"
          v-if="isCheckbox(value)"
          :checked="checked(value)"
        />

        <a
          @click.prevent="$router.push(navigateUrl)"
          :href="navigateUrl"
          v-else-if="navigateUrl"
          >{{ value }}</a
        >
        <span v-else v-html="value" @click.prevent ref="link"></span>
      </div>
    </td>
  </tr>
</template>
<script>
import { hiddenIfThisIsId, isDate } from "../../../../methods/createFormData";
import ActionsActions from "../../../Actions/ActionsActions.vue";
import EditableInput from "../../../shared/EditableInput.vue";
export default {
  props: {
    gridRow: { type: Object, required: true },
    addCheckbox: { type: Boolean, default: false },
    addActions: { type: Boolean, default: false },
    openPopUp: { type: Function, default: null },
    actions: { type: Object },
    headers: { type: Object, required: true },
    openedPopOver: { type: Function, default: null },
    onSelectRow: { type: Function, default: null },
    onEditRow: { type: Function, default: null },
  },

  data() {
    return { isCheckboxSelected: false };
  },
  computed: {
    valueChecked: function () {
      const { gridRow } = this;
      return gridRow?.cells[0]?.value;
    },
    primaryKeyValue: function () {
      const { gridRow } = this;
      return gridRow?.primaryKeyValue;
    },
  },

  mounted() {
    const { $refs, $router } = this;
    const elements = $refs["link"];
    for (let elem of elements) {
      const urls = elem.querySelectorAll("a");
      for (let url of urls)
        url.addEventListener("click", () => {
          const href = url.attributes["href"].nodeValue;
          $router.push(href);
        });
    }
  },

  created() {
    this.isDate = isDate;
    this.hiddenIfThisIsId = hiddenIfThisIsId;
  },

  methods: {
    isHidden: function (value, idx) {
      const { headerIsNull } = this;
      return hiddenIfThisIsId(value) || headerIsNull(idx);
    },
    isEditable: function (idx) {
      const { headers } = this;
      return headers[idx].isEditable;
    },

    headerIsNull: function (idx) {
      const { headers } = this;
      return headers[idx].isHidden;
    },
    isCheckbox: function (val) {
      return val == "True" || val == "False";
    },
    checked: function (val) {
      return val == "True";
    },
  },
  components: { ActionsActions, EditableInput },
};
</script>
