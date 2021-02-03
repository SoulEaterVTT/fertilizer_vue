<template>
  <div class="manager-contain">
    <div class="head">
      <el-form :inline="true" :model="reqTemp">
        <span class="query-name">品种：</span>
        <el-select
          v-model="reqTemp.id"
          class="headSelect"
          clearable
          placeholder="请选择品种"
          @change="setParentValue"
        >
          <el-option
            v-for="item in varietyData"
            :key="item.id"
            :label="item.treeName"
            :value="item.id"
          />
        </el-select>

        <el-button type="primary" @click="getVarietyList" icon="el-icon-search">查询</el-button>
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
        <el-table-column property="treeName" label="名称" align="center" />
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
                <el-form-item prop="treeName" label="名称">
                  <el-input v-model="temp.treeName" placeholder="请输入名称" />
                </el-form-item>
                <!-- <el-form-item prop="myTime" label="萌芽期">
                  <el-input v-model="temp.myTime" placeholder="请输入注意事项" />
                </el-form-item>
                <el-form-item prop="khTime" label="开花期">
                  <el-input v-model="temp.khTime" placeholder="请输入注意事项" />
                </el-form-item>
                <el-form-item prop="zgTime" label="坐果期">
                  <el-input v-model="temp.zgTime" placeholder="请输入注意事项" />
                </el-form-item>
                <el-form-item prop="chpgTime" label="促花膨果期">
                  <el-input v-model="temp.chpgTime" placeholder="请输入注意事项" />
                </el-form-item>
                <el-form-item prop="zsTime" label="着色期">
                  <el-input v-model="temp.zsTime" placeholder="请输入注意事项" />
                </el-form-item>-->
              </div>
              <div class="content-right">
                <el-form-item prop="remark" label="备注">
                  <el-input v-model="temp.remark" placeholder="请输入备注" />
                </el-form-item>
                <!-- <el-form-item label="病虫害">
                  <el-select
                    v-model="temp.myBch"
                    style="width:100%"
                    multiple
                    placeholder="请选择病虫害"
                  >
                    <el-option
                      v-for="item in bchData"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="病虫害">
                  <el-select
                    v-model="temp.khBch"
                    style="width:100%"
                    multiple
                    placeholder="请选择病虫害"
                  >
                    <el-option
                      v-for="item in bchData"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="病虫害">
                  <el-select
                    v-model="temp.zgBch"
                    style="width:100%"
                    multiple
                    placeholder="请选择病虫害"
                  >
                    <el-option
                      v-for="item in bchData"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="病虫害">
                  <el-select
                    v-model="temp.chpgBch"
                    style="width:100%"
                    multiple
                    placeholder="请选择病虫害"
                  >
                    <el-option
                      v-for="item in bchData"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="病虫害">
                  <el-select
                    v-model="temp.zsBch"
                    style="width:100%"
                    multiple
                    placeholder="请选择病虫害"
                  >
                    <el-option
                      v-for="item in bchData"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>-->
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
  addTreeType,
  deleteTreeTypeById,
  updateTreeType,
  selectTreeType
} from "@/api/treeTypeApi.js";
import { selectBch } from "@/api/bchDataApi.js";

export default {
  data() {
    return {
      add_icon_name: "add_no",
      active: "",
      show: false,
      tableData: [],
      varietyData: [],
      bchData: [],
      paginations: {
        total: 0,
        pageIndex: 1,
        pageSize: 15,
        pageSizes: [15, 20],
        layout: "total, sizes, prev, pager, next, jumper"
      },
      dialogFormVisible: false,
      dialogStatus: "",
      temp: {
        id: null,
        treeName: null,
        remark: null,
        myTime: null,
        khTime: null,
        zgTime: null,
        chpgTime: null,
        zsTime: null,
        myBch: null,
        khBch: null,
        zgBch: null,
        chpgBch: null,
        zsBch: null,
        createTime: null,
        updateTime: null
      },
      reqTemp: {
        id: null
      },
      rules: {
        treeName: [
          { required: true, message: "请输入品种名称", trigger: "blur" },
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
    selectBch(1, 500, {}).then(res => {
      this.bchData = res.data.list;
    });

    this.getVarietyList();
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
    getVarietyList() {
      selectTreeType(
        this.paginations.pageIndex,
        this.paginations.pageSize,
        this.reqTemp
      ).then(res => {
        this.paginations.total = res.data.total;
        this.tableData = res.data.list;
      });
      selectTreeType(1, 500, {}).then(res => {
        this.varietyData = res.data.list;
      });
    },
    // 每页多少条切换
    handleSizeChange(pageSize) {
      this.paginations.pageSize = pageSize;
      this.getVarietyList();
    },
    // 上下分页
    handleCurrentChange(page) {
      this.paginations.pageIndex = page;
      this.getVarietyList();
    },
    handleDelete(row) {
      this.$confirm("是否确定删除此品种?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          deleteTreeTypeById(row.id).then(() => {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getVarietyList();
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
        treeName: null,
        remark: null,
        myTime: null,
        khTime: null,
        zgTime: null,
        chpgTime: null,
        zsTime: null,
        myBch: null,
        khBch: null,
        zgBch: null,
        chpgBch: null,
        zsBch: null,
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
          // this.temp.myBch = this.temp.myBch.join();
          // this.temp.khBch = this.temp.khBch.join();
          // this.temp.zgBch = this.temp.zgBch.join();
          // this.temp.chpgBch = this.temp.chpgBch.join();
          // this.temp.zsBch = this.temp.zsBch.join();
          addTreeType(this.temp).then(() => {
            this.dialogFormVisible = false;
            this.getVarietyList();
          });
        }
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.temp.myBch = this.temp.myBch.join();
          this.temp.khBch = this.temp.khBch.join();
          this.temp.zgBch = this.temp.zgBch.join();
          this.temp.chpgBch = this.temp.chpgBch.join();
          this.temp.zsBch = this.temp.zsBch.join();
          updateTreeType(this.temp).then(() => {
            this.dialogFormVisible = false;
            this.getVarietyList();
          });
        }
      });
    },
    setParentValue(event) {
      this.temp.parentId = event;
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
