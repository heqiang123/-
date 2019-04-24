<template>
    <div class="container">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">
            <el-form-item label="租户名称" prop="tenementName">
                <el-input v-model="formSearch.tenementName" placeholder="租户名称"></el-input>
            </el-form-item>
            <el-form-item label="租户编码" prop="tenementCode">
                <el-input v-model="formSearch.tenementCode" placeholder="租户编码"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="formSearch.status" placeholder="状态">
                    <el-option label="生效" value="A"></el-option>
                    <el-option label="失效" value="D"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="warning" plain @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 操作区----start -->
        <el-row class="mgb15">
            <el-button size="small" round type="primary" @click="openAdd">新增</el-button>
            <el-button size="small" round @click="change('A')">生效</el-button>
            <el-button size="small" round @click="change('D')">失效</el-button>
            <el-button size="small" round type="danger" @click="deleteTenement('all')">批量删除</el-button>
        </el-row>
        <!-- 操作区----end -->
        <!-- 表格---start -->
        <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="60">
            </el-table-column>
            <el-table-column prop="tenementName" label="租户名称" align="center">
            </el-table-column>
            <el-table-column prop="tenementCode" label="租户编码" align="center">
            </el-table-column>
            <el-table-column label="租户状态" align="center" width="100">
                <template slot-scope="scope">
                    <span>{{ scope.row.status=='A'?'生效':'失效' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="createDate" label="创建日期" align="center" :formatter="this.$common.timestampToTime">
            </el-table-column>
            <el-table-column label="操作" width="230" align="center">
                <template slot-scope="scope">
                    <!-- <el-button size="mini" plain type="primary" >详情</el-button> -->
                    <el-button size="mini" @click="getDetail(scope.row)">编辑</el-button>
                    <el-button size="mini" plain type="danger" @click="deleteTenement('one', scope.row.id)">删除
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
        <el-dialog :title="openType == 'add'? '新增租户': '修改信息 '" :visible.sync="dialogAddVisible" width="700px"
                   :before-close="cancel">
            <el-form :label-position="labelPosition" :label-width="labelWidth" :rules="rulesAdd" :model="formAdd"
                     ref='formAdd' class="add-dialog-form">
                <el-form-item label="租户名称" prop="tenementName">
                    <el-input v-model="formAdd.tenementName" placeholder="租户名称"></el-input>
                </el-form-item>
                <el-form-item label="租户编码" prop="tenementCode">
                    <el-input v-model="formAdd.tenementCode" placeholder="租户编码"></el-input>
                </el-form-item>
                <el-form-item label="类别" prop="status">
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
    </div>
</template>

<script>
    export default {
        name: 'trackTask',
        data() {
            return {
                formSearch: { //表单查询
                    tenementName: '',
                    tenementCode: '',
                    status: ''
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
                    tenementName: '',
                    tenementCode: '',
                    status: ''
                },
                rulesAdd: {
                    tenementName: [
                        {required: true, message: "请输入租户名称", trigger: "blur"}
                    ],
                    tenementCode: [{required: true, message: "请输入租户编码", trigger: "blur"}],
                    status: [{required: true, message: "请选择状态", trigger: "blur"}]
                },
                tableData: [],
                dialogAddVisible: false,    //添加弹框显示
                labelPosition: 'right', //lable对齐方式
                labelWidth: '80px', //lable宽度
                formLabelWidth: '120px'
            };
        },
        mounted() {
            this.getTenementList()
        },
        methods: {
            getTenementList() {
                let params = {
                    pageNo: this.pageInfo.currentPage,
                    pageSize: this.pageInfo.pageSize,
                    tenementName: this.formSearch.tenementName,
                    tenementCode: this.formSearch.tenementCode,
                    status: this.formSearch.status
                }
                this.$api.getTenementList(params).then(res => {
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
                this.getTenementList()
            },
            reset() {
                this.formSearch.tenementName = ''
                this.formSearch.tenementCode = ''
                this.formSearch.status = ''
            },
            handleSizeChange(size) {
                this.pageInfo.currentPage = 1
                this.pageInfo.pageSize = size
                this.getTenementList()
            },
            handleCurrentChange(currentPage) {
                this.pageInfo.currentPage = currentPage
                this.getTenementList()
            },
            addTenement() {
                this.$refs['formAdd'].validate((valid) => {
                    if (valid) {
                        this.$api.addTenement(this.formAdd).then(res => {
                            if (res.code === 0) {
                                this.cancel()
                                this.getTenementList()
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
                    this.addTenement()
                } else {
                    this.modifyTenement()
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
                console.log(data)
                let params = {
                    tenementId: data.id
                }
                this.$api.getTenementDetail(params).then(res => {
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
            modifyTenement() {
                delete this.formAdd.createDate
                this.$api.modifyTenement(this.formAdd).then(res => {
                    if (res.code === 0) {
                        this.cancel()
                        this.getTenementList()
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
            change(status) {
                let params = {
                    tenementIds: this.selectListId.join(','),
                    status: 'A'
                }
                if (status == 'D') {
                    params.status = 'D'
                }
                this.$api.modifyTenementStatus(params).then(res => {
                    if (res.code === 0) {
                        this.getTenementList()
                        this.$message.success('修改成功')
                    } else {
                        // 失败提示
                        this.$message.error(res.msg)
                    }
                })
            },
            deleteTenement(type, id) {
                this.$confirm('确定要删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = {
                        tenementIds: ''
                    }
                    if (type == 'all') {
                        params.tenementIds = this.selectListId.join(',')
                    } else {
                        params.tenementIds = id
                    }
                    this.$api.deleteTenement(params).then(res => {
                        if (res.code === 0) {
                            this.getTenementList()
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
</style>
