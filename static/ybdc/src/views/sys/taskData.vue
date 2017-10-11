<template>
  <div class="about">
    <el-col class="home" :span='22'>
      <div class="btn-group">
        <el-button type="primary" icon="plus" @click="showAdd=!showAdd">增加</el-button>
        <!-- <el-button type="primary" icon="edit" @click="showUpdate=!showUpdate">修改</el-button>
         <el-button type="primary" icon="delete" @click="test">删除</el-button>-->
      </div>
      <el-table
        :data="userData"
        border
        style="width: 100%"
      >
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
          prop="password"
          label="密码"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="address"
          label="注册日期"
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
          prop="roles"
          label="角色"
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
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="updateForm.password" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showUpdate = false">取 消</el-button>
        <el-button type="primary" @click="handUpdateUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {creatUser,queryUser,deleteUser,updateUser} from '../../service/getData'
  const size = 2;
  let pageparam ={   // 页码参数；
    size,
    page:0
  }
  export default {
    name: 'sysRole',
    data () {
      return {
        userData: [],
        showAdd:false,
        showUpdate:false,
        addForm: {
          username: '',
          nickName: '',
          password: '',
          // registrationDate: '',
          mobile: '',
          idCard: '',
          shareCode: '',
          email: '',
          headImgUrl: '',
          email: '',
        },
        updateForm: {
          id:"",
          username: '',
          nickName: '',
          password: '',
          // registrationDate: '',
          mobile: '',
          idCard: '',
          shareCode: '',
          email: '',
          headImgUrl: '',
          email: '',
        },
        formLabelWidth: '120px'
      }
    },
    mounted () {
      this.queryUserReq(pageparam);
    },
    methods: {
      queryUserReq(param){
        let _this = this;
        queryUser(param,data => {
          _this.userData = data.content;
        })
      },
      handleEdit(index, row) {
        this.showUpdate = !this.showUpdate;
        for (let key in this.form){
          console.log(key)
          this.form[key] = row[key];
        }
      },
      handUpdateUser(){
        let _this = this;
        //  console.log(this.form)
        updateUser(this.form,data => {
          if(data.success){
            _this.$message({
              message: '提交成功',
              type: 'success'
            });
            _this.queryUserReq(pageparam);
            //this.form = [];//清空FORM缓存数据；
            this.showUpdate = !this.showUpdate;
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
            _this.queryUserReq(pageparam);
          }
        })
      },
      handleCurrentChange(currentPage){
        pageparam.page = currentPage - 1;
        let _this = this;
        queryUser(pageparam,data => {
          _this.userData = data.content;
        })
      },
      addUser(){
        let _this = this;
        let param = _this.form;
        creatUser(param,data => {
          if(data.success){
            _this.userData.unshift (data.result.user);
            _this.totalElements += 1;
            _this.$message({
              message: '提交成功',
              type: 'success'
            });
            _this.showAdd = !_this.showAdd ;
          }
        })
      }
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
