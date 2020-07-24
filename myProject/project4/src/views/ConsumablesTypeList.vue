<template>
    <div>
        <div class="ConsumablesTypeListBox">
            <breadcrumb text="库存管理>消耗品类型"></breadcrumb>
            <!--查询-->
            <el-card class="eCardSearch">
                <el-form :inline="true" v-model="seach" label-position="left" class="SearchBox">
                    <el-form-item label="消耗品名称">
                        <el-input v-model="seach.Name" placeholder="角色昵称" >
                        </el-input>
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
                <el-table :data="DataList" class="table" :cell-style="rowClass" :header-cell-style="headClass">
                    <el-table-column
                            prop="ct_id"
                            label="消耗品ID">
                    </el-table-column>
                    <el-table-column
                            prop="ct_name"
                            label="消耗品类别名">
                    </el-table-column>
                    <el-table-column
                            prop="receivingunit"
                            label="供应商名称">
                    </el-table-column>
                    <el-table-column
                            label="创建时间"
                            prop='ct_createtime'>
                    </el-table-column>
                    <el-table-column label="使用状态">
                        <template slot-scope="scope">
                            <el-switch
                                    style="display: block"
                                    v-model="scope.row.ct_status"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949"
                                    :active-value='1'
                                    :inactive-value='-1'
                                    @change="activeStatus(scope.row.ct_id,scope.row.ct_status)">
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" min-width="100%">
                        <template slot-scope="scope">
                            <el-button
                                    type="warning" size="mini" icon="el-icon-edit" class="btnEdit"
                                    @click="dialogFormVisible = true;handleEdit(scope.row.ct_id,scope.row)">编辑
                            </el-button>
                            <el-button
                                    type="danger" size="mini" icon="el-icon-delete" class="btnDel"
                                    @click="handleDelete(scope.row.ct_id)">删除
                            </el-button>
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
                    width="25%">
                <el-form :model="AddData" labelPosition="left" labelWidth="120px">
                    <el-form-item label="消耗品类别">
                        <el-input clearable size="medium" v-model="AddData.Name" placeholder="消耗品类别" >
                        </el-input>
                    </el-form-item>
                    <el-form-item label="供应商名称">
                        <el-input
                                type="textarea"
                                placeholder="请输入内容"
                                v-model="AddData.desc"
                                maxlength="30"
                                show-word-limit>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="使用状态">
                        <el-select size="medium" v-model="AddData.status">
                            <el-option label="正常" value='1' ></el-option>
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
    </div>
</template>
<script>
    import breadcrumb from './breadcrumb.vue'
    export default {
        comments: 'Vue',
        components: {
            breadcrumb
        },
        // name: "role",
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
                DataList: [],  // 后台数据
                dialogTableVisible: false,
                dialogFormVisible: false,
                Switch: false,   // 模态框开关
                title_txt: '',  // 模态框标题
                current: 1,
                pageSize: 5,
                total:[],
                ID: '',  // 当前id
                info: '',  // 当前信息
                searchApi:'/api/repertory/showOneConType' , //搜索接口
                deafulApi:'/api/repertory/showAllConsType',  //默认接口
                check:false
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
            //删除方法
            handleDelete(id){
                this.$confirm('此操作将删除该信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post('/api/repertory/delConType', {
                            ct_id: id
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
                            this.reload()
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })


            },
            // 修改所有信息方法
            handleEdit (id,info){
                this.Switch = true
                this.title_txt='修改信息'
                this.ID = id
                this.info = info
                this.AddData.Name = info.ct_name
                this.AddData.desc = info.receivingunit
            },
            //  修改状态方法
            activeStatus(id, stu) {
                this.$axios.post('/api/repertory/changeConType', {
                        ct_id: id,
                        ct_status: stu // 状态 1: 正常 或者 -1 : 锁定  不传则表示所有状态
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
                    this.$axios.post('/api/repertory/showOneConType', {
                            ct_name: this.Name,
                            ct_status: this.seach.stasus,
                            pages:val,  // 当前页数
                            limit:5  // 每页条数
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'token': sessionStorage.getItem('token')
                            }
                        }).then((res) => {
                        this.DataList = res.data.data
                    })



            },
            //刷新方法
            reload() {
                this.$axios.post('/api/repertory/showAllConsType', {
                        pages:this.current,  // F
                        limit:5  // 每页条数
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'token': sessionStorage.getItem('token')
                        }
                    }).then((res) => {
                    console.log(res.data)
                    this.$message.info(res.data.message)
                    this.total =  res.data
                    this.pageSize = res.data.limit
                    // that.$set(that.$data,"DataList",res.data.data);
                    this.DataList = res.data.data
                })
            },
            // 搜索方法
            onSearch () {
                this.current = 1
                const role_name = this.seach.Name
                const role_state = this.seach.stasus
                this.$axios.post('/api/repertory/showOneConType', {
                        ct_name: role_name,
                        ct_status: role_state,
                        pages:1,  // F
                        limit:5  // 每页条数
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'token': sessionStorage.getItem('token')
                        }
                    }).then((res) => {
                    console.log(res.data);
                    if (res.data.code !== 200) {
                        return this.$message.error(res.data.message)
                    } else {
                        this.$message.success(res.data.message)
                    }
                    this.DataList =  res.data.data
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
                    this.title_txt='新增消耗品类名'
                }
            },
            // 保存信息
            Save (){
                if(!this.Switch){
                    const name = this.AddData.Name
                    const status = this.AddData.status
                    const receivingunit = this.AddData.desc
                    this.$axios.post('/api/repertory/addConType', {
                            ct_name: name,
                            ct_status: status,
                            receivingunit:receivingunit
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
                        this.reload()
                    })
                }
                else{
                    this.$axios.post('/api/repertory/changeConType', {
                            ct_id: this.ID,
                            ct_name: this.AddData.Name,
                            ct_status: this.AddData.status,
                            receivingunit:this.AddData.desc

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
                            this.reload()
                        }
                    })
                }
            }
        },
        mounted: function () {
            this.$axios.post('/api/repertory/showOneConType', {
                    pages:1,  // F
                    limit:5  // 每页条数
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'token': sessionStorage.getItem('token')
                    }
                }).then((res) => {
                this.DataList =  res.data.data
                this.total =  res.data
                this.pageSize = res.data.limit
                if(this.AddData.status == -1){
                    this.AddData.status = '锁定'
                }
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
    .ConsumablesTypeListBox{
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
