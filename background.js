chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "blockDomain",
    title: "Block Domain",
    contexts: ["page"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "blockDomain") {
    const domain = extractDomain(tab.url);
    if (domain) {
      chrome.storage.local.get("blockedDomains", (data) => {
        const blockedDomains = data.blockedDomains || [];
        blockedDomains.push(domain);
        chrome.storage.local.set({ blockedDomains });
      });
    }
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active) {
    const domain = extractDomain(tab.url);
    if (domain) {
      chrome.storage.local.get("blockedDomains", (data) => {
        const blockedDomains = data.blockedDomains || [];
        if (blockedDomains.includes(domain)) {
          chrome.tabs.remove(tabId);
        }
      });
    }
  }
});

function extractDomain(url) {
  const matches = url.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
  return matches && matches[1];
}
