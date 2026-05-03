# HireAI - Three-Login System Documentation

## Overview
The platform now supports three distinct login roles: **Student**, **Company**, and **Admin**. Each role has its own login page and dashboard.

## Login Roles

### 1. **Student Login**
- **Route**: `/login` (redirects to `/login-select`)
- **Page**: `/src/app/login/page.tsx`
- **Authentication**: GitHub OAuth
- **Dashboard**: `/dashboard` (main student dashboard)
- **Features**:
  - Browse and apply for jobs
  - Manage resume
  - Track applications
  - View interview history
  - Build user profile

### 2. **Company Login**
- **Route**: `/company/login`
- **Page**: `/src/app/company/login/page.tsx`
- **Authentication**: Email/Password (custom)
- **Dashboard**: `/company/dashboard`
- **Features**:
  - Post and manage job listings
  - View applicants
  - Manage hiring pipeline
  - Track company metrics

### 3. **Admin Login**
- **Route**: `/admin/login`
- **Page**: `/src/app/admin/login/page.tsx`
- **Authentication**: Email/Password (environment-based)
- **Dashboard**: `/dashboard/admin`
- **Features**:
  - Manage all users
  - Monitor jobs
  - View all applications
  - Analytics and reports
  - Platform-wide insights

## Login Selection Page
- **Route**: `/login-select`
- **Page**: `/src/app/login-select/page.tsx`
- **Purpose**: Central landing page with three options to select login role
- **Features**:
  - Beautiful card-based UI with role descriptions
  - Direct links to each login type
  - Mobile responsive design

## File Structure

```
src/
├── app/
│   ├── login/
│   │   └── page.tsx (redirects to /login-select)
│   ├── login-select/
│   │   └── page.tsx (role selection page)
│   ├── admin/
│   │   └── login/
│   │       └── page.tsx (admin login page)
│   ├── company/
│   │   └── login/
│   │       └── page.tsx (company login page)
│   ├── api/
│   │   └── admin/
│   │       └── login/
│   │           └── route.ts (admin login API)
│   └── (dashboard)/
│       ├── admin/
│       │   ├── page.tsx (admin dashboard - overview)
│       │   ├── users/
│       │   │   └── page.tsx (manage users)
│       │   ├── jobs/
│       │   │   └── page.tsx (manage jobs)
│       │   ├── applications/
│       │   │   └── page.tsx (manage applications)
│       │   └── reports/
│       │       └── page.tsx (analytics & reports)
│       └── layout.tsx (protected dashboard layout)
```

## Admin Dashboard Features

### 1. Overview Dashboard (`/dashboard/admin`)
- **Key Metrics**:
  - Total Users
  - Companies Count
  - Active Jobs
  - Total Applications
  - Resume Count

- **Sections**:
  - Application Status Overview
  - Top Companies
  - Quick Actions
  - Recent Users
  - Recent Jobs
  - Recent Applications Table

### 2. User Management (`/dashboard/admin/users`)
- View all registered users
- See user roles (ADMIN, USER)
- Track resume count and applications per user
- View join dates
- Full user information table

### 3. Job Management (`/dashboard/admin/jobs`)
- View all posted jobs
- See application counts per job
- Company information
- Job descriptions
- Posting dates

### 4. Application Management (`/dashboard/admin/applications`)
- Status overview (Pending, Approved, Rejected)
- Detailed applications table
- Applicant information
- Job details
- Application dates
- Status badges with color coding

### 5. Reports & Analytics (`/dashboard/admin/reports`)
- **Key Reports**:
  - Users by Role (with progress bars)
  - Applications by Status (with progress bars)
  - Top Companies by Job Postings
  - Resume Score Distribution
  - Platform-wide metrics

## Environment Variables

Add these to your `.env.local` file:

```env
# Admin Login Credentials
ADMIN_EMAIL=admin@hireai.com
ADMIN_PASSWORD=admin123

# Existing GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Database
DATABASE_URL=your_database_url
```

## API Endpoints

### Admin Login
- **Method**: POST
- **Route**: `/api/admin/login`
- **Body**:
  ```json
  {
    "email": "admin@hireai.com",
    "password": "admin123"
  }
  ```
- **Response**:
  ```json
  {
    "token": "base64_encoded_token",
    "user": {
      "id": "user_id",
      "email": "admin@hireai.com",
      "name": "Admin",
      "role": "ADMIN"
    }
  }
  ```

## User Flow

### First-time Visit
1. User visits `/` or `/login`
2. Redirected to `/login-select`
3. Chooses role (Student, Company, or Admin)
4. Directed to appropriate login page

### Student Flow
1. Visit `/login-select`
2. Click "Student" card
3. Click "Login as Student"
4. GitHub OAuth login
5. Dashboard at `/dashboard`

### Company Flow
1. Visit `/login-select`
2. Click "Company" card
3. Click "Login as Company"
4. Email/Password authentication
5. Dashboard at `/company/dashboard`

### Admin Flow
1. Visit `/login-select`
2. Click "Admin" card
3. Click "Login as Admin"
4. Admin credentials authentication
5. Dashboard at `/dashboard/admin`

## Security Notes

1. **Admin Credentials**: Stored in environment variables, not in code
2. **Admin Session**: Currently uses Base64 token (should use JWT in production)
3. **Role-based Access**: All admin pages check user role before rendering
4. **Admin Auto-creation**: If admin user doesn't exist, it's created during login
5. **Database**: Admin user has role "ADMIN" in the User model

## Customization

### Changing Admin Credentials
Update `.env.local`:
```env
ADMIN_EMAIL=your_email@company.com
ADMIN_PASSWORD=your_secure_password
```

### Adding More Admin Users
Modify `/src/app/api/admin/login/route.ts` to support multiple admin accounts or integrate with a proper admin user database.

### Styling
All components use Tailwind CSS and follow the existing design system. Update color classes in component files to customize.

## Database Models

### User Model (Prisma)
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  role          Role      @default(USER)  // USER or ADMIN
  
  // ... other fields
}

enum Role {
  USER
  ADMIN
}
```

## Future Enhancements

1. **JWT Tokens**: Replace Base64 with proper JWT for admin sessions
2. **Admin Panel Settings**: Add platform configuration options
3. **User Moderation**: Ban/suspend user functionality
4. **Content Moderation**: Job and resume moderation tools
5. **Email Notifications**: Admin alerts for new jobs/applications
6. **Audit Logs**: Track all admin actions
7. **Two-Factor Authentication**: Add 2FA for admin accounts
8. **API Key Management**: Generate API keys for admins

## Troubleshooting

### Admin Login Not Working
1. Check `.env.local` has `ADMIN_EMAIL` and `ADMIN_PASSWORD`
2. Verify database connection
3. Check browser console for errors

### Admin Dashboard Not Loading
1. Ensure user role is "ADMIN" in database
2. Check session is valid
3. Verify user email matches in both places

### Redirect Issues
1. Clear browser cache
2. Check middleware configuration in `middleware.ts`
3. Verify layout.tsx is properly configured

## References

- [Next.js Routing](https://nextjs.org/docs/app/building-your-application/routing)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
