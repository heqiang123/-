<template>
    <div class="container">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">
            <el-form-item label="档口名称" prop="stallName">
                <el-input v-model="formSearch.stallName" placeholder="档口名称"></el-input>
            </el-form-item>
          <el-form-item label="所属餐厅" prop="diningRoomId">
              <el-select v-model="formSearch.diningRoomId" placeholder="请选择所属餐厅">
                <el-option v-for="(item,index) in diningRoomList" :key="index" :label="item.diningRoomName" :value="item.id"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="dataStatus">
            <el-select v-model="formSearch.dataStatus" placeholder="状态">
              <el-option label="启用" value="0"></el-option>
              <el-option label="停用" value="1"></el-option>
            </el-select>
          </el-form-item>
            <el-form-item label=" " style="margin-left:50px;">
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="warning" plain @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 操作区----start -->
        <el-row class="mgb15">
          <el-button size="small" round type="primary" @click="openAdd">新增</el-button>
          <el-button size="small" round type="info" @click="uploadOpen">批量导入</el-button>
          <el-button size="small" round type="success" @click="changeStatus('0')">启用</el-button>
          <el-button size="small" round type="danger" @click="changeStatus('1')">停用</el-button>
          <!--<el-button size="small" round type="danger" @click="deleteDiningStallInfo('all')">批量删除</el-button>-->
        </el-row>
        <!-- 操作区----end -->

        <!-- 表格---start -->
        <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="60"></el-table-column>
            <el-table-column prop="stallName" label="档口名称" align="center"></el-table-column>
            <el-table-column prop="diningRoomName" label="所属餐厅" align="center"></el-table-column>
            <el-table-column prop="stallCode" label="档口编码" align="center"></el-table-column>
            <el-table-column prop="stallLink" label="档口链接" align="center"></el-table-column>
            <el-table-column prop="mainProduct" label="主营产品" align="center"></el-table-column>
            <el-table-column prop="dataStatus" label="状态" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.dataStatus=='0'?'启用':'停用' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="230" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" @click="getDetail(scope.row)">编辑</el-button>
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
      <el-dialog :title="openType == 'add'? '新增餐厅信息': '修改餐厅信息 '" :visible.sync="dialogAddVisible" width="700px"
                 :before-close="cancel">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :rules="rulesAdd" :model="formAdd"
                 ref='formAdd' class="add-dialog-form">
          <el-form-item label="档口名称" prop="stallName">
            <el-input v-model="formAdd.stallName" placeholder="档口名称"></el-input>
          </el-form-item>
          <el-form-item label="所属餐厅" prop="diningRoomId">
            <el-select v-model="formAdd.diningRoomId" placeholder="请选择所属餐厅">
              <el-option v-for="(item,index) in diningRoomList" :key="index" :label="item.diningRoomName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="档口简介" prop="stallDescribe">
            <el-input v-model="formAdd.stallDescribe" placeholder="档口简介"></el-input>
          </el-form-item>
          <el-form-item label="档口编码" prop="stallCode">
            <el-input v-model="formAdd.stallCode" placeholder="档口编码"></el-input>
          </el-form-item>
          <el-form-item label="档口链接" prop="stallLink">
            <el-input v-model="formAdd.stallLink" placeholder="档口链接"></el-input>
          </el-form-item>
          <el-form-item label="主营产品" prop="mainProduct">
            <el-input v-model="formAdd.mainProduct" placeholder="主营产品"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="dataStatus">
            <el-radio-group v-model="formAdd.dataStatus">
              <el-radio :label="0">启用</el-radio>
              <el-radio :label="1">停用</el-radio>
            </el-radio-group>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 新增弹框---end -->

    </div>
</template>

<script>
    export default {
        name: 'diningStallInfo',
        data() {
            return {
                formSearch: { //表单查询
                    stallName: '',
                    dataStatus: '',
                    diningRoomId:'',
                },
                selectListId: [],
                openType: 'mof', //add新增 mof修改
                diningRoomList: [],// 餐厅数据
                listLoading: false,//
                pageInfo: { //分页
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: 0
                },
                formAdd: { //表单添加

                },
                rulesAdd: {
                  stallName: [
                    {required: true, message: "请输入档口名称", trigger: "blur"}
                  ],
                  diningRoomId: [
                    {required: true, message: "请选择所属餐厅", trigger: "blur"}
                  ],
                  stallDescribe : [
                    {required: true, message: "请输入档口简介", trigger: "blur"}
                  ],
                  stallCode : [
                    {required: true, message: "请输入档口编码", trigger: "blur"}
                  ],
                  stallLink : [
                    {required: true, message: "请输入档口链接", trigger: "blur"}
                  ],
                  mainProduct : [
                    {required: true, message: "请选择主营产品", trigger: "blur"}
                  ],
                },
                tableData: [],
                dialogAddVisible: false,    //添加弹框显示
                labelPosition: 'right', //lable对齐方式
                labelWidth: '120px', //lable宽度
                formLabelWidth: '120px',
                dict: []
            };
        },
        computed: {},
        created() {
          this.findDiningRoomList();
        },
        mounted() {
            this.findDinningStallPage()
        },
        methods: {
            findDinningStallPage() {
                let params = {
                    page: this.pageInfo.currentPage,
                    limit: this.pageInfo.pageSize,
                    stallName: this.formSearch.stallName,
                    diningRoomId: this.formSearch.diningRoomId,
                    dataStatus : this.formSearch.dataStatus,
                }
                this.$api.findDinningStallPage(params).then(res => {
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
                this.findDinningStallPage()
            },
            reset() {
                this.formSearch.stallName = ''
                this.formSearch.dataStatus = ''
                this.formSearch.diningRoomId = ''
            },
            handleSizeChange(size) {
                this.pageInfo.currentPage = 1
                this.pageInfo.pageSize = size
                this.findDinningStallPage()
            },
            handleCurrentChange(currentPage) {
                this.pageInfo.currentPage = currentPage
                this.findDinningStallPage()
            },
            submit() {
                  if (this.openType == 'add') {
                    this.addDiningStallInfo()
                  } else {
                    this.modifyDiningStallInfo()
                  }
            },
            addDiningStallInfo(){
              this.$refs['formAdd'].validate((valid) => {
                if (valid) {
                  this.$api.addDiningStallInfo(this.formAdd).then(res => {
                    if (res.code === 0) {
                      this.cancel()
                      this.findDinningStallPage()
                      this.$message.success('新增成功')
                    } else {
                      // 失败提示
                      this.$message.error(res.msg)
                    }
                  })
                }
              })
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
                this.openType = 'mof'
                this.dialogAddVisible = true
                this.formAdd = data
            },
            // 餐厅列表
            findDiningRoomList(){
              this.$api.findDiningRoomList().then(res => {
                if (res.code === 0) {
                  this.diningRoomList = res.data;
                } else {
                  this.$message.error(res.msg)
                }
              })
            },
            modifyDiningStallInfo() {
              this.$api.modifyDiningStallInfo(this.formAdd).then(res => {
                if (res.code === 0) {
                  this.cancel()
                  this.findDinningStallPage()
                  this.$message.success('修改成功')
                } else {
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
            changeStatus(status) {
              let params = {
                ids: this.selectListId.join(','),
                dataStatus: status
              }
              if(this.selectListId.length==0){
                this.$message.error("请至少选择一条数据")
              }else{
                this.$api.modifyDiningStallInfoStatus(params).then(res => {
                  if (res.code === 0) {
                    this.$message.success('修改成功')
                    this.findDinningStallPage()
                  } else {
                    // 失败提示
                    this.$message.error(res.msg)
                  }
                })
              }
            },
            deleteDiningStallInfo(type, id) {
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
                this.$api.deleteDiningStallInfo(params).then(res => {
                  if (res.code === 0) {
                    this.$message.success('删除成功')
                    this.findDinningStallPage()
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
</style>
