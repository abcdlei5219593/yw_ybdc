<template>
	<el-col :span="2" class="nav" id="nav">
        <ul>
			<li>
				<el-select v-model="selectedCity"  @change='changeCity' placeholder="选择城市" style="width:80%">
					<el-option v-for="item in cityData" :label="item.name" :value="item.code"></el-option>
		 		</el-select>
			</li>
            <router-link tag="li" append to="/outsideCount/ybdcHome">车辆分布统计</router-link>
            <router-link tag="li" append to="/outsideCount/ybdcLife">车辆骑行统计</router-link>
            <router-link tag="li" append to="/outsideCount/ybdcUser">用户使用统计</router-link>
            <router-link tag="li" append to="/outsideCount/ybdcUserE">用户存量统计</router-link>
		    <router-link tag="li" append to="/outsideCount/ybdcCapitalCount">资金存量统计</router-link>
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
		exportData(){
			window.open(baseUrl+"/poiExport/export");
		}
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
