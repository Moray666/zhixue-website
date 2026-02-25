<template>
  <div class="login-container">
    <div class="login-box">
      <h2>智学时光书房</h2>
      <p style="color: white;">(这里是登录表单占位符)</p>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  height: 100vh; /* 全屏高度 */
  width: 100%;
  /* 核心 CSS */
  /* 1. 引入图片，使用 @ 别名指向 src 目录 */
  background-image: url('@/assets/zhixue-logo.png');
  /* 2. 让背景图覆盖整个区域，不重复 */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  
  /* Flex 布局让登录框居中 */
  display: flex;
  justify-content: center;
  align-items: center;

  /* 重要：添加一个伪元素蒙版，让背景变暗，突出前景文字 */
  position: relative;
}

/* 创建深色半透明遮罩层 */
.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* 墨绿色半透明遮罩，与 Logo 色调呼应 */
  background-color: rgba(0, 66, 37, 0.7); 
  /* 或者使用纯黑遮罩： background-color: rgba(0, 0, 0, 0.6); */
  z-index: 1;
}

.login-box {
  /* 确保登录框在遮罩层上面 */
  z-index: 2;
  width: 400px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95); /* 白色背景，轻微透明 */
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  text-align: center;
}

h2 {
  color: #004a2b; /* 使用 Logo 的深绿色 */
  margin-bottom: 20px;
}
</style>