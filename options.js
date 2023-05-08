document.addEventListener("DOMContentLoaded", () => {
  const blockedDomainsList = document.getElementById("blockedDomainsList");

  chrome.storage.local.get("blockedDomains", (data) => {
    const blockedDomains = data.blockedDomains || [];
    for (const domain of blockedDomains) {
      const li = document.createElement("li");
      li.textContent = domain;
      const unblockButton = document.createElement("button");
      unblockButton.textContent = "X";
      unblockButton.classList.add("unblock-button");
      unblockButton.addEventListener("click", () => {
        unblockDomain(domain);
        li.remove();
      });
      li.appendChild(unblockButton);
      blockedDomainsList.appendChild(li);
    }
  });
});

function unblockDomain(domain) {
  chrome.storage.local.get("blockedDomains", (data) => {
    const blockedDomains = data.blockedDomains || [];
    const index = blockedDomains.indexOf(domain);
    if (index > -1) {
      blockedDomains.splice(index, 1);
      chrome.storage.local.set({ blockedDomains });
    }
  });
}
