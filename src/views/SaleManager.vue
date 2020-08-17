<template>
  <div class="manager-contain">
    <div class="head">
      <el-form :inline="true" :model="reqTemp">
        <span class="query-name">区域：</span>
        <el-select v-model="reqTemp.areaId" class="headSelect" clearable placeholder="请选择区域">
          <el-option
            v-for="item in parentData"
            :key="item.id"
            :label="item.location"
            :value="item.id"
          />
        </el-select>
        <span class="query-name">肥料：</span>
        <el-select v-model="reqTemp.flId" class="headSelect" clearable placeholder="请选择肥料">
          <el-option
            v-for="item in fertilizerData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-button type="primary" @click="getSaleList" icon="el-icon-search">查询</el-button>
        <el-button type="primary" icon="el-icon-add" @click="handleCreate">添加</el-button>
      </el-form>
    </div>
    <div class="table-contain3">
      <el-table
        :data="tableData"
        border
        stripe
        highlight-current-row
        style="width:100%"
        @cell-mouse-enter="handleMouseEnter"
        @cell-mouse-leave="handleMouseOut"
      >
        <el-table-column property="areaName" label="区域名称" align="center" />
        <el-table-column property="flName" label="肥料名称" align="center" />
        <el-table-column property="num" label="数量" align="center" />
        <el-table-column property="total" label="价格" align="center" />
        <el-table-column property="createTime" label="时间" align="center" />
        <el-table-column property="remark" label="备注" align="center" />
      </el-table>
      <el-row class="elrow-class">
        <el-col :span="24">
          <div class="pagination">
            <el-pagination
              v-if="paginations.total > 0"
              background
              :page-sizes="paginations.pageSizes"
              :page-size="paginations.pageSize"
              :layout="paginations.layout"
              :total="paginations.total"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            />
          </div>
        </el-col>
      </el-row>

      <el-drawer
        ref="drawer"
        :visible.sync="dialogFormVisible"
        direction="rtl"
        :modal="false"
        :show-close="false"
        size="100%"
        class="form-container"
      >
        <div
          class="form-content"
          style="padding-top:10%"
          :style="active"
          @mouseover="mouseOver"
          @mouseleave="mouseLeave"
        >
          <el-form
            ref="dataForm"
            :rules="rules"
            :model="temp"
            label-position="right"
            label-width="100px"
          >
            <div class="content">
              <div class="content-left">
                <el-form-item prop="areaId" label="区域">
                  <el-select v-model="temp.areaId" style="width:100%" placeholder="请选择区域">
                    <el-option
                      v-for="item in parentData"
                      :key="item.id"
                      :label="item.location"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item prop="num" label="数量">
                  <el-input v-model="temp.num" placeholder="请输入数量" />
                </el-form-item>
              </div>
              <div class="content-right">
                <el-form-item prop="flId" label="肥料">
                  <el-select v-model="temp.flId" style="width:100%" clearable placeholder="请选择肥料">
                    <el-option
                      v-for="item in fertilizerData"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="备注">
                  <el-input v-model="temp.remark" placeholder="请输入备注" />
                </el-form-item>
              </div>
            </div>
          </el-form>
          <div slot="footer" class="form-footer">
            <el-button class="cancle-btn" @click="dialogFormVisible = false">取消</el-button>

            <el-button type="primary" class="affirm-btn" @click="createData()">确认</el-button>
          </div>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import { selectFl } from "@/api/flApi.js";
import { getAreaList } from "@/api/userApi.js";
import { selectTreeType } from "@/api/treeTypeApi.js";
import { addSale, selectSale } from "@/api/saleApi.js";
import moment from "moment";
export default {
  filters: {
    formatDate: function(value) {
      return moment(parseInt(value)).format("YYYY-MM-DD h:mm:ss");
    }
  },
  data() {
    return {
      add_icon_name: "add_no",
      active: "",
      show: false,
      tableData: [],
      fertilizerData: [],
      parentData: [],
      varietyData: [],
      paginations: {
        total: 0,
        pageIndex: 1,
        pageSize: 14,
        pageSizes: [14, 20],
        layout: "total, sizes, prev, pager, next, jumper"
      },
      dialogFormVisible: false,
      dialogStatus: "",
      temp: {
        id: null,
        areaId: null,
        flId: null,
        num: null,
        remark: null
      },
      reqTemp: {
        flId: null,
        areaId: null
      },
      rules: {
        num: [
          { required: true, message: "请输入数量", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur"
          }
        ],
        areaId: [{ required: true, message: "请选择区域", trigger: "change" }],
        flId: [{ required: true, message: "请选择区域", trigger: "change" }]
      }
    };
  },
  watch: {
    show(value) {
      if (value) {
        document.body.addEventListener("click", this.close);
      } else {
        document.body.removeEventListener("click", this.close);
      }
    }
  },
  created() {},
  mounted() {
    selectTreeType(1, 500, {}).then(res => {
      this.varietyData = res.data.list;
    });
    getAreaList().then(res => {
      this.parentData = res.data;
    });
    selectFl(1, 100, {}).then(res => {
      this.fertilizerData = res.data.list;
    });
    this.getSaleList();
  },
  methods: {
    handleMouseEnter: function(row, column, cell, event) {
      cell.children[0].children[0].children[0].style.color = "#70cdf1";
      cell.children[0].children[0].children[1].style.color = "#f56c6c";
      cell.children[0].children[0].children[2].style.color = "#42b983";
      cell.children[0].children[0].children[3].style.color = "#64d9d6";
    },
    handleMouseOut: function(row, column, cell, event) {
      cell.children[0].children[0].children[0].style.color = "#bfcbd9";
      cell.children[0].children[0].children[1].style.color = "#bfcbd9";
      cell.children[0].children[0].children[2].style.color = "#bfcbd9";
      cell.children[0].children[0].children[3].style.color = "#bfcbd9";
    },
    handleAddMouseOver() {
      this.add_icon_name = "add_yes";
    },
    handleAddMouseLeave() {
      this.add_icon_name = "add_no";
    },
    mouseOver() {
      this.active =
        "box-shadow: 0 0 8px 0 rgba(232,237,250,.6), 0 2px 4px 0 rgba(232,237,250,.5);";
    },
    mouseLeave() {
      this.active = "";
    },
    getSaleList() {
      selectSale(
        this.paginations.pageIndex,
        this.paginations.pageSize,
        this.reqTemp
      ).then(res => {
        this.paginations.total = res.data.total;
        this.tableData = res.data.list;
      });
    },
    // 每页多少条切换
    handleSizeChange(pageSize) {
      this.paginations.pageSize = pageSize;
      this.getSaleList();
    },
    // 上下分页
    handleCurrentChange(page) {
      this.paginations.pageIndex = page;
      this.getSaleList();
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    handleEdit(row) {
      this.temp = row;
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
    },
    resetTemp() {
      this.temp = {
        id: null,
        areaId: null,
        flId: null,
        num: null,
        remark: null
      };
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          addSale(this.temp).then(() => {
            this.dialogFormVisible = false;
            this.getSaleList();
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
