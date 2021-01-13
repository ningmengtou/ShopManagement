<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 2.为ECharts准备一个具备大小（宽高）的Dom -->
            <div id="main" style="width: 800px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
// 1.导入echarts
import echarts from 'echarts'
// 导入lodash
import _ from 'lodash'

export default {
    data() {
        return{
            // 需要合并的数据
            options: {
                title: {
                text: '用户来源'
                },
                tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                    backgroundColor: '#E9EEF3'
                    }
                }
                },
                grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
                },
                xAxis: [
                {
                    boundaryGap: false
                }
                ],
                yAxis: [
                {
                    type: 'value'
                }
                ]
            }
        }
    },
    created() {
        

    },
    // dom元素都渲染完毕才调用此生命周期函数
    async mounted() {
        // 3.基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        // 获取折线图数据
        const {data:res} = await this.$http.get(`reports/type/1`)
        if (res.meta.status !==200) return this.$message.error('获取折线图失败') 

        // 4.指定图表的配置项和数据 merge()可以合并对象 把请求到的数据和接口中的对象合并成一个对象
        const result =  _.merge(res.data,this.options)

        // 5.展示数据 setOption()用于展示数据
        myChart.setOption(result)
    },
    methods:{
        
    }
}
</script>

<style lang="less" scoped>

</style>