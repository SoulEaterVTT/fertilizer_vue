import { get, put, post, deleteData } from '../utils/axios'

// 添加病虫害
export function addBch(reqData) {
    return post('/jd/save', reqData)
}
// 根据ID删除病虫害
export function deleteBchById(id) {
    return deleteData(`/jd/del/${id}`)
}
// 病虫害更新
export function updateBch(reqData) {
    return put('/jd/update', reqData)
}
// 查询病虫害
export function selectBch() {
    return get('/jd/getList/')
}

