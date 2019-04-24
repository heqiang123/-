<template>
    <div class="container">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">
            <el-form-item label="项目名称">
              <el-select placeholder="请选择项目" filterable v-model="formSearch.projectId" @change="getEnterByProject">
                  <el-option v-for="item in projects"
                             :key="item.projectId"
                             :value="item.projectId"
                              :label="item.projectName">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="企业名称">
              <el-select placeholder="请选择企业" filterable v-model="formSearch.enterId">
                <el-option v-for="item in enters"
                           :key="item.enter_code"
                           :value="item.enter_code"
                           :label="item.enter_name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用户名称">
                <el-input v-model="formSearch.empName" placeholder="用户名称" style="width:120px;"></el-input>
            </el-form-item>
            <el-form-item label="手机号码">
                <el-input v-model="formSearch.empTel" placeholder="手机号码" style="width:120px;"></el-input>
            </el-form-item>
            <el-form-item label="用户状态">
                <el-select v-model="formSearch.empStatus" placeholder="用户状态" style="width:106px;">
                    <el-option label="生效" value="0"></el-option>
                    <el-option label="失效" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label=" " style="margin-left:10px;">
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="warning" plain @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 操作区----start -->
        <el-row class="mgb15">
            <el-button size="small" round type="primary" @click="openAdd">新增人员</el-button>
            <el-button size="small" round type="info" @click="uploadOpen">批量导入</el-button>
            <el-button size="small" round type="success" @click="exportEmpData">批量导出</el-button>
            <el-button size="small" round type="danger" @click="deleteEmp('all')">批量作废</el-button>
            <el-button size="small" round type="warning " @click="assignAdmin">标记为企业管理员</el-button>
        </el-row>
        <!-- 操作区----end -->
        <!-- 表格---start -->
        <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="36">
            </el-table-column>
            <el-table-column prop="projectName" label="所属项目" align="center">
            </el-table-column>
            <el-table-column prop="enterName" label="企业名称" align="center">
            </el-table-column>
            <el-table-column prop="empName" label="用户名称" align="center">
            </el-table-column>
            <el-table-column prop="empTel" label="手机号码" align="center">
            </el-table-column>
            <el-table-column label="性别" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.empSex=='0'?'女':'男' }}</span>
                  </template>
            </el-table-column>
            <el-table-column prop="empIdNumber" label="身份证号" align="center">
            </el-table-column>
            <el-table-column prop="empDep" label="所在部门" align="center">
            </el-table-column>
            <el-table-column prop="empPosition" label="职务" align="center">
            </el-table-column>
            <el-table-column prop="empCarNumber" label="车牌号" align="center">
            </el-table-column>
            <el-table-column label="是否是管理员" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.whetherAdmin=='1'?'是':'否' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="是否绑定餐卡" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.haveMealCard=='0'?'未绑定':'已绑定' }}</span>
                    </template>
            </el-table-column>
            <el-table-column label="用户状态" align="center" width="80">
                <template slot-scope="scope">
                    <span>{{ scope.row.empStatus=='0'?'生效':'失效' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="审核状态" align="center" width="80">
                  <template slot-scope="scope">
                    <span>{{ scope.row.applyStatus=='0'?'未审':scope.row.applyStatus=='1'?'通过':'驳回' }}</span>
                  </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="106" align="center">
                <template slot-scope="scope">
                    <el-button class="btn-size" size="mini" @click="getDetail(scope.row)">编辑</el-button>
                    <el-button class="btn-size" size="mini" plain type="danger" @click="deleteEmp('one', scope.row.id)">作废
                    </el-button>
                </template>
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
        <el-dialog :title="openType == 'add'? '新增人员': '修改信息 '" :visible.sync="dialogAddVisible" width="700px">
            <el-form :label-position="labelPosition" :label-width="labelWidth" :rules="rulesAdd" :model="formAdd"
                     ref='formAdd' class="add-dialog-form" >
                <el-form-item label="所属项目" prop="projectId">
                    <el-select placeholder="请选择项目" filterable v-model="formAdd.projectId" @change="getEnterByProject">
                      <el-option v-for="item in projects"
                                 :key="item.projectId"
                                 :value="item.projectId"
                                 :label="item.projectName">
                      </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属企业" prop="enterId">
                  <el-select placeholder="请选择企业" filterable v-model="formAdd.enterId">
                      <el-option v-for="item in enters"
                                 :key="item.enter_code"
                                 :value="item.enter_code"
                                 :label="item.enter_name">
                      </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="用户名称" prop="empName">
                    <el-input v-model="formAdd.empName" placeholder="用户名称"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="empTel">
                    <el-input v-model="formAdd.empTel" placeholder="手机号码"></el-input>
                </el-form-item>
                <el-form-item label="身份证号" prop="empIdNumber">
                  <el-input v-model="formAdd.empIdNumber" placeholder="身份证号"></el-input>
                </el-form-item>
                <el-form-item label="生日" prop="birthDay">
                  <el-input v-model="formAdd.birthDay" placeholder="生日"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="empSex">
                  <el-radio-group v-model="formAdd.empSex">
                    <el-radio label="1">男</el-radio>
                    <el-radio label="0">女</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="所属部门" prop="empDep">
                  <el-input v-model="formAdd.empDep" placeholder="所属部门"></el-input>
                </el-form-item>
                <el-form-item label="职位" prop="empPosition">
                    <el-input v-model="formAdd.empPosition" placeholder="职位"></el-input>
                </el-form-item>
                <el-form-item label="车牌号" prop="empCarNumber">
                    <el-input v-model="formAdd.empCarNumber" placeholder="车牌号"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </div>
        </el-dialog>

      <!-- 上传弹框---end -->
      <el-dialog title="上传人员信息" :visible.sync="showUpload" width="700px" v-if="showUpload" :before-close="cancelUpload">
        <steps :uploadType="uploadType"
               v-if="showUpload"
               :tempUrl="tempUrl"
               :tempName="tempName"
               :percentage="percentage"
               :result="result"
               :progressBar="progressBar"
               @upLoad="getImportParameter"
               :active="active"></steps>
      </el-dialog>
    </div>
</template>

<script>
    import steps from '@/components/upload/steps.vue'
    export default {
        name: 'enterpriseEmpManager',
        components: {steps},
        data() {
            return {
                formSearch: { //表单查询
                    projectId: '',
                    userName: '',
                    empTel: '',
                    empStatus: ''
                },
                showUpload:false,
                selectedStore: [],
                options: [],
                selectedOptions: [],
                passwordDialog: false,
                selectListId: [],
                projects: [],
                enters: [],
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
                  empSex: 1
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
                    projectId:[{required: true, message: "请选择项目", trigger: "blur"}],
                    enterId:[{required: true, message: "请选择企业", trigger: "blur"}],
                    empName: [{required: true, message: "请输入用户名称", trigger: "blur"}],
                    empTel: [{required: true, message: "请输入电话号码", trigger: "blur"},{ pattern: /^1\d{10}$/, message: "请填写正确的手机号码"}],
                    empIdNumber: [{required: true, message: "请输入身份证号", trigger: "blur"},{ pattern: /^\d{17}(\d||[Xx])$/, message: "请填写正确的身份证号"}]
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
                roleIndexArr: [],
                fileName: '',
                file: '',
                uploadType:'incremental',
                sex: '1',
                currentId:'',
                tempUrl: '../../../../static/template/企业员工信息导入模板.xls',
                tempName: '企业员工信息导入模板.xls',
                percentage: 0,
                result: '',
                progressBar: false,
                active: 1
            };
        },
        mounted() {
            this.getEmpList()
        },
        methods: {
            handleChange(value) {
                console.log(JSON.stringify(value))
                this.selectedOptions = value[value.length - 1].split(',')
            },
           getEmpList() {
                let params = {
                    page: this.pageInfo.currentPage,
                    limit: this.pageInfo.pageSize,
                    projectId: this.formSearch.projectId,
                    enterId: this.formSearch.enterId,
                    empName: this.formSearch.empName,
                    empTel: this.formSearch.empTel,
                    empStatus: this.formSearch.empStatus
                }
                this.$api.getEmpList(params).then(res => {
                    if (res.code == 0) {
                        this.pageInfo.pageTotal = res.count
                        this.tableData = res.data
                        this.projects = res.projects
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            },
            uploadOpen() {
              this.showUpload = true
            },
            cancelUpload () {
              this.fileName = ''
              this.file = ''
              this.showUpload = false
            },
            search() {
                this.pageInfo.currentPage = 1
                this.getEmpList()
            },
            reset() {
                this.formSearch.projectId = ''
                this.formSearch.empName = ''
                this.formSearch.empTel = ''
                this.formSearch.empStatus = ''
            },
            handleSizeChange(size) {
                this.pageInfo.currentPage = 1
                this.pageInfo.pageSize = size
                this.getEmpList()
            },
            handleCurrentChange(currentPage) {
                this.pageInfo.currentPage = currentPage
                this.getEmpList()
            },
            addSaveEmp() {
                this.$refs['formAdd'].validate((valid) => {
                    if (valid) {
                        this.$api.addSaveEmp(this.formAdd).then(res => {
                            if (res.code === 0) {
                                this.cancel()
                                this.getEmpList()
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
                    this.addSaveEmp()
                } else {
                    this.editSaveEmp()
                }
            },
            openAdd() {
                this.openType = 'add'
                this.dialogAddVisible = true
                this.formAdd = {}
                this.formAdd = {empSex:'1'}
            },
            cancel() {
                this.dialogAddVisible = false
                this.formAdd = {}
            },
            getDetail(data) {
                let params = {
                    id: data.id
                }
                this.$api.getEmpDetails(params).then(res => {
                    if (res.code === 0) {
                        this.openType = 'mof'
                        this.dialogAddVisible = true
                      this.formAdd = {}
                        this.formAdd = res.data
                        console.log(this.formAdd)
                        console.log(this.formAdd.empSex)
                        this.currentId = res.data.id
                    } else {
                        // 失败提示
                        this.$message.error(res.msg)
                    }
                })
            },
            editSaveEmp() {
                this.formAdd.id = this.currentId
                this.$api.editSaveEmp(this.formAdd).then(res => {
                    if (res.code === 0) {
                        this.cancel()
                        this.getEmpList()
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
            },
            deleteEmp(type, id) {
                this.$confirm('确定要删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = {
                        ids: ''
                    }
                    if (type == 'all') {
                        params.ids = this.selectListId.join(',')
                    } else {
                        params.ids = id
                    }
                    this.$api.deleteEmp(params).then(res => {
                        if (res.code === 0) {
                            this.getEmpList()
                            this.$message.success('作废成功')
                        } else {
                            // 失败提示
                            this.$message.error(res.msg)
                        }
                    })
                })
            },
            getEnterByProject(val) {
              let params = {
                projectId: val
              }
              this.$api.getEnterByProject(params).then(res => {
                if (res.code === 0) {
                  console.log(res.data)
                    this.enters = res.data
                } else {
                    // 失败提示
                    this.$message.error(res.msg)
                }
              })
            },
            //标记为管理人员
            assignAdmin(data) {
                let params = {
                  ids: this.selectListId.join(',')
                }
                console.log(ids)
                this.$api.assignAdmin(params).then(res => {
                  if (res.code === 0) {
                    this.getEmpList()
                    this.$message.success('标记成功')
                  } else {
                    // 失败提示
                    this.$message.error(res.msg)
                  }
                })
            },
            //执行导入
            getImportParameter (file) {
              this.$api.getImportEmpParameter().then(res => {
                if (res.code == 0) {
                  let fd = new window.FormData()
                  fd.append('file', file)
                  fd.append('zkGroup', res.data.zkGroup)
                  fd.append('zkAddress', res.data.zkAddress)
                  fd.append('classPath', res.data.classPath)
                  this.active = 2
                  this.$api.excelFileUpload(fd).then(res => {
                    if (res.code == 0) {
                      this.percentage = 100
                      this.result = res.data
                      window.clearInterval(this.getTime)
                    } else {
                      this.percentage = 0
                      window.clearInterval(this.getTime)
                      this.result = res.data
                    }
                    this.active = 3
                  }).catch(err => {
                    window.clearInterval(this.getTime)
                  })
                  this.getExportExcelSchedule()
                }
              })
            },
            //加载进度条
            getExportExcelSchedule () {
              this.progressBar = true
              this.getTime = setInterval(() => {
                  this.$api.getExportExcelSchedule().then(res => {
                  this.percentage = res.data
                })
              },500)
            },
            //关闭导入框
            cancelUpload () {
              this.percentage = 0
              this.progressBar = false
              this.fileName = ''
              this.file = ''
              this.showUpload = false
              this.active = 1
              this.findBudgetPage()
            },
            //导出数据
            exportEmpData () {
              let params = {
                projectId: this.formSearch.projectId,
                enterId: this.formSearch.enterId,
                empName: this.formSearch.empName,
                empTel: this.formSearch.empTel,
                empStatus: this.formSearch.empStatus
              }
              this.$api.exportEmpData(params).then(res => {
                if (res.code == 0 && res.data!="") {
                    //下载文件
                    this.$api.downLoadTempFileByName(res.data)
                } else {
                  this.$message.error(res.msg)
                }
              })
            },
            validatorIdNumber(val){
                this.$message.error('请选择导入的文件')
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
