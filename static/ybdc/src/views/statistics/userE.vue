<template>
      <el-col class="home" :sm='22' :xs='24'>
        <el-tabs v-model="activeName" type="card" clearable="false" @tab-click="changeTab">
           <el-tab-pane label="单日用户" name="1">
             <div class="box" >
               <el-row :gutter="20" style="margin-top:15px;">
                 <el-col :sm='16' :xs='24'>
                    <div id="main15" class='user-charts' style="width: 100%;height:400px;margin-top:20px" v-loading='loading1'></div>
                 </el-col>
                 <el-col :sm='8' :xs='24'>
                   <div class="box">
                     <el-col :span="24" class="box-line">
                       <label >今日新增用户：</label>&nbsp;&nbsp; {{newAddUser.value}}人<label style="margin-left:15px">较昨日：{{newAddUser.rate | rateAbs}}</label><h4>{{newAddUser.rate | rateComputed}}</h4>
                     </el-col>
                     <el-col :span="24" class="box-line">
                       <label >今日交押金用户：</label>&nbsp;&nbsp;  {{newAddDepositUser.value}} 人<label style="margin-left:15px">较昨日：{{newAddDepositUser.rate | rateAbs}}</label><h4>{{newAddDepositUser.rate | rateComputed}}</h4>
                     </el-col>
                     <el-col :span="24" class="box-line">
                       <label >当前押金提现执行数：</label>&nbsp;&nbsp;  {{newDepositWithdrawalsUser.value}}元<label style="margin-left:15px" >较上周：{{newDepositWithdrawalsUser.rate | rateAbs}}</label><h4>{{newDepositWithdrawalsUser.rate | rateComputed}}</h4>
                     </el-col>
                   </div>

                 </el-col>
               </el-row>
               <el-row style="margin-top:45px;">

               </el-row>

             </div>
           </el-tab-pane>
           <el-tab-pane label="累计用户量" name="2">
             <div class="box" >
               <el-row :gutter="20" style="margin-top:15px;">
                 <el-col :sm='8' :xs='24' class="ms-box-line">
                   <label >当前累计注册用户数</label>&nbsp;&nbsp; {{registerUserCount.value}}人<label style="margin-left:15px">较昨日：{{registerUserCount.rate | rateAbs}}</label><h4>{{registerUserCount.rate | rateComputed}}</h4>
                 </el-col>
                 <el-col :sm='8' :xs='24'class="ms-box-line">
                   <label >当前累计押金用户数</label>&nbsp;&nbsp;  {{depositUserCount.value}} 人<label style="margin-left:15px">较昨日：{{depositUserCount.rate | rateAbs}}</label><h4>{{depositUserCount.rate | rateComputed}}</h4>
                 </el-col>
                 <el-col :sm='8' :xs='24' class="ms-box-line">
                   <label >当前累计押金金额</label>&nbsp;&nbsp;  {{depositAmountCount.value}}元<label style="margin-left:15px" >较上周：{{depositAmountCount.rate | rateAbs}}</label><h4>{{depositAmountCount.rate | rateComputed}}</h4>
                 </el-col>
               </el-row>
               <el-row :gutter="20" style="margin-top:45px;">
                 <el-col :sm='12' :xs='24'>
                  <div id="main5"  style="width: 100%;height:400px;margin-top:20px" v-loading='loading2' class="fl user-charts"></div>
                 </el-col>
                 <el-col :sm='12' :xs='24'>
                   <div id="main6" style="width: 100%;height:400px;margin-top:20px" v-loading='loading2' class="fl user-charts"></div>
                 </el-col>
               </el-row>

             </div>
           </el-tab-pane>
        </el-tabs>
      </el-col>
</template>

<script>
  import {userStatisticsNumber,userStatisticsQueryUserUsageHabits,userStatisticsQueryTNORADU,
    userStatisticsQueryUserFunds,userStatisticsQueryUserTrip,countUserDeposit,countDeposit,
    countUser,singleDayUser,cumulativeUserNumber,depositUserCharts} from '../../service/getData'

  var echarts = require('echarts');
export default {
  name: 'userE',
  data () {
    return {
      activeName:'1',
      msg: '',
      countUser:'',
      countDeposit:'',
      countUserDeposit:'',
      loading1:true,
      loading2:true,
      loading3:true,
      flag1:true,
      flag2:true,
      newAddUser:'',
      newAddDepositUser:'',
      newDepositWithdrawalsUser:'',
      depositAmountCount:{},
      depositUserCount:{},
      registerUserCount:{},
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
  components: {
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
  methods:{
    // 由于每个TAB下数据做了缓存。如更换城市后,则重新加载数据;
    changeCityFlag(){
      this.flag1 = true;
      this.flag2 = true;
    },
    initTab(cityCode){
      if(this.activeName == 1){
         this.showMenu_1(cityCode);
      }else if(this.activeName == 2 ){
        this.showMenu_2(cityCode)
      }
    },
    // 切换顶部TAB选项卡；
    changeTab(tab,event){
        this.activeName = tab.name;
        this.initTab(this.cityCode);

    },
    showMenu_1(cityCode){
      let param = {
        cityCode:cityCode
      }
      if(this.flag1 == true){
        this.flag1 = false;
        singleDayUser(param,response => {
          this.newAddUser = response.result.newAddUser;
          this.newAddDepositUser = response.data.result.newAddDepositUser;
          this.newDepositWithdrawalsUser = response.data.result.newDepositWithdrawalsUser;
        });

        this.drawUserStatistics(cityCode);
      }
    },
    showMenu_2(cityCode){
      let param = {
        cityCode:cityCode
      }
      if(this.flag2 == true){
        this.flag2 = false;
        cumulativeUserNumber(param,response => {
          this.depositAmountCount = response.result.depositAmountCount;
          this.depositUserCount = response.result.depositUserCount;
          this.registerUserCount = response.result.registerUserCount;
        });

        this.drawTnoRadu(cityCode);
        this.drawDepositUserCharts(cityCode);
      }
    },
    drawUserStatistics(cityCode){
      var dataParam = {
          filterDateType:'day',
          cityCode:cityCode
      }
      var userDayX=[],userDayY1=[],userDayY2=[],userDayY3=[],userDayY4=[];
      userStatisticsNumber(dataParam,(data)=>{
        for(let i=0;i<data.result.result.details.length;i++){
            userDayX.push(data.result.result.details[i].statisticsDate);
            userDayY1.push(data.result.result.details[i].numberOfNewUsers);
            userDayY2.push(data.result.result.details[i].numberOfRecharge);
            userDayY3.push(data.result.result.details[i].numberOfRechargeDeposit);
            userDayY4.push(data.result.result.details[i].creditUser);
        }
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main15'));
        // 绘制图表
        myChart.setOption({
            title: { text: '用户单日量统计图' },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
              right:0,
              padding:[0,20,0,0],
              orient:'vertical',
              data:['新增用户数','交押金记录','退押金记录','信用用户']
            },
            grid:{
              top:100
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
                data: userDayX,
                name:'时间(月)'
            },
            yAxis: {
            	name:'用户数(人)'
            },
            series: [
            {
                name: '新增用户数',
                type: 'line',
                data: userDayY1
            },
            {
                name: '交押金记录',
                type: 'line',
                data: userDayY2
            },
            {
                name: '退押金记录',
                type: 'line',
                data: userDayY3
            },
            {
                name: '信用用户',
                type: 'line',
                data: userDayY4
            }
            ]
        });
        this.loading1 = false;
    });
    },
    drawDepositUserCharts(cityCode){
      let param = {
        cityCode:cityCode
      }
      var userHabitX4=[],userHabitY4=[],userHabitY41=[];
      depositUserCharts(param,res=>{

        let deposit = res.result.depositUserCharts.depositUser.deposit;
        let deposit_sesame = res.result.depositUserCharts.depositUser.deposit_sesame;
        let register = res.result.depositUserCharts.depositUser.register;
        let sesame = res.result.depositUserCharts.depositUser.sesame;
        // 基于准备好的dom，初始化echarts实例
        var $depositUserCharts = echarts.init(document.getElementById('main6'));
        // 绘制图表
        $depositUserCharts.setOption({
          title: { text: '用户类型分布图' },
          tooltip: {
            trigger: 'item',
              formatter: "{a}<br />{b}： {d}%"
          },
          legend:{
            orient: 'vertical',
            left: 'right',
            data: ['押金用户','信用用户','押金信用用户','注册用户']
          },
          series: [{
            name: '用户类型',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[
                {value:deposit, name:'押金用户'},
                {value:sesame, name:'信用用户'},
                {value:deposit_sesame, name:'押金信用用户'},
                {value:register, name:'注册用户'},
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
        this.loading2 = false;
      });
    },
    drawTnoRadu(cityCode){

      var dataParam4 = {
            filterDateType:'day',
            cityCode:cityCode
      }
      var userHabitX4=[],userHabitY4=[],userHabitY41=[];
      userStatisticsQueryTNORADU(dataParam4,(data,status)=>{
        console.log(data);
        for(let i=0;i<data.result.result.details.length;i++){
            userHabitX4.push(data.result.result.details[i].statisticsDate);
            userHabitY4.push(data.result.result.details[i].numberOfRegisteredUsers);
            userHabitY41.push(data.result.result.details[i].numberOfHaveDepositUsers);
        }
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main5'));
        // 绘制图表
        myChart.setOption({
            title: { text: '用户存量统计图' },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                data: userHabitX4,
                name:'日期(天)'
            },
            legend: {
              data:['注册用户数','剩余押金用户数']
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
                name: '注册用户数',
                type: 'line',
                data: userHabitY4
            },
            {
                name: '剩余押金用户数',
                type: 'line',
                data: userHabitY41
            }
            ]
        });
        this.loading2 = false;
      });
    },
  },
  mounted(){
    this.initTab(this.cityCode);
    // let _this = this;
    // countUser('',function(data){
    //   console.log(data);
    //   _this.countUser = data.counts;
    // })
    // countDeposit('',function(data){
    //   console.log(data);
    //   _this.countDeposit = data.counts;
    // })
    // countUserDeposit('',function(data){
    //   console.log(data);
    //   _this.countUserDeposit = data.counts;
    // })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.home{
  padding: 15px;
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
h4{
  display: inline-block;
  margin-left: 5px;
  font-weight: 900;
  font-size: 20px;
}
.charts{
  width:100%;
  height:500px;
}
.box-line{
  line-height: 2
}


</style>
