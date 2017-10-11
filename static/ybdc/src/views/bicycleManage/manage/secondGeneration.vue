<template>
  <div ref='bicycleList'>
      <div class='search-bar cl'>
          <div class="search-bar-grid fl">
            <label for="">城市：</label>
            <el-select class='form-input' clearable v-model="searchParam.cityCode" size='small' placeholder="请选择">
               <el-option
                 v-for="item in cityList"
                 :label="item.name"
                 :value="item.code">
               </el-option>
            </el-select>
          </div>
          <div class="search-bar-grid fl">
            <label for="">单车编号：</label>
            <el-input type="number" v-model="searchParam.code" class='form-input' size='small' placeholder="请输入内容"></el-input>
          </div>
          <div class="search-bar-grid fl">
            <i class="el-icon-setting" @click="showAnomaly = !showAnomaly"></i>
            <label for="">异常筛选：</label>
            <el-select class='form-input' style="width:260px;" size="small" v-model="selectedRule" multiple @change="selectRule" placeholder="请选择">
              <el-option
                v-for="item in selectRuleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search-bar-grid-fr fr">
            <el-button type="primary" @click="searchBicyle">搜索</el-button>
          </div>
      </div>
      <el-row class="btn-bar">
          <el-col :span=12>
              <el-button type="primary" @click="lockingAnchor">锚定</el-button>
              <el-button type="primary" @click="relieveAnchor">解除锚定</el-button>
              <el-button type="primary" @click="bicycleAlarm">告警</el-button>
          </el-col>
          <el-col :span=12 >
             <div class="fr">
               <el-button type="primary" @click='showAddBicycle=true'>添加单车</el-button>
               <el-button type="primary" @click='showUpload=true'>批量导入</el-button>
               <el-button type="primary" @click='excelExport'>导出</el-button>
             </div>
          </el-col>
      </el-row >
      <el-row class='table-content'>
        <el-table ref="table" v-loading='loading_1' :data="bicycleDetail" border style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" header-align='center' width="55"></el-table-column>
          <el-table-column label="ID" header-align='center' prop="id" width="120"></el-table-column>
          <el-table-column header-align='center' prop="code" label="单车编号" width="120"></el-table-column>
          <el-table-column header-align='center' prop="cityname" label="城市" show-overflow-tooltip></el-table-column>
          <el-table-column header-align='center' prop="battery" label="电量" show-overflow-tooltip>
            <template scope="scope">
              <span style='color:red;' v-if = 'scope.row.battery<rulesTransform.lowBattery'>{{scope.row.battery}}</span>
              <span v-if = 'scope.row.battery>=rulesTransform.lowBattery'>{{scope.row.battery}}</span>
            </template>
          </el-table-column>
          <el-table-column header-align='center' prop="scope.row.endPlace" label="最新位置" show-overflow-tooltip>
            <template scope="scope">
              <el-button v-if = 'scope.row.endPlace' size="small" @click="showLocationMap(scope.row.endLat,scope.row.endLon)">关锁位置</el-button>
              <el-button v-if = 'scope.row.startPlace&&!scope.row.endPlace' size="small" @click="showLocationMap(scope.row.startLat,scope.row.startLon)">开锁位置</el-button>
            </template>
          </el-table-column>
          <el-table-column header-align='center' prop="status" label="状态" show-overflow-tooltip>
            <template scope="scope">
              <span v-if='scope.row.status == 1'>入库</span>
              <span v-if='scope.row.status == 2'>出库</span>
              <span v-if='scope.row.status == 3'>回笼</span>
            </template>
          </el-table-column>
          <el-table-column header-align='center' prop="dataException" label="距上次上报时长(分钟)" show-overflow-tooltip></el-table-column>
          <el-table-column header-align='center' prop="lowFrequency" label="距上次关锁时长" show-overflow-tooltip></el-table-column>
          <el-table-column header-align='center' prop="rideTime" label="骑行超时" show-overflow-tooltip>
            <template scope="scope">
              <span style='color:red;' v-if='scope.row.rideTime>rulesTransform.rideTimeout'>{{scope.row.rideTime-rulesTransform.rideTimeout}}</span>
              <span v-if='scope.row.rideTime==null ||scope.row.rideTime<rulesTransform.rideTimeout'>未超时</span>
            </template>
          </el-table-column>
          <el-table-column header-align='center' prop="anchor" label="是否锚定" show-overflow-tooltip>
            <template scope="scope">
              <span v-if='scope.row.anchor == 1'>是</span>
              <span v-if='scope.row.anchor == 0'>否</span>
            </template>
          </el-table-column>
          <el-table-column label="操作"  width="200" header-align='center'>
            <template scope="scope">
              <el-button size="small" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagenation">
          <el-pagination
            @current-change = "changePage"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </el-row>
    <!--  异常ICON弹框-->
    <el-dialog title="异常规则设置" v-model="showAnomaly" >
      <el-form >
        <el-form-item label="骑行超时时：">
          开锁后&nbsp;<el-input v-model="rulesTransform.rideTimeout" type="number" size='small' class='w-40' auto-complete="off"></el-input>&nbsp;分钟未关锁
        </el-form-item>
        <el-form-item label="低电量：">
            电量低于&nbsp;<el-input v-model="rulesTransform.lowBattery" type="number" size='small' class='w-40' auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="低频：" >
            最后一次关锁后&nbsp;<el-input v-model="rulesTransform.lowFrequency" type="number" size='small' class='w-40' auto-complete="off"></el-input>&nbsp;分钟未再开锁
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAnomaly = false">取 消</el-button>
        <el-button type="primary" @click="showAnomaly = false"
         >确 定</el-button>
      </div>
    </el-dialog>
    <!--  开关锁位置地图弹框-->
    <el-dialog title="地图工具" v-model="showMap" >
      <div class="dialog-content">
        <div class="map-container" id='showLocation' ></div>
        <el-input  class='map-input' v-model="mapInput" placeholder='请输入位置信息进行搜索' auto-complete="off"> <el-button slot="append" icon="search" @click='seachLocation'></el-button></el-input>
      </div>
    </el-dialog>
    <!--  车辆详情弹框-->
    <el-dialog title="车辆详情" v-model="showBicycleDetail" top="20px" :close-on-click-modal='false' @close='disabled=true'>
      <div class="dialog-content">
        <el-form :model="bicycleDetailInfo"  class='demo-form' label-position='left'>
          <div class="cl" style="margin-bottom:15px;padding-bottom:15px;border-bottom:1px solid #d1dbe5;">
            <h4>ID:{{bicycleDetailInfo.id}}</h4><el-button class='fr' type='primary'  size="small" @click='disabled=false'>修改</el-button>
          </div>
          <el-form-item label="单车编号：" :label-width="formLabelWidth">
            <el-input type="number" :disabled="disabled" size='small' style='width:auto' v-model="bicycleDetailInfo.code" auto-complete="off" @blur='checkBicycleCode(bicycleDetailInfo.code)'></el-input>
          &nbsp;&nbsp;&nbsp;<el-button type="primary" size="mini" @click='showHistroy=true'>修改记录</el-button>
          </el-form-item>
          <el-form-item label="MAC地址：" :label-width="formLabelWidth">
            <el-input :disabled="disabled" size='small' style='width:auto' v-model="bicycleDetailInfo.mac" @blur="checkMacUnique(bicycleDetailInfo.mac)" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="城市：" :label-width="formLabelWidth">
            <el-select style="width:161px;" class='form-input' :disabled="disabled"  v-model="bicycleDetailInfo.cityCode" size='small' placeholder="请选择">
               <el-option
                 v-for="item in cityList"
                 :label="item.name"
                 :value="item.code">
               </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="电量：" :label-width="formLabelWidth" >
            {{bicycleDetailInfo.battery}}
          </el-form-item>
          <el-form-item label="新车投放时间：" :label-width="formLabelWidth"align='left'>
            {{bicycleDetailInfo.created}}
          </el-form-item>
          <el-form-item label="最新位置" :label-width="formLabelWidth"align='left' >
            <span v-if = 'bicycleDetailInfo.endPlace'>关锁位置&nbsp;&nbsp;{{bicycleDetailInfo.endTime}}</span>
            <span v-if = 'bicycleDetailInfo.startPlace&&!bicycleDetailInfo.endPlace'>开锁位置&nbsp;&nbsp;{{bicycleDetailInfo.startTime}}</span>
          </el-form-item>
          <!-- <el-form-item label="低频：" >
              最后一次关锁后&nbsp;<el-input v-model="userData.name" class='w-30' auto-complete="off"></el-input>&nbsp;分钟未再开锁
          </el-form-item> -->
        </el-form>
          <div class="map-container" v-show="showBicyleDetailMap" id='bicycleDetailMap' ref="bicycleMap"></div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showBicycleDetail = false">取 消</el-button>
        <el-button type="primary"
        @click="editBicycle"
         >确 定</el-button>
      </div>
   </el-dialog>
   <el-dialog title="批量导入"  v-model="showUpload">
        <el-upload
        class="upload-demo"
        multiple
        :on-success="handleUploadScucess"
         :before-upload="beforeAvatarUpload"
        action="/bicycle/manage/fileUpload/2"
        :file-list="fileList3">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip" style="line-height: 2">1、只能上传excel、xlsx文件<br>2、<a class="a_link" href="/static/updateBicycle.xlsx">点击下载模板</a></div>
       </el-upload>

   </el-dialog >
   <el-dialog title="单车编号修改记录" :modal='false' size='tiny' v-model="showHistroy">
     <p v-for="item in bicycleDetailInfo.updateLog" style="margin-bottom:30px;">
       <span>{{item.date}}</span>
        <span style="margin-left:50px">{{item.num}}</span>
     </p>
   </el-dialog >
   <!--  添加车辆弹框-->
   <el-dialog title="添加车辆" v-model="showAddBicycle"  :close-on-click-modal='false'>
     <div class="dialog-content">
       <el-form  label-position='left'>
         <el-form-item label="单车编号：" :label-width="formLabelWidth">
           <el-input  size='small' type="number" style='width:auto' v-model="addBicycleParam.code" @blur='checkBicycleCode(addBicycleParam.code)' auto-complete="off"></el-input>
         </el-form-item>
         <el-form-item label="车辆城市：" :label-width="formLabelWidth">
           <el-select style="width:161px;" class='form-input'  v-model="addBicycleParam.cityCode" size='small' placeholder="请选择">
              <el-option
                v-for="item in cityList"
                :label="item.name"
                :value="item.code">
              </el-option>
           </el-select>
         </el-form-item>
         <el-form-item label="MAC地址：" :label-width="formLabelWidth" >
           <el-input  size='small' style='width:auto' v-model="addBicycleParam.mac"  @blur='checkMacUnique(addBicycleParam.mac)' auto-complete="off"></el-input>
         </el-form-item>
       </el-form>
     </div>

     <div slot="footer" class="dialog-footer">
       <el-button @click="cancleAdd">取 消</el-button>
       <el-button type="primary"
       @click = 'addBicycle'
        >确 定</el-button>
     </div>
   </el-dialog>
  </div>
</template>
<script>
  import {arrayContains} from "../../../utils/index.js"
  import {checkMacUnique,queryCity,addBicycle,editBicycle,getBicycleByPagenation,fileUpload,excelExport,updateToAnchor,checkCode,relieveAnchor,lockingAnchor,bicycleAlarm} from '../../../service/getData.js'
  import {getArrayFromArrayObj,deepCopy} from '../../../utils/index'
  let map;
  let batch = 2; //二代车
  export default {
    name: 'main',
    data () {
      return {
          userData:[{"id":301,"createBy":null, name:'ss',loc:{lng:'105',lat:'30'},"createTimeSpan":1490840782421,"createDate":1490840782000,"updateBy":null,"updateTimeSpan":1490840782421,"updateDate":1490840782000,"deletedFlag":false,"username":"admin","nickName":"超管"}],
          selectRuleOptions:[{
            value:'all',
            label:'全部'
          },{
            value:'none',
            label:'无异常'
          },{
            value:'rideTimeout',
            label:'骑行超时'
          },{
            value:'lowBattery',
            label:'低电量'
          },{
            value:'lowFrequency',
            label:'低频'
          }],
          showUpload:false,
          total:1,
          currentPage:1,
          showAnomaly:false,
          showMap:false,
          showBicyleDetailMap:true,
          showBicycleDetail:false,
          showAddBicycle:false,
          disabled:true,
          showHistroy:false,
          mapInput:'',
          formLabelWidth: '120px',
          bicycleDetail:[],
          loading_1:true,
        //  selectedCity:'',
          bicycleDetailInfo:{},
          multipleSelection:[],
          multipleSelectionCodes:[],
          cityList:[],
          selectedRule:'',
          rulesTransform:{
            rideTimeout:'20',
            lowBattery:'10',
            lowFrequency:'30',
            isBroken:''
          },
          fileList3: [],
          searchParam:{
               code:'',//单车编码
              cityCode:'',//城市编码
              rideTimeout:'',
              lowBattery:'',
              lowFrequency:'',
              isBroken:'',
          },
          addBicycleParam :{
            code:'',
            cityCode:'',
            mac:''
          },
          bicycleListParam:{
             code:'',//单车编码
          	 cityCode:'',//城市编码
          	 rideTimeout:'',//骑行超时
          	 lowFrequency:'',//低频
          	 batch:'2',//批次
          	 lowBattery:'',//低电量
          	 dataException:'',//报文异常
          	 pageSize:'', //页面大小
          	 pageNow:'1',   //第几页(当前页)
          }
        }
    },
    props:{
      "pageSize":{
        type:Number,
      }
    },
    watch:{
      pageSize(newValue,oldValue){
        console.log(newValue)
          this.bicycleListParam.pageSize = this.pageSize;
          this.queryBicycleList();
      }
    },
    mounted(){
      this.bicycleListParam.pageSize = this.pageSize;
      this.queryBicycleList();
      this.queryCity();
    },
    methods:{
      handleChange(file, fileList) {
      this.fileList3 = fileList.slice(-3);
    },
    queryCity(){
      queryCity("",data => {
       this.cityList = data;
      })
    },
    queryBicycleList(){
      if(!this.loading_1) this.loading_1 = true;
      getBicycleByPagenation(batch,this.bicycleListParam,data => {
          this.total = data.rowCount;
          //this.currentPage = data.pageNow
          this.bicycleDetail = data.records
          this.loading_1 = false;
      })
    },
    changePage(pageNow){
      this.bicycleListParam.pageNow = pageNow;
      this.queryBicycleList()
    },
    selectRule(val){
      let isAll = arrayContains(val,"all");
      let isNone = arrayContains(val,"none");
      this.selectedRule = val;
      this.searchParam = {
          code:'',//单车编码
          cityCode:'',//城市编码
          rideTimeout:'',
          lowBattery:'',
          lowFrequency:'',
          isBroken:'',
      };
      if(isAll && val.length != 1){
        this.selectedRule = ["all"]
      }else if(isNone && val.length != 1){
        this.selectedRule = ["none"]
      }
      this.selectedRule.forEach((v,i)=>{
        if(val == "all"){
          for(let i in this.rulesTransform){
           this.searchParam[i] = '';
          }
        }else if (val == "none"){
           for(let i in this.rulesTransform){
             if(i == "isBroken"){
               this.searchParam[i] = 0;
             }else{
                this.searchParam[i] = '';
             }
           }
        }else{
          this.searchParam[v] = this.rulesTransform[v]
        }
      })
      console.log(this.searchParam)

      // if(val == "all"){
      //    for(let i in this.rulesTransform){
      //       this.searchParam[i] = this.rulesTransform[i];
      //    }
      // }else if (val == "none"){
      //    for(let i in this.rulesTransform){
      //      this.searchParam[i] = '';
      //    }
      // }else{
      //   for(let i in this.rulesTransform){
      //     if(i == val){
      //        this.searchParam[i] = this.rulesTransform[i];
      //     }else{
      //        this.searchParam[i] = '';
      //     }
      //   }
      //
      // }
    },
    searchBicyle(){
      for(let i in this.searchParam){ //遍历修改请求参数
         this.bicycleListParam[i] = this.searchParam[i];
      }
      this.bicycleListParam.pageNow = 1; //页码初始为第一页
      this.queryBicycleList();
    },
    editBicycle(){
      editBicycle(this.bicycleDetailInfo,data => {
          this.$alert(data.msgContent);
          if(data.success){
            this.showBicycleDetail =false;
            this.queryBicycleList();
          }
      })
    },
    excelExport(){
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: '请至少选择一辆单车',
          type: 'warning'
        });
        return;
      }
      let str = 'ids=';
      for (let i = 0 ;i < this.multipleSelection.length; i++) {
        str += this.multipleSelection[i]+",";
      }
      str = str.substring(0,str.length-1);
      window.open('/bicycle/manage/excelExport/2?'+str)

    },
    handleUploadScucess(res,file){
      this.$alert(file.name+':'+res.msgContent);
      this.bicycleListParam.pageNow = 1;
      this.queryBicycleList()
    },
    beforeAvatarUpload(file) {
      console.log(file)
    //  const isExcel = file.type === 'image/jpeg';
    // // const isLt2M = file.size / 1024 / 1024 < 2;
    //
    //  if (!isExcel) {
    //    this.$message.error('上传头像图片只能是 JPG 格式!');
    //  }

    //return isExcel ;
    },
    addBicycle(){
      if(this.addBicycleParam.code){
        addBicycle(batch,this.addBicycleParam,data => {
          if(data.success){
            this.showAddBicycle = false;
          }
          this.$alert(data.msgContent);
          this.queryBicycleList();
          for(let i in this.addBicycleParam){
            this.addBicycleParam[i] = "";
          }
        })
      }else{
        this.$alert("单车编号不能为空");
      }

    },
    checkBicycleCode(value){
       checkCode({code:value},data =>{
         if(!data.success)
            this.$alert(data.msgContent);
       })
    },
    checkMacUnique(mac){
       checkMacUnique({mac:mac},data =>{
         if(!data.success)
            this.$alert(data.msgContent);
       })
    },
    showLocationMap(lat,lng){
        this.showMap = true;
        let container = 'showLocation';
        this.lazyInitMap(container,lng,lat);
    },
    lazyInitMap(container,lng,lat){
      setTimeout(()=>{
         map = new BMap.Map(container)
        let mPoint = new BMap.Point(lng,lat);
        let marker = new BMap.Marker(mPoint)
        map.centerAndZoom(mPoint,13);
        map.enableScrollWheelZoom(true);
        map.addOverlay(marker)
      },50)
    },
    seachLocation(){
      let userInput = this.mapInput;
      let local = new BMap.LocalSearch(map, {
    		renderOptions:{map: map}
    	});
    	local.search(userInput,{forceLocal:true});
    },
    handleEdit(index,row){
      let container = 'bicycleDetailMap';
      this.showBicycleDetail = true;
      this.bicycleDetailInfo = deepCopy(row);
      console.log(this.bicycleDetailInfo)
        console.log(row)
      let updateLog = this.bicycleDetailInfo.updateLog
      if(updateLog){
         let logArr = updateLog.split('|');
         logArr.forEach((val,index) => {
           if(val != ""){
             let logDetailArr = val.split(',');
             let obj = {
               date:logDetailArr[0],
               num:logDetailArr[1]
             }
             logArr[index] = obj;
           }
         });
        this.bicycleDetailInfo.updateLog = logArr
      }
      if(row.endPlace){
          this.showBicyleDetailMap = true;
          this.lazyInitMap(container,row.endLon,row.endLat);
      }else if(row.startPlace){
          this.showBicyleDetailMap = true;
          this.lazyInitMap(container,row.startLon,row.startLat);
      }else{
        this.showBicyleDetailMap = false;
      }
    },
    handleSelectionChange(obj){
      this.multipleSelection = getArrayFromArrayObj('id',obj);
      this.multipleSelectionCodes = getArrayFromArrayObj('code',obj);
    },
    bicycleAlarm(){
      let param = {
        codes : this.multipleSelectionCodes
      }
      if(this.multipleSelectionCodes.length == 0){
        this.$message({
          message: '请至少选择一辆单车',
          type: 'warning'
        });
      }else{
        bicycleAlarm(param, data => {
          this.$alert(data.msgContent);
          this.multipleSelectionCodes = [];
          this.$refs.table.clearSelection();
        })
      }
    },
    lockingAnchor(){
      let param = {
        codes : this.multipleSelectionCodes
      }
      if(this.multipleSelectionCodes.length == 0){
        this.$message({
          message: '请至少选择一辆单车',
          type: 'warning'
        });
      }else{
        lockingAnchor(param, data => {
          if(data.success){
            this.queryBicycleList();
          }
          this.$alert(data.msgContent);
          this.multipleSelectionCodes = [];
          this.$refs.table.clearSelection();
        })
      }
    },
    relieveAnchor(){
      let param = {
        codes : this.multipleSelectionCodes
      }
      if(this.multipleSelectionCodes.length == 0){
        this.$message({
          message: '请至少选择一辆单车',
          type: 'warning'
        });
      }else{
        relieveAnchor(param, data => {
          if(data.success){
            this.queryBicycleList();
          }
          this.$alert(data.msgContent);
          this.multipleSelectionCodes = [];
          this.$refs.table.clearSelection();
        })
      }
    },
    fileUpload(e){
      let file = e.target.files[0];
      console.log(file)
      var reader = new FileReader();
       reader.readAsDataURL(file);
       //监听文件读取结束后事件
     reader.onloadend = function (el) {
       console.log(el);    //e.target.result就是最后的路径地址
       };
    },
    cancleAdd(){
      this.showAddBicycle = false;
      for(let i in this.addBicycleParam){
        this.addBicycleParam[i] = "";
      }
    }
    },
    components: {

    },
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" >
  .a_link {
    text-decoration: underline;
    color: inherit;
  }
  .search-bar{
      padding: 15px;
      border-bottom:1px solid #d1dbe5;
      .search-bar-grid{
          margin-right:30px;
          .form-input{
            width: 150px;
          }
          .el-icon-setting{
            cursor: pointer;
            font-size: 16px;
            color: #20a0ff;
          }
      }
  }
  .btn-bar,{
    padding: 15px;
  }
  .table-content{
    padding: 0 15px;
  }
  .w-40{
    width:100px;
  }
  .dialog-content{
      position: relative;
      .map-container{
        width: 100%;
        height: 400px;
      }
      .map-input{
        width: 300px;
        position: absolute;
        left: 15px;
        top:15px;
      }
  }
.el-form-item{
  margin-bottom: 10px;
}

</style>
