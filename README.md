# Salary Tracker

A beautiful Chrome extension that tracks your salary earnings in real-time. Displays both daily and monthly earnings with a premium dark dashboard UI.

## Features

- **Real-time tracking** — Watch your earnings update every second
- **Dual metrics** — See today's earnings and monthly cumulative earnings at a glance
- **Rate breakdown** — View your per-second, per-hour, and per-day earnings
- **Premium UI** — Dark OLED aesthetic with aurora gradients and smooth animations
- **Progress bars** — Visual indicators for daily and monthly progress
- **Customizable** — Set your monthly salary, work days, and work hours

## Installation

### Step 1: Download the Extension

Clone or download this repository to your local machine:

```bash
git clone https://github.com/xiaomaorenwei/SaleryTracker.git
```

### Step 2: Open Chrome's Extension Manager

1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Or click the puzzle icon in the top-right corner → "Manage extensions"

### Step 3: Enable Developer Mode

In the top-right corner of the Extensions page, toggle **Developer mode** ON.

### Step 4: Load the Extension

1. Click the **Load unpacked** button (top-left area)
2. Navigate to the folder where you downloaded this project
3. Select the `saleryDashboard` folder
4. Click **Select Folder** (or **Open** on Mac)

### Step 5: Pin the Extension

1. Click the puzzle icon in Chrome's top-right toolbar
2. Find **Salary Tracker** in the list
3. Click the pin icon to keep it visible in your toolbar

## Usage

### View Your Earnings

- **Left card (green)** — Shows how much you've earned **today**
- **Right card (amber)** — Shows your cumulative earnings for **this month**
- **Bottom bar** — Displays per-second, per-hour, and per-day rates

### Configure Your Salary

1. Click the **gear icon** in the bottom-right corner
2. Enter your:
   - **Monthly salary** (in your local currency)
   - **Work days per month** (default: 22)
   - **Work hours per day** (default: 8)
3. Click **Save**

### Reload Extension After Changes

If you modify the code, go to `chrome://extensions/` and click the **reload** button on the Salary Tracker card.

## Project Structure

```
saleryDashboard/
├── index.html          # Main popup UI
├── script.js           # Extension logic
├── background.js       # Chrome background script
├── manifest.json       # Chrome extension manifest
├── generate-icons.js   # Icon generation script
└── icons/              # Extension icons
```

## License

MIT
