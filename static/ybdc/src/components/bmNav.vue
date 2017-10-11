<template>
	<el-col :span="2" class="nav" id="nav">
    <ul>
			<router-link tag="li" append to="/ybdcBicycleManage/manage">车辆管理</router-link>
			<router-link tag="li" append to="/ybdcBicycleManage/outOfStorage">出入库</router-link>
    </ul>
  </el-col>
</template>
<script>
export default {
	name: 'nav',
	data(){
		return {
			selectedCity:'',
			cityData:''
		}
	},
	mounted(){
		// this.selectedCity = this.$store.state.loginUser.userCities[0].code;
		//  this.$store.commit('USER_CITY',this.selectedCity);

		// queryCity('',data=>{
		// 		this.cityData = data;
		// })
	},
	methods:{
		// changeCity(){
		// 	this.$store.commit('USER_CITY',this.selectedCity);
		// }
	}
}
</script>
<style lang='scss'>
.nav{
    background-color: #7D8085;

    ul {
      .router-link-active {
        color: black;
        background-color: #ECECEC;
      }
      text-align: center;
      -webkit-padding-start: 0px;
      li {
        height: 60px;
        line-height: 60px;
        margin: 0 auto;
        color: white;
        cursor: pointer;
        a span {
          border-bottom: 1px solid rgba(221, 221, 221, 0.5);
          display: inline-block;
          height: 60px;
        }
      }
    }

}
</style>
