<template>
  <div class="about">
    <el-col class="home" :span='22'>
      <div class="btn-group">
        <el-button type="primary" icon="plus" @click="showAdd=!showAdd">增加</el-button>
        <!-- <el-button type="primary" icon="edit" @click="showUpdate=!showUpdate">修改</el-button>
         <el-button type="primary" icon="delete" @click="test">删除</el-button>-->
      </div>
      <el-table v-loading="loading"
        :data="RoleData"
        border
        style="width: 100%"
      >
        </el-table-column>
        <el-table-column
          label=" 角色名称"
          prop="name"
          width="120">
        </el-table-column>
        <el-table-column
          prop="code"
          label="角色编码"
          width="120">
        </el-table-column>
        <el-table-column
          prop="note"
          label="备注"
          show-overflow-tooltip>
        </el-table-column>
        <!--  <el-table-column
            prop="id"
            label="id"
            show-overflow-tooltip style="display: none">
          </el-table-column>-->
        <el-table-column label="操作" width="300">
          <template scope="scope">
            <el-button
                size="small"
                type='success'
                @click="handSetMenu(scope.$index, scope.row,scope)">配置菜单</el-button>
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
      <!-- <div class="pagenation">
         <el-pagination
           @current-change="handleCurrentChange"
           :current-page="currentPage"
           :page-size="size"
           layout="prev, pager, next, jumper"
           :total="totalElements">
         </el-pagination>
       </div>-->
    </el-col>
    <el-dialog title="新增" v-model="showAdd">
      <el-form :model="addForm" label-position="left">
        <el-form-item label="角色名称" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色编码" :label-width="formLabelWidth">
          <el-input v-model="addForm.code" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="addForm.note" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAdd = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog  title="配置菜单" v-model="showMenuSetting">
      <P style='color:#ff4949;margin-bottom:25px;'>* &nbsp;暂时只支持配置一级菜单</P>
      <el-checkbox-group v-model="checkedMenuId" style='margin-left:15px'>
        <div class="" v-for="firstMenuList in sortMenulist" style="margin-top:15px;">
          <el-checkbox :label="firstMenuList.id"  @change="handCheckMenu">{{firstMenuList.name}}</el-checkbox>
          <div class='checkbox-area'>
              <el-checkbox-group v-model="checkedSecondMenu">
                    <el-checkbox   :checked="showChecked" v-for="secondMenuList in firstMenuList.childrenMenu" :label="secondMenuList.id" disabled style="margin-top:15px;margin-left:15px;">{{secondMenuList.name}}</el-checkbox>
              </el-checkbox-group>
          </div>
        </div>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showMenuSetting = false">取 消</el-button>
        <el-button type="primary" @click="setMenuForRole">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改" v-model="showUpdate">
      <el-form :model="updateForm" label-position="left">
        <el-form-item label="角色名称" :label-width="formLabelWidth">
          <el-input v-model="updateForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色编码" :label-width="formLabelWidth">
          <el-input v-model="updateForm.code" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="updateForm.note" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showUpdate = false">取 消</el-button>
        <el-button type="primary" @click="handUpdateRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {queryRole,createRole,deleteRole,updateRole,queryMenu,setRoleMenu} from '../../service/getData'
  export default {
    name: 'sysRole',
    data () {
      return {
        RoleData: [],
        loading:true,
        showAdd:false,
        showUpdate:false,
        showMenuSetting:false,
        showChecked:false,
        selectedRoleId:'',
        checkedMenuId:[],
        checkedSecondMenu:[],
        sortMenulist:[],
        addForm: {
          name:'',
          code:'',
          note:''
        },
        updateForm: {
          id:'',
          name:'',
          code:'',
          note:''
        },
        formLabelWidth: '120px'
      }
    },
    mounted () {
      this.queryRoleReq();
    },
    methods: {
      queryRoleReq(){
        let _this = this;
        this.loading = true;
        queryRole("",data=> {
          _this.RoleData = data;
          _this.loading = false;
        })
      },
      handleEdit(index, row) {
        this.showUpdate = !this.showUpdate;
        for (let key in this.updateForm){
          this.updateForm[key] = row[key];
        }
      },
      handUpdateRole(){
        let _this = this;
        //  console.log(this.form)
        updateRole(this.updateForm,data => {
          if(data.success){
            _this.$message({
              message: '提交成功',
              type: 'success'
            });
            _this.queryRoleReq();
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
        deleteRole(param,data => {
          if(data.success){
            _this.$message({
              message: '删除成功',
              type: 'success'
            });
            _this.queryRoleReq();
          }
        })
      },
      addRole(){
        let _this = this;
        let param = _this.addForm;
        createRole(param,data => {
          if(data.success){
            _this.RoleData.unshift (data.result.Role);
            _this.$message({
              message: '提交成功',
              type: 'success'
            });
            _this.queryRoleReq();
            for (let key in this.addForm){
              this.addForm[key] = '';
            }
            _this.showAdd = !_this.showAdd ;
          }else{
            _this.$message({
              message: data.msgContent,
              type: 'warning'
            });
          }
        })
      },
      handSetMenu(index,row){
        let _this = this;
        let checkedMenuId = [];
        this.selectedRoleId = row.id;
        queryMenu('',data =>{
          _this.sortMenulist = this.deepSortMenulist(data);
          row.menus.forEach((val,index) => {
              checkedMenuId.push(val.id);
          })
          this.checkedMenuId = checkedMenuId ;
        })
        this.showMenuSetting = !this.showMenuSetting;
      },
      handCheckMenu(event){
        this.showChecked = event.target.checked ? true: false;
        console.log(this.showChecked )
      },
      setMenuForRole(){
        let _this = this;
        let param = {
          roleId:this.selectedRoleId,
          menuIds:this.checkedMenuId
        }
        setRoleMenu(param,data => {
          if(data.success){
            _this.$message({
              message: data.msgContent,
              type: 'success'
            });
            this.queryRoleReq();
          }else{
            _this.$message({
              message: data.msgContent,
              type: 'warning'
            });
          }
          this.showMenuSetting = !this.showMenuSetting;
        })
      },
      deepSortMenulist(arr){
        let tempArr = [];
        arr.forEach((val,index) => {
          if(val.level == 0){
            val.childrenMenu = [];
            tempArr.push(val);
          }
        })
        arr.forEach((val,index) => {
          if(val.level == 1){
            tempArr.forEach((tVal,tIndex) => {
              if(val.parentMenu.id == tVal.id){
                tVal.childrenMenu.push(val);
              }
            })
          }
       })
       return tempArr;
      }
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
