<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 登录表单区 ref的引用就可以获取到表单的实例对象-->
            <el-form  ref="loginFormRef" label-width="0px" class="input_box" :model="form" :rules="loginFormRules">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input  prefix-icon="el-icon-user-solid" v-model="form.username"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input  prefix-icon="el-icon-goods" v-model="form.password" type="password"></el-input>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item class="btns" >
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script> 
export default {
    data() {
        return {
            // 这是表单的数据绑定对象
            form: {
                username:'admin',
                password:'123456',
            },
            // 这是表单的验证规则
            loginFormRules:{
                username:[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        // 点击重置按钮 重置表单
        resetLoginForm() {
            // this.$refs 可以找到自定义的ref引用  resetFields() 就是表单重置方法
            this.$refs.loginFormRef.resetFields();
        },
        login() {
            // validate() 可以实现表单预验证是promise对象 返回值为boolean值
            this.$refs.loginFormRef.validate(async valid =>{
                // !valid 表示预验证失败 直接 return 不执行下面代码
                if (!valid) return;
                // $http 指的就是axios请求 参数是 this.form
                // 返回值使用解构方式提取出data 重命名为res
                const {data:res} =  await this.$http.post('login',this.form);
                // this.$message 用来调用提示框括号内是提示框内容
                if (res.meta.status !== 200 ) return this.$message.error('登录失败')
                this.$message.success('登录成功')
                // 1.将登录成功后的token保存到客户端的sessionsStorage中
                // 1.1项目中除了登录之外的其他API接口，必须在登录之后才能访问
                // 1.2token应该只在当前网站打开期间生效，所有将token保存在sessionStorage中
                window.sessionStorage.setItem('token',res.data.token)
                // 2.通过编程式导航跳转到后台主页中，路由地址是 /home 
                this.$router.push('/home')
            })
        }
    }
}
</script>

<style lang="less" scoped>
.login_container {
    background-color: #2b4b6b;
    height: 100%;
}

.login_box {
    position: absolute;
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 10px;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);

    .avatar_box{
        position: absolute;
        left: 50%;
        border-radius: 50%;
        height: 130px;
        width: 130px;
        transform: translate(-50%,-50%);
        border: 1px solid #eee;
        box-shadow: 0 0 10px #eee;
        padding: 10px;
        background-color: #fff;
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;

        }
    }
}
.input_box {
    position: absolute;
    bottom: 0;
    padding: 0 15px;
    width: 100%;
    box-sizing: border-box;
}

.btns {
    display: flex;
    justify-content: flex-end;
}
    


</style>