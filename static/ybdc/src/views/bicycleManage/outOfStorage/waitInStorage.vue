<template>
<div>
    <div class='search-bar cl'>
          <div class="search-bar-grid fl">
            <label for="">城市：</label>
            <el-select class='form-input' size='small' placeholder="请选择" v-model="chooseCity">
               <el-option v-for="item in cityList" :key="item.code" :label="item.name" :value="item.code" ></el-option>
            </el-select>
          </div>
          <div class="search-bar-grid fl">
            <label for="">单车编号：</label>
            <el-input v-model="searchBikeNum" class='form-input' size='small' placeholder="请输入内容"></el-input>
          </div>
          <div class="search-bar-grid fl">
            <label for="">操作时间：</label>
            <el-date-picker v-model="time" type="daterange" size='small' placeholder="选择时间范围" @change="chooseTime" format="yyyy-MM-dd"></el-date-picker>
          </div>
          <div class="search-bar-grid-fr fr">
            <el-button type="primary" @click="search()">搜索</el-button>
          </div>
      </div>
      <br>
      <el-row class='table-content'>
        <el-table
          :data="userData"
          border
          style="width: 100%"
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="ID"
            prop="id"
            width="120">
          </el-table-column>
          <el-table-column
            prop="code"
            label="单车编号"
            width="120">
          </el-table-column>
          <el-table-column
            prop="cityName"
            label="城市">
          </el-table-column>
          <el-table-column
            prop="warehouseName"
            label="仓库">
          </el-table-column>
          <el-table-column
            prop="inTime"
            label="入库时间">
          </el-table-column>
          <el-table-column
            prop="reason"
            label="入库原因"
            show-overflow-tooltip>
          </el-table-column>
           <el-table-column
            prop="opterName"
            label="运维人员">
          </el-table-column>
          <el-table-column label="记录"  width="200">
            <template scope="scope">
              <el-button
                size="small"
                @click="checkDetail(scope.$index)"
                >查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagenation">
          <el-pagination
            @current-change = "changePage"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </el-row>

      <el-dialog title="详细信息" :visible.sync="dialogVisible" size="small">
        <div>
          <el-table :data="checkData" border style="width: 100%">
          <el-table-column
            label="ID"
            prop="num"
            width="60">
          </el-table-column>
          <el-table-column
            prop="idBicycle"
            label="单车编号"
            width="120">
          </el-table-column>
          <el-table-column
            prop="cityName"
            label="城市">
          </el-table-column>
          <el-table-column
            prop="opterName"
            label="运营人员姓名">
          </el-table-column>
          <el-table-column
            prop="created"
            label="操作时间"
            show-overflow-tooltip>
          </el-table-column>
           <el-table-column
            prop="reason"
            label="操作">
          </el-table-column>
        </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">关 闭</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>

  import {iningPagelist,getCityInWarehouse,warehouseInLookDetail} from '../../../service/getData.js'
  export default {
    name: 'waitInStorage',
    data () {
      return {
        time:'',
        startDate:'',
        endDate:'',
        dialogVisible: false,
        userData:[],
        cityList:'',
        chooseCity:'',
        searchBikeNum:'',
        checkData:'',
        currentPage:0,
        total:0,
        inPagelistParams: {
          cityCode : '',
          bicycleIdStr : '',
          startDate : '',
          endDate : '',
          pageSize : '',
          pageNow : 1
        }
      }
    },
    props:{
      "pageSize":{
        type:Number,
      }
    },
    mounted(){
        let _this = this
        //获取城市列表
        getCityInWarehouse('',data => {
          if(data.success){
            console.log(data)
            _this.cityList = data.result.result
          }else{
            this.$alert(data.msgContent)
          }
        })
        //获取列表信息
        _this.inPagelistParams.pageSize = _this.pageSize
        iningPagelist(this.inPagelistParams,data => {
          if(data.success){
            _this.total = data.result.result.rowCount
            _this.currentPage = data.result.result.pageNow
            _this.userData = data.result.result.records
          }else{
            this.$alert(data.msgContent)
          }
        })
    },
    methods: {
      search() {
        let _this = this
        _this.inPagelistParams.pageSize = _this.pageSize
        _this.inPagelistParams.cityCode = _this.chooseCity
        _this.inPagelistParams.bicycleIdStr = _this.searchBikeNum
        _this.inPagelistParams.startDate = _this.startDate
        _this.inPagelistParams.endDate = _this.endDate
        iningPagelist(this.inPagelistParams,data => {
          if(data.success){
            _this.total = data.result.result.rowCount
            _this.currentPage = data.result.result.pageNow
            _this.userData = data.result.result.records
          }else{
            this.$alert(data.msgContent)
          }
        })
      },
      changePage(pageNow){
        this.inPagelistParams.pageNow = pageNow
        this.search()
      },
      chooseTime(i){
        this.startDate = i.split(" - ")[0] + ' 00:00:00'
        this.endDate = i.split(" - ")[1] + ' 00:00:00'
      },
      checkDetail(i){
        let _this = this
        let params = {
          bicycleId: _this.userData[i].idBicycle
        }
        warehouseInLookDetail(params,data => {
          if(data.success){
            console.log(data)
            _this.checkData = data.result.result
            _this.dialogVisible = true
          }else{
            this.$alert(data.msgContent)
          }
        })
      }
    },
    components: {

    },
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

</style>
