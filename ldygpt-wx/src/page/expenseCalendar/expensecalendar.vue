<template>
  <div class="expensecalendar">
    <van-tabs v-model="active" @change="statusFun">
      <van-tab :title="$route.query.index === 0?'当日充值':'当日消费'">
        <recording-list :momentData="presentMomentData" :recType="$route.query.index"></recording-list>
      </van-tab>
      <van-tab :title="$route.query.index === 0?'历史充值':'历史消费'">
        <recording-list :momentData="historyMomentData" :recType="$route.query.index"></recording-list>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import recordingList from './component/recordingList'
export default {
  components: {
    'recording-list': recordingList
  },
  data () {
    return {
      active: 0,
      presentMomentData: [],
      historyMomentData: []
    }
  },
  mounted () {
    this.myCurrDayConsumerRecord()
  },
  methods: {
    // 当日记录
    myCurrDayConsumerRecord () {
      let params = {}
      if (this.$route.query.index === 0) {
        params = {
          recType: '0'
        }
      } else {
        params = {
          recType: '1'
        }
      }
      this.$api.myCurrDayConsumerRecord(params).then(res => {
        if (res.code === 0) {
          this.presentMomentData = res.data
          console.log('=====', this.presentMomentData)
        }
      })
    },
    // 历史记录
    myHistoryConsumerRecord () {
      let params = {}
      if (this.$route.query.index === 0) {
        params = {
          recType: '0'
        }
      } else {
        params = {
          recType: '1'
        }
      }
      this.$api.myHistoryConsumerRecord(params).then(res => {
        if (res.code === 0) {
          this.historyMomentData = []
        }
      })
    },
    statusFun () {
      if (this.active === 0) {
        this.myCurrDayConsumerRecord()
      } else {
        this.myHistoryConsumerRecord()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.expensecalendar {
  box-sizing: border-box;
  background: #F6F5F5;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0px;
  bottom: 0px;
}
</style>
