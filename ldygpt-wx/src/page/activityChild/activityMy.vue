<template>
  <div class="activityMy">
    <Information :InformationList="getmineactivityList" :information='true' :informationStyle='true' :informationGrade='true'></Information>
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
      getmineactivityList: [
        // {
        //   img: require('@/assets/images/index/bg.jpg'),
        //   title: '2019年首届单身派对，邀您共享!',
        //   position: '园区食堂二楼',
        //   time: '03.01-03.02',
        //   img2: require('@/assets/images/index/activity_icon_evaluate@2x.png'),
        //   size: '报名中',
        //   number: 'asdas'
        // },
        // {
        //   img: require('@/assets/images/index/bg.jpg'),
        //   title: '2019年首届单身派对，邀您共享!',
        //   position: '园区食堂二楼',
        //   time: '03.01-03.02',
        //   img2: require('@/assets/images/index/activity_icon_evaluate@2x.png'),
        //   size: '报名中',
        //   number: 'asdas'
        // }
      ]
    }
  },
  mounted () {
    this.getmineactivity()
  },
  methods: {
    // 查看参与过的活动
    getmineactivity () {
      let params = {
        totalNum: this.getmineactivityList.length
      }
      this.$api.getmineactivity(params).then(res => {
        if (res.code === 0) {
          this.getmineactivityList = res.data
        } else if (res.code === 1) {
          console.log('接口错误')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>

</style>
