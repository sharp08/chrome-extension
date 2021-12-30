let changeColor = document.querySelector("#changeColor");

// 需在 manifest 添加 storage 权限
chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});

changeColor.addEventListener("click", async () => {
  // 需在 manifest 添加 activeTab 权限
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // 需在 manifest 添加 scripting 权限
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setPageBackgroundColor
  });
});

function setPageBackgroundColor() {
  console.log(window);
  chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.backgroundColor = color;
  });
}
