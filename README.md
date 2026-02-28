# RevCycle AI

Next-gen AI-powered Revenue Cycle Management (RCM) platform built with Next.js, Firebase, and Genkit.

## Getting Started

To run the development server:

```bash
npm run dev
```

## How to push to GitHub (Private Repository)

Follow these steps in your local terminal to push this project to a new private GitHub repository:

1. **Create a new repository on GitHub**:
   - Go to [github.com/new](https://github.com/new).
   - Name your repository (e.g., `revcycle-ai`).
   - Select **Private**.
   - Do **not** initialize with a README, license, or .gitignore (we already have them).

2. **Initialize Git and push**:
   Open your terminal in the project root and run:

```bash
# Initialize git
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: RevCycle AI RCM Platform"

# Branch to main
git branch -M main

# Add your GitHub repository as remote (Replace <USERNAME> and <REPO>)
git remote add origin https://github.com/<USERNAME>/<REPO>.git

# Push to GitHub
git push -u origin main
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **AI**: Genkit (Google Gemini)
- **UI**: ShadCN UI + Tailwind CSS
- **Icons**: Lucide React
