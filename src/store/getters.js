const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  permission_routers: state => state.permission.routers,
  token: state => state.user.token,
  // errorLogs: state => state.errorLog.logs
}
export default getters
