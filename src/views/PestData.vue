<template>
  <div class="manager-contain">
    <div class="head">
      <el-form :inline="true" :model="reqTemp">
        <span class="query-name">名称：</span>
        <el-select
          v-model="reqTemp.id"
          class="headSelect"
          clearable
          placeholder="请选择病虫害名称"
          @change="setBchValue"
        >
          <el-option v-for="item in bchData" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <el-button type="primary" @click="getBchList" icon="el-icon-search">查询</el-button>
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
        <el-table-column property="name" label="名称" align="center" />
        <el-table-column property="wbmsRemark" label="文字描述" align="center" />
        <el-table-column property="fileRemark" label="图片描述" align="center" />
        <el-table-column property="prevention" label="防治" align="center" />
        <el-table-column property="remark" label="备注" align="center" />

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
                <el-form-item prop="name" label="名称">
                  <el-input v-model="temp.name" placeholder="请输入名称" />
                </el-form-item>
                <el-form-item label="文字描述">
                  <el-input v-model="temp.wbmsRemark" placeholder="请输入文字描述" />
                </el-form-item>
                <el-form-item label="防治">
                  <el-input v-model="temp.prevention" placeholder="请输入如何防治" />
                </el-form-item>
              </div>
              <div class="content-right">
                <el-form-item label="图片描述">
                  <el-input v-model="temp.fileRemark" placeholder="请输入图片描述" />
                </el-form-item>
                <el-form-item label="备注">
                  <el-input v-model="temp.remark" placeholder="请输入备注" />
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
import {
  addBch,
  updateBch,
  deleteBchById,
  selectBch
} from "@/api/bchDataApi.js";
export default {
  data() {
    return {
      add_icon_name: "add_no",
      active: "",
      show: false,
      tableData: [],
      bchData: [],
      paginations: {
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        pageSizes: [10, 20],
        layout: "total, sizes, prev, pager, next, jumper"
      },
      dialogFormVisible: false,
      dialogStatus: "",
      temp: {
        id: null,
        name: null,
        wbmsRemark: null,
        fileRemark: null,
        remark: null,
        prevention: null,
        createTime: null,
        updateTime: null
      },
      reqTemp: {
        id: null
      },
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            min: 2,
            max: 50,
            message: "长度在 2 到 50 个字符",
            trigger: "blur"
          }
        ],
        fileRemark: [
          { required: true, message: "请输入图片描述", trigger: "blur" },
          {
            min: 2,
            max: 50,
            message: "长度在 2 到 50 个字符",
            trigger: "blur"
          }
        ],
        remark: [
          { required: true, message: "请输入备注", trigger: "blur" },
          {
            min: 2,
            max: 50,
            message: "长度在 2 到 50 个字符",
            trigger: "blur"
          }
        ]
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
    this.getBchList();
  },
  methods: {
    setAccessValue(event) {
      this.temp.access = event;
    },
    setDomainValue(event) {
      this.temp.domain = event;
    },
    handleMouseEnter: function(row, column, cell, event) {
      cell.children[0].children[0].children[0].style.color = "#64d9d6";
      cell.children[0].children[0].children[1].style.color = "#f56c6c";
    },
    handleMouseOut: function(row, column, cell, event) {
      cell.children[0].children[0].children[0].style.color = "#bfcbd9";
      cell.children[0].children[0].children[1].style.color = "#bfcbd9";
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
    getBchList() {
      selectBch(
        this.paginations.pageIndex,
        this.paginations.pageSize,
        this.reqTemp
      ).then(res => {
        this.paginations.total = res.data.total;
        this.tableData = res.data.list;
      });
      selectBch(1, 500, {}).then(res => {
        this.bchData = res.data.list;
      });
    },
    // 每页多少条切换
    handleSizeChange(pageSize) {
      this.paginations.pageSize = pageSize;
      this.getBchList();
    },
    // 上下分页
    handleCurrentChange(page) {
      this.paginations.pageIndex = page;
      this.getBchList();
    },
    handleDelete(row) {
      this.$confirm("是否确定删除此病虫害?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          deleteBchById(row.id).then(() => {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getBchList();
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
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    resetTemp() {
      this.temp = {
        id: null,
        name: null,
        wbmsRemark: null,
        fileRemark: null,
        remark: null,
        prevention: null,
        createTime: null,
        updateTime: null
      };
    },

    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          addBch(this.temp).then(() => {
            this.dialogFormVisible = false;
            this.getBchList();
          });
        }
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          updateBch(this.temp).then(() => {
            this.dialogFormVisible = false;
            this.getBchList();
          });
        }
      });
    },
    setBchValue(event) {
      this.temp.id = event;
    },
    click() {
      this.show = !this.show;
      if (this.show) {
        this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.focus();
      }
    },
    close() {
      this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.blur();
      this.options = [];
      this.show = false;
    }
  }
};
</script>

<style lang="scss" scoped></style>
