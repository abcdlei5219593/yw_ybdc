<template>
  <div id="div1">
      <div class='loginContainer'>
        <img src="../assets/logo1.png" class="layout-mgt-200"><br><br>
    		<el-input v-model='account' placeholder='请输入账号'></el-input><br><br>
    		<el-input v-model='code' placeholder='请输入密码' type="password"></el-input><br><br>
  		  <el-button @click="submit" :loading="loading">登录</el-button>
      </div>
  </div>
</template>

<script>
import $ from 'jquery'
require('jquery.cookie')
import {userLogin} from '../service/getData'
import store from '../vuex/store'
export default {
  name: 'login',
  data () {
    return {
    	account:'',
    	code:'',
      loading:false,
    }
  },
  mounted () {
    var div1 = document.getElementById('div1');
    div1.style.height= $(window).height()+'px';
    document.onkeydown=this.keyDownSearch;
  },
  methods:{
  	submit () {
  	  var dataParam = {
	        username:this.account,
	        password:this.code
	    }
	    var router = this.$router;
      var _this = this;
      this.loading = true;
      console.log(_this)
		  userLogin(dataParam,function(data){
 			  if(data.success){
            let path = _this.showPhone() ? {path: '/statistics/ybdcHome'} : {path: data.result.user.menus[0].url}//移动端和PC端匹配不同的路由
            console.log(data.result.user.menus[0].url)
            $.cookie('sessionId', data.result.sessionId, {path: '/' });
            store.commit('USER_LOGIN',data.result.user);
            localStorage.setItem("userLogin",JSON.stringify(data.result.user));
            localStorage.setItem("menues",JSON.stringify(data.result.user.menus));
            store.commit('USER_MENU',data.result.user.menus);
            router.push(path);
		  		}else{
            _this.$alert(data.msgContent,'错误提示', {
              confirmButtonText: '确定',
            });
          }
          _this.loading = false;
		  })
	  },
    keyDownSearch(e) {
        var _this = this;
        // 兼容FF和IE和Opera
        var theEvent = e || window.event;
        var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
        if (code == 13) {
            _this.submit();
            return false;
        }
        return true;
    },
    showPhone(){
       let u = navigator.userAgent;
       if (u.indexOf('Android') > -1 || u.indexOf('iPhone') > -1){
           return true
       }else{
           return false
       }
     }
  },
  computed:{

  },
  vuex: {
    actions:{
      userLogin:({ dispatch }, data) =>{
        dispatch('USER_LOGIN',data);
      }
    }
  }
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  #div1{
    background:#75B6D2;
  }

  .layout-mgt-200{
    margin-top:200px;
  }
  .loginContainer{
    width:300px;
    height:100%;
    margin:auto;
    text-align: center;
    img,button{
      width:100%;
    }
    button{
      background:#0B85B6;
      color:white;
      border:none
    }
  }
  @media screen and (max-width: 768px){
  .loginContainer{
    width: 80%;
    img{
      width: 70%;
      margin-top:100px;
      margin-bottom: 25px;
    }
    button{
      height:40px;
    }
  }
}
.el-input__inner{
  height:35px !important;
}
</style>
