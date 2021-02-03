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
        <span class="query-name">品种：</span>
        <el-select v-model="reqTemp.treeTypeId" class="headSelect" clearable placeholder="请选择品种">
          <el-option
            v-for="item in varietyData"
            :key="item.id"
            :label="item.treeName"
            :value="item.id"
          />
        </el-select>
        <el-button type="primary" @click="getFieldList" icon="el-icon-search">查询</el-button>
        <el-button
          :loading="downloadLoading"
          type="primary"
          icon="el-icon-download"
          @click="handleDownload"
        >导出</el-button>
        <span class="query-name">总亩数：{{totalsize}} 亩</span>
      </el-form>
    </div>
    <div class="table-contain3">
      <el-table
        :data="fieldData"
        border
        stripe
        highlight-current-row
        style="width:100%"
        @cell-mouse-enter="handleMouseEnter"
        @cell-mouse-leave="handleMouseOut"
      >
        <el-table-column property="userName" label="姓名" align="center" />
        <el-table-column property="userMobileNum" label="手机号" align="center" />
        <el-table-column property="userAddress" label="地址" align="center" />
        <el-table-column property="treeName" label="品种" align="center" />
        <el-table-column property="tdSize" label="亩数" align="center" />
        <el-table-column property="treeAge" label="树龄" align="center" />
        <el-table-column property="tdRemark" label="备注" align="center" />
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
    </div>
  </div>
</template>

<script>
import { getAreaList } from "@/api/userApi.js";
import { selectField, selectFieldTotal } from "@/api/fieldApi.js";
import { selectArea } from "@/api/areaApi.js";
import { selectTreeType } from "@/api/treeTypeApi.js";
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
      totalsize: null,
      parentData: [],
      varietyData: [],
      fieldData: [],
      userId: null,
      paginations: {
        total: 0,
        pageIndex: 1,
        pageSize: 14,
        pageSizes: [14, 20],
        layout: "total, sizes, prev, pager, next, jumper"
      },

      fieldTemp: {
        id: null,
        userId: null,
        size: null,
        treeAge: null,
        treeTypeId: null,
        remark: null
      },

      reqTemp: {
        treeTypeId: null,
        areaId: null
      },
      downloadLoading: false,
      exportData: [],
      excelName: null
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

    this.getFieldList();
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
    // 每页多少条切换
    handleSizeChange(pageSize) {
      this.paginations.pageSize = pageSize;
      this.getFieldList();
    },
    // 上下分页
    handleCurrentChange(page) {
      this.paginations.pageIndex = page;
      this.getFieldList();
    },
    getFieldList() {
      selectField(
        this.paginations.pageIndex,
        this.paginations.pageSize,
        this.reqTemp
      ).then(res => {
        this.paginations.total = res.data.total;
        this.fieldData = res.data.list;
      });
      selectFieldTotal(this.reqTemp.areaId, this.reqTemp.treeTypeId).then(
        res => {
          this.totalsize = res.data;
        }
      );
    },
    handleDownload() {
      if (this.reqTemp.areaId == null) {
        this.excelName = "所有";
      } else {
        selectArea(1, 1, { id: this.reqTemp.areaId }).then(res => {
          this.excelName = res.data.list[0].location;
        });
      }

      selectField(1, 1000, this.reqTemp).then(res => {
        this.exportData = res.data.list;
        this.downloadLoading = true;
        import("@/vendor/Export2Excel").then(excel => {
          const tHeader = ["姓名", "手机号", "地址", "品种", "亩数", "树龄","大化肥","菌肥"];
          const filterVal = [
            "userName",
            "userMobileNum",
            "userAddress",
            "treeName",
            "tdSize",
            "treeAge"
          ];
          const data = this.formatJson(filterVal);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.excelName + "用户信息表"
          });
          this.downloadLoading = false;
          this.excelName = null;
        });
      });
    },
    formatJson(filterVal) {
      return this.exportData.map(v =>
        filterVal.map(j => {
          return v[j];
        })
      );
    }
  }
};
</script>

<style lang="scss" scoped></style>
