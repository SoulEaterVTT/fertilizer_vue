import { put, post, deleteData } from '../utils/axios'

// 添加病虫害
export function addBch(reqData) {
    return post('/bch/save', reqData)
}
// 根据ID删除病虫害
export function deleteBchById(id) {
    return deleteData(`/bch/del/${id}`)
}
// 病虫害更新
export function updateBch(reqData) {
    return put('/bch/update', reqData)
}
// 查询病虫害
export function selectBch(page, size, reqData) {
    return post(`/bch/getList/${page}/${size}`, reqData)
}

