<template>
  <div class="multi">
    <div>
      <div class="multiple">
        <ul @click.prevent="check = !check">
          <li class="choice" v-for="(value, idx) in selectedValues" :key="idx">
            <div>{{ value }}</div>
            <a @click.stop="removePosition(idx)" class="choice-close"></a>
          </li>
        </ul>
      </div>
    </div>

    <div class="mask" @click="check = !check" :style="maskStyle"></div>

    <div class="drop" :style="bodyStyle">
      <ul>
        <li
          v-for="(el, idx) of listValues"
          :key="el"
          @mouseover="() => onHover(idx, true)"
          @mouseout="() => onHover(idx, false)"
          @click.stop="addPosition(idx)"
          :class="{ highlighted: hover[idx] }"
        >
          <div class="label"><span class="select2-match"></span>{{ el }}</div>
        </li>
        <li v-if="doNotHaveResult" class="no-results">Нет результатов</li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: { rowData: { type: Object, required: true } },

  data() {
    return { selectedValues: {}, hover: [], check: false };
  },
  created() {
    this.rowData.multiSelect.selectedValuesRelations.forEach((el) => {
      this.selectedValues[el.foreignKeyValue] = el.relatedValue;
    });
  },

  computed: {
    formCondition: function () {
      const { rowData } = this;

      return {
        [rowData.tableName]: [...this.removedRows(), ...this.addedRows()],
      };
    },
    hasFormCondition: function () {
      return !![...this.removedRows(), ...this.addedRows()].length;
    },
    maskStyle: function () {
      return { display: this.check ? "block" : "none" };
    },
    bodyStyle: function () {
      return {
        display: this.check ? "block" : "none",
      };
    },
    doNotHaveResult: function () {
      return Object.keys(this.listValues).length == 0;
    },
    listValues: function () {
      let values = {
        ...this.rowData.multiSelect.relatedValues.resultingPkRelatedValues,
      };
      const selectedValuesRelations =
        this.rowData.multiSelect.selectedValuesRelations;

      for (const { foreignKeyValue, relatedValue } of selectedValuesRelations) {
        if (!values[foreignKeyValue]) {
          values[foreignKeyValue] = relatedValue;
        }
      }

      for (const key in values) {
        if (this.selectedValues[key]) {
          delete values[key];
        }
      }

      return values;
    },
  },
  methods: {
    removedRows: function () {
      const {
        rowData: { multiSelect },
      } = this;
      let removedRows = [];
      let selectedValues = [];
      const selectedValuesRelations = multiSelect.selectedValuesRelations;

      for (const el of Object.keys(this.selectedValues)) {
        selectedValues.push(el);
      }

      for (const {
        primaryKeyValue,
        foreignKeyValue,
      } of selectedValuesRelations) {
        if (!selectedValues.includes(foreignKeyValue)) {
          removedRows.push({ Id: primaryKeyValue });
        }
      }

      return removedRows;
    },
    addedRows: function () {
      const {
        rowData: { multiSelect },
      } = this;
      const keyId = multiSelect.selectColumnName;
      let addedRows = [];
      let valuesRelations = [];
      const selectedValuesRelations = multiSelect.selectedValuesRelations;

      for (let i = 0; i < selectedValuesRelations.length; i++) {
        valuesRelations.push(selectedValuesRelations[i].foreignKeyValue);
      }

      for (const el of Object.keys(this.selectedValues)) {
        if (!valuesRelations.includes(el)) {
          addedRows.push(el);
        }
      }

      return addedRows.map((x) => {
        return { [keyId]: x };
      });
    },
    onHover: function (idx, bool) {
      this.currentValue = null;
      this.hover[idx] = bool;
    },
    addPosition: function (idx) {
      this.selectedValues[idx] = this.listValues[idx];
      this.hover[idx] = false;
      this.check = false;
    },
    removePosition: function (idx) {
      delete this.selectedValues[idx];
    },
  },
};
</script>
