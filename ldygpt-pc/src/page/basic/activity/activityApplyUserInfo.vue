<template>
    <div class="container">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">
            <el-form-item label="企业名称" style="width:18%;">
              <el-select placeholder="请选择企业" filterable v-model="formSearch.enterCode"  style="width:200px;">
                  <el-option v-for="item in enters"
                             :key="item.enterCode"
                             :value="item.enterCode"
                              :label="item.enterName">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="人员名称" style="width:18%;">
                <el-input v-model="formSearch.empName" placeholder="人员名称" style="width:200px;"></el-input>
            </el-form-item>
            <el-form-item label="报名电话" style="width:18%;">
              <el-input v-model="formSearch.applyUserTel" placeholder="报名电话" style="width:200px;"></el-input>
            </el-form-item>
            <el-form-item label="人员类型" style="width:18%;">
              <el-select v-model="formSearch.applyUserType" placeholder="人员类型" style="width:200px;">
                <el-option label="企业人员" value="0"></el-option>
                <el-option label="游客" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="支付状态" style="width:18%;">
                <el-select v-model="formSearch.paymentStatus" placeholder="支付状态" style="width:200px;">
                    <el-option label="未支付" value="0"></el-option>
                    <el-option label="已支付" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="报名状态" style="width:18%;">
              <el-select v-model="formSearch.applyStatus" placeholder="报名状态" style="width:200px;">
                <el-option label="已报名" value="0"></el-option>
                <el-option label="已取消" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label=" " style="margin-left:10px;">
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="warning" plain @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 操作区----start -->
        <el-row class="mgb15">
            <el-button size="small" round @click="">取消报名</el-button>
            <el-button size="small" round @click="back()">返回活动</el-button>
        </el-row>
        <!-- 操作区----end -->
        <!-- 表格---start -->
        <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="36">
            </el-table-column>
            <el-table-column prop="projectName" label="所属企业" align="center">
            </el-table-column>
            <el-table-column prop="activityName" label="用户名称" align="center">
            </el-table-column>
            <el-table-column prop="activityTime" label="电话号码" align="center">
            </el-table-column>
            <el-table-column prop="activityCeiling" label="人员类型" align="center">
            </el-table-column>
            <el-table-column prop="applyTime" label="支付状态" align="center">
            </el-table-column>
            <el-table-column prop="applyScope" label="报名状态" align="center">
            </el-table-column>
            <el-table-column prop="integralScope" label="报名时间" align="center">
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

    </div>
</template>

<script>
    export default {
        name: 'activityInfo',
        data() {
            return {
                formSearch: { //表单查询
                    projectId: '',
                    activityName: '',
                    activityTime: '',
                    dataStatus: ''
                },
                activityId:this.$route.query.activityId,
                showUpload:false,
                selectedStore: [],
                options: [],
                selectedOptions: [],
                passwordDialog: false,
                selectListId: [],
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
                tableData: [],
                dialogAddVisible: false,    //添加弹框显示
                labelPosition: 'right', //lable对齐方式
                labelWidth: '80px', //lable宽度
                formLabelWidth: '120px',
                fileName: '',
                file: '',
                uploadType:'incremental',
                currentId:'',
                percentage: 0,
                result: '',
                progressBar: false,
                active: 1
            };
        },
        mounted() {
            this.getActivityList()
        },
        methods: {
            back(){
              this.$router.push('/activityInfo')
            },
            handleChange(value) {
                this.selectedOptions = value[value.length - 1].split(',')
            },
            getActivityApplyUserList() {
                let params = {
                    page: this.pageInfo.currentPage,
                    limit: this.pageInfo.pageSize,
                    enterCode: this.formSearch.enterCode,
                    empName: this.formSearch.empName,
                    empTel: this.formSearch.empTel,
                    applyUserType: this.formSearch.applyUserType,
                    paymentStatus: this.formSearch.paymentStatus,
                    applyStatus: this.formSearch.applyStatus,
                    activityId: this.activityId

                }
                this.$api.getActivityApplyUserList(params).then(res => {
                    if (res.code == 0) {
                        this.pageInfo.pageTotal = res.count
                        this.tableData = res.data
                        this.enters = res.enters
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            },
            uploadOpen() {
              this.showUpload = true
            },
            search() {
                this.pageInfo.currentPage = 1
                this.getActivityList()
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
            handleSelectionChange(val) {
                this.selectListId = []
                val.forEach(item => {
                    this.selectListId.push(item.uid)
                });
            },
            showActivityUserInfo(activityId){
                  this.$router.replace({ name: "showActivityUserInfo" ,params:{id:activityId} });
             },
            //修改活动状态
            upperActivityStatus(model,type,id) {
              let title = '';
              if(type == 'upperShelf'){
                title = '上架';
              }else if(type == 'downShelf'){
                title = '下架';
              }else if(type == 'delete'){
                title = '作废';
              }
              this.$confirm('确定要'+title+'吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                let params = {
                  ids: '',
                  status:type
                }
                if (type == 'all') {
                  params.ids = this.selectListId.join(',')
                } else {
                  params.ids = id
                }
                this.$api.upperActivityStatus(params).then(res => {
                  if (res.code === 0) {
                    this.getActivityList()
                    this.$message.success('上架成功')
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

    .container {
        .btn-size {
            padding: 4px 5px;
        }

        .el-button + .el-button {
            margin-left: 5px;
        }
    }
</style>
