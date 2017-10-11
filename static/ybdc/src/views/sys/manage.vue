<template>
  <div>
    <nv-header :active='props'></nv-header>
    <el-row>
      <nv-nav></nv-nav>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
    </el-row>

  </div>
</template>

<script>
  import nvHeader from '../../components/header'
  import nvNav from '../../components/sysNav'
  import $ from 'jquery'
  var map ;
  var isClick = false; //是否可以选择地图点  false为不可选取
  export default {
    name: 'manage',
    data () {
      return {
      	props:'/ybdcManage'
        }
    },
    mounted () {
    },
    components: {
      nvHeader,
      nvNav
    },
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

</style>
