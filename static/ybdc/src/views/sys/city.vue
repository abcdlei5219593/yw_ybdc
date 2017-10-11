<template>
  <div class="about">
    <el-col class="home" :span='22'>
      <div class="btn-group">
        <el-button type="primary" icon="plus" @click="showAdd=!showAdd">增加</el-button>
        <!-- <el-button type="primary" icon="edit" @click="showUpdate=!showUpdate">修改</el-button>
         <el-button type="primary" icon="delete" @click="test">删除</el-button>-->
      </div>
      <el-table
        :data="cityData"
        border
        style="width: 100%"
      >
        </el-table-column>
        <el-table-column
          label=" 城市名称"
          prop="name"
          width="120">
        </el-table-column>
        <el-table-column
          prop="code"
          label="城市编码"
          width="120">
        </el-table-column>
        <el-table-column
          prop="adcode"
          label="城市区域编码"
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
        <el-table-column label="操作" width="200">
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
        <el-form-item label="城市名称" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="城市编码" :label-width="formLabelWidth">
          <el-input v-model="addForm.code" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="城市区域编码" :label-width="formLabelWidth">
          <el-input v-model="addForm.adcode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="addForm.note" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAdd = false">取 消</el-button>
        <el-button type="primary" @click="addCity">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改" v-model="showUpdate">
      <el-form :model="updateForm" label-position="left">
        <el-form-item label="城市名称" :label-width="formLabelWidth">
          <el-input v-model="updateForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="城市编码" :label-width="formLabelWidth">
          <el-input v-model="updateForm.code" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="城市区域编码" :label-width="formLabelWidth">
          <el-input v-model="updateForm.adcode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="updateForm.note" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showUpdate = false">取 消</el-button>
        <el-button type="primary" @click="handUpdateCity">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {queryCity,createCity,deleteCity,updateCity} from '../../service/getData'
  const size = 2;
  export default {
    name: 'sysCity',
    data () {
      return {
        cityData: [],
        showAdd:false,
        showUpdate:false,
        allAdcode:[],
        addForm: {
          adcode:'',
          name:'',
          code:'',
          note:''
        },
        updateForm: {
          adcode:'',
          id:'',
          name:'',
          code:'',
          note:''
        },
        formLabelWidth: '120px'
      }
    },
    mounted () {
      this.queryCityReq();
    },
    methods: {
      queryCityReq(){
        let _this = this;
        queryCity("",data=> {
          this.allAdcode = [];
          data.forEach((val,key) => {
            if (val.adcode) {
              this.allAdcode.push(val.adcode);
            }
          })
          _this.cityData = data;
        })
      },
      handleEdit(index, row) {
        this.showUpdate = !this.showUpdate;
        for (let key in this.updateForm){
          this.updateForm[key] = row[key];
        }
      },
      handUpdateCity(){
        let _this = this;
        //  console.log(this.form)
        updateCity(this.updateForm,data => {
          if(data.success){
            _this.$message({
              message: '提交成功',
              type: 'success'
            });
            _this.queryCityReq();
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
        deleteCity(param,data => {
          if(data.success){
            _this.$message({
              message: '删除成功',
              type: 'success'
            });
            _this.queryCityReq();
          }
        })
      },
      addCity(){
        let param = this.addForm;
        for (let i = 0 ; i < this.allAdcode.length; i++ ) {
          if (this.allAdcode[i] == this.addForm.adcode) {
            this.$message({
              message: 'adcode输入重复，请重新输入',
              type: 'error'
            });
            return;
          }
        }
        createCity(param,data => {
          if(data.success){
            this.cityData.unshift (data.result.userCity);
            this.allAdcode.push(data.result.userCity.adcode);
            this.$message({
              message: '提交成功',
              type: 'success'
            });
            for (let key in this.addForm){
              this.addForm[key] = '';
            }
            this.showAdd = !this.showAdd ;
          }else{
            this.$message({
              message: data.msgContent,
              type: 'warning'
            });
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
