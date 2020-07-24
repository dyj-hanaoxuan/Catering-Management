<template>
    <div class="BusinessList">
        <!--面包屑-->
        <breadcrumb text="运营管理>营业管理"></breadcrumb>
        <el-col class="BoxDiv">
            <el-col :span="8">
                <el-row class="type1">
                    <el-col :span="12" class="text-info">
                        <div>
                            今日餐桌使用数
                        </div>
                    </el-col>
                    <el-col :span="6" class="icon">
                        <div>
                            17
                        </div>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="8">
                <el-row class="type1">
                    <el-col :span="12" class="text-info">
                        <div>
                            消耗品剩余总份数
                        </div>
                    </el-col>
                    <el-col :span="6" class="icon">
                        <div>
                            189
                        </div>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="8">
                <el-row class="type1">
                    <el-col :span="12" class="text-info">
                        <div>
                            热销菜品销售额
                        </div>
                    </el-col>
                    <el-col :span="6" class="icon">
                        <div>
                            4530
                        </div>
                    </el-col>
                </el-row>
            </el-col>
        </el-col>
        <el-col>
            <div class="myChart" style="height: 500px;width: 100%;"></div>
        </el-col>
    </div>
</template>
<script>
    import breadcrumb from './breadcrumb.vue'
    export default{
        name: 'BusinessList',
        components: {
            breadcrumb
        },
        data(){
            return {
            }
        },
        methods: {
            getDishInfo(){
                this.$axios.post('/api/yy/query02.do', {
                        time: '2020-10-03'
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'token': sessionStorage.getItem('token')
                        }
                    }).then((response) => {
                    console.log("营业管理")
                    console.log(response.data.data[0].names)
                    console.log(typeof response.data.data[0].names)
                    this.xNames = response.data.data[0].names
//                    response.data.forEach(item =>{
//                        this.xNames = item.names
//                        this.xNamesArr.push(this.xNames)
//                    })


                })
            },
            drawLine () {
                // 基于准备好的dom，初始化echarts实例
                var myChart = this.$echars.init(document.querySelector(".myChart"))
                // 绘制图表
                var option = {
                    color: ['#5DAEFF', 'rgba(253,106,48,.8)'],
                    title: { text: '热销菜品销量统计' },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    xAxis: {
                        type: 'category',
                        // boundaryGap: false,
                        //  X轴数据坐标
                        data: ['土豆丝','番茄炒蛋','土豆炖牛肉','小鸡炖蘑菇','麻婆豆腐','酸菜鱼'],
                        axisTick: {
                            alignWithLabel: true
                        }
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value} 份'
                        }
                    },
                    series: [
                        {
                            name: '直接访问',
                            type: 'bar',
                            barWidth: '30%',
                            //  Y轴假数据
                            data: [20,30,48,10,60,78]
                        }
                    ]
                }
                myChart.setOption(option)
            },
            Star(){
                this.drawLine ()
            }

        },
        mounted:function(){
            this.getDishInfo()
            this.Star()
        }
    }
</script>
<style scoped>
    .BusinessList{
        text-align: center;
        width:100%;
        margin: 0 auto;
        box-sizing: border-box;
    }
    /*统计文字*/
    .text-info{
        background-color: white;
        font-size:18px;
        font-weight: 900;
        height: 120px;
        line-height: 60px;
        color: rgb(137, 147, 149);
        border-radius: 20px 0 0 20px;
    }
    .text-info2{
        background-color: #5DAEFF;
        font-size:35px;
        font-weight: 900;
        height: 120px;
        line-height: 60px;
        color: rgb(82,207,192);
        border-radius: 20px 0 0 20px;
    }
    /*图标文字*/
    .icon2{
        background-color: #5DAEFF;
        font-size: 40px;
        height: 120px;
        line-height: 120px;
        font-weight: 900;
        color: rgb(82,207,192);
        border-radius: 0 20px 20px 0;
    }
    .icon{
        background-color: white;
        font-size: 40px;
        height: 120px;
        line-height: 120px;
        font-weight: 900;
        color: rgb(82,207,192);
        border-radius: 0 20px 20px 0;
    }
    .is-selected {
        color: #FF8638;
    }
    .type1{
        margin-bottom: 10px;
    }
    .BoxDiv{
        height: 200px;
    }

</style>