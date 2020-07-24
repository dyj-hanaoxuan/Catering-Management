<template>
    <div class="MenuTreeBox">
        <template v-for='menu in menuList'>
            <!--{{menu.menuChilds.length}}-->
            <!--如果当前有子菜单，则显示子菜单el-submenu，并调用递归（调用自身组件）-->
            <el-submenu v-if='menu.menuChilds.length>0' :index='menu.menuurl' :key="menu.menuid" >
                <template slot="title">
                    <i v-if="menu.menulmgclass" :class="menu.menulmgclass"></i>
                    <span slot="title">{{ menu.menuname }}</span>
                </template>
                <!-- 调用自身组件-->
                <MenuTree :menuList='menu.menuChilds'></MenuTree>
            </el-submenu>
            <!--如果没有子菜单，则显示一级菜单-->
            <el-menu-item v-else :index='menu.menuurl' :key='menu.menuid'>
                <i v-if="menu.menulmgclass" :class="menu.menulmgclass"></i>
                <span slot="title">{{ menu.menuname }}</span>
            </el-menu-item>
        </template>
    </div>
</template>
<script>
    import MenuTree from '../components/MenuTree.vue'
    import ElSubmenu from "../../../../myProject/project4/node_modules/element-ui/packages/menu/src/submenu";
    export default{
        components: {ElSubmenu,MenuTree},
        name: 'MenuTree',
        data(){
            return {}
        },
        props:{
            menuList: {
                type: Array,
                required: false
            }
        },
        methods:{
        }
    }
</script>
<style>
    .MenuTreeBox .el-submenu .el-menu-item,.MenuTreeBox .el-menu-item, .MenuTreeBox .el-submenu .el-submenu__title{
        height: 90px;
        line-height: 90px;
        font-size: 22px;
        color: rgb(167, 179, 182);
        box-sizing: border-box;
    }
    .MenuTreeBox{
        letter-spacing: 3px;
    }
    .MenuTreeBox .el-submenu [class^=el-icon-],.MenuTreeBox .el-menu-item [class^=el-icon-],.MenuBox .el-menu-item [class^=el-icon-]{
        font-size: 25px;
        color: rgb(167, 179, 182);
        margin-left: -50px;
        margin-right: 25px;
    }
    .MenuTreeBox .el-icon-user{
        padding-left: 50px;
        color: rgb(167, 179, 182);
    }
    .MenuTreeBox .el-icon-delete{
        margin-left: -70px!important;
        color: rgb(167, 179, 182);
    }
    .MenuBox .el-icon-house{
        margin-left: -100px!important;
        color: rgb(167, 179, 182);
    }
    .MenuTreeBox li.el-menu-item:hover,.MenuTreeBox .el-submenu__title:hover,.MenuBox .el-menu-item:hover{
        background-color: rgb(235,239,255)!important;
        background-image: linear-gradient(to right,rgb(255,255,255),rgb(206,255,251));
        color: rgb(54, 57, 59) !important;
        border-right: 3px solid rgb(15,185,169)!important;
        font-weight: bolder!important;
    }
    .MenuTreeBox .el-submenu__title:hover [class^=el-icon-],.MenuTreeBox .el-menu-item:hover,.MenuBox .el-menu-item:hover,.MenuBox .el-menu-item:hover .el-icon-house{
        color: rgb(54, 57, 59)!important;
    }
</style>