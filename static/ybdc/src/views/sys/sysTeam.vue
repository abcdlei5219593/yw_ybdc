<template>
  <div class="about">
    <el-col class="home" :span='22'>
      <div class="btn-group">

        <el-button type="primary" icon="plus" @click="showAdd=!showAdd">增加</el-button>
        <!-- <el-button type="primary" icon="setting" @click="handleCitySetting">设置城市</el-button> -->
        <!-- <el-button type="primary" icon="plus" @click="handSetting">设置人员</el-button>-->
        <!-- <el-button type="primary" icon="edit" @click="showUpdate=!showUpdate">修改</el-button>
         <el-button type="primary" icon="delete" @click="test">删除</el-button>-->
      </div>
      <el-table
        :data="teamData"
        border
        style="width: 100%"
        >
        <el-table-column
          label="团队名"
          prop="name"
        >
        </el-table-column>
        <el-table-column
          label="城市"
          prop="userCity.name"
        >
        </el-table-column>
        <div
          style="display:hidden;"
          prop="userCity.id"
        >
        </div>
        <el-table-column
          prop="leader.nickName"
          label="队长"
          >
        </el-table-column>
        <el-table-column
          prop="userNames"
          label="成员"
        >
        </el-table-column>
        <el-table-column
          prop="note"
          label="备注"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作"  width="500">
          <template scope="scope">
            <el-button
              size="small"
              type="primary"
              @click="handleSetLeader(scope.$index, scope.row,scope)">设置队长</el-button>
            <el-button
              size="small"
              type="success"
              @click="handleSetting(scope.$index, scope.row,scope)">添加成员</el-button>
            <el-button
              size="small"
              type="warning"
              @click="handDeleteMembers(scope.$index, scope.row,scope)">移除成员</el-button>
            <el-button
              size="small"
              type="info"
              @click="handleSetCity(scope.$index, scope.row,scope)">设置城市</el-button>
          <el-button
              size="small"
              @click="handleUpdate(scope.$index, scope.row,scope)">修改</el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagenation">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="size"
          layout="prev, pager, next, jumper"
          :total="totalElements">
        </el-pagination>
      </div>
    </el-col>

    <el-dialog title="设置城市" v-model="showSetCity">
      <el-select v-model="selectedCityId" placeholder="请选择">
        <el-option
          v-for="item in cityList"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showSetCity = false">取 消</el-button>
        <el-button type="primary" @click="setCity">确 定</el-button>
      </div>
    </el-dialog >

  <el-dialog title="设置队长" v-model="showSetLeader">
    <el-select v-model="selectedLeaderId" placeholder="请选择">
      <el-option
        v-for="item in leaderList"
        :label="item.nickName"
        :value="item.id">
      </el-option>
    </el-select>
    <div slot="footer" class="dialog-footer">
      <el-button @click="showSetLeader = false">取 消</el-button>
      <el-button type="primary" @click="setLeader">确 定</el-button>
    </div>
  </el-dialog>

    <el-dialog title="新增" v-model="showAdd">
      <el-form :model="addForm" label-position="left">
        <el-form-item label="团队名" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="addForm.note" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAdd = false">取 消</el-button>
        <el-button type="primary" @click="addTeam">确 定</el-button>
      </div>
    </el-dialog>


  <el-dialog title="设置成员" v-model="showSetting" modal-append-to-body >
      <el-table :data="members"   style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
          </el-table-column>
         <el-table-column property="username" label="用户名" ></el-table-column>
         <el-table-column property="nickName" label="昵称" ></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showSetting = false">取 消</el-button>
        <el-button type="primary" @click="updateTeamMate">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="移除成员" v-model="showDeleteMembers">
        <el-table :data="members"   style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
            </el-table-column>
           <el-table-column property="username" label="用户名" ></el-table-column>
           <el-table-column property="nickName" label="昵称" ></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showDeleteMembers = false">取 消</el-button>
          <el-button type="primary" @click="deleteTeamMate">确 定</el-button>
        </div>
      </el-dialog>

    <el-dialog title="修改" v-model="showUpdate">
      <el-form :model="updateForm" label-position="left">
      <el-form-item label="团队名" :label-width="formLabelWidth">
        <el-input v-model="updateForm.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="备注" :label-width="formLabelWidth">
        <el-input v-model="updateForm.note" auto-complete="off"></el-input>
      </el-form-item>
     </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showUpdate = false">取 消</el-button>
        <el-button type="primary" @click="handUpdateTeam">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {createTeam,queryTeam,deleteTeam,updateTeam,setLeader,addMembers,findOperationMaintenancerByCity,removeMembers,queryAllUser,queryCity,setTeamCity,getByRoleCodeAndCityCode} from '../../service/getData'
  import {getArrayFromArrayObj,copyObject} from '../../utils/index'
  const size = 10;
  export default {
    name: 'sysWareHouse',
    data () {
      return {
        teamData: [],
        members:[],// 待添加人员列表
        leaderList:[],
        pageparam: {   // 页码参数；
           size,
           page:0
        },
        currentPage: 1,
        size,
        totalElements:0,
        showAdd:false,
        showUpdate:false,
        showSetting:false,
        showSetLeader:false,
        showDeleteMembers:false,
        showSetCity:false,
        selectedTeamId:'',
        selectedCityId:'',
        selectedLeaderId:'',
        selectedMemberList:[], // 当前小组已存在的成员列表
        cityList:[],
        multipleSelection:[],
        addForm: {
          name: '',
          leader: '',
          note: '',
        },
        updateForm: {
          id:'',
          name: '',
          note: '',
        },
        formLabelWidth: '120px',
        storeHouseSelect:[]
      }
    },
    mounted () {
      this.queryTeamReq(this.pageparam);
    },
    methods: {
      queryTeamReq(param){
        let _this = this;
        queryTeam(param,data => {
          console.log(this)
          this.teamData = data.content;
          this.totalElements = data.totalElements;
        })
      },
      handleUpdate(index,row) {
        this.showUpdate = !this.showUpdate;
        for (let key in this.updateForm){
          this.updateForm[key] = row[key];
        }
      },
      handUpdateTeam(){
        let _this = this;
        //  console.log(this.form)
        updateTeam(this.updateForm,data => {
          if(data.success){
            _this.$message({
              message: '提交成功',
              type: 'success'
            });
            _this.queryTeamReq(_this.pageparam);
            //this.form = [];//清空FORM缓存数据；
            this.showUpdate = !this.showUpdate;
          }else{
            _this.$message({
              message: data.msgContent,
              type: 'warning'
            });
          }
        })
      },
      handleDelete(index, row) {
        let _this = this;
        let param ={
          id:row.id
        }
        deleteTeam(param,data => {
          if(data.success){
            _this.$message({
              message: '删除成功',
              type: 'success'
            });
            _this.queryTeamReq(_this.pageparam);
          }else{
            _this.$message({
              message: data.msgContent,
              type: 'warning'
            });
          }
        })
      },
      handleCurrentChange(currentPage){
        this.currentPage = currentPage;
        this.pageparam.page = currentPage - 1;
        let _this = this;
        this.queryTeamReq(this.pageparam,data => {
          _this.teamData = data.content;
        })
      },
      addTeam(){
        let _this = this;
        let param = _this.addForm;
        createTeam(param,data => {
          if(data.success){
            _this.teamData.unshift (data.result.team);
            for (let key in _this.addForm){
              _this.addForm[key] = '';
            }
            _this.totalElements += 1;
            _this.$message({
              message: '提交成功',
              type: 'success'
            });
            _this.showAdd = !_this.showAdd;
          }else{
            _this.$message({
              message: data.msgContent,
              type: 'warning'
            });
          }
        })
      },
      handleSetLeader(index,row){
        let _this = this;
        if(!row.userCity){
          this.$message({
            message: '团队没有设置城市;',
            type: 'warning'
          });
          return;
        }
        this.selectedCityId = row.userCity.id;
        this.selectedTeamId = row.id;
        let param = {
          userCityId:_this.selectedCityId
        }
        findOperationMaintenancerByCity(param,data => {
          if(row.leader !=null){
             this.selectedLeaderId = row.leader.id; //如果队长不为空时，将其设置为默认选项；
          }else{
             this.selectedLeaderId = data.result.operationMaintenancers[0].id;
          }
          this.leaderList = data.result.operationMaintenancers;
          this.showSetLeader = !this.showSetLeader;
        })
      },
      setLeader(){
        let param = {
          teamId:this.selectedTeamId,
          leaderId:this.selectedLeaderId
        };
        setLeader(param,data => {
          if(data.success){
            this.queryTeamReq(this.pageparam);
            this.$message({
              message: data.msgContent,
              type: 'success'
            });
          }else{
            this.$message({
              message: data.msgContent,
              type: 'warning'
            });
          }
          this.showSetLeader = !this.showSetLeader;
        })
      },
      handleSetting(index,row){
        let _this = this;
        if(!row.userCity){
          this.$message({
            message: '团队没有设置城市;',
            type: 'warning'
          });
          return;
        }
        let param = {
          userCityId:row.userCity.id
        }
        this.selectedTeamId = row.id;
        this.selectedMemberList = row.users

        getByRoleCodeAndCityCode(param,data => {
          this.members =  data.result.operationMaintenancers;
          if (this.selectedMemberList) {
              this.memberListFilter(this.selectedMemberList,this.members) // 成员列表去重；
          }

           this.showSetting = !this.showSetting;
        })
      },
      memberListFilter(memberList,userList){  // 数组去重，通过member的ID判断是否重复，返回去重后的数组；
        memberList.forEach((mValue, mIndex, mArray) => {;
          userList.forEach((uValue, uIndex, uArray) => {
              if(mValue.id == uValue.id){
                userList.splice(uIndex,1);
              };
          });
        })
         console.log(userList)
        return userList;

      },
      handleSelectionChange(obj){
        this.multipleSelection = getArrayFromArrayObj('id',obj);
      },
      updateTeamMate(){
        let param = {
          teamId:this.selectedTeamId,
          memberIds:this.multipleSelection
        }
        addMembers(param,data => {
          this.queryTeamReq(this.pageparam);
          this.showSetting = !this.showSetting;
          this.$message({
            message: data.msgContent,
            type: 'success'
          });
        })
      },
      handDeleteMembers(index,row){
        this.selectedTeamId = row.id;
        let deleteMembers = this.members = row.users;
        if(deleteMembers.length != 0){
           this.showDeleteMembers = !this.showDeleteMembers;
        }else{
          this.$message({
            message: '没有可移除的成员',
            type: 'warning'
          });
        }
      },
      deleteTeamMate(){
        let param = {
          teamId:this.selectedTeamId,
          memberIds:this.multipleSelection
        }
        removeMembers(param,data => {
          this.queryTeamReq(this.pageparam);
          this.showDeleteMembers = !this.showDeleteMembers;
          this.$message({
            message: data.msgContent,
            type: 'success'
          });
        })
      },
      handleSetCity(index,row){
        let _this = this;
        console.log(row.id)
        this.selectedTeamId = row.id;
        queryCity('',data => {
          console.log(_this.cityList)
          _this.cityList = data;
          _this.showSetCity = true;
        })
      },
      setCity(){
        let param = {
          teamId : this.selectedTeamId,
          cityId:this.selectedCityId
        };
        let _this = this;
        setTeamCity(param,data =>{
          if(data.success){
            _this.$message({
              message: '城市设置成功',
              type: 'success'
            });
            _this.queryTeamReq(_this.pageparam);
          }else{
            _this.$message({
              message: data.msgContent,
              type: 'warning'
            });
          }
          _this.showSetCity = false;
        })
      }
      /*handSelectionChange(obj) {
        this.storeHouseSelect = this.colletIdFromArray(obj);
        console.log( this.storeHouseSelect)
      },
      colletIdFromArray(array){
          let temp = [];
          for(let key in array){
              console.log(key)
              temp[key] = array[key].id;
          }
          return temp;
      }*/
      /* getAddDate(val){
       this.form.registrationDate = val+" 10:10:02";
       }*/
    }
  }


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .home{
    padding:15px;
  .btn-group{
    padding-bottom:15px;
  }
  .pagenation{
    margin-top:15px;
    float: right;
  }
  }
</style>
