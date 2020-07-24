<template>
    <div class="OrderListBox">
        <breadcrumb text="订单管理"></breadcrumb>
        <!--查询-->
        <el-card class="eCardSearch">
            <el-form v-model="froma" label-position="left" class="SearchBox" :inline="true">
                <el-form-item label="日期">
                    <el-date-picker
                            v-model="froma.value1"
                            type="date"
                            placeholder="选择日期"
                            format="yyyy 年 MM 月 dd 日">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" round class="btnSearch" @click="onSearch">查询</el-button>
                </el-form-item>

            </el-form>
        </el-card>
        <!--表格数据-->
        <el-card>
            <el-table id="table1"
                      :data="OrderList"
                      class="table" :cell-style="rowClass" :header-cell-style="headClass"
                      style="width: 100%">
                <el-table-column
                        prop="order_num"
                        label="订单编号"
                        min-width="100%">
                </el-table-column>
                <el-table-column
                        prop="num"
                        label="桌号"
                        min-width="100%">
                </el-table-column>
                <el-table-column
                        prop="sale_price"
                        label="总价"
                        min-width="100%">
                </el-table-column>
                <el-table-column prop="payment_time" label="订单时间" min-width="100%"></el-table-column>
                <el-table-column label="操作" min-width="100%">
                    <template slot-scope="scope">
                        <el-button type="warning" size="mini" class="btnEdit" @click="tiaozhuan(scope.row.order_num)">详情</el-button>
                        <el-button
                                type="danger" size="mini" icon="el-icon-delete" class="btnDel"
                                @click="handleDelete(scope.row.order_num)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <div class="page">
            <el-pagination
                    background
                    @current-change="CurrentChange"
                    layout="total, prev, pager, next, jumper"
                    :current-page='current'
                    :total='total'
                    :page-size='pageSize'>
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import breadcrumb from './breadcrumb.vue'
    export default {
        name: 'OrderList',
        inject:['reload'],
        components: {
            breadcrumb
        },
        data: function () {
            return {
                pageSize:'',
                current:1,
                total:'',
                checked:false,
                order_num:"",
                num:"",
                sale_price:"",
                payment_time:"",
                froma:{
                    value1:""
                },
                OrderList:[],
                dates:''
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
            },
            handleDelete(order_num) {
                console.log(order_num)
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then((res) => {
                    console.log(res)
                    this.$axios.post('api/reception/delorder', {
                            order_num:order_num
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                    this.OrderList=res.data.data
                })
                this.reload()
            },
            onSearch(){
                this.datess()
                console.log(this.dates);
                this.$axios.post('api/reception/queryorders', {
                    start_time:this.dates,
                        currentPage:1,
                        things:5
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                ).then((res)=>{
                    console.log(res)
                    this.OrderList=res.data.data
                })
            },
            datess(){
                    let date   = new Date(this.froma.value1);
                    let year   = date.getFullYear();
                    let month  = date.getMonth()+1;
                    let day    = date.getDate();
                    let mm = month<10?month = '0'+month:month =month
                    let dd = day<10?day = '0'+day:day =day
                    this.dates = year+"-"+mm+"-"+day
                },
            CurrentChange(val){
                console.log(val)
                this.$axios.post('api/reception/queryorders',
                    {
                        currentPage: val,
                        things: 5,
                    },
                    {
                        headers:{
                            'Content-Type': 'application/json'
                        }
                    }
                ).then((res)=>{
                    console.log(res)
                    this.total=res.data.count
                    this.OrderList=res.data.data
                    this.pageSize=this.data.limit
                })
            },
            tiaozhuan(num){
                console.log(num)
                this.$router.push({
                    path: `/orderDetail/`,
                    query: {
                        ordernum: num
                    }
                })
            }
            },
        mounted:function () {
            this.$axios.post('api/reception/queryorders', {
                  things:5,
                  currentPage:1
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            ).then((res)=>{
                console.log(res)
                this.OrderList=res.data.data
                this.total=res.data.count
            }
            )
        }
    }
</script>
<style scoped>
    .page{
        margin-top: 40px;
        text-align: right;
        padding-right: 100px!important;
    }
    .OrderListBox{
        text-align: center;
        width:100%;
        margin: 0 auto;
        box-sizing: border-box;
    }
    .el-table__body{
        width: 100%;
    }
    .table{
        padding: 20px;
        text-align: center;
        box-sizing: border-box;
    }
    .el-form-item__content button{
        margin-left: 40px;
    }
    .SearchBox{
        height: 70px;
        display: flex;
        align-items: center;
        width: 100%;
        margin-bottom: 50px;
    }
    .eCardSearch{
        height: 100px;
        margin-bottom: 50px;
    }
    .btnSearch,.btnAdd{
        height: 45px;
        width: 120px;
        text-align: center;
    }
    .btnSearch{
        color: rgb(63,99,255);
        border: 2px solid rgb(63,99,255);
        background-color: transparent;
    }
    .btnAdd{
        background-color:rgb(63,99,255);
        color: white;
        border: none;
    }
    .btnEdit{
        background-color: rgb(63,99,255);
        border: none;
    }
    .btnDel{
        border: none;
    }
</style>