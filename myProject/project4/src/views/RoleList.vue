<template>
    <div class="RoleListBox">
        <breadcrumb text="基础信息管理>角色管理"></breadcrumb>
        <!--查询-->
        <el-card class="eCardSearch">
            <el-form :inline="true" v-model="seach" label-position="left" class="SearchBox">
                <el-form-item label="角色昵称">
                    <el-input v-model="seach.Name" placeholder="角色昵称" ></el-input>
                </el-form-item>
                <el-form-item label="启用状态">
                    <el-select v-model="seach.stasus" placeholder="状态">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="正常" value="1"></el-option>
                        <el-option label="异常" value="-1"></el-option>
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
            <el-table :data="Rolelist" class="table" :cell-style="rowClass" :header-cell-style="headClass">
                <el-table-column
                        prop="role_id"
                        label="角色ID">
                </el-table-column>
                <el-table-column
                        prop="role_name"
                        label="角色名称">
                </el-table-column>
                <el-table-column
                        label="创建时间"
                        prop='role_createtime'>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch
                                style="display: block"
                                v-model="scope.row.role_state"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                :active-value='1'
                                :inactive-value='-1'
                                @change="activeStatus(scope.row.role_id,scope.row.role_state)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <el-button type="warning" size="mini" icon="el-icon-edit" @click="dialogFormVisible = true;handleEdit(scope.row.role_id,scope.row)" class="btnEdit">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!--页码-->
        <div class="block page">
            <el-pagination
                    background
                    @current-change="CurrentChange"
                    layout="total, prev, pager, next, jumper"
                    :current-page.sync='current'
                    :total='total.count'
                    :page-size='pageSize'>
            </el-pagination>
        </div>
        <!--模态框-->
        <el-dialog
                :title='title_txt'
                :visible.sync="dialogFormVisible"
                width="30%" max-height="50%">
            <el-form :model="AddData" labelPosition="left" labelWidth="100px">
                <el-form-item label="角色名称">
                    <el-input clearable size="medium" v-model="AddData.Name" placeholder="角色名称" >
                    </el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input
                            type="textarea"
                            placeholder="请输入内容"
                            v-model="AddData.desc"
                            maxlength="30"
                            show-word-limit>
                    </el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select size="medium" v-model="AddData.status">
                        <el-option label="正常" value='1'></el-option>
                        <el-option label="锁定" value='-1'></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false;Save()">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Vue from 'vue'
    import breadcrumb from './breadcrumb.vue'
    export default {
        comments: 'Vue',
        components: {
            breadcrumb
        },
        name: "role",
        data() {
            return {
                // 日期数据模块
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },
                // 模态款数据
                AddData:{
                    Name: '',
                    status:'',
                    desc: ''
                },
                // 搜索数据
                seach: {
                    Name: '',
                    stasus: ''
                },
                Rolelist: [],  // 后台数据
                dialogTableVisible: false,
                dialogFormVisible: false,
                Switch: false,   // 模态框开关
                title_txt: '',  // 模态框标题
                current: 1,
                pageSize: 3,
                total:[],
                ID: '',  // 当前id
                info: ''  // 当前信息
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
            // 修改所有信息方法
            handleEdit (id,info){
                this.Switch = true
                this.title_txt='修改角色'
                this.ID = id
                this.info = info
                this.AddData.Name = info.role_name
                this.AddData.desc = info.role_desc
            },
            //  修改状态方法
            activeStatus(id, stu) {
                this.$axios.post('/api/employee/changeRole', {
                        role_id: id,
                        role_state: stu // 状态 1: 正常 或者 -1 : 锁定  不传则表示所有状态
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'token': sessionStorage.getItem('token')
                        }
                    }).then((res) => {
                    if (res.data.code !== 200) {
                        return this.$message.error(res.data.message)
                    } else {
                        this.$message.success(res.data.message)
                    }
                })
            },
            // 分页方法
            CurrentChange(val) {
                const pageSize = this.pageSize
                this.$axios.post('/api/employee/showAllRoles', {
                        pages:val,  // 当前页数
                        limit:3  // 每页条数
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'token': sessionStorage.getItem('token')
                        }
                    }).then((res) => {
                    this.Rolelist = res.data.data
                })
            },
            //刷新方法
            reload(that) {
                that.$axios.post('/api/employee/showAllRoles', {
                        pages:that.current,  // F
                        limit:3  // 每页条数
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'token': sessionStorage.getItem('token')
                        }
                    }).then((res) => {
                    console.log(res.data)
                    if (res.data.code !== 200) {
                        return that.$message.error(res.data.message)
                    } else {
                        that.$message.success(res.data.message)
                    }
                    that.total =  res.data
                    that.pageSize = res.data.limit
                    that.$set(that.$data,"Rolelist",res.data.data);
                })
            },
            // 搜索方法
            onSearch () {
                const role_name = this.seach.Name
                const role_state = this.seach.stasus
                this.$axios.post('/api/employee/showOnelRole', {
                        role_name: role_name,
                        role_state: role_state,
                        pages:1,  // F
                        limit:3  // 每页条数
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'token': sessionStorage.getItem('token')
                        }
                    }).then((res) => {
                    console.log(res.data)
                    if (res.data.code !== 200) {
                        return this.$message.error(res.data.message)
                    } else {
                        this.$message.success(res.data.message)
                    }
                    this.Rolelist =  res.data.data
                    this.total =  res.data
                    this.pageSize = res.data.limit
                })
            },
            // 添加按钮
            add () {
                this.AddData.Name = ''
                this.AddData.status = ''
                this.AddData.desc = ''
                this.Switch = false
                if(!this.Switch){
                    this.title_txt='新增角色'
                }
            },
            // 保存信息
            Save (){
                if(!this.Switch){
                    const name = this.AddData.Name
                    const status = this.AddData.status
                    const desc = this.AddData.desc
                    this.$axios.post('/api/employee/addlRole', {
                            role_name: name,
                            role_state: status,
                            role_desc:desc
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'token': sessionStorage.getItem('token')
                            }
                        }).then((res) => {
                        if (res.data.code !== 200) {
                            return this.$message.error(res.data.message)
                        } else {
                            this.$message.success(res.data.message)
                        }
                        let that = this;
                        that.$options.methods.reload(that);
                    })
                }
                else{
                    this.$axios.post('/api/employee/changeRole', {
                            role_id: this.ID,
                            role_state: this.AddData.status, // 状态 1: 正常 或者 -1 : 锁定  不传则表示所有状态
                            role_name: this.AddData.Name,
                            role_desc: this.AddData.desc
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'token': sessionStorage.getItem('token')
                            }
                        }).then((res) => {
                        if (res.data.code !== 200) {
                            return this.$message.error(res.data.message)
                        } else {
                            this.$message.success(res.data.message)
                            let that = this;
                            that.$options.methods.reload(that);
                        }
                    })
                }
            }
        },
        mounted: function () {
            this.$axios.post('/api/employee/showAllRoles', {
                    pages:1,  // F
                    limit:3  // 每页条数
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'token': sessionStorage.getItem('token')
                    }
                }).then((res) => {
                this.Rolelist =  res.data.data
                this.total =  res.data
                this.pageSize = res.data.limit
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
    .RoleListBox{
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
    }
    span.el-dialog__title{
        font-size: 40px!important;
        line-height: 40px;
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
    .el-form-item__content button{
        margin-left: 40px;
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
</style>