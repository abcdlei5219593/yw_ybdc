<template>
	<el-col :xs="24" :sm="2" class="nav" id="nav" ref='nav'>
        <ul>
					<li >

						<el-select align='center' v-model="selectedCity"  @change='changeCity' placeholder="选择城市" style="width:100%;">
						 <el-option
						  	v-for="item in cityData"
							 :label="item.name"
							 :value="item.code"
							>
						 </el-option>
				 </el-select>
					</li>
					<el-col :xs="0" :sm="24" class="xs-hidden">
						<router-link tag="li"   append to="/statistics/ybdcHome">车辆分布统计</router-link>
					</el-col>
					<el-col :xs="0" :sm="24" class="xs-hidden">
							<router-link tag="li" :xs="0" :sm="24" append to="/statistics/ybdcLife">车辆骑行统计</router-link>
					</el-col>
					<el-col :xs="0" :sm="24" class="xs-hidden">
						<router-link tag="li"  :xs="0" :sm="24" append to="/statistics/ybdcUser">用户使用统计</router-link>
					</el-col>
					<el-col :xs="0" :sm="24" class="xs-hidden">
						<router-link tag="li"  :xs="0" :sm="24" append to="/statistics/ybdcUserE">用户存量统计</router-link>
					</el-col>
					<el-col :xs="0" :sm="24" class="xs-hidden">
						<router-link tag="li"  :xs="0" :sm="24" append to="/statistics/ybdcCapitalCount">资金存量统计</router-link>
					</el-col>




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
		// var div1 = document.getElementById('nav');
		// div1.style.height= document.body.scrollHeight+'px';
		queryCity('',data=>{
				this.cityData = data;
		})
	},
	methods:{
		changeCity(){
			this.$store.commit('USER_CITY',this.selectedCity);
		}
	}

}
</script>
<style lang='scss'>
.nav{
    background-color: #7D8085;
		min-height:800px;
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
@media screen and (max-width: 768px){
	.xs-hidden{
		display: none;
	}
	.nav{
		padding-top: 50px;
		min-height:auto;
	}
}

</style>
