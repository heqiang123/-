<template>
    <div class="container">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">
            <el-form-item label="店铺编码" prop="shopid">
                <el-input v-model="formSearch.shopid" placeholder="店铺编码"></el-input>
            </el-form-item>
            <el-form-item label="店铺名称" prop="shopname">
                <el-input v-model="formSearch.shopname" placeholder="店铺名称"></el-input>
            </el-form-item>
            <el-form-item label="员工工号" prop="employeeNo">
                <el-input v-model="formSearch.employeeNo" placeholder="员工工号"></el-input>
            </el-form-item>
            <el-form-item label="员工姓名" prop="employeeName">
                <el-input v-model="formSearch.employeeName" placeholder="员工姓名"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="warning" plain @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 操作区----start -->
        <el-row class="mgb15">
            <el-button size="small" round type="primary" @click="exportEmpShopRel()">批量导出</el-button>
        </el-row>
        <!-- 操作区----end -->
        <!-- 表格---start -->
        <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="60">
            </el-table-column>
            <el-table-column prop="email" label="邮箱号" align="center" width="120">
            </el-table-column>
            <el-table-column prop="employeeNo" label="工号" align="center" width="120">
            </el-table-column>
            <el-table-column prop="employeeName" label="姓名" align="center" width="120">
            </el-table-column>
            <el-table-column prop="postName" label="岗位名称" align="center" width="120">
            </el-table-column>
            <el-table-column prop="shopid" label="店铺编码" align="center" width="100">
            </el-table-column>
            <el-table-column prop="shopname" label="店铺名称" align="center" width="180">
            </el-table-column>
            <el-table-column prop="telephone" label="店铺联系电话" align="center" width="130">
            </el-table-column>
            <el-table-column prop="shopaddress" label="店铺营业地址" align="center" width="220">
            </el-table-column>
            <el-table-column prop="retailtypeName" label="店铺零售属性" align="center" width="130">
            </el-table-column>
            <el-table-column prop="shoptypeName" label="店铺类型" align="center" width="130">
            </el-table-column>
            <el-table-column prop="crmcode" label="公司编码" align="center" width="100">
            </el-table-column>
            <el-table-column prop="companyName" label="公司名称" align="center" width="200">
            </el-table-column>
            <el-table-column prop="depCode" label="大区编码" align="center" width="100">
            </el-table-column>
            <el-table-column prop="depName" label="大区名称" align="center" width="120">
            </el-table-column>
            <el-table-column prop="regionCode" label="省区编码" align="center" width="100">
            </el-table-column>
            <el-table-column prop="regionName" label="省区名称" align="center" width="130">
            </el-table-column>
            <el-table-column prop="provinceName" label="省份名称" align="center" width="130">
            </el-table-column>
            <el-table-column prop="cityName" label="地级市名称" align="center" width="130">
            </el-table-column>
            <el-table-column prop="updateTime" label="同步时间" align="center" width="120">
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
        name: "employeeShopRel",
        data() {
            return {
                selectValue: [],
                formSearch: { //表单查询
                    shopid: '',
                    shopname: '',
                    employeeNo: '',
                    employeeName: ''
                },
                selectListId: [],
                listLoading: false,//
                pageInfo: { //分页
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: 0
                },
                tableData: [],
                labelPosition: 'right', //lable对齐方式
                labelWidth: '120px' //lable宽度
            };
        },
        computed: {},
        mounted() {
            this.getEmployeeShopRelList()
        },
        methods: {
            getSelect(val) {
                console.log(this.formAdd.selectValue)
            },
            getEmployeeShopRelList() {
                let params = {
                    page: this.pageInfo.currentPage,
                    limit: this.pageInfo.pageSize,
                    shopid: this.formSearch.shopid,
                    shopname: this.formSearch.shopname,
                    employeeNo: this.formSearch.employeeNo,
                    employeeName: this.formSearch.employeeName
                }
                this.$api.getEmployeeShopRelList(params).then(res => {
                    if (res.code == 0) {
                        this.pageInfo.pageTotal = res.count
                        this.tableData = res.data
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            },
            exportEmpShopRel() {//导出
                let params = {
                    shopid: this.formSearch.shopid,
                    shopname: this.formSearch.shopname,
                    employeeNo: this.formSearch.employeeNo,
                    employeeName: this.formSearch.employeeName
                }
                this.$api.exportEmpShopRel(params).then(res => {
                    if (res.code == 0 && res.data != "") {
                        //下载文件
                        alert(res.data);
                        this.$api.downLoadTempFileByName(res.data)
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            },
            search() {
                this.pageInfo.currentPage = 1
                this.getEmployeeShopRelList()
            },
            reset() {
                this.formSearch.shopid = ''
                this.formSearch.shopname = ''
                this.formSearch.employeeNo = ''
                this.formSearch.employeeName = ''
            },
            handleSizeChange(size) {
                this.pageInfo.currentPage = 1
                this.pageInfo.pageSize = size
                this.getEmployeeShopRelList()
            },
            handleCurrentChange(currentPage) {
                this.pageInfo.currentPage = currentPage
                this.getEmployeeShopRelList()
            },
            handleSelectionChange(val) {
                this.selectListId = []
                val.forEach(item => {
                    this.selectListId.push(item.rid)
                });
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
</style>
