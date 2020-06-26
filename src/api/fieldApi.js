import { put, post, deleteData } from '../utils/axios'

// 添加地块
export function addField(reqData) {
  return post('/field/save', reqData)
}
// 根据ID删除地块
export function deleteFieldById(id) {
  return deleteData(`/field/delete/${id}`)
}
// 地块更新
export function updateField(reqData) {
  return put('/field/update', reqData)
}
// 查询地块
export function selectField(page, size, reqData) {
  return post(`/field/getList/${page}/${size}`, reqData)
}