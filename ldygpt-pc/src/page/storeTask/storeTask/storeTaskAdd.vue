<template>
    <div class="container">
        <div class="back">
            <el-button round icon="el-icon-back" @click="backList" size="mini">返回</el-button>
        </div>
        <div class="title-item">
            <div class="title">添加基本信息</div>
            <div class="right" @click="toggle">
                <el-button type="text" :icon="isShow?'el-icon-arrow-up':'el-icon-arrow-down'">{{isShow? '收起':'展开'}}
                </el-button>
            </div>
        </div>
        <div class="top-form" v-show="isShow">
            <el-form :label-position="labelPosition" :label-width="labelWidth" :rules="rulesAdd" :model="formAdd"
                     ref='formAdd' class="add-form">
                <el-form-item label="任务标题" prop="taskTitle">
                    <el-input v-model="formAdd.taskTitle" placeholder="任务标题"></el-input>
                </el-form-item>
                <el-form-item label="任务类型" prop="taskType">
                    <el-radio-group v-model="formAdd.taskType">
                        <el-radio label="1">常规任务</el-radio>
                        <el-radio label="2">临时任务</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="任务属性" prop="taskAttribute">
                    <el-select v-model="formAdd.taskAttribute">
                        <el-option
                                v-for="item in attributeList"
                                :key="item.dcode"
                                :label="item.dname"
                                :value="item.dcode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="下发周期" required>
                    <el-col :span="7" class="room-item">
                        <el-form-item prop="taskCycleYear">
                            <el-select v-model="formAdd.taskCycleYear" placeholder="年">
                                <el-option
                                        v-for="item in yearList"
                                        :key="item.dcode"
                                        :label="item.dname"
                                        :value="item.dcode">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" class="room-item">
                        <el-form-item prop="taskCycleMonth">
                            <el-select v-model="formAdd.taskCycleMonth" placeholder="月">
                                <el-option
                                        v-for="item in monthList"
                                        :key="item.dcode"
                                        :label="item.dname"
                                        :value="item.dcode">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7" class="room-item">
                        <el-form-item prop="taskCycleDay">
                            <el-select v-model="formAdd.taskCycleDay" placeholder="日">
                                <el-option
                                        v-for="item in dayList"
                                        :key="item.dcode"
                                        :label="item.dname"
                                        :value="item.dcode">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="推送时间" prop="pushTime">
                    <el-time-select
                            placeholder="起始时间"
                            v-model="formAdd.pushTime"
                            :picker-options="{
                            start: '08:30',
                            step: '00:15',
                            end: '18:30'
                        }">
                    </el-time-select>
                </el-form-item>
                <el-form-item label="任务超时时长" prop="overDurationHour">
                    <el-input v-model="formAdd.overDurationHour" placeholder="任务超时时长(小时)">
                        <el-select v-model="formAdd.overDurationMin" slot="append" placeholder="分钟" class="append">
                            <el-option
                                    v-for="item in minList"
                                    :key="item.dcode"
                                    :label="item.dname + '(分)'"
                                    :value="item.dcode">
                            </el-option>
                        </el-select>
                    </el-input>
                </el-form-item>
                <el-form-item label="任务提醒时长" prop="remindDurationHour">
                    <el-input v-model="formAdd.remindDurationHour" placeholder="任务提醒时长(小时)">
                        <el-select v-model="formAdd.remindDurationMin" slot="append" placeholder="分钟" class="append">
                            <el-option
                                    v-for="item in minList"
                                    :key="item.dcode"
                                    :label="item.dname+ '(分)'"
                                    :value="item.dcode">
                            </el-option>
                        </el-select>
                    </el-input>

                </el-form-item>
                <el-form-item label="积分" prop="rewardsPoints">
                    <el-input v-model="formAdd.rewardsPoints" placeholder="积分"></el-input>
                </el-form-item>
                <el-form-item label="任务说明" prop="taskDesc">
                    <el-input type="textarea" v-model="formAdd.taskDesc" placeholder="任务说明"></el-input>
                </el-form-item>
            </el-form>
            <div class="btns">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </div>

        </div>
        <!-- 表格---start -->
        <div class="task-content" v-if="formAdd.id">
            <div class="title-item">
                <div class="title">添加任务项</div>
            </div>
            <el-row class="task-btns">
                <el-button size="small" round type="primary" @click="openChoose">选择任务项</el-button>
                <el-button size="small" round @click="openAdd">自定义任务项</el-button>
            </el-row>
            <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%">
                <el-table-column type="index" label="序号" align="center" width="100">
                </el-table-column>
                <el-table-column prop="itemName" label="任务项名称" align="center">
                </el-table-column>
                <el-table-column prop="itemDesc" label="任务项说明" align="center">
                </el-table-column>
                <el-table-column prop="isRequiredPic" label="是否必传图片" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.isRequiredPic=='Y'?'是':'否' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="isRequired" label="是否必填项" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.isRequired=='Y'?'是':'否' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="itemType" label="任务项类型" align="center">
                </el-table-column>
                <el-table-column prop="source" label="来源" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.isRequired=='1'?'常用任务项':'自定义任务项' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="230" align="center">
                    <template slot-scope="scope">
                        <!-- <el-button size="mini" plain type="primary" >详情</el-button> -->
                        <el-button size="mini" @click="getDetail(scope.row)">编辑</el-button>
                        <el-button size="mini" plain type="danger" @click="deleteItem('one', scope.row.id)">删除
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
        </div>
        <!-- 表格---end -->

        <!-- 新增任务项弹框---start -->
        <el-dialog title="'自定义任务项" :visible.sync="dialogAddVisible" width="700px" :before-close="cancelItem">
            <el-form :label-position="labelPosition" :label-width="labelWidth" :rules="rulesItemAdd"
                     :model="formItemAdd" ref='formItemAdd' class="add-dialog-form">
                <el-form-item label="任务项名称" prop="itemName">
                    <el-input v-model="formItemAdd.itemName" placeholder="任务项名称"></el-input>
                </el-form-item>
                <el-form-item label="任务项说明" prop="itemDesc">
                    <el-input v-model="formItemAdd.itemDesc" placeholder="任务项说明"></el-input>
                </el-form-item>
                <el-form-item label="是否必传图片" prop="isRequiredPic">
                    <el-radio-group v-model="formItemAdd.isRequiredPic">
                        <el-radio label="Y">是</el-radio>
                        <el-radio label="N">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否必填项" prop="isRequired">
                    <el-radio-group v-model="formItemAdd.isRequired">
                        <el-radio label="Y">是</el-radio>
                        <el-radio label="N">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="任务项类型" prop="itemType">
                    <el-radio-group v-model="formItemAdd.itemType" class="text-type">
                        <el-radio label="text">文本输入框</el-radio>
                        <el-radio label="number">数字输入框</el-radio>
                        <el-radio label="time">时间输入框</el-radio>
                        <el-radio label="radio">单选框</el-radio>
                        <el-radio label="select">多选框</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="任务项内容" prop="content">
                    <el-input v-model="formItemAdd.terms" placeholder="任务项内容"></el-input>
                </el-form-item>
                <el-form-item label="是否显示文本框" prop="isInput">
                    <el-radio-group v-model="formItemAdd.isInput">
                        <el-radio label="Y">是</el-radio>
                        <el-radio label="N">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelItem">取 消</el-button>
                <el-button type="primary" @click="submitItem">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 新增弹框---end -->

        <!-- 选择任务项弹框---start -->
        <el-dialog title="选择任务项" :visible.sync="dialogChooseVisible" width="700px" :before-close="cancelChoose">
            <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                     :model="formSearch" class="demo-form-inline">
                <el-form-item label="任务项名称" prop="itemName">
                    <el-input v-model="formSearch.itemName" placeholder="任务项名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="tableDataChoose" v-loading="listLoading" border stripe style="width: 100%"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="60">
                </el-table-column>
                <el-table-column prop="itemName" label="任务项名称" align="center">
                </el-table-column>
                <el-table-column prop="itemDesc" label="任务项说明" align="center">
                </el-table-column>
                <el-table-column prop="isRequiredPic" label="是否必传图片" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.isRequiredPic=='Y'?'是':'否' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="isRequired" label="是否必填项" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.isRequired=='Y'?'是':'否' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="itemType" label="任务项类型" align="center">
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
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelChoose">取 消</el-button>
                <el-button type="primary" @click="submitChoose">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 新增弹框---end -->
    </div>
</template>

<script>
    export default {
        name: 'storeTaskAdd',
        data() {
            return {
                isShow: true,
                attributeList: [],
                yearList: [],
                monthList: [],
                dayList: [],
                minList: [],
                chooseType: 'add',//add新增 mof修改
                openType: 'add', //add新增 mof修改
                listLoading: false,//
                pageInfo: { //分页
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: 0
                },
                formAdd: { //表单添加
                    id: '',
                    taskTitle: '',
                    taskType: '',
                    taskAttribute: '',
                    taskCycleDay: '',
                    taskCycleMonth: '',
                    taskCycleDay: '',
                    pushTime: '',
                    overDurationHour: '',
                    overDurationMin: '0',
                    remindDurationHour: '',
                    remindDurationMin: '0',
                    rewardsPoints: '0',
                    taskDesc: '',
                    taskCategory: 'store'//店铺任务
                },
                rulesAdd: {
                    taskTitle: [{required: true, message: "请输入任务标题", trigger: "blur"}],
                    taskType: [{required: true, message: "请选择任务类型", trigger: "blur"}],
                    taskAttribute: [{required: true, message: "请选择任务属性", trigger: "blur"}],
                    pushTime: [{required: true, message: "请选择推送时间", trigger: "blur"}],
                    rewardsPoints: [{required: true, message: "请输入积分", trigger: "blur"}],
                    taskDesc: [{required: true, message: "请输入任务说明", trigger: "blur"}],
                    taskCycleYear: [{required: true, message: "请选择年", trigger: "blur"}],
                    taskCycleMonth: [{required: true, message: "请选择月", trigger: "blur"}],
                    taskCycleDay: [{required: true, message: "请选择日", trigger: "blur"}],
                    overDurationHour: [{required: true, message: "请输入任务超时时长", trigger: "blur"}],
                    remindDurationHour: [{required: true, message: "请输入任务提醒时长", trigger: "blur"}],
                },
                formItemAdd: { //表单添加
                    taskId: 'init',
                    itemName: '',
                    itenDesc: '',
                    isRequiredPic: '',
                    isRequired: '',
                    isInput: '',
                    itemType: '',
                    terms: '',
                    source: ''
                },
                rulesItemAdd: {
                    itemName: [{required: true, message: "请输入任务项名称", trigger: "blur"}],
                    itemDesc: [{required: true, message: "请输入任务项说明", trigger: "blur"}],
                    isRequiredPic: [{required: true, message: "请选择是否必传图片", trigger: "blur"}],
                    isRequired: [{required: true, message: "请选择是否必填项", trigger: "blur"}],
                    isInput: [{required: true, message: "请选择是否必填文本", trigger: "blur"}],
                    itemType: [{required: true, message: "请选择文本类型", trigger: "blur"}],
                },
                tableData: [],
                formSearch: { //表单查询
                    itemName: ''
                },
                tableDataChoose: [],
                selectListId: [],
                dialogAddVisible: false,    //添加弹框显示
                dialogChooseVisible: false,   //选择弹框显示
                labelPosition: 'right', //lable对齐方式
                labelWidth: '140px', //lable宽度
                formLabelWidth: '120px'
            };
        },
        mounted() {
            if (this.$route.params.id != undefined) {
                this.formAdd.id = this.$route.params.id
                this.formItemAdd.taskId = this.$route.params.id
            }
            this.getDict()
            this.getStoreTask()
            this.getItemList()
        },
        methods: {
            toggle() {
                this.isShow = !this.isShow
            },
            getDict() {
                this.attributeList = this.$common.getDict("taskAttribute")
                this.yearList = this.$common.getDict("year")
                var date = new Date;
                var year = date.getFullYear();
                this.yearList.push({dcode: year, dname: year})
                this.yearList.push({dcode: year + 1, dname: year + 1})
                this.monthList = this.$common.getDict("month")
                this.dayList = this.$common.getDict("day")
                this.minList = this.$common.getDict("min")
                console.log(this.attributeList)
            },
            backList() {
                this.$router.push({path: '/storeTask'})
            },
            getStoreTask() {
                if (this.formAdd.id != '') {
                    let params = {
                        id: this.formAdd.id
                    }
                    this.$api.getTaskDetail(params).then(res => {
                        if (res.code === 0) {
                            this.formAdd = res.data
                        } else {
                            // 失败提示
                            this.$message.error(res.msg)
                        }
                    })
                }
            },
            getItemList() {
                if (this.formItemAdd.taskId != '') {
                    let params = {
                        page: this.pageInfo.currentPage,
                        limit: this.pageInfo.pageSize,
                        taskId: this.formItemAdd.taskId
                    }
                    this.$api.getTaskItemList(params).then(res => {
                        if (res.code == 0) {
                            this.pageInfo.pageTotal = res.count
                            this.tableData = res.data
                        } else {
                            this.$message.error(res.msg)
                        }
                    })
                }
            },
            handleSizeChange(size) {
                this.pageInfo.currentPage = 1
                this.pageInfo.pageSize = size
                this.getItemList()
            },
            handleCurrentChange(currentPage) {
                this.pageInfo.currentPage = currentPage
                this.getItemList()
            },
            addTask() {
                this.$refs['formAdd'].validate((valid) => {
                    if (valid) {
                        this.$api.addTask(this.formAdd).then(res => {
                            if (res.code === 0) {
                                this.formAdd.id = res.data.id
                                // this.getStoreTask()
                                this.formItemAdd.taskId = res.data.id
                                this.getItemList()
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
                if (this.formAdd.id == '') {
                    this.addTask()
                } else {
                    this.modifyTask()
                }
            },
            cancel() {
                this.$router.replace({path: "/storeTask"});
            },
            modifyTask() {
                delete this.formAdd.createTime
                delete this.formAdd.modifyTime
                this.$api.modifyTask(this.formAdd).then(res => {
                    if (res.code === 0) {
                        this.formAdd.id = res.data.id
                        // this.getStoreTask()
                        this.formItemAdd.taskId = res.data.id
                        this.getItemList()
                        this.$message.success('修改成功')
                    } else {
                        // 失败提示
                        this.$message.error(res.msg)
                    }
                })
            },
            submitItem() {
                if (this.openType == 'add') {
                    this.addItem()
                } else {
                    this.modifyItem()
                }
            },
            addItem() {
                this.$refs['formItemAdd'].validate((valid) => {
                    if (valid) {
                        this.$api.addTaskItem(this.formItemAdd).then(res => {
                            if (res.code === 0) {
                                this.cancelItem()
                                // this.getStoreTask()
                                this.getItemList()
                                this.$message.success('新增成功')
                            } else {
                                // 失败提示
                                this.$message.error(res.msg)
                            }
                        })
                    }
                })
            },
            modifyItem() {
                delete this.formItemAdd.createTime
                delete this.formItemAdd.modifyTime
                this.$api.modifyTaskItem(this.formItemAdd).then(res => {
                    if (res.code === 0) {
                        this.cancelItem()
                        // this.getStoreTask()
                        this.getItemList()
                        this.$message.success('修改成功')
                    } else {
                        // 失败提示
                        this.$message.error(res.msg)
                    }
                })
            },
            getDetail(data) {
                console.log(data)
                let params = {
                    id: data.id
                }
                this.$api.getTaskItemDetail(params).then(res => {
                    if (res.code === 0) {
                        this.openType = 'mof'
                        this.dialogAddVisible = true
                        this.formItemAdd = res.data
                    } else {
                        // 失败提示
                        this.$message.error(res.msg)
                    }
                })
            },
            openAdd() {
                this.openType = 'add'
                this.dialogAddVisible = true
                this.formItemAdd = { //表单添加
                    taskId: this.formAdd.id,
                    itemName: '',
                    itenDesc: '',
                    isRequiredPic: '',
                    isRequired: '',
                    isInput: '',
                    itemType: '',
                    terms: '',
                    source: '1'//1-自定义；2-常用任务项

                }
            },
            openChoose() {
                this.chooseType = 'add'
                this.dialogChooseVisible = true
                this.getCommonItemList()
            },
            cancelItem() {
                this.dialogAddVisible = false
                // this.formAdd = {}
            },
            cancelChoose() {
                this.dialogChooseVisible = false
                // this.formAdd = {}
            },
            deleteItem(type, id) {
                this.$confirm('确定要删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = {
                        ids: id
                    }
                    this.$api.deleteTaskItem(params).then(res => {
                        if (res.code === 0) {
                            // this.getStoreTask()
                            this.getItemList()
                            this.$message.success('删除成功')
                        } else {
                            // 失败提示
                            this.$message.error(res.msg)
                        }
                    })
                })
            },
            search() {
                this.pageInfo.currentPage = 1
                this.getCommonItemList()
            },
            getCommonItemList() {
                let params = {
                    page: this.pageInfo.currentPage,
                    limit: this.pageInfo.pageSize,
                    itemName: this.formSearch.itemName,
                    status: this.formSearch.status,
                    type: 'store' //店铺任务项
                }
                this.$api.getCommonTaskItemList(params).then(res => {
                    if (res.code == 0) {
                        this.pageInfo.pageTotal = res.count
                        this.tableDataChoose = res.data
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
            submitChoose() {
                if (this.chooseType == 'add') {
                    this.chooseItem(this.selectListId)
                } else {
                    this.chooseItem(this.selectListId)
                }
            },
            chooseItem() {
                let params = {
                    selectListId: this.selectListId.join(','),
                    taskId: this.formAdd.id,
                    source: '2'//1-自定义；2-常用任务项
                }
                this.$api.chooseTaskItem(params).then(res => {
                    if (res.code === 0) {
                        this.cancelChoose()
                        this.getItemList()
                        this.$message.success('选择成功')
                    } else {
                        // 失败提示
                        this.$message.error(res.msg)
                    }
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

    .title-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px 0;
        margin: 10px 0 20px 0;
        height: 44px;
        background: rgba(243, 244, 248, 1);
        border-radius: 4px 4px 0px 0px;
    }

    .container {
        position: relative;

        .back {
            position: absolute;
            right: 20px;
            top: 6px;
        }

        .room-item + .room-item {
            margin-left: 20px;
        }

        .select-item {
            display: flex;
            align-items: center;
        }

        .append {
            width: 130px;
        }

        .task-btns {
            margin-bottom: 10px;
        }

        .top-form {
            margin-left: 50px;
            margin-bottom: 20px;

            .add-form {
                width: 600px;
            }

            .btns {
                width: 400px;
                text-align: right;

                button {
                    margin-left: 20px;
                }
            }

        }
    }

    .text-type {
        .el-radio {
            width: 50%;
            margin-bottom: 3px;
        }

        .el-radio + .el-radio {
            margin-left: 0;
        }
    }
</style>
