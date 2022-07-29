import { createStore } from "vuex";

export default createStore({
  state() {
    return {
      page: 0,
      lists: [],
      searchList: [],
      isSearch: false,
      visibleTodo: [],
      currentPage: 1,
      pageSize: 3,
    };
  },

  mutations: {
    increment(state) {
      state.page++;
    },

    decrement(state) {
      state.page--;
    },

    onAdd(state, item) {
      state.lists.push(item);
    },

    onDelete(state, id) {
      state.lists = state.lists.filter((e) => e.id !== id);
    },

    onSearch(state, item) {
      state.searchList = state.lists.filter((str) => {
        return str.name.indexOf(item) !== -1;
      });

      if (item.length > 0) {
        state.isSearch = true;
      } else if (item.length < 1) {
        state.isSearch = false;
        state.searchList = [];
      }
    },

    onSort(state, item) {
      switch (item) {
        case "ASCENDING":
          state.lists.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          );
          break;
        case "DESCENDING":
          state.lists.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          );
          state.lists.reverse();

          break;
        default:
          break;
      }
    },

    onEdit(state, item) {
      const newArr = state.lists.map((obj) => {
        if (obj.id === item.id) {
          return {
            ...obj,
            name: item.name,
          };
        }
        return obj;
      });
      state.lists = newArr;
    },

    onChangePage(state, item) {
      state.lists = item;
    },
  },

  getters: {},

  actions: {
    updateVisibleTodos({ state, dispatch }) {
      if (state.searchList.length < 1) {
        state.visibleTodo = state.lists.slice(
          state.page * state.pageSize,
          state.page * state.pageSize + state.pageSize
        );
      } else {
        state.visibleTodo = state.searchList.slice(
          state.page * state.pageSize,
          state.page * state.pageSize + state.pageSize
        );
      }

      if (state.visibleTodo.length === 0 && this.currentPage > 0) {
        dispatch("updatePage", (state.currentPage = -1));
      }
    },

    updatePage({ state, dispatch }, pageNumber) {
      state.page = pageNumber;
      dispatch("updateVisibleTodos");
    },

    onSort({ state, dispatch }, item) {
      switch (item) {
        case "ASCENDING":
          state.lists.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          );
          dispatch("updateVisibleTodos");
          break;
        case "DESCENDING":
          state.lists.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          );
          state.lists.reverse();
          dispatch("updateVisibleTodos");

          break;
        default:
          break;
      }
    },

    onSearch({ state }, item) {
      state.searchList = state.lists.filter((str) => {
        return str.name.indexOf(item) !== -1;
      });
      console.log(state.searchList);

      if (item.length > 0) {
        state.isSearch = true;
      } else if (item.length < 1) {
        state.isSearch = false;
        state.searchList = [];
      }
    },

    onEdit({ state, dispatch }, item) {
      if (state.searchList.length > 0) {
        const newArr = state.searchList.map((obj) => {
          if (obj.id === item.id) {
            return {
              ...obj,
              name: item.name,
            };
          }
          return obj;
        });
        state.searchList = newArr;

        const newArr2 = state.lists.map((obj) => {
          if (obj.id === item.id) {
            return {
              ...obj,
              name: item.name,
            };
          }
          return obj;
        });
        state.lists = newArr2;
      } else {
        const newArr = state.lists.map((obj) => {
          if (obj.id === item.id) {
            return {
              ...obj,
              name: item.name,
            };
          }
          return obj;
        });
        state.lists = newArr;
      }
      dispatch("updateVisibleTodos");
    },
  },
});
