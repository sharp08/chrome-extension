// 每次打开 popup 时，本文件都会执行

// let changeColor = document.querySelector("#changeColor");

// // 需在 manifest 添加 storage 权限
// chrome.storage.sync.get("color", ({ color }) => {
//   changeColor.style.backgroundColor = color;
// });

// changeColor.addEventListener("click", async () => {
//   // 需在 manifest 添加 activeTab 权限
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//   // 需在 manifest 添加 scripting 权限
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     // 这里面是个独立的环境，无法获取到外面的变量
//     function() {
//       console.log(window);
//       chrome.storage.sync.get("color", ({ color }) => {
//         document.body.style.backgroundColor = color;
//       });
//     }
//   });
// });

const utils = {
  FMT_DATE: (date, fmt = "yyyy-MM-dd HH:mm:ss", rtn = null) => {
    if (!date) return rtn;
    let me = new Date(date);
    const o = {
      "M+": me.getMonth() + 1, //月份
      "d+": me.getDate(), //日
      "h+": me.getHours() % 12 == 0 ? 12 : me.getHours() % 12, //小时
      "H+": me.getHours(), //小时
      "m+": me.getMinutes(), //分
      "s+": me.getSeconds(), //秒
      "q+": Math.floor((me.getMonth() + 3) / 3), //季度
      S: me.getMilliseconds() //毫秒
    };
    const week = {
      0: "/u65e5",
      1: "/u4e00",
      2: "/u4e8c",
      3: "/u4e09",
      4: "/u56db",
      5: "/u4e94",
      6: "/u516d"
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (me.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    }
    if (/(E+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (RegExp.$1.length > 1
          ? RegExp.$1.length > 2
            ? "/u661f/u671f"
            : "/u5468"
          : "") + week[me.getDay() + ""]
      );
    }
    for (let k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1
            ? o[k]
            : ("00" + o[k]).substr(("" + o[k]).length)
        );
      }
    }
    return fmt;
  }
};

const dataSource = {
  2022: {
    "2022-01-01": "元旦",
    "2022-02-01": "春节",
    "2022-04-05": "清明",
    "2022-05-01": "劳动",
    "2022-06-03": "端午",
    "2022-08-04": "七夕",
    "2022-09-10": "中秋",
    "2022-10-01": "国庆"
  },
  2023: {
    "2023-01-01": "元旦",
    "2023-01-22": "春节",
    "2023-04-05": "清明",
    "2023-05-01": "劳动",
    "2023-06-22": "端午",
    "2023-08-22": "七夕",
    "2023-09-29": "中秋",
    "2023-10-01": "国庆"
  },
  2024: {
    "2024-01-01": "元旦",
    "2024-02-10": "春节",
    "2024-04-04": "清明",
    "2024-05-01": "劳动",
    "2024-06-10": "端午",
    "2024-08-10": "七夕",
    "2024-09-17": "中秋",
    "2024-10-01": "国庆"
  },
  2025: {
    "2025-01-01": "元旦",
    "2025-01-29": "春节",
    "2025-04-04": "清明",
    "2025-05-01": "劳动",
    "2025-05-31": "端午",
    "2025-08-29": "七夕",
    "2025-10-06": "中秋",
    "2025-10-01": "国庆"
  }
};

function getNow() {
  const now = new Date();
  const dayMap = {
    0: "星期日",
    1: "星期一",
    2: "星期二",
    3: "星期三",
    4: "星期四",
    5: "星期五",
    6: "星期六"
  };

  const str = `${utils.FMT_DATE(now)} ${dayMap[now.getDay()]}`;
  domNow.innerHTML = str;
}

const domNow = document.querySelector(".now");
const domContainer = document.querySelector("#popup-container");

// 数据扁平化并根据 stamp 从小向大排序
const flatList = Object.values(dataSource)
  .reduce((acc, cur) => {
    Object.entries(cur).forEach(([date, name]) => {
      acc.push({ date, name, stamp: new Date(date).getTime() });
    });
    return acc;
  }, [])
  .sort((a, b) => (a.stamp < b.stamp ? -1 : 1));

// 从 flatList 中取出比当前时间大的 8 项
const now = +new Date();
let renderList = [];
for (let i = 0; i < flatList.length; i++) {
  const len = renderList.length;
  if (len >= 8) break;
  const dis = flatList[i].stamp + 86400000 - now;
  if (dis > 0) {
    renderList.push({
      ...flatList[i],
      dis: Math.floor(dis / 86400000)
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // 实时更新当前时间
  getNow();
  setInterval(() => {
    getNow();
  }, 1000);

  // 创建文档片段
  const fragment = document.createDocumentFragment();
  renderList.forEach(item => {
    let unit = document.createElement("div");
    unit.setAttribute("class", "festival-line");
    unit.innerHTML = `
  <span class="default">距离</span>
  <span class="name">${item.name}</span>
  <span class="date">${item.date}</span>
  <span class="default">还有</span>
  <span class="distance">${item.dis}</span>
  <span class="default">天</span>
  `;
    fragment.appendChild(unit);
  });
  domContainer.appendChild(fragment);
});
