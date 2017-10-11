<template>
	<el-col :span="2" class="nav" id="nav">
        <ul>
          <router-link tag="li" append to="/ybdcManage/user">用户</router-link>
          <router-link tag="li" append to="/ybdcManage/role">角色</router-link>
          <router-link tag="li" append to="/ybdcManage/setMenu">菜单</router-link>
				  <router-link tag="li" append to="/ybdcManage/team">运维团队</router-link>
          <router-link tag="li" append to="/ybdcManage/storeHouse">仓库</router-link>
          <router-link tag="li" append to="/ybdcManage/city">城市</router-link>
           <li @click="openSecondNav">
             数据字典

           </li>
          <li>
            <transition name="fade">
              <ul class="second-nav" v-if="showSecondNav">
                <!-- <router-link tag="li" append to="/ybdcManage/taskData">任务类型</router-link> -->
                <router-link tag="li" append to="/ybdcManage/profileData">文件类型</router-link>
							  <router-link tag="li" append to="/ybdcManage/faultData">故障类型</router-link>
              </ul>
            </transition>
          </li>

        </ul>
     </el-col>
</template>
<script>
  export default {
    name: 'ybdcSysNav',
    data(){
        return{
          showSecondNav:false,

        }
    },
    mounted(){
      var div1 = document.getElementById('nav');
      div1.style.height= document.body.scrollHeight+'px';
    },
    methods:{
      openSecondNav(){
          this.showSecondNav = ! this.showSecondNav
      }
    }
}
</script>
<style lang='scss'>
.fade-enter-active,.fade-leave-active{
  transition: all 0.5s ease
}

.fade-enter, .fade-leave-active{
  transition: all 0.5s ease
}
</style>
