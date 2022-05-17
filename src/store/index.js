import { createStore } from "vuex";
import {
  GETOfServer,
  POSTToServer,
  getElementOfType,
  imgFileFromServer,
} from "../components/methods/createFormData";
import {
  recursionUpdateGrid,
  recursionUpdatePopup,
  updateFormField,
} from "./utils";

export const store = createStore({
  state: {
    currentPage: { isDynamic: true },
    packUrl: "/iaa",
    search: "",
    loadingPage: false,
    gridFilters: {},
    popoverData: {},
    popupData: {},
    subPopupData: {},
    files: {},
    calendarEvents: [],
    calendar: null,
    dataToFetchGridUpdate: {},
    rowsIds: [],
    treeNode: {},
  },

  mutations: {
    setDynamicPage(state, page) {
      state.currentPage = {
        isDynamic: true,
        page: page,
      };

      state.gridFilters = {};
      state.loadingPage = false;
    },

    setDynamic(state, data) {
      state.currentPage.isDynamic = data;
    },

    updateGridFilters(state, filter) {
      const gridFilters = state.gridFilters;
      gridFilters[filter.gridId] = filter.filter;
    },

    updateGrid(state, grid) {
      const pageWrapper = state.currentPage;
      let page;
      if (pageWrapper != null && pageWrapper.page) {
        page = pageWrapper.page;
        for (let gridChildren of grid.children) {
          recursionUpdateGrid(page.children, gridChildren);
        }
      }
      state.loadingPage = false;
    },

    upgradePopup(state, popup) {
      const grid = getElementOfType(popup, "Grid")[0];
      const popupWrapper = state.popupData;

      if (Object.keys(popupWrapper).length) {
        recursionUpdatePopup(grid, popupWrapper.children);
      }
      state.loadingPage = false;
    },

    updatePopupField(state, field) {
      const popupData = state.popupData;
      updateFormField(popupData.tabs, field);
    },

    setSelectPopoverValue(state, selectValue) {
      state.popoverData.selectValue = selectValue;
    },

    onChangePopoverIntSelectValue(state, { val, rowNumber }) {
      state.popoverData.assistant.values[rowNumber] = val;
    },

    updatePopoverField(state, { result }) {
      const obj = {};

      for (const idx in result) {
        obj[result[idx].id] = result[idx].text;
      }
      state.popoverData.assistant.values[1] = Object.keys(obj)[0];
      state.popoverData.assistant.lastHierarchyRelated = obj;
    },

    setTreeNode(state, node) {
      state.treeNode = node;
    },

    updatePopupFieldFromPopover(state) {
      const assistant = state.popoverData.assistant;
      const { tabs } = state.popupData;
      for (const tab in tabs) {
        const { headers } = tabs[tab];

        for (const header in headers) {
          const { relatedHeader } = headers[header];

          const foundIndex = assistant.hieararchies.findIndex((el) => {
            const { foreignKeyToPreviousTable, header } = el;
            const { columnName } = header;

            if (!foreignKeyToPreviousTable) {
              return relatedHeader.columnName == foreignKeyToPreviousTable;
            } else {
              return relatedHeader.columnName == columnName;
            }
          });

          if (foundIndex != -1) {
            state.popupData.tabs[tab].headers[header].values.nativeValue =
              assistant.values[foundIndex];
          }
        }
      }
    },

    dataToFetchGridUpdate(state, data) {
      state.dataToFetchGridUpdate = data;
    },

    setRowsIds(state, data) {
      state.rowsIds = data;
    },

    setPopoverData(state, data) {
      state.popoverData = data;
    },

    setConfirmationData(state, data) {
      state.popupData = data;
    },

    setPopupData(state, data) {
      const { length } = Object.keys(data);
      state.popupData = length ? getElementOfType(data, "Page")[0] : data;

      state.loadingPage = false;
    },

    setSubPopupData(state, data) {
      const { length } = Object.keys(data);
      state.subPopupData = length ? getElementOfType(data, "Page")[0] : data;

      state.loadingPage = false;
    },

    setPopupDataPages(state, { pages, value, gridId }) {
      state.popupData.pages = pages;
      state.popupData.currentPage = value;
      state.popupData.gridId = gridId;
    },

    setSearch(state, data) {
      state.search = data;
    },

    setFiles(state, data) {
      state.files = data;
    },

    setCalendarEvents(state, data) {
      state.calendarEvents = data;
    },

    saveCalendar(state, calendar) {
      state.calendar = calendar;
    },

    setLoadingPage(state, status) {
      state.loadingPage = status;
    },
  },

  actions: {
    updateGrid({ commit, state }, data) {
      commit("setLoadingPage", true);
      const { packUrl } = state;
      POSTToServer(packUrl + "/controls.aspx?isApi=true", data)
        .then((response) => response.json())
        .then((json) => commit("updateGrid", json));
    },

    upgradePopup({ commit, state }, { request, referrer }) {
      const { packUrl } = state;

      POSTToServer(packUrl + "/controls.aspx?isApi=true", request, referrer)
        .then((response) => response.json())
        .then((json) => commit("upgradePopup", json))
        .catch((e) => alert(e));
    },

    updatePopupField({ commit, state }, data) {
      const { packUrl } = state;
      POSTToServer(packUrl + "/controls.aspx?isApi=true", data)
        .then((resp) => resp.json())
        .then((resp) => commit("updatePopupField", resp));
    },

    assistant({ commit, state }, data) {
      const { packUrl } = state;

      POSTToServer(packUrl + "/form-assistant.aspx", data)
        .then((resp) => resp.json())
        .then((resp) => commit("updatePopoverField", resp));
    },

    search({ commit, state }, data) {
      const packUrl = state.packUrl;
      POSTToServer(packUrl + "/search.aspx", data)
        .then((response) => response.text())
        .then((text) => commit("setSearch", text));
    },

    setCalendarEvents({ commit, state }, data) {
      const packUrl = state.packUrl;
      POSTToServer(packUrl + "/controls.aspx", data)
        .then((response) => response.json())
        .then((calendarEvents) => commit("setCalendarEvents", calendarEvents));
    },

    async getPage({ commit }, url) {
      commit("setLoadingPage", true);

      await GETOfServer(url + "?isApi=true")
        .then((response) => response.json())
        .then((json) => commit("setDynamicPage", json));
    },

    getLoginPage({ commit }, url) {
      GETOfServer(url)
        .then((page) => page)
        .then((page) => commit("SetDynamicPage", page));
    },

    serverSideAction({ state }, data) {
      const { action, actionId, gridId, gridID, pageId, table, value, row } =
        data;

      const obj = {
        action: actionId || action,
        pageId,
        gridID: gridId || gridID,
      };

      if (value || row) obj.row = value || row;
      if (value || row) obj.table = table;
      const { packUrl } = state;
      POSTToServer(packUrl + "/form-ajax.aspx?action=y", obj);
    },

    getLoginData({ state }) {
      const { packUrl } = state;
      POSTToServer(packUrl + "/sign-in.aspx");
    },

    signIn({ state }, data) {
      const { packUrl } = state;
      POSTToServer(packUrl + "/sign-in.aspx", data)
        .then(
          (resp) => resp
          //  {
          //   // if (resp.ok) {
          //   //   commit("setDynamic", true);
          //   //   location.replace("/iaa");
          //   // }
          // }
        )
        // .then((resp) => console.log(resp))
        .catch((response) => location.replace(response.url));
    },

    async sendForm({ commit, state }, data) {
      const { packUrl } = state;
      commit("setLoadingPage", true);
      await POSTToServer(packUrl + "/form-ajax.aspx", data);
    },

    async getSubTree({ state }, data) {
      const { packUrl } = state;
      const { quickActionType, ...info } = data;

      return await POSTToServer(packUrl + "/controls.aspx?isApi=true", info)
        .then((response) => {
          if (
            (!quickActionType && quickActionType != "Delete") ||
            quickActionType == "Add"
          )
            return response.json();
        })
        .then((json) => {
          if (!quickActionType) {
            return getElementOfType(json, "Page")[0];
          } else {
            return json;
          }
        });
    },

    async fetchFile({ commit, state }, data) {
      commit("setLoadingPage", true);
      const { packUrl } = state;

      const resp = await POSTToServer(packUrl + "/get-file.aspx", data);
      const files = await imgFileFromServer(resp, data);
      const { type } = files;
      if (type) commit("setFiles", files);

      commit("setLoadingPage", false);
    },

    downloadExcel({ commit, state }, { request, referrer }) {
      commit("setLoadingPage", true);
      const { packUrl } = state;
      const { tableName, ...info } = request;

      POSTToServer(packUrl + "/controls.aspx", info, referrer).then((resp) => {
        request.fileName = tableName + ".xlsx";
        request.fileDownload = true;
        imgFileFromServer(resp, request);
      });

      commit("setLoadingPage", false);
    },

    async setPopupData({ commit, state }, info) {
      commit("setLoadingPage", true);
      const { packUrl } = state;
      const { pages, value, gridId, data } = info;

      await POSTToServer(
        packUrl + "/controls.aspx?isApi=true",
        pages ? data : info
      )
        .then((response) => response.json())
        .then((response) => {
          commit("setPopupData", response);
          if (pages) commit("setPopupDataPages", { pages, value, gridId });
        });
    },

    async setSubPopupData({ commit, state }, data) {
      commit("setLoadingPage", true);
      const { packUrl } = state;
      await POSTToServer(packUrl + "/controls.aspx?isApi=true", data)
        .then((res) => res.json())
        .then((res) => {
          commit("setSubPopupData", res);
        });
    },

    sendDataToServerUpdate({ state }, data) {
      const { packUrl } = state;
      POSTToServer(packUrl + "/form-ajax.aspx?update=y", data);
    },

    dragAndDrop({ state }, data) {
      const { packUrl } = state;
      POSTToServer(packUrl + "/controls.aspx?isApi=true", data);
    },
  },

  getters: {},
});
