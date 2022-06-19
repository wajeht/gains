<template>
  <div id="new-task">
    <input id="addToDoBox" type="text" v-model="todoItem" />
    <button @click="addTodo(todoItem)" id="addToDoButton">ENTER NEW TASK</button>
  </div>
  <div v-for="item in todos" :key="item.id">
    <div id="todo-item">
      <div id="item">
        <p id="id">{{ item.id }}</p>
        <p>{{ item.name }}</p>
      </div>

      <button @click="deleteTodo(item.id)">🗑</button>
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
        },
        {
          id: 2,
          name: 'shower',
          isDone: false,
        },
        {
          id: 4,
          name: 'eat',
          isDone: true,
        },
      ],
    };
  },
  methods: {
    addTodo(todoItem) {
      lightbluethis.todos.push({
        id: Math.random(),
        name: todoItem,
        isDone: false,
      });
    },
    deleteTodo(given_id) {
      this.todos = this.todos.filter((item) => item.id != given_id);
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
#id {
  margin-right: 10px;
}
#addToDoBox {
  background-color: lightblue;
}
#addToDoButton {
  background-color: rgb(32, 150, 77);
}
</style>
