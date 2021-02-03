<template>
  <div class="manager-contain">
    <div class="head">
      <el-form :inline="true">
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
        <el-table-column property="location" label="区域名称" align="center" />
        <el-table-column property="flName" label="肥料名称" align="center" />
        <el-table-column property="tsjg" label="价格" align="center" />

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div>
              <svg-icon style="color:#bfcbd9" icon-class="edit" @click="handleEdit(scope.row)" />
              <svg-icon style="color:#bfcbd9" icon-class="delete" @click="handleDelete(scope.row)" />
            </div>
          </template>
        </el-table-column>
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
                <el-form-item prop="tsjg" label="价格">
                  <el-input v-model="temp.tsjg" placeholder="请输入价格" />
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
              </div>
            </div>
          </el-form>
          <div slot="footer" class="form-footer">
            <el-button class="cancle-btn" @click="dialogFormVisible = false">取消</el-button>

            <el-button
              type="primary"
              class="affirm-btn"
              @click="dialogStatus === 'create' ? createData() : updateData()"
            >确认</el-button>
          </div>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import { getAreaList } from "@/api/userApi.js";
import { selectFl } from "@/api/flApi.js";
import {
  addPrice,
  selectPrice,
  deletePriceById,
  updatePrice
} from "@/api/priceApi.js";
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
      parentData: [],
      fertilizerData: [],
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
        tsjg: null
      },
      rules: {
        tsjg: [
          { required: true, message: "请输入价格", trigger: "blur" },
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
    getAreaList().then(res => {
      this.parentData = res.data;
    });
    selectFl(1, 100, {}).then(res => {
      this.fertilizerData = res.data.list;
    });
    this.getSpecialPriceList();
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
    getSpecialPriceList() {
      selectPrice(
        this.paginations.pageIndex,
        this.paginations.pageSize,
        {}
      ).then(res => {
        this.paginations.total = res.data.total;
        this.tableData = res.data.list;
      });
    },
    // 每页多少条切换
    handleSizeChange(pageSize) {
      this.paginations.pageSize = pageSize;
      this.getSpecialPriceList();
    },
    // 上下分页
    handleCurrentChange(page) {
      this.paginations.pageIndex = page;
      this.getSpecialPriceList();
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    handleDelete(row) {
      this.$confirm("是否确定删除此记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          deletePriceById(row.id).then(() => {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getSpecialPriceList();
          });
        })
        .catch(() => {
          this.$message({
            message: "已取消删除"
          });
        });
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
        tsjg: null
      };
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          addPrice(this.temp).then(() => {
            this.dialogFormVisible = false;
            this.getSpecialPriceList(); 
          });
        }
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          updatePrice(this.temp).then(() => {
            this.dialogFormVisible = false;
            this.getSpecialPriceList();
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
