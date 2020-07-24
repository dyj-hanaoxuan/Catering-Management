<template>
  <div id="myChart" :style="{width: '100%', height: '70vh'}"></div>
</template>
<script>
// 引入基本模板
const echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  name: 'myEcharts',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      startTime: '2020-04',
      endTime: '2020-06'
    }
  },
  mounted () {
    this.$axios.post('/api/reception/oneday', {
      start_time: '2020-05-01'
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
    this.drawLine()
  },
  methods: {
    drawLine () {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        color: ['#5DAEFF', 'rgba(253,106,48,.8)'],
        title: { text: '订单统计图' },
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
          data: [2020.1, 2020.2, 2020.3, 2020.4, 2020.5, 2020.6],
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
              {
              name: '直接访问',
              type: 'bar',
              barWidth: '30%',
                //  Y轴假数据。。。。
              data: [10, 52, 200, 334, 390, 330, 220]
              }
        ]
      })
    }
  }
}
</script>
<style scoped>

</style>
