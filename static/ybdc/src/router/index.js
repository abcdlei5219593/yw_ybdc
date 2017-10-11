const routers = [

      {
      path: '/task',
      component: require('../views/task/main.vue'),
      children: [

         {
           path: '', redirect:'ybdcWorkTable'
         },
         {
           path: 'ybdcSubMission',
           component: require('../views/task/SubMission.vue')
         },
         {
           path: 'ybdcWorkTable',
           component: require('../views/task/workTable.vue')
         },
         {
           path: 'ybdcRecycle',
           component: require('../views/task/Recycle.vue')
         },
         {
           path: 'ybdcBreakdown',
           component: require('../views/task/BreakDown.vue')
         },
         {
           path: 'ybdcPeople',
           component: require('../views/task/People.vue')
         },
       ]
    },
    {
      path: '/people',
      component: require('../views/people/main.vue'),
      children: [
        {
          path: '', redirect:'ybdcTaskPeople'
        },
        {
          path: 'ybdcTaskPeople',
          component: require('../views/people/taskPeople.vue')
        },
        {
          path: 'ybdcDataAnalysis',
          component: require('../views/people/dataAnalysis.vue'),
          children: [
              {
                // 当 /user/:id/profile 匹配成功，
                // UserProfile 会被渲染在 User 的 <router-view> 中
                path: 'city',
                component: require('../components/people/city.vue')

              },
             {
               // 当 /user/:id/profile 匹配成功，
               // UserProfile 会被渲染在 User 的 <router-view> 中
               path: 'group',
               component: require('../components/people/group.vue')
             },
             {
               path: '', redirect:'city'
             },
             {
               // 当 /user/:id/profile 匹配成功，
               // UserProfile 会被渲染在 User 的 <router-view> 中
               path: 'groupDetail',
               component: require('../components/people/groupDetail.vue')
             }
           ]
        }
      ]
    },

      {
        name:'ybdcLogin',
        path: '/ybdcLogin',
        component: require('../views/Login.vue')
      },

      {
        path: '/ybdcManage',component: require('../views/sys/manage.vue'),
        children:[{
          path: 'user',
          component: require('../views/sys/sysUser.vue')
         },
          {
            path: '', redirect:'user'
          },
          {
            path: 'team',
            component: require('../views/sys/sysTeam.vue')
          },
          {
            path: 'role',
            component: require('../views/sys/sysRole.vue')
          },
          {
            path: 'setMenu',
            component: require('../views/sys/sysMenu.vue')

          },
          {
            path: 'taskData',
            component: require('../views/sys/taskData.vue')
          },
          {
            path: 'profileData',
            component: require('../views/sys/profileData.vue')
          },
          {
            path: 'faultData',
            component: require('../views/sys/faultData.vue')
          },
          {
            path: 'city',
            component: require('../views/sys/city.vue')
          },
          {
            path: 'storeHouse',
            component: require('../views/sys/storeHouse.vue')
          },
        ]
      },

  {
    path: '/outsideCount',component: require('../views/outsideCount/outsideCount.vue'),
    children:[

      {
        path: '', redirect:'ybdcHome'
      },
      {
        path: 'ybdcUserE',
        component: require('../views/outsideCount/userE.vue')
    },
    {
        path: 'ybdcHome',
        component: require('../views/outsideCount/Home.vue')
    },
    {
        path: 'ybdcCapitalCount',
        component: require('../views/outsideCount/capitalCount.vue')
    },
    {
        path: 'ybdcLife',
        component: require('../views/outsideCount/Life.vue')
    },
    {
        path: 'ybdcUser',
        component: require('../views/outsideCount/User.vue')
    }]
},
{
    path: '/statistics',
    component: require('../views/statistics/main.vue'),
    children: [{
        path: '',
        redirect: 'ybdcHome'
    },
    {
        path: 'ybdcUserE',
        component: require('../views/statistics/userE.vue')
    },
    {
        path: 'ybdcHome',
        component: require('../views/statistics/Home.vue')
    },
    {
        path: 'ybdcCapitalCount',
        component: require('../views/statistics/capitalCount.vue')
    },
    {
        path: 'ybdcLife',
        component: require('../views/statistics/Life.vue')
    },
    {
        path: 'ybdcUser',
        component: require('../views/statistics/User.vue')
      }
    ]
  },
  {
      path: '/drawFencing',
      component: require('../views/drawFencing/main.vue'),
      children: [{
          path: '',
          redirect: 'draw'
      },
      {
          path: 'draw',
          component: require('../views/drawFencing/draw.vue')
      }
      ]
    },
  {
      path: '/drawFencing',
      component: require('../views/drawFencing/main.vue'),
      children: [{
          path: '',
          redirect: 'draw'
      },
      {
          path: 'draw',
          component: require('../views/drawFencing/draw.vue')
      }
      ]
    },
  {
    path: '/ybdcBicycleManage',component: require('../views/bicycleManage/main.vue'),
    children:[
      {
        path: '', redirect:'manage'
      },
      {
        path: 'manage',
        component: require('../views/bicycleManage/manage/container.vue'),
        children:[
          {
            path: '', redirect:'secondGeneration'
          },
          {
             path: 'secondGeneration',
             component: require('../views/bicycleManage/manage/secondGeneration.vue')
           },{
             path: 'thirdGeneration',
             component: require('../views/bicycleManage/manage/thirdGeneration.vue')
           }
        ]
      },
      {
        path: 'outOfStorage',
        component: require('../views/bicycleManage/outOfStorage/container.vue'),
        children:[
          {
            path: '', redirect:'inStorage'
          },
          {
             path: 'inStorage',
             component: require('../views/bicycleManage/outOfStorage/inStorage.vue')
           },
           {
             path: 'waitInStorage',
             component: require('../views/bicycleManage/outOfStorage/waitInStorage.vue')
           },
           {
             path: 'inStorageLog',
             component: require('../views/bicycleManage/outOfStorage/inStorageLog.vue')
           },
           {
             path: 'outStorageLog',
             component: require('../views/bicycleManage/outOfStorage/outStorageLog.vue')
           }
        ]
      }
    ]
  },
  {
    path: '/T3message',
    component: require('../views/T3message/main.vue'),

  children: [
  {
    path: '',
    redirect: 'noMessageBike'
  },
  {
    path: 'noMessageBike',
    component: require('../views/T3message/noMessageBike.vue')
  },
  {
    path: 'lowPowerBike',
    component: require('../views/T3message/lowPowerBike.vue')
  },
  {
    path: 'outofElectricFence',
    component: require('../views/T3message/outofElectricFence.vue')
  },
  {
      path: 'inBuildingFence',
      component: require('../views/T3message/inBuildingFence.vue')
  },
  {
      path: 'lowFrequency',
      component: require('../views/T3message/lowFrequency.vue')
  }
]
  },
    {path:'*',redirect:'/ybdcLogin'
  }
]

export default routers;
