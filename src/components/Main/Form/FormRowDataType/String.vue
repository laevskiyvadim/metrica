<template>
  <input
    class="string"
    v-if="maxLength"
    type="text"
    @keyup.enter="onEdited"
    @blur="onEdited"
    v-model="value"
    :maxlength="maxLength"
    :disabled="disabled"
  />

  <input
    v-else-if="!maxLength && settingsForEditor"
    ref="editor"
    v-model="value"
    type="text"
  />

  <textarea
    class="string"
    v-else-if="!maxLength"
    rows="10"
    v-model="value"
    @keyup.enter="onEdited"
    @blur="onEdited"
    :disabled="disabled"
  ></textarea>
</template>
<script>
import { convertHTMLDocumentToString, onloadCKEditor } from "./utils";
export default {
  props: {
    maxLength: { type: Number, required: false },
    nativeValue: { type: String, default: null },
    column: { type: Object, default: null },
    changeElements: { type: Function, default: null },
    disabled: { type: Boolean, default: false },
    settingsForEditor: { type: Object, default: null },
  },

  data() {
    return {
      value: null,
    };
  },

  watch: {
    nativeValue() {
      this.value = this.nativeValue;
    },
  },

  created() {
    this.value = this.nativeValue;
  },

  mounted() {
    const { maxLength, settingsForEditor, onLoad } = this;

    if (!maxLength && settingsForEditor) {
      let ckeditor = document.createElement("script");
      ckeditor.setAttribute("src", "/lib/ckeditor/ckeditor.js");
      ckeditor.setAttribute("id", "ckeditor");
      ckeditor.defer = true;
      ckeditor.onload = onLoad;
      document.body.appendChild(ckeditor);
    }
  },

  beforeUnmount() {
    const { maxLength, settingsForEditor, deleteCKeditor } = this;

    if (!maxLength && settingsForEditor) {
      deleteCKeditor();
    }
  },

  computed: {
    condition: function () {
      const { completeLink, type } = this.column;
      let update = {
        Column: completeLink,
        Type: type ?? "Equal",
        Values: [this.value],
      };
      return update;
    },

    formCondition: function () {
      const { completeLink } = this.column;
      const { maxLength, settingsForEditor } = this;

      let body;
      if (!maxLength && settingsForEditor) {
        let ysl = this.value != document.querySelector(".ck-content").innerHTML;
        body = convertHTMLDocumentToString(ysl);
      }

      let update = {
        [completeLink]: this.value ?? body,
      };
      return update;
    },

    hasFormCondition: function () {
      const { maxLength, settingsForEditor } = this;
      let ysl;
      if (!maxLength && settingsForEditor) {
        ysl = this.value != document.querySelector(".ck-content").innerHTML;
      }
      return this.value != this.nativeValue || ysl;
    },

    hasCondition: function () {
      return this.value != this.nativeValue;
    },
  },

  methods: {
    deleteCKeditor: function () {
      const { maxLength, settingsForEditor } = this;

      if (!maxLength && settingsForEditor) {
        document.querySelector("#ckeditor").remove();
        delete window.ClassicEditor;
        delete window.CKSource;
        delete window.CKEDITOR_VERSION;
        delete window.CKEDITOR_TRANSLATIONS;
      }
    },

    onLoad: function () {
      onloadCKEditor(window, this.$refs.editor);
    },

    onEdited: function () {
      if (this.changeElements != null && this.nativeValue != this.value) {
        this.changeElements({ Values: [this.value] });
      }
    },
  },
};
</script>
