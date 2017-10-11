<template>
	<el-col :span="2" class="nav" id="nav">
        <ul>
            <router-link tag="li" append to="/T3message/noMessageBike">昨日未通信车辆</router-link>
            <router-link tag="li" append to="/T3message/lowPowerBike">低电量[三代车]</router-link>
						<router-link tag="li" append to="/T3message/outofElectricFence">电子围栏外车辆</router-link>
						<router-link tag="li" append to="/T3message/inBuildingFence">小区围栏内车辆</router-link>
						<router-link tag="li" append to="/T3message/lowFrequency">低频车辆</router-link>
        </ul>
     </el-col>
</template>
<script>
import $ from 'jquery'
import {queryCity} from '../service/getData.js'
  export default {
    name: 'nav',
		data(){
			return {
				selectedCity:'',
				cityData:''
			}
		},
    mounted(){
		this.selectedCity = this.$store.state.loginUser.userCities[0].code;
		this.$store.commit('USER_CITY',this.selectedCity);
	    var div1 = document.getElementById('nav');
	    div1.style.height= document.body.scrollHeight+'px';
		queryCity('',data=>{
		  for(let i = 0;i<data.length;i++){
				if(data[i].code == '0571' || data[i].code == '025'){
					data.splice(i, 1);
					i -= 1;
				}
			}
			this.cityData = data;
		})
    },
	methods:{
		changeCity(){
			this.$store.commit('USER_CITY',this.selectedCity);
		},
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
