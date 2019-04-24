<template>
    <div class="container">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">
            <el-form-item label="任务名称" prop="subTaskName">
                <el-input v-model="formSearch.subTaskName" placeholder="请输入子任务名称"></el-input>
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
            <!-- <el-table-column  label="租户状态" align="center" width="100">
                 <template slot-scope="scope">
                    <span>{{ scope.row.status=='A'?'生效':'失效' }}</span>
                </template>
            </el-table-column> -->

            <el-table-column prop="isRequiredPic" label="是否反馈图片" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.isRequiredPic=='Y'?'是':'否' }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="isComment" label="是否评价" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.isComment=='Y'?'是':'否' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="状态" align="center" width="100">
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
        <el-pagination background layout="total,sizes,prev, pager, next,jumper" :current-page="pageInfo.currentPage"
                       :page-size="pageInfo.pageSize" @size-change="handleSizeChange"
                       @current-change="handleCurrentChange" :total="pageInfo.pageTotal" :page-sizes="[5, 10, 20, 50]">
        </el-pagination>
        <!-- 表格---end -->

        <!-- 新增弹框---start -->
        <el-dialog :title="openType == 'add'? '新增常用MSP任务': '修改信息 '" :visible.sync="dialogAddVisible" width="700px"
                   :before-close="cancel">
            <el-form :label-position="labelPosition" :label-width="labelWidth" :rules="rulesAdd" :model="formAdd"
                     ref='formAdd' class="add-dialog-form">
                <el-form-item label="子任务名称" prop="subTaskName">
                    <el-input v-model="formAdd.subTaskName" placeholder="请输入子任务名称"></el-input>
                </el-form-item>
                <el-form-item label="子任务说明" prop="subTaskDesc">
                    <el-input v-model="formAdd.subTaskDesc" placeholder="请输入子任务说明"></el-input>
                </el-form-item>
                <el-form-item label="是否上传图片" prop="isRequiredPic">
                    <el-radio-group v-model="formAdd.isRequiredPic">
                        <el-radio label="Y">是</el-radio>
                        <el-radio label="N">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否评价" prop="isComment">
                    <el-radio-group v-model="formAdd.isComment">
                        <el-radio label="Y">是</el-radio>
                        <el-radio label="N">否</el-radio>
                    </el-radio-group>
                </el-form-item>

                <!-- <el-form-item label="任务项" prop="itemName">
                    <el-input v-model="formAdd.itemName" placeholder="任务项名称" ></el-input>
                </el-form-item> -->

                <el-form-item label="任务项" prop="itemList">
                    <el-row v-for="(listItem,index) in itemList" :key="index">
                        <el-input v-model="listItem.itemName" placeholder="任务项"></el-input>
                        <el-button type="primary" icon="el-icon-plus" @click="addDetail(index)"></el-button>
                        <el-button type="primary" icon="el-icon-minus" @click="deleteDetail(index)"></el-button>
                    </el-row>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 新增弹框---end -->
    </div>
</template>

<script>
    export default {
        name: "commonMspTask",
        data() {
            return {
                formSearch: {
                    //表单查询
                    subTaskName: "",
                    status: ""
                },
                itemList: [
                    {
                        itemName: ""
                    }
                ],
                newDetail: {
                    item: ""
                },
                selectListId: [],
                openType: "add", //add新增 mof修改
                listLoading: false, //
                pageInfo: {
                    //分页
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: 0
                },
                formAdd: {
                    //表单添加
                    subTaskName: "",
                    subTaskDesc: "",
                    isRequiredPic: "",
                    isComment: "",
                    itemName: ""
                    //    itemList:''
                },
                rulesAdd: {
                    subTaskName: [
                        {required: true, message: "请输入子任务名称", trigger: "blur"}
                    ],
                    subTaskDesc: [
                        {required: true, message: "请输入子任务说明", trigger: "blur"}
                    ],
                    isRequiredPic: [
                        {required: true, message: "请选择必填项", trigger: "blur"}
                    ],
                    isComment: [
                        {required: true, message: "请选择必填项", trigger: "blur"}
                    ],
                    itemName: [
                        {required: true, message: "请输入任务项名称", trigger: "blur"}
                    ]
                },
                tableData: [],
                dialogAddVisible: false, //添加弹框显示
                labelPosition: "right", //lable对齐方式
                labelWidth: "80px", //lable宽度
                formLabelWidth: "120px"
            };
        },

        methods: {
            addDetail(index) {
                this.itemList.push(this.newDetail);
                this.newDetail = {item: ""};
            },
            deleteDetail(index) {
                this.itemList.splice(index, 1);
            },

            getSubTaskList() {
                let params = {
                    page: this.pageInfo.currentPage,
                    limit: this.pageInfo.pageSize,
                    subTaskName: this.formSearch.subTaskName,
                    status: this.formSearch.status,
                    type: "msp"
                };
                this.$api.getCommonSubTaskList(params).then(res => {
                    if (res.code == 0) {
                        this.pageInfo.pageTotal = res.count;
                        this.tableData = res.data;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            },
            search() {
                this.pageInfo.currentPage = 1;
                this.getSubTaskList();
            },
            reset() {
                this.formSearch.subTaskName = "";
                this.formSearch.status = "";
            },
            handleSizeChange(size) {
                this.pageInfo.currentPage = 1;
                this.pageInfo.pageSize = size;
                this.getSubTaskList();
            },
            handleCurrentChange(currentPage) {
                this.pageInfo.currentPage = currentPage;
                this.getSubTaskList();
            },
            addCommonSubTask() {
                this.$refs["formAdd"].validate(valid => {
                    if (valid) {
                        this.formAdd.type = "msp";
                        this.formAdd.itemLists = JSON.stringify(this.itemList);
                        // console.info(this.itemList);
                        //    debugger;
                        this.$api.addCommonSubTask(this.formAdd).then(res => {
                            if (res.code === 0) {
                                this.cancel();
                                this.getSubTaskList();
                                this.$message.success("新增成功");
                            } else {
                                // 失败提示
                                this.$message.error(res.msg);
                            }
                        });
                    }
                });
            },
            submit() {
                if (this.openType == "add") {
                    this.addCommonSubTask();
                } else {
                    this.modifyTenement();
                }
            },
            openAdd() {
                (this.itemList = [
                    {
                        itemName: ""
                    }
                ]),
                    (this.openType = "add");
                this.dialogAddVisible = true;
            },
            cancel() {
                this.dialogAddVisible = false;
                this.formAdd = {};
            },
            //查看常用子任务
            getDetail(data) {
                // console.log(data)
                let params = {
                    id: data.id
                };
                this.$api.getCommonSubTaskDetail(params).then(res => {
                    if (res.code === 0) {
                        this.openType = "mof";
                        this.dialogAddVisible = true;
                        this.formAdd = res.data;
                        this.itemList = res.data.itemList;
                    } else {
                        // 失败提示
                        this.$message.error(res.msg);
                    }
                });
            },
            modifyTenement() {
                delete this.formAdd.createTime;
                delete this.formAdd.modifyTime;
                // var mycars=new Array()
                this.formAdd.itemList = [];
                this.formAdd.itemLists = JSON.stringify(this.itemList);
                this.$api.modifyCommonSubTask(this.formAdd).then(res => {
                    if (res.code === 0) {
                        this.cancel();
                        this.getSubTaskList();
                        this.$message.success("修改成功");
                    } else {
                        // 失败提示
                        this.$message.error(res.msg);
                    }
                });
            },
            handleSelectionChange(val) {
                this.selectListId = [];
                val.forEach(item => {
                    this.selectListId.push(item.id);
                });
                console.log(this.selectListId);
            },
            //生效失效
            change(status) {
                let params = {
                    ids: this.selectListId.join(","),
                    status: "A"
                };
                if (status == "D") {
                    params.status = "D";
                }
                this.$api.modifyCommonSubTaskStatus(params).then(res => {
                    if (res.code === 0) {
                        this.getSubTaskList();
                        this.$message.success("修改成功");
                    } else {
                        // 失败提示
                        this.$message.error(res.msg);
                    }
                });
            },
            deleteSubTask(type, id) {
                this.$confirm("确定要删除吗?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    let params = {
                        ids: ""
                    };
                    if (type == "all") {
                        params.ids = this.selectListId.join(",");
                    } else {
                        params.ids = id;
                    }
                    this.$api.deleteCommonSubTask(params).then(res => {
                        if (res.code === 0) {
                            this.getSubTaskList();
                            this.$message.success("删除成功");
                        } else {
                            // 失败提示
                            this.$message.error(res.msg);
                        }
                    });
                });
            }
        },
        mounted() {
            this.getSubTaskList();
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
