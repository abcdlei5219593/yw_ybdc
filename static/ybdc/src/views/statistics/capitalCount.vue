<template>
      <el-col class="home" :sm='22' :xs='24' >
        <!-- <div id="main1" style="width: 50%;height:400px;margin-top:20px" class="fl"></div> -->
        <el-tabs v-model="activeName" type="card" @tab-click="changeTab">
         <el-tab-pane label="累计押金量" name="1">
           <div class="box" >
             <el-row :gutter="20" style="margin-top:15px;">
               <el-col :sm='8' :xs='24' class="">
                 <label >今日预存押金：</label>&nbsp;&nbsp; {{preDepositValue}}元<label style="margin-left:15px">较昨日：{{preDepositRate | rateAbs}}</label><h4>{{preDepositRate | rateComputed}}</h4>
               </el-col>
               <el-col :sm='8' :xs='24' class="">
                 <label >今日提现金额：</label>&nbsp;&nbsp;  {{withdrawalsAmountValue}} 元<label style="margin-left:15px">较昨日：{{withdrawalsAmountRate | rateAbs}}</label><h4>{{withdrawalsAmountRate | rateComputed}}</h4>
               </el-col>
               <el-col :sm='8' :xs='24' class="">
                 <label >当前累计押金金额：</label>&nbsp;&nbsp;  {{currentAmountValue}}元<label style="margin-left:15px" >较上周：{{currentAmountRate | rateAbs}}</label><h4>{{currentAmountRate | rateComputed}}</h4>
               </el-col>
             </el-row>
             <el-row style="margin-top:45px;">
               <el-col :sm='16' :xs='24'>
                  <div class="" id='depositChangeCharts' class='user-charts' v-loading="loading1"></div>
               </el-col>
             </el-row>

           </div>
         </el-tab-pane>
         <el-tab-pane label="累计预存" name="2">
           <div class="box" >
             <el-row  style="margin-top:15px;">
               <el-col :sm='16' :xs='24'>
                  <div  id='preDepositChangeCharts' class='user-charts' v-loading="loading2"></div>
               </el-col>
               <el-col :sm='8' :xs='24'>
                 <div class="box">
                   <el-col :span="24" class="box-line">
                     <label >今日预存车费：</label>&nbsp;&nbsp; {{preDepositFareValue}}元<label style="margin-left:15px">较昨日：{{preDepositFareRate | rateAbs}}</label><h4>{{preDepositFareRate | rateComputed}}</h4>
                   </el-col>
                   <el-col :span="24" class="box-line">
                     <label >今日消费金额：</label>&nbsp;&nbsp;  {{resumeAmounValue}} 元<label style="margin-left:15px">较昨日：{{resumeAmounRate | rateAbs}}</label><h4>{{resumeAmounRate | rateComputed}}</h4>
                   </el-col>
                   <el-col :span="24" class="box-line">
                     <label >当前累计预存金额：</label>&nbsp;&nbsp;  {{cumulativePreDepositValue}}元<label style="margin-left:15px" >较上周：{{cumulativePreDepositRate | rateAbs}}</label><h4>{{cumulativePreDepositRate | rateComputed}}</h4>
                   </el-col>
                 </div>

               </el-col>
             </el-row>

           </div>
         </el-tab-pane>
         <el-tab-pane label="累计赠送" name="3">
           <div class="box" >
             <el-row :gutter="20" style="margin-top:15px;">
               <el-col :sm='16' :xs='24'>
                  <div  id='giveChangeCharts' class='user-charts' v-loading="loading3"></div>
               </el-col>
               <el-col :sm='8' :xs='24'>
                 <div class="box">
                   <table style = width:100%;margin-top:25px;  cellspacing="0" cellpadding="0">
                     <tr>
                       <td colspan='4'>
                         <el-col :span="24" class="box-line">
                           <label >今日赠送：</label>&nbsp;&nbsp; {{todayGiveValue}}元<label style="margin-left:15px">较昨日：{{todayGiveRate | rateAbs}}</label><h4>{{todayGiveRate | rateComputed}}</h4>
                         </el-col>
                       </td>
                     </tr>
                     <tr>
                        <td>充值赠送（元）<br />{{rechargeGive.value}}</td>
                        <td>活动赠送（元）<br />{{activityGive.value}}</td>
                        <td>其他赠送（元）<br />{{otherGive.value}}</td>
                        <td>消帐金额（元）<br />{{writeOffGive.value}}</td>
                     </tr>
                     <td colspan='4'>
                       <el-col :span="24" class="box-line">
                         <label >今日赠送消费：</label>&nbsp;&nbsp;{{resumeGiveValue}}  元<label style="margin-left:15px">较昨日：{{resumeGiveRate | rateAbs}}</label><h4>{{resumeGiveRate | rateComputed}}</h4>
                       </el-col>
                     </td>
                   </table>
                   <table style = width:100%;margin-top:50px;  cellspacing="0" cellpadding="0">
                     <tr>
                       <td colspan='4'>
                         <el-col :span="24" class="box-line">
                           <label >累计赠送：</label>&nbsp;&nbsp; {{cumulGiveValue}}元<label style="margin-left:15px">较昨日：{{cumulGiveRate | rateAbs}}</label><h4>{{cumulGiveRate | rateComputed}}</h4>
                         </el-col>
                       </td>
                     </tr>
                     <tr>
                        <td>充值赠送（元）<br />{{cumulRechargeGive}}</td>
                        <td>活动赠送（元）<br />{{cumulActivityGive}}</td>
                        <td>其他赠送（元）<br />{{cumulOtherGive}}</td>
                        <td>消帐金额（元）<br />{{cumulWriteOffGive}}</td>
                     </tr>
                     <td colspan='4'>
                       <el-col :span="24" class="box-line">
                         <label >累计赠送消费：</label>&nbsp;&nbsp; {{cumulativeResumeGiveValue}}  元<label style="margin-left:15px">较昨日：{{cumulativeResumeGiveRate | rateAbs}}</label><h4>{{cumulativeResumeGiveRate | rateComputed}}</h4>
                       </el-col>
                     </td>
                   </table>
                 </div>

               </el-col>
             </el-row>

           </div>
         </el-tab-pane>
       </el-tabs>

      </el-col>
</template>

<script>
  import {getDepositChangeCharts,getPreDeposit,getWithdrawalsAmount,getCurrentCumulativeDepositAmount,
  getPreDepositChangeCharts,getPreDepositFare,getTodayGive,getCumulativeGive,getGiveChangeCharts,
  getResumeAmount,getCumulativePreDeposit} from '../../service/getData'
  var axios = require('axios');
  var $ = require("jquery");
  var echarts = require('echarts');
export default {
  name: 'user',
  data () {
    return {

      activeName:'1',
      preDepositValue:'',
      preDepositRate:'',
      withdrawalsAmountValue:'',
      withdrawalsAmountRate:'',
      currentAmountValue:'',
      currentAmountRate:'',

      preDepositFareValue:'',
      preDepositFareRate:'',
      resumeAmounValue:'',
      resumeAmounRate:'',
      cumulativePreDepositValue:'',
      cumulativePreDepositRate:'',

      activityGive:{},
      otherGive :{},
      rechargeGive:{},
      writeOffGive:{},
      todayGiveValue:'',
      todayGiveRate:'',
      resumeGiveValue:'',
      resumeGiveRate:'',

      cumulActivityGive:'',
      cumulOtherGive :'',
      cumulRechargeGive :'',
      cumulWriteOffGive:'',
      cumulGiveValue :'',
      cumulGiveRate:'',
      cumulativeResumeGiveValue :'',
      cumulativeResumeGiveRate:'',

      loading1:true,
      loading2:true,
      loading3:true,
    }
  },
  mounted(){
    this.initTab(this.cityCode);

  },
  watch:{
      cityCode(code,code2){
        if(code2!=''){
          let cityCode = code;
          this.initTab(cityCode)
        }
      }
  },

  computed:{
    cityCode(){
      return this.$store.state.cityCode;
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
  methods:{

    initTab(cityCode){
      if(this.activeName == 1){
         this.showMenu_1(cityCode);
      }else if(this.activeName == 2){
        this.showMenu_2(cityCode)
      }else if(this.activeName == 3){
        this.showMenu_3(cityCode)
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
      //let [chartsDom,text,legendX,legendY,legendZ] = [echarts.init(document.getElementById('depositChangeCharts')),'押金变化统计图','剩余押金总额','退回押金总额','已交押金总额'];
      getPreDeposit(param,response => {
        this.preDepositValue = response.result.preDeposit.value;
        this.preDepositRate = response.result.preDeposit.rate;
      });
      getWithdrawalsAmount(param,response => {
        this.withdrawalsAmountValue = response.result.withdrawalsAmount.value;
        this.withdrawalsAmountRate = response.result.withdrawalsAmount.rate;
      });
      getCurrentCumulativeDepositAmount(param,response => {
        this.currentAmountValue = response.result.currentCumulativeDepositAmount.value;
        this.currentAmountRate = response.result.currentCumulativeDepositAmount.rate;
      });
      this.depositChangeCharts(cityCode);
    },
    showMenu_2(cityCode){
      let param = {
        cityCode:cityCode
      }
      //  let [chartsDom,text,legendX,legendY,legendZ] = [echarts.init(document.getElementById('PreDepositChangeCharts')),'押金变化统计图','剩余押金总额','退回押金总额','已交押金总额'];
      getPreDepositFare(param,response=> {
        this.preDepositFareValue = response.result.preDepositFare.value;
        this.preDepositFareRate = response.result.preDepositFare.rate;
      });
      getResumeAmount(param,response => {
        this.resumeAmounValue = response.result.resumeAmount.value;
        this.ResumeAmounRate = response.result.resumeAmount.rate;
      });
      getCumulativePreDeposit(param,response => {
        this.cumulativePreDepositValue = response.result.cumulativePreDeposit.value;
        this.cumulativePreDepositRate = response.result.cumulativePreDeposit.rate;
      });
      this.preDepositChangeCharts(cityCode);
    },
    showMenu_3(cityCode){
      let param = {
        cityCode:cityCode
      }
      //  let [chartsDom,text,legendX,legendY,legendZ] = [echarts.init(document.getElementById('PreDepositChangeCharts')),'押金变化统计图','剩余押金总额','退回押金总额','已交押金总额'];
      getTodayGive(param,response => {
        this.activityGive = response.result.todayGive.activityGive1;
        this.otherGive = response.result.todayGive.otherGive1;
        this.rechargeGive = response.result.todayGive.rechargeGive1;
        this.writeOffGive = response.result.todayGive.writeOffGive1;
        this.todayGiveValue = response.result.todayGive.todayGive1.value;
        this.todayGiveRate = response.result.todayGive.todayGive1.rate;
        this.resumeGiveValue = response.result.todayGive.resumeGive1.value;
        this.resumeGiveRate = response.result.todayGive.resumeGive1.rate;
      });
       getCumulativeGive(param,response => {
         this.cumulActivityGive = response.result.cumulativeGive.cumulativeActivityGive.value;
         this.cumulOtherGive = response.result.cumulativeGive.cumulativeOtherGive.value;
         this.cumulRechargeGive = response.result.cumulativeGive.cumulativeRechargeGive.value;
         this.cumulWriteOffGive = response.result.cumulativeGive.cumulativeWriteOffGive.value;
         this.cumulGiveValue = response.result.cumulativeGive.cumulativeGive.value;
         this.cumulGiveRate = response.result.cumulativeGive.cumulativeGive.rate;
         this.cumulativeResumeGiveValue = response.result.cumulativeGive.cumulativeResumeGive.value;
         this.cumulativeResumeGiveRate = response.result.cumulativeGive.cumulativeResumeGive.rate;
      });

      this.giveChangeCharts(cityCode);
    },
    giveChangeCharts(cityCode){
      let param = {
        cityCode:cityCode
      }
      getGiveChangeCharts(param,response =>{
        let [responseData,dataX,data_1,data_2] = [response.result,[],[],[]];
        for(let i in responseData.giveCharts){
          dataX.push(responseData.giveCharts[i].date);
          data_1.push(responseData.giveCharts[i].value);
        }
        for(let j in responseData.resumeGiveAmountCharts ){
            data_2.push(responseData.resumeGiveAmountCharts[j].value);
        }
        this.drawGiveChangeCharts(dataX,data_1,data_2)
      })

    },
    drawGiveChangeCharts(dataX,data_1,data_2){
      var $giveChangeCharts = echarts.init(document.getElementById('giveChangeCharts'));
   // 绘制图表
      $giveChangeCharts.setOption({
       title: { text: '赠送变化统计图' },
       tooltip: {
           trigger: 'axis'
       },
       legend: {
         data:['赠送金额','赠送消费金额']
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
           data: dataX,
           name:'日期(天)'
       },
       yAxis: {
         name:'金额(元)'
       },
       series: [
       {
           name: '赠送金额',
           type: 'line',
           data: data_1
       },
       {
           name: '赠送消费金额',
           type: 'line',
           data: data_2
       }
      ]
   });
   this.loading3 = false;
    },
    depositChangeCharts(cityCode){
      let param = {
          cityCode : cityCode
      }
      getDepositChangeCharts(param,response =>{
        let [responseData,dataX,dataZoom_1,dataZoom_2,dataZoom_3] = [response.result.depositChangeCharts,[],[],[],[]];
        for(let i in responseData){
          dataX.push(responseData[i].date);
          dataZoom_1.push(responseData[i].surplus_deposit);
          dataZoom_2.push(responseData[i].back_deposit);
          dataZoom_3.push(responseData[i].recharge_deposit);
        }
        this.drawDepositChangeCharts(dataX,dataZoom_1,dataZoom_2,dataZoom_3)
      })

    },
    drawDepositChangeCharts(dataX,dataZoom_1,dataZoom_2,dataZoom_3){
         var $drawDepositChangeCharts = echarts.init(document.getElementById('depositChangeCharts'));
      // 绘制图表
         $drawDepositChangeCharts.setOption({
          title: { text: '押金变化统计图' },
          tooltip: {
              trigger: 'axis'
          },
          legend: {
            data:['剩余押金总额','退回押金总额','已交押金总额']
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
              data: dataX,
              name:'日期(天)'
          },
          yAxis: {
          	name:'金额(元)'
          },
          series: [
          {
              name: '剩余押金总额',
              type: 'line',
              data: dataZoom_1
          },
          {
              name: '退回押金总额',
              type: 'line',
              data: dataZoom_2
          },
          {
              name: '已交押金总额',
              type: 'line',
              data: dataZoom_3
          }
          ]
      });
      this.loading1 = false;
    },
    preDepositChangeCharts(cityCode){
      let param_1 = {
        cityCode:cityCode,
        batch:1,
        type:10
      }
      let param_2 = {
        cityCode:cityCode,
        batch:2,
        type:10
      }
      getPreDepositChangeCharts(param_1,param_2,(acct, perms) => {
          let [pre_deposit,consum,dataX,dataZoom_1,dataZoom_2] = [acct.data.result.result,perms.data.result.result,[],[],[]];
          let bikeDataTwo = acct.data.result.result;
          let bikeDataThree =  perms.data.result.result;
          for(let i in pre_deposit){
            dataX.push(pre_deposit[i].specificDate);
            dataZoom_1.push(pre_deposit[i].rate);
          }
          for(let j in consum){
            dataZoom_2.push(consum[j].rate);
          }
          this.drawPreDepositChangeCharts(dataX,dataZoom_1,dataZoom_2)
      });
    },
    drawPreDepositChangeCharts(dataX,dataZoom_1,dataZoom_2){
      var $drawDepositChangeCharts = echarts.init(document.getElementById('preDepositChangeCharts'));
   // 绘制图表
      $drawDepositChangeCharts.setOption({
       title: { text: '预存变统计图' },
       tooltip: {
           trigger: 'axis'
       },
       legend: {
         data:['预存金额','消耗金额']
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
           data: dataX,
           name:'日期(天)'
       },
       yAxis: {
         name:'金额(元)'
       },
       series: [
       {
           name: '预存金额',
           type: 'line',
           data: dataZoom_1
       },
       {
           name: '消耗金额',
           type: 'line',
           data: dataZoom_2
       }
       ]
      });
      this.loading2 = false;
    }
  },
  components: {
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
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
</style>
