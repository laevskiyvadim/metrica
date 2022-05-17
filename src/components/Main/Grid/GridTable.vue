<template>
  <thead v-if="hasHeaders" class="grid-table">
    <tr>
      <th class="empty" v-if="pageData.state?.useRowSelector">
        <input
          v-if="pageData.state?.useRowSelector"
          type="checkbox"
          :value="isMasterChecked"
          @click.stop="selectMasterCheckbox"
        />
      </th>
      <th class="empty" v-if="haveEmptyBlock(pageData)"></th>
      <th
        v-for="(
          {
            relatedHeader: { columnName, isRowId },
            title,
            isHidden,
            isSortable,
          },
          index
        ) of gridHeaders"
        :key="index"
        :hidden="isRowId && isHidden"
      >
        <template v-if="!isHidden">
          <span class="line"></span>
          <span class="title">{{ title }}</span>
          <span class="utils">
            <span
              v-show="isSortable"
              class="btn sort"
              :class="styles(columnName)"
              title="Сортировать"
              @click="sorting(columnName)"
            >
            </span>
          </span>
        </template>
      </th>
    </tr>
  </thead>

  <tbody class="grid-table">
    <tr v-if="!groupingRows.gridRows.length">
      <td>
        <h5 class="none">ЗАПИСИ ОТСУТСТВУЮТ</h5>
      </td>
    </tr>
    <template v-if="!havePartBys">
      <HavePartBys
        v-for="(row, idx) in groupingRows.gridRows"
        :key="idx"
        :gridRow="row"
        :addActions="hasRowActions"
        :actions="pageData.rowActionsGroups"
        :openPopUp="openPopUp"
        :openedPopOver="openedPopOver"
        :addCheckbox="pageData.state.useRowSelector"
        :headers="gridHeaders"
        :onEditRow="onEditRow"
      />
    </template>
    <template v-else>
      <TableBodyRow
        v-for="(row, idx) in groupingRows.gridRows"
        :key="idx"
        :gridRow="row"
        :addCheckbox="pageData.state.useRowSelector"
        :addActions="hasRowActions"
        :actions="chooseActions(idx)"
        :openPopUp="openPopUp"
        :openedPopOver="openedPopOver"
        :headers="gridHeaders"
        :onSelectRow="onSelectRow"
        :ref="'row' + idx"
      />
    </template>
  </tbody>
</template>
<script>
import TableBodyRow from "./Grid/TableBody/TableBodyRow.vue";
import HavePartBys from "./Grid/HavePartBys.vue";
import { groupedRosterRows } from "./Roster/utils";
import {
  isDate,
  whatActionsInRow,
  haveEmptyBlock,
} from "../../methods/createFormData";
export default {
  props: {
    pageData: { type: Object, required: true },
    onSorted: { type: Function, default: null },
    openPopUp: { type: Function, default: null },
    openedPopOver: { type: Function, default: null },
    onSelectRow: { type: Function, default: null },
    onEditRow: { type: Function, default: null },
    parentId: { type: String, required: true },
  },

  created() {
    this.isDate = isDate;
    this.haveEmptyBlock = haveEmptyBlock;
  },

  data() {
    return {
      isMasterChecked: false,
    };
  },

  computed: {
    gridHeaders: function () {
      return this.pageData.gridHeaders;
    },

    hasHeaders: function () {
      return Object.keys(this.gridHeaders).length;
    },

    hasRowActions: function () {
      let hasAny = false;

      const {
        pageData: { rowActionsGroups },
      } = this;

      for (let i = 0; i < rowActionsGroups.length; i++) {
        const group = rowActionsGroups[i];

        if (group.actions && group.actions.length > 0) {
          hasAny = true;
          break;
        }
      }
      return hasAny;
    },

    havePartBys: function () {
      return this.pageData?.partBys?.length == 0;
    },

    groupingRows: function () {
      const { havePartBys, pageData } = this;

      if (havePartBys) {
        return pageData;
      }

      return groupedRosterRows(pageData);
    },
  },

  methods: {
    sorting: function (columnName) {
      const { onSorted, headerIsSortedAscending } = this;
      if (onSorted != null) {
        let isAscending = headerIsSortedAscending(columnName);
        let update = {
          orderType: isAscending ? "asc" : "desc",
          orderName: columnName,
        };

        onSorted(update);
      }
    },

    headerIsSortedAscending(columnName) {
      let result = false;
      const {
        pageData: { orderColumnName, state },
      } = this;

      if (columnName == orderColumnName) {
        result = state.orderAsc == false;
      }

      return result;
    },

    styles: function (columnName) {
      let style = "icon-sort-by-attributes";
      const direction = !!this.headerIsSortedAscending(columnName);
      if (direction) style += "-alt";

      return style;
    },

    chooseActions: function (idx) {
      return whatActionsInRow(idx, this.pageData.rowActionsGroups);
    },

    getRow(idx) {
      return this.$refs["row" + idx];
    },

    selectMasterCheckbox: function () {
      this.isMasterChecked = !this.isMasterChecked;

      const { pageData, getRow, onSelectRow, isMasterChecked } = this;

      let rows = pageData?.gridRows;

      for (let i = 0; i < rows.length; i++) {
        let row = getRow(i)[0];
        onSelectRow(row.valueChecked, isMasterChecked);
        row.isCheckboxSelected = isMasterChecked;
      }
    },
  },

  components: { TableBodyRow, HavePartBys },
};
</script>
