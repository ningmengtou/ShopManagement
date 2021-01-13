<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 搜索框 -->
            <el-row>
                <el-col :span='10'>
                    <el-input placeholder="请输入内容" v-model="queryInfo.query">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!-- 表格区 -->
            <el-table border stripe :data="orderList">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column  label="订单编号" prop="order_number" width='500px'></el-table-column>
                <el-table-column  label="订单价格" prop="order_price"></el-table-column>
                <el-table-column  label="是否付款">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.pay_status == '1'">已付款</el-tag>
                        <el-tag type="danger" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column  label="是否发货" prop="is_send"></el-table-column>
                <el-table-column  label="下单时间" width="250px">
                    <template slot-scope="scope">
                        {{scope.row.create_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column  label="操作">
                    <template>
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editAddress"></el-button>
                        <el-button type="success" icon="el-icon-location" size="mini" @click="showProgress"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区 -->
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
        </el-card>
        <!-- 修改地址对话框 -->
        <el-dialog
            title="修改地址"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="editDialogClose">
            <!-- 表单区域 -->
            <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
                <el-form-item label="省市区/县" prop="address1">
                <!-- 级联选择器 -->
                    <el-cascader
                    v-model="addressForm.address1"
                    :options="cityDate"
                    :props="{ expandTrigger: 'hover' }"
                    @change="handleChange" width="100%"></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="addressForm.address2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 展示物流进度的对话框 -->
        <el-dialog
            title="物流进度"
            :visible.sync="progressVisible"
            width="50%">
            <!-- 时间线 -->
              <el-timeline >
                <el-timeline-item
                v-for="(activity, index) in orderTime"
                :key="index"
                :timestamp="activity.time">
                {{activity.context}}
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
    </div>
</template>

<script>
// 导入中国省市区县文件
import cityDate from './citydata.js'
import orderTime from './orderTime.js'
export default {
    data() {
        return {
            // 请求参数的配置
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10,
                consignee_addr:''
            },
            // 订单列表数据
            orderList:[],
            // 订单数据总数
            total:0,
            // 修改地址对话框的显示隐藏
            editDialogVisible:false,
            // 修改地址表单对象
            addressForm:{
                address1:[],
                address2:''
            },
            addressFormRules:{
                address1:[{required:true,message:'请选择省市区县',trigger:'blur'}],
                address2:[{required:true,message:'请输入详细地址',trigger:'blur'}],

            },
            // 城市数据表
            cityDate:cityDate,
            // 物流信息数据表
            orderTime:orderTime,
            // 物流对话框的显示隐藏
            progressVisible:false
            
        }
    },
    created() {
        this.getOrderList()
    },
    methods:{
        // 订单列表数据请求
        async getOrderList() {
            const {data:res} = await this.$http.get('orders',{params:this.queryInfo})
            if (res.meta.status !==200) return this.$message.error('获取订单列表数据失败')
            this.orderList = res.data.goods
            this.total = res.data.total
        },
        // 监听分页每页数据数量的变化
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getOrderList()
        },
        // 监听分页第几页的变化
        handleCurrentChange(newNum) {
            this.queryInfo.pagenum = newNum
            this.getOrderList()
        },
        // 点击修改按钮触发事件
        editAddress() {
            this.editDialogVisible = true
        },
        // 修改地址对话框关闭触发事件
        editDialogClose() {
            // 关闭对话框时重置表单
            this.$refs.addressFormRef.resetFields()
        },
        // 级联选择器改变时触发
        handleChange() {
            // 获取到级联选择器的值并且转换成字符串 再绑定到this.addressForm.address2上
            this.addressForm.address2 = this.addressForm.address1.join('')
        },
        // 物流按钮触发  804909574412544580 此快递单号失效了不能请求物流数据
        async showProgress() {
            // 获取物流信息数据 
            console.log(orderTime);

            this.progressVisible = true
        }
    }
    
}
</script>

<style lang="less" scoped>
.el-cascader {
    width: 100%;
}
</style>