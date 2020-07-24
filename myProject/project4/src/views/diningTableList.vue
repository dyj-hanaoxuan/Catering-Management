<template>
    <div class="DishSetListBox">
        <breadcrumb text="营业管理>餐桌管理"></breadcrumb>
        <!--查询-->
        <el-card class="eCardSearch">
            <el-form :inline="true" v-model="froma" label-position="left" class="SearchBox">
                <el-form-item label="可用状态">
                    <el-select v-model="value" placeholder="请选择">
                        <el-option label="全部" value="">
                        </el-option>
                        <el-option label="可用" value="可用">
                        </el-option>
                        <el-option label="占用" value="占用">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="餐桌人数">
                    <el-select v-model="value1" placeholder="请选择">
                        <el-option label="1人/桌" value="1">
                        </el-option>
                        <el-option label="2人/桌" value="2">
                        </el-option>
                        <el-option label="4人/桌" value="4">
                        </el-option>
                        <el-option label="8人/桌" value="8">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="餐位">
                    <el-select v-model="value2" placeholder="位置">
                        <el-option label="包间" value="包间">
                        </el-option>
                        <el-option label="大厅" value="大厅">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSearch"  icon="el-icon-search" class="btnSearch" round>查询</el-button>
                    <el-button type="primary" @click="dialogFormVisible = true;add()"  icon="el-icon-plus" class="btnAdd" round>新增</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <!--表格数据-->
        <el-card>
            <el-table id="table1"
                      :data="dingTable"
                      class="table"
                      :cell-style="rowClass"
                      :header-cell-style="headClass"
                      style="width: 100%">
                <el-table-column
                        prop="num"
                        label="餐桌编号"
                        min-width="100%">
                </el-table-column>
                <el-table-column
                   label="餐桌状态"
                   min-width="100%">
                    <template slot-scope="scope">
                        {{scope.row.state == 1?'可用':'占用'}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="type"
                        label="餐桌类型"
                        min-width="100%">
                </el-table-column>
                <el-table-column
                        prop="people_num"
                        label="餐桌可坐人数"
                        min-width="100%">
                </el-table-column>
                <el-table-column label="操作" min-width="100%">
                    <template slot-scope="scope">
                        <el-button
                                type="warning" size="mini" icon="el-icon-edit" class="btnEdit"
                                @click="handleEdit(scope.row.number,scope.row.state,scope.row.type,scope.row.people_num)">编辑</el-button>
                        <el-button
                                type="danger" size="mini" icon="el-icon-delete" class="btnDel"
                                @click="handleDelete(scope.row.number)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!--页码-->
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
        <!--模态框-->
        <el-dialog
                title="新增餐桌"
                :visible.sync="dialogFormVisible"
                width="25%">
            <el-form :model="AddData" labelPosition="left" labelWidth="80px">
                <el-form-item label="餐坐编号">
                    <el-input clearable size="medium" v-model="AddData.num" placeholder="餐坐编号" >
                    </el-input>
                </el-form-item>
                <el-form-item label="可坐人数">
                    <el-select v-model="AddData.people_num" placeholder="请选择">
                        <el-option label="1人/桌" value="1">
                        </el-option>
                        <el-option label="2人/桌" value="2">
                        </el-option>
                        <el-option label="4人/桌" value="4">
                        </el-option>
                        <el-option label="8人/桌" value="8">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="餐坐位置">
                    <el-select v-model="AddData.type" placeholder="请选择">
                        <el-option label="大厅" value="大厅">
                        </el-option>
                        <el-option label="包间" value="包间">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false;addmember()">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog
                title="修改"
                :visible.sync="dialogFormVisible1"
                width="25%">
            <el-form :model="form" labelPosition="left" labelWidth="80px">
                <el-form-item label="餐坐状态">
                    <el-select v-model="form.state" placeholder="请选择">
                        <el-option label="可用" value="可用">
                        </el-option>
                        <el-option label="占用" value="占用">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="餐桌位置">
                    <el-select v-model="form.type" placeholder="请选择">
                        <el-option label="大厅" value="大厅">
                        </el-option>
                        <el-option label="包间" value="包间">
                        </el-option>

                    </el-select>
                </el-form-item>
                <el-form-item label="餐桌人数">
                    <el-select v-model="form.people_num" placeholder="请选择">
                        <el-option label="1人/桌" value="1">
                        </el-option>
                        <el-option label="2人/桌" value="2">
                        </el-option>
                        <el-option label="4人/桌" value="4">
                        </el-option>
                        <el-option label="8人/桌" value="8">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible1 = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible1 = false;update()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import breadcrumb from './breadcrumb.vue'
    export default {
        name: '',
        components: {
            breadcrumb
        },
        inject:['reload'],
        data: function () {
            return {
                forma:{
                },
                dingTable:[],
              num:"",
                state:"",
                type:"",
                people_num:"",
                current:1,
                pageSize:5,
                total:0,
                value: '',
                value1: '',
                value2: '',
                dialogFormVisible:false,
                dialogFormVisible1:false,
                AddData:{
                    people_num:"",
                    type:"",
                    num:""
                },
                form:{
                    state:"",
                    type:"",
                    people_num:""
                }
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
            CurrentChange(val){
                console.log(val)
                this.$axios.post('api/tb/query04.do', {
                        currentPsge: val,
                        pageSize: this.pageSize,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'token': sessionStorage.getItem('token')
                        }
                    }
                ).then((res) => {
                        this.dingTable= res.data.data
                        this.total = res.data.count
                    }
                )
            },
            handleDelete(number) {
                console.log(number)
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then((res) => {
                    this.$axios.post('/api/tb/update01.do', {
                            num: num
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'token': sessionStorage.getItem('token')
                            }
                        })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                    this.dingTable=res.data.data

                })
                this.reload()
            },
            onSearch(){
                this.$axios.post('api/tb/query04.do',
                    {
                        "state":this.value,
                        people_num:this.value1,
                        "type":this.value2,
                        currentPsge: 1,
                        pageSize: 5

                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'token': sessionStorage.getItem('token')
                        }
                    }
                ).then((res)=>{
                    console.log('搜索');
                    console.log(res.data)
                    this.dingTable=res.data
                    this.total=res.data.count
                })
            },
            addmember() {
                var  people_num = this.AddData. people_num
                var type=this.AddData.type
                var number=this.AddData.number
                this.$axios.post('api/tb/insert01.do', {
                        "type": type,
                        "people_num":people_num,
                        num:num
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'token': sessionStorage.getItem('token')
                        }
                    }
                ).then((res) => {
                    this.DishSetList = res.data.data
                    console.log(res)
                })
            },
            handleEdit(number,state,type,people_num){
                this. dialogFormVisible1=true
                this.form.num= num
                this.form.state =state
                this.form.type = type
                this.form.people_num = people_num
            },
            update() {
                var num=this.form.num;
                var state=this.form.state;
                var type = this.form.type;
                var people_num=this.form.people_num;
                this.$axios.post('/api/tb/update02.do', {
                        "state":this.form.state,
                        "type":this.form.type,
                        people_num:this.form.people_num,
                        num:this.form.num
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'token': sessionStorage.getItem('token')
                        }
                    }
                ).then((res) => {
                    console.log(res);
                    this.dingTable=res.data.data
                })
                this.dialogVisible1 = false;
            },

        },
        mounted:function () {
            this.$axios.post('api/tb/query04.do',
                {
                    currentPsge: this.current,
                    pageSize : this.pageSize,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'token': sessionStorage.getItem('token')
                    }
                }
            ).then((res)=>{
                console.log('挂载');
                console.log(res.data)
                this.dingTable=res.data.data
                this.total=res.data.count
            })
        }
    }
</script>
<style scoped>
    .page{
        margin-top: 40px;
        text-align: right;
        padding-right: 100px!important;
    }
    .DishSetListBox{
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