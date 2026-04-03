# Admin Login Guide - BlinkIt Clone

## Overview

This document explains how admin authentication works in the BlinkIt Clone application and how to create/administer admin users.

## Current Implementation

### 1. **Login Page Location**

- **File**: `client/src/pages/Login.jsx`
- **Route**: `/login`
- **Features**:
  - ✅ **NEW**: Admin Login Toggle Button - Visual indicator for admin login
  - ✅ Unified login form for both regular users and admins
  - ✅ Automatic redirect: Admins → Dashboard, Users → Home
  - ✅ Visual distinction with orange theme for admin mode

### 2. **How Admin Authentication Works**

The system uses **role-based access control (RBAC)**:

1. **User Model** (`server/models/user.model.js`):
   - Each user has a `role` field: `"ADMIN"` or `"USER"` (default)
   - Role is stored in MongoDB

2. **Login Process**:
   - Same login endpoint (`/api/user/login`) for all users
   - After successful login, user details (including role) are fetched
   - Role is stored in Redux state (`client/src/store/userSlice.js`)

3. **Admin Access Control**:
   - **Frontend**: `AdminPermision` component (`client/src/layouts/AdminPermision.jsx`) protects admin routes
   - **Backend**: `admin` middleware (`server/middleware/Admin.js`) protects admin API endpoints
   - Admin menu items appear in `UserMenu` component when `role === "ADMIN"`

### 3. **Admin Routes (Protected)**

Admin-only routes in `client/src/route/index.jsx`:

- `/dashboard/category` - Manage categories
- `/dashboard/subcategory` - Manage subcategories
- `/dashboard/upload-product` - Upload new products
- `/dashboard/product` - Manage products

All these routes are wrapped with `<AdminPermision>` component.

### 4. **Admin Menu Items**

When logged in as admin, the following menu items appear in the user menu:

- Category
- Sub Category
- Upload Product
- Product

Location: `client/src/components/UserMenu.jsx` (lines 58-79)

## How to Create an Admin User

### Method 1: Using the Admin Creation Script (Recommended)

A utility script has been created to easily convert any existing user to admin:

**File**: `server/utils/createAdmin.js`

**Usage**:

```bash
# Navigate to project root
cd server

# Run the script with user's email
node utils/createAdmin.js user@example.com
```

**What it does**:

- Connects to the database
- Finds the user by email
- Updates their role to "ADMIN"
- Displays confirmation

### Method 2: Direct Database Update (MongoDB)

If you have direct access to MongoDB:

```javascript
// Connect to MongoDB
use your_database_name

// Update user role to ADMIN
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "ADMIN" } }
)

// Verify the update
db.users.findOne({ email: "admin@example.com" })
//passowrd : 1234
```

### Method 3: Using MongoDB Compass or Other GUI Tools

1. Open MongoDB Compass
2. Connect to your database
3. Navigate to the `users` collection
4. Find the user by email
5. Edit the document and change `role` from `"USER"` to `"ADMIN"`
6. Save the changes

## How to Use Admin Login

### Step-by-Step Guide:

1. **Create an Admin User** (if not already created):

   ```bash
   node server/utils/createAdmin.js admin@example.com
   ```

2. **Navigate to Login Page**:
   - Go to `/login` in your browser

3. **Enable Admin Login Mode**:
   - Click the toggle button at the top of the login form
   - It will change from "Regular Login" to "Admin Login Mode"
   - The form will show orange theme indicating admin mode

4. **Enter Admin Credentials**:
   - Email: The email of the admin user
   - Password: The password for that user

5. **Login**:
   - Click "Login as Admin" button
   - You'll be automatically redirected to `/dashboard/product`
   - A welcome message "Welcome Admin!" will appear

6. **Access Admin Features**:
   - Click on "Account" in the header
   - You'll see admin menu items:
     - Category
     - Sub Category
     - Upload Product
     - Product

## Important Notes

### Security Considerations:

1. **Backend Protection**: All admin API endpoints are protected by the `admin` middleware
2. **Frontend Protection**: Admin routes are protected by `AdminPermision` component
3. **Role Verification**: The system checks `user.role === "ADMIN"` before granting access

### Current Limitations:

1. **No Separate Admin Registration**: Admins must be created manually or via script
2. **No Admin Dashboard Home**: Admins are redirected to product management page
3. **No Role Change UI**: Role changes must be done via database or script

## File Structure Reference

```
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   └── Login.jsx              # Login page with admin toggle
│   │   ├── layouts/
│   │   │   ├── AdminPermision.jsx     # Admin route protection
│   │   │   └── Dashboard.jsx          # Dashboard layout
│   │   ├── components/
│   │   │   └── UserMenu.jsx           # User menu with admin items
│   │   ├── utils/
│   │   │   └── isAdmin.js             # Admin role checker
│   │   └── store/
│   │       └── userSlice.js           # Redux store for user data
│
└── server/
    ├── models/
    │   └── user.model.js              # User schema with role field
    ├── middleware/
    │   └── Admin.js                   # Admin middleware for API protection
    ├── controllers/
    │   └── user.controller.js         # Login controller
    └── utils/
        └── createAdmin.js             # Script to create admin users
```

## Troubleshooting

### Issue: "Do not have permission" message

**Solution**: The user's role is not set to "ADMIN" in the database. Use the `createAdmin.js` script to fix this.

### Issue: Admin menu items not showing

**Solution**:

1. Check if user role is "ADMIN" in Redux state
2. Verify the user was logged in successfully
3. Check browser console for errors

### Issue: Cannot access admin routes

**Solution**:

1. Ensure you're logged in
2. Verify your role is "ADMIN" in the database
3. Clear browser cache and localStorage, then login again

## Future Enhancements (Optional)

Potential improvements you could add:

1. **Admin Registration Page**: Separate registration for admins
2. **Admin Dashboard Home**: Dedicated admin dashboard with statistics
3. **Role Management UI**: Allow admins to change user roles from the UI
4. **Admin Activity Log**: Track admin actions
5. **Multi-level Admin Roles**: Super Admin, Admin, Moderator, etc.

---

**Last Updated**: Based on current codebase analysis
**Version**: 1.0
