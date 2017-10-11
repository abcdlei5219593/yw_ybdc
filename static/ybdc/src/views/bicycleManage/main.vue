<template>
  <div>
    <nv-header ></nv-header>
    <el-row class="layou-content">
      <nv-nav ref='bicycleManageNav' class="bicycleManageNav"></nv-nav>
      <router-view></router-view>
    </el-row>
  </div>
</template>

<script>
  import nvHeader from '../../components/header'
  import nvNav from '../../components/bmNav'
  //import {getData} from '../../service/getData.js'
  export default {
    name: 'main',
    data () {
      return {
      }
    },
    components: {
      nvHeader,
      nvNav
    },
  }


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.layou-content{
  display: flex;
    align-items: stretch;
}
.bicycleManageNav{
  min-height: 800px;
}
  .menu-bar{
    position: relative;
  .el-menu{
    padding-left:0 40px;
  }
  .page-bar{
    position: absolute;
    right:30px;
    top:15px;
  }
  }
</style>
