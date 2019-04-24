<template>
    <div class="container">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">
            <el-form-item label="餐厅名称" prop="diningRoomName">
                <el-input v-model="formSearch.diningRoomName" placeholder="餐厅名称"></el-input>
            </el-form-item>
          <el-form-item label="状态" prop="dataStatus">
            <el-select v-model="formSearch.dataStatus" placeholder="状态">
              <el-option label="启用" value="0"></el-option>
              <el-option label="停用" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="餐厅设备厂商" prop="diningTerminalManufacturer">
            <el-select v-model="formSearch.diningTerminalManufacturer" placeholder="请选择所属餐厅">
              <el-option v-for="(item,index) in terminalManufacturerList" :key="index" :label="item.dname" :value="item.dcode"></el-option>
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
          <!--<el-button size="small" round type="danger" @click="deleteDiningRoomInfo('all')">批量删除</el-button>-->
        </el-row>
        <!-- 操作区----end -->

        <!-- 表格---start -->
        <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="60"></el-table-column>
            <el-table-column prop="diningRoomName" label="餐厅名称" align="center"></el-table-column>
            <el-table-column prop="diningRoomCode" label="餐厅编码" align="center"></el-table-column>
            <el-table-column prop="diningRoomAddress" label="餐厅地址" align="center"></el-table-column>
            <el-table-column prop="diningRoomArea" label="餐厅面积" align="center"></el-table-column>
            <el-table-column prop="diningRoomNum" label="可容纳人数" align="center"></el-table-column>
            <el-table-column prop="diningTerminalManufacturer" label="设备厂商" align="center"></el-table-column>
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
          <el-form-item label="餐厅名称" prop="diningRoomName">
            <el-input v-model="formAdd.diningRoomName" placeholder="餐厅名称"></el-input>
          </el-form-item>
          <el-form-item label="餐厅简介" prop="diningRoomIntroduce">
            <el-input v-model="formAdd.diningRoomIntroduce" placeholder="餐厅简介"></el-input>
          </el-form-item>
          <el-form-item label="所属项目" prop="projectId">
            <el-input v-model="formAdd.projectId" placeholder="所属项目"></el-input>
          </el-form-item>
          <el-form-item label="餐厅编码" prop="diningRoomCode">
            <el-input v-model="formAdd.diningRoomCode" placeholder="餐厅编码"></el-input>
          </el-form-item>
          <el-form-item label="餐厅地址" prop="diningRoomAddress">
            <el-input v-model="formAdd.diningRoomAddress" placeholder="餐厅地址"></el-input>
          </el-form-item>
          <el-form-item label="餐厅面积" prop="diningRoomArea">
            <el-input v-model="formAdd.diningRoomArea" placeholder="餐厅面积"></el-input>
          </el-form-item>
          <el-form-item label="可容纳人数" prop="diningRoomNum">
            <el-input v-model="formAdd.diningRoomNum" placeholder="可容纳人数"></el-input>
          </el-form-item>
          <el-form-item label="餐厅合作方" prop="diningRoomPartner">
            <el-input v-model="formAdd.diningRoomPartner" placeholder="餐厅合作方"></el-input>
          </el-form-item>
          <el-form-item label="餐厅设备厂商" prop="diningTerminalManufacturer">
            <el-select v-model="formAdd.diningTerminalManufacturer" placeholder="请选择所属餐厅">
              <el-option v-for="(item,index) in terminalManufacturerList" :key="index" :label="item.dname" :value="item.dcode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否为智慧餐厅" prop="isWisdom">
            <el-radio-group v-model="formAdd.isWisdom">
               <el-radio label="0">是</el-radio>
               <el-radio label="1">否</el-radio>
            </el-radio-group>
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
        name: 'diningRoomInfo',
        data() {
            return {
                formSearch: { //表单查询
                  diningRoomName: '',
                  dataStatus: '',
                  diningTerminalManufacturer: '',
                },
                selectListId: [],
                terminalManufacturerList: [],// 餐厅厂商设备列表
                openType: 'mof', //add新增 mof修改
                listLoading: false,//
                pageInfo: { //分页
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: 0
                },
                formAdd: { //表单添加

                },
                rulesAdd: {
                  diningRoomName: [
                    {required: true, message: "请输入餐厅名称", trigger: "blur"}
                  ],
                  projectId: [
                    {required: true, message: "请输入餐厅所属项目", trigger: "blur"}
                  ],
                  diningRoomCode : [
                    {required: true, message: "请输入餐厅编码", trigger: "blur"}
                  ],
                  diningRoomAddress : [
                    {required: true, message: "请输入餐厅地址", trigger: "blur"}
                  ],
                  diningRoomArea : [
                    {required: true, message: "请输入餐厅面积", trigger: "blur"}
                  ],
                  diningRoomNum : [
                    {required: true, message: "请输入最大就餐人数", trigger: "blur"}
                  ],
                  diningRoomPartner : [
                    {required: true, message: "请输入餐厅合作伙伴方", trigger: "blur"}
                  ],
                  isWisdom : [
                    {required: true, message: "请选择是否为智慧餐厅", trigger: "blur"}
                  ],
                  diningRoomIntroduce : [
                    {required: true, message: "请输入餐厅简介", trigger: "blur"}
                  ],
                  diningTerminalManufacturer : [
                    {required: true, message: "请选择餐厅设备厂商", trigger: "blur"}
                  ],
                  dataStatus : [
                    {required: true, message: "请选择状态", trigger: "blur"}
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
          this.$api.getDictTerminalManufacturer(this.formAdd).then(res => {
            if (res.code === 0) {
              this.terminalManufacturerList = res.data
            } else {
              this.$message.error(res.msg)
            }
          })
        },
        mounted() {
            this.getDiningRoomInfoPage()
        },
        methods: {
            getDiningRoomInfoPage() {
                let params = {
                    page: this.pageInfo.currentPage,
                    limit: this.pageInfo.pageSize,
                    diningRoomName: this.formSearch.diningRoomName,
                    dataStatus : this.formSearch.dataStatus,
                    diningTerminalManufacturer : this.formSearch.diningTerminalManufacturer,
                }
                this.$api.getDiningRoomInfoPage(params).then(res => {
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
                this.getDiningRoomInfoPage()
            },
            reset() {
                this.formSearch.diningRoomName = ''
                this.formSearch.dataStatus = ''
                this.formSearch.diningTerminalManufacturer = ''
            },
            handleSizeChange(size) {
                this.pageInfo.currentPage = 1
                this.pageInfo.pageSize = size
                this.getDiningRoomInfoPage()
            },
            handleCurrentChange(currentPage) {
                this.pageInfo.currentPage = currentPage
                this.getDiningRoomInfoPage()
            },
            submit() {
                  if (this.openType == 'add') {
                    this.addDiningRoomInfo()
                  } else {
                    this.modifyDiningRoomInfo()
                  }
            },
            addDiningRoomInfo(){
              this.$refs['formAdd'].validate((valid) => {
                if (valid) {
                  this.$api.addDiningRoomInfo(this.formAdd).then(res => {
                    if (res.code === 0) {
                      this.cancel()
                      this.getDiningRoomInfoPage()
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
            modifyDiningRoomInfo() {
              this.$api.modifyDiningRoomInfo(this.formAdd).then(res => {
                if (res.code === 0) {
                  this.cancel()
                  this.getDiningRoomInfoPage()
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
            },
            changeStatus(status) {
              let params = {
                ids: this.selectListId.join(','),
                dataStatus: status
              }
              if(this.selectListId.length==0){
                this.$message.error("请至少选择一条数据")
              }else{
                this.$api.modifyDiningRoomInfoStatus(params).then(res => {
                  if (res.code === 0) {
                    this.$message.success('修改成功')
                    this.getDiningRoomInfoPage()
                  } else {
                    // 失败提示
                    this.$message.error(res.msg)
                  }
                })
              }
            },
            deleteDiningRoomInfo(type, id) {
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
                this.$api.deleteDiningRoomInfo(params).then(res => {
                  if (res.code === 0) {
                    this.$message.success('删除成功')
                    this.getDiningRoomInfoPage()
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
