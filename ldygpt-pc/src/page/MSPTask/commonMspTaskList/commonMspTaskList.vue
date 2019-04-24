<template>
    <div class="container">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">
            <el-form-item label="下发状态" prop="taskState">
                <el-select v-model="formSearch.taskState" placeholder="下发状态">
                    <el-option label="已下发" value="2"></el-option>
                    <el-option label="未下发" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="任务标题" prop="taskTitle">
                <el-input v-model="formSearch.taskTitle" placeholder="任务标题"></el-input>
            </el-form-item>
            <el-form-item label="任务类型" prop="taskType">
                <el-select v-model="formSearch.taskType" placeholder="任务类型">
                    <el-option label="常规任务" value="common"></el-option>
                    <el-option label="临时任务" value="temporary"></el-option>
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
            <el-button size="small" round type="primary">下发范围导入</el-button>
            <el-button size="small" round type="primary">覆盖导出</el-button>
            <el-button size="small" round type="primary">增量导入</el-button>
            <el-button size="small" round type="primary">减量导入</el-button>
            <el-button size="small" round type="primary">任务拷贝</el-button>
            <el-button size="small" round type="danger" @click="deleteTask('all')">批量删除</el-button>
        </el-row>
        <!-- 操作区----end -->
        <!-- 表格---start -->
        <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="60">
            </el-table-column>
            <el-table-column prop="taskTitle" label="任务标题" align="center">
            </el-table-column>
            <el-table-column prop="taskType" label="任务类型" align="center">
            </el-table-column>
            <el-table-column label="任务状态" align="center" width="100">
                <template slot-scope="scope">
                    <span>{{ scope.row.status=='A'?'生效':'失效' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="sendCycle" label="下发周期" align="center">
            </el-table-column>
            <el-table-column prop="pushTime" label="任务推送时间" align="center">
            </el-table-column>
            <el-table-column prop="startTime" label="任务开始时间" align="center">
            </el-table-column>
            <el-table-column prop="endTime" label="任务结束时间" align="center">
            </el-table-column>
            <el-table-column prop="taskAttribute" label="任务属性" align="center">
            </el-table-column>
            <el-table-column prop="modifier" label="最近修改人" align="center">
            </el-table-column>
            <el-table-column prop="modifyTime" label="最近修改时间" align="center" :formatter="this.$common.timestampToTime">
            </el-table-column>
            <el-table-column prop="creator" label="创建人" align="center">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center" :formatter="this.$common.timestampToTime">
            </el-table-column>
            <el-table-column label="操作" width="230" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" @click="getDetail(scope.row)">编辑</el-button>
                    <el-button size="mini" @click="getView(scope.row)">查看明细</el-button>
                    <el-button size="mini" @click="getResult(scope.row)">查看执行结果</el-button>
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
        name: 'messageboard',
        data() {
            return {
                formSearch: { //表单查询
                    taskState: '1',
                    taskTitle: '',
                    taskType: ''
                },
                selectListId: [],
                listLoading: false,
                pageInfo: { //分页
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: 0
                },
                tableData: [],
                labelPosition: 'right', //lable对齐方式
                labelWidth: '80px', //lable宽度
            };
        },
        mounted() {
            this.getTaskList()
        },
        methods: {
            getTaskList() {
                let params = {
                    page: this.pageInfo.currentPage,
                    limit: this.pageInfo.pageSize,
                    taskState: this.formSearch.taskState,
                    taskTitle: this.formSearch.taskTitle,
                    taskType: this.formSearch.taskType,
                    taskCategory: 'msp' //店铺任务
                }
                this.$api.getTaskList(params).then(res => {
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
                this.getTaskList()
            },
            reset() {
                this.formSearch.taskState = '1'
                this.formSearch.taskTitle = ''
                this.formSearch.taskType = ''
            },
            handleSizeChange(size) {
                this.pageInfo.currentPage = 1
                this.pageInfo.pageSize = size
                this.getTaskList()
            },
            handleCurrentChange(currentPage) {
                this.pageInfo.currentPage = currentPage
                this.getTaskList()
            },
            openAdd() {
                this.$router.replace({path: "/commonMspTaskListAdd"});

            },
            getDetail(data) {
                this.$router.replace({path: "/commonMspTaskListEdit"});
            },
            getView(data) {

            },
            getResult(data) {

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
                this.$api.modifyTaskStatus(params).then(res => {
                    if (res.code === 0) {
                        this.getTaskList()
                        this.$message.success('修改成功')
                    } else {
                        // 失败提示
                        this.$message.error(res.msg)
                    }
                })
            },
            deleteTask(type, id) {
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
                    this.$api.deleteTask(params).then(res => {
                        if (res.code === 0) {
                            this.getTaskList()
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
