let container = document.getElementById("buttonDiv");
let selectedClassName = "current";
const presetButtonColors = ["#3aa757", "#e8453c", "#f9bb2d", "#4688f1"];

// 点击某个按钮，移除上之前元素的 current，给当前元素添加 current
function handleButtonClick(event) {
  // 找到之前添加的 current
  let current = event.target.parentElement.querySelector(
    `.${selectedClassName}`
  );
  // 如果之前添加 current 不是当前点击的，移除之前添加的 current
  if (current && current !== event.target) {
    current.classList.remove(selectedClassName);
  }

  // 拿到点击按钮的颜色
  let color = event.target.dataset.color;
  // 给当前按钮添加 current 类
  event.target.classList.add(selectedClassName);
  // 将当前颜色存到插件缓存
  chrome.storage.sync.set({ color });
}

// 根据颜色创建按钮
function initOptions(buttonColors) {
  chrome.storage.sync.get("color", data => {
    let currentColor = data.color;
    // 遍历颜色集，创建 button，给某个 button 添加 current
    for (let buttonColor of buttonColors) {
      let button = document.createElement("button");
      button.dataset.color = buttonColor;
      button.style.backgroundColor = buttonColor;

      // 给 button 添加 current
      if (buttonColor === currentColor) {
        button.classList.add(selectedClassName);
      }

      button.addEventListener("click", handleButtonClick);
      container.appendChild(button);
    }
  });
}

// 初始化
initOptions(presetButtonColors);
