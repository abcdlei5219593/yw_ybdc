<template>
      <el-col class="peopleContent" :span='20'>
        <el-row class="top-content T3message">
          <el-col :span='12' class="col-top">
            <div class='fl table-container layout-mgt-0'>
              <el-table :data="bikeData" highlight-current-row border style="cursor:pointer">
                <el-table-column prop="code" label="编号"></el-table-column>
                <el-table-column prop="time" label="最后通信时间"></el-table-column>
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
              <el-table :data="messageCount" highlight-current-row border style="cursor:pointer">
                <el-table-column prop="time" label="时间"></el-table-column>
                <el-table-column prop="unReport" label="未通信总数"></el-table-column>
                <el-table-column prop="newAdd" label="新增未通信"></el-table-column>
                <el-table-column prop="recovery" label="恢复通信数"></el-table-column>
              </el-table>
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
var map
import $ from 'jquery'
import {jj_map} from '../../utils/index'
import {getBikeInfo,getBikeStatics,getAllUnreport} from '../../service/getData'
let _map
let mark_map = new jj_map();
let markerZindex = 1;
export default {
  name: 'noMessageBike',
  data () {
    return {
      bikeData:[],
      messageCount:[],
      currentPage:1,
      totalTaskCount:0,
      allBike:[],
      dialogVisible: false,
      false_lon:'',
      false_lat:''
    }
  },
  mounted(){
    this.queryBikeStatics()
    _map = this.initMap()
    this.queryBikeInfo()
    this.queryAllUnreport()
    _map.addEventListener("zoomend", function(){
      if(this.getZoom()<13) _map.clearOverlays();
    });
  },
  methods:{
      handleCurrentChange(val){
        console.log(val);
        this.currentPage = val;
        this.queryBikeInfo()
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
            // let label = new BMap.Label(i.code,{offset:new BMap.Size(20,-10)});
            // label.setStyle(
            //    {color : "#0072e3",
            //        fontSize : "18px",
            //        height : "20px",
            //        lineHeight : "20px",
            //        fontFamily:"楷体",
            //        border : "1px",
            //        backgroundColor : "#fff",
            //        borderRadius: "5px"
            //    }
            // );
            // selectMark.setLabel(label);
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
      queryBikeInfo(){
        let _this = this
        let params = {
          code:'',
          start_time:'',
          end_time:'',
          pageSize:10,
          pageNow:this.currentPage
        }
        getBikeInfo(params,response =>{
          this.bikeData = response.records
          this.totalTaskCount = response.rowCount
        })
      },
      queryBikeStatics(){
        getBikeStatics('',response =>{
          this.messageCount = response.result.list
        })
      },
      queryAllUnreport(){
        getAllUnreport('',response =>{
          this.allBike = response.records
          this.addOver(_map)
        })
      },
      initMap(container){
        var map = new BMap.Map(mapDiv)    // 创建Map实例
        //map.centerAndZoom(new BMap.Point(116.5,40),9);  // 初始化地图,设置中心点坐标和地图级别

       map.centerAndZoom(new BMap.Point(110.404269,30),5) // 初始化地图,设置中心点坐标和地图级别
       map.addControl(new BMap.MapTypeControl())  //添加地图类型控件
        // //   map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
       map.enableScrollWheelZoom(true)    //开启鼠标滚轮缩放
       return map
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
            markerZindex++;
            this.setTop(true)
          });
          bicylceMarker.push(marker)
          mark_map.put(result[i].code,marker);
          // console.log(bicylceMarker)
        }
        let markerClusterer = new BMapLib.MarkerClusterer(map, {markers: bicylceMarker});
      }
  }
}
</script>

<style  lang="scss" scoped>
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
    width:100%;
    height:790px;
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
</style>
