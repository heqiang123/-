<template>
    <div class="container">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">
            <el-form-item label="系统岗位名称" prop="positionName">
                <el-input v-model="formSearch.positionName" placeholder="系统岗位名称"></el-input>
            </el-form-item>
            <el-form-item label="岗位创建人" prop="creater">
                <el-input v-model="formSearch.creater" placeholder="岗位创建人"></el-input>
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
            <el-button size="small" round type="danger" @click="deleteSysMap('all')">批量删除</el-button>
        </el-row>
        <!-- 操作区----end -->
        <!-- 表格---start -->
        <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="60">
            </el-table-column>
            <el-table-column prop="positionCode" label="系统岗位编码" align="center">
            </el-table-column>
            <el-table-column prop="positionName" label="系统岗位名称" align="center">
            </el-table-column>
            <el-table-column prop="remark" label="系统岗位备注" align="center">
            </el-table-column>
            <el-table-column prop="creater" label="创建人" align="center">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center">
            </el-table-column>
            <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.status=='A'?'生效':'失效' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="230" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" plain type="primary" @click="showDetail(scope.row)">详情</el-button>
                    <el-button size="mini" @click="getDetail(scope.row)">编辑</el-button>
                    <el-button size="mini" plain type="danger" @click="deleteSysMap('one', scope.row.id)">删除</el-button>
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
        <el-dialog :title="openType == 'add'? '新增系统岗位': '修改系统岗位'" :visible.sync="dialogAddVisible" width="700px"
                   :before-close="cancel">
            <el-form :label-position="labelPosition" :label-width="labelWidth" :rules="rulesAdd" :model="formAdd"
                     ref='formAdd' class="add-dialog-form">
                <el-form-item label="系统岗位编码" prop="positionCode">
                    <el-input v-model="formAdd.positionCode" placeholder="系统岗位编码"></el-input>
                </el-form-item>
                <el-form-item label="系统岗位名称" prop="positionName">
                    <el-input v-model="formAdd.positionName" placeholder="系统岗位名称"></el-input>
                </el-form-item>
                <el-form-item label="系统岗位备注" prop="remark">
                    <el-input v-model="formAdd.remark" placeholder="系统岗位备注"></el-input>
                </el-form-item>
                <!--
                <el-form-item label="岗位类型" prop="positionType">
                    <el-radio-group v-model="formAdd.positionType">
                        <el-radio label="sys">系统岗位</el-radio>
                        <el-radio label="mdm">映射岗位</el-radio>
                    </el-radio-group>
                </el-form-item>-->
            </el-form>
            <!--
             <el-transfer :titles="titles" v-if="formAdd.positionType == 'mdm'" v-model="formAdd.details" :data="dataList" class="sys-transfer" filterable @change="getSelect"></el-transfer>
             -->
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 新增弹框-end -->
        <el-dialog title="详情" :visible.sync="dialogShowVisible" width="700px">
            <el-form :label-position="labelPosition" :label-width="labelWidth" :model="formDetail" ref='formAdd'
                     class="add-dialog-form" disabled>
                <el-form-item label="系统岗位编码" prop="positionCode">
                    <el-input v-model="formDetail.positionCode" placeholder="系统岗位编码"></el-input>
                </el-form-item>
                <el-form-item label="系统岗位名称">
                    <el-input v-model="formDetail.positionName" placeholder="系统岗位名称"></el-input>
                </el-form-item>
                <el-form-item label="系统岗位备注">
                    <el-input v-model="formDetail.remark" placeholder="系统岗位备注"></el-input>
                </el-form-item>
                <!--
                <el-form-item label="岗位类型" >
                    <el-radio-group v-model="formDetail.positionType">
                        <el-radio label="sys">系统岗位</el-radio>
                        <el-radio label="mdm">映射岗位</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="已选岗位" >
                    <div class="position-list">
                        <div class="position-item" v-for="(item, index) in formDetail.details" :key="index">{{item.mdmPositionName}}</div>
                    </div>
                </el-form-item>
                -->
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "systemMap",
        data() {
            return {
                formDetail: {},
                dialogShowVisible: false,
                //titles: ['可选岗位', '已选岗位'],
                selectValue: [],
                dataList: [],
                formSearch: { //表单查询
                    positionName: '',
                    creater: ''
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
                    positionName: '',
                    remark: '',
                    details: [],
                    positionType: ''
                },
                rulesAdd: {
                    positionCode: [
                        {required: true, message: "请输入岗位编码", trigger: "blur"},
                        {min: 1, max: 15, message: '岗位编码长度不超过15个字符', trigger: 'blur'}
                    ],
                    positionName: [
                        {required: true, message: "请输入岗位名称", trigger: "blur"},
                        {min: 1, max: 10, message: '岗位名称长度不超过10个字符', trigger: 'blur'}
                    ],
                    remark: [{min: 0, max: 30, message: '岗位备注长度不超过30个字符', trigger: 'blur'}]
                    // positionType: [{ required: true, message: "请选择状态", trigger: "blur" }]
                },
                tableData: [],
                dialogAddVisible: false,    //添加弹框显示
                labelPosition: 'right', //lable对齐方式
                labelWidth: '120px', //lable宽度
                formLabelWidth: '120px'
            };
        },
        computed: {},
        mounted() {
            this.getSysMapList()
            //this.findMdmPositionInfo()
        },
        methods: {
            getSelect(val) {
                console.log(this.formAdd.selectValue)
            },
            getSysMapList() {
                let params = {
                    page: this.pageInfo.currentPage,
                    limit: this.pageInfo.pageSize,
                    positionName: this.formSearch.positionName,
                    creater: this.formSearch.creater
                }
                this.$api.getSysMapList(params).then(res => {
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
                this.getSysMapList()
            },
            reset() {
                this.formSearch.positionName = ''
                this.formSearch.creater = ''
            },
            handleSizeChange(size) {
                this.pageInfo.currentPage = 1
                this.pageInfo.pageSize = size
                this.getSysMapList()
            },
            handleCurrentChange(currentPage) {
                this.pageInfo.currentPage = currentPage
                this.getSysMapList()
            },
            addSysMap() {
                /*let mdmItem = {}
                let selectList = []
                this.formAdd.details.forEach(item => {
                    mdmItem = {}
                    mdmItem.mdmPositionName = item
                    selectList.push(mdmItem)
                })
                this.formAdd.detailstr = JSON.stringify(selectList)
                delete this.formAdd.details*/
                this.$refs['formAdd'].validate((valid) => {
                    if (valid) {
                        this.$api.addSysMap(this.formAdd).then(res => {
                            if (res.code === 0) {
                                this.cancel()
                                this.getSysMapList()
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
                    this.addSysMap()
                } else {
                    this.modifyMdmPosition()
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
                let params = {
                    id: data.id
                }
                this.$api.getSysMapDetail(params).then(res => {
                    if (res.code === 0) {
                        this.openType = 'mof'
                        this.dialogAddVisible = true
                        this.formAdd = res.data
                        /*let selectList = []
                        if (res.data.details && res.data.details.length > 0) {
                            res.data.details.forEach(item => {
                                selectList.push(item.mdmPositionName)
                            })
                        }
                        this.formAdd.details = selectList*/
                    } else {
                        // 失败提示
                        this.$message.error(res.msg)
                    }
                })
            },
            showDetail(data) {
                let params = {
                    id: data.id
                }
                this.$api.getSysMapDetail(params).then(res => {
                    if (res.code === 0) {
                        this.dialogShowVisible = true
                        this.formDetail = res.data

                    } else {
                        // 失败提示
                        this.$message.error(res.msg)
                    }
                })
            },
            /*findMdmPositionInfo () {
                this.$api.findMdmPositionInfo().then(res => {
                    if (res.code === 0) {
                        res.data.forEach(item => {
                            let mdmItem = {}
                            mdmItem.key = item
                            mdmItem.label = item
                            this.dataList.push(mdmItem)
                        })
                    } else {
                        // 失败提示
                        this.$message.error(res.msg)
                    }
                })
            },*/
            modifyMdmPosition() {
                delete this.formAdd.createTime
                delete this.formAdd.modifyTime
                delete this.formAdd.creater
                delete this.formAdd.modifier
                /*let mdmItem = {}
                let selectList = []
                this.formAdd.details.forEach(item => {
                    mdmItem = {}
                    mdmItem.mdmPositionName = item
                    selectList.push(mdmItem)
                })
                this.formAdd.detailstr = JSON.stringify(selectList)
                delete this.formAdd.details*/
                this.$api.modifyMdmPosition(this.formAdd).then(res => {
                    if (res.code === 0) {
                        this.cancel()
                        this.getSysMapList()
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
            },
            change(status) {
                let params = {
                    ids: this.selectListId.join(','),
                    status: 'A'
                }
                if (status == 'D') {
                    params.status = 'D'
                }
                this.$api.modifyMdmStatus(params).then(res => {
                    if (res.code === 0) {
                        this.getSysMapList()
                        this.$message.success('修改成功')
                    } else {
                        // 失败提示
                        this.$message.error(res.msg)
                    }
                })
            },
            deleteSysMap(type, id) {
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
                    this.$api.deleteSysMap(params).then(res => {
                        if (res.code === 0) {
                            this.getSysMapList()
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

    .sys-transfer {
        width: 500px;
        margin: 0 auto;
    }

    .position-list {
        max-height: 200px;
        overflow-y: scroll;
    }
</style>
