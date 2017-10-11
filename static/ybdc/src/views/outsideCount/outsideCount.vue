  import <template>
  <div>
    <nv-header ></nv-header>
    <el-row>
      <nv-nav></nv-nav>
          <div class="" style="padding:30px 0">
            <router-view :countData="getData"></router-view>
          </div>

    </el-row>

  </div>
</template>

<script>
  import nvHeader from '../../components/header'
  import nvNav from '../../components/outsideCountNav'
import {getData} from '../../service/getData.js'
  var map ;
  var isClick = false; //是否可以选择地图点  false为不可选取
  export default {
    name: 'manage',
    data () {
      return {
          getData:{}
        }
    },
    computed:{
  		cityCode(){
  			return this.$store.state.cityCode;
  		}
  	},
    watch:{
        cityCode(code,code2){
          if(code2!=''){
            let cityCode = code;
            this.init(cityCode)
          }
        }
    },
    mounted () {
      this.init(this.cityCode);
    },
    methods:{
      init(cityCode){
        let param = {
            cityCode:cityCode
        }
        getData(param,res => {
            this.getData = res.result;
        })
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

</style>
