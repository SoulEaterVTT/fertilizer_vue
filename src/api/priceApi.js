import { put, post, deleteData } from '../utils/axios'

// 添加价格管理
export function addPrice(reqData) {
  return post('/tsjg/save', reqData)
}
// 根据ID删除价格管理
export function deletePriceById(id) {
  return deleteData(`/tsjg/delete/${id}`)
}
// 价格管理更新
export function updatePrice(reqData) {
  return put('/tsjg/update', reqData)
}
// 查询价格管理
export function selectPrice(page, size, reqData) {
  return post(`/tsjg/getList/${page}/${size}`, reqData)
}