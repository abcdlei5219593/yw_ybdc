//时间戳转换成日期无时间
export const transTimeD = function(nS) {
       // return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
        return new Date(parseInt(nS)).toLocaleString('chinese',{hour12:false}).replace(/:\d{1,2}$/,' ').split(' ')[0];
}

//时间戳转换成日期有时间
export const transTimeT = function(nS) {
       // return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
        return new Date(parseInt(nS)).toLocaleString('chinese',{hour12:false}).replace(/:\d{1,2}$/,' ');
}

//返回一周的日期
export const getWeekTime = function() {

	Date.prototype.Format = function (fmt) { //author: meizz
	    var o = {
	        "M+": this.getMonth() + 1, //月份
	        "d+": this.getDate(), //日
	        "h+": this.getHours(), //小时
	        "m+": this.getMinutes(), //分
	        "s+": this.getSeconds(), //秒
	        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
	        "S": this.getMilliseconds() //毫秒
	    };
	    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	    for (var k in o)
	    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	    return fmt;
	}
	var week = [];
	var now = new Date();
	var nowTime = now.getTime() ;
	var day = now.getDay();
	var oneDayLong = 24*60*60*1000 ;
	var MondayTime = nowTime - (day-1)*oneDayLong;

	var weekday = new Date(MondayTime);
	var param = weekday;
	    week[0] = new Date(MondayTime).Format("MM-dd");
	for(let i=1;i<7;i++){
		param = new Date((param/1000+86400)*1000);
		var t = param.Format("MM-dd");
    	week[i] = t;
	}

		console.log("week---------"+week);

	return  week;
}
//从数组对象中取LIST中的指定字段，并返回数组
export const getArrayFromArrayObj = (key,arryObj) =>{
  let arr = [];
  arryObj.forEach(function(value, index, array) {
      arr.push(value[key]);
  });
  return arr;
}
//复制对象数据，去掉冗余；
export const copyObject = (obj1,obj2) =>{
  for(let key in obj1){
    obj1[key] = obj2[key];
  }
  return obj1;
}
//js map 对象  和java差球不多
export const jj_map = ()=>{
	function JavaMap() {
		  this.obj = {};
		  this.count = 0;
		}
		JavaMap.prototype.put = function (key, value) {
		  var oldValue = this.obj[key];
		  if (oldValue == undefined) {
		    this.count++;
		  }
		  this.obj[key] = value;
		}
		JavaMap.prototype.get = function (key) {
		  return this.obj[key];
		}
		JavaMap.prototype.remove = function (key) {
		  var oldValue = this.obj[key];
		  if (oldValue != undefined) {
		    this.count--;
		    delete this.obj[key];
		  }
		}
		JavaMap.prototype.size = function () {
		  return this.count;
		}
	return new JavaMap();
}

//输入数组如[1,2]返回[周一,周二]
export const weekArray = (w)=>{
	for(let i=0;i<w.length;i++){
		if(w[i]==1){
			w[i]='周一';
		}else if(w[i]==2){
			w[i]='周二';
		}else if(w[i]==3){
			w[i]='周三';
		}else if(w[i]==4){
			w[i]='周四';
		}else if(w[i]==5){
			w[i]='周五';
		}else if(w[i]==6){
			w[i]='周六';
		}else if(w[i]==7){
			w[i]='周七';
		}
	}
	return w;
}
//输入数组如[周一,周二]返回[1,2]
export const arrayWeek = (w)=>{
	for(let i=0;i<w.length;i++){
		if(w[i]=='周一'){
			w[i]='1';
		}else if(w[i]=='周二'){
			w[i]='2';
		}else if(w[i]=='周三'){
			w[i]='3';
		}else if(w[i]=='周四'){
			w[i]='4';
		}else if(w[i]=='周五'){
			w[i]='5';
		}else if(w[i]=='周六'){
			w[i]='6';
		}else if(w[i]=='周七'){
			w[i]='7';
		}
	}
	return w;
}
export const arrayContains = (arr, obj)=>{
        var i = arr.length;
        while (i--) {
            if (arr[i] === obj) {
                return true;
            }
        }
        return false;
}
/*
  深度拷贝对象，防止被引用对象值被修改；
*/
export const deepCopy = (source) => {
var result={};
for (var key in source) {
      result[key] = source[key];
   }
   return result;
}
//数组去重
export const arrayUnique = (array) => {
  var res = [];
  var json = {};
  for(var i = 0; i < array.length; i++){
   if(!json[array[i]]){
    res.push(array[i]);
    json[array[i]] = 1;
   }
  }
  return res;
}
