import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 1. 当前用户信息
  const userInfo = ref({
    name: '马方旭',
    // 默认角色: admin (拥有所有权限)
    role: 'admin', 
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
  })

  // 2. 门店列表数据
  const storeList = ref([
    { id: 101, name: '聊城智学自习室 (实验店)' },
    { id: 102, name: '聊城高唐智学自习室 (高唐一中店)' },
    { id: 103, name: '聊城市东昌府区智学时光书房 (七中店)' },
    { id: 104, name: '聊城市东昌府区智学自习室 (文轩店)' },
    { id: 105, name: '聊城市智学时光书房 (二中店)' },
    { id: 106, name: '聊城市智学时光书房 (东昌中学店)' },
    { id: 107, name: '聊城市智学时光书房 (旅游度假区店)' },
    { id: 108, name: '聊城智学时光书房 (开发区店)' },
    { id: 109, name: '聊城市东昌府区智学时光书房 (九中校区)' },
    { id: 110, name: '聊城市东昌府区智学时光书房 (六中校区)' },
    { id: 111, name: '聊城智学拾光书房(湖西店)' },
    { id: 112, name: '聊城智学时光自习室(老一中店)' }, // 默认选中
    { id: 113, name: '山东聊城智学时光书房 (郑家)' },
    { id: 114, name: '聊城市东昌府区智学时光书房(第一实验店)' },
    { id: 115, name: '聊城市东昌府区智学时光书房(三中店)' },
    { id: 116, name: '聊城市东昌府区智学时光书房(新一中店)' },
    { id: 117, name: '聊城茌平智学自习室 (茌平一中店)' },
    { id: 118, name: '聊城莘县智学自习室' },
    { id: 119, name: '聊城临清智学自习室 (临清一中店)' },
    { id: 120, name: '山东聊城智学时光书房(北城店)' },
    { id: 121, name: '山东聊城智学拾光书房(阳谷店)' },
    { id: 122, name: '聊城东昌府区智学时光书房(五中店)' },
    { id: 123, name: '聊城开发区智学时光书房(东昌东店)' }
  ])

  // 3. 当前选中的门店
  const currentStoreId = ref(112)

  // --- Getters (计算属性) ---
  const currentStoreName = computed(() => {
    const store = storeList.value.find(s => s.id === currentStoreId.value)
    return store ? store.name : '未选择门店'
  })

  // 判断是否是最高权限
  const isSuperAdmin = computed(() => userInfo.value.role === 'admin')

  // --- Actions (操作方法) ---
  function switchStore(id: number) {
    currentStoreId.value = id
  }

  // ★ 核心功能：切换角色 (用于测试权限控制)
  function toggleRole() {
    if (userInfo.value.role === 'admin') {
      userInfo.value.role = 'tutor'
      userInfo.value.name = '普通伴学师'
    } else {
      userInfo.value.role = 'admin'
      userInfo.value.name = '马方旭'
    }
    // 为了确保菜单立刻刷新，这里做一个简单的重载或触发响应
    // 由于 menuRoutes 是 computed，只要 userInfo.role 变了，菜单会自动变
    // 但为了保险起见，或者如果你的路由是静态生成的，可能需要刷新页面
    // 这里我们依赖 computed 的自动响应
  }

  return {
    userInfo,
    storeList,
    currentStoreId,
    currentStoreName,
    isSuperAdmin,
    switchStore,
    toggleRole
  }
})