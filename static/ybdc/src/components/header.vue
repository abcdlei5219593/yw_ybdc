<template>
    <div>
      <header>
        <el-row >
          <el-col :span="2" class="logo"><div><img src="../assets/logo.png"></div></el-col>
          <el-col :span="16" >
            <el-row  class="top-menu layout-mgf-100">
              <el-col :span="2"  v-for="item in menuList"><router-link tag="div" append  :to="item.url" >{{item.name}}</router-link></el-col>
            </el-row>
          </el-col>
          <el-col :span="5" :push="16" class="menu-item">
            <div class="menu-icon" @click='showMenu=!showMenu'></div>
          </el-col>
          <el-col :span="6" class="quit-position">
            <span>欢迎你，【{{role}}】&nbsp;{{name}}</span>
            <span class="cursor-pointer" @click='quitOut'>退出</router-link></span></el-col>
        </el-row>
      </header>
      <!-- 手机端显示的菜单栏，PC下不显示 -->
     <transition name="fade">
        <menu v-if="showMenu"  @click='showMenu=!showMenu'>
          <router-link tag="div" class="menu-cell" append to="/statistics/ybdcHome">车辆分布统计</router-link>
          <router-link tag="div" class="menu-cell" append to="/statistics/ybdcLife">车辆骑行统计</router-link>
          <router-link tag="div" class="menu-cell" append to="/statistics/ybdcUser">用户使用统计</router-link>
          <router-link tag="div" class="menu-cell" append to="/statistics/ybdcUserE">用户存量统计</router-link>
          <router-link tag="div" class="menu-cell" append to="/statistics/ybdcCapitalCount">资金存量统计</router-link>
        </menu>
      </transition>
    </div>

</template>
<script>
import $ from 'jquery';
import store from '../vuex/store'
import {userLoginOut} from '../service/getData'
require('jquery.cookie')
export default {
  name: 'ybdcHeader',
  data(){
    return {
      menuList:[],
      showMenu:false,
      role:'',
      name:''
    }
  },
  mounted (){
    let loginUser = store.state.loginUser;
    if(!loginUser){
      loginUser = this.getLoginUser();
    }
    this.role = loginUser.roles[0].name;
    this.name = loginUser.nickName;
    if(store.state.firstMenu.length != 0 ){
      this.menuList = store.state.firstMenu;
    }else{
      this.menuList = JSON.parse(localStorage.getItem("menues"));
    }
    document.onkeydown = {};
  },
  methods:{
    getLoginUser(loginUser = JSON.parse(localStorage.getItem('userLogin'))){
      if(loginUser) {
        store.commit('USER_LOGIN',loginUser);
        return loginUser
      }else {
        this.$alert('请先登录！', '错误提示', {
              confirmButtonText: '确定',
        });
      }
    },

    quitOut(){
      let _this = this;
      userLoginOut('',data=>{
        if(data.success){
          $.cookie('sessionId','',{ expires: -1 }); //删除COOKIE
          localStorage.removeItem("userLogin");
          _this.$message({
            message: data.msgContent,
            type: 'success'
          });
        }else{
            _this.$alert(data.msgContent, '错误提示', {
              confirmButtonText: '确定',
          });
        }
        _this.$router.push('/login');
      })
    }
  },

}
</script>
<style lang='scss' scoped>
li {
  list-style-type: none;
}
.cursor-pointer{
  cursor: pointer;
  text-decoration: underline;
  color: red;
  margin-left: 20px;
}
header{
    background-color: #434A54;
    color: white;
    .logo{
      height: 80px;
      padding:17.5px;
      display: flex;
      align-items: center;
      div img {
          width:100%;

        }
    }
    .router-link-active {
      color: white;
      background-color: #313842;
    }
    .routerLinkActive{
      color: white;
      background-color: #313842;
    }
    .top-menu{
      font-size: 15px;
      display: flex;
      justify-content:center;
      .el-col{
        height: 80px;
        line-height: 80px;
        text-align: center;
        cursor: pointer;
      }
    }
    .top-menu .active {
      background-color: #313842;
    }
    .quit-position{
      text-align:center;
      line-height: 80px;
    }

}
.menu-item{
  display: none;
}
@media screen and (max-width: 768px){
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-active {
    opacity: 0
 }
  .top-menu,.quit-position{
    display: none !important;
  }
  header{
    position: fixed;
    width: 100%;
    z-index: 99;
  }
  header .logo{
    height: 50px;
    padding: 10px;
    div{
      height: 100%;
      img{
        height: 100%;
        width: auto;
      }
    }
  }
  .menu-item{
    display: block;
    text-align: right;
    height: 50px;
    padding: 15px 10px;
    .menu-icon{
      display: inline-block;
      height: 100%;
      width: 24px;
      background: url('../assets/icon-menu.png') no-repeat 0 0/100% 100%;
    }
  }
  menu{
    background: #fff;
    width: 100%;
    position: fixed;
    top: 50px;
    left: 0;
    z-index: 9999999999999;
    .menu-cell{
      border-bottom: 1px solid #d3d3d3;
      padding-left: 15px;
      height: 50px;
      line-height: 50px;
    }
    .router-link-active{
      color: #fff;
      background-color:#0B85B6;
    }
  }
  .home{
    padding: 0;
  }
}
</style>
