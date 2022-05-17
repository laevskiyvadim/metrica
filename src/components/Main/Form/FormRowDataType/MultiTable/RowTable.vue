<template>
  <td :colspan="2" class="row-table">
    <table>
      <thead :hidden="!rowTable.showHeader">
        <tr>
          <th v-if="canDeleteRow" :style="{ width: '20px' }"></th>
          <th
            v-for="(header, idx) in headers"
            :key="idx"
            :style="{ width: tbodyColumnWidth(header) }"
            :hidden="header.isHidden"
          >
            <span> {{ header.accordName }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(n, index) in rowsCount" :key="index">
          <template v-for="(header, idx) in headers" :key="idx">
            <td
              class="minus"
              v-if="canDeleteRow"
              @click.stop="deleteRow(header, index)"
              :hidden="idx != 0"
              :style="{ width: '20px' }"
            >
              <i class="icon-remove-sign"></i>
            </td>

            <td
              v-if="!header.isHidden"
              :style="{ width: tbodyColumnWidth(header) }"
            >
              <RowTypes
                :relatedHeader="header.relatedHeader"
                :relatedValues="header.relatedValues"
                :canClearValue="header.relatedHeader.isNull"
                :values="{
                  ...nativeValue(header, index),
                }"
                :disabled="header.isReadOnly"
                :column="{
                  completeLink: header.relatedHeader.columnNamePseudo,
                }"
                :ref="'column' + idx"
              />
            </td>
          </template>
        </tr>

        <tr v-if="canAddRow">
          <td :colspan="headers.length">
            <span class="plus" @click.stop="addRow">
              <i class="icon-plus-sign"></i>&nbsp;
              <span>добавить</span>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </td>
</template>
<script>
import RowTypes from "../../../shared/RowTypes.vue";
import { firstCharToLowerCase, tbodyColumnWidth } from "./utils";
export default {
  props: { rowData: { type: Object, required: true } },
  data() {
    return {
      deleteIndexes: [],
      addedRows: [],
      rowsCount: 0,
      lastIndex: 0,
    };
  },

  created() {
    this.tbodyColumnWidth = tbodyColumnWidth;

    this.addedIndices();

    for (let value of this.headers[0].values)
      if (Number(value.identityValue) > this.lastIndex)
        this.lastIndex = value.identityValue;
  },

  computed: {
    canDeleteRow: function () {
      return this.rowTable.canDeleteRow;
    },
    hasFormCondition: function () {
      return !![...this.deleteIndexes, ...this.addedRows].length;
    },
    formCondition: function () {
      const { rowData } = this;
      let update = {
        [rowData.tableName]: [...this.removedRows(), ...this.addedRowsToForm()],
      };
      return update;
    },
    canAddRow: function () {
      return this.rowTable.canAddRow;
    },
    rowTable: function () {
      return this.rowData.rowTable;
    },
    headers: function () {
      const { rowTable } = this;
      let headers = [];
      let headersFiltered = [];

      for (const header of rowTable.headers) {
        headers.push({ ...header });
      }

      for (let i = 0; i < headers.length; i++) {
        for (const row of this.addedRows) {
          let hasRowInValues = true;
          for (const value of headers[i].values) {
            if (value.identityValue == row) {
              hasRowInValues = false;
            }
          }
          if (hasRowInValues) {
            headers[i].values.push({ identityValue: row });
          }
        }

        headers[i].values = headers[i].values.filter((x) => {
          return ![...this.deleteIndexes].includes(x.identityValue);
        });

        headersFiltered.push(headers[i]);
      }
      return headersFiltered;
    },
  },

  methods: {
    removedRows: function () {
      const addedRows = [...this.addedRows];
      let deleteIndexes = this.deleteIndexes.filter((x) => {
        return !addedRows.includes(x);
      });
      return deleteIndexes.map((x) => {
        return {
          Id: x,
        };
      });
    },
    addedRowsToForm: function () {
      let addedRowsToForm = [];
      const addedRows = [...this.addedRows].filter((x) => {
        return ![...this.deleteIndexes].includes(x);
      });

      const columns = Object.keys(this.$refs);

      for (let i = 0; i < this.rowsCount; i++) {
        let obj = {};

        if (addedRows.includes(this.headers[0].values[i].identityValue)) {
          obj[""] = "";

          for (let z = 0; z < columns.length; z++) {
            obj = {
              ...obj,
              ...this.$refs[columns[z]][i].field.formCondition,
            };
          }

          addedRowsToForm.push(obj);
        } else {
          let insert = false;
          obj.Id = this.$refs[columns[0]][i].values.identityValue;

          for (let z = 0; z < columns.length; z++) {
            if (this.$refs[columns[z]][i].field.hasFormCondition) {
              insert = true;

              obj = {
                ...obj,
                ...this.$refs[columns[z]][i].field.formCondition,
              };
            }
          }
          if (insert) addedRowsToForm.push(obj);
        }
      }
      return addedRowsToForm;
    },
    addedIndices: function () {
      const {
        rowTable: { headers },
      } = this;
      const { values } = headers[0];
      this.rowsCount = values.length ?? 0;
    },

    values: function (header, index) {
      const { relatedValues, values } = header;
      return {
        ...relatedValues,
        [values[index].nativeValue]: values[index].value,
      };
    },
    nativeValue: function (header, index) {
      const { values, relatedHeader } = header;
      const {
        rowTable: { defaultRows },
      } = this;

      if (values[index]?.nativeValue) {
        return values[index];
      } else {
        if (values[0]?.nativeValue) {
          return values[0];
        } else {
          if (defaultRows.length) {
            let defaultObjectValuesKey = firstCharToLowerCase(
              relatedHeader.columnNamePseudo
            );

            const defVal = defaultRows[0];

            return { nativeValue: defVal[defaultObjectValuesKey] };
          }
          return "";
        }
      }
    },

    deleteRow: function (header, index) {
      const { values } = header;
      this.deleteIndexes.push(values[index].identityValue);
      this.rowsCount--;
    },

    addRow: function () {
      if (this.rowsCount < this.rowTable.maxCount) {
        this.rowsCount++;

        this.lastIndex++;
        this.addedRows.push(`${this.lastIndex}`);
      }
    },
  },

  components: {
    RowTypes,
  },
};
</script>
