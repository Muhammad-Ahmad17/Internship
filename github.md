 **Brief but complete overview** of essential Git commands for **pushing a project** and **maintaining it over time**.

---

### 🚀 **1. Initializing & First Push**

```bash
git init                      # Initialize a local Git repo
git remote add origin <repo-url>  # Connect to GitHub repo (HTTPS/SSH)
git add .                     # Stage all files
git commit -m "Initial commit"   # Commit with a message
git branch -M main            # Rename current branch to main (optional)
git push -u origin main       # Push to GitHub (first time)
```

---

### 📄 **2. Daily Workflow (Modify → Commit → Push)**

```bash
git status                    # Check current status
git add <file>                # Stage specific file(s)
git add .                     # Or stage all changes
git commit -m "Meaningful message"  # Commit staged changes
git push                      # Push to the remote branch
```

---

### 🌿 **3. Working with Branches**

```bash
git branch                    # List branches
git switch branch_name        # Switch to a branch
git switch -c new_branch      # Create and switch to new branch
git push -u origin new_branch # Push new branch to remote
```

---

### 🔁 **4. Keeping Your Repo Up-to-date**

```bash
git pull origin main          # Get latest changes from main
git fetch                     # Fetch all branches and tags from remote
git merge origin/main         # Merge main into current branch
```

---

### 🔄 **5. Merge Branch into Main**

```bash
git switch main               # Go to main branch
git merge feature_branch      # Merge feature into main
git push                      # Push updated main
```

---

### 🧹 **6. Clean-up (optional)**

```bash
git branch -d branch_name     # Delete local branch
git push origin --delete branch_name  # Delete remote branch
```

---

### 📝 **7. Helpful Extras**

```bash
git log                       # See commit history
git remote -v                 # View remote URLs
git config user.name "Your Name"       # Set Git name
git config user.email "your@email.com" # Set Git email
```

---

