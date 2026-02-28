# RevCycle AI

Next-gen AI-powered Revenue Cycle Management (RCM) platform built with Next.js, Firebase, and Genkit.

## GitHub Sync Instructions

To push this project to your private GitHub repository, follow these steps in your terminal:

1. **Create a Private Repo**: Go to [github.com/new](https://github.com/new) and create a repository named `revcycle-ai`. Keep it **Private**.
2. **Open Terminal**: In your local development environment, open the terminal in the project root.
3. **Execute Commands**:

```bash
# 1. Initialize Git
git init

# 2. Add all files (the .gitignore will keep your secrets safe)
git add .

# 3. Commit the changes
git commit -m "Initial commit: Professional RCM Platform"

# 4. Branch to main
git branch -M main

# 5. Connect to your GitHub (Replace <USERNAME> with your actual GitHub handle)
git remote add origin https://github.com/<USERNAME>/revcycle-ai.git

# 6. Push the code
git push -u origin main
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **AI**: Genkit (Google Gemini)
- **UI**: ShadCN UI + Tailwind CSS
- **Icons**: Lucide React
