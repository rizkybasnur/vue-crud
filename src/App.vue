<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    "
  >
    <img alt="Vue logo" src="./assets/logo.png" />

    <form ref="formulir" @submit.prevent="onSubmit" style="margin-bottom: 16px">
      <div>Masukkan nama (hanya text)</div>
      <input
        type="text"
        placeholder="name"
        v-model="name"
        pattern="[a-zA-Z]*"
        oninvalid="this.setCustomValidity('Hanya boleh memasukkan huruf')"
        oninput="this.setCustomValidity('')"
        required
      />
      <button type="submit">{{ isEdit ? "Ubah" : "Simpan" }}</button>
    </form>

    <div style="display: flex; gap: 16px; margin-bottom: 16px">
      <div style="display: flex">
        <div>Search:</div>
        <input v-model="search" type="text" placeholder="search" />
      </div>

      <div style="display: flex">
        <div>Sort:</div>
        <select v-model="sort" name="" id="">
          <option value="" disabled>Urutkan</option>
          <option value="ASCENDING">Ascending</option>
          <option value="DESCENDING">Descending</option>
        </select>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>No.</th>
          <th>Name</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody v-if="!isSearchFailed">
        <tr v-for="(list, index) in visibleTodo" :key="'list' + index">
          <td>{{ index + 1 }}.</td>
          <td>{{ list.name }}</td>
          <td>
            <button @click.prevent="onUpdate(list)">edit</button>
            <button @click.prevent="onDelete(list.id)">delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="isSearchFailed">pencarian tidak ditemukan</div>

    <div v-if="totalPages() > 0 && !isSearchFailed" style="margin-top: 16px">
      <span
        v-if="showPreviousLink()"
        class="pagination-btn"
        style="cursor: pointer"
        @click="updatePage($store.state.page - 1)"
      >
        {{ "<" }}
      </span>
      {{ $store.state.page + 1 }} of
      {{ searchList.length > 0 ? totalSearchPages() : totalPages() }}
      <span
        v-if="showNextLink()"
        class="pagination-btn"
        style="cursor: pointer"
        @click="updatePage($store.state.page + 1)"
      >
        >
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",

  data() {
    return {
      id: 0,
      name: "",
      isEdit: false,
      editValue: null,
      sort: "",
      search: "",
    };
  },

  watch: {
    sort(n) {
      this.$store.dispatch("onSort", n);
    },

    search() {
      this.$store.commit("onSearch", this.search);
      this.$store.dispatch("updateVisibleTodos");
    },
  },

  computed: {
    isSearchFailed() {
      return this.$store.state.isSearch && this.searchList.length < 1;
    },

    storelists() {
      return this.$store.state.lists;
    },

    searchList() {
      return this.$store.state.searchList;
    },

    visibleTodo() {
      return this.$store.state.visibleTodo;
    },
  },

  mounted() {
    this.updateVisibleTodos();
  },

  methods: {
    totalPages() {
      return Math.ceil(this.storelists.length / this.$store.state.pageSize);
    },

    totalSearchPages() {
      return Math.ceil(this.searchList.length / this.$store.state.pageSize);
    },

    updateVisibleTodos() {
      this.$store.dispatch("updateVisibleTodos");
    },

    onChangePage(pageOfItems) {
      this.$store.commit("onChangePage", pageOfItems);
    },

    onSubmit() {
      if (!this.isEdit) {
        const { id, name } = this;
        this.$store.commit("onAdd", { id, name });
        this.$store.dispatch("updateVisibleTodos");

        this.name = "";
        this.id++;
      } else {
        this.editValue = { id: this.editValue.id, name: this.name };

        this.$store.dispatch("onEdit", this.editValue);
        // this.$store.dispatch("updateVisibleTodos");

        this.isEdit = false;
        this.name = "";
      }
    },

    onDelete(id) {
      this.$store.commit("onDelete", id);
      this.$store.dispatch("updateVisibleTodos");
    },

    onUpdate(item) {
      this.isEdit = true;
      this.editValue = item;
      this.name = item.name;
      this.$store.dispatch("updateVisibleTodos");
    },

    updatePage(item) {
      this.$store.dispatch("updatePage", item);
    },

    showPreviousLink() {
      return this.$store.state.page === 0 ? false : true;
    },
    showNextLink() {
      return this.$store.state.page ===
        (this.searchList.length > 0
          ? this.totalSearchPages()
          : this.totalPages()) -
          1
        ? false
        : true;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
