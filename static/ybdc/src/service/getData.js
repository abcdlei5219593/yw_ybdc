import axios from 'axios'
import {thisVue} from '../main'
//import $ from 'jquery'
var qs = require('qs');
/**
 * 基本请求start
 */

//export const baseUrl = '';
//export const baseUrl = 'http://121.42.255.118:9090';
//export const baseUrl = 'http://localhost:9660';
//export const baseUrl = 'http://101.201.55.128:9660';s
// export const baseUrl = 'http://192.168.1.38:9660'; // 嗡嗡第一帅IP
// export const baseUrl = 'http://192.168.1.91:9660'; // 小燕IP
// export const baseUrl = 'http://192.168.1.218:9660'; // tj第一帅IP
export const baseUrl = 'http://yw.1bgx.com'; //正式库
//export const baseUrl = 'http://139.196.92.86:9660';
//export const baseUrl = '';
 //export const baseUrl = 'http://139.196.92.86:9660'


export const userLogin = (param,callback) => requestOption("/login", param,callback)
export const userLoginOut = (param,callback) => requestOption("/logout", param,callback);
// $.ajaxSettings.traditional = true // AJAX参数深度序列化
// 	//AJAX跨域携带COOKIE设置
//   $.ajaxSetup({
//   	xhrFields:{
//   		withCredentials: true
//   	}
//   })

// axios 请求通用头信息设置
const headerOption =
  {
    headers: {
     'Content-Type': 'application/x-www-form-urlencoded',
    },
    withCredentials: true, //异步请求携带COOKIE
  };

/*
*  单个axios请求的封装参数
* @param url:请求地址
* @param param : 请求携带的JSON参数
* @param callback : 请求成功回调函数；
* */
let errorTime = 0; //请求报错次数
function requestOption (url,param,callback) {
  axios.post(baseUrl+""+url,qs.stringify(param),headerOption).then( res => {
    let data = res.data;
    if (data.msgCode &&data.msgCode == '520' && errorTime == 0) {  // 多次异步请求报错时，只走一次报错逻辑；防止多次弹窗
      errorTime++;
      thisVue.$alert("登录状态失效，请重新登录");
      thisVue._router.push('login')
    }else {
        errorTime = 0;
        callback(res.data);
    }

  }).catch (res => {
    //thisVue._router.push('login')
  })
}

/*
 *  两个聚合axiou请求的异步封装参数
 * @param url_1:请求地址1
 * @param url_2:请求地址2
 * @param param_1 : 请求1携带的JSON参数
 * @param param_2: 请求2携带的JSON参数
 * @param callback : 请求成功回调函数；
 * */
function allRequestOption(url_1,url_2,param_1,param_2,callback) {
  axios.all([
            axios.post(baseUrl+''+url_1,qs.stringify(param_1),headerOption),
            axios.post(baseUrl+''+url_2,qs.stringify(param_2),headerOption)
          ]).then(  axios.spread( (acct, perms) => {
            callback(acct, perms);
          })).catch (res => {
            //  thisVue._router.push('login')
          })

}
export const getAllBicycle = (param,callback) =>  requestOption("/Count/getAllBicycle", param,callback)

export const getUnlockingAll = (param,callback) =>requestOption("/Count/getUnlockingAll", param,callback);
export const getLockingAll = (param,callback) =>requestOption("/Count/getLockingAll", param,callback);
export const getDisappear = (param,callback) =>requestOption("/Count/getDisappear", param,callback);
export const durationAll = (param,callback) =>requestOption("/Count/duration_all", param,callback);
export const userStatisticsNumber = (param,callback) =>requestOption("/userStatistics/number",param,callback);
export const userStatisticsQueryUserUsageHabits = (param,callback) =>requestOption("/userStatistics/queryUserUsageHabits",param,callback);
export const userStatisticsQueryTNORADU = (param,callback) =>requestOption("/userStatistics/queryTNORADU",param,callback);
export const userStatisticsQueryUserFunds = (param,callback) =>requestOption("/userStatistics/queryUserFunds",param,callback);
export const userStatisticsQueryUserTrip = (param,callback) =>requestOption("/userStatistics/queryUserTrip",param,callback);
export const distance = (param,callback) =>requestOption("/Count/getBicycletotal",param,callback);
export const ridingTime = (param,callback) =>requestOption("/Count/getBicycleMin",param,callback);
export const getRidingPrice = (param,callback) =>requestOption("/Count/getRidingPrice",param,callback);
export const getRidingPriceByTimes = (param,callback) =>requestOption("/Count/getRidingPriceByTimes",param,callback);
export const countBicycle = (param,callback) =>requestOption("/Count/countBicycle",param,callback);
export const countOk = (param,callback) =>requestOption("/Count/countOk",param,callback);
export const countNoOk = (param,callback) =>requestOption("/Count/countNoOk",param,callback);
export const sumMin = (param,callback) =>requestOption("/Count/sumMin",param,callback);
export const count_ci = (param,callback) =>requestOption("/Count/count_ci",param,callback);
export const countUser = (param,callback) =>requestOption("/Count/countUser",param,callback);
export const countTotal = (param,callback) =>requestOption("/Count/countTotal",param,callback);
export const countUserDeposit = (param,callback) =>requestOption("/Count/countUserDeposit",param,callback);
export const countDeposit = (param,callback) =>requestOption("/Count/countDeposit",param,callback);

/**
 * 统计图end
 */

/**
 * 任务start
 */
export const queryTaskGroupList = (param,callback) =>requestOption("/task/queryTaskGroupListToYw",param,callback);
export const queryTaskTypes = (param,callback) =>requestOption("/task/queryTaskTypes",param,callback);
export const queryTaskSources = (param,callback) =>requestOption("/task/queryTaskSources",param,callback);
export const queryRecoverReasons = (param,callback) =>requestOption("/task/queryRecoverReasons",param,callback);
export const queryMalfunctionTypes = (param,callback) =>requestOption("/task/queryMalfunctionTypes",param,callback);
export const createTaskGroup = (param,callback) =>requestOption("/task/createTaskGroupFromBaiDuMap",param,callback);
export const getTeams = (param,callback) =>requestOption("/task/getTeams",param,callback);
export const findAllUser = (param,callback) =>requestOption("/user/findAll",param,callback);
export const taskQueryWorkTables = (param,callback) =>requestOption("/task/queryWorkTables",param,callback);
export const queryTaskFiles = (param,callback) =>requestOption("/file/queryTaskFiles",param,callback);
export const findUserById = (param,callback) => requestOption("/user/findUserById",callback)
export const findUserByIds = (param,callback) => requestOption("/user/findUserByIds",callback)
/**
 * 任务end
 */

/**
 * 这里是地图部份start
 */
export const getAllEntityName = (param,callback) =>requestOption("/baidu/getAllEntityName",param,callback);
export const gethistoryTrack = (param,callback) =>requestOption("/baidu/gethistoryTrack",param,callback);
export const getBicylceStatus = (param,callback) =>requestOption("/bicylceMap/getbicylce",param,callback);
export const addTaskTimer = (param,callback) =>requestOption("/task/addTaskTimer",param,callback);
export const getTaskTimer = (param,callback) =>requestOption("/task/getTaskTimer",param,callback);
export const deleteTaskTimer = (param,callback) =>requestOption("/task/deleteTaskTimer",param,callback);
export const updateTaskTimer = (param,callback) =>requestOption("/task/updateTaskTimer",param,callback);
export const getAllPolygon = (param,callback) => requestOption("/polygon/getAllPolygonByCityId",param,callback);
export const getAllcoordinate = (param,callback) => requestOption("/polygon/getAllcoordinate",param,callback);
export const getAllBicycles = (param,callback) =>requestOption("/Count/getAllBicycles",param,callback);

/**
 * 这里是地图部份end
 */

/*
* 系统管理部分API start
* */
export const creatUser = (param,callback) =>requestOption("/user/create",param,callback);
export const queryAllUser = (param,callback) =>requestOption("/user/findAll",param,callback);
export const queryUser = (param,callback) =>requestOption("/user/query",param,callback);
export const deleteUser = (param,callback) =>requestOption("/user/delete",param,callback);
export const updateUser = (param,callback) =>requestOption("/user/update",param,callback);
export const findWarehouseManagers = (param,callback) =>requestOption("/user/findWarehouseManagers",param,callback);
export const setUserCities = (param,callback) =>requestOption("/user/setUserCities",param,callback);
export const setRoles = (param,callback) =>requestOption("/user/setRoles",param,callback);

export const queryRole = (param,callback) =>requestOption("/role/query",param,callback);
export const createRole = (param,callback) =>requestOption("/role/create",param,callback);
export const deleteRole = (param,callback) =>requestOption("/role/delete",param,callback);
export const updateRole = (param,callback) =>requestOption("/role/update",param,callback);
export const setRoleMenu = (param,callback) =>requestOption("/role/setRoleMenu",param,callback);

export const queryFileTypes = (param,callback) =>requestOption("/fileType/queryFileTypes",param,callback);
export const createFileTypes = (param,callback) =>requestOption("/fileType/create",param,callback);
export const deleteFileTypes = (param,callback) =>requestOption("/fileType/delete",param,callback);
export const updateFileTypes = (param,callback) =>requestOption("/fileType/update",param,callback);

export const queryCity = (param,callback) =>requestOption("/userCity/query",param,callback);
export const createCity = (param,callback) =>requestOption("/userCity/create",param,callback);
export const deleteCity = (param,callback) =>requestOption("/userCity/delete",param,callback);
export const updateCity = (param,callback) =>requestOption("/userCity/update",param,callback);

export const queryWarehouse = (param,callback) =>requestOption("/warehouse/query",param,callback);
export const createWarehouse = (param,callback) =>requestOption("/warehouse/create",param,callback);
export const deleteWarehouse = (param,callback) =>requestOption("/warehouse/delete",param,callback);
export const updateWarehouse = (param,callback) =>requestOption("/warehouse/update",param,callback);

export const setWarehouseManager = (param,callback) => requestOption("/warehouse/setManagers",param,callback);
export const setWarehouseCity = (param,callback) =>requestOption("/warehouse//setCity",param,callback);


export const queryFault = (param,callback) =>requestOption("/malfunctionType/query",param,callback);
export const createFault = (param,callback) =>requestOption("/malfunctionType/create",param,callback);
export const deleteFault = (param,callback) =>requestOption("/malfunctionType/delete",param,callback);
export const updateFault = (param,callback) =>requestOption("/malfunctionType/update",param,callback);

export const queryTeam = (param,callback) =>requestOption("/team/query",param,callback);
export const createTeam = (param,callback) =>requestOption("/team/create",param,callback);
export const deleteTeam = (param,callback) =>requestOption("/team/delete",param,callback);
export const updateTeam = (param,callback) =>requestOption("/team/update",param,callback);
export const setLeader = (param,callback) =>requestOption("/team/setLeader",param,callback);
export const addMembers = (param,callback) =>requestOption("/team/addMembers",param,callback);
export const removeMembers = (param,callback) =>requestOption("/team/removeMembers",param,callback)
export const setTeamCity = (param,callback) =>requestOption("/team/setCity",param,callback);
//export const findCityManagerAndOperationMaintenancerByCity = (param,callback) =>requestOption("/open/findCityManagerAndOperationMaintenancerByCity.ext",param,callback)
export const findOperationMaintenancerByCity = (param,callback) =>requestOption("/open/findOperationMaintenancerByCityId.ext",param,callback)
export const getByRoleCodeAndCityCode = (param,callback) =>requestOption("/open/getByRoleCodeAndCityCode",param,callback);
//export const queryMembers = (param,callback) =>requestOption("/user/findAll",param,callback);
export const findOnlineUser = (param_1,param_2,callback) => allRequestOption("/baidu/getAllEntityName","/open/findOperationMaintenancerByCityId.ext",param_1,param_2,callback)
// axios.all([
//             axios.post(baseUrl+"/baidu/getAllEntityName",param_1),
//             axios.post(baseUrl+"/open/findOperationMaintenancerByCityId.ext?userCityId="+param_2)
//           ]);

export const queryMenu = (param,callback) =>requestOption("/menu/query",param,callback);
export const createMenu = (param,callback) =>requestOption("/menu/create",param,callback);
export const deleteMenu = (param,callback) =>requestOption("/menu/delete",param,callback);
export const updateMenu = (param,callback) =>requestOption("/menu/update",param,callback);
export const findParentMenu = (param,callback) =>requestOption("/menu/findParentMenuByChildrenLevel",param,callback);



/*
* 系统管理部分API end
* */

/*
* 资金存量统计API
*/
export const getPreDepositChangeCharts = (param_1,param_2,callback) => allRequestOption("/Count/queryHistoryPic","/Count/queryHistoryPic",param_1,param_2,callback)
// axios.all([
//                                                         axios.post(baseUrl+"/Count/queryHistoryPic?cityCode="+cityCode+"&batch=1&type=10"),
//                                                         axios.post(baseUrl+"/Count/queryHistoryPic?cityCode="+cityCode+"&batch=2&type=10")
//                                                       ]);

export const getDepositChangeCharts = (param,callback) => requestOption("/capital/getDepositChangeCharts",param,callback); // 押金变化统计图
export const getPreDeposit = (param,callback) => requestOption("/capital/getPreDeposit",param,callback);  // 今日预存押金和 较昨日预存押金比
export const getWithdrawalsAmount = (param,callback) => requestOption("/capital/getWithdrawalsAmount",param,callback); // 今日提现金额 和 较昨日提现金额比
export const getCurrentCumulativeDepositAmount = (param,callback) => requestOption("/capital/getCurrentCumulativeDepositAmount",param,callback); // 当前累计押金金额 和较上周累计押金金额比
//export const getPreDepositChangeCharts = (param,callback) => requestOption("/capital/getPreDepositChangeCharts",param); // 预存变化统计图
export const getPreDepositFare = (param,callback) => requestOption("/capital/getPreDepositFare",param,callback); // 今日预存车费和较昨日预存车费比
export const getResumeAmount = (param,callback) => requestOption("/capital/getResumeAmount",param,callback); // 今日消费金额和较昨日消费金额比
export const getCumulativePreDeposit = (param,callback) => requestOption("/capital/getCumulativePreDeposit",param,callback); // 当前累计预存金额和较上周累计预存金额比

export const getTodayGive = (param,callback) => requestOption("/capital/getTodayGive",param,callback); // 今日赠送（当前总赠送和昨日赠送比，充值赠送，活动赠送，其他赠送,销账赠送）
export const getCumulativeGive = (param,callback) => requestOption("/capital/getCumulativeGive",param,callback); // 累计赠送（当前总赠送和上周赠送比，充值赠送，活动赠送，其他赠送,销账赠送）
export const getGiveChangeCharts = (param,callback) => requestOption("/capital/getGiveChangeCharts",param,callback); // 赠送变化统计图

/*
* 人员数据分析API
*/

export const getCity = (param,callback) => requestOption("/PersonCount/City",param,callback); // 获取城市数据

export const singleDayUser = (param,callback) => requestOption("/Count/singleDayUser",param,callback); // 单日用户
export const queryTeamUser = (param,callback) => requestOption("/PersonCount/queryTeamUser",param,callback);

export const cumulativeUserNumber = (param,callback) => requestOption("/Count/cumulativeUserNumber",param,callback); //

export const depositUserCharts = (param,callback) => requestOption("/Count/depositUserCharts",param,callback); //

/*
* 用户使用统计API
*/
export const getDailyTrendRideCountChart = (param,callback) => requestOption("/Count/getDailyTrendRideCountChart",param,callback); // 日趋势图 骑行次数
export const getDailyTrendRideLongTimeChart = (param,callback) => requestOption("/Count/getDailyTrendRideLongTimeChart",param,callback); // 日趋势图 骑行时长
export const getDailyTrendCreateAmountChart = (param,callback) => requestOption("/Count/getDailyTrendCreateAmountChart",param,callback); // 日趋势图 创造金额
export const getTodayPayAndFreeAndAmount = (param,callback) => requestOption("/Count/getTodayPayAndFreeAndAmount",param,callback); // 日趋势图  的今日付费骑行，今日付费骑行，今日创造总金额
export const getUserBehaviorData = (param,callback) => requestOption("/Count/getUserBehaviorData",param,callback); // 用户行为数据
export const getUserBehaviorCount = (param,callback) => requestOption("/Count/getUserBehaviorCount",param,callback); // 用户行为 骑行次数
export const getUserBehaviorTime = (param,callback) => requestOption("/Count/getUserBehaviorTime",param,callback); // 用户行为 骑行时长
export const getRideCountCharts = (param,callback) => requestOption("/Count/getRideCountCharts",param,callback); // 骑行次数分布情况统计图
export const getCreateAmount = (param,callback) => requestOption("/Count/getCreateAmount",param,callback); // 创造金额

/*
* 数据分析API
*/
export const queryTeamDetail = (param,callback) => requestOption("/PersonCount/queryTeamDetail",param,callback); //
export const queryTeamTask = (param,callback) => requestOption("/PersonCount/queryTeamTask",param,callback); // 查询团队任务

/*
* 车辆骑行统计API
*/

// 查询车辆骑行图表数据；type:1(使用率); type:2(日均频次)
// batch=2(二代车); batch=3(三代车)
export const queryHistoryData = (param_1,param_2,callback) => allRequestOption("/Count/queryHistoryPic","/Count/queryHistoryPic",param_1,param_2,callback)
// axios.all([
//                                                         axios.post(baseUrl+"/Count/queryHistoryPic?cityCode="+cityCode+"&batch=2&type="+type),
//                                                         axios.post(baseUrl+"/Count/queryHistoryPic?cityCode="+cityCode+"&batch=3&type="+type)
//                                                       ]);
export const queryHistoryDataForThree = (param,callback) => requestOption("/Count/queryHistoryPic",param,callback)
    //requestOption("/Count/queryHistoryPic?cityCode="+cityCode+"&batch=3&type="+type,callback);
export const getRideRateCharts = (param,callback) => requestOption("/Count/getRideRateChartsByMonth",param,callback)
//      requestOption("/Count/getRideRateChartsByMonth?cityCode="+cityCode+"&startDate="+startDate,callback); //  骑行率统计 使用率图

export const getRideStatistics = (param,callback) => requestOption("/Count/getRideStatistics",param,callback); // 骑行率统计
export const getDailyFrequency = (param,callback) => requestOption("/Count/getDailyFrequency",param,callback); // 日均频次
export const getDistributionStatisticsData = (param,callback) => requestOption("/Count/getDistributionStatisticsData",param,callback); // 分布统计数据
export const getAveragePerDayFrequency = (param,callback) => requestOption("/Count/getAveragePerDayFrequency?cityCode="+cityCode+"&startDate="+startDate,callback); // 骑行率统计 日均频次
export const getBicycleCountCharts = (param,callback) => requestOption("/Count/getBicycleCountCharts",param,callback); // 获取分布统计 骑行次数
export const getBicycleTimeCharts = (param,callback) => requestOption("/Count/getBicycleTimeCharts",param,callback); // 获取分布统计 骑行时间
export const getBicycleCreateAmount = (param,callback) => requestOption("/Count/getBicycleCreateAmount",param,callback); // 分布统计 创造金额
export const getBicycleRideTimeCharts = (param,callback) => requestOption("/Count/getBicycleRideTimeCharts",param,callback); // 骑行时长分布情况统计图
export const getCreateProfitCharts = (param,callback) => requestOption("/Count/getCreateProfitCharts",param,callback); // 创造收益分布统计图

export const getIdleRate = (param,callback) => requestOption("/Count/getIdleRate",param,callback); // 昨日22：00 - 今日7：00闲置率 今日7：00 - 今日22：00闲置率



export const bicycleDist = (param,callback) => requestOption("/fakeData/bicycleDist",param,callback); //  骑行率统计 使用率图
export const bicycleCyclingPic = (param,callback) => requestOption("/fakeData/bicycleCyclingPic",param,callback); // 骑行率统计
export const bicycleCycling = (param,callback) => requestOption("/fakeData/bicycleCycling",param,callback); // 日均频次
export const customerUse = (param,callback) => requestOption("/fakeData/customerUse",param,callback); // 分布统计数据
export const customerUsePic = (param,callback) => requestOption("/fakeData/customerUsePic",param,callback); // 骑行率统计 日均频次
export const customerMemory = (param,callback) => requestOption("/fakeData/customerMemory",param,callback); // 获取分布统计 骑行次数
export const customerMemoryPic = (param,callback) => requestOption("/fakeData/customerMemoryPic",param,callback); // 获取分布统计 骑行时间
export const fundMemory = (param,callback) => requestOption("/fakeData/fundMemory",param,callback); // 分布统计 创造金额
export const fundMemoryPic = (param,callback) => requestOption("/fakeData/fundMemoryPic",param,callback); // 骑行时长分布情况统计图

export const getData = (param,callback) => requestOption("/data/get",param,callback); // 统计2（你懂的）获取数据通用接口；
export const getPic = (param,callback) => requestOption("/data/getPic",param,callback); // 统计2（你懂的）获取图表信息通用接口；

/*
* T3报文
*/
export const getBikeInfo = (param,callback) =>requestOption("/packetlog/findUnreport",param,callback); // 昨日未通信车辆
export const getBikeStatics = (param,callback) =>requestOption("/packetlog/statistics",param,callback); // 昨日未通信车辆统计
export const getAllUnreport = (param,callback) =>requestOption("/packetlog/findAllUnreport",param,callback); // 所有未通信车辆
export const getlowBattery = (param,callback) =>requestOption("/bicycle/lowBattery",param,callback); // 低电量车辆信息
export const getAllLowBattery = (param,callback) =>requestOption("/bicycle/allLowBattery",param,callback); // 所有低电量


/*
  单车管理模块API

*/
export const addBicycle = (batch,param,callback) =>requestOption("/bicycle/manage/add/"+batch,param,callback); // 添加车辆; @batch = 2 二代车, @batch = 3 三代车
export const editBicycle = (param,callback) =>requestOption("/bicycle/manage/edit",param,callback); // 编辑修改车辆详情
export const getBicycleByPagenation = (batch,param,callback) =>requestOption("/bicycle/manage/pagelist/"+batch,param,callback); // 分页查询
export const fileUpload = (batch,param,callback) =>requestOption("/bicycle/manage/fileUpload/"+batch,param,callback); // 批量上传; @batch = 2 二代车, @batch = 3 三代车
export const excelExport = (batch,param,callback) =>requestOption("/bicycle/manage/excelExport/"+batch,param,callback); // 批量导出; @batch = 2 二代车, @batch = 3 三代车
export const updateToAnchor = (param,callback) =>requestOption("/bicycle/manage/updateToAnchor",param,callback); // 编辑修改车辆详情
export const checkCode = (param,callback) =>requestOption("/bicycle/manage/checkCodeUnique",param,callback); // 检查单车编码是否唯一
export const relieveAnchor = (param,callback) =>requestOption("/bicycle/manage/relieveAnchor",param,callback); // 解除锚定
export const lockingAnchor = (param,callback) =>requestOption("/bicycle/manage/lockingAnchor",param,callback); // 锚定
export const bicycleAlarm = (param,callback) =>requestOption("/bicycle/manage/bicycleAlarm",param,callback); // 告警
export const checkMacUnique = (param,callback) =>requestOption("/bicycle/manage/checkMacUnique",param,callback); // 检查MAC地址是否唯一

export const getBicycleWarehouse = (param,callback) =>requestOption("/outInWarehose/inPagelist",param,callback); // 出入库获取列表信息
export const getCityInWarehouse = (callback) =>requestOption("/outInWarehose/getAllCity",callback); // 出入库获取城市
export const warehouseInLookDetail = (param,callback) =>requestOption("/outInWarehose/inLookDetail",param,callback); // 出入库查看详细
export const iningPagelist = (param,callback) =>requestOption("/outInWarehose/iningPagelist",param,callback); // 待入库列表信息
export const inLog = (param,callback) =>requestOption("/outInWarehose/InLog",param,callback); // 出入库日志
export const outLog = (param,callback) =>requestOption("/outInWarehose/OutLog",param,callback); // 出入库日志

/*
* 电子围栏车辆统计；
*/
export const findBannedBicycles = (param,callback) =>requestOption("/bicycle/findBannedBicycles",param,callback); // 电子围栏车辆统计

export const findBicycleLastLockedTime = (param,callback) =>requestOption("/bicycle/findLowFrequencyBicycle",param,callback); // 低频车辆统计
export const queryAllStatusBike = (param_1,param_2,callback) => allRequestOption("/Count/getAllBicycles","/findBicycleNotRecover",param_1,param_2,callback)
// axios.all([
//                                                         axios.post(baseUrl+"/Count/getAllBicycles",param),
//                                                         axios.post(baseUrl+"/findBicycleNotRecover",param)
//                                                       ]);
export const findBicycleNotRecover = (param,callback) => requestOption("/findBicycleNotRecover",param,callback); // 显示回收车辆


export const getAlamBicylce = (param,callback) =>requestOption("/warnBicycle/getAlamBicylce",param,callback); //获取告警车辆


//电子围栏

export const addFencing = (param,callback) =>requestOption("/polygon/add_p",param,callback); //
export const addC = (param,callback) =>requestOption("/polygon/add_c",param,callback); //
export const deletepp = (param,callback) =>requestOption("/polygon/deletepp",param,callback); //
