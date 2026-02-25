import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')

// 1.引入Elemnet Plus 及其样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入中文语言包
import  zhCn  from 'element-plus/es/locale/lang/zh-cn'

// 2.引入图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 3.引入 Router 和 Pinia（稍后创建）
import router from './router'
import { createPinia } from 'pinia'

const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)){
    app.component(key, component)
}

app.use(ElementPlus, { locale: zhCn }) // 使用中文
app.use(createPinia())
app.use(router)

app.mount('#app')