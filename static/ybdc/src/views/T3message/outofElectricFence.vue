<template>
      <el-col class="peopleContent" :span='20'>
        <el-row class="top-content T3message">
          <el-col :span='12' class="col-top">
            <div class='table-container layout-mgt-0'>
              <div class="fl">
                  总计: {{allBike.length}} 辆
                </div>
            	<div class="fr">
                  <span>城市: </span><el-select class="" v-model="selectedCity">
                  	<el-option v-for="item in cityList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                  </el-select>
                  <i class="el-icon-search font cursor-pointer" @click="bikeSearch"></i>
                </div>
				<el-table :data="bikeData" highlight-current-row border style="cursor:pointer">
					<el-table-column prop="code" label="编号"></el-table-column>
					<el-table-column label="最新位置" width="120">
					      <template scope="scope" >
					          <el-button size="small" @click="handleEdit(scope.row)">查看</el-button>
					      </template>
					</el-table-column>
				</el-table>
				<div class="pagenation">
					<el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="10" layout="prev, pager, next, jumper" :total="totalTaskCount">
					</el-pagination>
				</div>
				<hr style="margin-top:65px">
              <!-- <el-table :data="lowpowerCount" highlight-current-row border style="cursor:pointer">
                <el-table-column prop="time" label="时间"></el-table-column>
                <el-table-column prop="classify1" label="0~11%"></el-table-column>
                <el-table-column prop="classify2" label="11%~33%"></el-table-column>
                <el-table-column prop="classify3" label="33%~67%"></el-table-column>
                <el-table-column prop="classify4" label="67%~80%"></el-table-column>
                <el-table-column prop="classify5" label="80%~100%"></el-table-column>
              </el-table> -->
            </div>
          </el-col>
          <el-col :span='12'>
            <div id="mapDiv" class="map-container map-div"></div>
          </el-col>
        </el-row>
        <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        size="tiny">
        <span>位置信息有误！经度(lon):{{false_lon}},纬度(lat):{{false_lat}}</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      </el-col>
</template>

<script>
var map ;
var pageSize = 10;
import $ from 'jquery'
import {jj_map} from '../../utils/index'
import {findBannedBicycles,queryCity,getAllPolygon,getAllcoordinate} from '../../service/getData'
let _map
let markerClusterer
let mark_map = new jj_map()
export default {
  name: 'lowPowerBike',
  data () {
    return {
      bikeData:[],
      lowpowerCount:[],
      currentPage:1,
      totalTaskCount:0,
      dialogVisible: false,
      allBike:[],
      selectedCity:'028',
      cityList:[],
      false_lon:'',
      false_lat:''
    }
  },
  mounted(){
    this.queryCity();
   //this.queryBikeInfo();

  },
  methods:{
    queryCity() {
      queryCity('',(data) => {
        this.cityList = data;
        _map = this.initMap();
        this.panToCity(_map);
        _map.addEventListener("zoomend", function(){
        if(this.getZoom()<13) _map.clearOverlays();
        });
        this.queryBikeInfo()
      })
    },
  	bikeSearch(){
    //  markerClusterer.clearMarkers()
      this.panToCity(_map);
      this.queryBikeInfo()
      // this.initMap();
  		// this.queryBikeInfo()

  		// this.queryBikeStatics()
  	},
    frontPageNation(page,pageSize,allData){

      let startRow = (page - 1) * pageSize,
          endRow = page * pageSize - 1,
          objArr = [];
      if (endRow >=allData.length){
            endRow = allData.length - 1;
        }
      for(;startRow<=endRow;startRow++){
        objArr.push(allData[startRow]);
      }
      return objArr;
    },
	handleCurrentChange(val){
		this.bikeData = this.frontPageNation(val,pageSize,this.allBike)
		//this.queryBikeInfo()
	},
	handleEdit(i){
    if(i.lon==0||i.lat==0){
        this.dialogVisible = true
        this.false_lon = i.lon
        this.false_lat = i.lat
    }else{
      //利用trojian的JJ_map
      let selectMark = mark_map.get(i.code)
      if(selectMark){
        let coord = this.gdToBaidu(i.lon, i.lat)
        let lon = coord.lng
        let lat = coord.lat
        _map.setZoom(19)
        let pt = new BMap.Point(lon,lat)
        _map.addOverlay(selectMark);
        selectMark.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
        _map.panTo(pt)
      }
    }
	},
  panToCity(map){
    var selectedCity = this.selectedCity;
    var cityName = '';
    //map.centerAndZoom(new BMap.Point(116.5,40),9);  // 初始化地图,设置中心点坐标和地图级别
    this.cityList.forEach((val,index) => {
      if(val.code == selectedCity ){
        cityName = val.name;
      }
    })
    map.centerAndZoom(cityName,11) // 初始化地图,设置中心点坐标和地图级别
  },
	initMap(container){
		var map = new BMap.Map(mapDiv);    // 创建Map实例

		//map.addControl(new BMap.MapTypeControl())  //添加地图类型控件
		// //   map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
		map.enableScrollWheelZoom(true)    //开启鼠标滚轮缩放
		return map
    },
    queryBikeInfo(){
        let _this = this
        let params =  {
			       level:'1',
             cityCode:this.selectedCity
		      };
        findBannedBicycles(params,(response) =>{
           this.totalTaskCount = response.length;
           this.allBike = response;
           this.bikeData = this.frontPageNation(this.currentPage,pageSize,this.allBike)
           this.addOver(_map);
          //
        })
    },
    gdToBaidu(lon,lat){
      var  x = lon, y = lat;
      var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
      var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
      var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
      let bd_lon = z * Math.cos(theta) + 0.0065;
      let bd_lat = z * Math.sin(theta) + 0.006;
      var result = {lng:bd_lon,lat:bd_lat};
      return result;
    },
    addOver(map){
      var containerId = map.Va.id,bicylceMarker = []
      let result = this.allBike
      for(var i=0;i<result.length;i++){
        var coordinate = this.gdToBaidu(result[i].lon,result[i].lat)
        var point = new BMap.Point(coordinate.lng,coordinate.lat);
        var marker = new BMap.Marker(point);  // 创建标注
        var label = new BMap.Label(result[i].code,{offset:new BMap.Size(20,-10)});
        label.setStyle(
           {color : "white",
               fontSize : "18px",
               height : "20px",
               lineHeight : "20px",
               fontFamily:"楷体",
               border : "1px",
               backgroundColor : "#0072e3",
               borderRadius: "5px"
           }
        );
        marker.setLabel(label);
        marker.addEventListener('click', function(){
            this.setTop(true);
        });
        bicylceMarker.push(marker)
        mark_map.put(result[i].code,marker);
        // console.log(bicylceMarker)
      }
      markerClusterer = new BMapLib.MarkerClusterer(map, {markers: bicylceMarker});

      getAllPolygon({cityCode:'028'},function(data){
        if(data){
          var size = data.length;
          for(var i =0;i<size;i++){
            var params={p_id:data[i].id};
            var tempP_passable = data[i].passable;
            getAllcoordinate(params,function(coor){
              var size_coor =coor.length;
              var point_polygon=[];
              for(var j=0;j<size_coor;j++){
                point_polygon.push(new BMap.Point(coor[j].lng,coor[j].lat));
              }

              if(tempP_passable==1){
                var	polygon1 = new BMap.Polygon(point_polygon, {
                strokeColor : "red",
                strokeWeight : 2,
                strokeOpacity : 0.9,
                fillOpacity:0.08,//填充透明度
                fillColor:'blue'//填充颜色 貌似如果为空就不填充
              }); //创建多边形
              //polygon.enableEditing();
              polygon1.disableMassClear();
              map.addOverlay(polygon1); //增加多边形
              }else{
                var	polygon2 = new BMap.Polygon(point_polygon, {
                strokeColor : "red",
                strokeWeight : 2,
                strokeOpacity : 0.9,
                fillOpacity:0.3,//填充透明度
                fillColor:'red'//填充颜色 貌似如果为空就不填充
              }); //创建多边形
              //polygon.enableEditing();
              polygon2.disableMassClear();
              map.addOverlay(polygon2); //增加多边形
              }
            })
          }

        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
  $grey:#d3d3d3;
  $border:1px solid #d3d3d3;
  .peopleContent{
    margin:20px;
  }
  .left-content>div{
      width:100%;
      height: 700px;
    }
  .top-content {
      .col-top{
        height: 500px;
      }
  }
  .bottom-content{
    padding:15px;
    .el-row{
      height: 50px;
      line-height: 50px;
      .el-date-editor--date{
        margin:0 15px;
      }
    }
  }
  .el-collapse-item__content>div,.build-task>div{
    line-height: 3;
  }
  .el-checkbox-group{
    display: inline-block;
  }
  .map-div{
    border:$border;
  }
  .map-container{

    margin-left:20px;
  }
  .date-wrapper{
    height:36px;
    line-height:36px;
  }
  .content{
    border:$border;
    height:790px;
    overflow-y:auto;
  }
  .layout-mgt-0{
    margin-top:0px;
  }
  .el-button--small{
    padding:4px 9px;
  }
  .power_select{
  	height:30px;
  }
  .T3message{
	  .el-input__inner{
	  	height:25px;
	  }
	  .el-table td, .el-table th{
	    height:30px;
	  }
  }
  .loginContainer{
	  .el-input__inner{
	  	height:35px!important;
	  }
  }
</style>
