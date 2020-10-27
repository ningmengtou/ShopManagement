<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="outLogin">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <!-- 折叠栏 -->
        <div class="toggle_button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区 unique-opened 设置每次只能展开一个菜单 router菜单开启路由模式-->
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened='true'
          :collapse='isCollapse'
          :collapse-transition='false'
          :router='true'
          :default-active='activePath'
        >
          <!-- 一级菜单 循环menusList列表 动态绑定index属性-->
          <el-submenu :index="item.id + ''" :key="item.id"  v-for="item in menusList" >
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 菜单图标 动态绑定字体图标的类名-->
              <i :class="iconsObj[item.id]" class="icons"></i>
              <!-- 菜单文本 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 循环menusList中的children 动态绑定index属性-->
            <el-menu-item :index="'/'+key.path" :key="key.id"  v-for="key in item.children" @click="saveNavState('/'+key.path)">
              <template slot="title">
                <!-- 菜单图标 -->
                <i class="el-icon-menu"></i>
                <!-- 菜单文本 -->
                <span>{{key.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主题区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menusList:[],
      // 定义字体图标对象
      iconsObj:{
        '125':'el-icon-s-custom',
        '103':'el-icon-s-grid',
        '101':'el-icon-s-goods',
        '102':'el-icon-s-order',
        '145':'el-icon-s-marketing'
      },
      // 定义菜单是否折叠 默认false不折叠
      isCollapse:false,
      // 激活的链接地址
      activePath:''
      
    }
  },
  // created 生命周期请求数据
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('status')
  },
  methods: {
    outLogin() {
      // 清空token并且页面跳转到login
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList() {
      // 使用axios请求数据并且使用await接收
      const {data:res} = await this.$http.get('menus')
      // 判断状态码为200 表示数据请求成功 成功就让数据列表替换成menusList
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.menusList = res.data
      
    },
    // 点击切换菜单的折叠
    toggleCollapse() {
      // 折叠状态取反
      this.isCollapse  =  !this.isCollapse
    },
    // 保存链接激活状态到session中 并且重新给activePath赋值
    saveNavState(str) {
      window.sessionStorage.setItem('status',str);
      this.activePath = str
     
    }
  },
 
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #b3c0d1;
  color: #fff;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 10px;
    }
  }
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
  // 折叠栏样式
  .toggle_button {
    font-size: 10px;
    line-height: 30px;
    text-align: center;
    color: #fff;
    background-color: #4A5064;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
  .el-menu {
    border-right: 0;
  }
  .el-menu-item {
    padding: 0;
  }
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: left;
  
}
.icons {
  margin-right: 10px;
}

</style>