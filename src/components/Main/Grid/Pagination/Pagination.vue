<template>
  <ul class="pagination" v-if="pagesCount > 1">
    <li>
      <a @click.prevent="prevPage">«</a>
    </li>
    <template v-for="n in pages()" :key="n">
      <li :class="{ active: currentPage == n }">
        <a @click.prevent="() => onChangedPage(n)">{{ n }}</a>
      </li>
    </template>
    <li>
      <a @click.prevent="nextPage">»</a>
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    currentPage: {
      type: Number,
    },
    pagesCount: {
      type: Number,
    },
    onChangedPage: { type: Function, default: null },
    beforeCollapseCount: {
      type: Number,
      default: 2,
    },
  },

  methods: {
    prevPage: function () {
      if (this.currentPage > 1) this.onChangedPage(this.currentPage - 1);
    },
    nextPage: function () {
      if (this.currentPage < this.pagesCount)
        this.onChangedPage(this.currentPage + 1);
    },
    pages: function () {
      const {
        currentPage,
        pagesCount,
        beforeCollapseCount,
        renderAfterCurrent,
        renderBeforeCurrent,
      } = this;

      let elements = [];

      elements.push(...renderAfterCurrent(currentPage, beforeCollapseCount));

      elements.push(currentPage);

      elements.push(
        ...renderBeforeCurrent(currentPage, pagesCount, beforeCollapseCount)
      );

      return elements;
    },

    renderAfterCurrent: function (currentPage, beforeCollapseCount) {
      let elements = [];

      if (currentPage - beforeCollapseCount > 3) {
        elements.push(1);
        elements.push("...");
        for (let i = 0; i < beforeCollapseCount; i++) {
          elements.push(currentPage - beforeCollapseCount + i);
        }
      } else {
        for (let i = 0; i < currentPage - 1; i++) {
          elements.push(i + 1);
        }
      }
      return elements;
    },

    renderBeforeCurrent: function (
      currentPage,
      pagesCount,
      beforeCollapseCount
    ) {
      let elements = [];
      if (pagesCount - currentPage - beforeCollapseCount > 2) {
        for (let i = 0; i < beforeCollapseCount; i++) {
          elements.push(currentPage + i + 1);
        }
        elements.push("...");
        elements.push(pagesCount);
      } else {
        for (let i = 0; i < pagesCount - currentPage; i++) {
          elements.push(currentPage + i + 1);
        }
      }
      return elements;
    },
  },
};
</script>
