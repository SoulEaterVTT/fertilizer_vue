/**
 * 获取Token
 * @param TokenKey
 * @returns {any}
 */
export function getToken(TokenKey) {
  return this.$cookies.get(TokenKey)
}

/**
 * 设置Token
 * @param TokenKey
 * @param token
 * @param time
 *            1.new Date(2019,9,13).toUTCString()   2019年10月13日删除，new Date月份设置是从0开始的
 *            2.-1 永不删除
 *            3.60 一分钟后删除
 *            4.‘10s' 10秒后删除
 * @returns {VueCookies | install}
 */
export function setToken(TokenKey, token, time) {
  return this.$cookies.set(TokenKey, token, time)
}

/**
 * 删除Token
 * @param TokenKey
 * @returns {VueCookies | r}
 */
export function removeToken(TokenKey) {
  return this.$cookies.remove(TokenKey)
}

/**
 * 判断Token是否存在
 * @param TokenKey
 * @returns {boolean}
 */
export function isToken(TokenKey) {
  return this.$cookies.isKey(TokenKey)
}
