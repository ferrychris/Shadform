# AKG Consulting Form with Appwrite Integration

This project includes a job application form for AKG Consulting with secure file uploads for driver's license images and an admin dashboard to view submissions.

## Features

- Multi-step application form with validation
- Secure storage of sensitive information (SSN, driver's license images)
- Admin dashboard to view and manage submissions
- Image preview and download functionality
- Secure authentication for admin access

## Setup Instructions

### 1. Create an Appwrite Account

1. Sign up for a free account at [Appwrite](https://appwrite.io/)
2. Create a new project named "shadform"

### 2. Create Appwrite Resources

#### Database Setup

1. Create a new database named "shadform-db"
2. Create a collection named "applications" with the following attributes:
   - name (string)
   - email (string)
   - phone (string)
   - address (string)
   - city (string)
   - state (string)
   - zip (string)
   - ssn (string)
   - age (integer)
   - position (string)
   - experience (string)
   - availability (string)
   - dlFrontId (string)
   - dlBackId (string)
   - submittedAt (string)

#### Storage Setup

1. Create a new storage bucket named "application-files"
2. Set appropriate permissions (suggested: only authenticated users can read files)

#### Authentication Setup

1. Enable Email/Password authentication in the Appwrite dashboard
2. Create an admin user with email and password
3. Set appropriate permissions for the admin user to access the database and storage

### 3. Update Configuration

Update the Appwrite configuration in `/src/utils/appwrite.js` with your project ID:

```javascript
client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('your-project-id'); // Replace with your project ID
```

## Running the Application

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Access the application form at:
   ```
   http://localhost:5173/
   ```

4. Access the admin dashboard at:
   ```
   http://localhost:5173/admin/
   ```

## Admin Dashboard

The admin dashboard allows you to:

1. View all form submissions
2. See detailed information for each submission
3. View and download driver's license images
4. Manage application data securely

## Security Considerations

- SSN and driver's license information are stored securely in Appwrite
- Admin access is protected by authentication
- File uploads are stored in a secure storage bucket
- Permissions are configured to restrict access to authorized users only

## Customization

You can customize the form fields, validation rules, and UI styling by modifying the following files:

- `/index.html` - Form structure and fields
- `/src/main.js` - Form validation and submission logic
- `/src/styles.css` - UI styling
- `/admin/index.html` - Admin dashboard UI
- `/admin/admin.js` - Admin dashboard functionality
