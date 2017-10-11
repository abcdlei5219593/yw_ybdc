<template>
    <el-col class="home"  :sm='22' :xs='24'>
      <div class=" menu-bar">
        <el-menu default-active="1" :router='true' class="el-menu" mode="horizontal">
          <el-menu-item :route="{path:'/ybdcBicycleManage/outOfStorage/inStorage'}" index='1'>在库车辆</el-menu-item>
          <el-menu-item :route="{path:'/ybdcBicycleManage/outOfStorage/waitInStorage'}" index='2'>待入库车辆</el-menu-item>
          <el-menu-item :route="{path:'/ybdcBicycleManage/outOfStorage/inStorageLog'}" index="3-2">入库日志</el-menu-item>
          <el-menu-item :route="{path:'/ybdcBicycleManage/outOfStorage/outStorageLog'}" index="3-1">出库日志</el-menu-item>
        </el-menu>
        <div class="page-bar">
          <el-select style='width:100px' size='small' placeholder="请选择" v-model="pageSize" @change="changeHandle">
           <el-option v-for='item in pageSizeSelect'
              :label='item'
              :value='item'>
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
          <router-view :pageSize='pageSize'></router-view>
        </keep-alive>
      </div>
    </el-col>
</template>

<script>

//import {getData} from '../../service/getData.js'
  export default {
    name: 'container',
    data () {
      return {
        pageSizeSelect:[10,20,30,50],
        pageSize:10
        }
    },
    methods:{
      changeHandle(value){
          this.pageSize = value
      }
    },
    components: {

    },
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

</style>
