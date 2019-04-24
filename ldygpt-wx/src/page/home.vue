<template>
<div>
  <router-view></router-view>
  <!-- <van-tabbar v-model="active" active-color="rgba(245,72,68,1)" v-if="activeState"> -->
  <van-tabbar v-model="active" active-color="rgba(245,72,68,1)">
  <van-tabbar-item v-for="(item,index) in tabData" :key="index" :to="item.url">
    <span>{{item.title}}</span>
    <img
      slot="icon"
      slot-scope="props"
      :src="props.active ? item.icon.active : item.icon.normal"
    >
  </van-tabbar-item>
</van-tabbar>
<!-- <van-tabbar v-model="$active" active-color="rgba(245,72,68,1)" v-else>
<van-tabbar-item v-for="(item,index) in tabData" :key="index" :to="item.url">
    <span>{{item.title}}</span>
    <img
      slot="icon"
      slot-scope="props"
      :src="props.active ? item.icon.active : item.icon.normal"
    >
  </van-tabbar-item>
</van-tabbar> -->
</div>
</template>
<script>
export default {
  data () {
    return {
      active: 0,
      activeState: true,
      tabData: [
        {
          title: '首页',
          index: 0,
          url: '/home/indexhome',
          icon: {
            normal: require('../assets/images/menu_home_normal@2x.png'),
            active: require('../assets/images/menu_home_selected@2x.png')
          }
        },
        {
          title: '就餐',
          index: 1,
          url: '/home/topUp',
          icon: {
            normal: require('../assets/images/menu_food_normal@2x.png'),
            active: require('../assets/images/menu_food_selected@2x.png')
          }
        },
        {
          title: '活动',
          index: 2,
          url: '/home/activity',
          icon: {
            normal: require('../assets/images/menu_activity_normal@2x.png'),
            active: require('../assets/images/menu_activity_selected@2x.png')
          }
        },
        {
          title: '我的',
          index: 3,
          url: '/home/personal',
          icon: {
            normal: require('../assets/images/menu_user_normal@2x.png'),
            active: require('../assets/images/menu_user_selected02@2x.png')
          }
        }
      ]

    }
  },
  // watch: {
  //   path () {
  //     console.log('path111111111', this.path)
  //     if (this.$route.path === '/indexhone') {
  //       this.active = 0
  //     }
  //   }
  // },
  watch: {
    '$route' (to, from) {
      console.log('888888888888888', to, from)
      if (to.name === 'indexhome') {
        console.log('active11111111111')
        this.active = 0
      } else if (to.name === 'topUp') {
        this.active = 1
      } else if (to.name === 'activity') {
        this.active = 2
      } else if (to.name === 'personal') {
        this.active = 3
      }
    }
  },
  mounted () {
    this.confirmPath()
    console.log('当前页面路由')
  },
  methods: {
    // 确定当前下标
    confirmPath () {
      // this.path = this.$route.path
      this.tabData.forEach((item, index) => {
        if (item.url === this.$route.path) {
          this.active = item.index
        }
      })
    }
  }
}
</script>
<style lang="less">

</style>
