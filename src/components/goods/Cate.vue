<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 表格区 使用插件 vue-table-with-tree-grid-->
            <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false">
                <!-- 使用 slot 来找到模板名称 是否有效模板-->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success"  v-if="scope.row.cat_deleted === false" style="color:lightgreen"></i>
                    <i class="el-icon-error" v-else  style="color:red"></i>
                </template>
                <!-- 排序模板 -->
                <template slot="order" slot-scope="scope">
                    <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.cat_level == 1">二级</el-tag>
                    <el-tag type="warning" v-else>三级</el-tag>
                </template>
                <!-- 操作模板 -->
                <template slot="operating">
                    <el-button type="primary" icon="el-icon-edit">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete">删除</el-button>
                </template>
            </tree-table>
            <!-- 分页 -->
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
        <!-- 分类对话框 -->
        <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="50%" @close="addCateDialogClosed">
        <!-- 添加分类的表单对话框 -->
        <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
            <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
            <!-- options 指定数据源  props 指定配置对象-->
            <el-form-item label="父级分类">
                <el-cascader
                v-model="selectedKeys"
                :options="parentCateList"
                expandTrigger='hover'
                :props="cascaderProps"
                @change="parentCateChanged" clearable change-on-select>
                </el-cascader>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 商品分类数据
            cateList:[],
            // 定义请求数据的参数
            queryInfo:{
                type:3,
                // 当前页码值
                pagenum:1,
                // 当前页数据数量
                pagesize:5
            },
            // 总数据条数
            total:0,
            // 指定表格列的定义
            columns:[{
                label:'分类名称',
                prop: 'cat_name',
            },{
                label: '是否有效',
                // 表示当前列是模板列
                type: 'template',
                // 表示当前模板列的名称是 isok
                template: 'isok',
            },{
                label: '排序',
                // 表示当前列是模板列
                type: 'template',
                // 表示当前模板列的名称是 order
                template: 'order',
            },{
                label: '操作',
                // 表示当前列是模板列
                type: 'template',
                // 表示当前模板列的名称是 order
                template: 'operating',
            }],
            // 商品分类对话框的显示隐藏
            addCateDialogVisible:false,
            // 添加商品分类的表单
            addCateForm:{
                // 分类名称
                cat_name:'',
                // 分类父 ID
                cat_pid:0,
                // 分类层级  默认要添加的等级是一级
                cat_level:0
            },
            // 添加商品分类的表单规则
            addCateFormRules:{
                cat_name:[
                    {required:true,message:'请输入分类的名称',trigger:'blur'}
                ]
            },
            // 父级分类列表信息
            parentCateList:[],
            // 定义级联选择器的配置对象
            cascaderProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            // 选中父级分类的id数组
            selectedKeys:[]
        }
    },
    created() {
        this.getcateList()
    },
    methods:{
        // 获取商品分类数据
        async getcateList() {
            const {data:res} = await this.$http.get('categories',{params:this.queryInfo})
            if (res.meta.status !==200) return this.$message.error('获取商品信息失败')
            // 为商品分类数据赋值
            this.cateList = res.data.result
            // 为总数据条数赋值
            this.total = res.data.total
        },
        // 监听最新的当前页数据数量 pagesize 的改变
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            // 重复请求数据
            this.getcateList()
        },
        // 监听最新的当前页码 pagenum 的改变
        handleCurrentChange(newNum) {
            this.queryInfo.pagenum = newNum
            // 重复请求数据
            this.getcateList()
        },
        // 点击按钮展示添加商品分类对话框
        showAddCateDialog() {
            // 先获取父级分类列表
            this.getParentCateList()
            // 再展示对话框
            this.addCateDialogVisible = true
        },
        // 获取父级分类的数据列表
        async getParentCateList() {
            const {data:res} = await this.$http.get('categories',{params:{type:2}})
            if (res.meta.status !==200) return this.$message.error('获取分类信息失败')
            this.parentCateList = res.data
        },
        // 选择项变化触发事件
        parentCateChanged() {
            // 判断 selectedKeys.length 长度是0表示没有选择父级分类 反之表示选择了父级分类
            if (this.selectedKeys.length > 0 ) {
                // 父级分类的id
                this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
                // 分类商品的等级和 selectedKeys.length 一致
                this.addCateForm.cat_level = this.selectedKeys.length
                return
            // 如果 this.selectedKeys.length 是0 那就让父级分类id和等级都是0
            }else{
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0 
            }
        },
        addCate() {
            this.$refs.addCateFormRef.validate(async valid=>{
                if (!valid) return
                const {data:res} = await this.$http.post('categories',this.addCateForm)
                if (res.meta.status !==201) return this.$message.error('添加商品分类失败')
                this.$message.success('添加商品分类成功')
            })
            this.getcateList()
            this.addCateDialogVisible = false
        },
        // 监听添加分类对话框关闭事件
        addCateDialogClosed() {
            this.$refs.addCateFormRef.resetFields()
            this.selectedKeys = []
            this.addCateForm.cat_pid = 0
            this.addCateForm.cat_level = 0 
        }
    }

}
</script>

<style lang="less" scoped>
.el-button {
    margin: 20px;
}
.el-pagination {
    margin-top: 20px;
}
.el-cascader {
    width: 100%;
}
</style>