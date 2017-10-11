<template>
    <div class="">
      <el-col class="peopleContent" :span='20' v-if="!showPlan&&!showFilter">
        <el-row class="top-content">
          <el-col :span='20'>
            <div id="mapDiv" class="map-container map-div" ></div>
            <el-button  :class="[{active:bicylceMarkerIsShowTwo},'button']"  style="position:absolute;top:10px;margin-left:1%"  :disabled="btnClickAble"  @click ='showBatchTwo("mapDiv")'>二代车</el-button>
            <el-button  style="position:absolute;top:10px;left:80px;margin-left:1%" :class="[{active:bicylceMarkerIsShowThree},'button']" :disabled="btnClickAble"  @click ='showBatchThree("mapDiv")'>三代车</el-button>
            <el-button  style="position:absolute;top:10px;left:160px;margin-left:1%" :class="[{active:isRecoverShow},'button']" :disabled="btnClickAble"  @click ='showRecover("mapDiv")'>未回收</el-button>
          </el-col>
          <el-col :span='4'>
            <el-table :data="userData"   highlight-current-row height="500" border @row-click ='toggleRow' style="cursor:pointer">
              <el-table-column  align='center'  style="overflow-x:hidden;" prop="" label="姓名">
                <template scope="scope">
                <p style="text-align:left;width:64px;display:inline-block;">{{scope.row.nickName}}</p>
                <div style="width:36px;display:inline-block">
                  <el-tag
                    type="primary" v-if="scope.row.isOnline"
                    >在线</el-tag>
                </div>
               </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
       <div class="bottom-content">
         <el-row >
           <el-col :span='5'>姓名：<span>{{selectedUser.nickName}}</span></el-col>
           <el-col :span='8'>联系方式：<span>{{selectedUser.mobile}}</span></el-col>
           <el-col :span='6'>职位：<span>{{selectedUser.role}}</span></el-col>
           <!-- <el-col :span='5' class="t_r"><el-button type="primary" @click="doPlan">巡检规划</el-button></el-col> -->
         </el-row>
         <el-row >
           <el-col :span='15'>当前位置:{{address_now}}</el-col>
           <el-col :span='9' class="t_r"><el-button type="primary" @click="selectDate">人员筛选</el-button></el-col>
         </el-row>
       </div>
      </el-col>
      <!-------------------- 筛选部分-------------->

      <el-col class="content" :span='21' v-show="showFilter" >
          <el-row>
            <div><el-button type="primary" icon="arrow-left" @click="backMapnow"></el-button></div>
            <el-col :span="16" class="left-content" style="position:relative;">
              <div id="mapForFilter" ></div>
              <section class="block">
                 <article>
                   <label for="">时间点 : </label>{{sliderTime}}
                 </article>
                 <article>
                   <label for="">地址 : </label>{{sliderAddress}}
                 </article>
                 <el-slider
                   v-model="sliderValue"
                   :max ="orbitMove.pointsNum"
                   :show-stops="true"
                   @change="handlePointChange"         >
                 </el-slider>
              </section>
              <el-button  :class="[{active:bicylceMarkerIsShowTwo},'button']"  style="position:absolute;top:20px;margin-left:1%"  :disabled="btnClickAble"  @click ='showBatchTwo("mapForFilter")'>二代车</el-button>
              <el-button  style="position:absolute;top:20px;left:80px;margin-left:1%" :class="[{active:bicylceMarkerIsShowThree},'button']" :disabled="btnClickAble"  @click ='showBatchThree("mapForFilter")'>三代车</el-button>
              <el-button   style="position:absolute;top:10px;left:160px;margin-left:1%" :class="[{active:isRecoverShow},'button']" :disabled="btnClickAble"  @click ='showRecover("mapForFilter")'>未回收</el-button>
            </el-col>
            <el-col :span="8" class="right-content border">
              <div class='date-wrapper'>
                <span>&nbsp;&nbsp;人员：{{selectedUser.nickName}}</span>
                <div class="t_r" style="margin-top:-35px">
                  <span>选择日期：</span>
                  <el-date-picker type="date" v-model="FilterDate" placeholder="选择日期"  @change="getFilterDate" size="small"></el-date-picker>
                </div>
              </div>
              <br>
              <br>
              <div class='fl table-container' v-if="tableShow" style="border:none">
                <el-table :data="tableData" border style="width: 100%;">
                    <el-table-column prop="taskNum" label="编号"></el-table-column>
                    <!-- <el-table-column prop="userNickName" label="处理人" width="100"></el-table-column> -->
                    <el-table-column prop="taskTypeName" label="类型" width="80"></el-table-column>
                    <!-- <el-table-column prop="sourceName" label="来源" width="80"></el-table-column> -->
                    <el-table-column prop="createDate" label="时间"></el-table-column>
                    <el-table-column label="操作" width="80">
                        <template scope="scope">
                            <el-button size="small" @click="handleEdit(scope.$index)">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagenation">
                  <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="10" layout="prev, pager, next, jumper" :total="totalTaskCount">
                  </el-pagination>
                </div>
              </div>
              <div class='fl table-container' v-if="!tableShow">
                <div><el-button type="primary" icon="arrow-left" @click="close"></el-button></div>
                <div class="detail-container">
                    <div class="layout-mgt-30">
                        <el-row>
                            <el-col :span='6'>
                                <span>任务类型：</span>
                            </el-col>
                            <el-col :span='18'>
                                <span v-if="radio==100">投放</span>
                                <span v-if="radio==200">回收</span>
                                <span v-if="radio==300">故障</span>
                                <span v-if="radio==400">巡检</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span='6'>
                                <span>任务来源：</span>
                            </el-col>
                            <el-col :span='18'>
                                <span v-if="missionSource==100">APP</span>
                                <span v-if="missionSource==200">PC</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span='6'>
                                <span>任务地点：</span>
                            </el-col>
                            <el-col :span='18'>
                                <span>{{taskAddress}}</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span='6'>
                                <span>处理人：</span>
                            </el-col>
                            <el-col :span='18'>
                                {{dealer}}
                            </el-col>
                        </el-row>
                        <!-- <el-row>
                            <el-col :span='6'>
                                <span>协助：</span>
                            </el-col>
                            <el-col :span='18'>
                                {{helpPeople}}
                            </el-col>
                        </el-row> -->
                        <el-row>
                            <el-col :span='6'>
                                <span>备注：</span>
                            </el-col>
                            <el-col :span='18'>
                                {{remark}}
                            </el-col>
                        </el-row>
                    </div>
                    <div class="separateLine"></div>
                    <br>
                    <br>
                    <br>
                    <span>附件：</span>
                    <div style="height:400px;overflow-y:auto">
                      <div v-for="item in taskFiles">
                        <img :src="item.path" class="img">
                      </div>
                    </div>
                </div>
              </div>
            </el-col>
          </el-row>
      </el-col>
    </div>
</template>

<script>
  import {queryAllStatusBike,findOperationMaintenancerByCity,getAllEntityName,findOnlineUser,gethistoryTrack,
    queryAllUser,getTaskTimer,addTaskTimer,deleteTaskTimer,updateTaskTimer,queryTaskGroupList,getAllPolygon,
    getAllcoordinate,getAllBicycles,queryTaskFiles,queryTaskTypes,queryTaskSources,getTeams,findAllUser} from '../../service/getData'
  import {jj_map,transTimeT,weekArray,arrayWeek} from '../../utils/index';
  import axios from 'axios'
  import store from '../../vuex/store'
   var map ;
   var mapTrack;
   var polyline;
   var marker;
   var mark_map =  jj_map();
   var selectMark;
   var isClick = false;
   var geoc = new BMap.Geocoder();
   var all_this;
   var bicylceMarkerTwo =[];
   var bicylceMarkerThree =[];
   var noRecoverTwo = [];
   var noRecoverThree = [];
   var noRecoverAll = [];
   var markerClusterer;
   var allBicycleMark;

export default {
  name: 'taskPeople',
  data () {
    return {
      userData:[],
      selectedUser:'',
      msg: '',
      prop:'/ybdcTaskPeople',
      showPlan:false, // 是否显示巡视计划
      showFilter:false,// 是否显示筛选
      trackDate:'',
      FilterDate:'',
      address_now:'',
      mark_select_plan:'',
      address:'',
      addressTask:'',
      tableData:[],
      lng:'',
      lat:'',
      radio:'',//任务类型
      taskAddress:'',
      missionSource:'',
      recoverReason:'',
      malfunctionType:'',
      dealer:'',
      remark:'',
      id:'',
      chooseDays:[],
      taskFiles:[],
      tableShow:true,
      chooseDaysw:[],
      tripTasks:[],
      taskContent:false,
      currentPage:1,
      totalTaskCount:0,
      dealerSearch:'',
      taskPage:1,
      change:true,
      addressTask_e:'',
      accordionModel:'',
      lng_e:'',
      lat_e:'',
      btnClickAble:true,
     // bicylceMarker:[], //所有车辆的缓存
      bicylceMarkerIsShowTwo:false, //二代车车是否显示 默认不显示
      bicylceMarkerIsShowThree:false, //三代车是否显示 默认不显示
      isRecoverShow:false,//是否显示回收 默认不显示
      userCityCode:'',
      cityId:'',
      orbitMove:{
        bmapPoints:[],
        pointsNum:0,
        marker:{},
        prePoints:[]
      }, //人员轨迹移动参数；
      sliderValue:0,
      sliderAddress:'',
      sliderTime:''
    }
  },
  mounted () {
  //  findBicycleNotRecover({cityCode:'028'})
    bicylceMarkerTwo = bicylceMarkerTwo.length == 0 ? bicylceMarkerTwo : [];
    bicylceMarkerThree = bicylceMarkerThree.length == 0 ? bicylceMarkerThree : [];
     noRecoverTwo = [];
     noRecoverThree = [];
     noRecoverAll = [];
    allBicycleMark = [];
    this.userCityCode = store.state.loginUser.userCities[0].code;
    this.cityId = store.state.loginUser.userCities[0].id;
    this.initMap();
    all_this = this;
  },
  watch:{
    sliderValue(v1,v2){
        let _this = this;
        this.orbitMove.marker.setPosition(this.orbitMove.bmapPoints[v1]);
        this.sliderTime = this.orbitMove.creatTime[v1];
        geoc.getLocation(_this.orbitMove.bmapPoints[v1], (rs) => {
                 var addComp = rs.addressComponents;
                 _this.sliderAddress = addComp.city + addComp.district + addComp.street + addComp.streetNumber;
             });
    }
  },
  methods:{
    toggleRow(obj){
         this.selectedUser = obj;
         var myIcon6 = new BMap.Icon("http://trojian-cdn-play.oss-cn-hangzhou.aliyuncs.com/ioc/06.png", new BMap.Size(30,30));
         var myIcon = new BMap.Icon("http://trojian-cdn-play.oss-cn-hangzhou.aliyuncs.com/ioc/02.png", new BMap.Size(30,30));
         selectMark =  mark_map.get(obj.id);
         if(!selectMark) {
             this.address_now = '';
             return;
         }
         var allMark = mark_map.obj;
         console.log(allMark)
         for(var i in allMark) {
           if (i == obj.id) {
             allMark[i].setIcon(myIcon6);
             map.panTo( allMark[i].getPosition());
             this.mark_select_plan =  allMark[i];
             var data_this = this;

             geoc.getLocation( allMark[i].getPosition() , function(rs){
                      var addComp = rs.addressComponents;
                      data_this.address_now = addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                  });
           }else {
              allMark[i].setIcon(myIcon);
           }
         }

    },
    queryTaskGroupListFn(date1,date2){
        var dataParam = {
          "page.page":this.taskPage,
          "page.size":10,
          'startTime':date1,
          'endTime':date2,
          'userNickName':this.dealerSearch,
          'taskStatus':1
        };
        var _this = this;
        queryTaskGroupList(dataParam,function(data){
            console.log('queryTaskGroupList-----------');
            console.log(data);
            _this.tableData = data.result.pageModel.result;
            _this.totalTaskCount = data.result.pageModel.page.totalCount;
            for(let i=0;i<_this.tableData.length;i++){
              _this.tableData[i].createDate = transTimeT(_this.tableData[i].createDate);
            }
        });
    },
    accordionChange(){
      this.change = true;
    },
    chooseDaysChange(i){
        console.log(i);
    },
    close(){
      this.tableShow = true;
    },
    getTrackDate(val){
      this.trackDate = val;
    },
    backPeople(){
      this.showPlan = !this.showPlan;
         this.initMap();
    },
    addTask(){
      this.taskContent = true;
      this.getTaskTimerFn();
    },
    deleteTask(id){
      let _this = this;
      var params = {
        id:id
      }
      deleteTaskTimer(params,function(data){
        if(data.success==true){
          _this.$alert(data.msgContent, '提示', {
            confirmButtonText: '确定',
          });
          all_this.getTaskTimerFn();
          all_this.accordionModel = '';
        }else{
          _this.$alert(data.msgContent, '错误提示', {
            confirmButtonText: '确定',
          });
        }
      })
    },
    updateTask(id,lng,lat,address,weekDay){
      let _this = this;
      let chooseDayParam='';
      if(this.chooseDaysw.length==0){
        this.chooseDaysw = weekDay;
      }
      this.chooseDaysw = arrayWeek(this.chooseDaysw);
      for(let i=0;i<this.chooseDaysw.length;i++){
        chooseDayParam = chooseDayParam+this.chooseDaysw[i]+',';
      }
      chooseDayParam=chooseDayParam.substring(0,chooseDayParam.length-1);
      this.lat_e = lat;
      this.lng_e = lng;
      this.addressTask_e = address;
      let params = {
        id:id,
        lat:this.lat_e,
        lng:this.lng_e,
        address:this.addressTask_e,
        taskTypeCode:'400',
        sourceCode:'200',
        taskDesc:'投放:'+this.addressTask_e,
        weekDay:chooseDayParam
      }
      updateTaskTimer(params,function(data){
        if(data.success==true){
          _this.$alert(data.msgContent, '提示', {
            confirmButtonText: '确定',
          });
          all_this.getTaskTimerFn();
          all_this.change = true;
        }else{
            _this.$alert(data.msgContent, '错误提示', {
            confirmButtonText: '确定',
          });
        }
      })
    },
    handleEdit(i){
      this.tableShow = false;

      var _this = this;
          queryTaskTypes('',function(data){
              console.log("queryTaskTypes----------"+data);
              _this.taskTypes = data.result.list;
          });
          queryTaskSources('',function(data){
              console.log("queryTaskSources----------"+data);
              _this.taskSources = data.result.list;
          });
          getTeams('',function(data){
              console.log("getTeams----------"+data);
              _this.malfunctionTypes = data.result.list;
          });
          findAllUser('',function(data){
              console.log("findAllUser----------"+data);
              _this.allUser = data.result.users;
          });

          console.log('taskTypeCode---------'+this.tableData[i].taskTypeCode);
          console.log('sourceCode---------'+this.tableData[i].sourceCode);
          console.log('address---------'+this.tableData[i].address);
          console.log('userId---------'+this.tableData[i].userId);
          console.log('assistIds---------'+JSON.parse(this.tableData[i].assistIds));
          console.log('remark---------'+this.tableData[i].remark);
          this.radio = this.tableData[i].taskTypeCode;
          this.missionSource = this.tableData[i].sourceCode;
          this.taskAddress = this.tableData[i].address;
          this.dealer = this.tableData[i].userNickName;
          //this.helpPeople = JSON.parse(this.tableData[i].assistIds);
          this.remark = this.tableData[i].remark;
          this.id = this.tableData[i].id;
          var fileParam = {
            taskId:this.id,
          }
          queryTaskFiles(fileParam,function(data){
              console.log("queryTaskFiles----------"+data);
              _this.taskFiles = data.result.files;
          });
    },
    handleCurrentChange(val){
        console.log(val);
        this.taskPage = val;
        this.queryTaskGroupListFn();
    },
    tripSee(lng,lat,address){
      all_this.lng_e = lng;
      all_this.lat_e = lat;
      all_this.addressTask_e = address;
      console.log(lat);
      map.clearOverlays();
      isClick=true;
      map.removeEventListener("click",map_clicks);
      var point = new BMap.Point(lng,lat);
      map.panTo(point);
      var marker = new BMap.Marker(point,{icon:new BMap.Icon("http://trojian-cdn-play.oss-cn-hangzhou.aliyuncs.com/ioc/08.png", new BMap.Size(25,25))});  // 创建标注
      marker.enableDragging();
      map.addOverlay(marker);
      marker.addEventListener("dragend",function(e){
        all_this.lng_e=e.point.lng;
        all_this.lat_e=e.point.lat;
        geoc.getLocation(e.point, function(rs){
            var addComp = rs.addressComponents;
            all_this.addressTask_e = addComp.city + addComp.district + addComp.street + addComp.streetNumber;
            console.log(all_this.addressTask_e);
        });
      })
   },
    abortAdd(){
      this.taskContent = false;
    },
    confirmAdd(){
      let chooseDayParam='';
      for(let i=0;i<this.chooseDays.length;i++){
        chooseDayParam = chooseDayParam+this.chooseDays[i]+',';
      }
      chooseDayParam=chooseDayParam.substring(0,chooseDayParam.length-1);
      var dataParam = {
        lng:this.lng,
        lat:this.lat,
        taskTypeCode:'400',
        sourceCode:'200',
        taskDesc:'投放:'+this.address_now,
        address:this.address_now,
        weekDay:chooseDayParam,
        userId:this.selectedUser.id
      };
      console.log(dataParam);
      addTaskTimer(dataParam,function(data){
        if(data.success==true){
          all_this.$alert(data.msgContent, '提示', {
            confirmButtonText: '确定',
          });
          all_this.getTaskTimerFn();
          all_this.taskContent = false;
          all_this.addressTask = '';
          all_this.chooseDays=[];
          all_this.accordionModel = '';
        }else{
          all_this.$alert(data.msgContent, '错误提示', {
            confirmButtonText: '确定',
          });
        }
      });
    },
    getTaskTimerFn(){
        let params={
          userId:this.selectedUser.id
        }
        getTaskTimer(params,function(data){
          console.log(data.result.data);
          all_this.tripTasks = data.result.data;
          for(let i=0;i<all_this.tripTasks.length;i++){
            all_this.tripTasks[i].create_date = transTimeT(all_this.tripTasks[i].create_date);
            all_this.tripTasks[i].week_day = JSON.parse("["+all_this.tripTasks[i].week_day+"]");
            all_this.tripTasks[i].week_day = weekArray(all_this.tripTasks[i].week_day);
            //console.log(all_this.tripTasks[i].week_day);
          }
        })
    },
    changeWeekDay(weekDay){
      this.change = false;
      this.chooseDaysw = arrayWeek(weekDay);
      console.log(this.chooseDaysw);
    },
    backMapnow(){
      this.showFilter = !this.showFilter
         this.initMap();

    },
    doPlan(){
      this.getTaskTimerFn();
      if(this.selectedUser){
        this.showPlan=!this.showPlan;
        var time_this = this;
        setTimeout(function(){
            map = new BMap.Map("PlanMap");
            //var mPoint = new BMap.Point(104.072258,30.663445);
            map.enableScrollWheelZoom(true);
            map.centerAndZoom(store.state.loginUser.userCities[0].name,13);
            var myIcon6 = new BMap.Icon("http://trojian-cdn-play.oss-cn-hangzhou.aliyuncs.com/ioc/06.png", new BMap.Size(30,30));
            if(time_this.mark_select_plan){
              var marker = new BMap.Marker(time_this.mark_select_plan.getPosition(),{icon:myIcon6});  // 创建标注
                marker.entity_name  =time_this.mark_select_plan.entity_name;
            map.addOverlay(marker);
            map.panTo(time_this.mark_select_plan.getPosition());
            }
            time_this.showPolygon(map);
          //  map.addEventListener("click", map_clicks);
          },500)
      }else{
          this.$alert('请先选择一个用户', '错误提示', {
            confirmButtonText: '确定',
          });
      }

    },
    getFilterDate(val){
      var startime =val +" 00:00:00";//开始时间
      var endtime =val +" 23:59:59";//开始时间
      var startime0 = startime;
      var endtime0 = endtime;
      var _this = this;
      startime = new Date(startime).getTime()/1000;
      endtime = new Date(endtime).getTime()/1000;
      this.queryTaskGroupListFn(startime0,endtime0);
      var params={
        starttime:startime,
        endtime:endtime,
        userid:this.selectedUser.id,
      }
      gethistoryTrack(params,function(data){
        if(data.message=='成功'){
          _this.sliderValue = 0;
          if(data.points.length>0){
            let points = [];
            let creatTime = [];
            let pointsNum = _this.orbitMove.pointsNum = parseInt(data.size - 1);
            for(let i = pointsNum ;i >= 0; i--) {
               let location = data.points[i].location;
               points.push( new BMap.Point(location[0],location[1]))
               creatTime.push(data.points[i].create_time)
            }
            _this.orbitMove.bmapPoints = points;
            _this.orbitMove.creatTime = creatTime;
            if(polyline) mapTrack.removeOverlay(polyline);
            if(marker) mapTrack.removeOverlay(marker);
            polyline = new BMap.Polyline(points, {
                strokeColor:"#C63133",
                strokeWeight:5,
                strokeOpacity:1,
                enableMassClear:false
            });
            var myIcon = new BMap.Icon("http://trojian-cdn-play.oss-cn-hangzhou.aliyuncs.com/ioc/03.png", new BMap.Size(30,30));

            marker = _this.orbitMove.marker = new BMap.Marker(points[pointsNum],{icon:myIcon});  // 创建标注
            mapTrack.addOverlay(marker);
            mapTrack.addOverlay(polyline);
            mapTrack.centerAndZoom(points[pointsNum],13);
            _this.pointMove();
          }else{
            _this.$alert('无轨迹数据', '错误提示', {
              confirmButtonText: '确定',
            });
          }
        }else{
          _this.$alert('获取数据失败', '错误提示', {
              confirmButtonText: '确定',
          });
        }
      })
    },
    pointMove(){
      if(move)  clearInterval(move);

      var move = setInterval(()=>{
          this.sliderValue++;
          if(this.sliderValue >= this.orbitMove.pointsNum) {
            clearInterval(move);
          }else{
             this.orbitMove.marker.setPosition(this.orbitMove.bmapPoints[this.sliderValue]);
          }
      },50)
    },
    handlePointChange(){
//      alert(1)
    },
    selectDate(){
        this.showFilter = true;
        this.dealerSearch = this.selectedUser.nickName;
        setTimeout(() =>{
          mapTrack = new BMap.Map("mapForFilter");
            var mPoint = new BMap.Point(104.072258,30.663445);
            mapTrack.enableScrollWheelZoom(true);
            mapTrack.centerAndZoom(store.state.loginUser.userCities[0].name,13);
            this.showPolygon(mapTrack);
        },500)
    },
    initMap(){
     var _this = this;
     setTimeout(function(){
          map = new BMap.Map("mapDiv");
          var mPoint = new BMap.Point(104.072258,30.663445);
          map.enableScrollWheelZoom(true);
          map.centerAndZoom(store.state.loginUser.userCities[0].name,13);
          _this.showPolygon(map);


          let  userCityId = store.state.loginUser.userCities[0].id

          findOnlineUser('',{'userCityId':userCityId},(acct,perms) => {
               let myIcon = new BMap.Icon("http://trojian-cdn-play.oss-cn-hangzhou.aliyuncs.com/ioc/02.png", new BMap.Size(30,30));
                let entitys  = acct.data.entities;
                let operationMaintenancers = perms.data.result.operationMaintenancers;
                // operationMaintenancers.map((v,i) => {
                //   v.isOnline = entitys.findIndex((val,index) => {return val.entity_name == v.id}) != -1 ? true : false;
                //   return v;
                // })
                // _this.userData = operationMaintenancers;
                // entitys.forEach( (v,i) => {
                //   var point = new BMap.Point(v.latest_location.longitude,v.latest_location.latitude);
                //   var marker = new BMap.Marker(point,{icon:myIcon});  // 创建标注
                //   marker.entity_name  = v.entity_name;
                //   map.addOverlay(marker);
                //   mark_map.put(v.entity_name,marker);
                // }).sort((a,b) => {
                //   console.log(a)
                // })

                let size = entitys.length;

                for(var i =0;i<size;i++){
                    var point = new BMap.Point(entitys[i].latest_location.longitude,entitys[i].latest_location.latitude);
                    var marker = new BMap.Marker(point,{icon:myIcon});  // 创建标注
                    marker.entity_name  =entitys[i].entity_name;
                    map.addOverlay(marker);
                    mark_map.put(entitys[i].entity_name,marker);
                    operationMaintenancers.forEach((val,index) => {
                      if(val.id == entitys[i].entity_name){
                         val.isOnline = true;
                         operationMaintenancers.splice(index,1);
                         operationMaintenancers.unshift(val);
                      }
                    })
                 }
                  _this.userData = operationMaintenancers;

          });
          var dataParam = {
              "page.page":1,
              "page.size":9999,
              'taskStatus':0
            };
        queryTaskGroupList(dataParam,function(data){
          if(data.success==true){
            var tableData = data.result.pageModel.result;
            for(let i=0;i<tableData.length;i++){
              var point = new BMap.Point(tableData[i].lng,tableData[i].lat);
              var marker = new BMap.Marker(point,{icon:new BMap.Icon("http://trojian-cdn-play.oss-cn-hangzhou.aliyuncs.com/ioc/运维图标01.png", new BMap.Size(25,25))});  // 创建标注
              map.addOverlay(marker);
            }
          }else{
            _this.$alert(data.msgContent, '提示', {
              confirmButtonText: '确定',
            });
          }
        });
         let userCityCode = {cityCode:_this.userCityCode}

        queryAllStatusBike(userCityCode,userCityCode,(acct,perms) => {
            let all = acct.data.result.result;
            let notRecover = perms.data;
            console.log(notRecover)
            getAllBicycles(all,notRecover)
          })
          function getAllBicycles(all,notRecover){
                //var tempBicyMarker = [];
                for(let i=0;i<all.length;i++){
                  var marker = setMarker(all[i].lng,all[i].lat,all[i].code)
                  if (all[i].batch == '2') {
                    bicylceMarkerTwo.push(marker);
                  }else  if (all[i].batch == '3'){
                    bicylceMarkerThree.push(marker);
                  }
              }
              for(let j = 0; j < notRecover.length; j++){
                var marker = setMarker(notRecover[j].lon,notRecover[j].lat,notRecover[j].code)
                if (notRecover[j].batch == '2') {
                  noRecoverTwo.push(marker);
                }else  if (notRecover[j].batch == '3'){
                  noRecoverThree.push(marker);
                }
              }
              allBicycleMark =  bicylceMarkerTwo.concat(bicylceMarkerThree)
              noRecoverAll =  noRecoverTwo.concat(noRecoverThree)
              console.log(noRecoverAll)
              _this.btnClickAble = false;
              //zgjzthis.bicylceMarker =tempBicyMarker;
         }
         function setMarker(lng,lat,code){
           var point = new BMap.Point(lng,lat);
           var label = new BMap.Label("编号："+code,{offset:new BMap.Size(20,-40)});
           var marker = new BMap.Marker(point,{icon:new BMap.Icon("http://trojian-cdn-play.oss-cn-hangzhou.aliyuncs.com/ioc/运维图标06.png", new BMap.Size(25,25))});  // 创建标注
           label.setStyle(
              {color : "white",
                  padding:"5px",
                  fontSize : "16px",
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
           return marker ;
         }
      },500);
    },
    click_map(){
      map.clearOverlays();
      isClick =true;
      map.removeEventListener("click",map_clicks_list);
      map.addEventListener("click", map_clicks);
    },
    showPolygon(theMap){//显示所有边界
        	getAllPolygon({cityId:this.cityId},function(data){
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
									polygon2.disableMassClear();
									theMap.addOverlay(polygon2); //增加多边形
		        			}
	        			})
        			}

        		}
        	});
    },
    showRecover(bicyMap){
      if("mapForFilter" == bicyMap){
        bicyMap = mapTrack;
      }else if("PlanMap" == bicyMap){
        bicyMap = map;
      }else if("mapDiv" == bicyMap){
        bicyMap = map;
      }
      if(!this.isRecoverShow){
        if(this.bicylceMarkerIsShowTwo && this.bicylceMarkerIsShowThree){
           markerClusterer.clearMarkers();
           markerClusterer = new BMapLib.MarkerClusterer(bicyMap, {markers: noRecoverAll});
          //this.bicylceMarkerIsShowTwo =false;
        }else  if( !this.bicylceMarkerIsShowTwo && this.bicylceMarkerIsShowThree){
            markerClusterer.clearMarkers();
            markerClusterer = new BMapLib.MarkerClusterer(bicyMap, {markers: noRecoverThree});
        }else if( this.bicylceMarkerIsShowTwo && !this.bicylceMarkerIsShowThree){
            markerClusterer.clearMarkers();
            markerClusterer = new BMapLib.MarkerClusterer(bicyMap, {markers: noRecoverTwo});
        }else {
            markerClusterer = new BMapLib.MarkerClusterer(bicyMap, {markers: noRecoverAll});
        }
      }else{
        if(this.bicylceMarkerIsShowTwo && this.bicylceMarkerIsShowThree){
           markerClusterer.clearMarkers();
           markerClusterer = new BMapLib.MarkerClusterer(bicyMap, {markers: allBicycleMark});
          //this.bicylceMarkerIsShowTwo =false;
        }else  if( !this.bicylceMarkerIsShowTwo && this.bicylceMarkerIsShowThree){
            markerClusterer.clearMarkers();
            markerClusterer = new BMapLib.MarkerClusterer(bicyMap, {markers: bicylceMarkerThree});
        }else if( this.bicylceMarkerIsShowTwo && !this.bicylceMarkerIsShowThree){
            markerClusterer.clearMarkers();
            markerClusterer = new BMapLib.MarkerClusterer(bicyMap, {markers: bicylceMarkerTwo});
        }else {
              markerClusterer.clearMarkers();
        }
      }
      this.isRecoverShow = !this.isRecoverShow;
    },
    showBatchTwo(bicyMap){  //地图显示开关
      if("mapForFilter" == bicyMap){
        bicyMap = mapTrack;
      }else if("PlanMap" == bicyMap){
        bicyMap = map;
      }else if("mapDiv" == bicyMap){
        bicyMap = map;
      }
      if(this.bicylceMarkerIsShowTwo){
        markerClusterer.clearMarkers();
        if(this.bicylceMarkerIsShowThree == true && !this.isRecoverShow){
            markerClusterer = new BMapLib.MarkerClusterer(bicyMap, {markers: bicylceMarkerThree});
        }else if (this.bicylceMarkerIsShowThree == true && this.isRecoverShow){
            markerClusterer = new BMapLib.MarkerClusterer(bicyMap, {markers: noRecoverThree});
        }
        this.bicylceMarkerIsShowTwo =false;

      }else{
        if(bicylceMarkerTwo.length == 0) {
          this.$alert("该地区无二代车");
          return;
        }
        this.bicylceMarkerIsShowTwo =true;
        if(this.bicylceMarkerIsShowThree == true && !this.isRecoverShow){
            markerClusterer.clearMarkers();
             markerClusterer = new BMapLib.MarkerClusterer(bicyMap, {markers: allBicycleMark});
        }else if (this.bicylceMarkerIsShowThree == true && this.isRecoverShow){
            markerClusterer = new BMapLib.MarkerClusterer(bicyMap, {markers: noRecoverAll});
        }else if (!this.bicylceMarkerIsShowThree == true && !this.isRecoverShow){
            markerClusterer = new BMapLib.MarkerClusterer(bicyMap, {markers: bicylceMarkerTwo});
        }else if (!this.bicylceMarkerIsShowThree == true && this.isRecoverShow){
            markerClusterer = new BMapLib.MarkerClusterer(bicyMap, {markers: noRecoverTwo});
        }
      }
    },
    showBatchThree(bicyMap){  //地图显示开关
        if("mapForFilter" == bicyMap){
          bicyMap = mapTrack;
        }else if("PlanMap" == bicyMap){
          bicyMap = map;
        }else if("mapDiv" == bicyMap){
          bicyMap = map;
        }
        if(this.bicylceMarkerIsShowThree){
          markerClusterer.clearMarkers();
          if(this.bicylceMarkerIsShowTwo == true && !this.isRecoverShow){
              markerClusterer = new BMapLib.MarkerClusterer(bicyMap, {markers: bicylceMarkerTwo});
          }else if (this.bicylceMarkerIsShowTwo == true && this.isRecoverShow){
              markerClusterer = new BMapLib.MarkerClusterer(bicyMap, {markers: noRecoverTwo});
          }
          this.bicylceMarkerIsShowThree =false;

        }else{
          this.bicylceMarkerIsShowThree =true;
          if(this.bicylceMarkerIsShowTwo == true && !this.isRecoverShow){
                markerClusterer.clearMarkers();
               markerClusterer = new BMapLib.MarkerClusterer(bicyMap, {markers:allBicycleMark});
          }else if (this.bicylceMarkerIsShowTwo == true && this.isRecoverShow){
              markerClusterer = new BMapLib.MarkerClusterer(bicyMap, {markers: noRecoverAll});
          }else if (!this.bicylceMarkerIsShowTwo == true && !this.isRecoverShow){
              markerClusterer = new BMapLib.MarkerClusterer(bicyMap, {markers: bicylceMarkerThree});
          }else if (!this.bicylceMarkerIsShowTwo == true && this.isRecoverShow){
              markerClusterer = new BMapLib.MarkerClusterer(bicyMap, {markers: noRecoverThree});
          }

        }
      }
  },
  components: {

  },
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  $grey:#d3d3d3;
  $border:1px solid #d3d3d3;
  .border{
    border:$border;
  }
  .peopleContent{
    border:$border;
    margin:20px;

  }
  .left-content>div{
      width:100%;
      height: 840px;
    }
  .top-content {
      .el-col{
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
    margin-left:0 ;
    width:100%;
    height:500px;
  }
  .date-wrapper{
    height:36px;
    line-height:36px;
  }
  .block{
    padding:30px 0;
    background: #fff;
    position: fixed;
    bottom:0;
    left:0;

    width: 100%;
    .el-slider, article{
      width: 80%;
      margin: auto;
    }
    article{
      line-height: 2;
      label{
        color:#5e6d82;
      }
    }
  }
  .el-button.active{color:#20a0ff !important;border-color:#20a0ff !important}
  .el-button:focus{
    /* background: #fff; */
    border: 1px solid #c4c4c4;
    color: #1f2d3d;
}
</style>
