 <template>
  <div>
    <nv-header ></nv-header>
    <el-row>
      <nv-nav></nv-nav>
          <div class="" >
            <router-view ></router-view>
          </div>

    </el-row>
  </div>
</template>

<script>
import nvHeader from '../../components/header'
import nvNav from '../../components/nav'
  export default {
    name: 'main',
    data () {
      return {
        }
    },
    components: {
      nvHeader,
      nvNav
    }
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

  @media screen and (max-width: 768px){
    .home{
      padding: 0 !important;
    }
    .el-tabs--border-card>.el-tabs__content {
      padding: 0
    }
    .el-tabs__header{}
  }
</style>
