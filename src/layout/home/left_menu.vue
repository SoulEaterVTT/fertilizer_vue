<template>
  <div class="menu_left">
    <div class="menu_page_top">
      <span class="span">李老师技术服务后台</span>
    </div>
    <sidebar class="sidebar-container" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import logoImg from '@/assets/logo.png'
import { Sidebar } from '@/layout/components'
export default {
  name: 'LeftMenu',
  components: { Sidebar },
  data() {
    return {
      menuObj: {
        bgColor: '#fff',
        textColor: '#666',
        activeTextColor: '#ff6428'
      },
      logo: logoImg
    }
  },
  computed: {
    ...mapGetters(['permission_routers'])
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style lang="scss">
$left-bgColor: #304156;
$icon-link: #ff6c60;
.menu_left {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  background: #f3f3f3;
}

.menu_page_top {
  width: 210px;
  left: 0;
  height: 42px;
  align-items: center;
  justify-content: space-around;
  text-transform: uppercase;
  display: flex;
  background-color: #304156;
  position: fixed;
  flex-direction: row;
}

.logo {
  height: 30px;
  width: 63px;
  margin-left: 10px;
  margin-top: 5px;
  background-color: white;
  vertical-align: middle;
  display: inline-block;
}

.span {
  height: 25px;
  vertical-align: middle;
  margin-top: 8px;
  color: white;
  display: inline-block;
}
</style>
