<template>
  <div>
    <el-col class="home"  :sm='22' :xs='24'>
      <div class=" menu-bar">
        <el-menu  default-active="2"  router='true' class=" el-menu" mode="horizontal">
          <!-- <el-menu-item route="firstGeneration" index='1'>一代车</el-menu-item> -->
          <el-menu-item route="secondGeneration" index='2'>二代车</el-menu-item>
          <el-menu-item route="thirdGeneration" index='3'>三代车</el-menu-item>
        </el-menu>
        <div class="page-bar" >
          <el-select style='width:100px' size='small' placeholder="请选择">
            <el-option

            </el-option>
          </el-select>
          <span>条/页</span>
        </div>
      </div>
      <!-- <el-tabs  >
            <router-link tag="el-tab-pane" append to="/ybdcBicycleManage">用户管理</router-link>
         <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
         <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
         <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
      </el-tabs> -->
      <div class="">
        <keep-alive>
          <router-view ></router-view>
        </keep-alive>
      </div>
    </el-col>
  </div>
</template>

<script>

//import {getData} from '../../service/getData.js'
  export default {
    name: 'fg',
    data () {
      return {
        }
    },
    components: {

    },
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

</style>
