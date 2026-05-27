# Sormac Autoblog — Setup & How-To Guide

## What You Need

Just **Python** — that's it. Python comes with a built-in web server.

### Step 1 — Install Python (if not already installed)

1. Go to https://www.python.org/downloads/
2. Click "Download Python 3.x.x" (the big yellow button)
3. Run the installer
4. **IMPORTANT:** On the first screen, tick "Add Python to PATH" before clicking Install
5. Click "Install Now"

To verify it worked, open Command Prompt (`Win + R`, type `cmd`, press Enter) and run:
```
python --version
```
You should see something like `Python 3.12.x`.

---

## Step 2 — Run the Website

1. Open **File Explorer** and navigate to the `sormac-autoblog` folder
2. Click the address bar at the top of File Explorer
3. Type `cmd` and press Enter — this opens a Command Prompt already inside the folder
4. Run this command:

```
python -m http.server 8080
```

You'll see:
```
Serving HTTP on 0.0.0.0 port 8080 (http://0.0.0.0:8080/) ...
```

5. Open your browser and go to: **http://localhost:8080**

The site is now running!

---

## Step 3 — Let Others on the Same Network Access It

While the server is running, others on the same Wi-Fi or local network can access the site.

### Find your computer's local IP address:

1. Open Command Prompt
2. Run: `ipconfig`
3. Look for **IPv4 Address** under your active network adapter (Wi-Fi or Ethernet)
   - It will look like: `192.168.1.42` or `10.0.0.15`

### Share with colleagues:

Tell them to open their browser and go to:
```
http://YOUR_IP_ADDRESS:8080
```
For example: `http://192.168.1.42:8080`

> **Note:** If they can't connect, Windows Firewall may be blocking port 8080.
> To allow it:
> 1. Open "Windows Defender Firewall with Advanced Security"
> 2. Click "Inbound Rules" → "New Rule"
> 3. Choose "Port" → TCP → specific port: `8080`
> 4. Allow the connection → apply to all profiles → name it "Autoblog"

---

## Step 4 — Stop the Server

Press **Ctrl + C** in the Command Prompt window to stop the server.

---

## How to Edit the Website

All files are plain HTML and CSS — open them in any text editor.
Recommended free editor: **Visual Studio Code** (https://code.visualstudio.com)

### Files overview:
```
sormac-autoblog/
├── index.html          ← Home page
├── reviews.html        ← Reviews page
├── employee-cars.html  ← Employee cars page
├── style.css           ← All visual styling
└── images/             ← Put car photos here (.jpg or .png)
```

---

## How to Add a New Review

1. Open `reviews.html` in a text editor
2. Find the comment block that says `HOW TO ADD A NEW REVIEW`
3. Copy the block between `<!-- ── REVIEW 1 ── -->` and the next `<!-- ── REVIEW`
4. Paste it **above** the first review (so it appears at the top of the list)
5. Edit these fields:
   - `<span class="card-tag">` → category (e.g. SUV, Coupe, Van)
   - `<span class="review-date">` → month and year
   - `<h2>` → car name
   - `<div class="review-author">` → your name
   - `<p class="review-excerpt">` → your review text
   - The four `<div class="spec">` blocks → engine, power, 0-100, price
   - `<span class="score-val">` → score out of 10
6. Save the file — refresh the browser and it's live

---

## How to Add an Employee Car

1. Open `employee-cars.html`
2. Find the comment block `HOW TO ADD AN EMPLOYEE CAR`
3. Copy any existing `<article class="emp-card ...">` block
4. Paste it anywhere in the list
5. Edit:
   - `class="emp-card accent-X"` → choose from: `accent-red`, `accent-blue`, `accent-green`, `accent-yellow`, `accent-white`
   - `<div class="emp-avatar">` → change the single letter to the employee's initial
   - `<div class="emp-name">` → full name
   - `<div class="emp-role">` → job title
   - `<h2 class="emp-carname">` → car name and year
   - `<p class="emp-blurb">` → personal story about the car
   - `<ul class="emp-facts">` → fun facts (emoji + text)
6. Save — refresh to see it

---

## How to Add Photos

1. Put your `.jpg` or `.png` image in the `images/` folder
2. In the HTML, find the element you want to add a photo to (e.g. `<div class="review-img"`)
3. Change the `background-image` style:
   ```html
   style="background-image: url('images/your-photo.jpg'); background-color: #1a1a1a;"
   ```
   Keep the `background-color` as a fallback in case the image doesn't load.

**Recommended image sizes:**
- Review images: ~800×500px
- Employee car images: ~700×400px

---

## Changing the Site Name or Stats on the Home Page

- **Site name:** Search all `.html` files for `Sormac` and replace as needed
- **Home page stats** (12 Cars Reviewed / 5 Team Members / 3 Years Running):
  Open `index.html`, find the `<div class="hero-stat-bar">` section and update the numbers

---

## Troubleshooting

| Problem | Solution |
|---|---|
| `python` not recognized | Re-install Python and tick "Add to PATH" |
| Page not loading on `localhost:8080` | Make sure the server is running in the right folder |
| Others can't connect | Check Windows Firewall (see Step 3) |
| Images not showing | Make sure the filename and path in the HTML match exactly (case-sensitive on some systems) |
| Changes not showing | Hard-refresh with Ctrl + Shift + R |
