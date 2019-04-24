/**
 *
 * 懒加载动态路由
 */
function lazy(code) {

    //return  resolve => require(["@/components/" + name + ".vue"], resolve)
    return getComponetByPath('/' + code);


}

function getComponetByPath(path) {
    for (var i = 0; i < dynamicRouter.length; i++) {
        var route = dynamicRouter[i];
        if (route.path == path) {
            return route.component;
        }
    }
}

/**
 * 路由定义
 * path跟配置里的资源标示对应,同时跟url地址对应
 */
const dynamicRouter = [
    {
        name: 'logInfomanager',
        path: '/logInfomanager',
        component: resolve => require.ensure([], () => resolve(require('@/page/systemManage/logInfomanager/index.vue')), 'logInfomanager'),
        meta: {
            title: '系统日志'
        }
    },
    {
        name: 'orgGroupManage',
        path: '/orgGroupManage',
        component: resolve => require.ensure([], () => resolve(require('@/page/systemManage/orgGroupManage/orgGroupManage.vue')), 'orgGroupManage'),
        meta: {
            title: '组织管理'
        }
    },
    {
        name: 'menuInfoManager',
        path: '/menuInfoManager',
        component: resolve => require.ensure([], () => resolve(require('@/page/systemManage/menuInfoManager/menuInfoManager.vue')), 'menuInfoManager'),
        meta: {
            title: '菜单管理'
        }
    },
    {
        name: 'tenement',
        path: '/tenement',
        component: resolve => require.ensure([], () => resolve(require('@/page/systemManage/tenement/tenement.vue')), 'tenement'),
        meta: {
            title: '租户管理'
        }
    },
    {
        name: 'ldUserInfoManager',
        path: '/ldUserInfoManager',
        component: resolve => require.ensure([], () => resolve(require('@/page/basic/ldUser/ldUserInfoManagement.vue')), 'ldUserInfoManager'),
        meta: {
            title: '内部账号管理'
        }
    },
    {
        name: 'dictionnaireManage',
        path: '/dictionnaireManage',
        component: resolve => require.ensure([], () => resolve(require('@/page/systemManage/dictionnaireManage/dictionnaireManage.vue')), 'dictionnaireManage'),
        meta: {
            title: '数据字典'
        }
    },
    {
        name: 'roleInfoManager',
        path: '/roleInfoManager',
        component: resolve => require.ensure([], () => resolve(require('@/page/systemManage/roleInfoManager/roleInfoManager.vue')), 'roleInfoManager'),
        meta: {
            title: '角色管理'
        }
    },
    {
        name: 'systemData',
        path: '/systemData',
        component: resolve => require.ensure([], () => resolve(require('@/page/systemManage/systemData/systemData.vue')), 'systemData'),
        meta: {
            title: '系统参数管理'
        }
    },
    {
        name: 'systemMap',
        path: '/systemMap',
        component: resolve => require.ensure([], () => resolve(require('@/page/basicDataManage/systemMap/systemMap.vue')), 'systemMap'),
        meta: {
            title: '系统岗位映射'
        }
    },
    {
        name: 'employeeShopRel',
        path: '/employeeShopRel',
        component: resolve => require.ensure([], () => resolve(require('@/page/basicDataManage/employeeShopRel/employeeShopRel.vue')), 'employeeShopRel'),
        meta: {
            title: '员工店铺关系'
        }
    },
    {
        name: 'plurStoreManage',
        path: '/plurStoreManage',
        component: resolve => require.ensure([], () => resolve(require('@/page/basicDataManage/plurStoreManage/plurStoreManage.vue')), 'plurStoreManage'),
        meta: {
            title: '兼职店铺关系'
        }
    },
    {
        name: 'commonPatrolTask',
        path: '/commonPatrolTask',
        component: resolve => require.ensure([], () => resolve(require('@/page/patrolTask/commonPatrolTask/commonPatrolTask.vue')), 'commonPatrolTask'),
        meta: {
            title: '常用巡店子任务'
        }
    },
    {
        name: 'commonMspTask',
        path: '/commonMspTask',
        component: resolve => require.ensure([], () => resolve(require('@/page/MSPTask/commonMspTask/commonMspTask.vue')), 'commonMspTask'),
        meta: {
            title: '常用MSP子任务'
        }
    },
    {
        name: 'commonStoreTask',
        path: '/commonStoreTask',
        component: resolve => require.ensure([], () => resolve(require('@/page/storeTask/commonStoreTask/commonStoreTask.vue')), 'commonStoreTask'),
        meta: {
            title: '常用店铺任务项'
        }
    },
    {
        name: 'storeTask',
        path: '/storeTask',
        component: resolve => require.ensure([], () => resolve(require('@/page/storeTask/storeTask/storeTask.vue')), 'storeTask'),
        meta: {
            title: '店铺任务管理'
        }
    },
    {
        name: 'trackTask',
        path: '/trackTask',
        component: resolve => require.ensure([], () => resolve(require('@/page/trackTask/trackTask/trackTask.vue')), 'trackTask'),
        meta: {
            title: '跟踪任务'
        }
    },
    {
        name: 'empCustomerRelManage',
        path: '/empCustomerRelManage',
        component: resolve => require.ensure([], () => resolve(require('@/page/basicDataManage/empCustomerRelManage/empCustomerRelManage.vue')), 'empCustomerRelManage'),
        meta: {
            title: '兼职子公司关系管理'
        }
    },
    {
        name: 'commonPatrolTaskAdd',
        path: '/commonPatrolTaskAdd',
        component: resolve => require.ensure([], () => resolve(require('@/page/patrolTask/commonPatrolTask/commonPatrolTaskAdd.vue')), 'commonPatrolTaskAdd'),
        meta: {
            title: '新增常用巡店子任务'
        }
    },
    {
        name: 'commonPatrolTaskEdit',
        path: '/commonPatrolTaskEdit',
        component: resolve => require.ensure([], () => resolve(require('@/page/patrolTask/commonPatrolTask/commonPatrolTaskEdit.vue')), 'commonPatrolTaskEdit'),
        meta: {
            title: '修改常用巡店子任务'
        }
    },
    {
        name: 'storeTaskAdd',
        path: '/storeTaskAdd',
        component: resolve => require.ensure([], () => resolve(require('@/page/storeTask/storeTask/storeTaskAdd.vue')), 'storeTaskAdd'),
        meta: {
            title: '新增店铺任务'
        }
    },
    {
        name: 'storeTaskEdit',
        path: '/storeTaskEdit',
        component: resolve => require.ensure([], () => resolve(require('@/page/storeTask/storeTask/storeTaskEdit.vue')), 'storeTaskEdit'),
        meta: {
            title: '修改店铺任务'
        }
    },
    {
        name: 'commonMspTaskList',
        path: '/commonMspTaskList',
        component: resolve => require.ensure([], () => resolve(require('@/page/MSPTask/commonMspTaskList/commonMspTaskList.vue')), 'storeTaskList'),
        meta: {
            title: 'MSP任务管理'
        }
    },
    {
        name: 'commonMspTaskListAdd',
        path: '/commonMspTaskListAdd',
        component: resolve => require.ensure([], () => resolve(require('@/page/MSPTask/commonMspTaskList/commonMspTaskListAdd.vue')), 'commonMspTaskListAdd'),
        meta: {
            title: '新增msp任务'
        }
    },
    {
        name: 'commonMspTaskListEdit',
        path: '/commonMspTaskListEdit',
        component: resolve => require.ensure([], () => resolve(require('@/page/MSPTask/commonMspTaskList/commonMspTaskListEdit.vue')), 'commonMspTaskListEdit'),
        meta: {
            title: '修改msp任务'
        }
    },
    {
        name: 'integralManage',
        path: '/integralManage',
        component: resolve => require.ensure([], () => resolve(require('@/page/systemManage/integralManage/integralManage.vue')), 'integralManage'),
        meta: {
            title: '积分管理'
        }
    },
    {
        name: 'integralRecord',
        path: '/integralRecord',
        component: resolve => require.ensure([], () => resolve(require('@/page/systemManage/integralManage/integralRecord.vue')), 'integralRecord'),
        meta: {
            title: '积分记录'
        }
    },
  {
    name: 'enterpriseEmpManager',
    path: '/enterpriseEmpManager',
    component: resolve => require.ensure([], () => resolve(require('@/page/basic/emp/enterpriseEmpInfo.vue')), 'enterpriseEmpManager'),
    meta: {
      title: '企业人员管理'
    }
  },
  {
    name: 'activityInfo',
    path: '/activityInfo',
    component: resolve => require.ensure([], () => resolve(require('@/page/basic/activity/activityInfo.vue')), 'activityInfo'),
    meta: {
      title: '园区活动管理'
    }
  },
    // {
    //   name: 'tabpage',
    //   path: '/tabpage',
    //   component: resolve => require.ensure([], () => resolve(require('@/page/tabpage/tabpage.vue')), 'tabpage'),
    //   meta: {
    //     title: '标签选项卡'
    //   }
    // },
  {
      name: 'enterprisePage',
      path: '/enterprisePage',
      component: resolve => require.ensure([], () => resolve(require('@/page/basic/enterprise/enterprisePage.vue')), 'enterprisePage'),
      meta: {
        title: '企业信息管理'
      }
  },
  {
        name: 'diningRoomInfo',
        path: '/diningRoomInfo',
        component: resolve => require.ensure([], () => resolve(require('@/page/basic/dining/diningRoomInfo.vue')), 'diningRoomInfo'),
        meta: {
          title: '餐厅信息管理'
        }
  },
  {
      name: 'diningStallInfo',
      path: '/diningStallInfo',
      component: resolve => require.ensure([], () => resolve(require('@/page/basic/dining/diningStallInfo.vue')), 'diningStallInfo'),
      meta: {
        title: '餐厅档口信息管理'
      }
  },
  {
      name: 'diningTerminalInfo',
      path: '/diningTerminalInfo',
      component: resolve => require.ensure([], () => resolve(require('@/page/basic/dining/diningTerminalInfo.vue')), 'diningTerminalInfo'),
      meta: {
        title: '档口终端设备信息管理'
      }
  },
  {
      name: 'activityScore',
      path: '/activityScore',
      component: resolve => require.ensure([], () => resolve(require('@/page/basic/activity/activityScoreInfo.vue')), 'activityScore'),
      meta: {
        title: '活动评分项管理'
      }
  },
  {
      name: 'parkLotInfo',
      path: '/parkLotInfo',
      component: resolve => require.ensure([], () => resolve(require('@/page/basic/parkLot/parkLotInfo.vue')), 'parkLotInfo'),
      meta: {
        title: '停车场信息管理'
      }
  },
  {
    name: 'activityApplyUserInfo',
    path: '/activityApplyUserInfo',
    component: resolve => require.ensure([], () => resolve(require('@/page/basic/activity/activityApplyUserInfo.vue')), 'activityApplyUserInfo'),
    meta: {
      title: '活动报名管理'
    }
  }

]
export {lazy}

