const request = require("request");
const fs = require("fs");
const { parse } = require("node-html-parser");
const { date } = require("assert-plus");

let data = [
  {
    mhp: "AIFA436864_06",
    id: "yfTGduXFzY+yJ/fc9a4DGm+yxDymWsud4Fs6EsK5wz2H1bIqlZV+23ABgYhenPQ6bkJAeo0rtcM=|",
    name: "Cơ sở và ứng dụng AI",
  },
  {
    mhp: "ALDS335764_04",
    id: "gQ5hwNOd+NrtJ9re5Aogprlc8KQnigJsZMmONsm/HevMZ0BXK0AUuguKoS6qrIlummqL2UAMeKA=|",
    name: "Giải thuật và cấu trúc dữ liệu",
  },
];
const status = {
  send: 0,
  receive: 0,
};
setInterval(() => {
  const data_cookie = fs.readFileSync(
    `E:/nodejs/tool-dkmh/cookie.txt`,
    "utf-8"
  );

  data.forEach((item) => {
    status.send++;
    let formData = {
      StudyUnitID: "212" + item.mhp.split("_")[0],
      CurriculumID: item.mhp.split("_")[0],
      hdID: item.id,
      [item.name]: "on",
    };
    request(
      {
        method: "POST",
        uri: "https://dkmh.hcmute.edu.vn/DangKiNgoaiKeHoach/DanhSachLopHocPhanPost",
        formData: formData,
        headers: {
          cookie: data_cookie,
        },
      },
      (e, r, b) => {
        try {
          const result_dk = parse(b);
          let result = result_dk.querySelector("td p")?.text;
          if (result?.includes(`Đăng ký thành công`)) {
            console.log(
              "\x1b[32m",
              `Đăng ký thành công: ${item.name}(${item.mhp})`
            );
            data = data.filter((i) => i.name !== item.name);
          } else {
            console.log("\x1b[31m", result);
          }

          status.receive++;
        } catch (error) {}
      }
    );
    console.log(
      "\x1b[33m",
      `send: ${status.send} ---- receive: ${status.receive}`
    );
  });
}, 1000);
