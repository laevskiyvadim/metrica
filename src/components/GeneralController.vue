<template>
  <Grid
    v-if="page.type == 'Grid'"
    :gridData="page"
    :parentId="parentId"
    :fetchGridUpdate="fetchGridUpdate"
    ref="grid"
  />
  <Form
    v-else-if="page.type == 'Form'"
    :formData="page"
    :onSubmitForm="onSubmitForm"
    :updatePopupField="updatePopupField"
    ref="form"
  />
  <TreeView
    v-else-if="page.type == 'Treeview'"
    :treeViewData="page"
    :parentId="parentId"
  />
  <Calendar
    v-else-if="page.type == 'Calendar'"
    :calendarData="page"
    :parentId="parentId"
  />
  <Pie v-else-if="page.type == 0" :pageData="page" />
</template>
<script>
import Grid from "./Main/Grid/Grid.vue";
import Form from "./Main/Form/Form.vue";
import TreeView from "./Main/TreeView/TreeView.vue";
import Calendar from "./Main/Calendar/Calendar.vue";
const Pie = defineAsyncComponent(() => import("./Main/Pies/Pie.vue"));
import { defineAsyncComponent } from "vue";
export default {
  props: {
    page: { type: Object, required: true },
    parentId: { type: String, required: true },
  },

  computed: {
    grid: function () {
      return this.$refs["grid"];
    },

    form: function () {
      return this.$refs["form"];
    },
  },

  methods: {
    fetchGridUpdate(
      filter = null,
      newPageNumber = null,
      sorting = {},
      toExcel = false
    ) {
      const { page, $store, parentId: pageId, grid } = this;
      const { type, configuration, id } = page;
      const { orderColumnName, currentPageNumber, tableName } = page;
      const { orderName, orderType } = sorting;
      const { dispatch, state, commit } = $store;
      const { popupData } = state;
      const { currentUrl } = popupData;
      const { length } = Object.keys(popupData);

      const gridId = type == "Form" ? configuration.refresh?.grid[0] : id;

      if (filter == null && type != "Form") filter = grid.filter?.condition;

      if (filter) commit("updateGridFilters", { gridId: id, filter });

      if (type == "Form" && filter) filter = filter.grid.filter?.condition;

      const request = {
        filter: JSON.stringify(filter ? filter.filters : { filters: [] }),
        btnRules: JSON.stringify(
          filter && !toExcel ? filter.btnRules : { filters: [], ID: id }
        ),
        gridId,
        controlId: gridId,
        pageId,
        page: newPageNumber || currentPageNumber,
      };

      if (toExcel) {
        request.ajaxName = "report";
        request.pageSize = "0";
        request.tableName = tableName;

        dispatch("downloadExcel", {
          request,
          referrer: length
            ? location.protocol +
              "//" +
              location.host +
              currentUrl.split(".ua")[1]
            : document.referrer,
        });
      } else {
        request.order_name = orderName || orderColumnName;
        request.order_type =
          orderType || (page.state?.orderAsc ? "asc" : "desc");

        length && currentUrl
          ? dispatch("upgradePopup", {
              request,
              referrer:
                location.protocol +
                "//" +
                location.host +
                currentUrl.split(".ua")[1],
            })
          : dispatch("updateGrid", request);
      }
    },

    updatePopupField: function (completeLink, selectValue) {
      const { $store, page, parentId } = this;
      const { dispatch } = $store;
      const { toRequest, configuration, id } = page;

      let { length } = Object.keys(toRequest);
      if (!length) return;

      let update;
      let colval;
      for (let item in toRequest) {
        if (toRequest[item][0].split(".")[1] == completeLink) {
          update = item;
          colval = { [toRequest[item][0]]: selectValue };
          break;
        }
      }

      const data = {
        data: JSON.stringify({
          configuration,
          update,
          colval,
        }),
        controlId: id,
        pageId: parentId,
      };

      if (!update || !colval) return;

      dispatch("updatePopupField", data);
    },

    onSubmitForm: async function () {
      const { page, form, $store, fetchGridUpdate } = this;
      const { popupOpenTime, rowsData: rows, tablesData: tables } = form;
      const { commit, dispatch, state } = $store;
      const { dataToFetchGridUpdate, rowsIds } = state;
      const { id, mainTableName: tName, parentID, isUpdate, formParams } = page;
      const { length } = Object.keys(dataToFetchGridUpdate);

      const CustomData = { popupOpenTime };
      if (rowsIds.length) CustomData.rowIds = [...rowsIds];

      const params = {};
      for (let p in formParams) params[p.split(".")[1]] = formParams[p];

      const TablesDatas = { [tName]: [{ ...params, ...rows() }], ...tables() };

      const update = {
        upsert: JSON.stringify([{ ID: id, TablesDatas, CustomData }]),
        pageId: parentID,
        update: isUpdate ? "yes" : "",
      };

      if (!length) {
        await dispatch("sendForm", update);
      } else {
        const { newPageNumber, sorting } = dataToFetchGridUpdate;
        dispatch("sendForm", update);
        fetchGridUpdate(dataToFetchGridUpdate, newPageNumber, sorting);
      }

      commit("setPopupData", {});
      commit("dataToFetchGridUpdate", {});
      if (rowsIds.length) commit("setRowsIds", []);
    },
  },

  components: { Grid, Form, TreeView, Calendar, Pie },
};
</script>
