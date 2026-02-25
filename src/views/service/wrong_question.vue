<template>
  <div class="service-container">
    <el-card shadow="hover" style="min-height: 500px; display: flex; align-items: center; justify-content: center;">
      <el-empty description="错题打印服务接入中...">
        <el-button type="primary" icon="Printer">连接打印机</el-button>
      </el-empty>
    </el-card>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.service-container { padding: 20px; background-color: #f0f2f5; min-height: calc(100vh - 84px); }
</style>