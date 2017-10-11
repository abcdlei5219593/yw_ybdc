<template>
  <div class="about">
    <el-col class="home" :span='22'>
      <div class="btn-group">
        <el-button type="primary" icon="plus" @click="showAdd=!showAdd">增加</el-button>
        <!-- <el-button type="primary" icon="edit" @click="showUpdate=!showUpdate">修改</el-button>
         <el-button type="primary" icon="delete" @click="test">删除</el-button>-->
      </div>
      <el-table
        :data="faultData"
        border
        style="width: 100%"
      >
        </el-table-column>
        <el-table-column
          label="故障类型"
          prop="name"
          width="120">
        </el-table-column>
        <el-table-column
          prop="code"
          label="故障编码"
          width="120">
        </el-table-column>
        <el-table-column
          prop="priority"
          label="优先级"
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
        <el-form-item label="故障类型" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="故障编码" :label-width="formLabelWidth">
          <el-input v-model="addForm.code" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="优先级" :label-width="formLabelWidth">
          <el-input  type="priority" placeholder="请输入0-99之间的数字" min='0' max = '99' v-model="addForm.priority" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAdd = false">取 消</el-button>
        <el-button type="primary" @click="addFault">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改" v-model="showUpdate">
      <el-form :model="updateForm" label-position="left">
      <el-form-item label="故障类型" :label-width="formLabelWidth">
        <el-input v-model="updateForm.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="故障编码" :label-width="formLabelWidth">
        <el-input  v-model="updateForm.code" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="优先级" :label-width="formLabelWidth">
        <el-input  type="priority" placeholder="请输入0-99之间的数字" min='0' max = '99' v-model="updateForm.priority" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showUpdate = false">取 消</el-button>
        <el-button type="primary" @click="updateFault">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {createFault,queryFault,deleteFault,updateFault} from '../../service/getData'
  const size = 2;
  export default {
    name: 'sysRole',
    data () {
      return {
        faultData: [],
        showAdd:false,
        showUpdate:false,
        addForm: {
          name:'',
          code:'',
          priority:''
        },
        updateForm: {
          id:'',
          name:'',
          code:'',
          priority:''
        },
        formLabelWidth: '120px'
      }
    },
    mounted () {
      this.queryFaultReq();
    },
    methods: {
      queryFaultReq(){
        let _this = this;
        queryFault("",data=> {
          _this.faultData = data;
        })
      },
      handleEdit(index, row) {
        this.showUpdate = !this.showUpdate;
        for (let key in this.updateForm){
          this.updateForm[key] = row[key];
        }
      },
      updateFault(){
        let _this = this;
        //  console.log(this.form)
        updateFault(this.updateForm,data => {
          if(data.success){
            _this.$message({
              message: '提交成功',
              type: 'success'
            });
            _this.queryFaultReq();
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
        deleteFault(param,data => {
          if(data.success){
            _this.$message({
              message: '删除成功',
              type: 'success'
            });
            _this.queryFaultReq();
          }
        })
      },
      addFault(){
        let _this = this;
        let param = _this.addForm;
        createFault(param,data => {
          if(data.success){
            _this.faultData.unshift (data.result.malfunctionType);
            _this.$message({
              message: '提交成功',
              type: 'success'
            });
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
