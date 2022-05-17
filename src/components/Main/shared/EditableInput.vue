<template>
  <input
    class="editable"
    type="text"
    v-model="input"
    @change="updateRow(e)"
    @keyup.enter="updateRow(e)"
    @focusout="updateRow(e)"
    v-show="editable"
    :size="input.length + 5 || 10"
    ref="input"
  />
  <div v-show="!editable">{{ defaultValue }}</div>
</template>
<script>
export default {
  props: {
    defaultValue: { type: String, default: null },
    onEditRow: { type: Function, default: null },
    editable: { type: Boolean, default: true },
    isDefault: { type: Boolean, default: true },
    primaryKeyValue: { type: String, default: "" },
    editableRowInfo: { type: Object, default: new Object() },
  },

  data() {
    return { input: "" };
  },

  beforeMount() {
    this.input = this.defaultValue;
  },

  mounted() {
    const { $refs } = this;
    const { input } = $refs;
    this.editable == true ? setTimeout(() => input.focus(), 0) : null;
  },

  watch: {
    defaultValue() {
      this.input = this.defaultValue;
    },

    editable() {
      const { $refs } = this;
      const { input } = $refs;
      this.editable == true ? setTimeout(() => input.focus(), 0) : null;
    },
  },

  methods: {
    updateRow(e) {
      const { primaryKeyValue, isDefault, input, defaultValue } = this;
      const { onEditRow, editableRowInfo } = this;
      const { id = null, quickActionType = null } = editableRowInfo;
      const { isInteger } = Number;

      const defVal = {
        ids: { Id_PK: primaryKeyValue },
        fields: { Duration: input },
      };
      if (isDefault) {
        if (input != defaultValue) {
          if (isInteger(Number(input))) {
            if (e?.target) e.target.blur();

            onEditRow(defVal);
          } else alert("Input string was not in a correct format.");
        }
      } else {
        onEditRow({ text: input, id, quickActionType });
      }
    },
  },
};
</script>
