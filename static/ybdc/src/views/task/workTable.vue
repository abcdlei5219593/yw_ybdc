<template>
      <el-col class="home" :span='22'>
      <div class="workManage-container">
                <div class="title">
                    <span>工作安排表</span>
                    <span class="fr">人员：<input class="custom-input" v-model="workPeople" />&nbsp;<i class="el-icon-search font cursor-pointer" @click="workSearch"></i></span>
                </div>
                <span class="fl line-height-42">日期：</span>
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane :label="item" v-for="item in workManageDate"></el-tab-pane>
                </el-tabs>
                <div style="overflow-y:auto;height:700px">
                  <table style="width: 99%;" class="table-custom table-custom-info">
                      <tr>
                        <th width="120" colspan='2'>人员</th>
                        <th style="min-width:140px">巡检</th>
                        <th style="min-width:140px">故障</th>
                        <th style="min-width:140px">回收</th>
                        <th style="min-width:140px">投放</th>
                      </tr>
                      <tr v-for="(items,i) in tableData1">
                        <td>{{items.team.name}}</td>
                        <td>组长：<span style="font-weight:bold">{{items.team.leaderName}}</span>
                          <table class="table-custom table-custom-info" style="width:100%">
                            <tr v-for="item in items.team.users">
                              <td>{{item.nickName}}</td>
                            </tr>
                          </table>
                        </td>
                        <td>
                          <table class="table-custom-innerTable">
                            <tr v-for="(item,index) in filterTask(400,i)">
                              <td>{{index+1}}.{{item}}</td>
                            </tr>
                          </table>
                        </td>
                        <td>
                          <table class="table-custom-innerTable">
                            <tr v-for="(item,index) in filterTask(300,i)">
                              <td>{{index+1}}.{{item}}</td>
                            </tr>
                          </table>
                        </td>
                        <td>
                          <table class="table-custom-innerTable">
                            <tr v-for="(item,index) in filterTask(200,i)">
                              <td>{{index+1}}.{{item}}</td>
                            </tr>
                          </table>
                        </td>
                        <td>
                          <table class="table-custom-innerTable">
                            <tr v-for="(item,index) in filterTask(100,i)">
                              <td>{{index+1}}.{{item}}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                  </table>
                </div>
            </div>
      </el-col>
</template>

<script>
  import {getWeekTime} from '../../utils/index'
  import {taskQueryWorkTables} from '../../service/getData'
  import {arrayUnique} from '../../utils/index'
export default {
  name: 'workTable',
  data () {
    return {
       workPeople:'',
       activeName:'',
       workDate:'',
       workDate0:'',
       workDate1:'',
       workManageDate:[],
       tableData1:[],
       prop:'/ybdcWorkTable'
    }
  },
  mounted () {
    this.workManageDate = getWeekTime();
    this.workDate = this.workManageDate[0];
    this.taskQueryWorkTablesFn();
  },
  methods:{
    filterTask(i,j){
      var taskGroupModel=[];
        for(let k=0;k<this.tableData1[j].taskGroupModel.length;k++){
          if(this.tableData1[j].taskGroupModel[k].taskTypeCode==i){
            taskGroupModel.push(this.tableData1[j].taskGroupModel[k].taskDesc);
          }
        }
      var result = arrayUnique(taskGroupModel)
      console.log(arrayUnique(taskGroupModel))
      return result;
    },
    workSearch(){
      console.log('workPeople-------------'+this.workPeople);
      console.log('workDate-------------'+this.workDate);
      this.taskQueryWorkTablesFn();
    },
    taskQueryWorkTablesFn(){
        let thisWorkFirstDay;
        if(this.workDate0==''||this.workDate1==''){
          var year = new Date().getFullYear();
          thisWorkFirstDay = this.workManageDate[0];
          this.workDate0 = year + '-' + thisWorkFirstDay + ' 00:00:00';
          this.workDate1 = year + '-' + thisWorkFirstDay + ' 23:59:59';
        }
        var dataParam = {
              userNickName: this.workPeople,
              startTime: this.workDate0,
              endTime: this.workDate1
        };
        var subMission = this;
        taskQueryWorkTables(dataParam,function(data){
          if(data.success==true){
            console.log('taskQueryWorkTables----------'+data);
            subMission.tableData1 = data.result.list;
            for(let i=0;i<subMission.tableData1.length;i++){
              for(let j=0;j<subMission.tableData1[i].team.users.length;j++){
                if(subMission.tableData1[i].team.leaderId==subMission.tableData1[i].team.users[j].id){
                  subMission.tableData1[i].team.leaderName = subMission.tableData1[i].team.users[j].nickName;
                  subMission.tableData1[i].team.users.splice(j,1);
                }
              }
            }
          }else{
            subMission.$alert(data.msgContent, '错误提示', {
              confirmButtonText: '确定',
            });
          }
        });
    },
    handleClick(tab) {
      console.log(tab.label);
      var year = new Date().getFullYear();
      this.workDate0 = year + '-' + tab.label + ' 00:00:00';
      this.workDate1 = year + '-' + tab.label + ' 23:59:59';
      console.log(this.workDate0);
      this.taskQueryWorkTablesFn();
    },
  },
  components: {
  
  },
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
