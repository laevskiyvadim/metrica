<template>
  <div class="file" @click.stop>
    <input
      type="file"
      accept="image/*"
      id="img"
      @change="onFileChange"
      :multiple="config.multiple"
      ref="img"
    />
    <div
      @drop.prevent="onDrop($event)"
      @dragover.prevent
      @ondragend.prevent
      :draggable="false"
    >
      <label for="img" ref="label">
        <div class="text" v-if="showLabel">
          {{ filesNames }}
        </div>
        <template v-else>
          <img :src="img" v-for="(img, idx) of files" :key="idx" />
        </template>
      </label>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    file: { type: Object, required: true },
    config: { type: Object, required: true },
  },
  data() {
    return { filesNames: `Drop Files Here`, files: [] };
  },
  computed: {
    showLabel: function () {
      const { config, files } = this;
      return !config.picturePreview || (config.picturePreview && !files.length);
    },
  },
  methods: {
    onDrop: function (event) {
      const img = this.$refs["img"];
      const { config } = this;

      if (config.dragNdrop) {
        img.files = event.dataTransfer.files;
        this.onFileChange();
      }
    },

    onFileChange: function () {
      const img = this.$refs["img"];
      const { config } = this;

      if (!config.useUpload) {
        img.value = "";
        alert("Загрузка файлов запрещена");
        return;
      }

      if (img.files.length > config.maxCount) {
        img.value = "";
        alert("Превышен лимит количества файлов");
        return;
      }

      if (!config.picturePreview) {
        if (img.files && img.files.length > 0) {
          let filesNames = "";

          for (const file of img.files) {
            filesNames += ` ${file.name}${config.multiple ? ";" : ""}`;
          }

          this.filesNames = filesNames;
        }
      } else {
        for (let i = 0; i < img.files.length; i++) {
          let reader = new FileReader();
          reader.onloadend = () => (this.files[i] = reader.result);
          if (img.files[i]) reader.readAsDataURL(img.files[i]);
        }
      }
    },
  },
};
</script>
