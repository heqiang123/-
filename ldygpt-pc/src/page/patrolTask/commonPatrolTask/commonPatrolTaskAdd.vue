<template>
    <div class="container">
        <div class="top-form">
            <el-form :label-position="labelPosition" :label-width="labelWidth" :rules="rulesAdd" :model="formAdd"
                     ref='formAdd' class="add-form">
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
            <div class="btns">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
                <el-button v-if="formAdd.id" type="primary" @click="openAdd">新增任务项</el-button>
            </div>
            <div class="back">
                <el-button round icon="el-icon-back" @click="backList" size="mini">返回</el-button>
            </div>
        </div>
        <!-- 表格---start -->
        <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%" v-if="formAdd.id">
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
                <template slot-scope="scope">
                    <span>{{formatDict(scope.row.itemType, 'itemType')}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="230" align="center">
                <template slot-scope="scope">
                    <!-- <el-button size="mini" plain type="primary" >详情</el-button> -->
                    <el-button size="mini" @click="getDetail(scope.row)">编辑</el-button>
                    <el-button size="mini" plain type="danger" @click="deleteItem('one', scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background v-if="formAdd.id"
                       layout="total,sizes,prev, pager, next,jumper"
                       :current-page="pageInfo.currentPage"
                       :page-size="pageInfo.pageSize"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :total="pageInfo.pageTotal"
                       :page-sizes="[5, 10, 20, 50]">
        </el-pagination>
        <!-- 表格---end -->

        <!-- 新增任务项弹框---start -->
        <el-dialog :title="openType == 'add'? '新增任务项': '修改任务项'" :visible.sync="dialogAddVisible" width="900px"
                   :before-close="cancelItem">
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
                <el-form-item label="任务项内容" prop="content"
                              v-if="formItemAdd.itemType == 'radio' || formItemAdd.itemType == 'select'">
                    <el-input v-model="formItemAdd.terms" placeholder="任务项内容"></el-input>
                </el-form-item>
                <el-form-item label="是否显示文本框" prop="isInput"
                              v-if="formItemAdd.itemType == 'radio' || formItemAdd.itemType == 'select'">
                    <el-radio-group v-model="formItemAdd.isInput">
                        <el-radio label="Y">是</el-radio>
                        <el-radio label="N">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="巡店标准" prop="shopStandard">
                    <UEditor :value="formItemAdd.shopStandard" ref="editor"></UEditor>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelItem">取 消</el-button>
                <el-button type="primary" @click="submitItem">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 新增弹框---end -->
    </div>
</template>

<script>
    import UEditor from '../../../components/common/UEditor.vue';

    export default {
        name: 'commonPatrolTaskAdd',
        components: {
            UEditor
        },
        data() {
            return {
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
                openType: 'add', //add新增 mof修改
                listLoading: false,//
                pageInfo: { //分页
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: 0
                },
                formAdd: { //表单添加
                    id: '',
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
                formItemAdd: { //表单添加
                    commonSubId: 'init',
                    itemName: '',
                    itenDesc: '',
                    isRequiredPic: '',
                    isRequired: '',
                    isInput: '',
                    itemType: '',
                    terms: '',
                    shopStandard: '',
                    type: 'inspection'//巡店任务
                },
                rulesItemAdd: {
                    itemName: [{required: true, message: "请输入任务项名称", trigger: "blur"}],
                    itemDesc: [{required: true, message: "请输入任务项说明", trigger: "blur"}],
                    isRequiredPic: [{required: true, message: "请选择是否必传图片", trigger: "blur"}],
                    isRequired: [{required: true, message: "请选择是否必填项", trigger: "blur"}],
                    isInput: [{required: true, message: "请选择是否必填文本", trigger: "blur"}],
                    itemType: [{required: true, message: "请选择文本类型", trigger: "blur"}],
                    content: [{required: true, message: "请输入任务项内容", trigger: "blur"}],
                },
                tableData: [],
                dialogAddVisible: false,    //添加弹框显示
                labelPosition: 'right', //lable对齐方式
                labelWidth: '140px', //lable宽度
                formLabelWidth: '120px'
            };
        },
        mounted() {
            if (this.$route.params.id != undefined) {
                this.formAdd.id = this.$route.params.id
                this.formItemAdd.commonSubId = this.$route.params.id
            }
            this.getSubTask()
            this.getItemList()
        },
        methods: {
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
            backList() {
                this.$router.push({path: '/commonPatrolTask'})
            },
            getSubTask() {
                if (this.formAdd.id != '') {
                    let params = {
                        id: this.formAdd.id
                    }
                    this.$api.getCommonSubTaskDetail(params).then(res => {
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
                if (this.formItemAdd.commonSubId != '') {
                    let params = {
                        page: this.pageInfo.currentPage,
                        limit: this.pageInfo.pageSize,
                        commonSubId: this.formItemAdd.commonSubId
                    }
                    this.$api.getCommonTaskItemList(params).then(res => {
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
            addSubTask() {
                this.$refs['formAdd'].validate((valid) => {
                    if (valid) {
                        this.$api.addCommonSubTask(this.formAdd).then(res => {
                            if (res.code === 0) {
                                this.formAdd.id = res.data.id
                                this.getSubTask()
                                this.formItemAdd.commonSubId = res.data.id
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
                    this.addSubTask()
                } else {
                    this.modifySubTask()
                }
            },
            cancel() {
                this.$router.replace({path: "/commonPatrolTask"});
            },
            modifySubTask() {
                delete this.formAdd.createTime
                delete this.formAdd.modifyTime
                delete this.formAdd.itemList
                this.$api.modifyCommonSubTask(this.formAdd).then(res => {
                    if (res.code === 0) {
                        this.formAdd.id = res.data.id
                        this.getSubTask()
                        this.formItemAdd.commonSubId = res.data.id
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
                        this.formItemAdd.shopStandard = this.$refs.editor.getUEContent()
                        this.$api.addCommonTaskItem(this.formItemAdd).then(res => {
                            if (res.code === 0) {
                                this.cancelItem()
                                // this.getSubTask()
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
                this.$api.modifyCommonTaskItem(this.formItemAdd).then(res => {
                    if (res.code === 0) {
                        this.cancelItem()
                        // this.getSubTask()
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
                this.$api.getCommonTaskItemDetail(params).then(res => {
                    if (res.code === 0) {
                        this.openType = 'mof'
                        this.dialogAddVisible = true
                        this.formItemAdd = res.data
                        this.$refs.editor.setUEContent(this.formItemAdd.shopStandard)
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
                    commonSubId: this.formAdd.id,
                    itemName: '',
                    itenDesc: '',
                    isRequiredPic: '',
                    isRequired: '',
                    isInput: '',
                    itemType: '',
                    terms: '',
                    type: 'inspection'//巡店任务
                }
            },
            cancelItem() {
                this.dialogAddVisible = false
                // this.formAdd = {}
                this.$refs.editor.setUEContent('')
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
                    this.$api.deleteCommonTaskItem(params).then(res => {
                        if (res.code === 0) {
                            // this.getSubTask()
                            this.getItemList()
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
        width: 700px;
        margin: 0 auto;
    }

    .container {
        .top-form {
            position: relative;
            margin-left: 50px;
            margin-bottom: 20px;

            .add-form {
                width: 400px;
            }

            .btns {
                width: 400px;
                text-align: right;

                button {
                    margin-left: 20px;
                }
            }

            .back {
                position: absolute;
                right: 0;
                top: 0;
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
