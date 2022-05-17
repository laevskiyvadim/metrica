<template>
  <div class="m-title-row" v-html="title.title12"></div>
  <div class="m-title-row" @click.stop v-html="title.menu12"></div>
</template>
<script>
export default {
  props: {
    title: { type: Object, required: true },
    parentId: { type: String, required: true },
    openedPopOver: { type: Function, default: null },
  },

  updated() {
    const { installActions } = this;
    installActions();
  },

  mounted() {
    const { installActions } = this;
    installActions();
  },

  methods: {
    installActions() {
      const { openPopup, parentId } = this;
      const a = document.querySelector(".actions");

      if (a) {
        const liList = a.querySelectorAll("a");

        liList.forEach((el) => {
          el.addEventListener("click", function (e) {
            e.preventDefault();

            const action = el.attributes?.actionid?.value;

            let update = {
              pageId: parentId,
              actionId: action,
              referer: "https://my.corpgen.ua" + location.pathname,
            };

            if (action) openPopup(update);
          });
        });

        const btnGroup = a.querySelector(".btn-group");

        if (btnGroup) {
          const value = btnGroup.attributes["data-content"].nodeValue;

          const htmlObject = document.createElement("div");
          htmlObject.innerHTML = value;

          const aList = htmlObject.querySelectorAll("a");
          aList;

          //todo send data to popover, mb json?
          btnGroup.onclick = this.openPopover;
        }
      }
    },
    openPopup: function (update) {
      const { $store } = this;
      $store.dispatch("setPopupData", update);
    },

    openPopover: function () {
      // console.log("safa");
    },
  },
};
</script>
