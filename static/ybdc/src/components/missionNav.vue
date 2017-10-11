<template>
	<el-col :span="2" class="nav" id="nav">
        <ul>
          <router-link tag="li" append to="/task/ybdcWorkTable">工作安排表</router-link>
          <router-link tag="li" append to="/task/ybdcPeople">巡检</router-link>
          <router-link tag="li" append to="/task/ybdcBreakdown">故障</router-link>
          <router-link tag="li" append to="/task/ybdcRecycle">回收</router-link>
          <router-link tag="li" append to="/task/ybdcSubMission">投放</router-link>
        </ul>
     </el-col>
</template>
<script>
  export default {
    name: 'missionNav',
    mounted(){
      var div1 = document.getElementById('nav');
      div1.style.height= document.body.scrollHeight+'px';
    }
}
</script>
<style lang='scss'>

</style>
