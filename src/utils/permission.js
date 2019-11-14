/**权限管理工具类 */
/**
 * 通过authority判断是否与当前用户权限匹配
 * @param menus
 * @param route
 */
function hasPermission(menus, route) {
    if (route.authority) {
      if (menus.get(route.authority) !== undefined) {
        return menus.get(route.authority);
      } else {
        return false
      }
    } else {
      return true
    }
  }
/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap 需要授权的菜单
 * @param menus 用户能够访问的菜单
 * @param menuMaps 后台获取到的所以菜单
 */
function filterAsyncRouter(asyncRouterMap, menus, menuMaps) {
    const accessedRouters = asyncRouterMap.filter(route => {
      if (hasPermission(menus, route)) {
        const data = menuMaps.get(route.authority)
        if (data === undefined) {
          return false
        }
        try {
          route.title = data.title
        } catch (err) {
          route.title = data.name
        }
        route.icon = menuMaps.get(route.authority).icon
        if (route.children && route.children.length) {
          route.children = filterAsyncRouter(route.children, menus, menuMaps)
        }
        return true
      }
      return false
    })
    return accessedRouters
  }
  export {filterAsyncRouter}