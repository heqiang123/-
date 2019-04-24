<template>
    <div class="container">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">
            <el-form-item label="园区名称">
              <el-select placeholder="请选择园区" filterable v-model="formSearch.projectId"  style="width:160px;">
                  <el-option v-for="item in projects"
                             :key="item.projectId"
                             :value="item.projectId"
                              :label="item.projectName">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="活动标题">
                <el-input v-model="formSearch.activityName" placeholder="活动标题" style="width:170px;"></el-input>
            </el-form-item>
            <el-form-item label="开始时间">
                <el-date-picker
                  v-model="formSearch.activityBegTime"
                  type="datetime"
                  placeholder="选择活动开始时间"
                  style="width:196px;">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="formSearch.activityEndTime"
                type="datetime"
                placeholder="选择活动结束时间"
                style="width:196px;">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="活动状态">
                <el-select v-model="formSearch.dataStatus" placeholder="活动状态" style="width:106px;">
                    <el-option label="上架" value="1"></el-option>
                    <el-option label="下架" value="2"></el-option>
                    <el-option label="作废" value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label=" " style="margin-left:10px;">
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="warning" plain @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 操作区----start -->
        <el-row class="mgb15">
            <el-button size="small" round type="primary" @click="">新增活动</el-button>
            <el-button size="small" round  @click="upperActivityStatus('all','upperShelf')">上架活动</el-button>
            <el-button size="small" round  @click=" upperActivityStatus('all','downShelf')">下架活动</el-button>
            <el-button size="small" round type="danger" @click=" upperActivityStatus('all','delete')">删除活动</el-button>
        </el-row>
        <!-- 操作区----end -->
        <!-- 表格---start -->
        <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="36">
            </el-table-column>
            <el-table-column prop="projectName" label="所属园区" align="center">
            </el-table-column>
            <el-table-column prop="activityName" label="活动标题" align="center">
            </el-table-column>
            <el-table-column label="活动时间" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.activityBegTime}}</span><br>
                <span>至</span><br>
                <span>{{ scope.row.activityEndTime }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="activityCeiling" label="人数上限(人)" align="center" width="102">
            </el-table-column>
            <el-table-column label="报名时间" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.applyBegTime}}</span><br>
                <span>至</span><br>
                <span>{{ scope.row.applyEndTime }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="applyScope" label="报名范围" align="center" width="80">
              <template slot-scope="scope">
                <span>{{ scope.row.applyScope=='0'?'全部':scope.row.applyScope=='1'?'企业':'游客' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="integralScope" label="积分底限(分)" align="center" width="102">
            </el-table-column>
            <el-table-column prop="price" label="报名费用" align="center">
            </el-table-column>
            <el-table-column prop="dataStatus" label="活动状态" align="center" width="80">
               <template slot-scope="scope">
                <span>{{ scope.row.dataStatus=='1'?'上架':'下架' }}</span>
               </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="330" align="center">
                <template slot-scope="scope">
                    <el-button class="btn-size" size="mini" title="编辑" plain type="success" icon="el-icon-edit" @click="getDetail(scope.row)">编辑</el-button>
                    <el-button class="btn-size" size="mini" title="删除" plain type="danger" icon="el-icon-delete" @click="upperActivityStatus('one','delete',scope.row.id)">删除</el-button>
                    <el-button class="btn-size" size="mini" title="查看报名" plain icon="el-icon-document" @click="showActivityUserInfo(scope.row.id)">报名</el-button>
                    <el-button class="btn-size" size="mini" title="查看评分" plain icon="el-icon-star-off" @click="">评分</el-button>
                    <el-button class="btn-size" size="mini" title="查看评论" plain icon="el-icon-menu" @click="">评论</el-button>
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
                tableData: [],
                dialogAddVisible: false,    //添加弹框显示
                labelPosition: 'right', //lable对齐方式
                labelWidth: '80px', //lable宽度
                formLabelWidth: '120px',
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
            this.getActivityList()
        },
        methods: {
            handleChange(value) {
                this.selectedOptions = value[value.length - 1].split(',')
            },
            getActivityList() {
                let params = {
                    page: this.pageInfo.currentPage,
                    limit: this.pageInfo.pageSize,
                    projectId: this.formSearch.projectId,
                    activityName: this.formSearch.activityName,
                    activityBegTime: this.formSearch.activityBegTime,
                    activityEndTime: this.formSearch.activityEndTime,
                    dataStatus: this.formSearch.dataStatus

                }
                this.$api.getActivityList(params).then(res => {
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
                  this.$router.push({ path: "/activityApplyUserInfo" ,query:{activityId:activityId} });
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
