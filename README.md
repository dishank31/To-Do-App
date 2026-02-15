# ✨ TaskFlow Pro - Ultimate To-Do Application

A stunning, feature-rich To-Do list application with real-time features, beautiful animations, and premium design.

![TaskFlow Pro](https://img.shields.io/badge/TaskFlow-Pro-8b5cf6?style=for-the-badge)
![Version](https://img.shields.io/badge/version-2.0.0-06b6d4?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## 🚀 Features

### ⏰ Real-Time Features
- **Live Clock** - Beautiful animated clock showing current time (updates every second)
- **Dynamic Date** - Auto-updating current date with day of week
- **Smart Greeting** - Time-of-day greeting with pending task count
- **Task Countdowns** - Real-time countdown showing time remaining for each task
- **Overdue Detection** - Automatic color-coded warnings for overdue tasks

### 📋 Task Management
- **Add Tasks** - Create tasks with title, category, priority, due date/time, and notes
- **Edit Tasks** - Modify any task details through a sleek modal
- **Delete Tasks** - Remove tasks with confirmation
- **Complete Tasks** - Mark tasks as done with satisfying confetti celebration! 🎉
- **Clear Completed** - Bulk remove all completed tasks with one click

### 🔍 Search & Filtering
- **Search Bar** - Instantly search tasks by title, notes, or category
- **Quick Filters** - All, Today, Upcoming 7 Days, Overdue
- **Category Filter** - Work, Personal, Health, Learning, Shopping, Finance
- **Status Filter** - All, Pending, Completed, Overdue
- **Sorting** - By Due Date, Priority, Created Date, Title

### 📊 Statistics Dashboard
- Total Tasks Count
- Completed Tasks Count
- Pending Tasks Count
- Overdue Tasks Alert
- Visual Progress Ring

### 💎 Premium Design
- Dark Mode with Glassmorphism
- Animated Gradient Background
- Smooth Micro-Animations
- Responsive Layout
- Inter Font Typography

---

## 🏃‍♂️ How to Run Locally

### Option A - Just Open It:
1. Navigate to the project folder
2. Double-click `index.html`
3. The app opens in your default browser

### Option B - Command Line:
```bash
cd D:\TO-DO-APP
start index.html
```

### Option C - VS Code Live Server (Recommended for Development):
1. Open the folder in VS Code
2. Install "Live Server" extension
3. Right-click on `index.html` → "Open with Live Server"

---

## 🌐 Deploy to Vercel (Access from Anywhere!)

### Method 1: Deploy via GitHub (Recommended)

**Step 1: Push your code to GitHub**
```bash
# Initialize git (if not already done)
cd D:\TO-DO-APP
git init
git add .
git commit -m "Initial commit - TaskFlow Pro"

# Create a repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/TO-DO-APP.git
git branch -M main
git push -u origin main
```

**Step 2: Deploy on Vercel**
1. Go to [vercel.com](https://vercel.com) and sign up/log in with your GitHub account
2. Click **"Add New..."** → **"Project"**
3. Find your `TO-DO-APP` repository and click **"Import"**
4. Leave all settings as default (Vercel auto-detects it's a static site)
5. Click **"Deploy"** 🚀
6. Wait ~30 seconds — you'll get a live URL like `https://to-do-app-xyz.vercel.app`

**Deploying Updates:**
After making changes, just push to GitHub and Vercel auto-deploys:
```bash
git add .
git commit -m "Your update message"
git push
```

---

### Method 2: Deploy via Vercel CLI

**Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

**Step 2: Deploy**
```bash
cd D:\TO-DO-APP
vercel
```
Follow the prompts — accept defaults, and you'll get a live URL!

**Deploy updates:**
```bash
vercel --prod
```

---

## 🎮 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + N` | Focus on task input |
| `Escape` | Close edit modal |

---

## 💾 Data Storage

All your tasks are saved to your browser's **Local Storage**:
- ✅ Data persists after browser restart
- ✅ No server or database required
- ✅ Works completely offline
- ⚠️ Data is browser-specific (won't sync across devices)

---

## 🎨 Categories & Priorities

### Categories
- 💼 **Work** - Professional tasks
- 🏠 **Personal** - Personal errands
- ❤️ **Health** - Fitness & wellness
- 📚 **Learning** - Education & skills
- 🛒 **Shopping** - Shopping lists
- 💰 **Finance** - Financial tasks

### Priority Levels
- 🟢 **Low** - Can wait
- 🟡 **Medium** - Should be done
- 🟠 **High** - Important
- 🔴 **Critical** - Urgent attention needed

---

## 📁 Project Structure

```
D:\TO-DO-APP\
├── index.html      # Main HTML structure
├── styles.css      # Premium styling & animations
├── app.js          # Application logic
├── vercel.json     # Vercel deployment config
└── README.md       # This file
```

---

## 🌟 Tips for Best Experience

1. **Use Chrome or Edge** for best glassmorphism effects
2. **Set due dates and times** for countdown features
3. **Use categories** to organize different areas of life
4. **Check "Today" filter** every morning
5. **Use the search bar** to quickly find specific tasks
6. **Celebrate** when you complete tasks! 🎉

---

Made with 💜 by TaskFlow Pro
