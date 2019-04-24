<template>
  <div class="Bindingapproval">
    <div class="BindingapprovalContent" v-for="(item,index) in staffList" :key="index">
      <div class="activityEvaluationTopBox">
        <img :src=item.headImgUrl v-if="item.headImgUrl">
        <img src="@/assets/images/timg.jpg" v-else>
        <div class="activityEvaluationTopSize">
          <p>{{item.empName}}</p>
          <p>{{item.empTel}}</p>
        </div>
      </div>
      <router-link :to="{path:'/approvaldetails',query:{id:item.id}}">
        <div class="BindingapprovalContentRight">
          <p>去审批</p>
        </div>
      </router-link>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      staffList: []
    }
  },
  mounted () {
    this.getapprovalemplist()
  },
  methods: {
    // 获取审批员工列表
    getapprovalemplist () {
      this.$api.getapprovalemplist().then(res => {
        if (res.code === 0) {
          this.staffList = res.data
        } else {
          this.$toast(res.msg)
        }
        console.log('111333', res)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.Bindingapproval{
  box-sizing: border-box;
  background: #F6F5F5;
  width: 100%;
    .BindingapprovalContent{
      background:rgba(255,255,255,1);
      box-shadow:0px 0px 5px 0px rgba(174,179,196,0.5);
      border-radius:5px;
      padding: 10px;
      box-sizing: border-box;
      margin: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
        .activityEvaluationTopBox{
          display: flex;
            img{
            width: 30px;
            height: 30px;
            border-radius: 5px;
          }
          .activityEvaluationTopSize{
            padding-left: 5px;
            p{
              font-size:15px;
              font-weight:400;
              color:#434D5D;
              line-height:17px;
            }
            p:nth-child(2){
              font-size:13px;
              font-weight:400;
              color:#748095;
              line-height:14px;
            }
          }
        }
        .BindingapprovalContentRight{
          p{
            font-size: 13px;
            color: #748095;
            padding-right: 10px;
            position: relative;
          }
          p::after{
            content: '';
            width: 8px;
            height: 12px;
            background: url(../../assets/images/index/icon_arrow@2x.png) no-repeat;
            background-size: cover;
            position: absolute;
            right: 0px;
          }
        }
    }
}
</style>
