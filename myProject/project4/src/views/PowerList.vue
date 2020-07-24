<template>
    <div class="PowerListBox">
        <breadcrumb text="基础信息管理>权限管理"></breadcrumb>
        <!--权限列表表格数据-->
        <el-card>
            <el-table :data="PowerList" style="width: 100%" id="table" :cell-style="rowClass" :header-cell-style="headClass">
                <el-table-column prop="role_id" label="角色编号" style="width:11%"></el-table-column>
                <el-table-column prop="role_name" label="角色名称" style="width:25%"></el-table-column>
                <el-table-column prop="role_updatetime" label="修改时间" style="width:11%"></el-table-column>
                <el-table-column prop="operator" label="操作人" style="width:11%"></el-table-column>
                <el-table-column prop="role_desc" label="角色描述" style="width:11%"></el-table-column>
                <el-table-column label="操作" style="width:11%">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="dialogFormVisible = true;getId(scope.row)" size="mini" class="btnEdit" icon="el-icon-edit">编辑权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!--模态框-->
        <el-dialog :visible.sync="dialogFormVisible" width="33%" :title="Title">
            <!--编辑-->
            <el-form>
                <el-form-item label="角色编号" :label-width="formLabelWidth">
                    <el-input v-model="formEdit.role_id" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="角色名称" :label-width="formLabelWidth">
                    <el-input v-model="formEdit.role_name" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-tree
                        :data="AllModuleData"
                        show-checkbox
                        node-key="menuId"
                        :default-expanded-keys="[2, 3]"
                        :default-checked-keys="formEdit.ModuleCheckedArr"
                        :props="defaultProps"
                        ref="tree"
                        @check-change="getCheckedChange">
                </el-tree>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false;EditPower()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { mapGetters,mapActions} from 'vuex'
    import breadcrumb from './breadcrumb.vue'
    export default {
        name: 'PowerList',
        inject: ['reload'],
        components: {
            breadcrumb
        },
        data () {
            return {
                // 以下为显示数据所需参数
                PowerList: [],   //  权限管理列表数据数组
                role_name: '',   // 角色名称
                menuName: '', // 模块名称
                role_updatatime: '', // 角色修改时间
                operator: '',    // 操作人
                role_desc: '',    // 角色描述
                // 以下为模态框所需参数
                dialogTableVisible: false,
                dialogFormVisible: false,
                formEdit: {
                    role_id: '',
                    role_name: '',
                    ModuleCheckedArr: [],
                },
                AllModuleData:[], // 全部模块数组
                defaultProps: {
                    children: 'menuChilds',
                    label: 'menuName'
                },
                checkerTreeArr: [],
                formOptions:[],
                Title: '',
                formLabelWidth: '100px'
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
            getCheckedChange (){
                let res = this.$refs.tree.getCheckedKeys()
                this.checkerTreeArr = []
                res.forEach((item) =>{
                    if(item){
                        this.checkerTreeArr.push(item)
                    }
                })

            },
            //    编辑按钮点击事件
            getId (val) {
                this.Title = '编辑权限'
                this.formEdit.role_id = val.role_id
                this.formEdit.role_name = val.role_name
                this.formEdit.ModuleCheckedArr = val.menuId
                var token = sessionStorage.getItem('token');
                this.$axios.post('/api/employee/showAllFpersAndCpers',
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'token': token
                        }
                    }).then((response) =>{
                    this.AllModuleData = response.data.data
                })
            },
            //    编辑权限
            EditPower (){
                var token = sessionStorage.getItem('token');
                this.$axios.post('/api/employee/editRolePers',{
                    role_id:this.formEdit.role_id,
                    menuid:this.checkerTreeArr

                },{
                    headers: {
                        'Content-Type': 'application/json',
                        'token': token
                    }
                }).then((response) => {
                    console.log(response.data)
                    if (response.data.code === 200) {
                        return this.$message.success('编辑成功')
                    } else {
                        this.$message.error('编辑失败')
                    }
                })
            },
            //    页面加载获取信息
            getInfor () {
                var token = sessionStorage.getItem('token');
                console.log('这是给后台的token'+token)
                var currentPage = this.currentPage
                var pageSize = this.pageSize
                this.$axios.post('/api/employee/showAllRolePers',
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'token': token
                        }
                    }).then((response) => {
                    this.PowerList = response.data.data
                    console.log("权限管理")
                    console.log(response.data.data)
                })
            },
        },
        mounted: function () {
            this.getInfor();
        }
    }
</script>
<style scoped>
    .page{
        margin-top: 40px;
        text-align: right;
        padding-right: 100px!important;
    }
    .PowerListBox{
        text-align: center;
        width:100%;
        margin: 0 auto;
        box-sizing: border-box;
    }
    .el-table__body{
        width: 100%;
    }
    #table,.Search{
        text-align: center;
    }
    span.el-dialog__title{
        font-size: 40px!important;
        line-height: 40px;
    }
    .el-form-item__content button{
        margin-left: 40px;
    }
    .el-dialog__header .el-dialog__title{
        font-size: 25px;
    }
    .btnEdit{
        background-color: rgb(63,99,255);
        border: none;
    }
</style>