<template>
    <div class="container">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">
            <el-form-item label="子任务名称" prop="subTaskName">
                <el-input v-model="formSearch.subTaskName" placeholder="子任务名称"></el-input>
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
            <el-button size="small" round type="danger" @click="deleteSubTask('all')">批量删除</el-button>
        </el-row>
        <!-- 操作区----end -->
        <!-- 表格---start -->
        <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="60">
            </el-table-column>
            <el-table-column prop="subTaskName" label="子任务名称" align="center">
            </el-table-column>
            <el-table-column prop="subTaskDesc" label="子任务说明" align="center">
            </el-table-column>
            <el-table-column label="是否可打分" align="center" width="150">
                <template slot-scope="scope">
                    <span>{{ scope.row.isScore=='Y'?'是':'否' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center" width="150">
                <template slot-scope="scope">
                    <span>{{ scope.row.status=='A'?'生效':'失效' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="creator" label="创建人" align="center">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center" :formatter="this.$common.timestampToTime">
            </el-table-column>
            <el-table-column label="操作" width="230" align="center">
                <template slot-scope="scope">
                    <!-- <el-button size="mini" plain type="primary" >详情</el-button> -->
                    <el-button size="mini" @click="getDetail(scope.row)">编辑</el-button>
                    <el-button size="mini" plain type="danger" @click="deleteSubTask('one', scope.row.id)">删除
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

        <!-- 新增子任务弹框---start -->
        <el-dialog :title="openType == 'add'? '新增巡店子任务': '修改巡店子任务'" :visible.sync="dialogAddVisible" width="700px"
                   :before-close="cancel">
            <el-form :label-position="labelPosition" :label-width="labelWidth" :rules="rulesAdd" :model="formAdd"
                     ref='formAdd' class="add-dialog-form">
                <el-form-item label="子任务名称" prop="subTaskName">
                    <el-input v-model="formAdd.subTaskName" placeholder="子任务名称"></el-input>
                </el-form-item>
                <el-form-item label="子任务描述" prop="subTaskDesc">
                    <el-input v-model="formAdd.subTaskDesc" placeholder="子任务描述"></el-input>
                </el-form-item>
                <el-form-item label="是否可打分" prop="isScore">
                    <el-radio-group v-model="formAdd.isScore">
                        <el-radio label="Y">是</el-radio>
                        <el-radio label="N">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="巡店依据" prop="isAccord">
                    <el-select v-model="formAdd.isAccord">
                        <el-option
                                v-for="item in accordList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
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
        name: 'commonPatrolTask',
        data() {
            return {
                formSearch: { //表单查询
                    subTaskName: '',
                    status: ''
                },
                accordList: [{
                    value: '1',
                    label: '上次巡店表'
                }, {
                    value: '2',
                    label: '周畅销商品报告'
                }, {
                    value: '3',
                    label: '区长周会记录'
                }, {
                    value: '4',
                    label: '店长周报'
                }, {
                    value: '5',
                    label: '区长周报'
                }],
                selectListId: [],
                openType: 'add', //add新增 mof修改
                listLoading: false,//
                pageInfo: { //分页
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: 0
                },
                formAdd: { //表单添加
                    subTaskName: '',
                    subTaskDesc: '',
                    isScore: '',
                    isAccord: '',
                    type: 'inspection'//巡店任务
                },
                rulesAdd: {
                    subTaskName: [{required: true, message: "请输入子任务名称", trigger: "blur"}],
                    subTaskDesc: [{required: true, message: "请输入子任务描述", trigger: "blur"}],
                    isScore: [{required: true, message: "请选择是否可打分", trigger: "blur"}],
                    isAccord: [{required: true, message: "请选择巡店依据", trigger: "blur"}]
                },
                tableData: [],
                dialogAddVisible: false,    //添加弹框显示
                labelPosition: 'right', //lable对齐方式
                labelWidth: '120px', //lable宽度
                formLabelWidth: '120px'
            };
        },
        mounted() {
            // this.getSubTaskList()
        },
        activated: function () {
            this.getSubTaskList()
        },
        methods: {
            getSubTaskList() {
                let params = {
                    page: this.pageInfo.currentPage,
                    limit: this.pageInfo.pageSize,
                    subTaskName: this.formSearch.subTaskName,
                    status: this.formSearch.status,
                    type: 'inspection'//巡店任务
                }
                this.$api.getCommonSubTaskList(params).then(res => {
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
                this.getSubTaskList()
            },
            reset() {
                this.formSearch.subTaskName = ''
                this.formSearch.status = ''
            },
            handleSizeChange(size) {
                this.pageInfo.currentPage = 1
                this.pageInfo.pageSize = size
                this.getSubTaskList()
            },
            handleCurrentChange(currentPage) {
                this.pageInfo.currentPage = currentPage
                this.getSubTaskList()
            },
            addSubTask() {
                this.$refs['formAdd'].validate((valid) => {
                    if (valid) {
                        this.$api.addCommonSubTask(this.formAdd).then(res => {
                            if (res.code === 0) {
                                this.cancel()
                                this.getSubTaskList()
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
                    this.addSubTask()
                } else {
                    this.modifySubTask()
                }
            },
            openAdd() {
                this.$router.replace({path: "/commonPatrolTaskAdd"});
            },
            cancel() {
                this.dialogAddVisible = false
                this.formAdd = {}
            },
            getDetail(data) {
                this.$router.push({name: "commonPatrolTaskEdit", params: {id: data.id}});
            },
            modifySubTask() {
                delete this.formAdd.createTime
                delete this.formAdd.modifyTime
                this.$api.modifyCommonSubTask(this.formAdd).then(res => {
                    if (res.code === 0) {
                        this.cancel()
                        this.getSubTaskList()
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
                    ids: this.selectListId.join(','),
                    status: 'A'
                }
                if (status == 'D') {
                    params.status = 'D'
                }
                this.$api.modifyCommonSubTaskStatus(params).then(res => {
                    if (res.code === 0) {
                        this.getSubTaskList()
                        this.$message.success('修改成功')
                    } else {
                        // 失败提示
                        this.$message.error(res.msg)
                    }
                })
            },
            deleteSubTask(type, id) {
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
                    this.$api.deleteCommonSubTask(params).then(res => {
                        if (res.code === 0) {
                            this.getSubTaskList()
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
