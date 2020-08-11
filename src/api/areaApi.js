import { put, post, deleteData } from '../utils/axios'

// 添加区域
export function addArea(reqData) {
    return post('/area/save', reqData)
}
// 根据ID删除区域
export function deleteAreaById(id) {    
    return deleteData(`/area/del/${id}`)
}
// 区域更新
export function updateArea(reqData) {
    return put('/area/update', reqData)
}
// 查询区域
export function selectArea(page, size, reqData) {
    return post(`/area/getList/${page}/${size}`, reqData)
}
