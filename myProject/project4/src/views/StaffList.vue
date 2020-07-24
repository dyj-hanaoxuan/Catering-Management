<template>
    <div class="StaffListBox">
        <breadcrumb text="基础信息管理>员工管理"></breadcrumb>
        <!--查询-->
        <el-card class="eCardSearch">
            <el-form :inline="true" :model="formSearch" label-position="left" class="SearchBox">
                <el-form-item label="员工编号">
                    <el-input v-model="formSearch.e_id" placeholder="员工编号"></el-input>
                </el-form-item>
                <el-form-item label="员工姓名">
                    <el-input v-model="formSearch.e_name" placeholder="员工姓名"></el-input>
                </el-form-item>
                <el-form-item label="在职状态">
                    <el-select v-model="formSearch.e_state">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="在职" value="1"></el-option>
                        <el-option label="离职" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" round class="btnSearch" @click="onSubmit">查询</el-button>
                    <el-button type="primary" icon="el-icon-plus" round class="btnAdd" @click="dialogFormVisible = true;onAdd()">新增</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <!--商品列表表格数据-->
        <el-card>
            <el-table :data="StaffList" style="width: 100%" class="table" :cell-style="rowClass" :header-cell-style="headClass">
            <el-table-column prop="e_id" label="员工编号" min-width="60%"></el-table-column>
            <el-table-column prop="e_name" label="员工姓名" min-width="60%"></el-table-column>
            <el-table-column prop="e_sex" label="性别" min-width="30%"></el-table-column>
            <el-table-column prop="e_jointime" label="入职时间" min-width="70%"></el-table-column>
            <el-table-column prop="e_phone" label="手机号码" min-width="80%"></el-table-column>
            <el-table-column prop="e_money" label="基本工资" min-width="40%"></el-table-column>
            <el-table-column prop="role_name" label="职位" min-width="40%"></el-table-column>
            <el-table-column label="员工头像" style="width: 10%">
                <template slot-scope= "scope"><img :src="'http://172.16.8.39:8080'+scope.row.e_icon" alt="" class="staffHeader"></template>
            </el-table-column>
            <el-table-column label="在职状态" min-width="50%">
                <template slot-scope="scope">
                    <el-switch
                            style="display: block"
                            v-model="scope.row.e_state"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            :active-value='1'
                            :inactive-value='0'
                            @change="activeStatus(scope.row.e_id,scope.row.e_state)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="120%">
                <template slot-scope="scope">
                    <el-button type="warning" size="mini" icon="el-icon-edit" class="btnEdit" @click="dialogFormVisible = true;getId(scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete" class="btnDel" @click="handleDelete(scope.row.e_id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        </el-card>
        <!--页码（统一在右边）-->
        <div class="block page">
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
            <el-form label-position="left" label-width="auto" class ='ccrow'>
                <!--            上传头像-->
                <el-row>
                    <el-col :span="3">
                        <div>选择头像</div>
                    </el-col>
                    <el-col :span="18" style="text-align: center">
                        <el-upload
                                class="avatar-uploader"
                                action="/api/employee/addimages"
                                :headers = "headers"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload"
                                v-model="formEdit.e_icon">
                            <img v-if="imageUrl" :src="imageUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-col>
                </el-row>
                <!--                姓名编号-->
                <el-row :gutter="30">

                    <el-col :span="12">
                        <el-form-item
                                label="员工姓名"
                                :label-width="formLabelWidth">
                            <el-input
                                    v-model="formEdit.e_name"
                                    autocomplete="off"
                                    placeholder="请输入姓名">
                            </el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="员工编号" :label-width="formLabelWidth">
                            <el-input v-model="formEdit.e_id" autocomplete="off" disabled></el-input>
                        </el-form-item>
                    </el-col>

                </el-row>
<!--性别-->
                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="性别" :label-width="formLabelWidth">
                            <el-radio v-model="formEdit.e_sex" label="男">男</el-radio>
                            <el-radio v-model="formEdit.e_sex" label="女">女</el-radio>
                        </el-form-item>
                    </el-col>
                </el-row>
<!--            员工密码，手机号码-->
                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="员工密码" :label-width="formLabelWidth">
                            <el-input v-model="formEdit.e_password" autocomplete="off" placeholder="请输入密码"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="手机号码" :label-width="formLabelWidth">
                            <el-input v-model="formEdit.e_phone" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--职位在职状态-->
                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="职位">
                            <el-select v-model="role_id" placeholder="请选择">
                                <el-option
                                        v-for="item in RoleArr"
                                        :key="item.role_id"
                                        :label="item.role_name"
                                        :value="item.role_id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="在职状态">
                            <el-select placeholder="在职状态" v-model="formEdit.e_state">
                                <el-option label="选择" value=""></el-option>
                                <el-option label="在职" value="1"></el-option>
                                <el-option label="离职" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--入职时间，基本工资-->
                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="入职时间" :label-width="formLabelWidth">
                            <el-date-picker
                                    v-model="checkDate"
                                    type="date"
                                    placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="基本工资" :label-width="formLabelWidth">
                            <el-input v-model="formEdit.e_money" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
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
    import store from '../store/index'
    export default {
        name: 'StaffList',
        inject: ['reload'],
        components: {
            breadcrumb
        },
        data () {
            return {
                headers:{Authorization:sessionStorage.getItem(Authorization)},
                // 以下为查询所需参数
                formSearch: {
                    e_id: '',
                    e_name: '',
                    e_state: ''
                },
                // 以下为显示数据所需参数
                StaffList: [],
                pageCount: null,  // 总条数
                e_id: '',   // 员工编号
                e_name: '', // 员工姓名
                e_sex: '',  // 性别
                e_jointime: '', // 入职时间
                e_phone: '',    // 员工手机号
                e_state: '',    // 员工状态
                e_money: '',    // 员工基本工资
                e_icon: '',
                role_name: '',
                currentPage: 1, // 翻页的步长
                pageSize: 5, // 页容量
                // 以下为模态框所需参数
                dialogTableVisible: false,
                dialogFormVisible: false,
                txt:'',
                formEdit: {
                    e_id: '',
                    e_name: '',
                    e_sex: '',
                    e_phone: '',
                    e_state: '',
                    e_money: '',
                    e_password: '',
                    e_jointime: '',
                    e_icon: ''
                },
                Title: '',
                isAdd: true,
                RoleArr: [],
                role_id:'',
                checkDate: '',
                formLabelWidth: '',
                imageUrl: '',
                dialogImageUrl: '',
                dialogVisible: false,
                isauto:false,
                StaffInfo: ''   //编辑员工当前信息
            }
        },
        computed:{
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
                console.log(val)
                var token = sessionStorage.getItem(Authorization)
                this.$axios.post('/api/employee/showAllEmps', {
                        pages: val, // 当前页
                        limit: this.pageSize, // 页容量
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization:token
                        }
                    }).then((response) => {
                    this.StaffList = response.data.data
                    this.pageCount = response.data.count
                    this.pageSize = response.data.limit
                })
            },
            //    查询
            onSubmit () {
                this.currentPage =1
                var e_id = this.formSearch.e_id
                var e_name = this.formSearch.e_name
                var e_state = this.formSearch.e_state
                var token = sessionStorage.getItem(Authorization);
                console.log('状态啊'+e_state)
                if (e_state === null) {
                    this.$axios.post('/api/employee/showAllEmps', {
                            pages: this.currentPage, // 当前页
                            limit: 5, // 页容量
                            e_state: ''
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: token
                            }
                        }).then((response) => {
                        this.StaffList = response.data.data
                        this.pageCount = response.data.count
                        this.pageSize = response.data.limit
                    })
                } else {
                    this.$axios.post('/api/employee/showOneEmp', {
                            e_id: e_id, //  员工编号 模糊查询
                            e_name: e_name, // 员工姓名 模糊查询
                            e_state:e_state,    //  在职状态
                            pages: 1, // 当前页
                            limit: 5 // 页容量
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: token
                            }
                        }).then((response) => {
                        this.StaffList = response.data.data
                        this.pageCount = response.data.count
                        this.pageSize = response.data.limit
                        console.log("aaaa")
                        console.log(response.data)
                    })
                }
            },
            //    删除
            handleDelete (val) {
                var token = sessionStorage.getItem(Authorization);
                console.log('删除操作'+val)
                this.$axios.post('/api/employee/delEmp', {
                        e_id: val
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: token
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
                this.Title = '编辑员工信息'
                this.imageUrl = 'http://172.16.8.39:8080'+val.e_icon
//                for (var key in this.formEdit) {
//                    this.formEdit[key] = val[key]
//                }
                this.StaffInfo = val
                this.formEdit.e_id = val.e_id
                this.formEdit.e_name = val.e_name
                this.formEdit.e_phone = val.e_phone
                this.formEdit.e_money = val.e_money
                this.formEdit.e_sex = val.e_sex

            },
            // 增加按钮事件
            onAdd () {
                this.isAdd = true
                this.formEdit.e_id = ''
                this.formEdit.e_name = ''
                this.formEdit.e_phone = ''
                this.formEdit.e_state = ''
                this.formEdit.e_money = ''
                this.formEdit.e_password = ''
                console.log(this.isAdd)
                if(this.isAdd){
                    this.Title = '新增员工信息'
                }

            },
            //    修改状态
            activeStatus (e_id, e_state) {
                var token = sessionStorage.getItem(Authorization);
                this.$axios.post('/api/employee/changeEmp', {
                        e_id:e_id,
                        e_state: e_state
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: token
                        }
                    }).then((response) => {
                    console.log(response.data)
                })
            },
            //    图片上传
            handleAvatarSuccess(res,file) {
                console.log(res)
                console.log(res.data[0])
                console.log(file)
                this.imageUrl = URL.createObjectURL(file.raw);
                console.log(this.imageUrl);
                console.log(res.data[0].e_icon)
                this.formEdit.e_icon = res.data[0].e_icon
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            //    增加和修改
            save () {
                if(this.isAdd){
                    var token = sessionStorage.getItem(Authorization);
                    this.$axios.post('/api/employee/addEmp',{
                            e_id: this.formEdit.e_id,
                            e_name: this.formEdit.e_name,
                            e_sex: this.formEdit.e_sex,
                            e_phone: this.formEdit.e_phone,
                            e_state: this.formEdit.e_state,
                            e_money: this.formEdit.e_money,
                            e_password: this.formEdit.e_password,
                            e_jointime: this.checkDate,
                            role_id: this.role_id,
                            e_icon:this.formEdit.e_icon
                        },
                        {
                            headers: {
//                                'Content-Type': 'multipart/form-data',
                                'Content-Type': 'application/json',
                                Authorization: token
                            }
                        }).then((response) => {
                        console.log('添加信息')
                        console.log(response.data)
                        if (response.data.code !== 200) {
                            return this.$message.error('添加失败')
                        } else {
                            this.$message.success('添加成功')
                        }
                    })
                }else {
                    var token = sessionStorage.getItem(Authorization);
                    this.$axios.post('/api/employee/changeEmp', {
                            e_id: this.formEdit.e_id,
                            e_name: this.formEdit.e_name,
                            e_sex: this.formEdit.e_sex,
                            e_phone: this.formEdit.e_phone,
                            e_state: this.formEdit.e_state,
                            e_money: this.formEdit.e_money,
                            e_password: this.formEdit.e_password,
                            e_jointime: this.checkDate,
                            role_id: this.role_id,
                            e_icon:this.formEdit.e_icon
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: sessionStorage.getItem(Authorization)
                            }
                        }).then((response) => {
                        console.log("修改员工接口")
                        console.log(response.data)
                        if (response.data.code === 200) {
                            return this.$message.success('编辑成功')
                        } else {
                            this.$message.error('编辑失败')
                        }
                    })
                    this.reload()
                }
            },
            //    获取角色编号和角色名称
            getRoleInfo (){
                var token = sessionStorage.getItem(Authorization);
                var currentPage = this.currentPage
                var pageSize = this.pageSize
                this.$axios.post('/api/employee/queryRoles', {
                        pages: currentPage, // 当前页
                        limit: pageSize // 页容量
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: token
                        }
                    }).then((response) => {
                    this.RoleArr = response.data.data
                    console.log("获取角色信息")
                    console.log(response.data)
                })
            },
            //    页面加载获取信息
            getInfor (){
                var currentPage = this.currentPage
                var pageSize = this.pageSize
                this.$axios.post('/api/employee/showAllEmps', {
                        pages: currentPage, // 当前页
                        limit: pageSize // 页容量
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: sessionStorage.getItem(Authorization)
                        }
                    }).then((response) => {
                    this.StaffList = response.data.data
                    this.pageCount = response.data.count
                    this.pageSize = response.data.limit
                    console.log("员工管理")
                    console.log(response.data)
                })
            }
        },
        mounted:function(){
            this.getInfor();
            this.getRoleInfo();
        }
    }
</script>
<style scoped>
    span.el-dialog__title{
        font-size: 40px!important;
        line-height: 40px;
        color:red;
    }
    .staffHeader{
    width: 50px;
    height: 50px;
    border-radius: 50px;
    }
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
    /*文件上传*/
    .avatar-uploader .el-upload {
        border: 1px solid #d9d9d9 !important;
        border-radius: 6px;
        cursor: pointer;
        position: relative !important;
        overflow: hidden;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 90px;
        height: 90px;
        line-height: 90px;
        text-align: center;
    }
    .avatar {
        width: 90px;
        height: 90px;
        display: block;
        border: 1px deepskyblue dashed;
    }
    i.el-icon-plus.avatar-uploader-icon{
        border: 1px dashed silver !important;
        border-radius: 5px;
        font-size: 50px;
        font-weight: 500;
    }
    .ccrow .el-row{
        margin-bottom: 20px;
    }
</style>
