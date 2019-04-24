<template>
  <div class="activity">
    <van-tabs v-model="active" @change="statusFun">
      <van-tab title="报名中">
        <Information :InformationList="getactivitybyuserList" :informationHide='true' ></Information>
      </van-tab>
      <van-tab title="已结束">
        <Information :InformationList="getactivitybyuserList" :informationHide='true'></Information>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import Information from '@/components/activityInformation/Information'
export default {
  components: {
    Information
  },
  data () {
    return {
      active: 0,
      getactivitybyuserList: [],
      tabList: ['active', 'over']
    }
  },
  mounted () {
    this.getactivitybyuser()
  },
  methods: {
    // 活动列表页面
    getactivitybyuser () {
      let params = {
        totalNum: 0,
        status: this.tabList[this.active]
      }
      this.$api.getactivitybyuser(params).then(res => {
        if (res.code === 0) {
          this.getactivitybyuserList = res.data
        } else if (res.code === 1) {
          console.log('接口错误')
        }
      })
    },
    statusFun () {
      this.getactivitybyuser()
    }
  }
}
</script>

<style lang="less" scoped>
.activity {
  box-sizing: border-box;
  background: #F6F5F5;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0px;
  bottom: 0px;
}
</style>
