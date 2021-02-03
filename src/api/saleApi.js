import {  post } from '../utils/axios'

// 添加订单
export function addSale(reqData) {
    return post('/xsjl/save', reqData)
}

// 查询订单
export function selectSale(page, size, reqData) {
    return post(`/xsjl/getList/${page}/${size}`, reqData)
}

// 查询详情
export function selectSaleDetail(page, size, reqData) {
    return post(`/xsjl/detail/${page}/${size}`, reqData)
}