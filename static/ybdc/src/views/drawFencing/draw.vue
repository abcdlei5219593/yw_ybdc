<template>
      <el-col class="home" :sm='22' :xs='24'>
        <section id="map" class="map"></section>
        <section class="tool-box">
              <label for="">当前城市&nbsp;:&nbsp;</label>
              <el-select   value-key="name" v-model="selectedCity" size='' placeholder="请选择" @change="changeCity">
                <el-option
                  v-for="item in cityList"
                  :label="item.name"

                  :value="item">
                </el-option>
              </el-select>
            <el-button type="primary" @click="dossss" style="margin-left:10px;" >添加区域</el-button>
            <el-button type="primary"  @click="removepoly()">重置</el-button>

            <el-button type="primary" @click="savePolygon(1)">保存为可行区</el-button>
            <el-button type="primary" @click="savePolygon(0)">保存为禁行区</el-button>
            <el-button type="primary" @click="deletePolygon">删除当前城市</el-button>
        </section>
      </el-col>
</template>

<script>
  import {queryCity,addFencing,addC,deletepp,getAllPolygon,getAllcoordinate} from '../../service/getData'
export default {
  name: 'life',
  data () {
    return {
      map:{},
      cityList:[],
      selectedCity:{
      },
      cityCode:'',
      point_polygon : [],
      polygon:''
    }
  },
  computed:{
    // cityCode(){
    //   return this.$store.state.cityCode;
    // },

  },
  filters:{

  },
  methods :{
    initMap() {
      var map = this.map = new BMap.Map("map");
    	var mPoint = new BMap.Point(104.072258, 30.663445);
    	map.enableScrollWheelZoom();
    	map.centerAndZoom(mPoint, 12);
    	map.enableScrollWheelZoom();
     this.showPolygon(map)
    	//var heatmapOverlay;
    },
    queryCity() {
      queryCity('', data => {
        this.cityList = data;
      })
    },
    changeCity(cityInfo){
      console.log(this)
      let cityName = cityInfo.name;
      this.selectedCity = cityInfo;
      this.cityCode = cityInfo.code
      this.map.centerAndZoom(cityName, 12);
    },
    dossss() {
       let  msg = "请选择三个点，当前已经先择";
       this.$message(msg + this.point_polygon.length + "个点");
       this.map.addEventListener("click", this.clickhandel);

     },
    clickhandel(e) {
       this.mapclick(e, this.point_polygon);
     },

    mapclick(e, point_polygon) {
       if (point_polygon.length < 2 ) {
         point_polygon.push(e.point);
         this.$message("请选择三个点，当前已经先择" + point_polygon.length + "个点");
       } else if(point_polygon.length == 2){
         this.map.removeEventListener("click", this.clickhandel);
         this.createPolygon(point_polygon);

       }
     },

    createPolygon(point_polygon) {
        this.polygon = new BMap.Polygon(point_polygon, {
         strokeColor : "blue",
         strokeWeight : 2,
         strokeOpacity : 0.5
       }); //创建多边形
       this.map.addOverlay(this.polygon ); //增加多边形
       this.polygon.enableEditing();
       this.polygon .enableMassClear();

     },
    removepoly() {
      this.map.removeOverlay(this.polygon);
       this.point_polygon=[];
      this.$message("请选择三个点，当前已经先择" + this.point_polygon.length + "个点");
     },
    savePolygon(passable){
       if(!this.polygon){
         this.$message.warning("请先画出区域");
         return ;
       }
       if(!this.selectedCity.id){
         this.$alert("请选择城市")
         return;
       }

      let latlng = this.polygon.getPath();
      let name=prompt("输入区域名","");
      let lv=prompt("输入区域等级","");
      let param = {
        name:name,
        lv:lv,
        passable:passable,
        cityId :this.selectedCity.id

      }
        //var lv=prompt("输入区域等级","")
      addFencing(param, data => {
        let cityCode = this.cityData;
        latlng.map(function(value,index){
          let param = {
            p_id:data.id,
            lng:value.lng,
            lat:value.lat,
            orderCode:index,
          }
          addC(param,data => {

          })
        })
        alert("成功");
        this.map.clearOverlays();
        this.showPolygon(this.map)
      })

     },
     deletePolygon(){
       let param = {
         cityId:this.selectedCity.id
       }
       deletepp(param, data => {
         this.$alert('删除成功')
         this.map.clearOverlays();
         this.showPolygon(this.map)
       })

     },
     showPolygon(theMap){//显示所有边界
          getAllPolygon('',function(data){
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
                  polygon1.disableEditing();
                  polygon1.enableMassClear();

                  theMap.addOverlay(polygon1); //增加多边形
                  }else{
                    var	polygon2 = new BMap.Polygon(point_polygon, {
                    strokeColor : "red",
                    strokeWeight : 2,
                    strokeOpacity : 0.9,
                    fillOpacity:0.3,//填充透明度
                    fillColor:'red'//填充颜色 貌似如果为空就不填充
                  }); //创建多边形
                  //polygon.enableEditing();
                  polygon2.enableMassClear();

                  theMap.addOverlay(polygon2); //增加多边形
                  }
                })
              }

            }
          });
     },
  },

  components: {
  },
  mounted(){
    this.initMap();
    this.queryCity();

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss" scoped>
.home{
  position: relative;
  .map{
    background: #ccc;
    min-height: 800px;
  }
  .tool-box {
    position: absolute;
    left: 50px;
    top: 50px;
  }
}

</style>
