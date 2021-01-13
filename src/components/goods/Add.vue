<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视区 -->
        <el-card>
            <!-- 警告栏 -->
            <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
            <!-- 步骤条区 active设置激活项 属性值是数值不是字符串-->
            <el-steps  :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <!-- 表单中包裹tabs -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
            <!-- tabs栏 tabPosition设置tabs栏位置 子项的name属性会给到v-model中的值 这样和步骤条就有联动
            @tab-click 这是切换tabs时触发事件-->
                <el-tabs  tabPosition="left"  v-model="activeIndex" :before-leave="beforeTabsLeave" @tab-click="tabClicked">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model.number="addForm.goods_price" ></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model.number="addForm.goods_weight" ></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model.number="addForm.goods_number" ></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <!-- 双项绑定的是addForm.goods_cat分类列表 -->
                            <el-cascader
                            expand-trigger="hover"
                            v-model="addForm.goods_cat"
                            :options="goodsList"
                            :props="cateProps"
                            @change="handleChange">
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <!-- 渲染表单的item项 -->
                        <el-form-item v-for="item in manyTableData" :key="item.attr_id" :label="item.attr_name" >
                        <!-- 复选框 双向绑定item.attr_vals数组并且循环数组 让label属性等于遍历项-->
                        <el-checkbox-group v-model="item.attr_vals" >
                            <el-checkbox :label="value" v-for="(value,index) in item.attr_vals" :key="index" border></el-checkbox>
                        </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!-- 添加图片 每次上传图片都要设置请求头 而且要有Authorization字段-->
                        <!-- action 要上传到的api地址 on-preview点击图片预览的效果 on-remove删除图片效果-->
                        <el-upload
                            :action="uploadURL"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            list-type="picture"
                            :headers='headerObj'
                            :on-success="handleSuccess">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <!-- 富文本编辑器组件 -->
                        <quill-editor v-model="addForm.goods_introduce">11</quill-editor>
                        <el-button type="primary" class="addBtn" @click="add">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>  
            </el-form>
        </el-card>

        <!-- 图片预览对话框 -->
        <el-dialog
            title="图片预览"
            :visible.sync="imgDialogVisible"
            width="30%">
            <img :src="previewPath" alt="" width="100%">
        </el-dialog>
    </div>
</template>

<script>
// 导入lodash包命名为 _
import _ from 'lodash'
export default {

    data() {
        return {
            // 步骤和tabs的索引值
            activeIndex:'0',
            // 表单对象
            addForm:{
                goods_name:'',
                goods_price:0,
                goods_weight:0,
                goods_number:0,
                // 商品所属的分类数组
                goods_cat:[],
                // 图片的数组
                pics:[],
                // 商品详情描述
                goods_introduce:'',
                attrs:[]
            },
            // 表单对象规则
            addFormRules:{
                goods_name:[{required:true,message:'请输入商品名称',trigger:'blur'}],
                goods_price:[{required:true,message:'请输入商品价格',trigger:'blur'}],
                goods_weight:[{required:true,message:'请输入商品重量',trigger:'blur'}],
                goods_number:[{required:true,message:'请输入商品数量',trigger:'blur'}],
                goods_cat:[{required:true,message:'请输入商品分类',trigger:'blur'}],
            },
            // 商品数据列表
            goodsList:[],
            // 级联选择器的配置信息
            cateProps:{
                label:'cat_name',
                value:'cat_id',
                children:'children'
            },
            // 动态参数列表数据
            manyTableData:[],
            onlyTableData:[],
            // 上传图片的地址
            uploadURL:'http://timemeetyou.com:8889/api/private/v1/upload',
            // 图片上传组件的headers请求头
            headerObj:{
                Authorization:window.sessionStorage.getItem('token')
            },
            previewPath:'',
            // 图片对话框的显示隐藏
            imgDialogVisible:false
        }
    },
    created() {
        this.getGoodsList()
    },
    methods:{
        // 获取到商品数据列表
        async getGoodsList() {
            const {data:res} = await this.$http.get('categories')
            if (res.meta.status !==200) return this.$message.error('获取商品列表数据失败')
            this.goodsList = res.data
        },
        // 级联选择器改变时触发函数
        handleChange() {
            // 如果addForm.goods_cat长度等于3表示选中三级分类，如果不是则清空列表
            if (this.addForm.goods_cat.length !==3) {
                this.addForm.goods_cat = []
            }
        },
        // 标签页切换之前触发的函数 activeName(即将进入的标签页) oldActiveName(即将离开的标签页)
        beforeTabsLeave(activeName,oldActiveName) {
            // 离开的标签页是0并且没有选择三级商品分类就不让标签页切换(返回false)
            if (oldActiveName == 0 && this.addForm.goods_cat.length !==3) {
                this.$message.error('请先选择分类')
                return false
            }
        },
        // 切换商品tabs时调用函数
        async tabClicked() {
            // 根据this.activeIndex属性值来判断并且请求数据
            if (this.activeIndex == 1) {
                // this.activeIndex == 1 表示需要请求商品动态参数
                const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
                    params:{
                        sel:'many'
                    }
                })
                if(res.meta.status !==200) return this.$message.error('获取商品参数失败')
                // 循环请求到的数据，判断attr_vals属性值是否为空，是空就返回空数组，不是则分割成数组
                res.data.forEach(item=>{
                    item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals = item.attr_vals.split(',')
                })
                this.manyTableData = res.data
            }else if(this.activeIndex == 2) {
                // this.activeIndex == 2 表示需要请求商品静态属性
                const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
                    params:{
                        sel:'only'
                    }
                })
                if(res.meta.status !==200) return this.$message.error('获取商品属性失败')
                this.onlyTableData = res.data
            }
        },
        // 处理图片预览效果
        handlePreview(file) {
            // 获取到图片的绝对路径并且赋值给到this.previewPath 再让对话框显示
            this.previewPath = file.response.data.url
            this.imgDialogVisible = true
        },
        // 删除图片触发的事件
        handleRemove(file) {
            // file参数就是被删除上传图片的信息
            // 利用filter把没有删除图片的路径重新赋值给到this.addForm.pics
            this.addForm.pics = this.addForm.pics.filter(item=>item.pic !== file.response.data.tmp_path)
            console.log(this.addForm.pics);
        },
        // 监听上传图片成功就调用此函数
        handleSuccess(response) {
            console.log(response)
            // 1.拼接图片路径对象2.追加到数组中
            const picInfo = {pic:response.data.tmp_path}
            this.addForm.pics.push(picInfo)
            console.log(this.addForm);
           
        },
        // 点击富文本下添加按钮触发事件
        add() {
            this.$refs.addFormRef.validate(async valid=>{
                // 验证不通过直接return出去
                if(!valid) return this.$message.error('请填写必要的表单项')
                // 需要把this.addForm.goods_cat从数组转换成字符串，使用深拷贝转换的是新数组不改变原来的值
                // 使用 lodash 来实现深拷贝 方法是 cloneDeep(obj)  处理深拷贝之后的对象
                const form =  _.cloneDeep(this.addForm)
                form.goods_cat = form.goods_cat.join(',')

                // 处理动态参数
                // 遍历manyTableData数组，创建一个新对象接收属属性，attr_value为空格分割的字符串 
                this.manyTableData.forEach(item=>{
                    const newInfo = {
                        attr_id:item.attr_id,
                        attr_value:item.attr_vals.join(' ')
                    }
                    // 再把新对象重新给到this.addForm.attrs
                    this.addForm.attrs.push(newInfo)
                })
                // 处理静态属性  静态属性的value本来就是字符串就不用join了
                this.onlyTableData.forEach(item=>{
                    const newInfo = {
                        attr_id:item.attr_id,
                        attr_value:item.attr_vals
                    }
                    this.addForm.attrs.push(newInfo)
                })
                // 把this.addForm.attrs赋值给到form
                form.attrs = this.addForm.attrs
                console.log(form);

                const {data:res} = await this.$http.post('goods',form)
                // // 添加商品成功就提示成功信息并且跳转到商品列表页面
                this.$message.success('添加商品成功')
                this.$router.push('/goods')
            })
        }
    },
    computed:{
        // 计算商品分类的id值
        cateId() {
            if (this.addForm.goods_cat.length ===3) {
                return this.addForm.goods_cat[2]
            }
            return null
        }
    }
}
</script>

<style lang="less" scoped>
.el-checkbox {
    margin:0 10px 0 0 !important;
}
.addBtn {
    margin-top: 20px;
}
</style>