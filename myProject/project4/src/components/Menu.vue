<template>
    <div class="MenuBox">
        <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-menu
                :default-active="$route.path"
                unique-opened="true"
                router
                mode="vertical"
                text-color="rgb(71,71,71)"
                active-text-color="rgb(1,179,163)"
                v-if="menuList"
                background-color="white"
                @open="handleOpen"
                @close="handleClose"
                class="el-menu-vertical-demo menu">
            <!--主页内容-->
            <router-link to='/index'>
                <el-menu-item>
                    <i class="el-icon-house"></i>
                    <span slot="title">主页</span>
                </el-menu-item>
            </router-link>
            <MenuTree :menuList="menuList"></MenuTree>
        </el-menu>
        </el-scrollbar>
    </div>
</template>
<script>
    import MenuTree from '../components/MenuTree.vue'
    export default{
        name: 'Menu',
        components: {
            MenuTree
        },
        data(){
            return {}
        },
        props:{
            menuList: {
                type: Array,
                required: false
            }
        },
        methods: {
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            }
        }
    }
</script>
<style scoped>
    a {
        text-decoration: none;
    }
    .router-link-active {
        text-decoration: none;
    }
    .el-menu-item{
        height: 80px;
        line-height: 80px;
        font-size: 22px;
        color: rgb(167, 179, 182);
        letter-spacing: 3px;
    }
    .el-menu-item:hover{
        color: rgb(54, 57, 59) !important;
        font-weight: bolder!important;
    }
    .MenuBox{
        padding-top: 50px;
        box-sizing: border-box;
    }
    .MenuBox .menu{
        height: 1200px;
    }
</style>