<template>
    <div>
    <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片试图 -->
        <el-card>
            <el-table :data="rightsList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="权限名称" prop="authName"></el-table-column>
                <el-table-column label="路径" prop="path"></el-table-column>
                <el-table-column label="权限等级">
                    <template slot-scope="scope">
                        <!-- 使用v-if判断level的值来决定那个等级显示 -->
                        <el-tag v-if="scope.row.level == '0'">一级</el-tag>
                        <el-tag type="success" v-else-if="scope.row.level == '1'">二级</el-tag>
                        <el-tag type="warning" v-else>三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    data () {
        return {
            // 所有的权限列表数据
            rightsList:[],
         
        }
    },
    created() {
        // 执行请求函数获取数据
        this.getRightsList()
    },
    methods:{
        // 请求权限列表数据
        async getRightsList() {
            const {data:res} = await this.$http.get(`rights/list`)
            if (res.meta.status !==200) return this.$message.error('获取权限数据失败')
            this.rightsList = res.data
        }
    }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
    margin-bottom: 20px;
}
</style>