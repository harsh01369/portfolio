# EmailJS Setup Instructions

Your contact form is now ready to work with EmailJS! Follow these steps to complete the setup:

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

## Step 2: Add Email Service

1. After logging in, go to "Email Services" in the left sidebar
2. Click "Add New Service"
3. Choose your email provider (Gmail is recommended)
4. Follow the instructions to connect your email account
5. **Save the Service ID** (you'll need this later)

## Step 3: Create Email Template

1. Go to "Email Templates" in the left sidebar
2. Click "Create New Template"
3. Use this template content:

**Subject:**
```
New Contact Form Message from {{from_name}}
```

**Body:**
```
You have received a new message from your portfolio contact form:

From: {{from_name}}
Email: {{email}}
Subject: {{subject}}

Message:
{{message}}

---
This message was sent from your portfolio website contact form.
```

4. Make sure to use these exact variable names:
   - `{{from_name}}` - maps to the "name" field
   - `{{email}}` - maps to the "email" field
   - `{{subject}}` - maps to the "subject" field
   - `{{message}}` - maps to the "message" field

5. **Save the Template ID** (you'll need this later)

## Step 4: Get Your Public Key

1. Go to "Account" in the left sidebar
2. Find the "API Keys" section
3. **Copy your Public Key** (you'll need this)

## Step 5: Create .env File

1. In your project root directory, create a file named `.env`
2. Add these lines (replace with your actual values):

```env
REACT_APP_EMAILJS_SERVICE_ID=service_xxxxxxx
REACT_APP_EMAILJS_TEMPLATE_ID=template_xxxxxxx
REACT_APP_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxx
```

3. **IMPORTANT:** Never commit the `.env` file to Git (it's already in .gitignore)

## Step 6: Add Environment Variables to Vercel

Since you're deploying on Vercel, you need to add these environment variables there too:

1. Go to your Vercel dashboard: [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your portfolio project
3. Go to "Settings" → "Environment Variables"
4. Add these three variables:
   - **Name:** `REACT_APP_EMAILJS_SERVICE_ID` | **Value:** (your service ID)
   - **Name:** `REACT_APP_EMAILJS_TEMPLATE_ID` | **Value:** (your template ID)
   - **Name:** `REACT_APP_EMAILJS_PUBLIC_KEY` | **Value:** (your public key)
5. Click "Save" for each one

## Step 7: Redeploy on Vercel

1. After adding the environment variables, redeploy your site
2. You can either:
   - Push a new commit to trigger automatic deployment, OR
   - Go to "Deployments" tab and click "Redeploy" on the latest deployment

## Testing

1. Once deployed, go to your live website
2. Navigate to the Contact page
3. Fill out the form and submit
4. You should receive an email at the address you configured in EmailJS
5. Check your EmailJS dashboard to see the email activity

## Troubleshooting

**Form shows "Something went wrong" error:**
- Check browser console for detailed error messages
- Verify all three environment variables are set correctly in Vercel
- Make sure the Service ID, Template ID, and Public Key are correct
- Ensure the email service is connected and active in EmailJS dashboard

**Email not received:**
- Check spam/junk folder
- Verify the template variable names match exactly (case-sensitive)
- Make sure your email service is properly connected in EmailJS
- Check EmailJS dashboard for failed email attempts

**Environment variables not working:**
- After adding variables in Vercel, you MUST redeploy
- Variable names must start with `REACT_APP_` for Create React App
- Make sure there are no spaces or quotes around the values

## Free Tier Limits

EmailJS free tier includes:
- 200 emails per month
- Basic email templates
- All email service providers

This should be more than enough for a portfolio website!

## Support

If you need help:
- EmailJS Docs: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- EmailJS Support: [https://www.emailjs.com/support/](https://www.emailjs.com/support/)

---

That's it! Your contact form is now fully functional and will send emails directly to your inbox.
