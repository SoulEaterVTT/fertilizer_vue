import { put, post, deleteData } from '../utils/axios'

// 添加品种
export function addTreeType(reqData) {
    return post('/treeType/save', reqData)
}
// 根据ID删除品种
export function deleteTreeTypeById(id) {
    return deleteData(`/treeType/del/${id}`)
}
// 品种更新
export function updateTreeType(reqData) {
    return put('/treeType/update', reqData)
}
// 查询品种
export function selectTreeType(page, size, reqData) {
    return post(`/treeType/getList/${page}/${size}`, reqData)
}
