<template>
  <div id="todos" class="p-3">
    <!-- add todo container -->
    <div class="input-group shadow-sm mb-3">
      <!-- input -->
      <input v-model="todoItem" type="text" class="form-control" />

      <!-- add -->
      <button @click="addTodo(todoItem)" class="btn btn-sm btn-primary">
        <font-awesome-icon icon="plus" />
        Add
      </button>

      <!-- clear -->
      <button class="btn btn-sm btn-danger" @click="clearAll()">
        <font-awesome-icon icon="trash" />
        Clear
      </button>
    </div>

    <!-- todo array container -->
    <div v-for="item in todos" :key="item.id" class="mb-3">
      <!-- individual todo -->
      <div class="card card-body shadow-sm d-flex flex-row justify-content-between align-items-center">
        <!-- name and id -->
        <div class="d-flex gap-2">
          <span id="id">{{ item.id }}</span>
          <span id="taskName">>{{ item.name }}</span>
          <p :class="[`obj-${item.isDone}`]">COMPLETE:{{ item.isDone }}</p>
          <span>{{ item.modifiedDate }}</span>
        </div>

        <!-- mark done button taskName-->
        <button class="btn btn-sm btn-success" @click="completeToDo(item.id)">
          <font-awesome-icon icon="bug" />
          Mark Done
        </button>

        <!-- delete button -->
        <button class="btn btn-sm btn-danger" @click="deleteTodo(item.id)">
          <font-awesome-icon icon="trash" />
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      todoItem: '',
      todos: [
        {
          id: 1,
          name: 'walk the dog',
          isDone: false,
          postedDate: '6/21/2022, 7:17:06 PM',
          modifiedDate: '6/21/2022, 7:17:06 PM',
        },
        {
          id: 2,
          name: 'shower',
          isDone: false,
          postedDate: '6/21/2022, 7:17:06 PM',
          modifiedDate: '6/21/2022, 7:17:06 PM',
        },
        {
          id: 4,
          name: 'eat',
          isDone: true,
          postedDate: '6/21/2022, 7:17:06 PM',
          modifiedDate: '6/21/2022, 7:17:06 PM',
        },
      ],
    };
  },
  methods: {
    addTodo(todoItem) {
      this.todos.push({
        id: Math.floor(Math.random() * 999999999999),
        name: todoItem,
        isDone: false,
        postedDate: new Date().toLocaleString('en-US'),
        modifiedDate: new Date().toLocaleString('en-US'),
      });
    },
    deleteTodo(given_id) {
      this.todos = this.todos.filter((item) => item.id != given_id);
    },
    completeToDo(given_id) {
      this.todos[this.todos.findIndex((item) => item.id == given_id)].isDone == true
        ? (this.todos[this.todos.findIndex((item) => item.id == given_id)].isDone = false)
        : (this.todos[this.todos.findIndex((item) => item.id == given_id)].isDone = true);
      this.todos[this.todos.findIndex((item) => item.id == given_id)].modifiedDate = new Date().toLocaleString('en-US');
    },
    clearAll() {
      this.todos = [];
    },
  },
};
</script>

<style>
#todo-item {
  display: flex;
  justify-content: space-between;

  color: white;
  background: gray;
  padding: 10px;
  border-radius: 5px;
  margin-top: 5px;
}
#item {
  display: flex;
}
#taskName {
  margin-right: 10px;
}
#id {
  margin-right: 10px;
}
.obj-false {
  background-color: red;
}
.obj-true {
  background-color: rgb(35, 216, 29);
  margin-left: 100px;
}
#addToDoBox {
  background-color: lightblue;
}
#addToDoButton {
  background-color: rgb(32, 150, 77);
}
</style>
