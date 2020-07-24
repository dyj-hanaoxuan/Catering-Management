<template>
    <div class="ConsumablesListBox">
        <breadcrumb text="库存管理>消耗品管理"></breadcrumb>
        <!--查询-->
        <el-card class="eCardSearch">
            <el-form :inline="true" :model="formSearch" label-position="left" class="SearchBox">
                <el-form-item label="消耗品编号">
                    <el-input v-model="formSearch.c_id" placeholder="消耗品编号"></el-input>
                </el-form-item>
                <el-form-item label="消耗品名称">
                    <el-input v-model="formSearch.c_name" placeholder="消耗品名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="onSubmit" round class="btnSearch">搜索</el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="dialogFormVisible = true;onAdd()" round class="btnAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card>
            <!--商品列表表格数据-->
            <el-table :data="ConsumablesList" style="width: 100%" class="table" :cell-style="rowClass" :header-cell-style="headClass">
                <el-table-column prop="c_id" label="消耗品编号" style="width:12.5%"></el-table-column>
                <el-table-column prop="c_name" label="消耗品名称" style="width:12.5%"></el-table-column>
                <el-table-column prop="c_quantity" label="数量" style="width:12.5%"></el-table-column>
                <el-table-column prop="c_unit" label="单位" style="width:12.5%"></el-table-column>
                <el-table-column prop="c_price" label="单价" style="width:12.5%"></el-table-column>
                <el-table-column prop="ct_name" label="类别" style="width:12%"></el-table-column>
                <el-table-column label="操作" style="width:12.5%">
                    <template slot-scope="scope">
                        <el-button size="mini" icon="el-icon-edit" class="btnEdit" @click="dialogFormVisible = true;getId(scope.row)">编辑</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" class="btnDel" @click="handleDelete(scope.row.c_id)">删除</el-button>
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
            <el-form :model="formEdit" label-width="auto">
                <el-form-item style="text-align: center">
                </el-form-item>
                <el-form-item label="消耗品编号" :label-width="formLabelWidth">
                    <el-input v-model="formEdit.c_id" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="消耗品名称" :label-width="formLabelWidth">
                    <el-input v-model="formEdit.c_name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="数量" :label-width="formLabelWidth">
                    <el-input v-model="formEdit.c_quantity" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="单位" :label-width="formLabelWidth">
                    <el-input v-model="formEdit.c_unit" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="单价" :label-width="formLabelWidth">
                    <el-input v-model="formEdit.c_price" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="类别">
                    <el-select v-model="id" placeholder="请选择">
                        <el-option
                                v-for="item in ConsumablesTypeArr"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
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
    import ElCard from "../../../../myProject/project4/node_modules/element-ui/packages/card/src/main";
    export default {
        name: 'ConsumablesList',
        inject: ['reload'],
        components: {
            ElCard,
            breadcrumb
        },
        data () {
            return {
                // 以下为查询所需参数
                formSearch: {
                    c_id: '',
                    c_name: ''
                },
                // 以下为显示数据所需参数
                ConsumablesList: [],
                pageCount: null,  // 总条数
                c_id: '',   // 消耗品编号
                c_name: '', // 消耗品名称
                c_price: '', // 消耗品价格
                c_quantity: '',  // 消耗品数量
                c_unit: '',    //单位
                ct_name: '',    // 员工基本工资
                currentPage: 1, // 翻页的步长
                pageSize: 5, // 页容量
                isadd: false, //判断是否是新增模态框
                // 以下为模态框所需参数
                dialogTableVisible: false,
                dialogFormVisible: false,
                formEdit: {
                    c_id: '',
                    c_name: '',
                    c_price: '',
                    c_quantity: '',
                    c_unit: '',
                    ct_name: ''
                },
                ctArr:[],
                ct_id: '',
                Title: '',
                isAdd: true,
                name: '',// 消耗品类型名称
                id: '', //消耗品类型id
                ConsumablesTypeArr: [],// 消耗品类型数组
                formLabelWidth: ''
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
                this.$axios.post('/api/repertory/showOneCons', {
                        pages: val, // 当前页
                        limit: this.pageSize // 页容量
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'token':token
                        }
                    }).then((response) => {
                    console.log(123);
                    console.log(response);
                    this.ConsumablesList = response.data.data
                    this.pageCount = response.data.count
                    this.pageSize = response.data.limit
                })
            },
            //    查询
            onSubmit () {
                this.currentPage = 1
                var token = sessionStorage.getItem('token');
                this.$axios.post('/api/repertory/showOneCons', {
                        c_id: this.formSearch.c_id, //  员工编号 模糊查询
                        c_name: this.formSearch.c_name, // 员工姓名 模糊查询
                        pages: 1, // 当前页
                        limit: 5 // 页容量
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'token': token
                        }
                    }).then((response) => {
                    console.log("查询")
                    console.log(response.data)
                    this.ConsumablesList = response.data.data
                    this.pageCount = response.data.count
                    this.pageSize = response.data.limit
                })
            },
            //    删除
            handleDelete (val) {
                var token = sessionStorage.getItem('token');
                console.log('删除操作'+val)
                this.$axios.post('/api/repertory/delCon', {
                        c_id: val
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
                this.Title = '编辑消耗品'
                for (var key in this.formEdit) {
                    this.formEdit[key] = val[key]
                }
            },
            // 增加按钮事件
            onAdd () {
                this.isAdd = true
                this.formEdit.c_id = ''
                this.formEdit.c_name = ''
                this.formEdit.c_price = ''
                this.formEdit.c_quantity = ''
                this.formEdit.c_unit = ''
                this.formEdit.ct_name = ''
                console.log(this.isAdd)
                if(this.isAdd){
                    this.Title = '新增消耗品'
                }

            },
            //    增加和修改
            save () {
                if(this.isAdd){
                    var token = sessionStorage.getItem('token');
                    this.$axios.post('/api/repertory/addCon', {
                            c_id: this.formEdit.c_id,
                            c_name: this.formEdit.c_name,
                            c_price: this.formEdit.c_price,
                            c_quantity: this.formEdit.c_quantity,
                            c_unit: this.formEdit.c_unit,
                            ct_name: this.formEdit.ct_name,
                            ct_id: this.ct_id
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
                }else {
                    var token = sessionStorage.getItem('token');
                    this.$axios.post('/api/repertory/changeCon', {
                            c_id: this.formEdit.c_id,
                            c_name: this.formEdit.c_name,
                            c_price: this.formEdit.c_price,
                            c_quantity: this.formEdit.c_quantity,
                            c_unit: this.formEdit.c_unit,
                            ct_name: this.formEdit.ct_name,
                            ct_id: this.ct_id
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
                }
            },
            //
            getConsumablesTypeInfo (){
                this.$axios.post('/api/repertory/showAllConsTypeAndId', {
                        pages: this.currentPage, // 当前页
                        limit: this.pageSize // 页容量
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'token': sessionStorage.getItem('token')
                        }
                    }).then((response) => {
                    this.ConsumablesTypeArr = response.data.data
                    console.log("获取消耗品信息")
                    console.log(response.data)
                })
            },
            //    获取表格数据（加载后）
            getInfo (){
                var token = sessionStorage.getItem('token');
                var currentPage = this.currentPage
                this.$axios.post('/api/repertory/showAllCons', {
                        pages: 1, // 当前页
                        limit: this.pageSize // 页容量
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'token': token
                        }
                    }).then((response) => {
                    this.ConsumablesList = response.data.data
                    this.pageCount = response.data.count
                    this.pageSize = response.data.limit
                    console.log(response.data)
                    console.log(response.data)
                    console.log(response.data.data)
                })
            }
        },
        mounted: function () {
            this.getInfo ()
            this.getConsumablesTypeInfo ()
        }
    }
</script>
<style scoped>
    .page{
        margin-top: 40px;
        text-align: right;
        padding-right: 100px!important;
    }
    .ConsumablesListBox{
        text-align: center;
        width:100%;
        margin: 0 auto;
        box-sizing: border-box;
    }
    .el-table__body{
        width: 100%;
    }
    .table{
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
        color: white;
        border: none;
    }
    .btnDel{
        border: none;
    }
</style>