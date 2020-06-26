<template>
  <div :class="classObj" class="app-wrapper">
    <left-menu class="left-menu" />
    <div class="main-container">
      <div class="fixed-header">
        <head-nav />
        <tags-view />
      </div>
      <div ref="menu_content" class="menu_content">
        <transition name="fade-transform" mode="out-in">
          <router-view />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import LeftMenu from './left_menu'
import HeadNav from './headNav'
import { TagsView } from '@/layout/components'
export default {
  name: 'Home',
  // eslint-disable-next-line vue/no-unused-components
  components: { HeadNav, LeftMenu, TagsView },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss">
@import "~@/style/mixin.scss";
@import "~@/style/variables.scss";
.menu_content {
  padding-top: 84px;
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.home {
  .menu_right {
    overflow: auto;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    background: #f6f7fc;
  }

  .left-menu {
    .svg-icon {
      margin-right: 16px;
    }
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}
.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}
</style>
