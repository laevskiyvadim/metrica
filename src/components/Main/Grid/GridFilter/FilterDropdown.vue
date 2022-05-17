<template>
  <div class="filter">
    <div class="pointer">
      <div class="arrow"></div>
      <div class="arrow_border"></div>
    </div>

    <div class="body">
      <div
        class="row"
        v-for="({ fieldModel, key, completeLink, type }, index) of columns"
        :key="index"
      >
        <div v-if="fieldModel?.headerForSorting?.dataType" class="col">
          {{ key }}:
          <RowTypes
            :relatedHeader="fieldModel.headerForSorting"
            :relatedValues="fieldModel.relatedValues"
            :column="{ completeLink, type }"
            :canClearValue="fieldModel.headerForSorting.isReplaceable"
            :values="{ nativeValue: defValue(completeLink) }"
            :changeElements="(val) => insertData()"
            :ref="'filterColumn' + index"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import RowTypes from "../../shared/RowTypes.vue";
export default {
  props: {
    filters: { type: Object, required: true },
    changeFilter: { type: Function, default: null },
    storage: { type: Object, required: true },
  },

  computed: {
    columns: function () {
      const { filters } = this;
      const { betweens, columns } = filters;
      const rows = [];

      if (columns) rows.push(...columns);
      if (betweens) rows.push(...betweens);

      return rows;
    },
    hasCondition: function () {
      return !![...this.getMainConditions()]?.length;
    },
    condition: function () {
      const { getMainConditions: mainCond } = this;

      let update = {
        filters: { Elements: [...mainCond()] },
        btnRules: { filters: { Elements: [...mainCond()] } },
      };

      return update;
    },
  },
  methods: {
    getColumn: function (index) {
      return this.$refs["filterColumn" + index];
    },
    getMainConditions: function () {
      const { filters, getColumn } = this;
      const { columns } = filters;
      let condition = [];

      if (columns) {
        for (let i = 0; i < columns.length; i++) {
          let column = getColumn(i);
          if (column) {
            column = column[0].field;
            if (column.hasCondition) condition.push(column.condition);
          }
        }
      }
      return condition;
    },
    defValue: function (value) {
      const { storage } = this;
      const { Elements } = storage;

      if (Elements) {
        for (let i = 0; i < Elements.length; i++) {
          if (Elements[i].Column == value) {
            return Elements[i].Values[0];
          }
        }
      }
    },
    insertData: function () {
      if (this.changeFilter != null) {
        let update = this.condition;
        this.changeFilter(update);
      }
    },
  },
  components: {
    RowTypes,
  },
};
</script>
