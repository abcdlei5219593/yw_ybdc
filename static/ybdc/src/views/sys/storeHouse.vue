<template>
  <div class="about">
    <el-col class="home"  :span='22'>
      <div class="btn-group">

        <el-button type="primary" icon="plus" @click="showAdd=!showAdd">增加</el-button>
        <el-button type="primary" icon="setting" @click="handleCitySetting">设置城市</el-button>
      </div>
      <el-table
        :data="warehouseData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
        >
       <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="仓库名"
          prop="name"
          width="120">
        </el-table-column>
        <el-table-column
          prop="code"
          label="仓库编码"
          width="120">
        </el-table-column>
        <el-table-column
          prop="userCity.name"
          label="城市"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="managersName"
          label="管理员"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          show-overflow-tooltip>
        </el-table-column>
        <!--  <el-table-column
            prop="id"
            label="id"
            show-overflow-tooltip style="display: none">
          </el-table-column>-->
        <el-table-column label="操作" width="280">
          <template scope="scope">

            <el-button
              size="small"
              type="success"
              @click="handleSetting(scope.$index, scope.row,scope)">设置管理员</el-button>
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
        <el-form-item label="仓库名" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="仓库编码" :label-width="formLabelWidth">
          <el-input v-model="addForm.code" auto-complete="off"></el-input>
        </el-form-item>

        <!--  <el-form-item label="注册日期" :label-width="formLabelWidth">
            <el-date-picker type="date" auto-complete="off" v-model="form.registrationDate" placeholder="选择日期"  @change="getAddDate" ></el-date-picker>
          </el-form-item>-->
        <el-form-item label="地址" :label-width="formLabelWidth">
          <el-input v-model="addForm.address" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="addForm.remark" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAdd = false">取 消</el-button>
        <el-button type="primary" @click="addWarehouse">确 定</el-button>
      </div>
    </el-dialog>

     <el-dialog title="设置城市" v-model="showCitySetting">
        <el-select v-model="selectedCityId" placeholder="请选择">
          <el-option
            v-for="item in cityList"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showCitySetting = false">取 消</el-button>
        <el-button type="primary" @click="ajaxCitySetting">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="设置管理员" v-model="showSetting">
      <el-table
        :data="warehouseManagers"
        border
        style="width: 100%"
        @selection-change="handleMangersChange"
        >
       <el-table-column
          type="selection"
          >
        </el-table-column>
        <el-table-column
          label="用户名"
          prop="username"
        >
        </el-table-column>
        <el-table-column
          label="昵称"
          prop="nickName"
        >
        </el-table-column>
        <div class="" style="display:none" prop="id"></div>
      </el-table>


        <!-- <el-select v-model="selectedId" placeholder="请选择">
          <el-option
            v-for="item in warehouseManagers"
            :label="item.nickName"
            :value="item.id">
          </el-option>
        </el-select> -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="showSetting = false">取 消</el-button>
        <el-button type="primary" @click="addWarehouseManager">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改" v-model="showUpdate">
      <el-form :model="updateForm" label-position="left">
      <el-form-item label="仓库名" :label-width="formLabelWidth">
        <el-input v-model="updateForm.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="仓库编码" :label-width="formLabelWidth">
        <el-input v-model="updateForm.code" auto-complete="off"></el-input>
      </el-form-item>

      <!--  <el-form-item label="注册日期" :label-width="formLabelWidth">
          <el-date-picker type="date" auto-complete="off" v-model="form.registrationDate" placeholder="选择日期"  @change="getAddDate" ></el-date-picker>
        </el-form-item>-->
      <el-form-item label="地址" :label-width="formLabelWidth">
        <el-input v-model="updateForm.address" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="备注" :label-width="formLabelWidth">
        <el-input v-model="updateForm.remark" auto-complete="off"></el-input>
      </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showUpdate = false">取 消</el-button>
        <el-button type="primary" @click="handUpdateWarehouse">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {createWarehouse,queryWarehouse,deleteWarehouse,updateWarehouse,findWarehouseManagers,setWarehouseManager,queryCity,setWarehouseCity} from '../../service/getData'
  import {getArrayFromArrayObj,copyObject} from '../../utils/index'
  const size = 10;
  export default {
    name: 'sysWareHouse',
    data () {
      return {
        warehouseData: [],
        warehouseManagers:[],
        cityList:[],
        warehouseId:'',
        currentPage: 1,
        pageparam: {   // 页码参数；
          size,
          page:0
        },
        size,
        totalElements:0,
        showAdd:false,
        showUpdate:false,
        showSetting:false,
        showCitySetting:false,
        selectedCityId:'',
        selectedId:[],
        multipleSelection:[],
        addForm: {
          name: '',
          code: '',
          city: '',
          address: '',
          manager: '',
          remark: '',
        },
        updateForm: {
          id:"",
          name: '',
          code: '',
          city: '',
          address: '',
          manager: '',
          remark: '',
        },
        formLabelWidth: '120px',
        storeHouseSelect:[]
      }
    },
    mounted () {
      this.queryWarehouseReq(this.pageparam);
    },
    methods: {
      queryWarehouseReq(param){
        let _this = this;
        queryWarehouse(param,data => {
          console.log(this)
          this.warehouseData = data.content;
          this.totalElements = data.totalElements;
        })
      },
      handleEdit(index, row) {
        this.showUpdate = !this.showUpdate;
        for (let key in this.updateForm){
          this.updateForm[key] = row[key];
        }
      },
      handUpdateWarehouse(){
        let _this = this;
        //  console.log(this.form)
        updateWarehouse(this.updateForm,data => {
          if(data.success){
            _this.$message({
              message: '提交成功',
              type: 'success'
            });
            _this.queryWarehouseReq(_this.pageparam);
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
        deleteWarehouse(param,data => {
          if(data.success){
            _this.$message({
              message: '删除成功',
              type: 'success'
            });
            _this.queryWarehouseReq(_this.pageparam);
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
        queryWarehouse(_this.pageparam,data => {
          _this.warehouseData = data.content;
        })
      },
      addWarehouse(){
        let _this = this;
        let param = _this.addForm;
        createWarehouse(param,data => {
          if(data.success){
            _this.warehouseData.unshift (data.result.warehouse);
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
      addWarehouseManager(){
        let _this = this;
        let param = {
          warehouseId :_this.warehouseId,
          managerUserIds:_this.selectedId
        }
        setWarehouseManager(param,data => {
           this.showSetting = !this.showSetting;
          if(data.success){

            _this.queryWarehouseReq(_this.pageparam);
            _this.$message({
              message: data.msgContent,
              type: 'success'
            });
            //todo
          }else{
            _this.$message({
              message: data.msgContent,
              type: 'warning'
            });
          }
        })
      },
      handleSetting(index,row){
        let param = {
            userCityId:row.userCityId
        };
        let _this = this;
        this.warehouseId = row.id;

        findWarehouseManagers(param,data => {
          _this.warehouseManagers = data.result.users;
           this.showSetting = !this.showSetting;
        })
      },
       handleSelectionChange(obj){
        this.multipleSelection = getArrayFromArrayObj('id',obj);
      },
      handleMangersChange(obj){
       this.selectedId = getArrayFromArrayObj('id',obj);
     },
      handleCitySetting(){
        if(this.multipleSelection.length == 0){
           this.$message({
              message: '请至少选择一个仓库',
              type: 'warning'
            });
        }else{
          let _this = this;
          queryCity('',data =>{
            _this.cityList = data;
            _this.showCitySetting = !_this.showCitySetting;
          })
        }

      },
      ajaxCitySetting(){
        let param = {
          warehouseIds : this.multipleSelection[0],
          cityId:this.selectedCityId
        };
        let _this = this;
        setWarehouseCity(param,data =>{
          if(data.success){
            _this.$message({
              message: '城市设置成功',
              type: 'success'
            });
             _this.queryWarehouseReq(_this.pageparam);
            _this.showCitySetting = !_this.showCitySetting;
          }

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
