<template>
  <div class="">

      <el-col class="home" :span='22'>
        <el-col :span='16'>
            <div id="userCharts1" style="width:100%;height:400px;margin-top:20px" v-loading='loading1'></div>
        </el-col>
         <el-col :span="8">
           <div class="box">

             <el-col :span="24" class="box-line">
               <label >已交押金总额：</label>&nbsp;&nbsp;  {{countData.handedDepositMoney}}元</label>
             </el-col>
             <el-col :span="24" class="box-line">
               <label >退押金总额：</label>&nbsp;&nbsp;  {{countData.quitDepositMoney}}元
             </el-col>
             <el-col :span="24" class="box-line">
               <label >剩余押金总额：</label>&nbsp;&nbsp;  {{countData.remainDepositMoney}}元
             </el-col>
           </div>
         </el-col>

      </el-col>

  </div>
</template>

<script>

  import {getPic} from '../../service/getData'

  var axios = require('axios');
  var echarts = require('echarts');

export default {
  name: 'life',
  data () {
    return {
      loading1:true,
    }
  },
  props:{
		"countData":{
			type:Object
    }
  },
  watch:{
			cityCode(code,code2){
				if(code2!=''){
					let cityCode = code;
					this.init(cityCode)
				}
			}
	},

	computed:{
		cityCode(){
			return this.$store.state.cityCode;
		}
	},
  methods:{
    init(cityCode){
        let param = {
          cityCode:cityCode,
          type:4
        }
        getPic(param,res => {
          let data = res.result.result;
          let dom = echarts.init(document.getElementById('userCharts1'));
          let [dataX,data_1,data_2,data_3] = [[],[],[],[]]
          for(let i=0;i<data.length;i++){
              dataX.push(data[i].date);
              data_1.push(data[i].col1);
              data_2.push(data[i].col2);
              data_3.push(data[i].col3);
          }
          dom.setOption({
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
                  name:'日期'
              },
              yAxis: {
                name:'次数(次)'
              },
              series: [
              {
                  name: '剩余押金总额',
                  type: 'line',
                  data: data_3
              },
              {
                  name: '退回押金总额',
                  type: 'line',
                  data: data_2
              },
              {
                  name: '已交押金总额',
                  type: 'line',
                  data: data_1
              }
              ]
          });
        })

    },



  },

  components: {

  },
  mounted(){
      let cityCode = this.cityCode
      this.init(cityCode)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss">
.home{
  padding: 20px;
}
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
</style>
