<template>
	<el-col :span="2" class="nav" id="nav">
        <ul>
          <router-link tag="li" append to="/drawFencing/draw">绘制围栏</router-link>
        </ul>
     </el-col>
</template>
<script>
  export default {
    name: 'fencingNav',
    data(){
        return{

        }
    },
    mounted(){
      var div1 = document.getElementById('nav');
      div1.style.height= document.body.scrollHeight+'px';
    },
}
</script>
