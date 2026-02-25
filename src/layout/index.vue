<template>
  <div class="common-layout">
    <el-container class="layout-container">
      
      <el-aside width="220px" class="aside-menu">
        
        <div class="brand-logo">
          <img :src="LogoImg" alt="logo" class="sidebar-logo" />
          <div v-if="!isCollapse" class="logo-text-box">
            <span class="logo-title">智学时光书房</span>
            <span class="logo-subtitle">ZHIXUE SHIGUANG SHUFANG</span>
          </div>
        </div>

        <el-menu
          router
          :default-active="activeMenu"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
          :collapse="isCollapse"
          :unique-opened="true"
          class="el-menu-vertical"
        >
          <template v-for="route in menuRoutes" :key="route.path">
            
            <el-sub-menu v-if="route.children && route.children.length > 1" :index="route.path">
              <template #title>
                <el-icon v-if="route.meta?.icon">
                  <component :is="route.meta.icon" />
                </el-icon>
                <span>{{ route.meta?.title }}</span>
              </template>
              
              <el-menu-item 
                v-for="child in route.children" 
                :key="child.path" 
                :index="resolvePath(route.path, child.path)"
                v-show="!child.meta?.hidden"
              >
                <span>{{ child.meta?.title }}</span>
                <el-tag 
                  v-if="child.meta?.tag" 
                  :type="child.meta.tagType as any" 
                  size="small" 
                  effect="dark"
                  style="margin-left: 8px; height: 18px; line-height: 16px; padding: 0 4px; border-radius: 2px;"
                >
                  {{ child.meta.tag }}
                </el-tag>
              </el-menu-item>
            </el-sub-menu>

            <el-menu-item 
              v-else 
              :index="resolvePath(route.path, route.children?.[0]?.path ?? '')"
            >
              <el-icon v-if="route.meta?.icon || route.children?.[0]?.meta?.icon">
                <component :is="route.meta?.icon || route.children?.[0]?.meta?.icon" />
              </el-icon>
              <template #title>
                {{ route.meta?.title || route.children?.[0]?.meta?.title }}
              </template>
            </el-menu-item>

          </template>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header class="app-header">
          <div class="header-left">
            <el-breadcrumb separator="/" class="breadcrumb-hide-mobile">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>{{ currentRouteName }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          
          <div class="header-right">
            <el-dropdown trigger="click" @command="handleStoreChange" class="store-dropdown">
              <span class="el-dropdown-link store-link">
                <el-icon class="icon-shop"><component is="School" /></el-icon>
                <span class="store-name">{{ userStore.currentStoreName }}</span>
                <el-icon class="el-icon--right"><component is="ArrowDown" /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu class="store-dropdown-menu">
                  <el-dropdown-item 
                    v-for="store in userStore.storeList" 
                    :key="store.id" 
                    :command="store.id"
                    :class="{ 'is-active-store': store.id === userStore.currentStoreId }"
                  >
                    {{ store.name }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>

            <el-divider direction="vertical" />

            <el-dropdown>
              <span class="el-dropdown-link user-link">
                <el-avatar :size="30" :src="userStore.userInfo.avatar" style="margin-right: 8px;" />
                <div class="user-text">
                  <span class="username">{{ userStore.userInfo.name }}</span>
                  <el-tag v-if="userStore.isSuperAdmin" size="small" type="danger" effect="plain" class="role-tag">最高权限</el-tag>
                  <el-tag v-else size="small" type="info" effect="plain" class="role-tag">伴学师</el-tag>
                </div>
                <el-icon class="el-icon--right"><component is="CaretBottom" /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>个人中心</el-dropdown-item>
                  <el-dropdown-item divided @click="handleToggleRole">
                    <el-icon><component is="Switch" /></el-icon> 切换角色 (测试)
                  </el-dropdown-item>
                  <el-dropdown-item divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <el-main class="app-main">
          <div class="watermark-container">
            <img :src="LogoImg" alt="水印Logo" />
          </div>
          <div class="content-wrapper">
            <router-view v-slot="{ Component }">
              <transition name="fade-transform" mode="out-in">
                <component :is="Component" />
              </transition>
            </router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../store/user'
import { ElMessage } from 'element-plus'

// ★ 新增导入：将图片作为一个模块变量引入，解决 Vite 路径打包找不到的问题
import LogoImg from '../assets/zhixue-logo.png'

const route = useRoute()
const router = useRouter()今日签到
128
const userStore = useUserStore()
const isCollapse = ref(false)

const activeMenu = computed(() => route.path)
const currentRouteName = computed(() => route.meta.title || '当前页面')

const menuRoutes = computed(() => {
  const currentRole = userStore.userInfo.role
  const allRoutes = router.options.routes
  return allRoutes.filter(route => {
    if (route.meta?.hidden) return false
    if (route.meta?.roles) {
      const allowedRoles = route.meta.roles as string[]
      if (!allowedRoles.includes(currentRole)) {
        return false今日签到
128
      }
    }
    return true
  })
})

const resolvePath = (basePath: string, routePath: string) => {
  if (basePath === '/') return '/' + routePath
  return basePath + '/' + routePath
}

const handleStoreChange = (command: number) => {
  userStore.switchStore(command)
  ElMessage.success(`已切换至：${userStore.currentStoreName}`)
}

const handleToggleRole = () => {
  userStore.toggleRole()
  ElMessage.warning(`已切换身份为：${userStore.userInfo.role === 'admin' ? '总店长' : '伴学师'}`)
}
</script>

<style scoped>
.layout-container { height: 100vh; width: 100%; }
.aside-menu { background-color: #304156; color: white; box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35); z-index: 10; transition: width 0.3s; }

/* ========================================== */
/* ★ Logo 区域完美排版样式                    */
/* ========================================== */
.brand-logo { 今日签到
128
  height: 60px; 
  display: flex; 
  align-items: center; 
  justify-content: center; /* 整体居中 */
  background-color: #2b2f3a; 
  overflow: hidden; 
  padding: 0 10px;
}

/* 左侧图形 Logo */
.sidebar-logo {
  width: 32px;
  height: 32px;
  object-fit: contain; /* 保证图形不变形 */
}

/* 右侧文字容器 (上下排列) */
.logo-text-box {
  display: flex;
  flex-direction: column; /* 让文字上下排列 */
  justify-content: center;
  margin-left: 10px; /* 图形和文字的间距 */
  white-space: nowrap; /* 防止文字换行 */
}

/* 上方中文大标题 */
.logo-title {
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 1px; /* 稍微加点字间距显得高级 */
  line-height: 1.1;
}

/* 下方拼音/英文副标题 */
.logo-subtitle {
  color: #a3a6ad; /* 浅灰色，拉开视觉层次 */
  font-size: 9px; /* 极小字体 */
  margin-top: 3px; /* 和主标题的间距 */
  letter-spacing: 0.5px;
  font-family: Arial, Helvetica, sans-serif; /* 无衬线英文字体更整洁 */
}
/* ========================================== */


/* 其他原有样式保持不变 */
.el-menu-vertical { border-right: none; }
.app-header { background-color: #fff; height: 60px; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08); z-index: 9; }
.header-right { display: flex; align-items: center; }
.store-dropdown { cursor: pointer; margin-right: 15px; }
.store-link { display: flex; align-items: center; font-size: 15px; color: #303133; font-weight: 500; padding: 5px 10px; border-radius: 4px; transition: background 0.3s; }
.store-link:hover { background-color: #f5f7fa; }
.store-name { margin: 0 8px; max-width: 240px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.icon-shop { font-size: 18px; color: #409EFF; }
.is-active-store { color: #409EFF; background-color: #ecf5ff; font-weight: bold; }
.store-dropdown-menu { max-height: 400px; overflow-y: auto; }
.user-link { display: flex; align-items: center; cursor: pointer; }
.user-text { display: flex; flex-direction: column; line-height: 1.2; margin-right: 5px; text-align: right; }
.username { font-size: 14px; font-weight: 500; color: #303133; }
.role-tag { transform: scale(0.85); transform-origin: right center; margin-top: 2px; }
.app-main { position: relative; background-color: #f0f2f5; padding: 20px; overflow: hidden; }
.watermark-container { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 0; pointer-events: none; width: 500px; opacity: 0.1; }
.watermark-container img { width: 100%; display: block; }
.content-wrapper { position: relative; z-index: 1; height: 100%; }
.fade-transform-enter-active, .fade-transform-leave-active { transition: opacity 0.3s; }
.fade-transform-enter-from, .fade-transform-leave-to { opacity: 0; }
@media (max-width: 768px) { .breadcrumb-hide-mobile { display: none; } .store-name { max-width: 120px; } }
</style>