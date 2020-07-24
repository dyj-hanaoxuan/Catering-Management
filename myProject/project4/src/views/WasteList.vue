<template>
    <div class="WasteListBox">
        <breadcrumb text="回收站"></breadcrumb>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="员工管理回收" name="first">

            </el-tab-pane>
            <el-tab-pane label="消耗品回收" name="second">配置管理</el-tab-pane>
            <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import breadcrumb from './breadcrumb.vue'
    export default{
        name: '',
        components: {
            breadcrumb
        },
        data(){
            return {
                activeName: 'second',
                currentPage: 1,
                pageSize: 5
            }
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event);
            },
            //  获取员工回收信息
            getStaffInfo(){
                var currentPage = this.currentPage
                var pageSize = this.pageSize
                this.$axios.post('/api/recycle/showAllDelEmps', {
                        pages: this.currentPage, // 当前页
                        limit: this.pageSize // 页容量
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'token': sessionStorage.getItem('token')
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
        mounted:function () {
            this.getStaffInfo()
        }

    }
</script>
<style scoped>

</style>