<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <el-col :span="8">
                    <!-- 在点击由 clearable 属性生成的清空按钮时触发getGoodsList 重新获取数据 -->
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" @clear="getGoodsList" clearable>
                        <!-- 搜索功能就是调用getGoodsList 参数是双向绑定的queryInfo.query -->
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4" >
                    <el-button type="primary" @click="goAddpage">添加商品</el-button>
                </el-col>
            </el-row>
            <!-- table表格区 -->
            <el-table :data="goodsList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name" ></el-table-column>
                <el-table-column label="商品价格(元)" prop="goods_price" width="120px"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" width="120px"></el-table-column>
                <el-table-column label="创建时间"  width="200px">
                    <!-- 使用作用域插值并且使用过滤器来渲染 -->
                    <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
                </el-table-column>
                <el-table-column label="操作" width="200px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit"></el-button>
                        <el-button type="danger" icon="el-icon-delete" @click="removeById(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页功能 -->
            <el-pagination     
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="this.total" background >
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 商品列表数组
            goodsList:[],
            // 查询参数对象
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:5
            },
            // 商品总数
            total:0
        }
    },
    created() {
        this.getGoodsList()
    },
    methods:{
        // 根据分页来获取对应的商品列表
        async getGoodsList() {
            const {data:res} = await this.$http.get('goods',{params:this.queryInfo})
            if(res.meta.status !==200) return this.$message.error('请求商品数据失败')
            console.log(res.data);
            this.goodsList = res.data.goods
            this.total = res.data.total

        },
        // 监听分页改变返回每页数据条数
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getGoodsList()
        },
        // 监听分页改变返回当前页
        handleCurrentChange(newNum) {
            this.queryInfo.pagenum = newNum
            this.getGoodsList()
        },
        // 根据id删除商品
        async removeById(id) {
            // 先询问用户是否删除商品
            const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)

            if (confirmResult !=='confirm') {
                return this.$message.info('用户取消删除商品')
            }else {
                const {data:res} = await this.$http.delete(`goods/${id}`)
                if (res.meta.status !==200) return this.$message.error('删除商品失败')
                this.$message.success('删除商品成功')
                this.getGoodsList()
            }
        },
        // 添加商品页面使用路由跳转来实现
        goAddpage() {
            this.$router.push('/goods/add')
        }
    }
    
}
</script>

<style lang="less" scoped>
.el-table {
    margin-top: 25px;
}
</style>