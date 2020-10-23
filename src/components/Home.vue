<template>
    <div>
       <el-button type="info" @click="outLogin">退出</el-button>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    methods:{
        outLogin() {
            // 清空token并且页面跳转到login
            window.sessionStorage.clear()
            this.$router.push('/login')
        }
    }
}
</script>

<style lang="less" scoped>

</style>