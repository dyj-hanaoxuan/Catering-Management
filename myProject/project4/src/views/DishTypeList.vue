<template>
    <div class="DishTypeListBox">
        <breadcrumb text="菜品管理>菜品类型"></breadcrumb>
        <!--查询-->
        <el-card class="eCardSearch">
            <el-form :inline="true" v-model="froma" label-position="left" class="SearchBox">
                <el-form-item label="菜品类别">
                    <el-select  v-model="value" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.id"
                                :label="item.name"
                                :value="item.name">
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
            <el-table
                    :data="cailist"
                    class="table" :cell-style="rowClass" :header-cell-style="headClass"
                    style="width: 100%">
                <el-table-column
                        prop="name"
                        label="菜品类别">
                </el-table-column>
                <el-table-column
                        prop="id"
                        label="菜品编号">
                </el-table-column>
                <el-table-column
                        prop="remark"
                        label="菜品描述">
                </el-table-column>
                <el-table-column
                        prop="sl"
                        label="菜品数量">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                                type="warning" size="mini" icon="el-icon-edit" class="btnEdit"
                                @click="handleEdit(scope.row.id,scope.row.name,scope.row.remark)">编辑</el-button>
                        <el-button
                                type="danger" size="mini" icon="el-icon-delete" class="btnDel"
                                @click="handleDelete(scope.row.id)">删除</el-button>
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
                title="修改"
                :visible.sync="dialogVisible"
                width="30%">
            <el-form ref="form" :model="form" label-width="auto">
                <el-form-item label="菜品编号">
                    <el-input v-model="form.id" disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item label="菜品描述">
                    <el-input type="textarea" v-model="form.remark"></el-input>
                </el-form-item>
                <el-form-item label="菜品类别">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false;update()">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog
                title="新增"
                :visible.sync="dialogFormVisible"
                width="25%">
            <el-form :model="AddData" labelPosition="left" labelWidth="80px">
                <el-form-item label="菜品类别">
                    <el-input clearable size="medium" v-model="AddData.name" placeholder="菜品类别" >
                    </el-input>
                </el-form-item>
                <el-form-item label="菜品描述">
                    <el-input type="textarea" v-model="AddData.remarks"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible= false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false;addmember()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import breadcrumb from './breadcrumb.vue'
    export default {
        components: {
            breadcrumb
        },
        inject:['reload'],
        name: 'DishTypeList',
        data: function () {
            return {
                options: [],
                froma: '',
                id: "",
                remark: "",
                sl: "",
                name:"",
                AddData: {
                    name: "",
                    remark: "",
                    value:""
                },
                form: {
                    id: "",
                    name: "",
                    remark: ""
                },
                current:1,
                total:0,
                pageSize:3,
                remark: "",
                cailist: [],
                formLabelWidth: '100px',
                dialogFormVisible1: false,
                dialogVisible: false,
                dialogFormVisible:false,
                value: ''
            }
        },
        methods: {
            // 表头样式设置
            headClass () {
                return 'text-align: center;background:rgb(242,242,242);color:rgb(140,138,140)'
            },
            // 表格样式设置
            rowClass () {
                return 'text-align: center;'
            },
            handleDelete(id) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then((res) => {
                    console.log(res)
                    this.$axios.post('/api/dc/del.do', {
                            id: id
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
                })
            },
            onSearch(value) {
                console.log(value)
                this.$axios.post('/api/dc/query.do', {
                        "name": value
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'token': sessionStorage.getItem('token')
                        }
                    }
                ).then((res) => {
                    console.log(res.data)
                    this.cailist = res.data
                    console.log(this.cailist)
                })
            },
            addmember() {
                var lb = this.AddData.name
                var remark = this.AddData.remark
                this.$axios.post('/api/dc/insert.do', {
                        "name": lb,
                        "remark": remark
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'token': sessionStorage.getItem('token')
                        }
                    }
                ).then((res) => {
                    this.dialogFormVisible=false
                    if (res.data.code === 200) {
                        this.$message({
                            showClose: true,
                            message: '添加成功',
                            type: 'success'
                        });
                    }
                })
                this.reload()
            },
            handleEdit(id, name, remark) {
                this.dialogVisible = true;
                this.form.id = id;
                this.form.name = name;
                this.form.remark = remark;
            },
            update() {
                var id = this.form.id;
                var name= this.form.name;
                var remark = this.form.remark;
                this.$axios.post('/api/dc/edit.do', {
                        name: name,
                        remark: remark,
                        id: id
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'token': sessionStorage.getItem('token')
                        }
                    }
                ).then((res) => {
                    console.log(res);
                })
                this.reload();
            },
            CurrentChange(val){
                this.$axios.post('/api/dc/sel.do', {
                        currentPsge: val,
                        pageSize : this.pageSize,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'token': sessionStorage.getItem('token')
                        }
                    }
                ).then((res) => {
                        console.log(res)
                        this.cailist=res.data.data
                        console.log(this.cailist)
                        this.total=res.data.count
                        console.log(this.total)
                    }
                )
            }
        },
        mounted:function(){
            var pageSize= this.pageSize
            var current=this.current
            this.$axios.post('/api/dc/sel.do', {
                    currentPsge:current,
                    pageSize:pageSize,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'token': sessionStorage.getItem('token')
                    }
                }
            ).then((res) => {
                this.cailist = res.data.data
                this.total = res.data.count
            })
            this.$axios.post('/api/dc/sel01.do',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'token': sessionStorage.getItem('token')
                    }
                }
            ).then((res) => {
                this.options = res.data
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
    .StaffListBox{
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