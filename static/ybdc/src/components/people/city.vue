<template >
   <div class="">
     <el-row :gutter="15" v-loading='loadingAll' style="min-height:760px;">
       <el-col :span="8" v-for="(item,index) in cityData">
         <el-card class="box-card"  >
           <div slot="header" class="clearfix" >
             <span style="line-height: 36px;">{{item.cityName}}</span>
             <el-button @click="queryData(item.cityCode,index)"    class='fr' style='margin-left:10px' type="primary">查询</el-button>
             <el-date-picker
               class='fr'
               v-model="selectedMonth[index].date"
               type="month"
               @change = "selectMonth"
               placeholder="选择月">
             </el-date-picker>
           </div>
          <div v-loading="loadingTab[index].loading">
            <div class="text item">
              车辆使用率：{{item.bicycleUsage}}%
            </div>
            <div class="text item">
              单车使用频次：{{item.bicycleFrequency}}
            </div>
            <div class="text item">
              新注册用户增长率：{{item.registerUserRiseRate}}

            </div>
            <div class="text item">
              押金用户增长率：{{item.depositUserRiseRate}}

            </div>
            <div class="text item">
              活跃用户增长率：{{item.activeUserRiseRate}}

            </div>
            <div class="text item" style="text-align:right;">
              <el-button  type="text" @click="showGroup(item.cityCode)" :disabled="buttonAuth(item.cityCode)">查看详情</el-button>
            </div>
          </div>
         </el-card>
       </el-col>

     </el-row>
   </div>
</template>
<script>
  import store from '../../vuex/store.js'
  import {getCity} from '../../service/getData.js'
  export default {
    name:"city",
    data() {
      return {
        selectedMonth:[],
        monthModel:'',
        cityData:'',
        userCityCode:'',
        loadingAll:true,
        localDate:'',
        loadingTab:[]
      }
    },
    computed:{

    },
    activated(){
      this.localDate = this.getLocalDate();
      this.userCityCode = store.state.loginUser.userCities[0].code;
      let dataStr = {
        dataStr : this.localDate+'-1'
      }
      getCity(dataStr,res => {
        let resData = res.result.result;
        for(let i = 0 ; i<resData.length;i++){
          this.loadingTab.push({loading:false});
          this.selectedMonth.push({date:this.localDate});
        }
        this.cityData = resData;
        this.loadingAll = false;
      })
    },
    // filters :{
    //     setMouthValue(value,index){
    //       return value+index;
    //     }
    // },
    methods:{
      getLocalDate(){
        let d = new Date();
        return d.getFullYear()+"-"+(d.getMonth()+1);
      },
      buttonAuth(cityCode){
         if(cityCode == this.userCityCode){
           return false;
         }else{
           return true;
         }
      },
      showGroup(cityCode){
          this.$router.push({ path: 'group', query:{ 'cityCode': cityCode }})
      },
      selectMonth(date){
          this.localDate = date ;
      },
      queryData(cityCode,index){
        this.loadingTab[index].loading = true;
        let param = this.localDate+'-1';
        let dataStr = {
          dataStr : param,
          cityCode:cityCode
        }
        getCity(dataStr,res => {
          this.cityData[index] = res.result.result[0];
            this.loadingTab[index].loading = false;
        })
      }
    }
  }
</script>
<style scoped lang='scss'>
.box-card{
  height: auto;
}
.text{
  line-height: 2
}
</style>
