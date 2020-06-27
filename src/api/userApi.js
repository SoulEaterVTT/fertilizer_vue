import { get, put, post, deleteData } from '../utils/axios'

// 用户登录
export function login(reqData) {
  return post('/fertilizer/user/login', reqData)
}

// 添加用户
export function addUser(reqData) {
  return post('/fertilizer/user/save', reqData)
}

// 根据ID删除用户
export function deleteUserById(id) {
  return deleteData(`/fertilizer/user/delete/${id}`)
}
// 用户更新
export function updateUser(reqData) {
  return put('/fertilizer/user/update', reqData)
}
// 分页查询用户
export function selectUser(page, size, reqData) {
  return post(`/fertilizer/user/getList/${page}/${size}`, reqData)
}

// 查询父级用户
export function selectParentUser() {
  return get(`/fertilizer/user/getParentList`)
}

