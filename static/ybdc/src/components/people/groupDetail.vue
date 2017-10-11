<template >
   <div class="">
     <el-row style='padding:15px;'>
       <el-col :span='6'>
         <el-breadcrumb separator="/" style="padding-top:12px;">
          <el-breadcrumb-item to="/people/ybdcDataAnalysis/city">城市统计</el-breadcrumb-item>
          <el-breadcrumb-item :to="{path:'group',query:{teamId:teamId,cityCode:cityCode}}">团队统计</el-breadcrumb-item>
          <el-breadcrumb-item to="/people/ybdcDataAnalysis/groupDetail">人员统计</el-breadcrumb-item>
        </el-breadcrumb>
       </el-col>
       <el-col :span='18'>
         <span class="fr">时间选择:
          <el-date-picker v-model="timeMission" type="date" size="small" placeholder="选择日期" @change="timeChoose"></el-date-picker>
          </span>
       </el-col>
     </el-row>
     <el-row :gutter="15" >
       <el-col :span="5">
         <el-table
           :data="workerData"
           border
           style="width: 100%"
           highlight-current-row
           @current-change='selectWorker'
           >
           <el-table-column
             align='center'
             header-align='center'
             label="人员"
             prop="username"
           ></el-table-column>
         </el-table>
       </el-col>
       <el-col :span="19" style="padding:15px;border:1px solid #d3d3d3">
          <el-row>
            <el-col :span="24">
                <h1 style="margin-bottom:15px;">工作量一览表</h1>
                <el-table
                 empty-text="没有数据！（选择左侧人员列表）"
                  :data="teamData"
                  border
                  style="width: 100%"
                  >
                  <el-table-column
                    label="日期"
                    prop="time"
                    align=‘center’
                  >
                  </el-table-column>
                  <el-table-column
                    prop="code"
                    label="故障"
                    align=‘center’
                    >
                    <el-table-column
                      prop="failure"
                      label=""
                      >
                    </el-table-column>
                    <el-table-column
                      prop="failurebicycle"
                      label=""
                      >  </el-table-column>
                  </el-table-column>

                  <el-table-column
                    prop="code"
                    label="投放"
                    align=‘center’
                    >
                    <el-table-column
                      prop="put"
                      label=""
                      >
                    </el-table-column>
                    <el-table-column
                      prop="putbicycle"
                      label=""
                      >  </el-table-column>
                  </el-table-column>
                  <el-table-column
                    prop="code"
                    label="回收"
                    align=‘center’
                    >
                    <el-table-column
                      prop="recycle"
                      label=""
                      >
                    </el-table-column>
                    <el-table-column
                      prop="recyclebicycle"
                      label=""
                      >  </el-table-column>
                  </el-table-column>

                    <el-table-column
                      prop="inspection"
                      label="巡检"
                      >  </el-table-column>
                  </el-table-column>
                </el-table>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">

            </el-col>
          </el-row>
       </el-col>
     </el-row>
   </div>
</template>
<script>
  import {queryTeamTask,queryTeamUser} from '../../service/getData.js'
  export default {
    name:"groupDetail",
    data() {
      return {
        teamId:'',
        workerData:[],
        teamData:[],
        cityCode:'',
        timeMission:'',
        userId:''
      }
    },
    activated (){
        this.cityCode = this.$router.history.current.query.cityCode;
        this.teamId = this.$router.history.current.query.teamId;
        queryTeamUser({teamId:this.teamId}).then(res =>{
          this.workerData = res;
        })
      //  this.queryTeamTaskReq();
    },
    methods:{
      selectWorker(row){
          this.queryTeamTaskReq(row.userId);
          this.userId = row.userId
      },
      queryTeamTaskReq(userId){
        let param = {
          teamId:this.teamId,
          userId:userId,
          date:this.timeMission
        }
        queryTeamTask(param,res => {
          this.teamData = res;
        })
      },
      timeChoose(i){
          this.timeMission = i
          console.log(this.timeMission)
          this.queryTeamTaskReq(this.userId)
      }
    }
  }
</script>
<style scoped lang='scss'>
/*.text{
  line-height: 2
}*/
.el-select .el-input__inner {
    border:none;
}
.el-select .el-input .el-input__inner{
    border: none;
    background: red
  }
.table{
  border: 1px solid #dfe6ec;
  text-align: center;
  div{
    height: 40px;
    line-height: 40px;
  }
  .table-header{
    font-weight: bold;
    .table-header-column{
      float: left;
      width: 50%;
      height: 100%;

      }
    }
    .table-column{
      border-bottom: 1px solid #dfe6ec;
      .table-grid{
        color: #5e7382;
        float: left;
        width: 33.3%;

      }
    }
  }

</style>
