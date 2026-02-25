import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Layout from '../layout/index.vue'

// 定义角色常量，方便管理
const ROLES = {
  ADMIN: 'admin', // 店长/执行店长 (全权限)
  TUTOR: 'tutor'  // 伴学师 (部分权限)
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/index.vue'),
    meta: { hidden: true }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/dashboard/index.vue'),
        // 所有人都能看首页
        meta: { title: '首页', icon: 'House', roles: [ROLES.ADMIN, ROLES.TUTOR] }
      }
    ]
  },
  // --- 员工管理 (仅店长) ---
  {
    path: '/staff',
    component: Layout,
    meta: { title: '员工管理', icon: 'Briefcase', roles: [ROLES.ADMIN] }, // ❌ 伴学师不可见
    children: [
      { path: 'list', component: () => import('../views/staff/index.vue'), meta: { title: '员工列表' } },
      { path: 'schedule', component: () => import('../views/staff/index.vue'), meta: { title: '排班表' } },
      { path: 'report', component: () => import('../views/staff/index.vue'), meta: { title: '工作日报' } }
    ]
  },
  // --- 会员管理 (所有人) ---
  {
    path: '/student',
    component: Layout,
    meta: { title: '会员管理', icon: 'User', roles: [ROLES.ADMIN, ROLES.TUTOR] },
    children: [
      { path: 'list', component: () => import('../views/student/index.vue'), meta: { title: '会员列表' } },
      { path: 'order', component: () => import('../views/student/index.vue'), meta: { title: '订单列表' } },
      { path: 'refund-query', component: () => import('../views/student/index.vue'), meta: { title: '会员退费查询' } },
      { path: 'refund-approval', component: () => import('../views/student/index.vue'), meta: { title: '退费审批' } },
      { 
        path: 'detail/:id', 
        name: 'StudentDetail',
        component: () => import('../views/student/detail.vue'),
        meta: { title: '会员档案', hidden: true }
      }
    ]
  },
// --- 服务管理 (所有人) ---
  {
    path: '/service',
    component: Layout,
    meta: { title: '服务管理', icon: 'Reading', roles: [ROLES.ADMIN, ROLES.TUTOR] },
    children: [
      // ★ 确保这两行指向 assessment.vue 和 plan.vue
      { path: 'assessment', component: () => import('../views/service/assessment.vue'), meta: { title: '智学评测' } },
      { path: 'plan', component: () => import('../views/service/plan.vue'), meta: { title: '学习规划' } },
      
      { path: 'print', component: () => import('../views/service/print.vue'), meta: { title: '打印任务' } },
      { path: 'correction', component: () => import('../views/service/correction.vue'), meta: { title: '自主批改申请' } },
      { path: 'workbench', component: () => import('../views/service/workbench.vue'), meta: { title: '学习记录-工作台' } },
      { path: 'record-total', component: () => import('../views/service/record_total.vue'), meta: { title: '学习记录-累计' } },
      { path: 'feedback', component: () => import('../views/service/feedback.vue'), meta: { title: '学习反馈' } },
      { path: 'wrong-question', component: () => import('../views/service/wrong_question.vue'), meta: { title: '错题打印' } }
    ]
  },
  // --- 考勤管理 (仅店长) ---
  {
    path: '/attendance',
    component: Layout,
    meta: { title: '考勤管理', icon: 'AlarmClock', roles: [ROLES.ADMIN] }, // ❌ 伴学师不可见
    children: [
      { path: 'member', component: () => import('../views/dashboard/index.vue'), meta: { title: '会员考勤' } },
      { path: 'staff', component: () => import('../views/dashboard/index.vue'), meta: { title: '员工考勤' } }
    ]
  },
  // --- 资料下载 (所有人) ---
  {
    path: '/download',
    component: Layout,
    meta: { title: '资料下载', icon: 'Download', roles: [ROLES.ADMIN, ROLES.TUTOR] },
    children: [
      { path: 'syllabus', component: () => import('../views/download/index.vue'), meta: { title: '课程大纲' } },
      { path: 'paper', component: () => import('../views/download/index.vue'), meta: { title: '原卷下载', tag: '免费', tagType: 'success' } },
      { path: 'compose', component: () => import('../views/download/index.vue'), meta: { title: '智学组卷', tag: '付费', tagType: 'danger' } }
    ]
  },
  // --- 数据统计 (仅店长 - 敏感数据) ---
  {
    path: '/statistics',
    component: Layout,
    meta: { title: '数据统计', icon: 'PieChart', roles: [ROLES.ADMIN] }, // ❌ 伴学师不可见
    children: [
      { path: 'member-active', component: () => import('../views/dashboard/index.vue'), meta: { title: '在读会员统计' } },
      { path: 'duration', component: () => import('../views/dashboard/index.vue'), meta: { title: '学习时长统计' } },
      { path: 'service-data', component: () => import('../views/dashboard/index.vue'), meta: { title: '服务数据统计' } },
      { path: 'tutor-active', component: () => import('../views/dashboard/index.vue'), meta: { title: '伴学师在读数据' } },
      { path: 'tutor-service', component: () => import('../views/dashboard/index.vue'), meta: { title: '伴学师服务数据' } }
    ]
  },
  // --- 运营管理 (仅店长) ---
  {
    path: '/operation',
    component: Layout,
    meta: { title: '运营管理', icon: 'Promotion', roles: [ROLES.ADMIN] }, // ❌ 伴学师不可见
    children: [
      { path: 'points', component: () => import('../views/dashboard/index.vue'), meta: { title: '积分管理' } },
      { path: 'banner', component: () => import('../views/dashboard/index.vue'), meta: { title: '轮播图管理' } },
      { path: 'activity', component: () => import('../views/dashboard/index.vue'), meta: { title: '活动管理' } },
      { path: 'danmaku', component: () => import('../views/dashboard/index.vue'), meta: { title: '弹幕管理' } },
      { path: 'message', component: () => import('../views/dashboard/index.vue'), meta: { title: '留言' } },
      { path: 'notice', component: () => import('../views/dashboard/index.vue'), meta: { title: '通知' } }
    ]
  },
  // --- 系统设置 (仅店长) ---
  {
    path: '/setting',
    component: Layout,
    meta: { title: '系统设置', icon: 'Setting', roles: [ROLES.ADMIN] }, // ❌ 伴学师不可见
    children: [
      { path: 'index', component: () => import('../views/dashboard/index.vue'), meta: { title: '系统设置' } }
    ]
  },
  // --- 本店资源 (所有人) ---
  {
    path: '/resource',
    component: Layout,
    meta: { title: '本店资源', icon: 'School', roles: [ROLES.ADMIN, ROLES.TUTOR] },
    children: [
      { path: 'list', component: () => import('../views/dashboard/index.vue'), meta: { title: '资源列表' } }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router