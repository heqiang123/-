<template>
    <div class="container">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">
            <el-form-item label="用户姓名" prop="employeeName">
                <el-input v-model="formSearch.employeeName" placeholder="用户姓名"></el-input>
            </el-form-item>
            <el-form-item label="大区名称" prop="depName">
                <el-input v-model="formSearch.depName" placeholder="大区名称"></el-input>
            </el-form-item>
            <el-form-item label="子公司名称" prop="cusName">
                <el-input v-model="formSearch.cusName" placeholder="子公司名称"></el-input>
            </el-form-item>
            <el-form-item label="岗位名称" prop="regionName">
                <el-input v-model="formSearch.regionName" placeholder="岗位名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="warning" plain @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 操作区----start -->
        <el-row class="mgb15">
            <el-button size="small" round type="primary" @click="openAdd">新增</el-button>
            <el-button size="small" round type="danger" @click="deleteEmpCustomerRel('all')">批量删除</el-button>
            <el-button size="small" round type="primary">
                <a href="/static/template/员工子公司关系.xls" download="员工子公司关系.xls" style="color:#fff;">下载模版</a>
            </el-button>
            <el-button size="small" round type="primary" @click="uploadOpen('cover')">覆盖上传</el-button>
            <el-button size="small" round type="primary" @click="uploadOpen('incremental')">增量上传</el-button>
            <el-button size="small" round type="primary" @click="exportTem">导出</el-button>
        </el-row>
        <!-- 操作区----end -->
        <!-- 表格---start -->
        <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="60">
            </el-table-column>
            <el-table-column prop="employeeName" label="用户姓名" align="center">
            </el-table-column>
            <el-table-column prop="employeeNo" label="用户编码" align="center">
            </el-table-column>
            <el-table-column prop="email" label="邮箱" align="center">
            </el-table-column>
            <el-table-column prop="depName" label="大区名称" align="center">
            </el-table-column>
            <el-table-column prop="regionName" label="省区名称" align="center">
            </el-table-column>
            <el-table-column prop="cusName" label="子公司名称" align="center">
            </el-table-column>
            <el-table-column prop="cusCode" label="子公司编码" align="center">
            </el-table-column>
            <el-table-column prop="empPositionCode" label="岗位编码" align="center">
            </el-table-column>
            <el-table-column prop="empPosition" label="岗位名称" align="center">
            </el-table-column>
            <!-- <el-table-column  label="用户类型" align="center" width="100">
                 <template slot-scope="scope">
                    <span>{{ scope.row.empType=='0'?'员工':'经理' }}</span>
                </template>
            </el-table-column> -->
            <el-table-column label="操作" width="230" align="center">
                <template slot-scope="scope">
                    <!-- <el-button size="mini" plain type="primary" >详情</el-button> -->
                    <el-button size="mini" @click="getDetail(scope.row)">编辑</el-button>
                    <el-button size="mini" plain type="danger" @click="deleteEmpCustomerRel('one', scope.row.id)">删除
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
        <el-dialog :title="openType == 'add'? '新增关联关系': '修改信息 '" :visible.sync="dialogAddVisible" width="700px"
                   :before-close="cancel">
            <el-form :label-position="labelPosition" :label-width="labelWidth" :rules="rulesAdd" :model="formAdd"
                     ref='formAdd' class="add-dialog-form">
                <el-form-item label="用户编码" prop="employeeNo">
                    <el-input v-model="formAdd.employeeNo" placeholder="用户编码"></el-input>
                </el-form-item>
                <el-form-item label="子公司编码" prop="cusCode">
                    <el-input v-model="formAdd.cusCode" placeholder="子公司CRM编码"></el-input>
                </el-form-item>
                <!-- <el-form-item label="用户类型" prop="empType">
                        <el-radio-group v-model="formAdd.empType">
                        <el-radio label="qz">区长</el-radio>
                        <el-radio label="dz">店长</el-radio>
                    </el-radio-group>
                </el-form-item> -->

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 新增弹框---end -->
        <el-dialog title="上传" :visible.sync="showUpload" width="700px" :before-close="cancelUpload">
            <div class="upload-content">
                <el-upload
                        class="upload-block"
                        drag
                        action=""
                        :on-progress="upProgress"
                        :before-upload="beforeAvatarUpload">
                    <div v-show="!isprogress">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            <p class="up-tips">点击或将文件拖拽到这里上传</p>
                            <p>支持扩展名：<span class="red-text">.xls .xslx</span></p>
                        </div>
                    </div>
                    <div v-show="fileName">
                        <p class="up-tips">{{fileName}}</p>
                    </div>
                </el-upload>
                <div class="progres-bar">
                    <el-progress :text-inside="true" :stroke-width="18" :percentage="percentage"
                                 status="success"></el-progress>
                </div>

            </div>
            <div slot="footer" class="dialog-footer">
                <!-- <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button> -->
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "empCustomerRelManage",
        data() {
            return {
                percentage: 0,
                showUpload: false,
                formSearch: { //表单查询
                    employeeName: '',
                    depName: '',
                    cusName: '',
                    regionName: ''
                },
                selectListId: [],
                openType: 'add', //add新增 mof修改
                listLoading: false,//
                pageInfo: { //分页
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: 0
                },
                formAdd: { //表单添加
                    employeeNo: '',
                    shopid: '',
                    empType: ''
                },
                rulesAdd: {
                    employeeNo: [
                        {required: true, message: "请输入用户姓名", trigger: "blur"}
                    ],
                    cusCode: [{required: true, message: "请输入子公司CEM编码", trigger: "blur"}]
                },
                tableData: [],
                dialogAddVisible: false,    //添加弹框显示
                labelPosition: 'right', //lable对齐方式
                labelWidth: '80px', //lable宽度
                formLabelWidth: '120px',
                isprogress: false,
                fileName: '',
                file: '',
                uploadType: '',
                getTime: null
            };
        },
        mounted() {
            this.getEmpCustomerRel()
        },
        methods: {
            exportTem() {
                let params = {
                    employeeName: this.formSearch.employeeName,
                    depName: this.formSearch.depName,
                    cusName: this.formSearch.cusName,
                    regionName: this.formSearch.regionName
                }
                this.$api.empCustomerRelExportData(params).then(res => {
                    if (res.code == 0) {
                        this.downloadTempFile(res.data)
                    }
                })
            },
            downloadTempFile(file) {
                let params = {
                    fileName: file
                }
                this.$api.downLoadTempFileByName(file).then(res => {
                    if (res.code == 0) {

                    }
                })
            },
            cancelUpload() {
                this.fileName = ''
                this.file = ''
                this.percentage = 0
                this.showUpload = false
            },
            upProgress() {
                this.isprogress = true
                this.getImportParameter()
            },
            getImportParameter() {
                this.$api.getImportEmpCustomerRelParameter().then(res => {
                    if (res.zkGroup) {
                        let fd = new window.FormData()
                        fd.append('file', this.file)
                        fd.append('zkGroup', res.zkGroup)
                        fd.append('zkAddress', res.zkAddress)
                        fd.append('classPath', res.classPath)
                        fd.append('params', this.uploadType)
                        this.$api.excelFileUpload(fd).then(res => {
                            if (res.code == 0) {
                                this.percentage = 100
                                window.clearInterval(this.getTime)
                            } else {
                                this.percentage = 0
                                window.clearInterval(this.getTime)
                            }
                        }).catch(err => {
                            window.clearInterval(this.getTime)
                        })
                        this.getExportExcelSchedule()
                    }
                })
            },
            getExportExcelSchedule() {
                this.getTime = setInterval(() => {
                    this.$api.getExportExcelSchedule().then(res => {
                        this.percentage = res.data
                    })
                }, 1000)
            },
            // 验证上传文件
            beforeAvatarUpload(file) {
                this.fileName = file.name
                this.file = file
            },
            getEmpCustomerRel() {
                let params = {
                    page: this.pageInfo.currentPage,
                    limit: this.pageInfo.pageSize,
                    employeeName: this.formSearch.employeeName,
                    depName: this.formSearch.depName,
                    cusName: this.formSearch.cusName,
                    regionName: this.formSearch.regionName
                }
                this.$api.findByPageEmpCustomerRel(params).then(res => {
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
                this.getEmpCustomerRel()
            },
            reset() {
                this.formSearch.employeeName = ''
                this.formSearch.depName = ''
                this.formSearch.cusName = ''
                this.formSearch.regionName = ''
            },
            handleSizeChange(size) {
                this.pageInfo.currentPage = 1
                this.pageInfo.pageSize = size
                this.getEmpCustomerRel()
            },
            handleCurrentChange(currentPage) {
                this.pageInfo.currentPage = currentPage
                this.getEmpCustomerRel()
            },
            addEmpCustomerRel() {
                this.$refs['formAdd'].validate((valid) => {
                    if (valid) {
                        this.$api.addSaveEmpCustomerRel(this.formAdd).then(res => {
                            if (res.code === 0) {
                                this.cancel()
                                this.getEmpCustomerRel()
                                this.$message.success('新增成功')
                            } else {
                                // 失败提示
                                this.$message.error(res.msg)
                            }
                        })
                    }
                })
            },
            uploadOpen(type) {
                this.showUpload = true
                this.uploadType = type
            },
            submit() {
                if (this.openType == 'add') {
                    this.addEmpCustomerRel()
                } else {
                    this.editEmpCustomerRel()
                }
            },
            openAdd() {
                this.openType = 'add'
                this.dialogAddVisible = true
            },
            cancel() {
                this.dialogAddVisible = false
                this.formAdd = {}
            },
            getDetail(data) {
                let params = {
                    id: data.id
                }
                this.$api.getDetialEmpCustomerRel(params).then(res => {
                    if (res.code === 0) {
                        this.openType = 'mof'
                        this.dialogAddVisible = true
                        this.formAdd = res.data
                    } else {
                        // 失败提示
                        this.$message.error(res.msg)
                    }
                })
            },
            editEmpCustomerRel() {
                let params = {
                    id: this.formAdd.id,
                    employeeNo: this.formAdd.employeeNo,
                    cusCode: this.formAdd.cusCode
                }
                this.$api.editSaveEmpCustomerRel(params).then(res => {
                    if (res.code === 0) {
                        this.cancel()
                        this.getEmpCustomerRel()
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
                    this.selectListId.push(item.id)
                });
                console.log(this.selectListId)
            },
            deleteEmpCustomerRel(type, id) {
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
                    this.$api.empCustomerRelBatchDeleteData(params).then(res => {
                        if (res.code === 0) {
                            this.getEmpCustomerRel()
                            this.$message.success('删除成功')
                        } else {
                            // 失败提示
                            this.$message.error(res.msg)
                        }
                    })
                })
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

    .upload-content {
        text-align: center;
    }

    .progres-bar {
        width: 350px;
        margin: 0 auto;
    }
</style>
