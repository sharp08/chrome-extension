chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF"
  });
});

chrome.action.onClicked.addListener(async tab => {
  const prevState = await chrome.action.getBadgeText({
    tabId: tab.id
  });
  // const nextState = prevState === "ON" ? "OFF" : "ON";
  const nextState = "";

  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: nextState
  });

  if (nextState === "") {
    await chrome.scripting.executeScript({
      target: {
        tabId: tab.id
      },
      files: ["./js/content-script.js"]
    });
  }
});
