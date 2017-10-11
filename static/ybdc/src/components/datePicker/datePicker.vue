<template>
    <div>
      <label>按月查询：</label>
      <el-date-picker
       v-model="selectOption1"
       align="right"
       type="month"
       placeholder="选择日期"
       @change ='slectDate'>
     </el-date-picker>
     <label style='margin-left:20px;'>按年查询：</label>
     <el-date-picker
      v-model="selectOption2"
      align="right"
      type="year"
      placeholder="选择年份"
      :picker-options="pickerOptions0"
       @change ='slectDate'>
    </el-date-picker>
    </div>

</template>
<script>

export default {
  name: 'datePicker',
  data(){
    return {
      pickerOptions0: {
       disabledDate(time) {
         const timestramp = 1451577600000;//2016年零晨时间戳;
         return time.getTime() < timestramp;  //返回小于设定时间戳的时间为禁用;
       }
     },
      selectOption1:'',
      selectOption2:''
    }
  },
  mounted (){
     this.selectOption1 = this.getMonth();
      this.$emit("sendDateFromChild",this.selectOption1)
  },
  methods:{
    getMonth(){
      let d = new Date();
      return d.getFullYear()+"-"+(d.getMonth()+1);
    },
    slectDate(date){
      this.$emit("sendDateFromChild",date)
    }
    // changeMonth(date){
    // //  alert(date)
    // }
  },

}
</script>
