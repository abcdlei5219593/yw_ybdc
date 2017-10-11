<template>
	<div>

    <el-col class="home" :md='22' :xs='24'>
      <el-row >
        <el-col :md="18" :xs="24">
          <div id="lipei_erhuo" class="map"></div>
          <div class="btn-div fl">
    	      <el-button @click="test(null)">分布热点</el-button>
    	      <el-button @click="test('open')">开锁热点</el-button>
    	      <el-button @click="test('close')">关锁热点</el-button>
    	      <el-button @click="test('disappear')">报废热点</el-button>
          </div>
        </el-col>
        <el-col :md="6" :xs="24">
        	<!-- <div class="box-margin">
        		<el-date-picker type="date" v-model="date1" placeholder="选择日期" size="small" @change="getDate1" format="yyyy-MM-dd"></el-date-picker>
        		<el-button size="small" @click="exportData">导出数据</el-button>
        	</div> -->
			<el-card class="box-card">
				<p><label for="">当前累计投放:</label></label><span>{{countData.putCount}} 辆</span></p>
				<p><label for="">当前累计骑行:</label><span>{{countData.cyclingCount}} 次</span></p><br /><br />
			</el-card>
        </el-col>
      </el-row>
    <!-- <div class="charts-container">
			<div id="main1"   class="fl charts" v-loading="loading"></div>
			<div id="main2"  class="fl charts" v-loading="loading"></div>
		</div> -->
    </el-col>

	</div>

</template>

<script>

  import {getAllBicycle,getUnlockingAll,getLockingAll,getDisappear} from '../../service/getData'
  var echarts = require('echarts');
  var map ;
  var heatmapOverlay;
	const cityCenterpoint = {
		'028':{  //  成都
			lng:104.072258,
			lat:30.663445
		},
		'021':{  // 上海
			lng:121.480237,
			lat:31.236305
		},
		'010':{ //北京
			lng:116.403874,
			lat:39.914889
		},
		'0755':{  // 深圳
			lng:114.066112,
			lat:22.550384
		},
	}
export default {
	name: 'home',
	data () {
	    return {
	      	msg: '',
			loading:true,
	      	articles:[]
	      	// date1:''
	    }
	},
	props:{
		"countData":{
			type:Object
    	}
  	},
	computed:{
		cityCode(){
			return this.$store.state.cityCode;
		}
	},
    mounted(){
	  	map = new BMap.Map("lipei_erhuo");
	    var mPoint = new BMap.Point(cityCenterpoint[this.cityCode].lng,cityCenterpoint[this.cityCode].lat);
	  	map.enableScrollWheelZoom(true);
	  	map.centerAndZoom(mPoint,12);
	    let _this = this;
	},
	watch:{
		cityCode(code,code2){
			if(code2!=''){
				let cityCode = code;
				this.panMap(cityCode)
			}
		}
	},
	methods:{
		panMap(cityCode){
			let point =  new BMap.Point(cityCenterpoint[cityCode].lng,cityCenterpoint[cityCode].lat);
			map.panTo(point)
		},
		// exportData(){
		// 	window.open(baseUrl+"/poiExport/export?dateStr="+this.date1);
		// },
		drawMap(data){
			map.removeOverlay(heatmapOverlay);
			heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":10});
			map.addOverlay(heatmapOverlay);
			heatmapOverlay.setDataSet({data:data.result.result,max:100});
			heatmapOverlay.show();
		},
        // getDate1(i){
        //   this.date1 = i;
        // },
		test(q){
      let param = {
          cityCode:this.cityCode
      }
			if(q==null){
				getAllBicycle(param,data => {
						this.drawMap(data)
				  })
			}else if(q=="open"){
				getUnlockingAll(param,data => {
					this.drawMap(data)
			  })

			}else if(q=="close"){
				getLockingAll(param,data => {
					this.drawMap(data)
			  })
			}else if(q=="disappear"){
				getDisappear(param,data => {
					this.drawMap(data)
			  })
			}
		},
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.box-margin{
	margin:15px;
}
.home{
	padding:15px;
}
ul{
  list-style: none;
  margin: 0;
  padding: 0;
}
ul li{
border-bottom: 1px solid #999;
padding: 10px 0;
}

.inl-block{
display: inline-block;
}
.map{
	width:100%;
	height:600px;
}
.btn-div{
	width:45%;
	position:absolute;
	top: 10px;
}
.box-card{
	margin:15px;
	height:580px;
	p{
		line-height: 3;
		label{
			color: #5e6d82;
			margin-right:10px;
		}
	}
}
.charts{
	width: 48%;
	height:400px;
}
#chart2{
	margin-left:3%
}
@media screen and (max-width: 768px){
	.nav{
		display: none;
	}
	.home{
		margin-top:50px;
		.btn-div{

			.el-button{
				margin-left: 5px;
				margin-top: 5px;
				display: block;
			}
		}
		.box-card{
			margin: 15px 0;
			height: auto;
		}
		.charts-container{
				padding: 15px;
		}
		.charts{
			width: 100%;
		}
		#chart2{
			margin:0;
		}
	}
	.map{
		height: 400px;

	}
}
</style>
