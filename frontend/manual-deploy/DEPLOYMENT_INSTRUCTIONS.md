# Manual Deployment Instructions

## AWS S3 Setup:

1. Sign up for AWS (free tier): https://aws.amazon.com
2. Go to S3 Console: https://s3.console.aws.amazon.com
3. Click "Create bucket"
4. Bucket name: texttoreels-static (or your domain)
5. Region: us-east-1
6. Uncheck "Block all public access"
7. Click "Create bucket"

## Upload Files:

1. Open your S3 bucket
2. Drag and drop ALL files from this folder
3. Wait for upload to complete
4. Select all uploaded files
5. Click "Actions" → "Make public"
6. Confirm making files public

## Enable Website Hosting:

1. Go to bucket "Properties" tab
2. Scroll to "Static website hosting"
3. Click "Edit"
4. Select "Enable"
5. Index document: index.html
6. Error document: 404.html
7. Click "Save changes"

## Your Website URL:
http://texttoreels-static.s3-website-us-east-1.amazonaws.com

## Custom Domain (Optional):
- Use CloudFront for HTTPS
- Point your domain to the S3 website URL

## Costs:
- Storage: ~$0.50/month for 20GB
- Requests: ~$0.01/month for normal traffic
- Total: ~$1-5/month

Generated on: 2025-08-22T09:19:38.281Z
