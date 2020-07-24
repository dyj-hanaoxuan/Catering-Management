<template>
    <div class="login-box">
        <div class="login">
                    <div class="logo">
                        ATOS.
                    </div>
            <el-form
                    :model="formdata"
                    label-position="left"
                    label-width="80px"
                    :rules="rules"
                    ref="formdata"
                    size="large">
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="用户名" prop="username">
                            <el-input
                                    v-model="formdata.username"
                                    placeholder="请输入用户名"
                                    prefix-icon="el-icon-user"
                                    clearable
                                    size="large">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="18" >
                        <el-form-item label="密码" prop="Pwd">
                            <el-input
                                    placeholder="请输入密码"
                                    v-model="formdata.Pwd"
                                    show-password
                                    prefix-icon="el-icon-lock"
                                    clearable
                                    >
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-checkbox v-model="checked">记住密码</el-checkbox>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20" >
                        <el-button
                                id="btn-login"
                                @click="login()"
                                type="primary">
                            登录
                        </el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <!--<video-->
         <!--muted="muted"-->
         <!--loop="loop"-->
         <!--autoplay>-->
            <!--<source src="../assets/img/login.mp4" type="video/mp4">-->
        <!--</video>-->
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import dongRouter from './../router/dongRouter'
    export default {
        name: "login",
        data() {
            return {
                checked: true,
                formdata: {
                    username: '',
                    Pwd: ''
                },
                rules:{
                    username: [
                        {
                            required: true,
                            message: '输入用户名',
                            trigger: 'blur' },
                        {
                            pattern:/^[A-Za-z0-9]{5,13}$/,
                            message: '请输入5-9位的用户名（字母或者数字）',
                            trigger: 'blur' }
                    ],
                    Pwd: [
                        { required: true, message: '输入密码', trigger: 'blur' },
                        { min: 1, max: 13, message: '长度在 6 到 13 个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
//            login(){
//                var menuArr={
////                    menuInfo:[
////                        {menuId: 2, menuName: "用户管理理", menuUrl: "/user/userlist",pathname:"userlist",componentPath:"User/UserList",menuImgClass: 'el-icon-s-custom', menuState: "0", menuChilds: []},
////                        {
////                            menuId: 3, menuName: "角色管理理理", menuUrl: "/role",pathname:"role", componentPath:"",menuImgClass: 'el-icon-eleme', menuState: "0",
////                            menuChilds: [
////                                {menuId: 7, menuName: "添加角色", menuUrl: "/addrole",pathname:"addrole", componentPath:"AddRole",menuImgClass: '', menuState: "0", menuChilds: [
////                                    {menuId: 8, menuName: "角色详情", menuUrl: "/roleInfo",pathname:"roleInfo", componentPath:"RoleInfo",menuImgClass: '', menuState: "0", menuChilds: []}
////                                ]},
////                                {menuId: 8, menuName: "角色列表", menuUrl: "/rolelist",pathname:"rolelist",componentPath:"RoleList", menuImgClass: '', menuState: "0", menuChilds: []}
////                            ]
////                        },
////                        {menuId: 4, menuName: "权限管理", menuUrl: "/rolemodal",pathname:"rolemodal", componentPath:"RoleModal/RoleModal",menuImgClass: 'el-icon-s-help', menuState: "0", menuChilds: []},
////                        {menuId: 5, menuName: "部门管理", menuUrl: "/deptment",pathname:"deptment", componentPath:"Deptment/DeptmentList",menuImgClass: 'el-icon-s-tools', menuState: "0", menuChilds: []}
//////                        {menuId: 1, menuName: "菜品管理", menuUrl: "/menu",pathname:"",componentPath:"",menuImgClass: 'el-icon-dish', menuState: "0",
//////                            menuChilds: [{menuId: 9, menuName: "菜品设置", menuUrl: "/DishSetList",pathname:"DishSetList", componentPath:"DishSetList",menuImgClass: '', menuState: "0", menuChilds: []},
//////                                {menuId: 10, menuName: "菜品类型", menuUrl: "/DishTypeList",pathname:"DishTypeList", componentPath:"DishTypeList",menuImgClass: '', menuState: "0", menuChilds: []}
//////                        ]},
//////
//////                        { menuId: 2, menuName: "运营管理", menuUrl: "/business",pathname:"", componentPath:"",menuImgClass: 'el-icon-files', menuState: "0",
//////                            menuChilds: [{menuId: 11, menuName: "营业管理", menuUrl: "/BusinessList",pathname:"BusinessList", componentPath:"BusinessList",menuImgClass: '', menuState: "0", menuChilds: []},
//////                                {menuId: 12, menuName: "餐桌管理",menuUrl:"/diningTableList",pathname:"diningTableList",componentPath:"diningTableList",menuImgClass: '', menuState: "0", menuChilds: []},
//////                            {menuId: 13, menuName: "会员管理", menuUrl: "/MemberList",pathname:"MemberList", componentPath:"MemberList",menuImgClass: '', menuState: "0", menuChilds: []}]},
//////
//////                        { menuId: 3, menuName: "库存管理", menuUrl: "/Consumables",pathname:"", componentPath:"",menuImgClass: 'el-icon-box', menuState: "0",menuChilds: [{menuId: 14, menuName: "消耗品管理", menuUrl: "/ConsumablesList",pathname:"ConsumablesList", componentPath:"ConsumablesList",menuImgClass: '', menuState: "0", menuChilds: []},
//////                            {menuId: 15, menuName: "消耗品类型", menuUrl: "/ConsumablesTypeList",pathname:"ConsumablesTypeList",componentPath:"ConsumablesTypeList",menuImgClass: '', menuState: "0", menuChilds: []}
//////                        ]},
//////
//////                        { menuId: 4, menuName: "订单管理", menuUrl: "/OrderList",pathname:"OrderList", componentPath:"OrderList",menuImgClass: 'el-icon-tickets', menuState: "0",menuChilds: []},
//////
//////                        { menuId: 5, menuName: "基础信息管理", menuUrl: "Base",pathname:"", componentPath:"",menuImgClass: 'el-icon-user', menuState: "0",
//////                            menuChilds: [{menuId: 16, menuName: "员工管理", menuUrl: "/StaffList",pathname:"StaffList", componentPath:"StaffList",menuImgClass: '', menuState: "0", menuChilds: []},
//////                                {menuId: 17, menuName: "角色管理", menuUrl: "/RoleList",pathname:"RoleList", componentPath:"RoleList",menuImgClass: '', menuState: "0", menuChilds: []},
//////                                {menuId: 18, menuName: "权限管理", menuUrl: "/PowerList",pathname:"PowerList", componentPath:"PowerList",menuImgClass: '', menuState: "0", menuChilds: []},
//////                                {menuId: 19, menuName: "模块管理", menuUrl: "/ModuleList",pathname:"ModuleList", componentPath:"ModuleList",menuImgClass: '', menuState: "0", menuChilds: []}]},
//////
//////                        { menuId: 6, menuName: "系统设置", menuUrl: "System",pathname:"", componentPath:"",menuImgClass: 'el-icon-setting', menuState: "0",
//////                            menuChilds: [{menuId: 20, menuName: "数据备份", menuUrl: "/DataBackupList",pathname:"DataBackupList", componentPath:"DataBackupList",menuImgClass: '', menuState: "0", menuChilds: []},{menuId: 21, menuName: "操作日志",menuUrl:"/OplogList",pathname:"OplogList",componentPath:"OplogList",menuImgClass: '', menuState: "0", menuChilds: []}]},
//////
//////                        { menuId: 7, menuName: "财务分析", menuUrl: "chaiwu",pathname:"", componentPath:"",menuImgClass: 'el-icon-bank-card', menuState: "0",menuChilds: [{menuId: 22, menuName: "财务管理", menuUrl: "/FinancialList",pathname:"FinancialList", componentPath:"FinancialList",menuImgClass: '', menuState: "0", menuChilds: []},{menuId: 23, menuName: "成本管理",menuUrl:"/CostList",pathname:"CostList",componentPath:"CostList",menuImgClass: '', menuState: "0", menuChilds: []},{menuId: 24, menuName: "其他支出",menuUrl:"/OtherList",pathname:"OtherList",componentPath:"OtherList",menuImgClass: '', menuState: "0", menuChilds: []}]},
//////
//////                        { menuId: 8, menuName: "回收站", menuUrl: "/WasteList",pathname:"WasteList", componentPath:"WasteList",menuImgClass: 'el-icon-delete', menuState: "0",menuChilds: []},
////                    ],
//                    menuInfo:[
//                        {menuId: 1, menuName: "菜品管理", menuUrl: "/Dish",pathname:"Dish",componentPath:"",menuImgClass: 'el-icon-dish', menuState: "0",
//                            menuChilds: [{menuId: 9, menuName: "菜品设置", menuUrl: "/DishSetList",pathname:"DishSetList", componentPath:"DishSetList",menuImgClass: '', menuState: "0", menuChilds: []},
//                                {menuId: 10, menuName: "菜品类型", menuUrl: "/DishTypeList",pathname:"DishTypeList", componentPath:"DishTypeList",menuImgClass: '', menuState: "0", menuChilds: []}
//                        ]},
//
//                        { menuId: 2, menuName: "运营管理", menuUrl: "/Business",pathname:"Business", componentPath:"",menuImgClass: 'el-icon-files', menuState: "0",
//                            menuChilds: [{menuId: 11, menuName: "营业管理", menuUrl: "/BusinessList",pathname:"BusinessList", componentPath:"BusinessList",menuImgClass: '', menuState: "0", menuChilds: []},
//                                {menuId: 12, menuName: "餐桌管理",menuUrl:"/diningTableList",pathname:"diningTableList",componentPath:"diningTableList",menuImgClass: '', menuState: "0", menuChilds: []},
//                                {menuId: 13, menuName: "会员管理", menuUrl: "/MemberList",pathname:"MemberList", componentPath:"MemberList",menuImgClass: '', menuState: "0", menuChilds: []}]},
//
//                        { menuId: 3, menuName: "库存管理", menuUrl: "/Consumables",pathname:"Consumables", componentPath:"",menuImgClass: 'el-icon-box', menuState: "0",
//                            menuChilds: [{menuId: 14, menuName: "消耗品管理", menuUrl: "/ConsumablesList",pathname:"ConsumablesList", componentPath:"ConsumablesList",menuImgClass: '', menuState: "0", menuChilds: []},
//                            {menuId: 15, menuName: "消耗品类型", menuUrl: "/ConsumablesTypeList",pathname:"ConsumablesTypeList",componentPath:"ConsumablesTypeList",menuImgClass: '', menuState: "0", menuChilds: []}
//                        ]},
//
//                        { menuId: 4, menuName: "订单管理", menuUrl: "/OrderList",pathname:"OrderList", componentPath:"OrderList",menuImgClass: 'el-icon-tickets', menuState: "0",menuChilds: []},
//
//                        { menuId: 5, menuName: "基础信息管理", menuUrl: "/Staff",pathname:"Staff", componentPath:"",menuImgClass: 'el-icon-user', menuState: "0",
//                            menuChilds: [{menuId: 16, menuName: "员工管理", menuUrl: "/StaffList",pathname:"StaffList", componentPath:"StaffList",menuImgClass: '', menuState: "0", menuChilds: []},
//                                {menuId: 17, menuName: "角色管理", menuUrl: "/RoleList",pathname:"RoleList", componentPath:"RoleList",menuImgClass: '', menuState: "0", menuChilds: []},
//                                {menuId: 18, menuName: "权限管理", menuUrl: "/PowerList",pathname:"PowerList", componentPath:"PowerList",menuImgClass: '', menuState: "0", menuChilds: []},{menuId: 19, menuName: "模块管理", menuUrl: "/ModuleList",pathname:"ModuleList", componentPath:"ModuleList",menuImgClass: '', menuState: "0", menuChilds: []}]},
//
//                        { menuId: 6, menuName: "系统设置", menuUrl: "/System",pathname:"System", componentPath:"",menuImgClass: 'el-icon-setting', menuState: "0",
//                            menuChilds: [{menuId: 20, menuName: "数据备份", menuUrl: "/DataBackupList",pathname:"DataBackupList", componentPath:"DataBackupList",menuImgClass: '', menuState: "0", menuChilds: []},
//                            {menuId: 21, menuName: "操作日志",menuUrl:"/OplogList",pathname:"OplogList",componentPath:"OplogList",menuImgClass: '', menuState: "0", menuChilds: []}]},
//
//                        { menuId: 7, menuName: "财务分析", menuUrl: "/Financial",pathname:"Financial", componentPath:"",menuImgClass: 'el-icon-bank-card', menuState: "0",
//                            menuChilds: [{menuId: 22, menuName: "财务管理", menuUrl: "/FinancialList",pathname:"FinancialList", componentPath:"FinancialList",menuImgClass: '', menuState: "0", menuChilds: []},
//                                {menuId: 23, menuName: "成本管理",menuUrl:"/CostList",pathname:"CostList",componentPath:"CostList",menuImgClass: '', menuState: "0", menuChilds: []},
//                                {menuId: 24, menuName: "其他支出",menuUrl:"/OtherList",pathname:"OtherList",componentPath:"OtherList",menuImgClass: '', menuState: "0", menuChilds: []}]},
//
//                        { menuId: 8, menuName: "回收站", menuUrl: "/WasteList",pathname:"WasteList", componentPath:"WasteList",menuImgClass: 'el-icon-delete', menuState: "0",menuChilds: []},
//
//                        { menuId: 25, menuName: "主页", menuUrl: "/index",pathname:"index", componentPath:"index",menuImgClass: 'el-icon-delete', menuState: "0",menuChilds: []}
//                    ],
//                    employeeInfo:[
//                        {id:7,userName:"sunshine",Pwd:"123",userHeader:"Cat.png",RoleId:1},
//                        {id:8,userName:"sunshine2",Pwd:"1234",userHeader:"Cat.png",RoleId:1}
//                    ]
//                }
//                console.log(menuArr.employeeInfo[0])
//                console.log(this.formdata.username)
//                console.log(this.formdata.Pwd)
//                if(this.formdata.username == menuArr.employeeInfo[0].userName){
//                    console.log('123')
//                    this.$store.dispatch('loginSuccess', menuArr)
//                    dongRouter.DynamicAddRouter()
//                    // 跳转到home组件
//                    this.$router.push('/home')
//                }
//            }

            login () {
                var that=this
                var loginName = this.formdata.username
                var loginPwd = this.formdata.Pwd
                console.log(loginName)
                console.log(loginPwd)
                this.$axios.post('/api/employee/login', {
                        e_id: loginName,
                        e_password: loginPwd
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then((response) => {
                    console.log(response.data)
                    if (response.data.code !== 200) {
                        return this.$message.error('登录失败')
                    } else {
                        this.$message.success('登录成功')
                        //将用户名放入vuex（dispatch 异步操作 this.$store.dispatch('actions的方法'，arg)）
//                        this.$store.dispatch('loginSuccess',response.data.data[0])
                        this.$store.dispatch('loginSuccess',response.data)
                        window.sessionStorage.setItem('e_icon',JSON.stringify(response.data.data[0].employeeInfo.e_icon));
                        dongRouter.DynamicAddRouter()
                        //打印login状态
                        console.log(this.$store.state.isLogin)
                        //跳转到主页
                        that.$router.push('/index')
                    }
                })
            }
        }
    }
</script>

<style scoped>
    *{
        margin: 0;
        padding: 0;
    }
    .login-box{
        width: 100%;
        height: 100vh;
        background-image: url("../assets/img/loginBg.jpg");
        background-repeat: no-repeat;
        background-size: cover;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .login{
        width: 35%;
        height: 500px;
        border-radius: 10px;
        background-color: rgba(255,255,248,.6);
        padding-left: 100px;
        box-sizing: border-box;
        box-shadow:0px 2px 19px 1px rgba(69,47,133,0.5);
    }
    .login .el-row:nth-of-type(2n){
        margin-bottom: 20px;
        margin-top: 20px;
    }
    .login .el-row:first-child{
        margin-top: 80px;
    }
    #btn-login{
        width: 80%;
        height: 45px;

    }
    .logo{
        background-color: rgb(63,99,255);
        color: white;
        font-weight: 900;
        /*text-align: left;*/
        font-size: 70px;
        font-family: 楷体;
        width: 300px;
        position: relative;
        left: -90px;
        top:-30px;
        border-radius: 15px;
        box-shadow:0 0 35px 10px rgba(69,47,133,0.5);
    }
    >>> .el-input__inner{
            height: 55px;
        }
    /*video{*/
        /*min-width: 100%;*/
        /*min-height: 100%;*/
        /*height: auto ;*/
        /*width: auto;*/
        /*position: fixed !important;*/
        /*right: 0px;*/
        /*bottom: 0px;*/
        /*z-index: -99;*/
    /*}*/
    /*source{*/
    /*    min-width: 100%;*/
    /*    min-height: 100%;*/
    /*    height: 100vh;*/
    /*    width: auto !important;*/
    /*}*/
</style>