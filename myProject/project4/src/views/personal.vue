<template>
    <div class="StaffListBox">
        <!--面包屑-->
        <breadcrumb text="个人中心"></breadcrumb>
        <el-row>
            <el-col :span="14" :offset="5" class="formBox">
                <el-form ref="form" label-width="100px">
                    <div class="title">基本信息</div>
                    <el-upload
                            class="avatar-uploader"
                            :headers = "headers"
                            action="/api/employee/addimages"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <el-form-item label="账号">
                        <el-input v-model="formEdit.e_id" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="姓名">
                        <el-input v-model="formEdit.e_name"></el-input>
                    </el-form-item>
                    <el-form-item label="账号密码">
                        <el-input v-model="formEdit.e_password"></el-input>
                    </el-form-item>
                    <el-form-item label="性别">
                        <el-radio-group v-model="formEdit.e_sex">
                            <el-radio label="男">男</el-radio>
                            <el-radio label="女">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="生日">
                        <el-date-picker v-model="formEdit.e_birthday" type="date" placeholder="选择日期"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="手机号码">
                        <el-input v-model="formEdit.e_phone"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号">
                        <el-input v-model="formEdit.e_idcard"></el-input>
                    </el-form-item>
                    <el-form-item label="银行卡号">
                        <el-input v-model="formEdit.e_rfid"></el-input>
                    </el-form-item>
                    <el-form-item label-width="0px">
                        <el-button type="primary" @click="Save()" class="btnEdit">保存</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import breadcrumb from './breadcrumb.vue'
    import store from '../store/index'
    import { mapGetters,mapActions} from 'vuex'
    export default{
        name: 'personal',
        inject: ['reload'],
        components: {
            breadcrumb
        },
        computed:{
            ...mapGetters(['getemployeeInfo'])
        },
        data(){
            return {
                headers:{'token':sessionStorage.getItem('token')},
                getemployeeInfo:{},
                formEdit:{
                    e_id: null,
                    e_name: '',
                    e_password: '',
                    e_sex: '',
                    e_birthday: null,
                    e_phone: [],
                    e_idcard: '',
                    e_rfid: '',
                    e_icon: ''
                },
                imageUrl: ''
            }
        },
        methods: {
            //    图片上传
            handleAvatarSuccess(res, file) {
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
            //   获取个人信息
            getPersonalInfo() {
                this.imageUrl = 'http://172.16.8.39:8080'+store.getters.getemployeeInfo.e_icon
                console.log(this.imageUrl)
                this.getemployeeInfo= JSON.parse(sessionStorage.getItem('employeeInfo'))
                this.formEdit.e_id = this.getemployeeInfo.e_id
                this.formEdit.e_name = this.getemployeeInfo.e_name
                this.formEdit.e_sex = this.getemployeeInfo.e_sex
                this.formEdit.e_phone = this.getemployeeInfo.e_phone
                this.formEdit.e_state = this.getemployeeInfo.e_state
                this.formEdit.e_money = this.getemployeeInfo.e_money
                this.formEdit.e_password = this.getemployeeInfo.e_password
                this.formEdit.e_birthday = this.getemployeeInfo.e_birthday
                this.formEdit.e_idcard = this.getemployeeInfo.e_idcard
                this.formEdit.e_rfid = this.getemployeeInfo.e_rfid
                this.formEdit.e_jointime = this.getemployeeInfo.e_jointime
                this.formEdit.role_id = this.getemployeeInfo.role_id
                this.formEdit.e_icon = this.getemployeeInfo.e_icon
                console.log("获取用户信息")
                console.log(this.formEdit.e_id)
            },
            Save() {
                var token = sessionStorage.getItem('token');
                console.log("编辑员工")
                console.log(this.formEdit.e_id)
                this.$axios.post('/api/employee/changeEmp', {
                        e_id: this.formEdit.e_id,
                        e_name: this.formEdit.e_name,
                        e_sex: this.formEdit.e_sex,
                        e_phone: this.formEdit.e_phone,
                        e_state: this.formEdit.e_state,
                        e_money: this.formEdit.e_money,
                        e_password: this.formEdit.e_password,
                        e_birthday: this.formEdit.e_birthday,
                        e_idcard: this.formEdit.e_idcard,
                        e_rfid: this.formEdit.e_rfid,
                        e_jointime: this.formEdit.checkDate,
                        role_id: this.formEdit.role_id,
                        e_icon:this.formEdit.e_icon
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'token': token
                        }
                    }).then((response) => {
                    console.log("数据数据快正确")
                    console.log(response.data)
                    if (response.data.code === 200) {
                        console.log("测试数据中")
                        console.log(response.data.data[0])
                        window.sessionStorage.removeItem('employeeInfo')
                        window.sessionStorage.setItem('employeeInfo',JSON.stringify(response.data.data[0]));
                        this.$message.success('保存成功')
                        this.$router.push('/index')
                    } else {
                        this.$message.error('保存失败')
                    }
                })
            }
        },
        mounted:function () {
            this.getPersonalInfo();
        }
    }
</script>
<style scoped>
    .formBox{
        background-color: white;
        padding: 20px 50px;
        border-radius: 20px;
        box-shadow: 2px 2px 5px #b8b8b8;
    }
    .title{
        font-size: 30px;
    }
    /*文件上传样式*/
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        border-radius: 178px;
        margin: 50px 0;
        display: block;
    }
    i.el-icon-plus.avatar-uploader-icon{
        border: 1px dashed silver !important;
        border-radius: 50%;
        font-size: 50px;
        font-weight: 500;
    }
    .btnEdit{
        width: 200px;
    }
</style>