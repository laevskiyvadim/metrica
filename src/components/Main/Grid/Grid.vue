<template>
  <div class="grid">
    <div class="action-zone">
      <GridActions
        v-if="gridData.actionZoneActions[0]"
        :actions="gridData.actionZoneActions"
        :rowsLength="rowsLength"
        :openPopUp="actionOrPopup"
        :openedPopOver="openPopover"
      />
      <Filter
        v-if="haveFilters"
        :filters="gridData.filter"
        :changeFilter="changeFilter"
        :storage="storage"
        ref="filter"
      />
    </div>
    <table>
      <GridTable
        v-if="gridData.template == 'GridTable'"
        :pageData="gridData"
        :parentId="parentId"
        :onSorted="onSorted"
        :openPopUp="actionOrPopup"
        :openedPopOver="openPopover"
        :onSelectRow="onSelectRow"
        :onEditRow="onEditRow"
      />
      <Roster
        v-else-if="gridData.template == 'Roster'"
        :pageData="gridData"
        :openPopUp="actionOrPopup"
        :openedPopOver="openPopover"
      />
    </table>
    <Pagination
      :pagesCount="gridData.pagesCount"
      :currentPage="gridData.currentPageNumber"
      :onChangedPage="onChangedPage"
    />
  </div>
</template>
<script>
import GridTable from "./GridTable.vue";
import Roster from "./Roster.vue";
import GridActions from "../Actions/ActionsActions.vue";
import Filter from "./GridFilter/index.vue";
import Pagination from "./Pagination/Pagination.vue";

export default {
  props: {
    gridData: { type: Object, required: true },
    fetchGridUpdate: { type: Function, default: null },
    parentId: { type: String, required: true },
  },

  data() {
    return {
      rows: [],
      storage: {},
    };
  },

  created() {
    const { filterCondition } = this;
    if (filterCondition.filters) {
      this.storage = filterCondition.filters;
    }
  },

  computed: {
    filterCondition: function () {
      const { gridData, $store } = this;
      const filters = $store.state.gridFilters;
      let currentFilter = {};
      for (const filter in filters) {
        if (filter == gridData.id) {
          currentFilter = filters[gridData.id];
          break;
        }
      }
      return { ...currentFilter };
    },

    filter: function () {
      return this.$refs["filter"];
    },

    rowsLength: function () {
      const { rows } = this;
      return rows.length;
    },

    haveFilters: function () {
      const { gridData } = this;
      return gridData?.filter?.columns && gridData?.filter?.columns[0];
    },

    dataToFetchGridUpdate: function () {
      const { gridData, filter } = this;
      const { currentPageNumber, orderColumnName, state } = gridData;

      const grid = { filter };

      const sorting = {
        orderName: orderColumnName,
        orderType: state.orderAsc ? "asc" : "desc",
      };

      return { grid, newPageNumber: currentPageNumber, sorting };
    },

    pages: function () {
      const { gridData } = this;
      const { gridRows } = gridData;
      return gridRows.reduce((acc, el) => {
        acc.push(el.primaryKeyValue);
        return acc;
      }, []);
    },
  },

  methods: {
    openPopover: function (val) {
      const { $store, dataToFetchGridUpdate, fetchGridUpdate } = this;
      const { gridData, parentId } = this;
      const { commit } = $store;
      const { id, tableName } = gridData;

      val.actions = val.actions.map((el) => {
        return { ...el, gridId: id, controlId: id, pageId: parentId };
      });

      commit("setPopoverData", { ...val, fetchGridUpdate, tableName });
      commit("dataToFetchGridUpdate", dataToFetchGridUpdate);
    },

    actionOrPopup: async function (val) {
      const { $store, dataToFetchGridUpdate, fetchGridUpdate, pages } = this;
      const { gridData, rows, parentId } = this;
      const { commit, dispatch } = $store;
      const { actionId, value, serverSide, multiRow } = val;
      const { filePreview, fileDownload, fileName } = val;

      const { id } = gridData;

      const data = {
        actionId,
        gridId: id,
        controlId: id,
        pageId: parentId,
      };

      if (value) data.value = value;

      if (!serverSide) {
        if (multiRow && rows.length) {
          commit("setRowsIds", rows);
          dispatch("setPopupData", data);
          commit("dataToFetchGridUpdate", dataToFetchGridUpdate);
        } else if (multiRow && !rows.length) {
          alert("no selected rows");
        } else if (filePreview || fileDownload) {
          const file = { fid: value, filePreview, fileDownload, fileName };

          dispatch("fetchFile", file);
        } else {
          await dispatch("setPopupData", { data, pages, value, gridId: id });

          commit("dataToFetchGridUpdate", dataToFetchGridUpdate);
        }
      } else {
        dispatch("serverSideAction", data);
        fetchGridUpdate();
      }
    },

    onEditRow: function (update) {
      const { $store, parentId, fetchGridUpdate, gridData } = this;
      const { tableName } = gridData;

      update = { ...update, tablename: tableName };

      const editedRowData = {
        upsert: JSON.stringify({
          updates: [update],
        }),
        pageId: parentId,
      };

      $store.dispatch("sendDataToServerUpdate", editedRowData);
      fetchGridUpdate();
    },

    onSelectRow: function (value, checked = null) {
      const { rows } = this;
      const index = rows.indexOf(value);

      if (checked) {
        index == -1 ? rows.push(value) : null;
      } else if (checked != null) {
        index == -1 ? null : rows.splice(index, 1);
      } else {
        index == -1 ? rows.push(value) : rows.splice(index, 1);
      }
    },

    onSorted: function (sorting) {
      const { fetchGridUpdate } = this;
      fetchGridUpdate(null, null, sorting);
    },

    onChangedPage: function (newPageNumber) {
      const { fetchGridUpdate } = this;
      fetchGridUpdate(null, newPageNumber, {});
    },

    changeFilter: function (filter) {
      const { fetchGridUpdate } = this;
      fetchGridUpdate(filter, null, {});
    },
  },

  components: {
    GridTable,
    Roster,
    GridActions,
    Pagination,
    Filter,
  },
};
</script>
