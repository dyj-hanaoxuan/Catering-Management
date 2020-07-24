<template>
  <div class="HomeBox">
    <el-container>
      <!--顶部-->
      <el-header>
        <div class="userDiv">
          <el-col :span="4">
            <div class="logoText">ATOS</div>
          </el-col>
          <el-col :span="4" :offset="16" :getemployeeInfo="getemployeeInfo">
            <!--<div v-if="isLogin">欢迎您！{{getemployeeInfo.e_name}}<router-link to='/Login'>个人中心</router-link><div @click="Exit">退出</div></div>-->
            <el-col :span="6"><span>欢迎您！</span></el-col>
            <el-col :span="4" v-if="isLogin"><span>{{getemployeeInfo.e_name}}</span></el-col>
            <el-col :span="2">
              <el-dropdown size="small">
                <span class="el-dropdown-link">
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item><router-link to="/personal">个人中心</router-link></el-dropdown-item>
                  <el-dropdown-item>退出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
            <el-col :span="8" v-if="isLogin" class="headImgDiv">
                <img :src="'http://172.16.8.39:8080'+getemployeeInfo.e_icon" alt="" class="headImg">
            </el-col>
            <el-col :span="4"><div @click="Exit" class="exitText">退出</div></el-col>
          </el-col>
        </div>
      </el-header>
      <el-container>
        <!--导航侧边栏-->
        <el-aside width="17%">
          <Menu :menuList="getMenuInfo"></Menu>
        </el-aside>
        <!--内容-->
        <el-main>
          <!--选项卡面包屑-->
          <!--<el-tabs v-model="editableTabsValue" @tab-click="handleClick" type="card" closable @tab-remove="removeTab">-->
            <!--<el-tab-pane-->
                    <!--v-for="(item, index) in editableTabs"-->
                    <!--:key="index"-->
                    <!--:label="item.title"-->
                    <!--:name="item.name">-->
              <router-view></router-view>
            <!--</el-tab-pane>-->
          <!--</el-tabs>-->
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import Menu from '../components/Menu.vue'
  import { mapGetters,mapActions} from 'vuex'
  export default {
      name: 'Home',
      inject: ['reload'],
      components: {
          Menu
      },
      computed:{
          ...mapGetters(['getMenuInfo']),
          ...mapGetters(['getemployeeInfo'])
      },
      data() {
          return {
              isLogin: true
          }
      },
      methods: {
          Exit () {
              this.currentUser = this.$store.getters.currentUser
              this.$store.dispatch('LoginExit')
              this.$router.push('/Login')
          }
      },
      mounted:function(){
      }
  }
</script>
<style scoped>
  *{
    margin: 0;
    padding: 0;
  }
  .HomeBox{
    width: 100%;
    height: 1200px;
  }
  .loginDiv,.el-header{
    box-shadow:0 50px 0 #1a1a1a;
  }
  .headImgDiv{
    display: flex;
    height: 80px;
    align-items: center;
    justify-content: center;
  }
  .headImg{
    display: block;
    width: 50px!important;
    height: 50px!important;
    line-height: 50px;
    border-radius: 50px!important;
  }
  a {
    text-decoration: none;
  }
  .router-link-active {
    text-decoration: none;
  }
  .loginDiv .el-col-4 .el-col-8{
    height:80px;
    line-height: 80px;
    font-size: 22px;
  }
  .exitText{
    font-size: 15px;
  }
  .el-header{
    background-image: linear-gradient(to right, rgb(78,173,253) , rgb(47,211,221));
    color: white;
  }
  .el-header,.userDiv,.logoBox{
    height: 80px!important;
    line-height: 80px;
  }
  .logoText{
    font-size: 70px;
    font-family: 楷体;
    font-weight: bolder;
  }
  .el-main{
    background-color: rgb(249,249,249);
  }
  .el-aside{
    background-color: white;
    height: 100vh;
  }
  .el-icon-arrow-down{
    color: white;
  }

</style>
