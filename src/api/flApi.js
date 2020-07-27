import { put, post, deleteData } from '../utils/axios'

// 添加肥料
export function addFl(reqData) {
    return post('/fl/save', reqData)
}
// 根据ID删除肥料
export function deleteFlById(id) {
    return deleteData(`/fl/delete/${id}`)
}
// 肥料更新
export function updateFl(reqData) {
    return put('/fl/update', reqData)
}
// 查询肥料
export function selectFl(page, size, reqData) {
    return post(`/fl/getList/${page}/${size}`, reqData)
}
