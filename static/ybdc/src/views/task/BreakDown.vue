<template>
      <el-col :span='22' class="content">
        <el-row>
          <el-col :span='12' v-if="listHide">
              <el-tabs v-model="taskStatusChoose" type="card" class="fl" @tab-click="handleClick0">
                <el-tab-pane label="待派发" name="0"></el-tab-pane>
                <el-tab-pane label="待反馈" name="1"></el-tab-pane>
                <el-tab-pane label="已反馈" name="2"></el-tab-pane>
              </el-tabs>
              <el-button type="primary" icon="plus" size="mini" class="fr layout-mgt-10" @click="create">新建任务</el-button>
              <div class='fl table-container'>
                <div class="fr">
                  <span>处理人:</span><input class="custom-input" v-model="dealerSearch" />
                  <span>时间:&nbsp;</span><el-date-picker type="date" v-model="date1" placeholder="选择日期" size="mini" @change="getDate1" format="yyyy-MM-dd 00:00:00"></el-date-picker>
                  <span>~</span><el-date-picker type="date" v-model="date2" placeholder="选择日期" size="mini" @change="getDate2" format="yyyy-MM-dd 23:59:59"></el-date-picker>
                  <i class="el-icon-search font cursor-pointer" @click="missionSearch"></i>
                </div>
                <el-table :data="tableData" border style="width: 100%;" class="layout-mgt-30" v-if='taskStatus==0&&userIdIsNull==0'>
                    <el-table-column prop="taskNum" label="编号" width="140"></el-table-column>
                    <el-table-column prop="userNickName" label="处理人"></el-table-column>
                    <el-table-column prop="taskTypeName" label="类型" width="80"></el-table-column>
                    <el-table-column prop="sourceName" label="来源" width="120"></el-table-column>
                    <el-table-column prop="feedBack" label="APP故障"></el-table-column>
                    <el-table-column prop="createDate" label="时间" width="140"></el-table-column>
                    <el-table-column label="操作" width="80">
                        <template scope="scope">
                            <el-button size="small" @click="handleEdit(scope.$index,true)">处理</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-table :data="tableData" border style="width: 100%;" class="layout-mgt-30" v-if='taskStatus==0&&userIdIsNull==1'>
                    <el-table-column prop="taskNum" label="编号" width="140"></el-table-column>
                    <el-table-column prop="userNickName" label="处理人"></el-table-column>
                    <el-table-column prop="taskTypeName" label="类型" width="80"></el-table-column>
                    <el-table-column prop="sourceName" label="来源" width="120"></el-table-column>
                    <el-table-column prop="feedBack" label="APP故障"></el-table-column>
                    <el-table-column prop="createDate" label="时间" width="140"></el-table-column>
                    <el-table-column label="操作" width="80">
                        <template scope="scope">
                            <el-button size="small" @click="handleEdit(scope.$index,true)">处理</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-table :data="tableData" border style="width: 100%;" class="layout-mgt-30" v-if='taskStatus==1&&userIdIsNull==1'>
                    <el-table-column prop="taskNum" label="编号" width="140"></el-table-column>
                    <el-table-column prop="userNickName" label="处理人"></el-table-column>
                    <el-table-column prop="taskTypeName" label="类型" width="80"></el-table-column>
                    <el-table-column prop="sourceName" label="来源" width="120"></el-table-column>
                    <el-table-column prop="feedBack" label="APP故障"></el-table-column>
                    <el-table-column prop="createDate" label="时间" width="140"></el-table-column>
                    <el-table-column label="操作" width="80">
                        <template scope="scope">
                            <el-button size="small" @click="handleEdit(scope.$index,false)">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagenation">
                  <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="10" layout="prev, pager, next, jumper" :total="totalTaskCount">
                  </el-pagination>
                </div>
              </div>
          </el-col>
          <el-col :span='12' v-if="todoHide">
                <div><el-button type="primary" icon="arrow-left" @click="close"></el-button></div>
                <div class="detail-container">
                    <el-button type="primary" size="small" class="fr" @click="dispatch">派发</el-button>
                    <div class="layout-mgt-30">
                        <el-row>
                            <el-col :span='6'>
                                <span>故障车辆编号:</span>
                            </el-col>
                            <el-col :span='18'>
                                <input v-model="bdNum" style='height:25px!important;border:1px solid #d1dbe5;border-radius:5px;width:34%;line-height:30px'/>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span='6'>
                                <span>故障类型:</span>
                            </el-col>
                            <el-col :span='18'>
                                <el-select v-model="multipleSelection" clearable placeholder="故障类型" size="small">
                                    <el-option v-for="item in malfunctionTypes" :label="item.name" :value="item.code"></el-option>
                                </el-select>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span='6'>
                                <span>任务来源：</span>
                            </el-col>
                            <el-col :span='18'>
                                <el-select v-model="missionSource" clearable placeholder="请选择" size="small">
                                    <el-option v-for="item in taskSources" :label="item.name" :value="item.code"></el-option>
                                </el-select>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span='6'>
                                <span>任务地点：</span>
                            </el-col>
                            <el-col :span='18'>
                                <span><el-button type='primary' size="mini" @click="chooseSpot">选择</el-button></span>
                                <span>地址：<input class="custom-input-long" v-model="taskAddress" readonly="readonly"/></span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span='6'>
                                <span>处理人：</span>
                            </el-col>
                            <el-col :span='18'>
                                <el-select v-model="dealer" clearable placeholder="请选择" size="small">
                                    <el-option v-for="item in allUser" :label="item.nickName" :value="item.id"></el-option>
                                </el-select>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span='6'>
                                <span>备注：</span>
                            </el-col>
                            <el-col :span='18'>
                                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="remark"></el-input>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="separateLine"></div>
                    <br>
                    <br>
                    <br>
                    <span>附件：</span>
                    <div style="height:400px;overflow-y:auto">
                      <enlargeImg :data="taskFiles"></enlargeImg>
                    </div>
                </div>
          </el-col>
          <el-col :span='12' v-if="seeHide">
                <div><el-button type="primary" icon="arrow-left" @click="close"></el-button></div>
                <div class="detail-container">
                    <div class="layout-mgt-30">
                        <el-row>
                            <el-col :span='6'>
                                <span>单车编号：</span>
                            </el-col>
                            <el-col :span='18'>
                                {{bikeNum}}
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span='6'>
                                <span>任务类型：</span>
                            </el-col>
                            <el-col :span='18'>
                                <span>{{malfunctionTypeNameChanged}}</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span='6'>
                                <span>任务来源：</span>
                            </el-col>
                            <el-col :span='18'>
                                <span>{{sourceNameChanged}}</span>
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
                      <enlargeImg :data="taskFiles"></enlargeImg>
                    </div>
                </div>
          </el-col>
          <el-col :span='12'>
            <div id="missionMap" style="height:810px;width:95%;margin:2.5%" class="map-div"></div>
            <el-button style="position:absolute;top:30px;margin-left:2%" @click ='showAllBicylce'>车辆</el-button>

          </el-col>
        </el-row>
      </el-col>
</template>

<script>

  import enlargeImg from '../../components/enLargeImg'

  import {transTimeT,getWeekTime} from '../../utils/index'
  // import {map_clicks} from '../../service/mapFn'
  import {findOperationMaintenancerByCity,queryTaskGroupList,queryTaskTypes,queryMalfunctionTypes,queryTaskSources,queryRecoverReasons,findAllUser,createTaskGroup,getTeams,getAllEntityName,getBicylceStatus,queryTaskFiles,getAllPolygon,getAllcoordinate,getAllBicycles} from '../../service/getData'
  import $ from 'jquery'
  import store from '../../vuex/store'
  var map ;
  var isClick = false; //是否可以选择地图点  false为不可选取
  var bicylceMarker = [];
  var markerClusterer;
  var all_this;
  var geoc = new BMap.Geocoder();
export default {
  name: 'breakdown',
  data () {
    return {
      tableData2: [],
      tableData: [],
      date1:'',
      date2:'',
      prop:'/ybdcWorkTable',
      taskTypes: [],
      taskSources:[],
      recoverReasons:[],
      malfunctionTypes:[],
      multipleSelection: [],
      allUser:[],
      dealerSearch:'',
      help:[],
      taskFiles:[],
      taskFile:[],
      //派发时提交的字段
      radio:'',//任务类型
      taskAddress:'',
      missionSource:'',
      recoverReason:'',
      malfunctionTypeNameChanged:'',
      sourceNameChanged:'',
      malfunctionType:'',
      bdNum:'',
      lat:'',
      lng:'',
      dealer:'',
      helpPeople:'',
      remark:'',
      id:'',
      //派发时提交的字段end
      taskPage:1,
      taskStatusChoose:0,
      taskStatus:0,
      userIdIsNull:0,
      bikeNum:'',
      totalTaskCount:0,
      currentPage: 1,
      seeHide:false,
      todoHide:false,
      listHide:true,
      showAdd:false,
      recoverHide:false,
      breakdownHide:false,
      bicylceMarkerIsShow:false //车辆是否显示 默认不显示
    }
  },
  mounted () {
      all_this = this;
      map = new BMap.Map("missionMap");
      var mPoint = new BMap.Point(104.072258,30.663445);
      map.enableScrollWheelZoom(true);
      map.centerAndZoom(store.state.loginUser.userCities[0].name,11);
      this.showPeople();
      var data_this = this;
      this.showPolygon(map);//显示边界
      getAllBicycles('',function(data){//查询所有车辆
        for(let i=0;i<data.result.result.length;i++){
            let lng = data.result.result[i].lng,lat = data.result.result[i].lat;
            let url = "http://trojian-cdn-play.oss-cn-hangzhou.aliyuncs.com/ioc/运维图标06.png";
            var point = new BMap.Point(lng,lat);
            var marker = new BMap.Marker(point,{icon:new BMap.Icon(url, new BMap.Size(25,25))});  // 创建标注
            bicylceMarker.push(marker)
          }
      })
      map.addEventListener("click", map_clicks);
      this.queryTaskGroupListFn();
  },
  components: {

    enlargeImg
  },
  methods:{
        queryTaskGroupListFn(){
          var dataParam = {
            "page.page":this.taskPage,
            "page.size":10,
            'startTime':this.date1,
            'endTime':this.date2,
            'userNickName':this.dealerSearch,
            'taskStatus':this.taskStatus,
            'userIdIsNull':this.userIdIsNull,
            'taskTypeCode':'300'
          };
          var subMission = this;
          queryTaskGroupList(dataParam,function(data){
            if(data.success==true){
              console.log('queryTaskGroupList-----------');
              console.log(data);
              subMission.tableData = data.result.pageModel.result;
              subMission.totalTaskCount = data.result.pageModel.page.totalCount;
              map.clearOverlays();
              subMission.showPeople();
              for(let i=0;i<subMission.tableData.length;i++){
                subMission.tableData[i].createDate = transTimeT(subMission.tableData[i].createDate);
                var urlImg;
                if(subMission.tableData[i].taskTypeCode==300){
                  urlImg= subMission.tableData[i].isRead==0?"http://trojian-cdn-play.oss-cn-hangzhou.aliyuncs.com/png/34.png":"http://trojian-cdn-play.oss-cn-hangzhou.aliyuncs.com/png/32.png";
                }
                var point = new BMap.Point(subMission.tableData[i].lng,subMission.tableData[i].lat);
                var marker = new BMap.Marker(point,{icon:new BMap.Icon(urlImg, new BMap.Size(25,25))});  // 创建标注
                map.addOverlay(marker);
              }
            }else{
                subMission.$alert(data.msgContent, '错误提示', {
                confirmButtonText: '确定',
              });
            }
          });
        },
        handleSelectionChange(val) {
          this.multipleSelection = val;
        },
        addUser() {
          this.showAdd = !this.showAdd;
        },
        getDate1(i){
          this.date1 = i;
        },
        chooseSpot(){
          isClick =true;
        },
        getDate2(i){
            this.date2 = i;
        },
        chooseHelp(i){
          console.log(i);
        },
        handleEdit(i,t){
          var subMission = this;
          map.clearOverlays();
          if(markerClusterer){
            markerClusterer.clearMarkers();
          }
          this.bicylceMarkerIsShow = false;
          this.showPeople();

          this.todoHide = t;
          this.listHide = false;
          this.seeHide = !t;
          console.log(i);

          queryTaskTypes('',function(data){
              console.log("queryTaskTypes----------"+data);
              subMission.taskTypes = data.result.list;
          });
          queryTaskSources('',function(data){
              console.log("queryTaskSources----------"+data);
              subMission.taskSources = data.result.list;
          });
          var cityParam = {
            userCityId : store.state.loginUser.userCities[0].id
          }
          findOperationMaintenancerByCity(cityParam,function(data){
            console.log("findOperationMaintenancerByCity----------"+data);
            subMission.allUser = data.result.operationMaintenancers;
          });

          this.radio = this.tableData[i].taskTypeCode;
          this.malfunctionTypeNameChanged = this.tableData[i].malfunctionTypeName
          this.sourceNameChanged = this.tableData[i].sourceName
          this.bikeNum = this.tableData[i].bicylceId
          this.missionSource = this.tableData[i].sourceCode;
          this.taskAddress = this.tableData[i].address;
          this.dealer = this.tableData[i].userId;
          this.remark = this.tableData[i].remark;
          this.lat = this.tableData[i].lat;
          this.lng = this.tableData[i].lng;
          this.id = this.tableData[i].id;
          this.bdNum = this.tableData[i].bicylceId;
          var fileParam = {
            taskId:this.id,
          }

          isClick=true;
          var geoc = new BMap.Geocoder();
          map.removeEventListener("click",map_clicks);
          var point = new BMap.Point(this.lng,this.lat);
          map.panTo(point);
          var marker = new BMap.Marker(point,{icon:new BMap.Icon("http://trojian-cdn-play.oss-cn-hangzhou.aliyuncs.com/ioc/08.png", new BMap.Size(25,25))});  // 创建标注
          marker.enableDragging();
          map.addOverlay(marker);
          marker.addEventListener("dragend",function(e){
            subMission.lng=e.point.lng;
            subMission.lat=e.point.lat;
            geoc.getLocation(e.point, function(rs){
                var addComp = rs.addressComponents;
                subMission.taskAddress = addComp.city + addComp.district + addComp.street + addComp.streetNumber;
            });
          })

          //列表信息中的图片和请求接口的图片都放在file中
          queryTaskFiles(fileParam,function(data){
            console.log("queryTaskFiles----------")
            console.log(data.result.files)
            subMission.taskFiles = data.result.files
            let x = subMission.taskFiles.length
            let fileArray = []
            let filePath = {}
            let file
            if(file != ''&&file!=undefined){
              file = this.tableData[i].picturePath
              for(let k = 0;k<file.split(',').length;k++){
                filePath.path = file.split(',')[k]
                subMission.taskFiles.push(filePath)
              }
            }
          })

          if(t){
          //如果是待派发和待反馈
            if(this.radio==200){
                this.recoverHide=true;
                this.breakdownHide=false;
                queryRecoverReasons('',function(data){
                  subMission.recoverReasons = data.result.list;
                });

                subMission.recoverReason = this.tableData[i].recoverReasonCode;
                console.log('recoverReason--------'+subMission.recoverReason);
            }else if(this.radio==300){
                this.breakdownHide=true;
                this.recoverHide=false;
                queryMalfunctionTypes('',function(data){
                    console.log("queryMalfunctionTypes----------"+data);
                    subMission.malfunctionTypes = data.result.list;
                });
                console.log(this.tableData[i]);
                subMission.multipleSelection = this.tableData[i].malfunctionTypeCode;
                console.log('malfunctionType--------'+subMission.malfunctionType);
            }
          }else{
            this.dealer = this.tableData[i].userNickName
          }
        },
        handleClick0(tab){
          console.log(tab.name);
          let _this = this
          switch(tab.name){
            case '0':
              _this.taskStatus = 0
              _this.userIdIsNull = 0
              break
            case '1':
              _this.taskStatus = 0
              _this.userIdIsNull = 1
              break
            case '2':
              _this.taskStatus = 1
              _this.userIdIsNull = 1
              break
          }
          this.queryTaskGroupListFn();
        },
        //暂时不要删这段代码，虽然没有地方调用，后面确认过再删吧2017-07-25LP
        // getRadio(i){
        //     console.log(i);
        //     var subMission = this;
        //     if(i==200){
        //       map.clearOverlays();
        //       this.showPeople();
        //         this.recoverHide=true;
        //         this.breakdownHide=false;
        //         queryRecoverReasons('',function(data){
        //           subMission.recoverReasons = data.result.list;
        //         });
        //       getBicylceStatus("",function(data){
        //             console.log(data);
        //             var size = data.length;
        //             if(size>0){
        //               var myIcon = new BMap.Icon("http://trojian-cdn-play.oss-cn-hangzhou.aliyuncs.com/ioc/运维图标07.png", new BMap.Size(25,25));
        //               for(var i=0;i<size;i++){
        //                 if(data[i].lng&&data[i].lat){
        //                   var point = new BMap.Point(data[i].lng,data[i].lat);
        //                   var marker = new BMap.Marker(point,{icon:myIcon});  // 创建标注
        //                   map.addOverlay(marker);
        //                 }
        //               }
        //             }
        //     });
        //     let params = {
        //           'taskStatus':0,
        //           'taskTypeCode':200,
        //           "page.page":1,
        //           "page.size":1000
        //         };
        //         queryTaskGroupList(params,function(data){
        //           if(data.success==true){
        //             var size = data.result.pageModel.result.length;
        //             for(var i=0;i<size;i++){
        //                 if(!data.result.pageModel.result[i].lng){
        //                   continue;
        //                 };
        //                 var point = new BMap.Point(data.result.pageModel.result[i].lng,data.result.pageModel.result[i].lat);
        //                 var marker = new BMap.Marker(point,{icon:new BMap.Icon("http://trojian-cdn-play.oss-cn-hangzhou.aliyuncs.com/ioc/04.png", new BMap.Size(25,25))});  // 创建标注
        //                 map.addOverlay(marker);
        //             }
        //           }else{
        //               all_this.$alert(data.msgContent, '错误提示', {
        //               confirmButtonText: '确定',
        //             });
        //           }
        //         })
        //     }else if(i==300){
        //       map.clearOverlays();
        //       this.showPeople();
        //         this.breakdownHide=true;
        //         this.recoverHide=false;
        //         queryMalfunctionTypes('',function(data){
        //             console.log("queryMalfunctionTypes----------"+data);
        //             subMission.malfunctionTypes = data.result.list;
        //         });
        //          let params = {
        //           'taskStatus':0,
        //           'taskTypeCode':300,
        //           "page.page":1,
        //           "page.size":1000
        //         };
        //         queryTaskGroupList(params,function(data){
        //             var size = data.result.pageModel.result.length;
        //             for(var i=0;i<size;i++){
        //                 if(!data.result.pageModel.result[i].lng){
        //                   continue;
        //                 };
        //                 var point = new BMap.Point(data.result.pageModel.result[i].lng,data.result.pageModel.result[i].lat);
        //                 var marker = new BMap.Marker(point,{icon:new BMap.Icon("http://trojian-cdn-play.oss-cn-hangzhou.aliyuncs.com/ioc/04.png", new BMap.Size(25,25))});  // 创建标注
        //                 map.addOverlay(marker);
        //             }
        //         })
        //     }else if(i==100){
        //       this.breakdownHide=false;
        //       this.recoverHide=false;
        //       map.clearOverlays();
        //       this.showPeople();
        //       let params = {
        //         'taskStatus':0,
        //             'taskTypeCode':100,
        //             "page.page":1,
        //             "page.size":1000
        //           };
        //         queryTaskGroupList(params,function(data){
        //             var size = data.result.pageModel.result.length;
        //             for(var i=0;i<size;i++){
        //                 if(!data.result.pageModel.result[i].lng){
        //                   continue;
        //                 };
        //                 var point = new BMap.Point(data.result.pageModel.result[i].lng,data.result.pageModel.result[i].lat);
        //                 var marker = new BMap.Marker(point,{icon:new BMap.Icon("http://trojian-cdn-play.oss-cn-hangzhou.aliyuncs.com/ioc/04.png", new BMap.Size(25,25))});  // 创建标注
        //                 map.addOverlay(marker);
        //             }
        //         })
        //     }else{
        //         this.breakdownHide=false;
        //         this.recoverHide=false;
        //     }
        // },
        close(){
          this.bicylceMarkerIsShow = false;
          this.todoHide = false;
          this.listHide = true;
          this.seeHide = false;
          this.radio = '';
          this.recoverReason = '';
          this.multipleSelection = '';
          this.missionSource = '';
          this.taskAddress = '';
          this.dealer = '';
          this.remark = '';
          this.bdNum = '';
          this.recoverHide = false;
          this.breakdownHide = false;
          this.taskFiles = [];
          this.queryTaskGroupListFn();
        },
        create(){

          map.clearOverlays();
          if(markerClusterer){
            markerClusterer.clearMarkers();
          }
          this.bicylceMarkerIsShow = false;
          this.showPeople();
          var subMission = this;
          map.addEventListener("click", map_clicks);
          this.todoHide = true;
          this.listHide = false;
          this.seeHide = false;
          queryTaskTypes('',function(data){
              console.log("queryTaskTypes----------"+data);
              subMission.taskTypes = data.result.list;
          });
          queryTaskSources('',function(data){
              console.log("queryTaskSources----------"+data);
              subMission.taskSources = data.result.list;
          });
          var cityParam = {
            userCityId : store.state.loginUser.userCities[0].id
          }
          findOperationMaintenancerByCity(cityParam,function(data){
              console.log("findOperationMaintenancerByCity----------"+data);
              subMission.allUser = data.result.operationMaintenancers;
          });
          queryMalfunctionTypes('',function(data){
              console.log("queryMalfunctionTypes----------"+data);
              subMission.malfunctionTypes = data.result.list;
          });
        },
        dispatch(){
          if(this.bdNum==''||this.bdNum==undefined){
            this.$alert('若确认无单车编号，请新建回收任务！', '提示', {
              confirmButtonText: '确定',
            });
          }else{
            this.todoHide = false;
            this.listHide = true;
            this.seeHide = false;
            let dataParam = {
              taskTypeCode: '300',
              bicylceId: this.bdNum,
              sourceCode: this.missionSource,
              RecoverReasonCode: this.recoverReason,
              malfunctionTypeCode: this.multipleSelection,
              lat: this.lat,
              lng: this.lng,
              taskStatus: 0,
              address: this.taskAddress,
              remark: this.remark,
              id:this.id,
              userId: this.dealer,
            }
            console.log(dataParam);
            let _this = this;
            createTaskGroup(dataParam,function(data){
                console.log("createTaskGroup----------"+data);
                if(data.success==true){
                  _this.$alert(data.msgContent, '提示', {
                    confirmButtonText: '确定',
                  });
                  _this.queryTaskGroupListFn();
                  _this.radio = '';
                  _this.recoverReason = '';
                  _this.multipleSelection = '';
                  _this.missionSource = '';
                  _this.taskAddress = '';
                  _this.dealer = '';
                  _this.remark = '';
                  _this.bdNum = '';
                  _this.recoverHide = false;
                  _this.breakdownHide = false;
                  _this.taskFiles = [];
                }else{
                  _this.$alert(data.msgContent, '错误提示', {
                    confirmButtonText: '确定',
                  });
                }
            });
          }
        },
        missionSearch(){
          console.log('dealerSearch-------------'+this.dealerSearch);
          console.log('date1-------------'+this.date1);
          console.log('date2-------------'+this.date2);
          this.queryTaskGroupListFn();
        },
        handleCurrentChange(val){
          console.log(val);
          this.taskPage = val;
          this.queryTaskGroupListFn();
        },
        showPeople(){//显示所有在线人员
          getAllEntityName('',function(data){
            var entitys  = data.entities;
            var size = entitys.length;
            var myIcon = new BMap.Icon("http://trojian-cdn-play.oss-cn-hangzhou.aliyuncs.com/ioc/02.png", new BMap.Size(30,30));
              for(var i =0;i<size;i++){
                var point = new BMap.Point(entitys[i].latest_location.longitude,entitys[i].latest_location.latitude);
                var marker = new BMap.Marker(point,{icon:myIcon});  // 创建标注
                map.addOverlay(marker);
              }
          })
        },
        showPolygon(theMap){//显示所有边界
          getAllPolygon('',function(data){
            if(data){
              var size = data.length;
              for(var i =0;i<size;i++){
                var params={p_id:data[i].id}
                getAllcoordinate(params,function(coor){
                var size_coor =coor.length;
                var point_polygon=[];
                for(var j=0;j<size_coor;j++){
                  point_polygon.push(new BMap.Point(coor[j].lng,coor[j].lat));
                }
                var polygon = new BMap.Polygon(point_polygon, {
                strokeColor : "red",
                strokeWeight : 2,
                strokeOpacity : 0.9,
                fillOpacity:0.1,//填充透明度
                fillColor:''//填充颜色 貌似如果为空就不填充
              }); //创建多边形
              //polygon.enableEditing();
              polygon.disableMassClear();
              theMap.addOverlay(polygon); //增加多边形
                })
              }

            }
          });//getAllcoordinate
        },
        showAllBicylce(){ //地图显示开关

          if(this.bicylceMarkerIsShow){
            this.bicylceMarkerIsShow =false;
            markerClusterer.clearMarkers();
          }else{
            this.bicylceMarkerIsShow =true;
            markerClusterer = new BMapLib.MarkerClusterer(map, {markers: bicylceMarker});
          }
        }
  }
}

var map_clicks = function(e){
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
          all_this.taskAddress = addComp.city + addComp.district + addComp.street + addComp.streetNumber;
    });
    marker.addEventListener("dragend",function(e){
      all_this.lng=e.point.lng;
      all_this.lat=e.point.lat;
      geoc.getLocation(e.point, function(rs){
        var addComp = rs.addressComponents;
        all_this.taskAddress = addComp.city + addComp.district + addComp.street + addComp.streetNumber;
      });
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
