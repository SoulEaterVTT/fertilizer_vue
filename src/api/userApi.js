import { get, put, post, deleteData } from '../utils/axios'

// 用户登录
export function login(reqData) {
  return post('/user/login', reqData)
}

// 添加用户
export function addUser(reqData) {
  return post('/user/save', reqData)
}

// 根据ID删除用户
export function deleteUserById(id) {
  return deleteData(`/user/delete/${id}`)
}
// 用户更新
export function updateUser(reqData) {
  return put('/user/update', reqData)
}
// 分页查询用户
export function selectUser(page, size, reqData) {
  return post(`/user/getList/${page}/${size}`, reqData)
}

// 获取所有区域
export function getAreaList() {
  return get(`/user/getAreaList`)
}

