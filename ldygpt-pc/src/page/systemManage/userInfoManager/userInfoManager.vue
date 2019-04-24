<template>
    <div class="container">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">
            <el-form-item label="用户名称" prop="userName">
                <el-input v-model="formSearch.userName" placeholder="用户名称"></el-input>
            </el-form-item>
            <el-form-item label="用户账号" prop="acctName">
                <el-input v-model="formSearch.acctName" placeholder="用户账号"></el-input>
            </el-form-item>
            <el-form-item label="用户工号" prop="workCode">
                <el-input v-model="formSearch.workCode" placeholder="用户工号"></el-input>
            </el-form-item>
            <el-form-item label=" " style="margin-left:50px;">
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="warning" plain @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 操作区----start -->
        <!-- <el-row class="mgb15">
            <el-button size="small" round type="primary" @click="openAdd">新增</el-button>
            <el-button size="small" round @click="change('A')">生效</el-button>
            <el-button size="small" round @click="change('D')">失效</el-button>
            <el-button size="small" round type="danger" @click="deleteUser('all')">批量删除</el-button>
        </el-row> -->
        <!-- 操作区----end -->
        <!-- 表格---start -->
        <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="60">
            </el-table-column>
            <el-table-column prop="userName" label="用户姓名" align="center">
            </el-table-column>
            <el-table-column prop="sex" label="用户性别" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.sex=='0'?'男':'女' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="acctName" label="用户账号" align="center">
            </el-table-column>
            <el-table-column prop="workCode" label="用户工号" align="center">
            </el-table-column>
            <el-table-column prop="departmentName" label="所属部门" align="center">
            </el-table-column>
            <el-table-column prop="companyName" label="所属公司" align="center">
            </el-table-column>
            <el-table-column prop="phoneNo" label="用户电话" align="center">
            </el-table-column>
            <el-table-column prop="email" label="用户邮箱" align="center">
            </el-table-column>
            <el-table-column prop="createDate" label="创建日期" align="center" :formatter="this.$common.timestampToTime">
            </el-table-column>
        </el-table>
        <el-pagination background
                       layout="total,sizes,prev, pager, next,jumper"
                       :current-page="pageInfo.currentPage"
                       :page-size="pageInfo.pageSize"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :total="pageInfo.pageTotal"
                       :page-sizes="[5, 10, 20, 50]">
        </el-pagination>
        <!-- 表格---end -->

        <!-- 新增弹框---start -->
        <el-dialog :title="openType == 'add'? '新增用户': '修改信息 '" :visible.sync="dialogAddVisible" width="700px">
            <el-form :label-position="labelPosition" :label-width="labelWidth" :rules="rulesAdd" :model="formAdd"
                     ref='formAdd' class="add-dialog-form">
                <el-form-item label="用户帐号" prop="acctName">
                    <el-input v-model="formAdd.acctName" placeholder="用户帐号"></el-input>
                </el-form-item>
                <el-form-item label="用户名称" prop="userName">
                    <el-input v-model="formAdd.userName" placeholder="用户名称"></el-input>
                </el-form-item>
                <el-form-item label="用户工号" prop="workCode">
                    <el-input v-model="formAdd.workCode" placeholder="用户工号"></el-input>
                </el-form-item>
                <el-form-item label="所属部门" prop="groupName">
                    <el-cascader
                            filterable
                            :options="options"
                            v-model="selectedStore"
                            :show-all-levels="false"
                            @change="handleChange">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="手机号" prop="phoneNo">
                    <el-input v-model="formAdd.phoneNo" placeholder="手机号"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="formAdd.email" placeholder="邮箱"></el-input>
                </el-form-item>
                <el-form-item label="备注信息" prop="remark">
                    <el-input v-model="formAdd.remark" placeholder="备注信息" type="textarea"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="formAdd.status">
                        <el-radio label="A">生效</el-radio>
                        <el-radio label="D">失效</el-radio>
                    </el-radio-group>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 新增弹框---end -->
        <el-dialog title="修改密码" :visible.sync="passwordDialog" width="700px">
            <el-form :label-position="labelPosition" :label-width="labelWidth" :rules="rulesPwd" :model="formPwd"
                     ref='password' class="demo-form-inline">
                <el-form-item label="原始密码" prop="userName">
                    <el-input v-model="formAdd.userName" placeholder="原始密码"></el-input>
                </el-form-item>
                <el-form-item label="新的密码" prop="tenementCode">
                    <el-input v-model="formAdd.tenementCode" placeholder="新的密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="tenementCode">
                    <el-input v-model="formAdd.tenementCode" placeholder="确认密码"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelPwd">取 消</el-button>
                <el-button type="primary">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 角色分配弹窗 -->
        <el-dialog title="角色分配" :visible.sync="assignRolesWinShow" width="700px" :before-close="cancelAssignRoles">
            <el-table :data="roleTableData" ref="multipleTable" v-loading="listLoading"
                      border stripe style="width: 100%" @selection-change="handleSelectionChangeRole">
                <el-table-column type="selection" width="60">
                </el-table-column>
                <el-table-column prop="roleName" label="角色名称" align="center">
                </el-table-column>
                <el-table-column prop="description" label="角色描述" align="center">
                </el-table-column>
                <el-table-column label="用户状态" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.status=='A'?'生效':'失效' }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background
                           layout="total,sizes,prev, pager, next,jumper"
                           :current-page="pageInfo2.currentPage"
                           :page-size="pageInfo2.pageSize"
                           @size-change="handleSizeChange2"
                           @current-change="handleCurrentChange2"
                           :total="pageInfo2.pageTotal"
                           :page-sizes="[5, 10, 20, 50]">
            </el-pagination>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelAssignRoles">取 消</el-button>
                <el-button type="primary" @click="assignRolesSubmit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'userInfoManager',
        data() {
            return {
                formSearch: { //表单查询
                    userName: '',
                    acctName: '',
                    workCode: ''
                },
                selectedStore: [],
                options: [],
                selectedOptions: [],
                passwordDialog: false,
                selectListId: [],
                openType: 'add', //add新增 mof修改
                listLoading: false,//
                pageInfo: { //分页
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: 0
                },
                pageInfo2: { //分页
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: 0
                },
                formAdd: { //表单添加
                },
                formPwd: {
                    oldPwd: '',
                    newPwd: '',
                    newPwd2: ''
                },
                rulesPwd: {
                    oldPwd: [
                        {required: true, message: "请输入原始密码", trigger: "blur"}
                    ],
                    newPwd: [{required: true, message: "请输入新的密码", trigger: "blur"}],
                    newPwd2: [{required: true, message: "请重新输入新的密码", trigger: "blur"}]
                },
                rulesAdd: {
                    userName: [
                        {required: true, message: "请输入租户名称", trigger: "blur"}
                    ],
                    tenementCode: [{required: true, message: "请输入租户编码", trigger: "blur"}],
                    status: [{required: true, message: "请选择状态", trigger: "blur"}]
                },
                tableData: [],
                dialogAddVisible: false,    //添加弹框显示
                labelPosition: 'right', //lable对齐方式
                labelWidth: '80px', //lable宽度
                formLabelWidth: '120px',
                // 角色分配弹框展示
                assignRolesWinShow: false,
                // 角色列表数据
                roleTableData: [],
                // 已选中的角色ridList
                hasCheckedRoleIds: [],
                hasCheckedRoleIdsBack: [],
                // 当前选中的用户ID
                checkedUserId: '',
                // 当前用户已拥有的角色
                userHasRoleList: [],
                roleIndexArr: []
            };
        },
        mounted() {
            this.getLdUserList()
        },
        methods: {
            handleChange(value) {
                console.log(JSON.stringify(value))
                this.selectedOptions = value[value.length - 1].split(',')
            },
            getLdUserList() {
                let params = {
                    page: this.pageInfo.currentPage,
                    limit: this.pageInfo.pageSize,
                    userName: this.formSearch.userName,
                    acctName: this.formSearch.acctName,
                    workCode: this.formSearch.workCode,
                    departmentName: this.formSearch.departmentName,
                }
                this.$api.getLdUserList(params).then(res => {
                    if (res.code == 0) {
                        this.pageInfo.pageTotal = res.count
                        this.tableData = res.data
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            },
            search() {
                this.pageInfo.currentPage = 1
                this.getLdUserList()
            },
            reset() {
                this.formSearch.userName = ''
                this.formSearch.workCode = ''
                this.formSearch.acctName = ''
            },
            handleSizeChange(size) {
                this.pageInfo.currentPage = 1
                this.pageInfo.pageSize = size
                this.getLdUserList()
            },
            handleCurrentChange(currentPage) {
                this.pageInfo.currentPage = currentPage
                this.getLdUserList()
            },
            handleSizeChange2(size) {
                this.pageInfo2.currentPage = 1
                this.pageInfo2.pageSize = size
                this.getLoginRoleList()
            },
            handleCurrentChange2(currentPage) {
                this.pageInfo.currentPage = currentPage
                this.getLoginRoleList()
            },
            addSaveUser() {
                this.$refs['formAdd'].validate((valid) => {
                    if (valid) {
                        this.formAdd.groupId = this.selectedOptions[0]
                        this.formAdd.groupCode = this.selectedOptions[1]
                        this.formAdd.groupFullValue = JSON.stringify(this.selectedStore)
                        this.$api.addSaveUser(this.formAdd).then(res => {
                            if (res.code === 0) {
                                this.cancel()
                                this.getLdUserList()
                                this.$message.success('新增成功')
                            } else {
                                // 失败提示
                                this.$message.error(res.msg)
                            }
                        })
                    }
                })
            },
            submit() {
                if (this.openType == 'add') {
                    this.addSaveUser()
                } else {
                    this.editSaveUser()
                }
            },
            openAdd() {
                this.openType = 'add'
                this.dialogAddVisible = true
                this.findGroupAndUser()
            },
            cancel() {
                this.dialogAddVisible = false
                this.formAdd = {}
            },
            cancelPwd() {
                this.passwordDialog = false
                this.formPwd = {}
            },
            getDetail(data) {
                let params = {
                    uid: data.uid
                }
                this.$api.getUserDetails(params).then(res => {
                    if (res.code === 0) {
                        this.openType = 'mof'
                        this.dialogAddVisible = true
                        this.formAdd = res.data
                        this.selectedStore = JSON.parse(res.data.groupFullValue)
                        console.log(this.selectedStore)
                    } else {
                        // 失败提示
                        this.$message.error(res.msg)
                    }
                })
                this.findGroupAndUser()
            },
            editSaveUser() {
                delete this.formAdd.createDate
                this.formAdd.groupId = this.selectedOptions[0]
                this.formAdd.groupCode = this.selectedOptions[1]
                this.formAdd.groupFullValue = JSON.stringify(this.selectedStore)
                this.$api.editSaveUser(this.formAdd).then(res => {
                    if (res.code === 0) {
                        this.cancel()
                        this.getLdUserList()
                        this.$message.success('修改成功')
                    } else {
                        // 失败提示
                        this.$message.error(res.msg)
                    }
                })
            },
            handleSelectionChange(val) {
                this.selectListId = []
                val.forEach(item => {
                    this.selectListId.push(item.uid)
                });
                console.log(this.selectListId)
            },
            change(status) {
                let params = {
                    uids: this.selectListId.join(','),
                    status: 'A'
                }
                if (status == 'D') {
                    params.status = 'D'
                }
                this.$api.modifyUserStatus(params).then(res => {
                    if (res.code === 0) {
                        this.getLdUserList()
                        this.$message.success('修改成功')
                    } else {
                        // 失败提示
                        this.$message.error(res.msg)
                    }
                })
            },
            deleteUser(type, id) {
                this.$confirm('确定要删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = {
                        uids: ''
                    }
                    if (type == 'all') {
                        params.uids = this.selectListId.join(',')
                    } else {
                        params.uids = id
                    }
                    this.$api.deleteUser(params).then(res => {
                        if (res.code === 0) {
                            this.getLdUserList()
                            this.$message.success('删除成功')
                        } else {
                            // 失败提示
                            this.$message.error(res.msg)
                        }
                    })
                })
            },
            resetPwd(data) {
                console.log(data)
                let params = {
                    uid: data.uid
                }
                this.$api.resetPwd(params).then(res => {
                    if (res.code === 0) {
                        this.$message.success('重置成功')
                    } else {
                        // 失败提示
                        this.$message.error(res.msg)
                    }
                })
            },
            findGroupAndUser() {
                this.$api.findGroupAndUser().then(res => {
                    if (res.code === 0) {
                        this.options = JSON.parse(res.data)
                    } else {
                        // 失败提示
                        this.$message.error(res.msg)
                    }
                })
            },
            // 角色分配按钮
            assignRolesWin(val) {
                this.assignRolesWinShow = true
                // 可选角色
                this.getLoginRoleList()
                // 当前用户id
                this.checkedUserId = val.uid
                // 当前用户已拥有的角色
                this.userHasRoleList = val.roleList
                val.roleList.forEach(item => {
                    this.hasCheckedRoleIdsBack.push(item.rid)
                });
            },
            // 取消角色分配
            cancelAssignRoles() {
                console.log('执行了取消操作')
                this.assignRolesWinShow = false
                this.roleIndexArr = []
                this.hasCheckedRoleIdsBack = []
            },
            // 确定分配
            assignRolesSubmit() {
                let params = {
                    uid: this.checkedUserId,
                    rIds: this.hasCheckedRoleIds.join(',')
                }
                this.$api.updateUserRole(params).then(res => {
                    if (res.code === 0) {
                        this.assignRolesWinShow = false
                        this.$message.success(res.msg)
                        this.roleIndexArr = []
                        this.hasCheckedRoleIdsBack = []
                        this.getLdUserList()
                    } else {
                        // 失败提示
                        this.$message.error(res.msg)
                    }
                })
            },
            // 获取可选角色列表
            getLoginRoleList() {
                let _this = this
                let params = {
                    page: this.pageInfo2.currentPage,
                    limit: this.pageInfo2.pageSize
                }
                this.$api.getRoleList(params).then(res => {
                    if (res.code === 0) {
                        this.pageInfo2.pageTotal = res.count
                        this.roleTableData = res.data
                        // 判断该角色是否已获取
                        res.data.forEach((item, index) => {
                            _this.hasCheckedRoleIdsBack.forEach(rolesId => {
                                if (item.rid == rolesId) {
                                    this.roleIndexArr.push(index)
                                }
                            })
                        });
                        console.log(this.roleIndexArr)
                        setTimeout(() => {
                            if (this.roleIndexArr) {
                                this.roleIndexArr.forEach(row => {
                                    _this.$refs.multipleTable.toggleRowSelection(_this.roleTableData[row], true);
                                });
                            }
                        }, 1)
                    } else {
                        // 失败提示
                        this.$message.error(res.msg)
                    }
                })
            },
            // 选中的角色放入list中
            handleSelectionChangeRole(val) {
                this.hasCheckedRoleIds = []
                val.forEach(item => {
                    this.hasCheckedRoleIds.push(item.rid)
                });
                console.log(this.hasCheckedRoleIds)
            }

        }
    };
</script>
<style lang="scss" scoped>
    // 设置输入框的宽度
    .el-form-item__content {
        width: 300px;
    }

    .add-dialog-form {
        width: 400px;
        margin: 0 auto;
    }

    .container {
        .btn-size {
            padding: 4px 5px;
        }

        .el-button + .el-button {
            margin-left: 5px;
        }
    }
</style>
