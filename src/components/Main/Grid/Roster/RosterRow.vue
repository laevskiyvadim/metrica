<template>
  <div class="rooster-row">
    <div class="header">
      <div
        class="Title"
        @click.prevent
        v-html="row.preformattedRows.title"
        ref="title"
      ></div>
      <div
        class="UpRight"
        @click.stop
        v-html="row.preformattedRows.upRight"
      ></div>
    </div>
    <div class="clearfix"></div>
    <div class="entry-content">
      <div class="DownRight" v-html="row.preformattedRows.downRight"></div>
      <div class="Data">
        <ActionsActions
          v-if="actions"
          :actions="actions"
          :openedPopOver="(val) => openedPopOver({ ...val, value })"
        />
        <div class="html" v-html="badge"></div>
      </div>
    </div>
  </div>
</template>
<script>
import ActionsActions from "../../Actions/ActionsActions.vue";
export default {
  props: {
    row: { type: Object, required: true },
    actions: { type: Object, required: false },
    openedPopOver: { type: Function, default: null },
  },

  mounted() {
    const { addListener } = this;
    const html = document.querySelector(".html > .actions");

    if (html) {
      html.remove();
    }

    addListener();
  },

  updated() {
    const html = document.querySelector(".html > .actions");
    if (html) {
      html.remove();
    }
  },

  computed: {
    badge: function () {
      return this.row.preformattedRows.data;
    },
    value: function () {
      return this.row?.cells[0]?.value;
    },
  },

  methods: {
    addListener: function () {
      const { $refs, $router } = this;
      const a = $refs["title"].querySelector("a");
      const href = a.attributes["href"].nodeValue;
      a.addEventListener("click", () => {
        $router.push(href);
      });
    },
  },

  components: { ActionsActions },
};
</script>
