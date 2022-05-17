<template>
  <div>
    <iframe height="100%" width="100%" :src="getFilePath"></iframe>
  </div>
</template>
<script>
export default {
  name: "Pdf",
  props: {
    files: { type: Object, required: true },
    closePdf: { type: Function, default: null },
  },

  data() {
    return {
      src: null,
    };
  },
  computed: {
    getFilePath: function () {
      return "/lib/pdfjs/web/viewer.html?file=" + this.src;
    },
  },

  created() {
    this.src = this.files.file;
    window["closePdf"] = this.closePdf;
  },
};
</script>
