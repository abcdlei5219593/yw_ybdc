<template>
      <el-col class="home" :sm='22' :xs='24'>
        <el-tabs v-model="activeName" type="card" clearable="false" @tab-click="changeTab">
           <el-tab-pane label="骑行率统计" name="1">
             <div class="box cl" >
               <el-row :gutter="20" style="margin-top:15px;">
                 <el-col :sm='16' :xs='24'>
                   <el-tabs v-model="activeName2" type="border-card" @tab-click="changeMiniTab">
                      <el-tab-pane label="使用率" name="1">
                          <div id="userCharts1" class='user-charts' style="height:400px;margin-top:20px" v-loading='loading1'></div>
                      </el-tab-pane>
                      <el-tab-pane label="日均频次" name="2">
                          <div id="userCharts2" class='user-charts' style="height:400px;margin-top:20px" v-loading='loading2'></div>
                      </el-tab-pane>


                    </el-tabs>

                 </el-col>
                 <el-col :sm='8' :xs='24' v-if="showPannel1">
                   <div class="box pannel">
                     <el-col :span="24" class="box-line">
                       <label >今日在营车辆：</label>&nbsp;&nbsp; {{rideStatistics.todayInCampCount}}辆</label>
                     </el-col>
                     <el-col :span="24" class="box-line">
                       <label >今日在用车辆：</label>&nbsp;&nbsp;  {{rideStatistics.todayOnUseCount}}辆 </label>
                     </el-col>
                     <el-col :span="24" class="box-line">
                       <label >今日在营车辆平均使用次数：</label>&nbsp;&nbsp;  {{rideStatistics.todayInCampAvgUseTimes | toFixed_2}}次
                     </el-col>
                     <el-col :span="24" class="box-line">
                       <label >今日在用车辆平均使用次数：</label>&nbsp;&nbsp;  {{rideStatistics.todayOnUseAvgUseTimes | toFixed_2}}次
                     </el-col>
                     <el-col :span="24" class="box-line">
                       <label >今日在营车辆平均使用时长：</label>&nbsp;&nbsp;  {{rideStatistics.todayInCampAvgUseMinute | toFixed_2}}分钟
                     </el-col>
                     <el-col :span="24" class="box-line">
                       <label >今日在用车辆平均使用时长：</label>&nbsp;&nbsp;  {{rideStatistics.todayOnUseAvgUseMinute | toFixed_2}}分钟
                     </el-col>
                   </div>
                 </el-col>
                 <el-col :span="8" v-if="showPannel2">
                   <div class="box">
                     <el-col :span="24" class="box-line">
                       <label >当前总车辆：</label>&nbsp;&nbsp;  {{dailyFrequency.currentBicycleCount}}
                     </el-col>
                     <el-col :span="24" class="box-line">
                       <label >今日被骑行：</label>&nbsp;&nbsp;  {{dailyFrequency.todayRideCount}}
                     </el-col>
                     <!-- <el-col :span="24" class="box-line">
                       <label >今日在用车辆平均使用次数：</label>&nbsp;&nbsp;  {{dailyFrequency.create_price}}
                     </el-col> -->
                     <el-col :span="24" class="box-line">
                       <label >今日骑行率：</label>&nbsp;&nbsp;  {{dailyFrequency.ridingToday}}%
                     </el-col>
                   </div>
                 </el-col>
               </el-row>


             </div>
           </el-tab-pane>
           <el-tab-pane label="分布统计" name="2">
             <div class="box cl" >
               <el-row :gutter="20" style="margin-top:15px;">
                   <div class="box">
                        <el-col :sm='8' :xs='24' class="">
                          <label >今日付费骑行：</label>{{paidRideToday.times_for_pay}}次&nbsp;&nbsp; {{paidRideToday.min_for_pay}}分钟
                        </el-col>
                        <el-col :sm='8' :xs='24' class="margin-20">
                          <label >今日免费费骑行：</label>{{freeRideToday.times_for_free}}次&nbsp;&nbsp; {{freeRideToday.min_for_free}}分钟
                        </el-col>
                        <el-col :sm='8' :xs='24' class="margin-20">
                          <label >今日创造总金额：</label>{{totalMoneyPaidToday.sum_money_for_pay}}元
                        </el-col>
                   </div>

               </el-row>
               <el-row :gutter="20" style="margin-top:15px;">
                   <el-col :sm='12' :xs='24'>
                     <el-tabs v-model="activeName3" type="border-card" @tab-click="changeMiniTab_2">
                        <el-tab-pane label="骑行次数" name="4">
                            <div id="userCharts3" class='user-charts' style="width: 100%;height:400px;margin-top:20px" v-loading='loading4'></div>
                        </el-tab-pane>
                        <el-tab-pane label="骑行时长" name="5">
                            <div id="userCharts4" class='user-charts' style="width: 100%;height:400px;margin-top:20px" v-loading='loading5'></div>
                        </el-tab-pane>
                        <el-tab-pane label="创造金额" name="6">
                            <div id="userCharts5" class='user-charts' style="width: 100%;height:400px;margin-top:20px"v-loading='loading6'></div>
                        </el-tab-pane>
                      </el-tabs>
                   </el-col>
                   <el-col :sm='12' :xs='24'>
                     <div id="userCharts8" class='user-charts' style="width: 100%;height:400px;margin-top:20px" v-loading='loading8'></div>
                   </el-col>
               </el-row>

             </div>
           </el-tab-pane>
        </el-tabs>
      </el-col>
</template>

<script>
  import picker from '../../components/datePicker/datePicker.vue'
  import {getRidingPrice,getRideCountCharts,queryHistoryData,queryHistoryDataForThree,getRideStatistics,getDailyFrequency,getDistributionStatisticsData,getAveragePerDayFrequency,getBicycleCountCharts,getBicycleTimeCharts,getBicycleCreateAmount,getBicycleRideTimeCharts,getCreateProfitCharts} from '../../service/getData'

  var echarts = require('echarts');

export default {
  name: 'life',
  data () {
    return {
      showPannel1:true,
      showPannel2:false,
      msg: '',
      activeName:'1',
      activeName2:'1',
      'activeName3':'4',
      main:true,
      rideStatistics:'',
      dailyFrequency:'',
      rideNumberPeopleWeek:'',
      freeRideToday:'',
      paidRideToday:'',
      totalMoneyPaidToday:'',
      prop:'/ybdcHome',
      loading1:true,
      loading2:true,
      loading3:true,
      loading4:true,
      loading5:true,
      loading6:true,
      loading7:true,
      loading8:true,
      flag1:true,
      flag2:true,
      flag3:true,
      flag4:true,
      flag5:true,
      flag6:true,
      flag7:true,
      flag8:true,
      todayPayRide:'',
      todayFreeRide:'',
      todayCreateAmount:'',
      dailyTrendRideCountChart:{
          dataX:[],
          data_1:[],
          data_2:[]
      },
      dailyTrendRideLongTimeChart:{
          dataX:[],
          data_1:[],
          data_2:[],
          data_3:[]
      },
      bicycleTimeCharts:{
        dataX:[],
        data_1:[],
        data_2:[],
        data_3:[]
      },
      bicycleCountCharts:{
        dataX:[],
        data_1:[],
        data_2:[],
        data_3:[]
      },
      bicycleCreateAmount:{
        dataX:[],
        data_1:[],
        data_2:[],
        data_3:[]
      },
      userUsageHabits:{
        dataX:[],
        data_1:[],

      },
      creatPrice:{
        dataX:[],
        data_1:[],
        data_2:[],
        data_3:[]
      },
      getDate:'',

    }
  },
  watch:{
      cityCode(code,code2){
        if(code2!=''){
          let cityCode = code;
          this.changeFlag();
          this.initTab(cityCode)
        }
      }
  },
  computed:{
    cityCode(){
      return this.$store.state.cityCode;
    }
  },
  filters:{
    toFixed_2(value){
       if(value){
         if(value == 0){
            return value;
         }
         else{
          let foFiexValue = value.toFixed(2);
          return foFiexValue
         }
       }
    }
  },
  methods:{
    changeFlag(){
      this.flag1 = true;
      this.flag2 = true;
      this.flag3 = true;
      this.flag4 = true;
      this.flag5 = true;
      this.flag6 = true;
      this.flag7 = true;
      this.flag8 = true;
    },
    initTab(cityCode){
      if(this.activeName == 1){
        this.showMenu_1(cityCode)
        this.initMiniTab(cityCode);
      }else if(this.activeName == 2){

        this.showMenu_2(cityCode)
        this.initMiniTab_2(cityCode);
      }

    },
    // 切换顶部TAB选项卡；
    changeTab(tab,event){
      this.activeName = tab.name;
      this.initTab(this.cityCode);

      // let _this = this;
      // let loadingName = 'loading'+tab.name;
      // this[loadingName] = true;
      // setTimeout(function(){
      //   _this.activeName = tab.name;
      //   _this.initTab();
      // },200)
    },
    initMiniTab(cityCode){
      if(this.activeName2 == 1){
         this.showInnerMenu_1(cityCode);
      }else if(this.activeName2 == 2){
        this.showInnerMenu_2(cityCode)
      }
    },

    initMiniTab_2(cityCode){
      if(this.activeName3 == 4){
         this.showInnerMenu_3(cityCode);
      }else if(this.activeName3 == 5  ){
        this.showInnerMenu_4(cityCode)
      }else if(this.activeName3 == 6 ){
        this.showInnerMenu_5(cityCode)
      }
    },
    changeMiniTab(tab){
      this.activeName2 = tab.name;
      this.initMiniTab(this.cityCode);
    },
    changeMiniTab_2(tab){
      this.activeName3 = tab.name;
      this.initMiniTab_2(this.cityCode);
    },
    showMenu_1(cityCode){
      let param = {
          cityCode :cityCode
      }
      getRideStatistics(param,res => {
          this.rideStatistics = res.result.rideStatistics;
      })
      getDailyFrequency(param,res =>{
          this.dailyFrequency = res.result;
      })
    },
    showMenu_2(cityCode){
      let param = {
        cityCode :cityCode
      }
       getDistributionStatisticsData(param,res => {
         this.freeRideToday = res.result.freeRideToday;
         this.paidRideToday = res.result.paidRideToday;
         this.totalMoneyPaidToday = res.result.totalMoneyPaidToday;
       })
    },
    getAllBicycleData(cityCode,type,callback){
      if(cityCode == '028'){
        let param_1 = {
          cityCode :cityCode,
          batch:2,
          type:type
        };
        let param_2 = {
          cityCode :cityCode,
          batch:3,
          type:type
        };
        queryHistoryData(param_1,param_2, (acct, perms) => {
            let bikeDataTwo = acct.data.result.result;
            let bikeDataThree =  perms.data.result.result;
            callback(bikeDataThree,bikeDataTwo)
        });
      }else{
        let param = {
          cityCode :cityCode,
          batch:3,
          type:type
        };
        queryHistoryDataForThree(param,res =>{
          let bikeDataThree = res.result.result;
          callback(bikeDataThree)
        })
      }
   },
    showInnerMenu_1(cityCode){
      if(this.flag1 == true){
        this.loading1 = true;
        this.flag1 = false;
        this.getAllBicycleData(cityCode,1,(bikeDataThree,bikeDataTwo) =>{
            let dom = echarts.init(document.getElementById('userCharts1'));
            this.dailyTrendRideCountChart.dataX = [];
            this.dailyTrendRideCountChart.data_1 = [];
            this.dailyTrendRideCountChart.data_2 = [];
            if(bikeDataTwo){
              for(let i=0;i<bikeDataTwo.length;i++){
                  this.dailyTrendRideCountChart.dataX.push(bikeDataTwo[i].specificDate);
                  this.dailyTrendRideCountChart.data_1.push(bikeDataTwo[i].rate);
              }
              for(let j=0;j<bikeDataThree.length;j++){
                  this.dailyTrendRideCountChart.data_2.push(bikeDataThree[j].rate);
              }
              this.drawRideRateCharts(dom)
            }else{
              for(let k=0;k<bikeDataThree.length;k++){
                  this.dailyTrendRideCountChart.dataX.push(bikeDataThree[k].specificDate);
                  this.dailyTrendRideCountChart.data_2.push(bikeDataThree[k].rate);
              }
              this.drawRideRateChartsForThree(dom);
            }
        })
      }
      this.showPannel1 = true;
      this.showPannel2 = false;

    },
    drawRideRateCharts(dom){
      console.log(this.dailyTrendRideCountChart.dataX)
      dom.setOption({
          tooltip: {
              trigger: 'axis'
          },
          legend: {
            data:['二代车','三代车']
          },
          dataZoom: [
              {
                  show: true,
                  realtime: true,
                  start: 0,
                  end: 100
              },
              {
                  type: 'inside',
                  realtime: true,
                  start: 0,
                  end: 100
              }
          ],
          xAxis: {
              type: 'category',
              data: this.dailyTrendRideCountChart.dataX,
              name:'日期'
          },
          yAxis: {
            name:'概率'
          },
          series: [
          {
              name: '二代车',
              type: 'line',
              data: this.dailyTrendRideCountChart.data_1
          },
          {
              name: '三代车',
              type: 'line',
              data: this.dailyTrendRideCountChart.data_2
          }
          ]
      });
      this.loading1 = false;
    },
    drawRideRateChartsForThree(dom){
      dom.setOption({
          tooltip: {
              trigger: 'axis'
          },
          legend: {
            data:['三代车']
          },
          dataZoom: [
              {
                  show: true,
                  realtime: true,
                  start: 0,
                  end: 100
              },
              {
                  type: 'inside',
                  realtime: true,
                  start: 0,
                  end: 100
              }
          ],
          xAxis: {
              type: 'category',
              data: this.dailyTrendRideCountChart.dataX,
              name:'日期'
          },
          yAxis: {
            name:'概率'
          },
          series: [
          {
              name: '三代车',
              type: 'line',
              data: this.dailyTrendRideCountChart.data_2
          }
          ]
      });
      this.loading1 = false;
    },
    showInnerMenu_2(cityCode,getMonth){
      if(this.flag2 == true){
        this.flag2 = false;
          this.getAllBicycleData(cityCode,2,(bikeDataThree,bikeDataTwo) =>{
              let dom = echarts.init(document.getElementById('userCharts2'));
              this.dailyTrendRideLongTimeChart.dataX = [];
              this.dailyTrendRideLongTimeChart.data_1 = [];
              this.dailyTrendRideLongTimeChart.data_2 = [];
              if(bikeDataTwo){
                for(let i=0;i<bikeDataTwo.length;i++){
                    this.dailyTrendRideLongTimeChart.dataX.push(bikeDataTwo[i].specificDate);
                    this.dailyTrendRideLongTimeChart.data_1.push(bikeDataTwo[i].rate);
                }
                for(let j=0;j<bikeDataThree.length;j++){
                    this.dailyTrendRideLongTimeChart.data_2.push(bikeDataThree[j].rate);
                }
                this.drawDailyTrendRideLongTimeChart(dom)
              }else{
                for(let k=0;k<bikeDataThree.length;k++){
                    this.dailyTrendRideLongTimeChart.dataX.push(bikeDataThree[k].specificDate);
                    this.dailyTrendRideLongTimeChart.data_2.push(bikeDataThree[k].rate);
                }
                this.drawDailyTrendRideLongTimeChartForThree(dom);
              }
          })



      }
      this.showPannel1 = false;
      this.showPannel2 = true;
    },
    drawDailyTrendRideLongTimeChart(dom){
      dom.setOption({
        tooltip: {
            trigger: 'axis'
        },
        legend: {
          data:['二代车','三代车']
        },
        dataZoom: [
            {
                show: true,
                realtime: true,
                start: 0,
                end: 100
            },
            {
                type: 'inside',
                realtime: true,
                start: 0,
                end: 100
            }
        ],
        xAxis: {
            type: 'category',
            data: this.dailyTrendRideLongTimeChart.dataX,
            name:'日期'
        },
        yAxis: {
          name:'次数（次）'
        },
        series: [
        {
            name: '二代车',
            type: 'line',
            data: this.dailyTrendRideLongTimeChart.data_1
        },
        {
            name: '三代车',
            type: 'line',
            data: this.dailyTrendRideLongTimeChart.data_2
        }
        ]
      });
      this.loading2 = false;
    },
    drawDailyTrendRideLongTimeChartForThree(dom){
      dom.setOption({
        tooltip: {
            trigger: 'axis'
        },
        legend: {
          data:['三代车']
        },
        dataZoom: [
            {
                show: true,
                realtime: true,
                start: 0,
                end: 100
            },
            {
                type: 'inside',
                realtime: true,
                start: 0,
                end: 100
            }
        ],
        xAxis: {
            type: 'category',
            data: this.dailyTrendRideLongTimeChart.dataX,
            name:'日期'
        },
        yAxis: {
          name:'次数（次）'
        },
        series: [
        {
            name: '三代车',
            type: 'line',
            data: this.dailyTrendRideLongTimeChart.data_2
        }
        ]
      });
      this.loading2 = false;
    },
    showInnerMenu_3(cityCode){
      let [dataX,data_1] = [[],[]];
      let param = {
        cityCode:cityCode
      }
      if(this.flag3 == true){
        this.flag3 = false;

        getBicycleCountCharts(param,res => {
          let dom = echarts.init(document.getElementById('userCharts3'));
          let data = res.result.bicycleCountCharts;
          for(let i=0;i<data.length;i++){
              this.bicycleCountCharts.dataX.push(data[i].number);
              this.bicycleCountCharts.data_1.push(data[i].total);
              this.bicycleCountCharts.data_2.push(data[i].free_total);
              this.bicycleCountCharts.data_3.push(data[i].pay_total);
          }
          this.drawBicycleCountCharts(dom);
        })
      }
      this.drawRideCountChart(cityCode);
    },
    drawBicycleCountCharts(dom){
      dom.setOption({

          tooltip: {
              trigger: 'axis'
          },
          legend: {
            data:['总次数','免费骑行次数','付费骑行次数']
          },
          dataZoom: [
              {
                  show: true,
                  realtime: true,
                  start: 0,
                  end: 100
              },
              {
                  type: 'inside',
                  realtime: true,
                  start: 0,
                  end: 100
              }
          ],
          xAxis: {
              type: 'category',
              data:  this.bicycleCountCharts.dataX,
              name:'使用次数（次）'
          },
          yAxis: {
            name:'车辆数'
          },
          series: [
          {
              name: '总次数',
              type: 'line',
              data:  this.bicycleCountCharts.data_1
          },
          {
              name: '免费骑行次数',
              type: 'line',
              data:  this.bicycleCountCharts.data_2
          },
          {
              name: '付费骑行次数',
              type: 'line',
              data:  this.bicycleCountCharts.data_3
          },
          ]
      });
      this.loading3 = false;
    },
    showInnerMenu_4(cityCode){
      let param = {
        cityCode:cityCode
      }
      if(this.flag4 == true){
        this.flag4 = false;
        getBicycleTimeCharts(param,res =>{
          let data = res.result.bicycleTimeCharts;
          for(let i=0;i<data.length;i++){
              this.bicycleTimeCharts.dataX.push(data[i].longtime);
              this.bicycleTimeCharts.data_1.push(data[i].total);
              this.bicycleTimeCharts.data_2.push(data[i].free_total);
              this.bicycleTimeCharts.data_3.push(data[i].pay_total);
          }
          let dom = echarts.init(document.getElementById('userCharts4'));
          this.drawBicycleTimeCharts(dom)
        })
      }
      this.drawRideTimeChart(cityCode);
    },
    drawBicycleTimeCharts(dom){
      dom.setOption({

          tooltip: {
              trigger: 'axis'
          },
          legend: {
            data:['总次数','免费骑行次数','付费骑行次数']
          },
          dataZoom: [
              {
                  show: true,
                  realtime: true,
                  start: 0,
                  end: 100
              },
              {
                  type: 'inside',
                  realtime: true,
                  start: 0,
                  end: 100
              }
          ],
          xAxis: {
              type: 'category',
              data:  this.bicycleTimeCharts.dataX,
              name:'使用时长（分钟）'
          },
          yAxis: {
            name:'车辆数'
          },
          series: [
          {
              name: '总次数',
              type: 'line',
              data:  this.bicycleTimeCharts.data_1
          },
          {
              name: '免费骑行次数',
              type: 'line',
              data:  this.bicycleTimeCharts.data_2
          },
          {
              name: '付费骑行次数',
              type: 'line',
              data:  this.bicycleTimeCharts.data_3
          },
          ]
      });
      this.loading4 = false;
    },
    drawRideCountChart(cityCode){
      let param = {
        cityCode:cityCode
      }
      getRideCountCharts(param,res => {
        let data = res.result.rideCountCharts;
        var myChart = echarts.init(document.getElementById('userCharts8'));
          myChart.setOption({
            title: { text: '骑行次数分布统计图' },
            tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend:{
              orient: 'vertical',
              left: 'right',
              data: ['0~15次','15~30次','30~60次','60~90次','90~120次','120~360次','360次以上']
            },
            series: [{
              name: '骑行次数分布',
              type: 'pie',
              radius : '55%',
              center: ['50%', '60%'],
              data:[
                  {value:data['0_15'], name:'0~15次'},
                  {value:data['15_30'], name:'15~30次'},
                  {value:data['30_60'], name:'30~60次'},
                  {value:data['60_90'], name:'60~90次'},
                  {value:data['90_120'], name:'90~120次'},
                  {value:data['120_360'], name:'120~360次'},
                  {value:data['360_'], name:'360次以上'},
              ],
              itemStyle: {
                  emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
              }
          }]
          });
        this.loading8 = false;
      })

    },
    showInnerMenu_5(cityCode){
      let param = {
        cityCode:cityCode
      }
      if(this.flag5 == true){
        this.flag5 = false;
        getBicycleCreateAmount(param,res =>{
          let data = res.result.bicycleCreateAmount;
          for(let i=0;i<data.length;i++){
              this.bicycleCreateAmount.dataX.push(data[i].longtime);
              this.bicycleCreateAmount.data_1.push(data[i].total);
              this.bicycleCreateAmount.data_2.push(data[i].free_total);
              this.bicycleCreateAmount.data_3.push(data[i].pay_total);
          }
          let dom = echarts.init(document.getElementById('userCharts5'));
          this.drawBicycleCreateAmount(dom)
        })
      }
      this.drawCreateProfitCharts(cityCode);
    },
    drawBicycleCreateAmount(dom){
      dom.setOption({

          tooltip: {
              trigger: 'axis'
          },
          legend: {
            data:['总次数','免费骑行次数','付费骑行次数']
          },
          dataZoom: [
              {
                  show: true,
                  realtime: true,
                  start: 0,
                  end: 100
              },
              {
                  type: 'inside',
                  realtime: true,
                  start: 0,
                  end: 100
              }
          ],
          xAxis: {
              type: 'category',
              data:  this.bicycleCreateAmount.dataX,
              name:'创造金额（元）'
          },
          yAxis: {
            name:'车辆数'
          },
          series: [
          {
              name: '总次数',
              type: 'line',
              data:  this.bicycleCreateAmount.data_1
          },
          {
              name: '免费骑行次数',
              type: 'line',
              data:  this.bicycleCreateAmount.data_2
          },
          {
              name: '付费骑行次数',
              type: 'line',
              data:  this.bicycleCreateAmount.data_3
          },
          ]
      });
      this.loading5 = false;
    },
    drawCreateProfitCharts(cityCode){
      let param = {
        cityCode:cityCode
      }
      getCreateProfitCharts(param,res => {
        let data = res.result;
        var myChart = echarts.init(document.getElementById('userCharts8'));
          myChart.setOption({
            title: { text: '创造收益分布统计图' },
            tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend:{
              orient: 'vertical',
              left: 'right',
              data: ['1次','2~7次','7~13次','13~20次','20~40次','>40次']
            },
            series: [{
              name: '骑行次数分布',
              type: 'pie',
              radius : '55%',
              center: ['50%', '60%'],
              data:[
                  {value:data['_one'], name:'1次'},
                  {value:data['two_seven'], name:'2~7次'},
                  {value:data['seven_thirteen'], name:'7~13次'},
                  {value:data['thirteen_twenty'], name:'13~20次'},
                  {value:data['twenty_forty'], name:'20~40次'},
                  {value:data['forty_'], name:'>40次'},
              ],
              itemStyle: {
                  emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
              }
          }]
          });
        this.loading8 = false;
      })

    },

    drawRideTimeChart(cityCode){
      let param = {
        cityCode:cityCode
      }
      getBicycleRideTimeCharts(param,res => {
        let data = res.result;
        var myChart = echarts.init(document.getElementById('userCharts8'));
          myChart.setOption({
            title: { text: '骑行时长分布统计图' },
            tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend:{
              orient: 'vertical',
              left: 'right',
              data: ['0~15分钟','15~30分钟','30~60分钟','60~90分钟','90~120分钟','120~360分钟','360分钟以上']
            },
            series: [{
              name: '骑行时长分布',
              type: 'pie',
              radius : '55%',
              center: ['50%', '60%'],
              data:[
                  {value:data['zero_fifteen'], name:'0~15分钟'},
                  {value:data['fifteen_thirty'], name:'15~30分钟'},
                  {value:data['thirty_sixty'], name:'30~60分钟'},
                  {value:data['sixty_ninety'], name:'60~90分钟'},
                  {value:data['ninety_onetwenty'], name:'90~120分钟'},
                  {value:data['onetwenty_threesixty'], name:'120~360分钟'},
                  {value:data['threesixty_'], name:'360分钟以上'},
              ],
              itemStyle: {
                  emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
              }
          }]
          });
        this.loading8 = false;
      })
    },
    showInnerMenu_6(cityCode){

      var dataParam2 = {
            filterType:'Frequency',
            cityCode:cityCode
      }
     if(this.flag6 == true){
       this.flag6 = false;
       userStatisticsQueryUserUsageHabits(dataParam2, (data) => {
         for(let i=0;i<data.result.result.frequencies.length;i++){
             this.userUsageHabits.dataX.push(data.result.result.frequencies[i].dayDividedTimes);
             this.userUsageHabits.data_1.push(data.result.result.frequencies[i].numberOfRidingUsers);
         }
         // 基于准备好的dom，初始化echarts实例
         let  dom = echarts.init(document.getElementById('userCharts6'));
         // 绘制图表
         this.drawUserUsageHabits(dom)
       });
     }
     this.drawRideCountChart(cityCode);
    },
    drawUserUsageHabits(dom){
      dom.setOption({
          tooltip: {
              trigger: 'axis'
          },
          xAxis: {
              type: 'category',
              data: this.userUsageHabits.dataX,
              name:'频率'
          },
          dataZoom: [
              {
                  show: true,
                  realtime: true,
                  start: 0,
                  end: 100
              },
              {
                  type: 'inside',
                  realtime: true,
                  start: 0,
                  end: 100
              }
          ],
          yAxis: {
             name:'人数(人)'
          },
          series: [
          {
              name: '人数',
              type: 'line',
              data: this.userUsageHabits.data_1
          }
          ]
      });
      this.loading6 = false;
    },
    showInnerMenu_7(cityCode){
      let param = {
        cityCode:cityCode
      }
      if(this.flag7 == true){
        this.flag7 = false;
        getCreateAmount(param,res => {
          let data = res.result.createAmount;
          for(let i=0;i<data.length;i++){
              this.createPrice.dataX.push(data[i].price);
              this.createPrice.data_1.push(data[i].people);
          }
          let dom = echarts.init(document.getElementById('userCharts7'));
          this.drawCreatePrice(dom);
        })
      }
      this.drawRidingPrice(cityCode);
    },
    drawCreatePrice(dom){
      dom.setOption({

          tooltip: {
              trigger: 'axis'
          },
          // legend: {
          //   data:['总时长','免费骑行时长','付费骑行时长']
          // },
          dataZoom: [
              {
                  show: true,
                  realtime: true,
                  start: 0,
                  end: 100
              },
              {
                  type: 'inside',
                  realtime: true,
                  start: 0,
                  end: 100
              }
          ],
          xAxis: {
              type: 'category',
              data: this.createPrice.dataX,
              name:'金额（元）'
          },
          yAxis: {
            name:'人数(人)'
          },
          series: [
          {
              name: '',
              type: 'line',
              data: this.createPrice.data_1
          }
          ]
      });
      this.loading7 = false;
    },
    drawRidingPrice(cityCode){
      let param = {
        cityCode:cityCode
      }
      this.loading8 = true;
      getRidingPrice(param,(data) => {

        var userHabitX4 = [];
        for(let i=0;i<data.result.models.length;i++){
           userHabitX4.push(data.result.models[i].money);
        }
        var myChart = echarts.init(document.getElementById('userCharts8'));
        myChart.setOption({
          title: { text: '创造收益分布统计图' },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend:{
            orient: 'vertical',
            left: 'right',
            data: ['1次','2-7次','7-13次','13-20次','20-40次','>40次']
          },
          series: [{
            name: '骑行次数创造收益',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[
                {value:userHabitX4[0], name:'1次'},
                {value:userHabitX4[1], name:'2-7次'},
                {value:userHabitX4[2], name:'7-13次'},
                {value:userHabitX4[3], name:'13-20次'},
                {value:userHabitX4[4], name:'20-40次'},
                {value:userHabitX4[5], name:'>40次'},
            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
        });
        this.loading8 = false;
      });
    }
  },

  components: {
  },
  mounted(){
    this.initTab(this.cityCode);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss">

.charts{
  width:100%;
  height:500px;
}
.box{

}
.box-line{
  line-height:1.5;
  margin-bottom:15px;

}
.box-card{
    margin:15px;
    height:390px;
    p{
        line-height: 3;
        label{
            color: #5e6d82;
            margin-right:10px;
        }
    }
}
.el-tabs .el-tabs .el-tabs__nav{
  float:right;
}
h4{
  display: inline-block;
  margin-left: 5px;
  font-weight: 900;
  font-size: 20px;
}
@media screen and (max-width: 768px){
  .pannel{
    margin-top:20px;
  }
  .margin-20{
    margin-top:20px;
  }
}
</style>
