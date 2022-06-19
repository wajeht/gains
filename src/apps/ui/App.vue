<template>
  <div v-for="item in todos" :key="item.id">
    <div id="todo-item">
      <p>{{ item.name }}</p>
      <button @click="deleteTodo(item.id)">🗑</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
    addTodo() {},
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
</style>
