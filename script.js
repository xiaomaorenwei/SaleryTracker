// Salary Dashboard
(function() {
  var monthlySalary = 8000;
  var workDays = 22;
  var workHours = 8;

  // Elements
  var todayValueEl = document.getElementById('todayValue');
  var monthValueEl = document.getElementById('monthValue');
  var todayProgressEl = document.getElementById('todayProgress');
  var monthProgressEl = document.getElementById('monthProgress');
  var todayProgressTextEl = document.getElementById('todayProgressText');
  var monthProgressTextEl = document.getElementById('monthProgressText');
  var perSecondEl = document.getElementById('perSecond');
  var perHourEl = document.getElementById('perHour');
  var perDayEl = document.getElementById('perDay');
  var timeDisplayEl = document.getElementById('timeDisplay');
  var floatContainer = document.getElementById('floatContainer');
  var settingsBtn = document.getElementById('settingsBtn');
  var modal = document.getElementById('modal');
  var closeModal = document.getElementById('closeModal');
  var saveBtn = document.getElementById('saveBtn');

  var lastTodayYuan = -1;
  var lastMonthYuan = -1;
  var displayedToday = 0;
  var displayedMonth = 0;

  // Storage
  var Storage = {
    get: function(keys, callback) {
      try {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
          chrome.storage.local.get(keys, callback);
          return;
        }
      } catch (e) {}
      var result = {};
      keys.forEach(function(k) {
        var v = localStorage.getItem('salary_' + k);
        result[k] = v !== null ? JSON.parse(v) : undefined;
      });
      callback(result);
    },
    set: function(obj, callback) {
      try {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
          chrome.storage.local.set(obj, callback);
          return;
        }
      } catch (e) {}
      Object.keys(obj).forEach(function(k) {
        localStorage.setItem('salary_' + k, JSON.stringify(obj[k]));
      });
      if (callback) callback();
    }
  };

  // Get days in current month
  function getDaysInMonth() {
    var now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  }

  // Calculate per second rate
  function getPerSecondRate() {
    var daysInMonth = getDaysInMonth();
    var totalSecondsInMonth = daysInMonth * 24 * 3600;
    return monthlySalary / totalSecondsInMonth;
  }

  // Calculate per day rate
  function getPerDayRate() {
    return monthlySalary / workDays;
  }

  // Calculate per hour rate
  function getPerHourRate() {
    return getPerDayRate() / workHours;
  }

  // Format currency
  function formatCurrency(val) {
    if (val >= 10000) {
      return '¥' + (val / 10000).toFixed(2) + '万';
    }
    return '¥' + val.toFixed(2);
  }

  // Format small currency (for rates)
  function formatSmallCurrency(val) {
    if (val >= 10000) {
      return '¥' + (val / 10000).toFixed(2) + '万';
    } else if (val >= 100) {
      return '¥' + val.toFixed(1);
    }
    return '¥' + val.toFixed(2);
  }

  // Create floating digit animation
  function createFloatDigit(amount, isToday) {
    var el = document.createElement('div');
    el.className = 'float-digit';
    el.textContent = '+' + formatSmallCurrency(amount);
    el.style.left = (Math.random() - 0.5) * 60 + 'px';
    el.style.top = '40px';
    if (!isToday) {
      el.style.color = '#fbbf24';
      el.style.textShadow = '0 0 10px rgba(245,158,11,0.5)';
    }
    floatContainer.appendChild(el);

    setTimeout(function() {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 1000);
  }

  // Update time display
  function updateTimeDisplay() {
    var now = new Date();
    var options = { month: 'short', day: 'numeric', weekday: 'short' };
    var dateStr = now.toLocaleDateString('zh-CN', options);
    var timeStr = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    timeDisplayEl.textContent = dateStr + ' ' + timeStr;
  }

  // Main tick function
  function tick() {
    var now = new Date();
    var day = now.getDate();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var daysInMonth = getDaysInMonth();
    var perSecond = getPerSecondRate();

    // ========== TODAY'S EARNINGS ==========
    // Calculate seconds elapsed today
    var secondsToday = hours * 3600 + minutes * 60 + seconds;
    // Target today's earnings (assuming work day = 8 hours)
    var todayTarget = perSecond * secondsToday;
    // Cap at daily rate
    var dailyRate = getPerDayRate();
    todayTarget = Math.min(todayTarget, dailyRate);

    // Smooth animation
    var diff = todayTarget - displayedToday;
    if (Math.abs(diff) < 0.001) {
      displayedToday = todayTarget;
    } else {
      displayedToday += diff * 0.15;
    }

    todayValueEl.textContent = formatCurrency(displayedToday);

    // Today's progress (based on time of day)
    var todayProgress = (secondsToday / (24 * 3600)) * 100;
    todayProgressEl.style.width = Math.min(todayProgress, 100) + '%';
    todayProgressTextEl.textContent = '已过 ' + Math.round(todayProgress) + '%';

    // Float animation for today
    var currentTodayYuan = Math.floor(todayTarget);
    if (currentTodayYuan > lastTodayYuan) {
      createFloatDigit(perSecond, true);
      lastTodayYuan = currentTodayYuan;
    }

    // ========== MONTH'S EARNINGS ==========
    // Calculate seconds elapsed this month
    var elapsedSecondsMonth = (day - 1) * 24 * 3600 + secondsToday;
    var monthTarget = perSecond * elapsedSecondsMonth;

    // Smooth animation
    diff = monthTarget - displayedMonth;
    if (Math.abs(diff) < 0.001) {
      displayedMonth = monthTarget;
    } else {
      displayedMonth += diff * 0.15;
    }

    monthValueEl.textContent = formatCurrency(displayedMonth);

    // Month progress (based on day of month)
    var monthProgress = (day / daysInMonth) * 100;
    monthProgressEl.style.width = monthProgress + '%';
    monthProgressTextEl.textContent = '已过 ' + Math.round(monthProgress) + '%';

    // Float animation for month (every 100 yuan)
    var currentMonthYuan = Math.floor(monthTarget);
    if (currentMonthYuan > lastMonthYuan && currentMonthYuan % 100 === 0) {
      createFloatDigit(perSecond * 10, false);
      lastMonthYuan = currentMonthYuan;
    }

    // ========== RATE DISPLAY ==========
    perSecondEl.textContent = formatSmallCurrency(perSecond);
    perHourEl.textContent = formatSmallCurrency(getPerHourRate());
    perDayEl.textContent = formatSmallCurrency(dailyRate);

    // Update time display every second
    updateTimeDisplay();
  }

  // Load settings
  function loadSettings() {
    Storage.get(['monthlySalary', 'workDays', 'workHours'], function(result) {
      if (result.monthlySalary !== undefined) monthlySalary = result.monthlySalary;
      if (result.workDays !== undefined) workDays = result.workDays;
      if (result.workHours !== undefined) workHours = result.workHours;

      document.getElementById('salary').value = monthlySalary;
      document.getElementById('days').value = workDays;
      document.getElementById('hours').value = workHours;
    });
  }

  // Save settings
  function saveSettings() {
    monthlySalary = parseFloat(document.getElementById('salary').value) || 8000;
    workDays = parseInt(document.getElementById('days').value) || 22;
    workHours = parseInt(document.getElementById('hours').value) || 8;

    Storage.set({
      monthlySalary: monthlySalary,
      workDays: workDays,
      workHours: workHours
    });

    closeModalFunc();
  }

  function openModalFunc() { modal.classList.add('active'); }
  function closeModalFunc() { modal.classList.remove('active'); }

  settingsBtn.addEventListener('click', openModalFunc);
  closeModal.addEventListener('click', closeModalFunc);
  modal.addEventListener('click', function(e) { if (e.target === modal) closeModalFunc(); });
  saveBtn.addEventListener('click', saveSettings);
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeModalFunc(); });

  loadSettings();
  setInterval(tick, 50);
  tick();
})();