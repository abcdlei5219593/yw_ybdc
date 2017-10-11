<template>
      <el-col class="peopleContent" :span='21' >
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-col>
</template>

<script>
  import city from '../../components/people/city.vue'
  import group from "../../components/people/group.vue"
  import groupDetail from "../../components/people/groupDetail.vue"
  import {getCity,getAllEntityName,gethistoryTrack,queryAllUser,getTaskTimer,addTaskTimer,deleteTaskTimer,updateTaskTimer,queryTaskGroupList,getAllPolygon,getAllcoordinate,getAllBicycles,queryTaskFiles,queryTaskTypes,queryTaskSources,getTeams,findAllUser} from '../../service/getData'
  import {jj_map,transTimeT,weekArray,arrayWeek} from '../../utils/index'
  import store from '../../vuex/store'

export default {
  name: 'taskPeople',
  data () {
    return {
      prop:'/ybdcTaskPeople'
    }
  },
  mounted () {

  },
  methods:{

  },
  components: {
    city,
    group,
    groupDetail
  },
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  $grey:#d3d3d3;
  $border:1px solid #d3d3d3;
  .border{
    border:$border;
  }
  .peopleContent{
    border:$border;
    margin:20px;
    padding: 15px;
    min-height: 760px;

  }
  .left-content>div{
      width:100%;
      height: 840px;
    }
  .top-content {
      .el-col{
        height: 500px;
      }
  }
  .bottom-content{
    padding:15px;
    .el-row{
      height: 50px;
      line-height: 50px;
      .el-date-editor--date{
        margin:0 15px;
      }
    }
  }
  .el-collapse-item__content>div,.build-task>div{
    line-height: 3;
  }
  .el-checkbox-group{
    display: inline-block;
  }
  .map-div{
    border:$border;
  }
  .map-container{
    width:100%;
    height:500px;
  }
  .date-wrapper{
    height:36px;
    line-height:36px;
  }

</style>
