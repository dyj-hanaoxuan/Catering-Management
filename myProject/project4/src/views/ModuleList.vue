<template>
    <div class="ModuleListBox">
        <breadcrumb text="基础信息管理>模块管理"></breadcrumb>
        <!--查询-->
        <el-card class="eCardSearch">
            <el-form :inline="true" :model="formSearch" label-position="left" class="SearchBox">
                <el-form-item label="模块编号">
                    <el-input v-model="formSearch.menuid" placeholder="模块编号"></el-input>
                </el-form-item>
                <el-form-item label="模块名称">
                    <el-input v-model="formSearch.menuname" placeholder="模块名称"></el-input>
                </el-form-item>
                <el-form-item label="模块状态">
                    <el-select v-model="formSearch.menustate">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="启用" value="1"></el-option>
                        <el-option label="禁用" value="-1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="onSubmit" class="btnSearch" round>查询</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <!--商品列表表格数据-->
        <el-card>
            <el-table :data="ModuleList" style="width:100%" class="table" :cell-style="rowClass" :header-cell-style="headClass">
                <el-table-column prop="menuid" label="模块编号" min-width="60%"></el-table-column>
                <el-table-column prop="menuname" label="模块名称" min-width="100%"></el-table-column>
                <el-table-column prop="menufatherid" label="父模块名称" min-width="70%"></el-table-column>
                <el-table-column label="启用状态" min-width="60%">
                    <template slot-scope="scope">
                        <el-switch
                                style="display: block"
                                v-model="scope.row.menustate"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                :active-value='1'
                                :inactive-value='-1'
                                @change="activeStatus(scope.row.menuid,scope.row.menustate)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="100%">
                    <template slot-scope="scope">
                        <el-button type="warning" size="mini" icon="el-icon-edit" @click="dialogFormVisible = true;getId(scope.row)" class="btnEdit">编辑</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row.menuid)" class="btnDel">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!--页码（统一在右边）-->
        <div class="page">
            <el-pagination background
                           @current-change="handleCurrentChange"
                           :current-page="currentPage"
                           :page-size="pageSize"
                           layout="total, prev, pager, next, jumper"
                           :total="pageCount">
            </el-pagination>
        </div>
        <!--模态框-->
        <el-dialog :visible.sync="dialogFormVisible" width="33%" :title="Title">
            <!--编辑-->
            <el-form :model="formEdit">
                <el-form-item style="text-align: center">
                </el-form-item>
                <el-form-item label="模块编号" :label-width="formLabelWidth">
                    <el-input v-model="formEdit.menuid" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="模块名称" :label-width="formLabelWidth">
                    <el-input v-model="formEdit.menuname" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="父模块名称" :label-width="formLabelWidth">
                    <!--<el-input v-model="formEdit.menufatherid" autocomplete="off"></el-input>-->
                    <el-select v-model="fatherId" placeholder="请选择">
                        <el-option
                                v-for="item in fatherArr"
                                :key="item.fatherId"
                                :label="item.fatherName"
                                :value="item.fatherId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="启用状态" :label-width="formLabelWidth">
                    <el-select placeholder="请选择" v-model="formEdit.menustate">
                        <el-option label="启用" value="1"></el-option>
                        <el-option label="禁用" value="-1"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false;save()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { mapGetters,mapActions} from 'vuex'
    import breadcrumb from './breadcrumb.vue'
    export default {
        name: 'ModuleList',
        inject: ['reload'],
        components: {
            breadcrumb
        },
        data () {
            return {
                // 以下为查询所需参数
                formSearch: {
                    menuid: '',
                    menuname: '',
                    menustate: ''
                },
                // 以下为显示数据所需参数
                ModuleList: [],
                pageCount: null,  // 总条数
                menuid: '',   // 模块编号
                menuname: '', // 模块名称
                menustate: '',    // 启用状态
                menufatherid: '',   //父模块编号
                currentPage: 1, // 翻页的步长
                pageSize: 5, // 页容量
                // 以下为模态框所需参数
                dialogTableVisible: false,
                dialogFormVisible: false,
                txt:'',
                formEdit: {
                    menuid: '',
                    menuname: '',
                    menustate: ''
                },
                formOptions:[],
                Title: '',
                formLabelWidth: '120px',
                fatherId: '',   //动态父模块编号
                fatherName: '',//动态父模块名称
                fatherArr:[],//动态父模块数组
                menuInfo: ''//编辑时显示的模块信息
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
            //    页码
            handleCurrentChange (val) {
                var token = sessionStorage.getItem('token')
                this.$axios.post('/api/employee/showAllPers', {
                        pages: val, // 当前页
                        limit: this.pageSize // 页容量
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'token':token
                        }
                    }).then((response) => {
                    this.ModuleList = response.data.data
                    this.pageCount = response.data.count
                    this.pageSize = response.data.limit
                })
            },
            //    查询
            onSubmit () {
                var menuid = this.formSearch.menuid
                var menuname = this.formSearch.menuname
                var menustate = this.formSearch.menustate
                var token = sessionStorage.getItem('token');
                var currentPage = this.currentPage
                console.log('状态啊'+menustate)
                if (menustate === null) {
                    this.$axios.post('/api/employee/showAllPers', {
                            pages: 1, // 当前页
                            limit: 5, // 页容量
                            menustate: ''
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'token': token
                            }
                        }).then((response) => {
                        this.ModuleList = response.data.data
                        this.pageCount = response.data.count
                        this.pageSize = response.data.limit
                    })
                } else {
                    console.log("状态是"+menustate)
                    this.$axios.post('/api/employee/showOnePermission', {
                            menuid: menuid, //  员工编号 模糊查询
                            menuname: menuname, // 员工姓名 模糊查询
                            menustate:menustate,    //  在职状态
                            pages: 1, // 当前页
                            limit: 5 // 页容量
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'token': token
                            }
                        }).then((response) => {
                        this.ModuleList = response.data.data
                        this.pageCount = response.data.count
                        this.pageSize = response.data.limit
                        console.log(response.data)
                    })
                }
            },
            //    删除
            handleDelete (val) {
                var token = sessionStorage.getItem('token');
                console.log('删除操作'+val)
                this.$axios.post('/api/employee/delPermission', {
                        menuid: val
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'token': token
                        }
                    }).then((response) => {
                    if (response.data.code !== 200) {
                        return this.$message.error('删除失败')
                    } else {
                        this.$message.success('删除成功')
                    }
                })
                this.reload()
            },
            //    编辑按钮点击事件
            getId (val) {
                console.log(val)
                this.isAdd = false
                this.Title = '修改模块信息'
                this.menuInfo = val
//                for (var key in this.formEdit) {
//                    this.formEdit[key] = val[key]
//                }
                this.formEdit.menuid =val.menuid
                this.formEdit.menuname = val.menuname
            },
            //     获取动态的父模块编号和父模块名称
            getModuleFatherInfo() {
                var token = sessionStorage.getItem('token');
                var currentPage = this.currentPage
                var pageSize = this.pageSize
                this.$axios.post('/api/employee/showAllFperss', {
                        pages: currentPage, // 当前页
                        limit: pageSize // 页容量
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'token': token
                        }
                    }).then((response) => {
                    this.fatherArr = response.data.data
                    console.log("获取模块信息")
                    console.log(response.data.data)
                })
            },
            //    修改保存
            save () {
                var token = sessionStorage.getItem('token');
                this.$axios.post('/api/employee/changePermission', {
                        menuid: this.formEdit.menuid,
                        menuname: this.formEdit.menuname,
                        menustate: this.formEdit.menustate
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'token': token
                        }
                    }).then((response) => {
                    console.log('无反应'+response.data)
                    if (response.data.code === 200) {
                        return this.$message.success('编辑成功')
                    } else {
                        this.$message.error('编辑失败')
                    }
                })
                this.reload()
            },
            //    修改状态
            activeStatus (menuid, menustate) {
                var token = sessionStorage.getItem('token');
                console.log("hahah"+menustate)
                this.$axios.post('/api/employee/changePermission', {
                        menuid: menuid,
                        menustate: menustate
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'token': token
                        }
                    }).then((response) => {
                        if (response.data.code === 200) {
                            return this.$message.success('编辑成功')
                        } else {
                            this.$message.error('编辑失败')
                        }
                })
            },
            //     获取表格信息
            getModuleListInfo (){
                var currentPage = this.currentPage
                var pageSize = this.pageSize
                this.$axios.post('/api/employee/showAllPers', {
                        pages: currentPage, // 当前页
                        limit: pageSize // 页容量
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'token': sessionStorage.getItem('token')
                        }
                    }).then((response) => {
                    this.ModuleList = response.data.data
                    this.pageCount = response.data.count
                    this.pageSize = response.data.limit
                    this.formOptions = response.data.data
                    console.log("模块管理")
                    console.log(response.data)
                    console.log(123456);
                    for(var i=0;i<this.ModuleList.length;i++){
                        if (this.ModuleList[i].menufatherid == '0') {
                            this.ModuleList[i].menufatherid = '无'
                        } else if (this.ModuleList[i].menufatherid == '1') {
                            this.ModuleList[i].menufatherid = '菜品管理'
                        } else if (this.ModuleList[i].menufatherid == 2) {
                            this.ModuleList[i].menufatherid = '运营管理'
                        }else if (this.ModuleList[i].menufatherid == 3) {
                            this.ModuleList[i].menufatherid = '库存管理'
                        }else if (this.ModuleList[i].menufatherid == 4) {
                            this.ModuleList[i].menufatherid = '订单管理'
                        }else if (this.ModuleList[i].menufatherid == 5) {
                            this.ModuleList[i].menufatherid = '基础信息管理'
                        }else if (this.ModuleList[i].menufatherid == 6) {
                            this.ModuleList[i].menufatherid = '系统设置'
                        }else if (this.ModuleList[i].menufatherid == 7) {
                            this.ModuleList[i].menufatherid = '财务分析'
                        }else if (this.ModuleList[i].menufatherid == 8) {
                            this.ModuleList[i].menufatherid = '回收站'
                        }  else {
                            return
                        }
                    }
                })
            }
        },
        mounted: function () {
            this.getModuleListInfo ()
            this.getModuleFatherInfo()

        }
    }
</script>
<style scoped>
    .page{
        margin-top: 40px;
        text-align: right;
        padding-right: 100px!important;
    }
    .ModuleListBox{
        text-align: center;
        width:100%;
        margin: 0 auto;
        box-sizing: border-box;
    }
    .el-table__body{
        width: 100%;
    }
    .table,.Search{
        text-align: center;
    }
    span.el-dialog__title{
        font-size: 40px!important;
        line-height: 40px;
    }
    .el-form-item__content button{
        margin-left: 40px;
    }
    .Formtitle{
        font-size: 40px;
        height: 50px;
        line-height: 50px;
        margin: 0 0 10px 0;
    }
    .el-form-item__label{
        text-align: left;
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