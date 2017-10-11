<template>
  <div class="about">
    <el-col class="home"  :span='22'>
      <div class="btn-group">

        <el-button type="primary" icon="plus" @click="showAdd=!showAdd">增加</el-button>
        <!-- <el-button type="primary" icon="setting" @click="handleCitySetting">设置城市</el-button> -->
        <!-- <el-button type="primary" icon="plus" @click="handSetting">设置人员</el-button>-->
        <!-- <el-button type="primary" icon="edit" @click="showUpdate=!showUpdate">修改</el-button>
         <el-button type="primary" icon="delete" @click="test">删除</el-button>-->
      </div>
      <el-table
        :data="menuData"
        border
        style="width: 100%"
        >
        <el-table-column
          label="菜单名"
          prop="name"
        >
        </el-table-column>
        <el-table-column
          prop="code"
          label="菜单编码"
          >
        </el-table-column>
        <el-table-column
          prop="url"
          label="链接"
          >
        </el-table-column>
        <el-table-column
          prop="parentMenu.name"
          label="父级菜单"
          >
        </el-table-column>
        <div
          prop="parentMenu.id"
          label=""
          style='diplay:none;'
          >
        </div>
        <el-table-column
          prop="sortNum"
          label="排序号"
          >
        </el-table-column>
        <el-table-column
          prop="level"
          label="菜单级别"
          >
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template scope="scope">

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
    </el-col>


    <el-dialog title="新增" v-model="showAdd">
      <el-form :model="addForm" label-position="left">
        <el-form-item label="优先级" :label-width="formLabelWidth">
          <el-select v-model="addForm.level"  placeholder="请选择" @change="selectLevel">
            <el-option
              v-for="item in levelList"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="父级菜单" :label-width="formLabelWidth">
          <el-select v-model="addForm.parentMenuId"  placeholder="请选择">
            <el-option
              v-for="item in parentMenuList"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单编码" :label-width="formLabelWidth">
          <el-input v-model="addForm.code" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序号" :label-width="formLabelWidth">
          <el-input v-model="addForm.sortNum" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="链接" :label-width="formLabelWidth">
          <el-input v-model="addForm.url" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAdd = false">取 消</el-button>
        <el-button type="primary" @click="addMenu">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改" v-model="showUpdate">
      <el-form :model="updateForm" label-position="left">
        <el-form-item label="优先级" :label-width="formLabelWidth">
          <el-select v-model="updateForm.level"  placeholder="请选择" @change="selectLevelForUpdate">
            <el-option
              v-for="item in levelList"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="父级菜单" :label-width="formLabelWidth">
          <el-select v-model="updateForm.parentMenuId"  placeholder="请选择">
            <el-option
              v-for="item in parentMenuListForUpdate"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名" :label-width="formLabelWidth">
          <el-input v-model="updateForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单编码" :label-width="formLabelWidth">
          <el-input v-model="updateForm.code" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序号" :label-width="formLabelWidth">
          <el-input v-model="updateForm.sortNum" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="链接" :label-width="formLabelWidth">
          <el-input v-model="updateForm.url" auto-complete="off"></el-input>
        </el-form-item>
     </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showUpdate = false">取 消</el-button>
        <el-button type="primary" @click="updateMenu">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {createMenu,queryMenu,deleteMenu,updateMenu,findParentMenu} from '../../service/getData'
  import {getArrayFromArrayObj,copyObject} from '../../utils/index'
  const size = 10;
  export default {
    name: 'sysWareHouse',
    data () {
      return {
        menuData: [],
        showAdd:false,
        showUpdate:false,
        levelList:[{
          name:0,
          id:0
        },{
          name:1,
          id:1
        },{
          name:2,
          id:2
        }],
        parentMenuList:[],
        parentMenuListForUpdate:[],
        addForm: {
          name:'',
          code: '',
          sortNum:'',
          url:'',
          parentMenuId:'',
          level:''
        },
        updateForm: {
          id:'',
          name:'',
          code: '',
          sortNum:'',
          url:'',
          parentMenuId:'',
          level:''
        },
        formLabelWidth: '120px',
      }
    },
    mounted () {
      this.queryMenuReq();
    },
    methods: {
      queryMenuReq(){
        let _this = this;
        queryMenu('',data => {
          this.menuData = data;
        })
      },
      selectLevel(val){
        alert(val)
        let _this = this;
        let param = {
          level:val
        }
        this.addForm.parentMenuId = '';
        findParentMenu(param,data => {
          _this.parentMenuList = data.result.menus;
        })
      },
      selectLevelForUpdate(val){
        let _this = this;
        let param = {
          level:val
        };
        this.updateForm.parentMenuId = '';
        findParentMenu(param,data => {
          _this.parentMenuListForUpdate = data.result.menus;
        })
      },
      handleUpdate(index,row) {
        let _this = this;
        let param = {
          level:row.level
        }
        findParentMenu(param,data => {
          _this.parentMenuListForUpdate = data.result.menus;
        })
        this.showUpdate = !this.showUpdate;
        for (let key in this.updateForm){
          this.updateForm[key] = row[key];
        }
        this.updateForm.parentMenuId = row.parentMenu.id;
      },
      updateMenu(){
        let _this = this;
        //  console.log(this.form)
        updateMenu(this.updateForm,data => {
          if(data.success){
            _this.$message({
              message: '提交成功',
              type: 'success'
            });
            _this.queryMenuReq();
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
        deleteMenu(param,data => {
          if(data.success){
            _this.$message({
              message: '删除成功',
              type: 'success'
            });
            _this.queryMenuReq();
          }else{
            _this.$message({
              message: data.msgContent,
              type: 'warning'
            });
          }
        })
      },
      addMenu(){
        let _this = this;
        let param = _this.addForm;
        createMenu(param,data => {
          if(data.success){
            _this.menuData.unshift (data.result.menu);
            for (let key in _this.addForm){
              if(key != 'level'){
                  _this.addForm[key] = '';
              }
            }
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
