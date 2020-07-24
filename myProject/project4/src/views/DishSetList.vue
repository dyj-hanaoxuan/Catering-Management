<template>
    <div class="DishSetListBox">
        <breadcrumb text="基础信息管理>员工管理"></breadcrumb>
        <!--查询-->
        <el-card class="eCardSearch">
            <el-form  :inline="true" label-position="left" class="SearchBox">
                <el-form-item label="员工编号">
                    <el-select  v-model="value" placeholder="请选择">
                        <el-option
                                v-for="item in options"
                                :key="item.id"
                                :label="item.names"
                                :value="item.names">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" round class="btnSearch" @click="onSearch" >查询</el-button>
                    <el-button type="primary" icon="el-icon-plus" round class="btnAdd" @click="dialogFormVisible = true">新增</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card>
            <el-table id="table1"
                      :data="DishSetList"
                      min-width="100%"
                      class="table" :cell-style="rowClass" :header-cell-style="headClass">
                <el-table-column
                        prop="ids"
                        label="菜品编号"
                        min-width="100%">
                </el-table-column>
                <el-table-column
                        label="菜品图片"
                        min-width="100%">
                    <template slot-scope="scope">
                        <img :src="'http://172.16.8.40:8080'+scope.row.photo" alt="">
                    </template>
                </el-table-column>
                <el-table-column
                        prop="names"
                        label="菜品名称"
                        min-width="100%">
                </el-table-column>
                <el-table-column
                        prop="dishes_main_id"
                        label="菜品类别"
                        min-width="80%">
                </el-table-column>
                <el-table-column
                        prop="price"
                        label="菜品价格"
                        min-width="90%">
                </el-table-column>
                <el-table-column
                        prop="remarks"
                        label="菜品描述"
                        min-width="100%">
                </el-table-column>
                <el-table-column label="操作" min-width="130%">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                type="primary" icon="el-icon-edit"
                                @click="handleEdit(scope.row.ids,scope.row.dishes_main_id,scope.row.names,scope.row.price,scope.row.remarks)">编辑</el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                icon="el-icon-delete"
                                @click="handleDelete(scope.row.ids)">删除</el-button>
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
                title="新增菜品"
                :visible.sync="dialogFormVisible"
                width="25%">
            <el-form :model="AddData" labelPosition="left" labelWidth="80px">
                <el-form-item label="菜品名称">
                    <el-input clearable size="medium" v-model="AddData.names" placeholder="菜品名称" >
                    </el-input>
                </el-form-item>
                <el-form-item label="菜品类别">
                    <el-input clearable size="medium" v-model="AddData.dishes_main_id" placeholder="菜品类别" >
                    </el-input>
                </el-form-item>
                <el-form-item label="菜品价格">
                    <el-input clearable size="medium" v-model="AddData.price" placeholder="菜品价格" >
                    </el-input>
                </el-form-item>
                <el-form-item label="菜品描述">
                    <el-input clearable size="medium" v-model="AddData.remarks" placeholder="描述" >
                    </el-input>
                </el-form-item>
                <el-upload
                        class="avatar-uploader"
                        action="/api/upload.do"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                v-model="AddData.photo">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
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
                <el-form-item label="菜品编号">
                    <el-input clearable size="medium" v-model="form.ids" placeholder="菜品编号" disabled="disabled" >
                    </el-input>
                </el-form-item>
                <el-form-item label="菜品类型">
                    <el-input clearable size="medium" v-model="form.dishes_main_id" placeholder="菜品类型" >
                    </el-input>
                </el-form-item>
                <el-form-item label="菜品名称">
                <el-input clearable size="medium" v-model="form.names" placeholder="菜品名称" >
                </el-input>
            </el-form-item>
                <el-form-item label="菜品价格">
                    <el-input clearable size="medium" v-model="form.price" placeholder="菜品价格" >
                    </el-input>
                </el-form-item>
                <el-form-item label="菜品描述">
                    <el-input clearable size="medium" v-model="form.remarks" placeholder="菜品描述" >
                    </el-input>
                </el-form-item>
                <el-upload
                        class="avatar-uploader"
                        action="/api/upload.do"
                        :show-file-list="false"
                        :on-success="success"
                        :before-upload="beforeAvatarUpload1"
                        v-model="form.photo">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible1 = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible1 = false;update()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: '',
        inject:['reload'],
        data: function () {
            return {
                imageUrl: '',
                dialogVisible: false,
                imgUrl:'',//图片上传成功后接收的地址
                ids:"",
                photo:"",
                names:"",
                dishes_main_id:"",
                options:[],
                price:"",
                remarks:"",
                current:1,
                total:0,
                pageSize:4,
                form: {
                    names: "",
                    ids:"",
                    dishes_main_id: "",
                    price: "",
                    remarks:"",
                    photo:""
                },
                AddData: {
                    names: "",
                    dishes_main_id:"",
                    price: "",
                    remarks:"",
                    photo:""
                },
                froma:{
                    id:""
                },
                DishSetList:[],
                dialogTableVisible: false,
                dialogFormVisible: false,
                formLabelWidth: '100px',
                value: '',
                dialogFormVisible1:false
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
            addmember() {
                var names = this.AddData.names
                 var name=this.AddData.name
                var dishes_main_id= this.AddData.dishes_main_id
                var price = this.AddData.price
                var remarks = this.AddData.remarks
                var photo=this.AddData.photo
                this.$axios.post('api/mmt/insert.do', {
                        names: names,
                        dishes_main_id: dishes_main_id,
                        price: price,
                        remarks: remarks,
                        photo:photo,
                        name:name
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                ).then((res) => {
                    this.DishSetList = res.data.data
                    console.log(res)
                    this.reload()
                })
            },
            onSearch(ids){
                console.log(this.value)
                this.$axios.post('api/mmt/query1.do',
                    {
                        "names": this.value,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    },
                ).then((res)=>{
                    console.log(res)
                    this.DishSetList = res.data
                    console.log(this.DishSetList)
                })
            },
            handleDelete(ids) {
                console.log(ids)
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then((res) => {
                    console.log(res)
                    this.reload()
                    this.$axios.post('/api/mmt/update.do', {
                            ids: ids
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                    this.DishSetList=res.data.data

                })
            },
            CurrentChange(val) {
                this.$axios.post('/api/mmt/query.do', {
                        currentPsge: val,
                        pageSize: this.pageSize,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                ).then((res) => {
                        console.log(res)
                        this.DishSetList = res.data.data
                        this.total = res.data.count
                    }
                )

            },
            handleEdit(ids,dishes_main_id,names,price,remarks){
                  this.dialogFormVisible1=true
                  this.form.ids = ids
                  this.form.names = names
                   this.form.dishes_main_id = dishes_main_id
                  this.form.price = price
                  this.form.remarks = remarks
            },
            update() {
                var ids=this.form.ids;
                var names = this.form.names;
                var dishes_main_id = this.form.dishes_main_id;
                var price=this.form.price;
                var remarks=this.form.remarks;
                this.$axios.post('/api/mmt/updates.do', {
                        ids:ids,
                        names:names,
                      dishes_main_id:dishes_main_id,
                        price:price,
                        remarks:remarks,
                        photo:this.form.photo
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                ).then((res) => {
                    console.log(res);
                    this.memberList=res.data
                })
                this.dialogVisible1 = false;
                this.reload()
            },
            // 上传图片成功
            handleAvatarSuccess(res, file) {
                console.log(res)
                console.log(res.data[0])
                console.log(file)
                this.imageUrl = URL.createObjectURL(file.raw);
                console.log(this.imageUrl);
//                console.log(res.data[0].e_icon)
                this.AddData.photo = res.data[0]
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
            success(res, file) {
                console.log(res)
                console.log(res.data[0])
                console.log(file)
                this.imageUrl = URL.createObjectURL(file.raw);
                console.log(this.imageUrl);
//                console.log(res.data[0].e_icon)
                this.form.photo = res.data[0]
            },
            beforeAvatarUpload1(file) {
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
        },
        mounted:function () {
            this.$axios.post('api/mmt/query.do',{
                currentPsge: this.current,
                pageSize : this.pageSize,
                 price:this.price
                },{
                headers: {
                    'Content-Type': 'application/json'
                }
                }
            ).then((res)=>{
                console.log(res)
                this.DishSetList=res.data.data
                this.total=res.data.count
                console.log(this.count)
            })
            this.$axios.post('/api/mmt/sel.do',
                {
                    headers: {
                        'Content-Type': 'application/json'}
                }
            ).then((res) => {
                console.log(res)
                this.options = res.data
                this.option=res.data
            })
        }
    }
</script>
<style scoped>
    img{
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }
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
        display: block;
    }
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