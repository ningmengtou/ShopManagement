<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图区 -->
    <el-card>
      <!-- 搜索和添加区 -->
      <!-- 使用栅格布局来定义搜索和添加框的宽度 el-row表示一行24列 el-col表示有几列 span属性就是几列 -->
      <el-row>
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear='getUserList'>
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4" :offset="13">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <el-table :data="userList" border stripe style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名" ></el-table-column>
        <el-table-column prop="email" label="邮箱" ></el-table-column>
        <el-table-column prop="mobile" label="电话" ></el-table-column>
        <el-table-column prop="role_name" label="角色" ></el-table-column>
        <!-- 这里使用作用域插槽 scope.row可以获取到数据-->id
        <el-table-column label="状态" >
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStatuchanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column  label="操作" >
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
            <el-tooltip  content="角色分配" effect="dark" placement="top" :enterable='false'>
              <el-button type="warning" icon="el-icon-setting"></el-button>
            </el-tooltip>
            <el-button type="danger" icon="el-icon-delete" @click="removeUserById(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
      <!-- 添加用户对话框区域 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"  @close="addDialogClosed">
      <!-- 内容主题区 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%" @close="editDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="70px" >
        <el-form-item label="用户名" >
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义邮箱的规则 rule:规则 value:要验证的值 cb:验证成功后调用函数
    var checkEmail = (rule,value,cb)=>{
        const regEmail  = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        // 验证成功就调用回调函数
        if (regEmail.test(value)) return cb()
        // 验证失败调用失败信息
        cb(new Error('请输入合法的邮箱'))
    }
    // 自定义手机号的规则
    var checkMobile = (rule,value,cb)=>{
        const regMobile = /^1[3|4|5|7|8][0-9]{9}$/
        if (regMobile.test(value)) return cb()
        cb(new Error('请输出合法的手机号'))
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        // 搜索关键字
        query: '',
        // 当前的页数
        pagenum: 1,
        // 每页显示多少条数据
        pagesize: 5,
      },
      userList: [],
      total: 0,
      // 添加用户对话框的显示隐藏
      addDialogVisible:false,
      // 修改用户对话框的显示隐藏
      editDialogVisible:false,
      // 添加用户的表单数据
      addForm:{
        username:'',
        email:'',
        password:'',
        mobile:''
      },
      // 添加用户的表单校验规则
      addFormRules:{
        username:[
              { required: true, message: '请输入用户名', trigger: 'blur' },
              { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password:[
              { required: true, message: '请输入密码', trigger: 'blur' },
              { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email:[
              { required: true, message: '请输入邮箱', trigger: 'blur' },
              // validator 指定自定义的验证规则
              { validator:checkEmail, trigger: 'blur'}
        ],
        mobile:[
              { required: true, message: '请输入电话', trigger: 'blur' },
              { validator:checkMobile, trigger: 'blur'}
        ]
      },
      // 查询到的用户信息对象
      editForm:{}

    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      // get请求参数需要使用 params
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo,
      })
      if (res.meta.status != 200) return this.$message.error('用户列表获取失败')
      // 获取成功需要把数据重新赋值给到data属性中
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 监听页数改变
    handleSizeChange(newSize) {    
      // 把最新的值赋值到data属性中的值
      this.queryInfo.pagesize = newSize
      // 赋值完还需要重新获取数据
      this.getUserList()
    },
    // 监听页码改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听swifch开关的更改状态
    async userStatuchanged(userinfo) {
      // 发送请求 括号中的参数使用模板字符串
      const {data:res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !=200) {
        // 更新失败的话需要把userinfo.mg_state取反  这样页面渲染才会和数据库一致
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    // 监听添加用户表单是否关闭
    addDialogClosed() {
      // 让表单内容重置
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮,提交表单
    addUser() {
      // 对表单提交进行预验证 valid是布尔值
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 验证成功发起添加用户的请求
        const {data:res} = await this.$http.post('users',this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败')
        this.$message.success('添加用户成功')
      })
      // 隐藏对话框
      this.addDialogVisible = false
      // 重新获取用户列表数据
      this.getUserList()
    },
    // 修改用户信息对话框
    async showEditDialog(id) {
      // 利用参数id发送请求
      const {data:res} = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) return this.$message.error('用户信息加载失败')
      // 把请求参数赋值给到editForm
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听修改用户对话框事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 提交修改用户的表单并提交
    editUser() {
      this.$refs.editFormRef.validate(async valid=>{
        if (!valid) return this.$message.error('修改的信息不合法')
        // 验证成功后再发送请求
        const {data:res} = await this.$http.put(`users/${this.editForm.id}`,this.editForm)
        if (res.meta.status !== 200) return this.$message.error('修改用户信息失败')
        this.$message.success('修改用户信息成功')
      })
      this.editDialogVisible = false
      this.getUserList()
    },
    // 删除指定用户信息
    async removeUserById(id) {
      // 弹框询问用户是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        // 点击确定返回 confirm 字符串 点击取消返回 cancel 字符串
        console.log(confirmResult);
      // 根据confirmResult的返回值来判断用户需不需要删除信息
      if (confirmResult == 'confirm') {
        const {data:res} = await this.$http.delete(`users/${id}`)
        if (res.meta.status !==200) return this.$message.error('删除用户失败')
        this.$message.success('删除用户成功')
      }else if (confirmResult == 'cancel') {
        this.$message.info('已取消删除操作')
      }
      this.getUserList()
    }
  },
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  padding-bottom: 15px;
}
.el-card {
  line-height: 70px;
}
.el-table {
  margin-top: 20px;
  font-size: 12px;
}
.el-pagination {
  margin-top: 20px;
}


</style>