<template>
    <div id="app">
        <breadcrumb text="订单管理>订单详情"></breadcrumb>
        <el-card>
            <el-table :data="orderlist" class="table" :cell-style="rowClass" :header-cell-style="headClass">
                <el-table-column
                        label="菜品图片"
                        width="180">
                    <template slot-scope="scope">
                        <img :src="'http://172.16.8.37:8080'+scope.row.photo" alt="">
                    </template>
                </el-table-column>
                <el-table-column
                        prop="d_name"
                        label="菜品名称"
                        width="220">
                </el-table-column>
                <el-table-column
                        prop="d_price"
                        label="菜品单价"
                        width="220">
                </el-table-column>
                <el-table-column
                        prop="o_num"
                        label="数量"
                        width="220">
                </el-table-column>
                <el-table-column
                        prop="total_price"
                        label="总价"
                        width="220">
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
<script>
    export default {
        name: 'orderDetail',
        data: function () {
            return {
                photo:"",
                d_name:"",
                d_price:"",
                o_num:"",
                total_price:"",
                orderlist:[]
            }
        },
        methods:{
            // 表头样式设置
            headClass () {
                return 'text-align: center;background:rgb(242,242,242);color:rgb(140,138,140)'
            },
            // 表格样式设置
            rowClass () {
                return 'text-align: center;'
            }
        },
        mounted:function () {
            console.log(this.$route.query.num)
            this.$axios.post('api/reception/queryorderdetails',{
                     order_num:this.$route.query.ordernum
                },
                {
                    headers:{
                        'Content-Type': 'application/json'
                    }
                }
            ).then((res)=>{
                console.log(res)
                this.orderlist=res.data.data
                console.log(res.data.data)
            })
        }
    }
</script>
<style scoped>
    .el-table{
        width: 80%;
    }
    img{
        width: 100px;
        height: 100px;
    }
</style>