import { put, post, deleteData } from '../utils/axios'

// 添加土壤
export function addTr(reqData) {
    return post('/tr/save', reqData)
}
// 根据ID删除土壤
export function deleteTrById(id) {
    return deleteData(`/tr/delete/${id}`)
}
// 土壤更新
export function updateTr(reqData) {
    return put('/tr/update', reqData)
}
// 查询土壤
export function selectTr(page, size, reqData) {
    return post(`/tr/getList/${page}/${size}`, reqData)
}
