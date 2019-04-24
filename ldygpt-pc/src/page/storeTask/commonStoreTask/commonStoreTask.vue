<template>
    <div class="container">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">
            <el-form-item label="任务项名称" prop="itemName">
                <el-input v-model="formSearch.itemName" placeholder="任务项名称"></el-input>
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
            <el-button size="small" round type="danger" @click="deleteItem('all')">批量删除</el-button>
        </el-row>
        <!-- 操作区----end -->
        <!-- 表格---start -->
        <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%"
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
            <el-table-column label="状态" align="center" width="100">
                <template slot-scope="scope">
                    <span>{{ scope.row.status=='A'?'生效':'失效' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="itemType" label="任务项类型" align="center">
                <template slot-scope="scope">
                    <span>{{formatDict(scope.row.itemType, 'itemType')}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="creator" label="创建人" align="center">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center" :formatter="this.$common.timestampToTime">
            </el-table-column>
            <el-table-column label="操作" width="230" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" @click="getDetail(scope.row)">编辑</el-button>
                    <el-button size="mini" plain type="danger" @click="deleteItem('one', scope.row.id)">删除</el-button>
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
        <el-dialog :title="openType == 'add'? '新增任务项': '修改任务项'" :visible.sync="dialogAddVisible" width="700px"
                   :before-close="cancel">
            <el-form :label-position="labelPosition" :label-width="labelWidth1" :rules="rulesAdd" :model="formAdd"
                     ref='formAdd' class="add-dialog-form">
                <el-form-item label="任务项名称" prop="itemName">
                    <el-input v-model="formAdd.itemName" placeholder="任务项名称"></el-input>
                </el-form-item>
                <el-form-item label="任务项说明" prop="itemDesc">
                    <el-input v-model="formAdd.itemDesc" placeholder="任务项说明"></el-input>
                </el-form-item>
                <el-form-item label="是否必传图片" prop="isRequiredPic">
                    <el-radio-group v-model="formAdd.isRequiredPic">
                        <el-radio label="Y">是</el-radio>
                        <el-radio label="N">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否必填项" prop="isRequired">
                    <el-radio-group v-model="formAdd.isRequired">
                        <el-radio label="Y">是</el-radio>
                        <el-radio label="N">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="任务项类型" prop="itemType">
                    <el-radio-group v-model="formAdd.itemType" class="text-type">
                        <el-radio label="text">文本输入框</el-radio>
                        <el-radio label="number">数字输入框</el-radio>
                        <el-radio label="time">时间输入框</el-radio>
                        <el-radio label="radio">单选框</el-radio>
                        <el-radio label="select">多选框</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="任务项内容" prop="content"
                              v-if="formAdd.itemType == 'radio' || formAdd.itemType == 'select'">
                    <el-input v-model="formAdd.terms" placeholder="任务项内容"></el-input>
                </el-form-item>
                <el-form-item label="是否显示文本框" prop="isInput"
                              v-if="formAdd.itemType == 'radio' || formAdd.itemType == 'select'">
                    <el-radio-group v-model="formAdd.isInput">
                        <el-radio label="Y">是</el-radio>
                        <el-radio label="N">否</el-radio>
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
        name: 'commonStoreTask',
        data() {
            return {
                formSearch: { //表单查询
                    itemName: '',
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
                    itemName: '',
                    itenDesc: '',
                    isRequiredPic: '',
                    isRequired: '',
                    isInput: '',
                    itemType: '',
                    terms: '',
                    type: 'store'
                },
                rulesAdd: {
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
                labelWidth: '120px', //lable宽度
                labelWidth1: '140px', //lable宽度
                formLabelWidth: '120px'
            };
        },
        mounted() {
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
            getItemList() {
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
                        this.tableData = res.data
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            },
            search() {
                this.pageInfo.currentPage = 1
                this.getItemList()
            },
            reset() {
                this.formSearch.itemName = ''
                this.formSearch.status = ''
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
            addItem() {
                this.$refs['formAdd'].validate((valid) => {
                    if (valid) {
                        this.$api.addCommonTaskItem(this.formAdd).then(res => {
                            if (res.code === 0) {
                                this.cancel()
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
                if (this.openType == 'add') {
                    this.addItem()
                } else {
                    this.modifyItem()
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
                    id: data.id
                }
                this.$api.getCommonTaskItemDetail(params).then(res => {
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
            modifyItem() {
                delete this.formAdd.createTime
                delete this.formAdd.modifyTime
                this.$api.modifyCommonTaskItem(this.formAdd).then(res => {
                    if (res.code === 0) {
                        this.cancel()
                        this.getItemList()
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
                this.$api.modifyCommonTaskItemStatus(params).then(res => {
                    if (res.code === 0) {
                        this.getItemList()
                        this.$message.success('修改成功')
                    } else {
                        // 失败提示
                        this.$message.error(res.msg)
                    }
                })
            },
            deleteItem(type, id) {
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
                    this.$api.deleteCommonTaskItem(params).then(res => {
                        if (res.code === 0) {
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
        width: 500px;
        margin: 0 auto;
    }

    .text-type {
        .el-radio {
            width: 33%;
            margin: 2px 0;
        }

        .el-radio + .el-radio {
            margin-left: 0;
            width: 33%;
        }
    }
</style>
