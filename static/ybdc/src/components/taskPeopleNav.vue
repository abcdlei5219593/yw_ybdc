<template>
	<el-col :span="2" class="nav" id="nav">
        <ul>
          <router-link tag="li" append to="/people/ybdcTaskPeople">人员</router-link>
			    <router-link tag="li" append to="/people/ybdcDataAnalysis">数据分析</router-link>
          <!-- <router-link tag="li" append to="/ybdcThrow">投放统计</router-link> -->
        </ul>
     </el-col>
</template>
<script>
import $ from 'jquery'
  export default {
    name: 'taskPeopleNav',
    mounted(){
      var div1 = document.getElementById('nav');
      div1.style.height= document.body.scrollHeight+'px';
    }
}
</script>
<style lang='scss'>

</style>
