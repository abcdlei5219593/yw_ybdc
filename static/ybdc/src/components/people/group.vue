<template >
   <div class="">
     <el-row style='padding:15px;'>
       <el-col :span='6'>
         <el-breadcrumb separator="/" style="padding-top:12px;">
          <el-breadcrumb-item to="/people/ybdcDataAnalysis/city">城市统计</el-breadcrumb-item>
          <el-breadcrumb-item to="/people/ybdcDataAnalysis/group">团队统计</el-breadcrumb-item>

        </el-breadcrumb>
       </el-col>
       <!-- <el-col :span='6' push="12">
         <div>
           <span>排序:</span>
           <el-select  placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
         </div>
       </el-col> -->
     </el-row>
     <el-table
       :data="groupData"
       border
       align=“center”
       @row-click="clickTabRow"
       style="width: 100%"
       >
       <el-table-column
         label="小组"
         prop="teamName"
       >
       </el-table-column>
       <el-table-column
         prop="teamLeader"
         label="组长"
         >
       </el-table-column>
       <el-table-column
         prop="personCount"
         label="组员"
         >
       </el-table-column>
       <el-table-column
         prop="area"
         label="区域"
         >  </el-table-column>
       <el-table-column
         prop="avgtimeLeng"
         label="平均响应时长"
         >  </el-table-column>
       <el-table-column
         prop="avgScore"
         label="人均评分"
         >  </el-table-column>
         <el-table-column
           prop="faifailureStringlure"
           label="故障"
           >  </el-table-column>
         <el-table-column
           prop="failureString"
           label="投放"
           ></el-table-column>
         <el-table-column
           prop="recycleString"
           label="回放"
           >  </el-table-column>
         <el-table-column
           prop="inspectionString"
           label="巡检"
           >  </el-table-column>
       </el-table-column>
     </el-table>
   </div>
</template>
<script>
  import {queryTeamDetail} from '../../service/getData.js'

  export default {
    name:"group",
    data() {
      return {
        groupData:'',
        cityCode:'',

      }
    },
    mounted(){
      this.cityCode = this.$router.history.current.query.cityCode;
      queryTeamDetail({cityCode:this.cityCode}).then(res => {
        this.groupData = res.data;
      })
    },
    methods:{
      clickTabRow(row){
         let teamId = row.teamId;
         this.$router.push({path:'groupDetail',query:{'teamId':teamId,'cityCode':this.cityCode}})
      }
    }


  }
//   function getQueryString(name) {
//     var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
//      console.log(window.location)
//       var r = window.location.search.substr(1).match(reg);
//       if (r != null) {
//           return unescape(r[2]);
//       }
//       return null;
// }
</script>
