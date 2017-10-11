 <template>
  <div>
    <nv-header ></nv-header>
    <el-row>
      <nv-nav></nv-nav>
        <div class="">
          <router-view ></router-view>
        </div>
    </el-row>
  </div>
</template>

<script>
import nvHeader from '../../components/header'
import nvNav from '../../components/taskPeopleNav.vue'
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
.map-container{
  width:100%;
  height:790px;

}
</style>
