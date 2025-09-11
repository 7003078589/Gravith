# Hostinger Deployment Instructions for Gavith Build Construction Management System

## Prerequisites
1. Hostinger hosting account with cPanel access
2. Node.js installed on your local machine
3. Git installed (optional but recommended)

## Step 1: Build the Project for Production

Run these commands in your project directory:

```bash
# Install dependencies
npm install

# Build the project for production
npm run build
```

This will create a `out` folder with all the static files ready for deployment.

## Step 2: Upload to Hostinger

### Method 1: Using cPanel File Manager
1. Log into your Hostinger cPanel
2. Open File Manager
3. Navigate to `public_html` folder
4. Delete any existing files in `public_html`
5. Upload all contents from the `out` folder to `public_html`
6. Make sure the `.htaccess` file is uploaded (it should be in the root of `public_html`)

### Method 2: Using FTP
1. Use an FTP client like FileZilla
2. Connect to your Hostinger FTP server
3. Navigate to `public_html` folder
4. Upload all contents from the `out` folder

## Step 3: Verify Deployment
1. Visit your domain name
2. Test the login functionality with demo credentials:
   - Admin: admin / admin123
   - Manager: manager / manager123
   - Engineer: engineer / engineer123

## Important Notes
- The project is configured for static export, so it will work on any web hosting service
- All routing is handled client-side
- The `.htaccess` file ensures proper routing and performance optimization
- Make sure to upload the `.htaccess` file for proper functionality

## Troubleshooting
- If pages don't load properly, ensure the `.htaccess` file is uploaded
- If images don't load, check that all files from the `out` folder are uploaded
- Clear browser cache if you see old content

## Demo Credentials
- **Admin**: admin / admin123
- **Manager**: manager / manager123  
- **Engineer**: engineer / engineer123
