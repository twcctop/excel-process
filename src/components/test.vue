
<template>
  <div id="app">
    <!-- <p>test</p>
        <a>My first Vue app</a>
        <br>
      <a>  msg is  {{ message }}   </a> -->
    <!-- <br />
    <br />
    <br />
    第一个excel <input v-model="excel1" />
    <br />
    第二个excel <input v-model="excel2" />
    <br />
    <button v-on:click="testPythonScript">提交路径</button> -->

    <!-- <div class="container">
      {{ upload_file || "导入" }}
      <input
        type="file"
        accept=".xls,.xlsx"
        class="upload_file"
        @change="readExcel($event)"
      />
    </div> -->


    <div class="container">
      {{ upload_file || "导入" }}
      <input
        type="file"
        multiple="multiple"
        accept=".xls,.xlsx"
        class="upload_file"
        @change="testReadExcel($event)"
      />
    </div>
  </div>
</template>

<script>
import XLSX from "xlsx";

export default {
  name: "HelloWorld",
  // props: {
  //   msg: String,
  // },
  data() {
    return {
      message: "#################",
      excel1: "",
      excel2: "",
      resultExcel: "",
      upload_file: "",
    };
  },
  methods: {
    testReadExcel(e) {
      const files = e.target.files;
      console.log("files的属性为 ");
      console.log(files);

      files.forEach((file) => {
        console.log(file.name);
      });

      const reader = new FileReader();
      reader.readAsBinaryString(files[0]);
      reader.onload = (ev) => {
        1;
        console.log("test##  reader.onload ");
        console.log(ev);
        const data = ev.target.result;
        const workbook = XLSX.read(data, {
          type: "binary",
        });
        const wsname = workbook.SheetNames[1]; //取第二张表
        console.log("sheetname:" + wsname);
        const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]); //生成json表格内容
        console.log("wsdata");
        /*(2)[{…}, {…}]0: {a1: "a2", b1: "b2", c1: "c2", __rowNum__: 1}1: {a1: "a3", b1: "b3", c1: "c3", __rowNum__: 2}length: 2__proto__: Array(0)*/

        console.log(ws);
        /**
         *   合并操作
         */
        var count = 0;
        var resArr = [];
        for (var i in ws) {
          console.log(ws[i]);
          for (var j in ws[i]) {
            var  json={}
            json[0]= ws[i][j]
            count++;
            resArr[count] = json;
          }
        }
        console.log("resArr");
        console.log(resArr);
        /**
         *   导出至excel
         */
        //  var exportData =  XLSX.utils.json_to_sheet(ws);
        var exportData = XLSX.utils.json_to_sheet(resArr);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, exportData, "sheet1");
        const exportblob = this.workbook2blob(wb);
        this.openDownloadDialog(exportblob, "export.xls");
      };

    },
    openDownloadDialog(blob, fileName) {
      if (typeof blob == "object" && blob instanceof Blob) {
        blob = URL.createObjectURL(blob); // 创建blob地址
      }
      var aLink = document.createElement("a");
      aLink.href = blob;
      // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，有时候 file:///模式下不会生效
      aLink.download = fileName || "";
      var event;
      if (window.MouseEvent) event = new MouseEvent("click");
      //   移动端
      else {
        event = document.createEvent("MouseEvents");
        event.initMouseEvent(
          "click",
          true,
          false,
          window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        );
      }
      aLink.dispatchEvent(event);
    },
    submit_form() {
      // 给后端发送请求，更新数据
      console.log("假装给后端发了个请求...");
    },
    readExcel(e) {
      /* 校验 */

      // 读取表格文件
      console.log("假装给后端发了个请求...");
      let that = this;
      const files = e.target.files;
      if (files.length <= 0) {
        return false;
      } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
        this.$message({
          message: "上传格式不正确，请上传xls或者xlsx格式",
          type: "warning",
        });
        return false;
      } else {
        // 更新获取文件名
        that.upload_file = files[0].name;
      }

      const fileReader = new FileReader();
      fileReader.onload = (ev) => {
        console.log("fileReader.onload  ### start");
        1;
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: "binary",
          });
          const wsname = workbook.SheetNames[1]; //取第一张表
          console.log("sheetname:" + wsname);
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]); //生成json表格内容
          console.log("wsdata:" + ws);
          console.log(ws);
          that.lists = [];
          // 从解析出来的数据中提取相应的数据
          ws.forEach((item) => {
            that.lists.push({
              username: item["b1"],
              phone_number: item["c1"],
            });
          });
          // 给后端发请求
          this.submit_form();
        } catch (e) {
          return false;
        }
      };
      fileReader.readAsBinaryString(files[0]);
    },

    workbook2blob(workbook) {
      // 生成excel的配置项
      var wopts = {
        // 要生成的文件类型
        bookType: "xlsx",
        // // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        bookSST: false,
        type: "binary",
      };
      var wbout = XLSX.write(workbook, wopts);
      // 将字符串转ArrayBuffer
      function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
        return buf;
      }
      var blob = new Blob([s2ab(wbout)], {
        type: "application/octet-stream",
      });
      return blob;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
/* .container {
  border: none;
  border-radius: 4px;
  background-color: #409eff;
  height: 40px;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 15px;
  min-width: 80px;
  *zoom: 1;
}

.upload_file {
  font-size: 20px;
  opacity: 0;
  position: absolute;
  filter: alpha(opacity=0);
  width: 60px;
} */
</style>
