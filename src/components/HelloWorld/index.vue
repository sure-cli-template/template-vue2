<template>
  <div style="text-align: center">
    <p>{{ count }}</p>
    <el-button @click="addCount">点我+1</el-button>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'HelloWorld',
  setup() {
    const count = ref(0);

    const addCount = () => {
      count.value = count.value + 1;
    };

    return {
      count,
      addCount
    };
  }
};
</script>

<style src="./style.scss" lang="scss" scoped />
