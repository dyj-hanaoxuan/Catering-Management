<template>
    <div class="indexBox">
        <!--主页内容-->
        <el-row>
            <el-col :span="8">
                <div class="leftechart" style="height: 25vh">
                </div>
            </el-col>
            <el-col :span="8">
                <el-row class="type1">
                    <el-col :span="12" class="text-info">
                        <div>
                            今日销售额
                        </div>
                    </el-col>
                    <el-col :span="6" class="icon">
                        <div>
                            ￥{{test}}
                        </div>
                    </el-col>
                </el-row>
                <el-row class="type2">
                    <el-col :span="12" class="text-info2">
                        <div>
                            昨日销售额
                        </div>
                    </el-col>
                    <el-col :span="6" class="icon2">
                        <div>
                            ￥828
                        </div>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="8">
                <el-row class="type1">
                    <el-col :span="12" class="text-info">
                        <div>
                            今日订单总数
                        </div>
                    </el-col>
                    <el-col :span="6" class="icon">
                        <div>
                            {{test2}}
                        </div>
                    </el-col>
                </el-row>
                <el-row class="type2">
                    <el-col :span="12" class="text-info2">
                        <div>
                            昨日订单总数
                        </div>
                    </el-col>
                    <el-col :span="6" class="icon2">
                        <div>
                            200
                        </div>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <!--        日历-->
        <el-row>
            <el-col :span="8" style='height: 70vh'>
                <div>
                    <el-calendar>
                        <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
                        <template
                                slot="dateCell"
                                slot-scope="{date, data}">
                            <p :class="data.isSelected ? 'is-selected' : ''" @click="pick(data)">
                                {{ data.day.split('-').slice(1).join('-') }} {{ data.isSelected ? '√' : ''}}
                            </p>
                        </template>
                    </el-calendar>
                </div>
            </el-col>
            <el-col :span="16">
                <echars></echars>
            </el-col>
        </el-row>

    </div>
</template>
<script>
    import echars from '../components/Echars.vue'
    export default {
        name: 'index',
        components: {
            echars
        },
        data(){
            return{
                value: new Date(),
                test:15,
                test2:12
            }
        },
        methods: {
            pick (val ){
                console.log(val.day);
                this.$axios.post('/api/reception/oneday', {
                        start_time: val.day
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then((res) => {
                    console.log(res.data)
                    if (res.data.code !== 200) {
                        return this.$message.error(res.data.message)
                    } else {
                        this.$message.success(res.data.message)
                        this.test = res.data.data[0].all_price
                        this.test2 = res.data.data[0].number
                        this.mycharts1()
                    }
                })
            },
            mycharts1(){
                var myChart = this.$echars.init(document.querySelector(".leftechart"))
                var option = {
                    title: {
                        // text: '南丁格尔玫瑰图',
                        // subtext: '纯属虚构',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            mark: {show: true},
                            dataView: {show: true, readOnly: false},
                            magicType: {
                                show: true,
                                type: ['pie', 'funnel']
                            },
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    series: [
                        {
                            name: '各类菜受欢迎程度',
                            type: 'pie',
                            radius: [70, 110],
                            center: ['45%', '45%'],
                            roseType: 'radius',
                            label: {
                                show: false
                            },
                            emphasis: {
                                label: {
                                    show: false
                                }
                            },
                            data: [
                                {value: this.test, name: '炒菜'},
                                {value: 9, name: '凉菜'},
                                {value: 15, name: '炖菜'},
                                {value: 25, name: '酒水'},
                                // {value: 20, name: 'rose5'},
                                // {value: 35, name: 'rose6'},
                                // {value: 30, name: 'rose7'},
                                // {value: 40, name: 'rose8'}
                            ]
                        }

                    ]
                }
                myChart.setOption(option)
            },
            zhi(){
                this.mycharts1()
            }
        },
        mounted: function ()  {
            this.zhi(),
                this.$axios.post('/api/reception/querytype', {
                        // start_time: '2020-05-10'
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then((res) => {
                    console.log(res.data)
                    if (res.data.code !== 200) {
                        return this.$message.error(res.data.msg)
                    } else {
                        this.$message.success(res.data.msg)
                    }
                })

        }
    }

</script>
<style scoped>
    .indexBox{

    }
    /*统计文字*/
    .text-info{
        background-color: #4DDB7D;
        font-size:35px;
        font-weight: 900;
        height: 120px;
        line-height: 60px;
        color: white;
        border-radius: 20px 0 0 20px;
    }
    .text-info2{
        background-color: #5DAEFF;
        font-size:35px;
        font-weight: 900;
        height: 120px;
        line-height: 60px;
        color: white;
        border-radius: 20px 0 0 20px;
    }
    /*图标文字*/
    .icon2{
        background-color: #5DAEFF;
        font-size: 40px;
        height: 120px;
        line-height: 120px;
        font-weight: 900;
        color: white;
        border-radius: 0 20px 20px 0;
    }
    .icon{
        background-color: #4DDB7D;
        font-size: 40px;
        height: 120px;
        line-height: 120px;
        font-weight: 900;
        color: white;
        border-radius: 0 20px 20px 0;
    }
    .is-selected {
        color: #FF8638;
    }
    .type1{
        margin-bottom: 10px;
        /*transform: perspective(1.5em) rotateX(.8deg);*/
        /*transform-origin: top;*/
    }
    /*.type2{*/
    /*    !*margin-top: -30px;*!*/
    /*    transform: perspective(1.5em) rotateX(.8deg);*/
    /*    transform-origin: top;*/
    /*}*/

</style>