<template>
      <el-col class="home" :xs="24" :sm="22">
        <el-tabs v-model="activeName" type="card" clearable="false" @tab-click="changeTab">
           <el-tab-pane label="日趋势图" name="1">
             <div class="box cl" >
               <el-row :gutter="20" style="margin-top:15px;">
                 <el-col :xs="24" :sm="16">
                   <el-tabs v-model="activeName2" type="border-card" @tab-click="changeMiniTab">
                      <el-tab-pane label="骑行次数" name="1">
                          <div id="userCharts1" class='user-charts' style="height:400px;margin-top:20px" v-loading='loading1'></div>
                      </el-tab-pane>
                      <el-tab-pane label="骑行时长" name="2">
                          <div id="userCharts2" class='user-charts' style="height:400px;margin-top:20px" v-loading='loading2'></div>
                      </el-tab-pane>
                      <el-tab-pane label="创造金额" name="3">
                          <div id="userCharts3" class='user-charts' style="height:400px;margin-top:20px"v-loading='loading3'></div>
                      </el-tab-pane>

                    </el-tabs>

                 </el-col>
                 <el-col :xs="24" :sm="8">
                   <div class="box">
                     <el-col :span="24" class="box-line box-line-1st">
                       <label >今日付费骑行</label>&nbsp;&nbsp; {{todayPayRide.pay_count}}次<br /><label style="margin-left:100px">{{todayPayRide.pay_time}}分钟</label>
                     </el-col>
                     <el-col :span="24" class="box-line">
                       <label >今日免费骑行</label>&nbsp;&nbsp;  {{todayFreeRide.pay_count}} 次<br /><label style="margin-left:100px">{{todayFreeRide.pay_time}}分钟</label>
                     </el-col>
                     <el-col :span="24" class="box-line">
                       <label >今日创造金额</label>&nbsp;&nbsp;  {{todayCreateAmount.create_price}}元
                     </el-col>
                   </div>

                 </el-col>
               </el-row>


             </div>
           </el-tab-pane>
           <el-tab-pane label="用户行为" name="2">
             <div class="box cl" >
               <el-row  class="data-grid">
                   <div class="box">
                        <el-col :xs="24" :sm="8" class="ms-box-line">
                          <label >当日骑行人数：</label>&nbsp;&nbsp; {{rideNumberPeopleDay.value}}人<label style="margin-left:15px">较昨日：{{rideNumberPeopleDay.rate | rateAbs}}</label><h4>{{rideNumberPeopleDay.rate | rateComputed}}</h4>
                        </el-col>
                        <el-col :xs="24" :sm="8" class="ms-box-line">
                          <label >本周日均骑行人数：</label>&nbsp;&nbsp;  {{rideNumberPeopleWeek.value}} 人<label style="margin-left:15px">较上周：{{rideNumberPeopleWeek.rate | rateAbs}}</label><h4>{{rideNumberPeopleWeek.rate | rateComputed}}</h4>
                        </el-col>
                        <el-col :xs="24" :sm="8" class="box-line">
                          <label >累计日均骑行人数：</label>&nbsp;&nbsp;  {{cumulativeAveRideNumberPeople.value}}人
                        </el-col>
                        <el-col :xs="24" :sm="8" class="box-line">
                          <label >今日骑行用户数比例：</label>&nbsp;&nbsp; {{todayRideUserRate.value}}%
                        </el-col>
                        <el-col :xs="24" :sm="8" class="box-line">
                          <label >累计骑计用户比例：</label>&nbsp;&nbsp;  {{cumulativeRideUserRate.value}} %
                        </el-col>
                        <el-col :xs="24" :sm="8" class="box-line">
                          <label >累计骑行总时间：</label>&nbsp;&nbsp;  {{cumulativeRideTime.value}}分钟
                        </el-col>
                        <el-col :xs="24" :sm="8" class="box-line">
                          <label >累计人均骑行时间：</label>&nbsp;&nbsp;  {{cumulativeAvgRideTime.value}}分钟
                        </el-col>

                   </div>

               </el-row>
               <el-row :gutter="20" style="margin-top:15px;">
                   <el-col :xs="24" :sm="12">
                     <el-tabs v-model="activeName3" type="border-card" @tab-click="changeMiniTab_2">
                        <el-tab-pane label="骑行次数" name="4">
                            <div id="userCharts4" class='user-charts' style="width: 100%;height:400px;margin-top:20px" v-loading='loading4'></div>
                        </el-tab-pane>
                        <el-tab-pane label="骑行时长" name="5">
                            <div id="userCharts5" class='user-charts'  style="width: 100%;height:400px;margin-top:20px" v-loading='loading5'></div>
                        </el-tab-pane>
                        <el-tab-pane label="骑行频率" name="6">
                            <div id="userCharts6" class='user-charts' style="width: 100%;height:400px;margin-top:20px"v-loading='loading6'></div>
                        </el-tab-pane>
                        <el-tab-pane label="创造金额" name="7">
                            <div id="userCharts7" class='user-charts' style="width: 100%;height:400px;margin-top:20px"v-loading='loading7'></div>
                        </el-tab-pane>
                      </el-tabs>
                   </el-col>
                   <el-col :xs="24" :sm="12">
                     <div id="userCharts8" class='user-charts' style="width: 100%;height:400px;margin-top:20px" v-loading='loading8'></div>
                   </el-col>
               </el-row>

             </div>
           </el-tab-pane>
        </el-tabs>
      </el-col>
</template>

<script>
  import nvHeader from '../../components/header'
  import nvNav from '../../components/nav'
  import {getRidingPrice,userStatisticsQueryUserUsageHabits,getDailyTrendRideCountChart,getDailyTrendRideLongTimeChart,
    getDailyTrendCreateAmountChart,getTodayPayAndFreeAndAmount,getUserBehaviorData,getUserBehaviorCount,getUserBehaviorTime,
    getRideCountCharts,getCreateAmount} from '../../service/getData'
  var echarts = require('echarts');

export default {
  name: 'user',
  data () {
    return {
      msg: '',
      activeName:'1',
      activeName2:'1',
      'activeName3':'4',
      main:true,
      rideNumberPeopleWeek:'',
      todayRideUserRate:'',
      cumulativeAveRideNumberPeople:'',
      getUserBehaviorData:'',
      rideNumberPeopleDay:'',
      cumulativeRideUserRate :'',
      cumulativeRideTime:'',
      cumulativeAvgRideTime:'',
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
      cityChanged:true,
      dailyTrendRideCountChart:{
          dataX:[],
          data_1:[],
          data_2:[],
          data_3:[]
      },
      dailyTrendRideLongTimeChart:{
          dataX:[],
          data_1:[],
          data_2:[],
          data_3:[]
      },
      dailyTrendCreateAmountChart:{
        dataX:[],
        data_1:[]
      },
      userBehaviorCount:{
        dataX:[],
        data_1:[],
        data_2:[],
        data_3:[]
      },
      userBehaviorTime:{
        dataX:[],
        data_1:[],
        data_2:[],
        data_3:[]
      },
      userUsageHabits:{
        dataX:[],
        data_1:[],

      },
      createPrice:{
        dataX:[],
        data_1:[],

      },

    }
  },
  watch:{
      cityCode(code,code2){
        if(code2 != ''){
          let cityCode = code;
          this.changeCityFlag();
          this.initTab(cityCode);
        }
      }
  },
  computed:{
    cityCode(){
      return this.$store.state.cityCode;
    }
  },
  methods:{
    // 由于每个TAB下数据做了缓存。如更换城市后,则重新加载数据;
    changeCityFlag(){
      this.flag1 = true;
      this.flag2 = true;
      this.flag3 = true;
      this.flag4 = true;
      this.flag5 = true;
      this.flag6 = true;
      this.flag7 = true;
    },
    initTab(cityCode){
      if(this.activeName == 1){
         this.showMenu_1(cityCode);
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
      }else if(this.activeName2 == 3){
        this.showInnerMenu_3(cityCode)
      }
    },
    initMiniTab_2(cityCode){
      if(this.activeName3 == 4){

         this.showInnerMenu_4(cityCode);
      }else if(this.activeName3 == 5  ){
        this.showInnerMenu_5(cityCode)
      }else if(this.activeName3 == 6 ){
        this.showInnerMenu_6(cityCode)
      }else if(this.activeName3 == 7 ){
        this.showInnerMenu_7(cityCode)
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
        cityCode:cityCode
      }
       getTodayPayAndFreeAndAmount(param,res => {
          let todayData = res.result;
          this.todayPayRide = todayData.todayPayRide;
          this.todayFreeRide = todayData.todayFreeRide;
          this.todayCreateAmount = todayData.todayCreateAmount;
       })
    },
    showMenu_2(cityCode){
        let param = {
          cityCode:cityCode
        }
       getUserBehaviorData(param,res => {
         this.cumulativeAveRideNumberPeople = res.result.cumulativeAveRideNumberPeople;
         this.rideNumberPeopleWeek = res.result.rideNumberPeopleWeek;
         this.rideNumberPeopleDay = res.result.rideNumberPeopleDay;
         this.todayRideUserRate = res.result.todayRideUserRate;
         this.cumulativeRideUserRate = res.result.cumulativeRideUserRate;
         this.cumulativeRideTime = res.result.cumulativeRideTime;
         this.cumulativeAvgRideTime = res.result.cumulativeAvgRideTime;

       })
    },
    showInnerMenu_1(cityCode){
      let param = {
        cityCode:cityCode
      }
      if(this.flag1 == true){
        this.loading1 = true;
        this.flag1 = false;
        getDailyTrendRideCountChart(param,res => {
          this.dailyTrendRideCountChart.dataX = [];
          this.dailyTrendRideCountChart.data_1 = [];
          this.dailyTrendRideCountChart.data_2 = [];
          this.dailyTrendRideCountChart.data_3 = [];
          let data = res.result.dailyTrendRideCountChart;
          let dom = echarts.init(document.getElementById('userCharts1'));
          for(let i=0;i<data.length;i++){
              this.dailyTrendRideCountChart.dataX.push(data[i].date);
              this.dailyTrendRideCountChart.data_1.push(data[i].total/10000);
              this.dailyTrendRideCountChart.data_2.push(data[i].free/10000);
              this.dailyTrendRideCountChart.data_3.push(data[i].pay/10000);
          }
          this.drawDailyTrendideChart(dom)
        })
      }

    },
    drawDailyTrendideChart(dom){
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
          grid:{

            right:50
          },
          xAxis: {
              type: 'category',
              data: this.dailyTrendRideCountChart.dataX,
              name:'日期'
          },
          yAxis: {
            name:'次数(万次)'
          },
          series: [
          {
              name: '总次数',
              type: 'line',
              data: this.dailyTrendRideCountChart.data_1
          },
          {
              name: '免费骑行次数',
              type: 'line',
              data: this.dailyTrendRideCountChart.data_2
          },
          {
              name: '付费骑行次数',
              type: 'line',
              data: this.dailyTrendRideCountChart.data_3
          }
          ]
      });
      this.loading1 = false;
    },

    showInnerMenu_2(cityCode){
      let param = {
        cityCode:cityCode
      }
      if(this.flag2 == true){
        this.loading2 = true;
        this.flag2 = false;
        getDailyTrendRideLongTimeChart(param,res => {
          let dom = echarts.init(document.getElementById('userCharts2'));
          let data = res.result.dailyTrendRideLongTimeChart;
          this.dailyTrendRideCountChart.dataX = [];
          this.dailyTrendRideCountChart.data_1 = [];
          this.dailyTrendRideCountChart.data_2 = [];
          this.dailyTrendRideCountChart.data_3 = [];
          for(let i=0;i<data.length;i++){
              this.dailyTrendRideLongTimeChart.dataX.push(data[i].date);
              this.dailyTrendRideLongTimeChart.data_1.push(data[i].total/10000);
              this.dailyTrendRideLongTimeChart.data_2.push(data[i].free/10000);
              this.dailyTrendRideLongTimeChart.data_3.push(data[i].pay/10000);
          }
        this.drawDailyTrendRideLongTimeChart(dom)
        })
      }
    },
    drawDailyTrendRideLongTimeChart(dom){
      dom.setOption({

          tooltip: {
              trigger: 'axis'
          },
          legend: {
            data:['总时长','免费骑行时长','付费骑行时长']
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
          grid:{
            left:50,
            right:50
          },
          xAxis: {
              type: 'category',
              data: this.dailyTrendRideLongTimeChart.dataX,
              name:'日期'
          },
          yAxis: {
            name:'时长(万分钟)'
          },
          series: [
          {
              name: '总时长',
              type: 'line',
              data: this.dailyTrendRideLongTimeChart.data_1
          },
          {
              name: '免费骑行时长',
              type: 'line',
              data: this.dailyTrendRideLongTimeChart.data_2
          },
          {
              name: '付费骑行时长',
              type: 'line',
              data: this.dailyTrendRideLongTimeChart.data_3
          }
          ]
      });
      this.loading2 = false;
    },

    showInnerMenu_3(cityCode){
      let param = {
        cityCode:cityCode
      }
      let [dataX,data_1] = [[],[]];
      if(this.flag3 == true){
        this.loading3 = true;
        this.flag3 = false;
        getDailyTrendCreateAmountChart(param,res => {
          let dom = echarts.init(document.getElementById('userCharts3'));
          let data = res.result.dailyTrendCreateAmountChart;
          this.dailyTrendCreateAmountChart.data_1 = [];
          this.dailyTrendCreateAmountChart.dataX = [];
          for(let i=0;i<data.length;i++){
              this.dailyTrendCreateAmountChart.dataX.push(data[i].date);
              this.dailyTrendCreateAmountChart.data_1.push(data[i].create_price/10000);
          }
          this.drawDailyTrendCreateAmountChart(dom);
        })
      }
    },
    drawDailyTrendCreateAmountChart(dom){
      dom.setOption({

          tooltip: {
              trigger: 'axis'
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
          legend: {
            data:['创造金额']
          },
          grid:{

            right:50
          },
          xAxis: {
              type: 'category',
              data:   this.dailyTrendCreateAmountChart.dataX,
              name:'日期'
          },
          yAxis: {
            name:'金额(万元)'
          },
          series: [
          {
              name: '创造金额',
              type: 'line',
              data:  this.dailyTrendCreateAmountChart.data_1
          }
          ]
      });
      this.loading3 = false;
    },
    showInnerMenu_4(cityCode){
      let param = {
        cityCode:cityCode
      }
      if(this.flag4 == true){
        this.loading4 = true;

        this.flag4 = false;
        getUserBehaviorCount(param,res =>{
          let data = res.result.userBehaviorCount;
          for(let i=0;i<data.length;i++){
              this.userBehaviorCount.dataX.push(data[i].number);
              this.userBehaviorCount.data_1.push(data[i].total);
              this.userBehaviorCount.data_2.push(data[i].free_total);
              this.userBehaviorCount.data_3.push(data[i].pay_total);
          }
          let dom = echarts.init(document.getElementById('userCharts4'));
          this.drawUserBehaviorCount(dom)
        })
      }
      this.drawRideCountChart(cityCode);
    },
    drawUserBehaviorCount(dom){
      dom.setOption({

          tooltip: {
              trigger: 'axis',
              axisPointer: {
              type: 'cross'
              },
              formatter:"{a0}为{b0}次的人数:&nbsp{c0}人<br />{a1}为{b1}次的人数:&nbsp&nbsp{c1}人<br />{a2}为{b2}次的人数:&nbsp{c2}人<br />"
          },
          legend: {
            data:['总次数','免费骑行次数','付费骑行次数']
          },
          grid:{
            left:50,
            right:50
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
              data: this.userBehaviorCount.dataX,
              name:'次数'
          },
          yAxis: {
            name:'人数(人)'
          },
          series: [
          {
              name: '总次数',
              type: 'line',
              data: this.userBehaviorCount.data_1,

          },
          {
              name: '免费骑行次数',
              type: 'line',
              data: this.userBehaviorCount.data_2
          },
          {
              name: '付费骑行次数',
              type: 'line',
              data: this.userBehaviorCount.data_3
          }
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
              data: ['0~15分钟','15~30分钟','30~60分钟','60~90分钟','90~120分钟','120~360分钟','360分钟以上']
            },
            series: [{
              name: '骑行次数分布',
              type: 'pie',
              radius : '55%',
              center: ['50%', '60%'],
              data:[
                  {value:data['0_15'], name:'0~15分钟'},
                  {value:data['15_30'], name:'15~30分钟'},
                  {value:data['30_60'], name:'30~60分钟'},
                  {value:data['60_90'], name:'60~90分钟'},
                  {value:data['90_120'], name:'90~120分钟'},
                  {value:data['120_360'], name:'120~360分钟'},
                  {value:data['360_'], name:'360分钟以上'},
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
        this.loading5 = true;

        this.flag5 = false;
        getUserBehaviorTime(param,res =>{
          let data = res.result.userBehaviorTime;
          for(let i=0;i<data.length;i++){
              this.userBehaviorTime.dataX.push(data[i].longtime);
              this.userBehaviorTime.data_1.push(data[i].total);
              this.userBehaviorTime.data_2.push(data[i].free_total);
              this.userBehaviorTime.data_3.push(data[i].pay_total);
          }
          let dom = echarts.init(document.getElementById('userCharts5'));
          this.drawUserBehaviorTime(dom)
        })
      }
      this.drawRideCountChart(cityCode);
    },
    drawUserBehaviorTime(dom){
      dom.setOption({
        tooltip: {
            trigger: 'axis',
            axisPointer: {
            type: 'cross'
            },
            formatter:"{a0}为{b0}分钟的人数:&nbsp{c0}人<br />{a1}为{b1}分钟的人数:&nbsp&nbsp{c1}人<br />{a2}为{b2}分钟的人数:&nbsp{c2}人<br />"
        },
          legend: {
            data:['总时长','免费骑行时长','付费骑行时长']
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
              data:   this.userBehaviorTime.dataX,
              name:'骑行时长（分钟）'
          },
          yAxis: {
            name:'人数(人)'
          },
          series: [
          {
              name: '总时长',
              type: 'line',
              data: this.userBehaviorTime.data_1
          },
          {
              name: '免费骑行时长',
              type: 'line',
              data:  this.userBehaviorTime.data_2
          },
          {
              name: '付费骑行时长',
              type: 'line',
              data:   this.userBehaviorTime.data_3
          }
          ]
      });
      this.loading5 = false;
    },
    showInnerMenu_6(cityCode){
      var dataParam2 = {
            filterType:'Frequency',
            cityCode:cityCode
      }
     if(this.flag6 == true){
       this.loading6 = true;

       this.flag6 = false;
       userStatisticsQueryUserUsageHabits(dataParam2,data => {
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
            trigger: 'axis',
            axisPointer: {
            type: 'cross'
            },
            formatter:"{a0}为{b0}%的人数:&nbsp{c0}人"
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
              name: '骑行频率',
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
        this.loading7 = true;

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
              name: '人数',
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
  filters :{
    rateAbs(value){
      return Math.abs(value)+"%";
    },
    rateComputed(value){
      if(value > 0){
        return " ↑"
      }else if (value == 0){
        return " --";
      }else{
        return " ↓";
      }
    }
  },
  components: {
  },
  mounted(){
    this.initTab(this.cityCode);

  // this.userStatisticsQueryUserUsageHabits('AccumulativeFrequency');
  // var dataParam2 = {
  //       filterType:'Frequency'
  // }
  // var userHabitX2=[],userHabitY2=[];
  // userStatisticsQueryUserUsageHabits(dataParam2,function(data){
  //   console.log(data);
  //   for(let i=0;i<data.result.result.frequencies.length;i++){
  //       userHabitX2.push(data.result.result.frequencies[i].dayDividedTimes);
  //       userHabitY2.push(data.result.result.frequencies[i].numberOfRidingUsers);
  //   }
  //   // 基于准备好的dom，初始化echarts实例
  //   var myChart = echarts.init(document.getElementById('main34'));
  //   // 绘制图表
  //   myChart.setOption({
  //       title: { text: '用户骑行频率统计图' },
  //       tooltip: {
  //           trigger: 'axis'
  //       },
  //       xAxis: {
  //           type: 'category',
  //           data: userHabitX2,
  //           name:'频率'
  //       },
  //       dataZoom: [
  //           {
  //               show: true,
  //               realtime: true,
  //               start: 0,
  //               end: 100
  //           },
  //           {
  //               type: 'inside',
  //               realtime: true,
  //               start: 0,
  //               end: 100
  //           }
  //       ],
  //       yAxis: {
	// 		     name:'人数(人)'
  //       },
  //       series: [
  //       {
  //           name: '人数',
  //           type: 'line',
  //           data: userHabitY2
  //       }
  //       ]
  //   });
  //   _this.loading2 = false;
  // });
  //
  // var userHabitX4=[];
  // getRidingPrice('',function(data){
  //   console.log(data);
  //   for(let i=0;i<data.result.models.length;i++){
  //      userHabitX4.push(data.result.models[i].money);
  //   }
  //   var myChart = echarts.init(document.getElementById('main14'));
  //   myChart.setOption({
  //     title: { text: '创造收益分布统计图' },
  //     tooltip: {
  //       trigger: 'item',
  //       formatter: "{a} <br/>{b} : {c} ({d}%)"
  //     },
  //     legend:{
  //       orient: 'vertical',
  //       left: 'right',
  //       data: ['1次','2-7次','7-13次','13-20次','20-40次','>40次']
  //     },
  //     series: [{
  //       name: '骑行次数创造收益',
  //       type: 'pie',
  //       radius : '55%',
  //       center: ['50%', '60%'],
  //       data:[
  //           {value:userHabitX4[0], name:'1次'},
  //           {value:userHabitX4[1], name:'2-7次'},
  //           {value:userHabitX4[2], name:'7-13次'},
  //           {value:userHabitX4[3], name:'13-20次'},
  //           {value:userHabitX4[4], name:'20-40次'},
  //           {value:userHabitX4[5], name:'>40次'},
  //       ],
  //       itemStyle: {
  //           emphasis: {
  //               shadowBlur: 10,
  //               shadowOffsetX: 0,
  //               shadowColor: 'rgba(0, 0, 0, 0.5)'
  //           }
  //       }
  //   }]
  //   });
  //   _this.loading3 = false;
  // });
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
.data-grid{
  margin-top:15px;
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
  .box-line-1st{
    margin-top:15px;
  }
  .data-grid{
    margin-top:0;
  }
  .box-line{
    margin-left:15px;
  }
  .ms-box-line{
    margin-left:15px;
    line-height: 1.5;
    margin-bottom: 15px;
  }
}

</style>
