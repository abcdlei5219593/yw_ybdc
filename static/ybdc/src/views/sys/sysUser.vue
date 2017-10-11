<template>
  <div class="about" >
      <el-col class="home" :span='22' >
        <div class="btn-group">
          <div class="left">
            <el-button type="primary" icon="plus" @click="showAdd=!showAdd">增加</el-button>
            <el-button type="primary" icon="edit" @click="roleSetting">设置角色</el-button>
            <el-button type="primary" icon="setting" @click="citySetting">设置城市</el-button>
          </div>
          <div class="right">
            <label for="">帐号&nbsp;:&nbsp;</label>
            <el-input type="text" v-model="pageparam.username"  class='form-input' size='small' placeholder="请输入帐号"></el-input>
            <label for="">呢称&nbsp;:&nbsp;</label>
            <el-input type="text" v-model="pageparam.nickName" class='form-input' size='small' placeholder="请输入昵称"></el-input>
              <el-button type="primary" icon="search" @click="searchUser">搜索</el-button>
          </div>
        </div>
        <el-table  v-loading="loading"
          :data="userData"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label=" 账号"
            prop="username"
            width="120">
          </el-table-column>
          <el-table-column
            prop="nickName"
            label="昵称"
            width="120">
          </el-table-column>
          <el-table-column
            prop="registrationDate"
            label="注册日期"
              sortable
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="电话"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="idCard"
            label="身份证"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="shareCode"
            label="分享码"
            show-overflow-tooltip>
          </el-table-column>
           <el-table-column
            prop="cityNames"
            sortable
            label="城市"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="headImgUrl"
            label="头像"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="roleNames"
            label="角色"
            sortable
            show-overflow-tooltip>
          </el-table-column>
        <!--  <el-table-column
            prop="id"
            label="id"
            show-overflow-tooltip style="display: none">
          </el-table-column>-->
          <el-table-column label="操作"  width="200">
            <template scope="scope">
              <el-button
                size="small"
                @click="handleEdit(scope.$index, scope.row,scope)">修改</el-button>
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
    <el-dialog title="设置角色" v-model="showRoleSetting">
          <label for="">角色名：</label>
      <el-checkbox-group v-model="RoleSelection" >
        <el-checkbox v-for="role in roleData" :label="role.id">{{role.name}}</el-checkbox>
      </el-checkbox-group>
          <!-- <el-select v-model="RoleSelection"   auto-complete="off">
            <el-option
              v-for="item in roleData"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select> -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="showRoleSetting = false">取 消</el-button>
        <el-button type="primary" @click="ajaxRoleSetting">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="设置城市" v-model="showCitySetting">
          <label for="">城市名：</label>
    <!--   <el-checkbox-group v-model="CitySelection" @change="handleCheck1">
      <el-checkbox v-for="city in cityData" :label="city.id">{{city.name}}</el-checkbox>
    </el-checkbox-group> -->
           <el-select v-model="CitySelection" multiple   auto-complete="off">
            <el-option
              v-for="city in cityData"
              :label="city.name"
              :value="city.id">
            </el-option>
          </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showCitySetting = false">取 消</el-button>
        <el-button type="primary" @click="ajaxCitySetting">确 定</el-button>
      </div>
    </el-dialog>

      <el-dialog title="新增" v-model="showAdd">
        <el-form :model="addForm" label-position="left">
          <el-form-item label="账号" :label-width="formLabelWidth">
            <el-input v-model="addForm.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="昵称" :label-width="formLabelWidth">
            <el-input v-model="addForm.nickName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth">
            <el-input v-model="addForm.password" auto-complete="off"></el-input>
          </el-form-item>
        <!--  <el-form-item label="注册日期" :label-width="formLabelWidth">
            <el-date-picker type="date" auto-complete="off" v-model="form.registrationDate" placeholder="选择日期"  @change="getAddDate" ></el-date-picker>
          </el-form-item>-->
          <el-form-item label="电话" :label-width="formLabelWidth">
            <el-input v-model="addForm.mobile" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="身份证" :label-width="formLabelWidth">
            <el-input v-model="addForm.idCard" auto-complete="off"></el-input>
          </el-form-item>
          <!-- <el-form-item label="分享码" :label-width="formLabelWidth">
            <el-input v-model="addForm.shareCode" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="头像" :label-width="formLabelWidth">
            <el-input v-model="addForm.headImgUrl" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth">
            <el-input v-model="addForm.email" auto-complete="off"></el-input>
          </el-form-item> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showAdd = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="修改" v-model="showUpdate">
        <el-form :model="updateForm" label-position="left">
          <el-form-item label="账号" :label-width="formLabelWidth">
            <el-input v-model="updateForm.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="昵称" :label-width="formLabelWidth">
            <el-input v-model="updateForm.nickName" auto-complete="off"></el-input>
          </el-form-item>
         <!-- <el-form-item label="注册日期" :label-width="formLabelWidth">
            <el-input v-model="form.registrationDate" auto-complete="off"></el-input>
          </el-form-item>-->
          <el-form-item label="电话" :label-width="formLabelWidth">
            <el-input v-model="updateForm.mobile" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="身份证" :label-width="formLabelWidth">
            <el-input v-model="updateForm.idCard" auto-complete="off"></el-input>
          </el-form-item>
          <!-- <el-form-item label="分享码" :label-width="formLabelWidth">
            <el-input v-model="updateForm.shareCode" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="头像" :label-width="formLabelWidth">
            <el-input v-model="updateForm.headImgUrl" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth">
            <el-input v-model="updateForm.email" auto-complete="off"></el-input>
          </el-form-item> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showUpdate = false">取 消</el-button>
          <el-button type="primary" @click="handUpdateUser">确 定</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
  import {creatUser,queryUser,deleteUser,updateUser,setUserCities,setRoles,queryCity,queryRole} from '../../service/getData'
  import {getArrayFromArrayObj,copyObject} from '../../utils/index'
  const size = 10;
  export default {
    name: 'sysRole',
    data () {
      return {
        userData: [],
        pageparam :{   // 页码参数；
          username:'',
          nickName:'',
          size,
          page:0
        },
        currentPage: 1,
        size,
        loading:true,
        totalElements:0,
        showAdd:false,
        showUpdate:false,
        showRoleSetting:false,
        showCitySetting:false,
        multipleSelection:[],
        RoleSelection:[],
        CitySelection:'',
        addForm: {
          username: '',
          nickName: '',
          password:'',
         // registrationDate: '',
          mobile: '',
          idCard: '',
          // shareCode: '',
          // email: '',
          // headImgUrl: '',
        },
        roleData: [],
        cityData: [],
        updateForm: {
          id:"",
          username: '',
          nickName: '',
          // registrationDate: '',
          mobile: '',
          idCard: '',
          // shareCode: '',
          // headImgUrl: '',
          // email: '',
        },
        formLabelWidth: '120px'
      }
    },
    mounted () {
      console.log(this.pageparam)
      this.queryUserReq(this.pageparam);
    },
    methods: {
      queryUserReq(param){
        if(this.loading == false){
          this.loading = !this.loading;
        }
        queryUser(param,data => {
          this.updateArryList(data.content)     // 将数据LIST中帐号创建时间转时间
          this.userData = data.content;
          this.loading = !this.loading;
          this.totalElements = data.totalElements
        })
      },
      searchUser() {
        this.pageparam.page = 0;
        this.queryUserReq(this.pageparam);
      },
      updateArryList(data){ // data,给registrationDate转成时间格式；
        data.forEach((value,index) => {
          value.registrationDate = this.timeStampToDate(value.registrationDate);
        })
      },
      timeStampToDate(value){ //时间戳转 yyyy-MM-dd hh:ss:mm
        let timestamp = new Date(value);//直接用 new Date(时间戳) 格式转化获得当前时间
        let result = timestamp.toLocaleDateString().replace(/\//g, "-") + " " + timestamp.toTimeString().substr(0, 8); //再利用拼接正则等手段转化为yyyy-MM-dd hh:mm:ss 格式
        return result;
      },
      handleEdit(index, row) {
          this.showUpdate = !this.showUpdate;
          for (let key in this.updateForm){
              console.log(key)
              this.updateForm[key] = row[key];
          }
      },
      handUpdateUser(){
        let _this = this;
     //  console.log(this.form)
        updateUser(this.updateForm,data => {
            if(data.success){
              _this.$message({
                message: '提交成功',
                type: 'success'
              });
              _this.queryUserReq(this.pageparam);
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
        deleteUser(param,data => {
            if(data.success){
              _this.$message({
                message: '删除成功',
                type: 'success'
              });
              _this.queryUserReq(this.pageparam);
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
        queryUser(this.pageparam,data => {
          this.updateArryList(data.content)
          this.userData = data.content;
        })
      },
      addUser(){
        let _this = this;
        let param = _this.addForm;
        creatUser(param,data => {
          if(data.success){
            data.result.user.registrationDate = _this.timeStampToDate(data.result.user.registrationDate);
            _this.userData.unshift (data.result.user);
            _this.totalElements += 1;
            _this.$message({
              message: '提交成功',
              type: 'success'
            });
            _this.showAdd = !_this.showAdd ;
          }else{
            _this.$message({
              message: data.msgContent,
              type: 'warning'
            });
          }
        })
      },
      handleSelectionChange(obj){
        this.multipleSelection = getArrayFromArrayObj('id',obj);
      },
      roleSetting(){
        if(this.multipleSelection.length == 0){
          this.$message({
            message: '请至少选择一个用户',
            type: 'warning'
          });
        }else{
          queryRole('',data => {
            this.roleData = data;
            this.showRoleSetting = !this.showRoleSetting;
          })
        }
      },
      handleCheck1(val){
          console.log(val);
      },
      ajaxRoleSetting(){
        console.log(this.multipleSelection);
        let param = {
            userIds: this.multipleSelection,
            roleIds: this.RoleSelection
        }
        console.log(param);
        setRoles(param,data => {
          if(data.success){
            this.showRoleSetting = !this.showRoleSetting;
            this.$message({
              message: data.msgContent,
              type: 'warning'
            });
            this.queryUserReq(this.pageparam);
              //todo
          }
        })
      },
      ajaxCitySetting(){
        console.log(this.multipleSelection);
        let param = {
            userIds: this.multipleSelection,
            userCityIds: this.CitySelection
        }
        console.log(param);
        setUserCities(param,data => {
          if(data.success){
            this.$message({
              message: data.msgContent,
              type: 'warning'
            });
            this.queryUserReq(this.pageparam);
            this.showCitySetting = !this.showCitySetting;
          }
        })
      },
      citySetting(){
        if(this.multipleSelection.length == 0){
          this.$message({
            message: '请至少选择一个用户',
            type: 'warning'
          });
        }else{
          queryCity('',data => {
            this.cityData = data;

            this.showCitySetting = !this.showCitySetting;
          })
        }
      },
    }
  }


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" scoped>
  .home{
    padding:15px;
  .btn-group{
    padding-bottom:15px;
    display: flex;
    justify-content: space-between;
    .form-input{
      width: 150px;
    }
    .right .el-button {
    margin-left: 20px;
    }

  }
  .pagenation{
    margin-top:15px;
    float: right;
  }
  }
</style>
