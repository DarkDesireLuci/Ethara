# Test Credentials & Quick Start

## 🚀 Quick Start (After MongoDB Setup)

Once you have MongoDB running as a replica set, follow these steps:

### Step 1: Seed the Database

Run this command to create test users and sample data:

```bash
cd backend
npm run seed
```

This will create:
- ✅ 2 test users
- ✅ 1 sample project
- ✅ 6 sample tasks (across all statuses)

### Step 2: Login with Test Credentials

Open http://localhost:5173 and use:

#### Admin User
```
Email:    test@example.com
Password: test123
```

#### Demo User (Member Role)
```
Email:    demo@example.com
Password: demo123
```

## 📊 What You'll See

After logging in with test credentials, you'll have:

### Dashboard
- Overview of your projects
- Task statistics
- Recent activity

### Sample Project
- **Name:** Sample Project
- **Members:** Test User (Admin), Demo User (Member)
- **Tasks:** 6 tasks across different statuses

### Sample Tasks
1. ✅ **Done:** Setup development environment (High priority)
2. ✅ **Done:** Design database schema (High priority)
3. 🔄 **In Progress:** Implement authentication (High priority)
4. 🔄 **In Progress:** Create project dashboard (Medium priority)
5. 📋 **To Do:** Add task management (Medium priority)
6. 📋 **To Do:** Write documentation (Low priority)

## 🎯 Try These Features

### As Admin User (test@example.com)
- ✅ Create new projects
- ✅ Add/remove team members
- ✅ Create, edit, and delete tasks
- ✅ Drag and drop tasks between columns
- ✅ Assign tasks to team members
- ✅ Update project settings

### As Demo User (demo@example.com)
- ✅ View projects you're a member of
- ✅ Create and edit tasks
- ✅ Update task status
- ✅ View team members
- ❌ Cannot delete projects (Member role)
- ❌ Cannot add/remove members (Member role)

## 🔄 Reset Test Data

To reset and recreate test data:

```bash
cd backend
npm run seed
```

The seed script uses `upsert`, so it's safe to run multiple times.

## 🆕 Create Your Own Account

You can also register a new account:

1. Go to http://localhost:5173/register
2. Fill in your details
3. You'll be logged in automatically
4. Create your own projects and tasks!

## 📝 Manual Testing

If you prefer to test the API directly, use `test-api.html`:

1. Open `test-api.html` in your browser
2. Click "Test Health Endpoint" to verify backend is running
3. Try registering a new user
4. Try logging in with test credentials

## 🐛 Troubleshooting

### "Invalid credentials" error
- Make sure you ran `npm run seed` first
- Check that MongoDB is running as a replica set
- Verify backend is running on http://localhost:3000

### "Failed to fetch" error
- Backend might not be running
- Check backend terminal for errors
- Verify MongoDB connection

### No sample data showing
- Run `npm run seed` in the backend directory
- Check backend logs for any errors
- Verify database connection

## 🎨 Test Scenarios

### Scenario 1: Project Management
1. Login as test@example.com
2. Create a new project
3. Add demo@example.com as a member
4. Create some tasks
5. Assign tasks to team members

### Scenario 2: Task Workflow
1. Login as test@example.com
2. Go to "Sample Project"
3. Drag tasks between columns
4. Create a new task
5. Assign it to Demo User
6. Logout and login as demo@example.com
7. See the assigned task

### Scenario 3: Role-Based Access
1. Login as demo@example.com (Member)
2. Try to access project settings (should be restricted)
3. Try to remove a member (should fail)
4. Logout and login as test@example.com (Admin)
5. Access project settings (should work)
6. Add/remove members (should work)

## 📚 Next Steps

After testing with the sample data:

1. **Explore the UI** - Check out all the features
2. **Create your own projects** - Start fresh with your own data
3. **Invite team members** - Register multiple accounts to test collaboration
4. **Customize** - Modify the code to fit your needs
5. **Deploy** - When ready, deploy to production!

---

**Enjoy testing Ethara! 🎉**
