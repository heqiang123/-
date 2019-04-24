import axios from 'axios'
import baseURL from '../plugins/ipConfig'
import qs from 'qs'
import router from '../router'

// axios 配置
axios.defaults.timeout = 100000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// POST传参序列化 拦截
axios.interceptors.request.use((config) => {
    let token = sessionStorage.getItem('token')
    if (config.method === 'post' && !config.url.endsWith('file/excelFileUpload')) {
        config.data = qs.stringify(config.data)
    } else {
        config.data = config.data
    }
    if (config.method === 'get') {
        config.url += '?timestamp=' + Date.now()
    }
    // 判断是否存在token，如果存在的话，则每个http header都加上token
    if (token) {
        config.headers['token'] = token
    }
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
    return config
}, (error) => {
    return Promise.reject(error)
})

// 返回状态判断
axios.interceptors.response.use((res) => {
    let token = sessionStorage.getItem('token')
    if (!res) {
        return Promise.reject(res)
    }
    console.log(token)
    if (res.data.code == 3 || res.data.code == 10 || res.data.code == 2) {
        setTimeout(function () {
            sessionStorage.removeItem('token')
            router.push({
                path: '/login'
            })
        }, 1000)
    }
    if (token && res.data.code == 0) {
        sessionStorage.setItem('token', res.data.token)
    }
    return res
}, (error) => {
    return Promise.reject(error)
})

// 获取数据
export function fetchData(url, params, method = 'get', ContentType) {
    return new Promise((resolve, reject) => {
        let config = {
            method: method,
            url: url
        }
        if (ContentType) {
            axios.defaults.headers.post['Content-Type'] = ''
        }
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
        method === 'get' ? config.params = params : config.data = params
        axios(config)
            .then(response => {
                if (response.data.state !== 200) {
                    if (response.data.msg) {
                    }
                }
                resolve(response.data)
            }, err => {
                console.log(err)
            })
            .catch((error) => {
                console.log(error)
            })
    })
}

export function codeData(url, params, method = 'get', ContentType) {
    return new Promise((resolve, reject) => {
        let config = {
            method: method,
            url: url,
            responseType: 'arraybuffer'
        }
        if (ContentType) {
            axios.defaults.headers.post['Content-Type'] = ''
        }
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
        method === 'get' ? config.params = params : config.data = params
        axios(config)
            .then(response => {
                if (response.data.state !== 200) {
                    if (response.data.msg) {
                    }
                }
                resolve(response.data)
            }, err => {
                console.log(err)
            })
            .catch((error) => {
                console.log(error)
            })
    })
}

export function loginData(url, params, method = 'get', ContentType) {
    return new Promise((resolve, reject) => {
        let config = {
            method: method,
            url: url
        }
        if (ContentType) {
            axios.defaults.headers.post['Content-Type'] = ''
        }
        axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
        method === 'get' ? config.params = params : config.data = params
        if (params.isLogin) {
            config.url += '?uuid=' + params.uuid + '&validateCode=' + params.validateCode
        }
        axios(config)
            .then(response => {
                if (response.data.state !== 200) {
                    if (response.data.msg) {
                    }
                }
                resolve(response.data)
            }, err => {
                console.log(err)
            })
            .catch((error) => {
                console.log(error)
            })
    })
}

export default {
    //登录
    login(params) {
        return loginData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/user/login', params, 'post')
    },
    //登录获取验证码
    getValidateCode(params) {
        return codeData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/validateCode/getValidateCode', params)
    },
    //登录获取菜单
    getMenus(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/user/menus', params, 'post')
    },
    //登录获取菜单
    getTreeMenus(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/syspermission/getMenuTree', params, 'post')
    },
    //新增菜单
    addTreeMenus(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/syspermission/addSave', params, 'post')
    },
    //修改菜单
    modifyTreeMenus(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/syspermission/editSave', params, 'post')
    },
    //删除菜单
    deleteTreeMenus(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/syspermission/deleteData', params, 'post')
    },
    //租户列表
    getTenementList(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/tenement/findPage', params)
    },
    //新增租户
    addTenement(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/tenement/addSave', params, 'post')
    },
    //租户查询详情
    getTenementDetail(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/tenement/getDetails', params)
    },
    //修改租户信息
    modifyTenement(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/tenement/editSave', params, 'post')
    },
    //批量修改租户状态
    modifyTenementStatus(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/tenement/modifyStatus', params, 'post')
    },
    //删除租户
    deleteTenement(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/tenement/deleteData', params, 'post')
    },
    //用户列表
    getUserList(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/user/findPage', params)
    },
    //内部账号列表
    getLdUserList(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/user/findLdUserPage', params)
    },
    //重置密码
    resetPwd(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/user/resetPwd', params, 'post')
    },
    //新增用户
    addSaveUser(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/user/addSaveUser', params, 'post')
    },
    //用户详情
    getUserDetails(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/user/getDetails', params)
    },
    //修改用户信息
    editSaveUser(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/user/editSaveUser', params, 'post')
    },
    //修改用户状态
    modifyUserStatus(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/user/modifyStatus', params, 'post')
    },
    //修改用户对应角色
    updateUserRole(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/user/updateUserRole', params, 'post')
    },
    //查找组织树
    findGroupAndUser(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/user/findGroupAndUser', params)
    },
    //删除用户
    deleteUser(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/user/deleteData', params, 'post')
    },
    //数据字典
    getDictionnaire(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/dictionnaire/findPage', params)
    },
    //新增数据字典
    addDictionnaire(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/dictionnaire/addDictionnaire', params, 'post')
    },
    //修改字典信息
    modifyDictionnaire(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/dictionnaire/modifyDictionnaire', params, 'post')
    },
    //修改字典状态
    modifyDictionnaireStatus(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/dictionnaire/modifyDictionnaireStatus', params, 'post')
    },
    //批量删除字典数据
    deleteDictionnaire(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/dictionnaire/deleteData', params, 'post')
    },
    //获取字典,明细列表
    queryDictListById(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/dictionnaire/queryListById', params)
    },
    //新增字典明细
    addDictById(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/dictionnaire/addById', params, 'post')
    },
    //修改字典明细
    modifyDictDdetail(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/dictionnaire/modifyDdetail', params, 'post')
    },
    //修改字典明细状态
    modifyDdetailStatus(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/dictionnaire/modifyDdetailStatus', params, 'post')
    },
    //删除字典明细
    deleteDictdetailData(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/dictionnaire/deleteDetailData', params, 'post')
    },
    //角色列表
    getRoleList(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/role/findPage', params)
    },
    //新增角色
    addRole(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/role/addRole', params, 'post')
    },
    //查询角色详情
    getRoleDetails(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/role/getDetails', params)
    },
    //修改角色信息
    modifyRole(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/role/modifyRole', params, 'post')
    },
    //保存角色对应菜单关系接口
    updateRolePermission(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/role/updateRolePermission', params, 'post')
    },
    //删除角色
    deleteRole(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/role/deleteData', params, 'post')
    },
    //修改角色状态
    modifyRoleStatus(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/role/modifyRoleStatus', params, 'post')
    },
    //获取当前角色已拥有的权限
    getRoleHasMenus(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/role/getRoleHasMenus', params)
    },
    //系统参数列表
    sysParamsList(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/sysParams/findPage', params)
    },
    //新增系统参数
    addSysParams(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/sysParams/addSysParams', params, 'post')
    },
    //修改系统参数
    modifySysParams(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/sysParams/modifySysParams', params, 'post')
    },
    //修改状态
    modifySysParamsStatus(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/sysParams/modifySysParamsStatus', params, 'post')
    },
    //删除系统参数
    deleteSysParams(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/sysParams/deleteData', params, 'post')
    },
    //获取组织树
    getGroupTrees(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/group/groupTrees', params)
    },
    //新增组织
    addGroupTrees(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/group/addGroup', params, 'post')
    },
    //删除组织
    deleteGroupTrees(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/group/deleteGroup', params, 'post')
    },
    //修改组织
    updateGroupTrees(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/group/updateGroup', params, 'post')
    },
    //系统岗位映射分页查询
    getSysMapList(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basics/position/findByPage', params)
    },
    //员工店铺关系分页查询
    getEmployeeShopRelList(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basics/userStore/findByPage', params)
    },
    //员工店铺关系数据导出
    exportEmpShopRel(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basics/userStore/exportEmpShopRel', params)
    },
    //文件下载
    downLoadTempFileByName(fileName) {
        window.location.href = baseURL.basicApi + '/ldygpt-pc-web/api/file/downloadTempFile?fileName=' + fileName
    },
    //新增岗位映射信息
    addSysMap(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basics/position/addData', params, 'post')
    },
    //批量删除岗位映射信息
    deleteSysMap(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basics/position/batchDeleteData', params, 'post')
    },
    //根据系统岗位id查询岗位信息
    getSysMapDetail(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basics/position/getPositionById', params)
    },
    //获取所有MDM系统岗位信息
    findMdmPositionInfo(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basics/position/findMdmPositionInfo', params, 'post')
    },
    //修改岗位映射信息
    modifyMdmPosition(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basics/position/updateData', params, 'post')
    },
    //批量修改岗位映射数据状态
    modifyMdmStatus(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basics/position/updateDataStatus', params, 'post')
    },
    //兼职店铺关系表
    getTemporaryShopRel(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basics/temporaryShopRel/findByPage', params)
    },
    //新增兼职店铺关系表
    addTemporaryShopRel(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basics/temporaryShopRel/addSave', params, 'post')
    },
    //修改兼职店铺关系表
    editTemporaryShopRel(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basics/temporaryShopRel/editSave', params, 'post')
    },
    //删除兼职店铺关系表
    deleteTemporaryShopRel(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basics/temporaryShopRel/batchDeleteData', params, 'post')
    },
    //查询详情
    getTemporaryShopRelDetial(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basics/temporaryShopRel/getTemporaryShopRelDetial', params)
    },
    //导入文件
    excelFileUpload(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/file/excelFileUpload', params, 'post')
    },
    //导出数据
    exportTemporaryShopRel(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basics/temporaryShopRel/exportTemporaryShopRel', params)
    },
    //获取文件上传进度
    getExportExcelSchedule(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/file/getExportExcelSchedule', params, 'post')
    },
    //文件上传信息获取
    getImportParameter(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basics/temporaryShopRel/getImportParameter', params)
    },
    //兼职店铺关系表（区长，店长）分页查询
    findByPageEmpCustomerRel(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basics/bsEmpCustomerRel/findByPage', params)
    },
    //获取兼职店铺关系表（区长，店长）详情
    getDetialEmpCustomerRel(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basics/bsEmpCustomerRel/getDetial', params)
    },
    //新增兼职店铺关系表（区长，店长）
    addSaveEmpCustomerRel(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basics/bsEmpCustomerRel/addSave', params, 'post')
    },
    //修改兼职店铺关系表（区长，店长）
    editSaveEmpCustomerRel(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basics/bsEmpCustomerRel/editSave', params, 'post')
    },
    //删除兼职店铺关系表（区长，店长）
    empCustomerRelBatchDeleteData(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basics/bsEmpCustomerRel/batchDeleteData', params, 'post')
    },
    //导出兼职店铺关系表（区长，店长）
    empCustomerRelExportData(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basics/bsEmpCustomerRel/exportData', params)
    },
    //获取导入员工子公司关系excel参数
    getImportEmpCustomerRelParameter(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basics/bsEmpCustomerRel/getImportParameter', params)
    },
    //常用任务项列表
    getCommonTaskItemList(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/common/taskItem/list', params)
    },
    //新增常用任务项
    addCommonTaskItem(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/common/taskItem/add', params, 'post')
    },
    //查看常用任务项
    getCommonTaskItemDetail(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/common/taskItem/getDetail', params)
    },
    //修改常用任务项
    modifyCommonTaskItem(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/common/taskItem/modify', params, 'post')
    },
    //生效/失效常用任务项
    modifyCommonTaskItemStatus(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/common/taskItem/updateStatus', params, 'post')
    },
    //删除常用任务项
    deleteCommonTaskItem(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/common/taskItem/delete', params, 'post')
    },
    //常用子任务列表
    getCommonSubTaskList(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/common/subtask/list', params)
    },
    //新增常用子任务
    addCommonSubTask(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/common/subtask/add', params, 'post')
    },
    //查看常用子任务
    getCommonSubTaskDetail(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/common/subtask/getDetail', params)
    },
    //修改常用子任务
    modifyCommonSubTask(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/common/subtask/modify', params, 'post')
    },
    //生效/失效常用子任务
    modifyCommonSubTaskStatus(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/common/subtask/updateStatus', params, 'post')
    },
    //删除常用子任务
    deleteCommonSubTask(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/common/subtask/delete', params, 'post')
    },
    //任务列表
    getTaskList(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/task/list', params)
    },
    //新增任务
    addTask(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/task/add', params, 'post')
    },
    //查看任务
    getTaskDetail(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/task/getDetail', params)
    },
    //修改任务
    modifyTask(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/task/modify', params, 'post')
    },
    //生效/失效任务
    modifyTaskStatus(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/task/updateStatus', params, 'post')
    },
    //删除任务
    deleteTask(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/task/delete', params, 'post')
    },
    //子任务列表
    getSubTaskList(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/subTask/list', params)
    },
    //新增子任务
    addSubTask(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/subTask/add', params, 'post')
    },
    //查看子任务
    getSubTaskDetail(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/subTask/getDetail', params)
    },
    //修改子任务
    modifySubTask(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/subTask/update', params, 'post')
    },
    //删除子任务
    deleteSubTask(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/subTask/delete', params, 'post')
    },
    //任务项列表
    getTaskItemList(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/taskItem/list', params)
    },
    //新增任务项
    addTaskItem(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/taskItem/add', params, 'post')
    },
    //选择任务项
    chooseTaskItem(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/taskItem/choose', params, 'post')
    },
    //查看任务项
    getTaskItemDetail(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/taskItem/getDetail', params)
    },
    //修改任务项
    modifyTaskItem(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/taskItem/update', params, 'post')
    },
    //删除任务项
    deleteTaskItem(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/taskItem/delete', params, 'post')
    },
    //msp任务树
    getCommonSubTaskTree(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/common/subtask/getTree', params)
    },
    //查询人员积分
    getUserIntegralList(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/integral/findUserIntegralList', params, 'post')
    },
    //查询人员积分记录
    getIntegerRecord(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/integral/getIntegerRecord', params)
    },
    //获取导入员工积分参数
    getImportUserIntegralParameter(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/integral/getImportParameter', params)
    },
    // 获取组织结构树
    getEnterpriseTrees(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/enterpriseInfo/getEnterpriseTrees', params)
    },
    //通过项目加载企业
    getEnterByProject(params){
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/emp/getEnterByProject', params,'post')
    },
    //员工列表
    getEmpList(params) {
     return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/emp/findPage', params)
    },
    //新增企业员工
    addSaveEmp(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/emp/addSaveEmp', params, 'post')
    },
    //获取员工详情
    getEmpDetails(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/emp/getDetails', params)
    },
    //修改员工信息
    editSaveEmp(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/emp/editSaveUser', params, 'post')
    },
    //标记为管理员
    assignAdmin(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/emp/assignAdmin', params, 'post')
    },
    //删除员工信息
    deleteEmp(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/emp/deleteEmp', params, 'post')
    },
    //获取员工导入数据信息
    getImportEmpParameter(params){
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/emp/getImportEmpParameter', params, 'post')
    },
    //导出企业员工数据
    exportEmpData(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/emp/exportEmpData', params, 'post')
    },
    //获取企业组织
    getEmpTrees(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/emp/empTrees', params)
    },
    // 添加用户园区关系
    addEmpUser(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/emp/addEmpUser', params,'post')
    },
    // 选择园区
    selected(params) {
        return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/emp/selected', params)
    },
    // 企业列表
    getEnterprisePage(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/enterpriseInfo/findPage', params)
    },

    //修改企业信息
    modifyEnterprise(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/sys/enterpriseInfo/modifyEnterprise', params, 'post')
    },

    //餐厅分页列表
    getDiningRoomInfoPage(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningRoomInfo/findDinningRoomPage', params)
    },

    //餐厅列表
    findDiningRoomList(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningRoomInfo/findDiningRoomList', params)
    },

    //获取餐厅设备厂商列表
    getDictTerminalManufacturer() {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningRoomInfo/getDictTerminalManufacturer')
    },

    //新增餐厅信息
    addDiningRoomInfo(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningRoomInfo/addDiningRoomInfo', params, 'post')
    },

    //修改餐厅信息
    modifyDiningRoomInfo(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningRoomInfo/modifyDiningRoomInfo', params, 'post')
    },

    //批量修改餐厅状态
    modifyDiningRoomInfoStatus(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningRoomInfo/modifyDiningRoomInfoStatus', params, 'post')
    },

    //批量删除餐厅
    deleteDiningRoomInfo(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningRoomInfo/deleteDiningRoomInfo', params, 'post')
    },

    //餐厅档口分页列表
    findDinningStallPage(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningStallInfo/findDinningStallPage', params)
    },

    //档口列表
    findDiningStallList(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningStallInfo/findDiningStallList', params)
    },

    //新增餐厅档口信息
    addDiningStallInfo(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningStallInfo/addDiningStallInfo', params, 'post')
    },

    //修改餐厅档口信息
    modifyDiningStallInfo(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningStallInfo/modifyDiningStallInfo', params, 'post')
    },

    //批量修改餐厅档口状态
    modifyDiningStallInfoStatus(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningStallInfo/modifyDiningStallInfoStatus', params, 'post')
    },

    //批量删除餐厅档口
    deleteDiningStallInfo(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningStallInfo/deleteDiningStallInfo', params, 'post')
    },

    //餐厅档口终端设备列表
    findDiningTerminalPage(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningTerminalInfo/findDiningTerminalPage', params)
    },

    //新增餐厅档口终端设备信息
    addDiningTerminalInfo(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningTerminalInfo/addDiningTerminalInfo', params, 'post')
    },

    //修改餐厅档口终端设备信息
    modifyDiningTerminalInfo(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningTerminalInfo/modifyDiningTerminalInfo', params, 'post')
    },

    //批量修改餐厅档口终端设备状态
    modifyDiningTerminalStatus(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningTerminalInfo/modifyDiningTerminalStatus', params, 'post')
    },

    //批量删除餐厅终端设备档口
    deleteDiningTerminalInfo(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningStallInfo/deleteDiningTerminalInfo', params, 'post')
    },


    //组装上传参数-导入终端设备
    getParamUploadDiningTerminal() {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/diningTerminalInfo/getParamUploadDiningTerminal')
    },


    // 活动评分项分页列表
    getActivityScoreInfoList(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/activity/activityScoreInfo/findPage', params)
    },
    // 新增活动评分项
    addSaveActivityScoreInfo(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/activity/activityScoreInfo/addScoreInfo', params, 'post')
    },
    // 活动评分项 启用/禁用
    modifyScoreInfo(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/activity/activityScoreInfo/modifyScoreInfo', params, 'post')
    },
    // 获取评分项详情
    getActivityScoreDetails(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/activity/activityScoreInfo/getActivityScoreDetails', params)
    },
    // 修改活动评分项名称
    editSaveActivityScoreInfo(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/activity/activityScoreInfo/modifyScoreItemName', params, 'post')
    },
    // 停车场管理分页列表
    getParkLotInfoList(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/parkLot/parkLotInfo/findPage', params)
    },
    // 新增停车场信息
    addSaveLdParkLotInfo(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/parkLot/parkLotInfo/addParkLotInfo', params, 'post')
    },
    // 修改停车场信息
    editSaveLdParkLotInfo(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/parkLot/parkLotInfo/modifyParkLotInfo', params, 'post')
    },
    // 获取停车场信息详情
    getParkLotDetails(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/parkLot/parkLotInfo/getParkLotDetails', params)
    },
    // 批量删除停车场信息
    deleteParkLots(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/parkLot/parkLotInfo/deleteParkLots', params, 'post')
    },
    // 获取所属项目列表
    getProjectList(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/parkLot/parkLotInfo/findProjectList', params)
    },
    // 从数据字典获取评分项类型
    getScoreItemTypeList(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/activity/activityScoreInfo/getScoreItemTypeList', params)
    },
    // 从数据字典获取启用状态
    getScoreItemStatusList(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/activity/activityScoreInfo/getScoreItemStatusList', params)
    },
    // 从数据字典获取有无充电桩
    getIsChargingPileList(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/parkLot/parkLotInfo/getIsChargingPileList', params)
    },
    // 从数据字典获取有无地下车位
    getIsUnderSpaceList(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/parkLot/parkLotInfo/getIsUnderSpaceList', params)
    },
    // 从数据字典获取是否对外开放
    getIsOpenList(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/parkLot/parkLotInfo/getIsOpenList', params)
    },
    //查询活动列表信息
    getActivityList(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/activity/findPage', params)
    },
    //修改活动状态
    upperActivityStatus(params) {
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/activity/upperActivityStatus', params,'post')
    },
    //查询活动报名人员
    getActivityApplyUserList(){
      return fetchData(baseURL.basicApi + '/ldygpt-pc-web/api/basic/activity/getActivityApplyUserList', params,'post')
    }



}
