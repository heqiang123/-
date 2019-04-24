<template>
    <div class="container">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">
            <el-form-item label="下发状态" prop="taskState">
                <el-select v-model="formSearch.taskState" placeholder="下发状态" @change="selectChange">
                    <el-option label="已下发" value="2"></el-option>
                    <el-option label="未下发" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="任务标题" prop="taskTitle">
                <el-input v-model="formSearch.taskTitle" placeholder="任务标题"></el-input>
            </el-form-item>
            <el-form-item label="任务类型" prop="taskType">
                <el-select v-model="formSearch.taskType" placeholder="任务类型">
                    <el-option label="常规任务" value="1"></el-option>
                    <el-option label="临时任务" value="2"></el-option>
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
            <el-button size="small" v-if="formSearch.taskState == 1" round @click="importRang" type="primary">下发范围导入
            </el-button>
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
            <el-table-column label="状态" align="center" width="100">
                <template slot-scope="scope">
                    <span>{{ scope.row.status=='A'?'生效':'失效' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="source" label="任务来源" align="center">
                <template slot-scope="scope">
                    <span>{{ formatDict(scope.row.source, 'source') }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="taskType" label="任务类型" align="center">
                <template slot-scope="scope">
                    <span>{{ formatDict(scope.row.taskType, 'taskType') }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="taskAttribute" label="任务属性" align="center">
                <template slot-scope="scope">
                    <span>{{ formatDict(scope.row.taskAttribute, 'taskAttribute') }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="sendCycle" label="下发周期" align="center">
            </el-table-column>
            <el-table-column prop="pushTime" label="任务推送时间" align="center">
            </el-table-column>
            <el-table-column prop="rewardsPoints" label="积分" align="center">
            </el-table-column>
            <el-table-column prop="creator" label="创建人" align="center">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center" :formatter="this.$common.timestampToTime">
            </el-table-column>
            <el-table-column prop="modifier" label="修改人" align="center">
            </el-table-column>
            <el-table-column prop="modifyTime" label="修改时间" align="center" :formatter="this.$common.timestampToTime">
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
        <el-dialog title="选择下发范围" :visible.sync="dialogAddVisible" width="800px" :before-close="cancel">
            <div class="rang-dialog">
                <el-form>
                    <el-form-item label="店铺零售属性">
                        <div class="rang-line">
                            <el-checkbox class="select-all" :indeterminate="isIndeterminate" v-model="checkAll"
                                         @change="handleCheckAllChange">全选
                            </el-checkbox>
                            <el-checkbox-group v-model="checkedStore" @change="handleCheckedChange">
                                <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
                            </el-checkbox-group>
                            <el-button type="primary" class="search-btn" size="mini">查询</el-button>
                        </div>
                    </el-form-item>
                    <el-form-item label="选择下发岗位">
                        <div class="rang-line">
                            <el-checkbox class="select-all" :indeterminate="isIndeterminate1" v-model="checkAll1"
                                         @change="handleCheckAllChange1">全选
                            </el-checkbox>
                            <el-checkbox-group v-model="checkedStore1" @change="handleCheckedChange1">
                                <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </el-form-item>
                </el-form>
                <div class="menu-tree">
                    <el-tree
                            :data="groupTreeList"
                            node-key="id"
                            ref="tree"
                            show-checkbox
                            :expand-on-click-node="false">
                        <div class="custom-tree-node" slot-scope="{ node, data }">
                            <span>{{ data.label }}</span>
                        </div>
                    </el-tree>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'storeTaskList',
        data() {
            return {
                cities: ['上海', '北京', '广州', '深圳'],
                checkedStore: ['上海', '北京'],
                checkAll: true,
                isIndeterminate: true,
                checkedStore1: ['上海', '北京'],
                checkAll1: true,
                isIndeterminate1: true,
                dialogAddVisible: false,
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
                labelWidth: '80px', //lable宽度,
                groupTreeList: []
            };
        },
        mounted() {
            this.getTaskList()
        },
        methods: {
            selectChange() {
                this.pageInfo.currentPage = 1
                this.getTaskList()
            },
            submit() {

            },
            cancel() {
                this.dialogAddVisible = false
            },
            getTreeList() {
                this.$api.getGroupTrees().then(res => {
                    this.groupTreeList = res.data
                    //   this.groupDetail = {}
                })
            },
            handleCheckAllChange(val) {
                this.checkedStore = val ? this.cities : [];
                this.isIndeterminate = false;
            },
            handleCheckedChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.cities.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
            },
            handleCheckAllChange1(val) {
                this.checkedStore1 = val ? this.cities : [];
                this.isIndeterminate1 = false;
            },
            handleCheckedChange1(value) {
                let checkedCount = value.length;
                this.checkAll1 = checkedCount === this.cities.length;
                this.isIndeterminate1 = checkedCount > 0 && checkedCount < this.cities.length;
            },
            importRang() {
                this.dialogAddVisible = true
                this.getTreeList()
            },
            // 字典格式化
            formatDict(val, code) {
                var dict = this.$common.getDict(code)
                let state = ''
                dict.forEach(item => {
                    if (val == item.dcode) {
                        state = item.dname
                    }
                })
                return state
            },
            getTaskList() {
                let params = {
                    page: this.pageInfo.currentPage,
                    limit: this.pageInfo.pageSize,
                    taskState: this.formSearch.taskState,
                    taskTitle: this.formSearch.taskTitle,
                    taskType: this.formSearch.taskType,
                    taskCategory: 'store' //店铺任务
                }
                this.$api.getTaskList(params).then(res => {
                    if (res.code == 0) {
                        this.pageInfo.pageTotal = res.count
                        this.tableData = res.data
                        this.tableData.forEach(element => {
                            var sendCycle = element.sendCycle
                            if (null != sendCycle && "" != sendCycle) {
                                if (sendCycle.indexOf("-") > -1) {
                                    var split = sendCycle.split("-")
                                    var year = this.formatDict(split[0], "year")
                                    if (year == '') {
                                        year = split[0]
                                    }
                                    var month = this.formatDict(split[1], "month")
                                    var day = this.formatDict(split[2], "day")
                                    element.sendCycle = year + '年' + month + '月' + day
                                }
                            }
                        });
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
                this.$router.replace({path: "/storeTaskAdd"});
            },
            getDetail(data) {

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

    .menu-tree {
        width: 500px;
        margin: 0 auto;
        max-height: 350px;
        overflow-y: scroll;
    }

    .rang-line {
        display: -webkit-box;

        .select-all {
            margin-right: 20px;
        }

        .search-btn {
            margin-left: 20px;
        }
    }
</style>
