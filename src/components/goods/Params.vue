<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视区 -->
        <el-card>
            <!-- 警示框 -->
            <el-row>
                <el-col>
                    <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>
                </el-col>
            </el-row>
            <!-- 选择商品分类区 -->
            <el-row class="cat-top">
                <el-col>
                    <span>选择商品分类：</span>
                    <!-- 选择商品分类的级联选择框 -->
                    <el-cascader
                    v-model="selectedCateKeys"
                    :options="cateList"
                    expandTrigger='hover'
                    :props="cateProps"
                    @change="handleChange">
                    </el-cascader>
                </el-col>
            </el-row>
            <!-- tab页签区 -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <!-- 添加动态参数面板 -->
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" :disabled='isBtnDisabled' @click="addDialogVisible = true">添加参数</el-button>
                    <!-- 动态数据表格 -->
                    <el-table :data="manyTabData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope"> 
                                <!-- 循环每一个attr_vals属性 -->
                                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="item.i" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
                                <!-- 输入文本框 -->
                                <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <!-- 添加的按钮 -->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作" >
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">修改</el-button>
                                <el-button type="danger" icon="el-icon-delete" @click="deleteAttr(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!-- 添加静态属性面板 -->
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" :disabled='isBtnDisabled' @click="addDialogVisible = true">添加属性</el-button>
                    <!-- 静态属性表格 -->
                    <el-table :data="onlyTabData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope"> 
                                <!-- 循环每一个attr_vals属性 -->
                                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="item.i" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
                                <!-- 输入文本框 -->
                                <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <!-- 添加的按钮 -->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作" >
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">修改</el-button>
                                <el-button type="danger" icon="el-icon-delete" @click="deleteAttr(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
            
        </el-card>
        <!-- 添加参数对话框 -->
            <el-dialog
            :title="'添加'+titleText"
            :visible.sync="addDialogVisible"
            width="50%" @close="dialogClosed">
            <!-- 验证的表单 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
            </el-dialog>

        <!-- 修改参数对话框 -->
            <el-dialog
            :title="'修改'+titleText"
            :visible.sync="editDialogVisible"
            width="50%" @close="editdialogClosed">
            <!-- 验证的表单 -->
            <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
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
            // 级联选择框的配置对象
            cateProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            // 级联选择框双向绑定到的数组
            selectedCateKeys:[],
            // 被激活的页签名称
            activeName:'many',
            // 动态参数数据
            manyTabData:[],
            // 静态属性数据
            onlyTabData:[],
            // 添加参数对话框的显示隐藏
            addDialogVisible:false,
            // 修改参数对话框的显示隐藏
            editDialogVisible:false,
            // 添加表单的值
            addForm:{
                attr_name:''
            },
            // 修改表单的值
            editForm:{
                attr_name:''
            },
            // 添加商品分类的表单验证规则
            addFormRules:{
                attr_name:[{required:true,message:'请输入要添加的参数或者属性',trigger:'blur'}]
            },
            // 要修改的参数id
            attr_id:'',
        }
    },
    created() {
        this.getCateList()
    },
    methods:{
        // 获取所有的商品分类列表
        async getCateList() {
            const {data:res} = await this.$http.get('categories')
            if (res.meta.status !==200) return this.$message.error('获取商品分类信息失败')
            this.cateList = res.data
        },
        // 级联选择框选中项变化会触发这个函数
        handleChange() {
            // 调用getParamsData函数
            this.getParamsData()

        },
        // tab页被点击时触发事件
        handleTabClick() {
            // 调用getParamsData函数
            this.getParamsData()
        },
        // 获取参数的列表数据
        async getParamsData() {
            // 对双向绑定数组selectedCateKeys长度判断 长度不是三则不是选则三级分类
            if (this.selectedCateKeys.length !==3) {
                // 清空数组 并且 return 
                this.selectedCateKeys = []
                // 同时清空manyTabData和onlyTabData 没有选择分类就不能查询到数据
                this.manyTabData = []
                this.onlyTabData = []
                return
            }
            // 根据所选分类的id和当前所处的面板，获取对应的参数
            const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
            if (res.meta.status !==200) return this.$message.error('获取列表数据失败')

            // 循环res.data 让item.attr_vals分割成数组再赋值回去
            res.data.forEach(item=>{
                // 三元表达式判断 是空就返回为空数组 不是空就分割
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                // 每个item项都有自己的inputVisible和inputValue
                // 控制文本输入框的显示和隐藏
                item.inputVisible = false
                // 文本输入框中的值
                item.inputValue = ''
            })

            // 判断activeName的值来把动态和静态数据分开存储
            if (this.activeName == 'many') {
                this.manyTabData = res.data
            }else{
                this.onlyTabData = res.data
            }
        },
        // 监听对话框的关闭事件
        dialogClosed() {
            this.$refs.addFormRef.resetFields()
        },
        editdialogClosed() {
            this.$refs.editFormRef.resetFields()
        },
        // 提交表单
        addParams() {
            // 先进行数据与验证 验证通过再请求更改数据
            this.$refs.addFormRef.validate(async valid=>{
                if (!valid) return
                const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
                    attr_name:this.addForm.attr_name,
                    attr_sel:this.activeName
                })
                if (res.meta.status !==201) return this.$message.error('提交商品分类失败')
                this.$message.success('提交商品分类成功')
                this.getParamsData()
                this.addDialogVisible = false
            })
        },
        // 点击修改按钮
        editParams() {
            // 先预验证表单再编辑修改表单
            this.$refs.editFormRef.validate(async valid=>{
                if(!valid) return
                const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.attr_id}`,{
                    attr_name:this.editForm.attr_name,
                    attr_sel:this.activeName,
                })
                if(res.meta.status !==200) return this.$message.error('编辑参数失败')
                this.$message.success('编辑参数成功')
                this.getParamsData()
                this.attr_id = ''
                this.editDialogVisible = false
            })
        },
        // 修改的对话框
        async showEditDialog(attr_id) {
            // 把获取到的参数id赋值给到attr_id
            this.attr_id = attr_id
            const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{
                params:{
                   attr_sel: this.activeName
                }
            })
            if (res.meta.status !==200) return this.$message.error('查询参数失败')
            // 请求到的数据赋值给到表单对象
            this.editForm = res.data
            this.editDialogVisible = true
        },
        // 根据id删除对应的属性
        async deleteAttr(attr_id) {
            // 先弹出提示框询问是否要删除参数再请求删除参数
            const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            if (confirmResult !== 'confirm') return this.$message.info('取消删除操作')
            
            const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
            if(res.meta.status !==200) return this.$message.error('删除参数失败')
            this.$message.success('删除参数成功')
            this.getParamsData()
        },
        // 文本框失去焦点获取按下回车都会触发
        handleInputConfirm(row) {
            // 如果输入的是空字符串 重置文本框内容并且隐藏 并且return出去
            if (row.inputValue.trim().length === 0) {
                row.inputValue = ''
                row.inputVisible = false
                return
            }
            // 如果没有return 说明输入内容是合法的 那就把文本框的值添加到attr_vals数组中 
            row.attr_vals.push(row.inputValue.trim())
            // 清空文本框的值和隐藏文本框
            row.inputVisible = false
            row.inputValue = ''

            this.saveAttrVals(row)
        },
        async saveAttrVals(row) {
            // 需要发起请求保存这次操作
            const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
                attr_name:row.attr_name,
                attr_sel:row.attr_sel,
                // 数据库中的attr_vals是字符串 所以这里需要拼接成字符串
                attr_vals:row.attr_vals.join(' ')
            })
            if(res.meta.status !==200) return this.$message.error('修改参数失败')
            this.$message.success('修改参数成功')
        },
        // 点击按钮 展示文本输入框
        showInput(row) {
            row.inputVisible = true
            // 让文本框自动获取焦点
            // $nextTick 方法作用：当页面的元素被重选渲染后才调用回调函数中的代码
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        // 参数小标签被关闭
        handleClose(i,row) {
            // 从数组row.attr_vals中删除对应索引的值
            row.attr_vals.splice(i,1)
            // 调用saveAttrVals函数对数据库数据进行更新
            this.saveAttrVals(row)
        }   
    },
    computed:{
        // 定义计算属性 根据selectedCateKeys长度来返回布尔值
        isBtnDisabled() {
            if (this.selectedCateKeys.length !==3) {
                return true
            }else {
                return false
            }
        },
        // 计算分类商品的id
        cateId() {
            if (this.selectedCateKeys.length ===3){
                // 返回数组中最后一个id
                return this.selectedCateKeys[2]
            }
            return null
        },
        // 动态计算标题文本
        titleText() {
            if (this.activeName === 'many') {
                return '动态参数'
            }else{
                return '静态属性'
            }
        }
    }
}
</script>

<style lang="less" scoped>
.cat-top {
    margin: 15px 0;
}
.el-tag {
    margin: 0 10px;
}
.input-new-tag {
    width: 120px;
}
</style>