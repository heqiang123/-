<template>
    <div class="container">
        <h5>--新增基本信息--</h5>
        <el-form :label-position="labelPosition" :label-width="labelWidth" :rules="rulesAdd" :model="formAdd"
                 ref='formAdd' class="add-dialog-form">
            <el-form-item label="任务标题" prop="taskTitle">
                <el-input v-model="formAdd.taskTitle" placeholder="任务标题"></el-input>
            </el-form-item>
            <el-form-item label="任务类型" prop="taskType">
                <el-radio-group v-model="formAdd.taskType">
                    <el-radio label="common">常规任务</el-radio>
                    <el-radio label="temporary">临时任务</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="任务下发周期" prop="sendCycle">
                <div class="block">
                    <el-date-picker v-model="formAdd.sendCycle" type="datetime" placeholder="选择日期时间"
                                    format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </div>
            </el-form-item>

            <el-form-item label="任务推送时间" prop="pushTime">
                <div class="block">
                    <el-date-picker v-model="formAdd.pushTime" type="datetime" placeholder="选择日期时间"
                                    format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </div>
            </el-form-item>

            <el-form-item label="任务执行开始时间" prop="startTime">
                <div class="block">
                    <el-date-picker v-model="formAdd.startTime" type="datetime" placeholder="选择日期时间"
                                    format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </div>
            </el-form-item>

            <el-form-item label="任务执行结束时间" prop="endTime">
                <div class="block">
                    <el-date-picker v-model="formAdd.endTime" type="datetime" placeholder="选择日期时间"
                                    format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </div>
            </el-form-item>

            <el-form-item label="积分" prop="rewardsPoints">
                <el-input v-model="formAdd.rewardsPoints" placeholder="积分"></el-input>
            </el-form-item>

            <el-form-item label="任务说明" prop="taskDesc">
                <el-input v-model="formAdd.taskDesc" placeholder="任务说明"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button>取 消</el-button>
            <el-button type="primary" @click="submit">保存</el-button>
        </div>

        <h5>--新增子任务--</h5>
        <el-form :label-position="labelPosition" :label-width="labelWidth" :rules="rulesAdd" :model="formAdd"
                 ref='formAdd' class="add-dialog-form">
            <el-form-item label="任务子项" prop="">
                <el-button size="mini" @click="openAdd2">选择子项</el-button>
                <el-button size="mini" @click="openAdd">自定义子项</el-button>
            </el-form-item>

            已选:
            <el-tree :data="treeList" show-checkbox node-key="label" :default-expanded-keys="[2, 3]"
                     :default-checked-keys="[5]" :props="defaultProps" @check='getThisTree'>
            </el-tree>
        </el-form>

        <!-- 新增弹框---start -->
        <el-dialog :title="openType == 'add'? '新增MSP任务': '修改信息 '" :visible.sync="dialogAddVisible" width="700px"
                   :before-close="cancel">
            <el-form :label-position="labelPosition" :label-width="labelWidth" :rules="rulesAdd2" :model="formAdd2"
                     ref='formAdd2' class="add-dialog-form">
                <el-form-item label="子任务名称" prop="subTaskName">
                    <el-input v-model="formAdd2.subTaskName" placeholder="请输入子任务名称"></el-input>
                </el-form-item>
                <el-form-item label="子任务说明" prop="subTaskDesc">
                    <el-input v-model="formAdd2.subTaskDesc" placeholder="请输入子任务说明"></el-input>
                </el-form-item>
                <el-form-item label="是否上传图片" prop="isRequiredPic">
                    <el-radio-group v-model="formAdd2.isRequiredPic">
                        <el-radio label="Y">是</el-radio>
                        <el-radio label="N">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否评价" prop="isComment">
                    <el-radio-group v-model="formAdd2.isComment">
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
                <el-button type="primary" @click="submit2">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 新增弹框-2-start -->
        <el-dialog :title="'选择子任务'" :visible.sync="dialogAddVisible2" width="700px" :before-close="cancel">
            <el-tree :data="treeList" show-checkbox node-key="label" :default-expanded-keys="[2, 3]"
                     :default-checked-keys="[5]" :props="defaultProps" @check='getThisTree'>
            </el-tree>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </div>
        </el-dialog>

    </div>

</template>

<script>
    export default {
        //   name: "messageboard",
        data() {
            return {
                treeList: [],
                //  data2: [{
                //   id: 1,
                //   label: '子任务1',
                //   children: [{
                //     id: 2,
                //     label: '任务项1',
                //   },
                //   {
                //     id: 3,
                //     label: '任务项2',
                //   }]
                // }, {
                //   id: 4,
                //   label: '子任务2',
                //     children: [{
                //     id: 5,
                //     label: '任务项3',
                //   },
                //   {
                //     id: 6,
                //     label: '任务项4',
                //   }]
                // }],
                defaultProps: {
                    children: "children",
                    label: "label"
                },

                formAdd: {
                    //表单添加
                    taskTitle: "",
                    taskType: "",
                    sendCycle: "",
                    pushTime: "",
                    startTime: "",
                    endTime: "",
                    rewardsPoints: "",
                    taskTitle: ""
                },
                formAdd2: {
                    //表单添加
                    subTaskName: "",
                    subTaskDesc: "",
                    isRequiredPic: "",
                    isComment: "",
                    itemName: ""
                },
                rulesAdd: {
                    taskTitle: [
                        {required: true, message: "请输入任务标题", trigger: "blur"}
                    ],
                    taskType: [
                        {required: true, message: "请输入任务类型", trigger: "blur"}
                    ],
                    sendCycle: [
                        {required: true, message: "任务下发周期不能为空", trigger: "blur"}
                    ],
                    rewardsPoints: [
                        {required: true, message: "请输入积分", trigger: "blur"}
                    ],
                    taskDesc: [
                        {required: true, message: "请输入任务说明", trigger: "blur"}
                    ]
                },

                rulesAdd2: {
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

                itemList: [
                    {
                        itemName: ""
                    }
                ],
                newDetail: {
                    item: ""
                },
                openType: "add", //add新增 mof修改
                dialogAddVisible: false, //添加弹框显示
                dialogAddVisible2: false,
                labelPosition: "right", //lable对齐方式
                labelWidth: "80px", //lable宽度
                formLabelWidth: "120px"
            };
        },
        mounted() {
        },
        methods: {
            addDetail(index) {
                this.itemList.push(this.newDetail);
                this.newDetail = {item: ""};
            },
            deleteDetail(index) {
                this.itemList.splice(index, 1);
            },
            //子任务提交
            submit2() {
                if (this.openType == "add") {
                    this.addCommonSubTask();
                } else {
                    this.modifyTenement();
                }
            },
            //新增子任务
            addCommonSubTask() {
                debugger;
                this.$refs["formAdd2"].validate(valid => {
                    if (valid) {
                        this.formAdd2.type = "msp";
                        this.formAdd2.itemLists = JSON.stringify(this.itemList);
                        // console.info(this.itemList);
                        //    debugger;
                        this.$api.addCommonSubTask(this.formAdd2).then(res => {
                            if (res.code === 0) {
                                this.cancel();

                                this.$message.success("新增成功");
                            } else {
                                // 失败提示
                                this.$message.error(res.msg);
                            }
                        });
                    }
                });
            },
            addMspTask() {
                this.$refs["formAdd"].validate(valid => {

                    if (valid) {
                        this.formAdd.taskCategory = "msp";
                        this.formAdd.taskAttribute = "member";
                        this.formAdd.isReturnPic = "Y";
                        this.formAdd.sendExpression = "aaa";
                        //  this.formAdd.pushTime='2018-01-01'
                        //   var d = new Date(this.formAdd.pushTime);
                        //   var ptime =
                        //     d.getFullYear() +
                        //     "-" +
                        //     d.getMonth() +
                        //     "-" +
                        //     d.getDate() +
                        //     " " +
                        //     d.getHours() +
                        //     ":" +
                        //     d.getMinutes() +
                        //     ":" +
                        //     d.getSeconds();
                        // this.formAdd.pushTime = ptime;
                        // this.formAdd.pushTime = this.strToDate(this.formAdd.pushTime)
                        // this.formAdd.startTime = this.strToDate(this.formAdd.startTime)
                        // this.formAdd.endTime = this.strToDate(this.formAdd.endTime)

                        //  this.formAdd.overDuration=''
                        this.$api.addTask(this.formAdd).then(res => {
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
            //打开弹出窗
            openAdd() {
                (this.itemList = [
                    {
                        itemName: ""
                    }
                ]),
                    (this.openType = "add");
                this.dialogAddVisible = true;
            },

            openAdd2() {
                this.dialogAddVisible2 = true;
                this.getTree();
            },
            // 获取选中的数据
            getThisTree(data, node) {

                console.info(data)
                console.info(node)
                // this.selectedMenueIds = node.checkedKeys
            },
            //清空
            cancel() {
                this.dialogAddVisible = false;
                this.dialogAddVisible2 = false;
                this.formAdd = {};
            },

            //获取树
            getTree(data) {
                // console.log(data)

                this.$api.getCommonSubTaskTree().then(res => {
                    if (res.code === 0) {
                        this.treeList = res.data;
                    } else {
                        // 失败提示
                        this.$message.error(res.msg);
                    }
                });
            },

            strToDate(strDate) {
                var d = new Date(strDate);
                var dateTim =
                    d.getFullYear() +
                    "-" +
                    d.getMonth() +
                    "-" +
                    d.getDate() +
                    " " +
                    d.getHours() +
                    ":" +
                    d.getMinutes() +
                    ":" +
                    d.getSeconds();

                return dateTim;
            },
            submit() {
                //   debugger
                // if (this.openType == 'add') {
                this.addMspTask();
                // } else {
                //     this.modifySubTask()
                // }
            }
        }
    };
</script>

<style lang="scss" scoped>
    // 设置输入框的宽度
    // .el-form-item__content {
    //   width: 200px;
    // }
    .add-dialog-form {
        width: 300px;
        margin: 0 auto;
        margin-left: 0px;
    }
</style>
