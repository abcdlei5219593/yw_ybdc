<template>
      <el-col class="peopleContent" :span='20'>
        <el-row class="top-content">
          <el-col :span='9' v-if="showPlan" class="col-top">
            <div class='fl table-container layout-mgt-0'>
              <el-table :data="userData" highlight-current-row border @row-click='toggleRow' style="cursor:pointer">
                <el-table-column prop="nickName" label="姓名"></el-table-column>
                <el-table-column prop="mobile" label="联系方式"></el-table-column>
                <el-table-column label="操作" width="120">
                      <template scope="scope" >
                              <el-button size="small" @click="handleEdit0(scope.$index,scope.row)">巡检规划</el-button>
                          </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
          <el-col class="content" :span='9' v-if="!showPlan">
            <el-row>
              <el-col :span="24">
                <el-button type="primary" icon="arrow-left" @click="backPeople"></el-button>
                <el-row style="line-height: 3">
                  <el-col :span="12">姓名：{{selectedUser.nickName}}</el-col>
                  <el-col :span="12">联系方式：{{selectedUser.mobile}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">地址:{{address_now}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="t_r"><el-button type="primary" @click="addTask">创建任务</el-button></el-col>
                </el-row>
                <hr>
                <el-row>
                  <el-col :span="24" class="build-task" v-if="taskContent">
                      <div>
                        <label for="">巡检路线：</label>
                        <el-button type="primary" @click="click_map" size="small">地图打点</el-button>
                        <el-input type='text' style="width:300px" v-model="addressTask" readonly="readonly" size="small"></el-input>
                      </div>
                      <div>
                        <label>任务重复：</label>
                        <el-checkbox-group v-model="chooseDays" @change="chooseDaysChange">
                          <el-checkbox label="1">周一</el-checkbox>
                          <el-checkbox label="2">周二</el-checkbox>
                          <el-checkbox label="3">周三</el-checkbox>
                          <el-checkbox label="4">周四</el-checkbox>
                          <el-checkbox label="5">周五</el-checkbox>
                          <el-checkbox label="6">周六</el-checkbox>
                          <el-checkbox label="7">周日</el-checkbox>
                        </el-checkbox-group>
                      </div>
                      <div class="t_r">
                        <el-button type="primary" @click="abortAdd">放弃创建</el-button>
                        <el-button type="primary" @click="confirmAdd">确认创建</el-button>
                      </div>
                  </el-col>
                  <el-col :span="24">
                    <el-collapse accordion @change="accordionChange" v-model="accordionModel">
                      <el-collapse-item title="巡检任务" class="task-list" v-for="(item,index) in tripTasks">
                        <div>
                          <label for="">创建时间：{{item.create_date}}</label>
                        </div>
                        <div>
                          <label for="">巡检路线：</label><el-button type="primary" @click="tripSee(item.lng,item.lat,item.address)">查看</el-button>
                        </div>
                        <div v-if="change">
                          <label for="">任务重复：</label><span v-for="i in item.week_day">{{i}},</span>&nbsp;<i class="el-icon-edit" style="cursor:pointer" @click="changeWeekDay(item.week_day)"></i>
                        </div>
                        <el-checkbox-group v-model="chooseDaysw" v-if="!change">
                          <el-checkbox label="1">周一</el-checkbox>
                          <el-checkbox label="2">周二</el-checkbox>
                          <el-checkbox label="3">周三</el-checkbox>
                          <el-checkbox label="4">周四</el-checkbox>
                          <el-checkbox label="5">周五</el-checkbox>
                          <el-checkbox label="6">周六</el-checkbox>
                          <el-checkbox label="7">周日</el-checkbox>
                        </el-checkbox-group>
                      <div class="t_r">
                        <el-button type="primary" @click="updateTask(item.id,item.lng,item.lat,item.address,item.week_day)">保存</el-button>
                        <el-button type="primary" @click="deleteTask(item.id)">删除</el-button>
                      </div>
                      </el-collapse-item>
                    </el-collapse>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span='15' v-if="showPlan">
            <div id="mapDiv" class="map-container map-div"></div>
            <el-button style="position:absolute;top:10px;margin-left:2%" @click ='showAllBicylce("mapDiv")'>车辆</el-button>
          </el-col>
          <el-col :span="15" v-if="!showPlan">
            <div id="PlanMap" class='map-container map-div'></div>
            <el-button style="position:absolute;top:10px;margin-left:2%" @click ='showAllBicylce("PlanMap")'>车辆</el-button>
          </el-col>
        </el-row>
      </el-col>

</template>

<script>

  import {findOperationMaintenancerByCity,getAllEntityName,gethistoryTrack,queryAllUser,getTaskTimer,addTaskTimer,deleteTaskTimer,updateTaskTimer,queryTaskGroupList,getAllPolygon,getAllcoordinate,getAllBicycles,queryTaskFiles,queryTaskTypes,queryTaskSources,getTeams,findAllUser,findUserById,findUserByIds} from '../../service/getData'
  import {jj_map,transTimeT,weekArray,arrayWeek} from '../../utils/index'
  import store from '../../vuex/store'

   var map ;
   var mapTrack;
   var polyline;
   var mark_map = new jj_map();
   var selectMark;
   var isClick = false;
   var geoc = new BMap.Geocoder();
   var all_this;
   var bicylceMarker =[];
   var markerClusterer;
export default {
  name: 'people',
  data () {
    return {
      props:'/ybdcWorkTable',
      userData:[],
      selectedUser:'',
      msg: '',
      showPlan:true, // 是否显示巡视计划
      // showFilter:false,// 是否显示筛选
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
     // bicylceMarker:[], //所有车辆的缓存
      bicylceMarkerIsShow:false //车辆是否显示 默认不显示
    }
  },
  mounted () {
      this.initMap();
      all_this = this;
  },
  methods:{
    toggleRow(obj){
         this.selectedUser = obj;
         // console.log(obj);
         var myIcon6 = new BMap.Icon("http://trojian-cdn-play.oss-cn-hangzhou.aliyuncs.com/ioc/06.png", new BMap.Size(30,30));
         selectMark =  mark_map.get(obj.id);
         if(selectMark){
	         selectMark.setIcon(myIcon6);
	         map.panTo(selectMark.getPosition());
	         this.mark_select_plan = selectMark;
	         var data_this = this;
	         geoc.getLocation(selectMark.getPosition(),function(rs){
                var addComp = rs.addressComponents;
                data_this.address_now = addComp.city + addComp.district + addComp.street + addComp.streetNumber;
            });
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
          if(data.success==true){
            console.log('queryTaskGroupList-----------');
            console.log(data);
            _this.tableData = data.result.pageModel.result;
            _this.totalTaskCount = data.result.pageModel.page.totalCount;
            for(let i=0;i<_this.tableData.length;i++){
              _this.tableData[i].createDate = transTimeT(_this.tableData[i].createDate);
            }
          }else{
              _this.$alert(data.msgContent, '错误提示', {
              confirmButtonText: '确定',
            });
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
      this.address_now = '';
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
    handleEdit0(i,j){
      this.selectedUser = j;
      this.getTaskTimerFn();
      var myIcon6 = new BMap.Icon("http://trojian-cdn-play.oss-cn-hangzhou.aliyuncs.com/ioc/06.png", new BMap.Size(30,30));
      selectMark =  mark_map.get(this.selectedUser.id);
      if(selectMark){
        selectMark.setIcon(myIcon6);
        map.panTo(selectMark.getPosition());
        this.mark_select_plan = selectMark;
        var data_this = this;
        geoc.getLocation(selectMark.getPosition(),function(rs){
          var addComp = rs.addressComponents;
          data_this.address_now = addComp.city + addComp.district + addComp.street + addComp.streetNumber;
        });
      }
      if(this.selectedUser){
        this.showPlan=!this.showPlan;
        var time_this = this;
        setTimeout(function(){
            map = new BMap.Map("PlanMap");
            var mPoint = new BMap.Point(104.072258,30.663445);
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
        taskDesc:'投放:'+this.addressTask,
        address:this.addressTask,
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
          if(data.success==true){
            console.log(data.result.data);
            all_this.tripTasks = data.result.data;
            for(let i=0;i<all_this.tripTasks.length;i++){
              all_this.tripTasks[i].create_date = transTimeT(all_this.tripTasks[i].create_date);
              all_this.tripTasks[i].week_day = JSON.parse("["+all_this.tripTasks[i].week_day+"]");
              all_this.tripTasks[i].week_day = weekArray(all_this.tripTasks[i].week_day);
            }
          }else{
            all_this.$alert(data.msgContent, '错误提示', {
              confirmButtonText: '确定',
            });
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
  	},
  	getFilterDate(val){
  		var startime =val +" 00:00:00";//开始时间
			var endtime =val +" 23:59:59";//开始时间
      var startime0 = startime;
      var endtime0 = endtime;
			startime = new Date(startime).getTime()/1000;
			endtime = new Date(endtime).getTime()/1000;
      this.queryTaskGroupListFn(startime0,endtime0);
			var params={
				starttime:startime,
				endtime:endtime,
				userid:this.selectedUser.id,
			}

  		gethistoryTrack(params,function(data){
  			var points=[];
  			for (var i = 0, j = data.points.length - 1; i < j ; i++) {
  					points[j] = new BMap.Point(data.points[i].location[0],data.points[i].location[1]);
  					j--;
  			}

			if(polyline){
					mapTrack.removeOverlay(polyline);
			}
			polyline = new BMap.Polyline(points, {
					strokeColor:"#C63133",
					strokeWeight:5,
					strokeOpacity:1,
					enableMassClear:false
			});
				mapTrack.addOverlay(polyline);
				mapTrack.setZoom(13);
  		})
  	},
  	selectDate(){
  		  var zgjzthis = this;
  		  this.showFilter = true;
        console.log(this.selectedUser);
        this.dealerSearch = this.selectedUser.nickName;
  		  setTimeout(function(){
  		  	mapTrack = new BMap.Map("mapForFilter");
            var mPoint = new BMap.Point(104.072258,30.663445);
            mapTrack.enableScrollWheelZoom(true);
            mapTrack.centerAndZoom(mPoint,13);
  		  	  zgjzthis.showPolygon(mapTrack);
  		  },500)
  	},
    initMap(){
     var zgjzthis = this;
     setTimeout(function(){
  		    map = new BMap.Map("mapDiv");
          let mPoint = new BMap.Point(104.072258,30.663445),
              cityName = store.state.loginUser.userCities[0].name;
          map.enableScrollWheelZoom(true);
          map.centerAndZoom(cityName,13);
          zgjzthis.showPolygon(map);
          getAllEntityName('',function(data){ //人员在线
	          let entitys  = data.entities;
	          let size = entitys.length;
	          let myIcon = new BMap.Icon("http://trojian-cdn-play.oss-cn-hangzhou.aliyuncs.com/ioc/02.png", new BMap.Size(30,30));
            let point;
            let opts = {
              width : 100,     // 信息窗口宽度
              height: 20,     // 信息窗口高度
              enableMessage:true//设置允许信息窗发送短息
            };
            let ids = [];
		        for(var i =0;i<size;i++){
              let lng = entitys[i].latest_location.longitude,
                  lat = entitys[i].latest_location.latitude,
                  content,
                  marker = new BMap.Marker(point,{icon:myIcon});  // 创建标注
	          	point = new BMap.Point(lng,lat);
	          	marker.entity_name = entitys[i].entity_name;
    				  map.addOverlay(marker);
              ids.push(entitys[i].entity_name)
              var dataParam = {
                userId:entitys[i].entity_name
              }
              findUserById(dataParam, data => {
                if(data.success==true){
                  content = data.result.user.nickName;
                  addClickHandler(content,marker);
                }
              })
    				  mark_map.put(entitys[i].entity_name,marker);
    		    }
            findUserByIds({userIds:ids,},function(){})
            function addClickHandler(content,marker){
              marker.addEventListener("click",function(e){
                openInfo(content,e);
              });
            }
            function openInfo(content,e){
              var p = e.target;
              var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
              var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象
              map.openInfoWindow(infoWindow,point); //开启信息窗口
            }
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
               var urlImg ;
               if(tableData[i].taskTypeCode==100)
                  urlImg= tableData[i].isRead==0?"http://trojian-cdn-play.oss-cn-hangzhou.aliyuncs.com/png/27.png":"http://trojian-cdn-play.oss-cn-hangzhou.aliyuncs.com/png/25.png";
               else if(tableData[i].taskTypeCode==200)
                  urlImg= tableData[i].isRead==0?"http://trojian-cdn-play.oss-cn-hangzhou.aliyuncs.com/png/19.png":"http://trojian-cdn-play.oss-cn-hangzhou.aliyuncs.com/png/17.png";
                 else if(tableData[i].taskTypeCode==300)
                  urlImg= tableData[i].isRead==0?"http://trojian-cdn-play.oss-cn-hangzhou.aliyuncs.com/png/34.png":"http://trojian-cdn-play.oss-cn-hangzhou.aliyuncs.com/png/32.png";
               else if(tableData[i].taskTypeCode==400)
                    urlImg= tableData[i].isRead==0?"http://trojian-cdn-play.oss-cn-hangzhou.aliyuncs.com/png/6.png":"http://trojian-cdn-play.oss-cn-hangzhou.aliyuncs.com/png/4.png";

                  var point = new BMap.Point(tableData[i].lng,tableData[i].lat);
              var marker = new BMap.Marker(point,{icon:new BMap.Icon(urlImg, new BMap.Size(25,25))});  // 创建标注
              map.addOverlay(marker);
              }
            }else{
                all_this.$alert(data.msgContent, '错误提示', {
                confirmButtonText: '确定',
              });
            }
        	});
          getAllBicycles('',function(data){//查询所有车辆
              if(data.success){
                for(let i=0;i<data.result.result.length;i++){
                  var point = new BMap.Point(data.result.result[i].lng,data.result.result[i].lat);
                  var urlImg ;
                  if(data.result.result[i].batch==1)
                  urlImg= "http://trojian-cdn-play.oss-cn-hangzhou.aliyuncs.com/png/c_11.png";
                  else if(data.result.result[i].batch==2)
                  urlImg= "http://trojian-cdn-play.oss-cn-hangzhou.aliyuncs.com/png/c_21.png";
                  else if(data.result.result[i].batch==3)
                  urlImg= "http://trojian-cdn-play.oss-cn-hangzhou.aliyuncs.com/png/c_31.png";
                  else
                    urlImg= "http://trojian-cdn-play.oss-cn-hangzhou.aliyuncs.com/png/c_31.png";
                  var marker = new BMap.Marker(point,{icon:new BMap.Icon(urlImg, new BMap.Size(25,25))});  // 创建标注
                  // var label = new BMap.Label(data.result.result[i].id,{offset:new BMap.Size(20,-10)});
                  // marker.setLabel(label)
                  bicylceMarker.push(marker)
                }
              }else{
                all_this.$alert(data.msgContent, '错误提示', {
                  confirmButtonText: '确定',
                });
              }
          })
  	  },500);
  	  var cityParam = {
  	  	userCityId:store.state.loginUser.userCities[0].id
  	  }
  	  findOperationMaintenancerByCity(cityParam,data =>{
        if(data.success==true){
          this.userData = data.result.operationMaintenancers;
        }else{
          all_this.$alert(data.msgContent, '错误提示', {
            confirmButtonText: '确定',
          });
        }
  	  })
    },
    click_map(){
		  map.clearOverlays();
    	isClick =true;
    	map.removeEventListener("click",map_clicks_list);
    	map.addEventListener("click", map_clicks);
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
      showAllBicylce(bicyMap){  //地图显示开关
      	if("mapForFilter" == bicyMap){
      		bicyMap = mapTrack;
      	}else if("PlanMap" == bicyMap){
      		bicyMap = map;
      	}else if("mapDiv" == bicyMap){
      		bicyMap = map;
      	}
      	if(this.bicylceMarkerIsShow){
      		this.bicylceMarkerIsShow =false;
      			markerClusterer.clearMarkers();
      	}else{
      		this.bicylceMarkerIsShow =true;
      		//alert(bicylceMarker.length);
      		//console.log(bicylceMarker)
      		 markerClusterer = new BMapLib.MarkerClusterer(bicyMap, {markers: bicylceMarker});
      	}
      }
  },
  components: {
  
  }
}

 var map_clicks_list= function(e){
    	if(isClick){
			all_this.lng_e=e.point.lng;
			all_this.lat_e=e.point.lat;
			var point = new BMap.Point(e.point.lng,e.point.lat);
		      var marker = new BMap.Marker(point,{icon:new BMap.Icon("http://trojian-cdn-play.oss-cn-hangzhou.aliyuncs.com/ioc/08.png", new BMap.Size(25,25))});  // 创建标注
		    marker.enableDragging();
		    map.addOverlay(marker);
		    isClick = false;
	        geoc.getLocation(e.point, function(rs){
	              var addComp = rs.addressComponents;
	              all_this.addressTask_e = addComp.city + addComp.district + addComp.street + addComp.streetNumber;
	        });
		    marker.addEventListener("dragend",function(e){
		      all_this.lng_e=e.point.lng;
				all_this.lat_e=e.point.lat;
				geoc.getLocation(e.point, function(rs){
					  var addComp = rs.addressComponents;
					  all_this.addressTask_e = addComp.city + addComp.district + addComp.street + addComp.streetNumber;
				});
		    })
		}
    }
var map_clicks =function(e){
	if(isClick){
  	all_this.lng=e.point.lng;
  	all_this.lat=e.point.lat;
  	var point = new BMap.Point(e.point.lng,e.point.lat);
    var marker = new BMap.Marker(point,{icon:new BMap.Icon("http://trojian-cdn-play.oss-cn-hangzhou.aliyuncs.com/ioc/08.png", new BMap.Size(25,25))});  // 创建标注
    marker.enableDragging();
    map.addOverlay(marker);
    isClick = false;
    geoc.getLocation(e.point, function(rs){
          var addComp = rs.addressComponents;
          all_this.addressTask = addComp.city + addComp.district + addComp.street + addComp.streetNumber;
    });
    marker.addEventListener("dragend",function(e){
      all_this.lng=e.point.lng;
  		all_this.lat=e.point.lat;
  		geoc.getLocation(e.point, function(rs){
  		  var addComp = rs.addressComponents;
  		  all_this.addressTask = addComp.city + addComp.district + addComp.street + addComp.streetNumber;
  		});
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
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
</style>
