// Background script for Salary Ticker Chrome Extension
// Keeps the extension running and manages state

chrome.runtime.onInstalled.addListener(() => {
  // Set default values on first install
  chrome.storage.local.set({
    monthlySalary: 8000,
    workDays: 22,
    workHours: 8,
    fireGoal: 1000000,
    installDate: Date.now()
  });

  console.log('Salary Ticker installed!');
});
