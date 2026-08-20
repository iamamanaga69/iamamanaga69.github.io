# Flexist Website Manager Guide

This guide explains how to run your new Astro website locally on your computer and edit the content visually using the browser-based admin dashboard.

---

## 💻 Part 1: Local Development Setup

Follow these simple steps to run the website on your computer:

### Step 1: Install Node.js
Node.js is the engine that runs the website builder.
1. Download Node.js from the official website: [Download Node.js](https://nodejs.org/en/download) (choose the **LTS** version).
2. Install it by double-clicking the downloaded file and clicking "Next" through the installer.

### Step 2: Open your Terminal / Command Prompt
* **Windows:** Press the `Windows Key`, type `cmd` (or `PowerShell`), and press `Enter`.
* **Mac:** Press `Cmd + Space`, type `Terminal`, and press `Enter`.
* Navigate to your project folder inside the terminal (e.g. by typing `cd C:\path\to\your\folder`).

### Step 3: Run the Commands
Copy and paste these exact three commands in your terminal one by one, pressing `Enter` after each:

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the local preview server:**
   ```bash
   npm run dev
   ```
3. **Build the production site (to verify there are no errors):**
   ```bash
   npm run build
   ```

### Step 4: Open in Your Browser
Once you run `npm run dev`, it will output a address. Open your browser and go to:
👉 **[http://localhost:4321/](http://localhost:4321/)**

You will see your live site running locally! Any changes you make to the files will update in the browser instantly.

---

## 🚀 Part 2: Publish Changes to Github

To make your local changes live on the internet:
1. Open your terminal or git client.
2. Run these commands:
   ```bash
   git add .
   git commit -m "Update site content"
   git push origin main
   ```
Once pushed, GitHub Actions will automatically build the Astro site and deploy it to GitHub Pages, updating the live website at **flexist.in** within 1–2 minutes.

---

## 🎨 Part 3: Using the Admin Dashboard

You can edit all site text, numbers, and copy visually in the browser at **flexist.in/admin**.

### Step 1: Access the Dashboard
1. Go to **[https://flexist.in/admin](https://flexist.in/admin)** (or [http://localhost:4321/admin](http://localhost:4321/admin) if running locally).
2. Log in using your credentials.
   * *Authentication uses Netlify Identity or your GitHub credentials. If you are logging in for the first time, click "Login with GitHub" or accept the Netlify Identity invite email sent to your inbox.*

### Step 2: Choose What to Edit
On the left sidebar, you will see a list of sections:
* 🏠 **Homepage** — Edit the main page titles, text, stats, and project logo marquee.
* 💼 **Services** — Edit service titles, descriptions, and "What you get" bullet points.
* ⏳ **Experience** — Edit project timeline records, dates, roles, achievements, and tags.
* 👥 **About Us** — Edit the origin story, manifesto paragraphs, mission, vision, and values.
* 📊 **Plans & Pricing** — Edit plan prices and feature lists.
* 🌐 **Global Settings** — Edit your Telegram link, X link, contact email, and footer copy.

### Step 3: Make Edits
1. Click on the collection name in the left panel.
2. Select the file/entry you want to edit.
3. Change the text in the fields.
   * Simple text boxes are for short titles.
   * Large rich text blocks are for paragraphs.
   * Lists let you add, reorder, or delete bullet points by clicking "Add" or clicking the trash bin icon.
   * Toggles (buttons) let you enable or disable settings (like whether a role is "Current").
4. Click the **Publish** button at the top right when you are finished.

**What happens next?**
As soon as you click **Publish**, the CMS writes the new content directly to your GitHub repository. GitHub Actions detects this commit, automatically rebuilds the Astro project, and deploys the updates live to **flexist.in** within 1–2 minutes!
