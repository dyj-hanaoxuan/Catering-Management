<template>
    <div class="MemberListBox">
        <breadcrumb text="运营管理>会员管理"></breadcrumb>
        <!--查询-->
        <el-card class="eCardSearch">
            <el-form :inline="true" v-model="froma" label-position="left" class="SearchBox">
                <el-form-item>
                    <el-input v-model="froma.tel" placeholder="输入会员手机号码" ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSearch"  icon="el-icon-search" round class="btnSearch">查询</el-button>
                    <el-button type="primary" @click="dialogFormVisible = true"  icon="el-icon-plus" class="btnAdd" round>新增</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <!--表格数据-->
        <el-card>
            <el-table id="table1"
                      :data="memberList"
                      class="table" :cell-style="rowClass" :header-cell-style="headClass"
                      style="width: 100%">
                <el-table-column
                        prop="id"
                        label="会员编号"
                        min-width="50%">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="会员昵称"
                        min-width="100%">
                </el-table-column>
                <el-table-column
                        prop="sex"
                        label="会员性别"
                        min-width="50%">
                </el-table-column>
                <el-table-column
                        label="会员状态"
                        min-width="100%">
                    <template slot-scope="scope">
                        {{scope.row.states==0?'正常':'冻结'}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="tel"
                        label="会员手机号"
                        min-width="100%">
                </el-table-column>
                <el-table-column prop="create_time" label="创建时间" min-width="100%"></el-table-column>
                <el-table-column label="操作" min-width="120%">
                    <template slot-scope="scope">
                        <el-button
                                type="warning" size="mini" icon="el-icon-edit" class="btnEdit"
                                @click="handleEdit(scope.row.id,scope.row.name,scope.row.tel,scope.row.id_card,scope.row.password)">编辑</el-button>
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
                title="新增会员"
                :visible.sync="dialogFormVisible"
                width="25%">
            <el-form :model="AddData" labelPosition="left" labelWidth="80px">
                <el-form-item label="会员昵称">
                    <el-input clearable size="medium" v-model="AddData.name" placeholder="会员昵称" >
                    </el-input>
                </el-form-item>
                <el-form-item label="会员电话">
                    <el-input clearable size="medium" v-model="AddData.tel" placeholder="会员电话" >
                    </el-input>
                </el-form-item>
                <el-form-item label="身份证号">
                    <el-input clearable size="medium" v-model="AddData.id_card" placeholder="身份证号" >
                    </el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input clearable size="medium" v-model="AddData.password" placeholder="密码" >
                    </el-input>
                </el-form-item>
                <el-form-item label="会员性别" >
                    <el-radio v-model="AddData.radio" label="男"  value="男">男</el-radio>
                    <el-radio v-model="AddData.radio"  label="女" value="女">女</el-radio>
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
                <el-form-item label="会员编号">
                    <el-input clearable size="medium" v-model="form.id" placeholder="会员编号" disabled>
                    </el-input>
                </el-form-item>
                <el-form-item label="会员昵称">
                    <el-input clearable size="medium" v-model="form.name" placeholder="会员昵称" >
                    </el-input>
                </el-form-item>
                <el-form-item label="会员电话">
                    <el-input clearable size="medium" v-model="form.tel" placeholder="会员电话" >
                    </el-input>
                </el-form-item>
                <el-form-item label="身份证号">
                    <el-input clearable size="medium" v-model="form.id_card" placeholder="身份证号" >
                    </el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input clearable size="medium" v-model="form.password" placeholder="密码" >
                    </el-input>
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
        components: {
            breadcrumb
        },
        inject:['reload'],
        name: 'MemberList',
        data: function () {
            return {
                sex:"",
                id:"",
                name:"",
                tel:"",
                create_time:"",
                current:1,
                total:0,
                pageSize:5,
                AddData:{
                    name:"",
                    tel:"",
                    id_card:"",
                    password:"",
                    radio:""
                },
                form: {
                    id:"",
                    name: "",
                    tel: "",
                    id_card: "",
                    password:""
                },
                froma:{
                    tel:""
                },
                memberList:[],
                dialogTableVisible: false,
                dialogFormVisible: false,
                formLabelWidth: '100px',
                value: '',
                dialogFormVisible1:false
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
            onSearch(tel) {
                var tel = this.froma.tel
                this.$axios.post('api//hy/query02.do', {
                        "tel": tel,
                       currentPsge:this.current,
                       pageSize:5
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'token': sessionStorage.getItem('token')
                        }
                    }
                ).then((res) => {
                    this.memberList = res.data
                })
            },
            addmember() {
                var name = this.AddData.name
                var tel = this.AddData.tel
                var id_card = this.AddData.id_card
                var sex = this.AddData.radio
                var password = this.AddData.password
                this.$axios.post('api//hy/insert02.do', {
                        name: name,
                        tel: tel,
                        id_card: id_card,
                        sex: sex,
                        password: password
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'token': sessionStorage.getItem('token')
                        }
                    }
                ).then((res) => {
                    this.memberList = res.data.data
                    console.log(res)
                    this.reload()
                })
            },
            CurrentChange(val) {
                this.$axios.post('/api/hy/query01.do', {
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
                        console.log(res)
                        this.memberList = res.data.data
                        this.total = res.data.count
                    }
                )

            },
            handleDelete(id) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).then((res) => {
                    console.log(res)
                    this.$axios.post('/api/hy/update04.do', {
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
            handleEdit(id,name,tel,id_card,password) {
                this. dialogFormVisible1 = true;
                this.form.id=id;
                this.form.name = name;
                this.form.tel = tel;
                this.form.id_card =id_card;
                this.form.password=password
            },
            update() {
                var id=this.form.id;
                var name = this.form.name;
                var tel = this.form.tel;
                var id_card = this.form.id_card;
                var password=this.form.password;
                this.$axios.post('/api/hy/update05.do',
                    {
                        name:name,
                        tel:tel,
                        id_card:id_card,
                        password:password,
                        id:id
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'token': sessionStorage.getItem('token')
                        }
                    }
                ).then((res) => {
                    console.log(res);
                    this.memberList=res.data
                })
                this.dialogVisible1 = false;
                this.reload();
            }
        },
        mounted:function(){
            this.$axios.post('/api/hy/query01.do', {
                    currentPsge: this.current,
                    pageSize : this.pageSize,
                    user_id:this.id,
                    name:this.name,
                    tel:this.tel,
                    sex:this.sex,
                    create_time:this.create_time
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'token': sessionStorage.getItem('token')
                    }
                }
            ).then((res) => {
                    console.log("打印时间")
                    console.log(res.data)
                    this.memberList=res.data.data
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
    .MemberListBox{
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