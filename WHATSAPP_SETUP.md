# WhatsApp Business API Setup Guide

This guide will walk you through setting up WhatsApp Business API integration for ConvoToBuild.

## Prerequisites

- Facebook Developer Account
- Facebook Business Account
- A phone number not previously used with WhatsApp
- A deployed instance of ConvoToBuild (with HTTPS)

## Step 1: Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click on **"My Apps"** in the top right
3. Click **"Create App"**
4. Select **"Business"** as the app type
5. Fill in the app details:
   - **App Name**: ConvoToBuild Bot
   - **App Contact Email**: Your email
   - **Business Account**: Select or create one
6. Click **"Create App"**

## Step 2: Add WhatsApp Product

1. In your app dashboard, find **"WhatsApp"** in the products list
2. Click **"Set Up"**
3. You'll be taken to the WhatsApp setup page

## Step 3: Get Your Credentials

### Phone Number ID

1. In the WhatsApp setup page, look for **"API Setup"** section
2. You'll see a **"Phone number ID"** - copy this
3. Add it to your `.env` file:
   ```env
   WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
   ```

### Access Token

1. In the same section, you'll see a **"Temporary access token"**
2. Copy this token (valid for 24 hours)
3. Add it to your `.env` file:
   ```env
   WHATSAPP_API_TOKEN=your_temporary_token_here
   ```

**Important:** For production, you'll need to generate a permanent token (see Step 6).

## Step 4: Configure Webhook

### Generate a Verify Token

1. Generate a random string for your verify token:
   ```bash
   openssl rand -hex 32
   ```
2. Add it to your `.env` file:
   ```env
   WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_generated_token_here
   ```

### Set Up Webhook URL

1. In the WhatsApp setup page, find **"Configuration"** section
2. Click **"Edit"** next to Webhook
3. Enter your webhook URL:
   ```
   https://your-domain.com/api/webhook
   ```
4. Enter the verify token you generated above
5. Click **"Verify and Save"**

### Subscribe to Webhook Fields

1. After webhook is verified, click **"Manage"**
2. Subscribe to the following fields:
   - ✅ **messages** (required)
   - ✅ **message_template_status_update** (optional)
   - ✅ **messaging_handovers** (optional)
3. Click **"Save"**

## Step 5: Test Your Integration

### Send a Test Message

1. In the WhatsApp setup page, find the **"Send and receive messages"** section
2. You'll see a test phone number (can send to 5 numbers)
3. Add your personal WhatsApp number
4. Send a test message from your phone to the test number
5. Check your ConvoToBuild logs to see if the message was received

### Check Webhook Status

1. Go to **"Configuration"** section
2. Click **"Test"** button next to your webhook
3. Verify that all tests pass

## Step 6: Get a Permanent Access Token

The temporary token expires in 24 hours. For production, you need a permanent token.

### Option A: System User Token (Recommended for Production)

1. Go to your [Business Settings](https://business.facebook.com/settings/)
2. Navigate to **"System Users"** under **"Users"**
3. Click **"Add"** to create a new system user
4. Give it a name (e.g., "ConvoToBuild Bot")
5. Assign the system user to your app:
   - Click **"Add Assets"**
   - Select **"Apps"**
   - Choose your WhatsApp app
   - Grant **"Manage App"** permission
6. Click **"Generate New Token"**
7. Select your app
8. Select permissions:
   - ✅ `whatsapp_business_messaging`
   - ✅ `whatsapp_business_management`
9. Copy the generated token
10. Update your `.env` file:
    ```env
    WHATSAPP_API_TOKEN=your_permanent_token_here
    ```

### Option B: User Access Token (For Development)

1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app from the dropdown
3. Click **"Generate Access Token"**
4. Select permissions:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`
5. Copy the token
6. Use [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/) to extend it to long-lived (60 days)

## Step 7: Add Your Phone Number

The test number provided by Facebook can only send messages to 5 phone numbers. For production:

1. Go to **"Phone Numbers"** in WhatsApp setup
2. Click **"Add Phone Number"**
3. Follow the verification process
4. Update your Phone Number ID in `.env` with the new number's ID

### Phone Number Verification

You'll need to verify your phone number via SMS or voice call:

1. Enter your phone number
2. Choose verification method (SMS or Voice)
3. Enter the verification code
4. Complete the verification

### Display Name

Set a display name for your business:

1. Go to **"Phone Numbers"** settings
2. Click on your phone number
3. Click **"Edit"** next to Display Name
4. Enter your business name (e.g., "ConvoToBuild")
5. Click **"Save"**

## Step 8: Configure Webhook Security (Production)

For production, implement webhook signature verification:

### Enable Signature Verification

1. In your Facebook App dashboard, go to **Settings** > **Basic**
2. Copy your **App Secret**
3. Add it to your `.env`:
   ```env
   FACEBOOK_APP_SECRET=your_app_secret
   ```

### Update Webhook Handler

Add signature verification to your webhook:

```typescript
// app/api/webhook/route.ts
import crypto from 'crypto'

function verifySignature(payload: string, signature: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.FACEBOOK_APP_SECRET!)
    .update(payload)
    .digest('hex')
  
  return signature === `sha256=${expectedSignature}`
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get('x-hub-signature-256')
  const body = await request.text()
  
  if (!verifySignature(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
  }
  
  // Process webhook...
}
```

## Step 9: Test End-to-End

### Test Message Flow

1. Send a message from your WhatsApp to your bot number
2. Check that:
   - Message is received in webhook
   - AI processes the message
   - Bot responds via WhatsApp

### Test Message Example

Send: "Create a landing page for my coffee shop"

Expected Response:
```
I'd like to help you build that! Let me ask a few questions:

1. What sections would you like on your landing page?
2. What colors or style should I use?
3. Do you want a contact form?
```

## Environment Variables Summary

Add these to your `.env` file:

```env
# WhatsApp Business API
WHATSAPP_API_TOKEN=your_permanent_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_generated_verify_token
WHATSAPP_API_URL=https://graph.facebook.com/v18.0

# Optional: For signature verification
FACEBOOK_APP_SECRET=your_app_secret
```

## Troubleshooting

### Webhook Not Receiving Messages

1. **Check webhook URL is publicly accessible:**
   ```bash
   curl https://your-domain.com/api/health
   ```

2. **Verify webhook is properly configured:**
   - Go to WhatsApp Configuration
   - Check that webhook URL is correct
   - Verify that "messages" is subscribed

3. **Check webhook logs:**
   ```bash
   # View webhook logs
   docker-compose logs -f app
   ```

4. **Test webhook manually:**
   ```bash
   curl -X POST https://your-domain.com/api/webhook \
     -H "Content-Type: application/json" \
     -d @test-webhook-payload.json
   ```

### Messages Not Sending

1. **Check access token is valid:**
   - Use [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/)
   - Verify token hasn't expired

2. **Check phone number ID is correct:**
   ```bash
   # Test API with phone number ID
   curl -X POST "https://graph.facebook.com/v18.0/{PHONE_NUMBER_ID}/messages" \
     -H "Authorization: Bearer {ACCESS_TOKEN}" \
     -H "Content-Type: application/json" \
     -d '{"messaging_product": "whatsapp", "to": "1234567890", "type": "text", "text": {"body": "Test"}}'
   ```

3. **Verify recipient number is in allowed list:**
   - During testing with test number, only 5 numbers can receive messages
   - Add recipient in Phone Number settings

### Rate Limiting

WhatsApp has rate limits:
- **Cloud API (Testing):** 1,000 conversations per month
- **Cloud API (Production):** Based on your limit tier
- **Messages per second:** Limited based on your tier

### 24-Hour Window

WhatsApp enforces a 24-hour messaging window:
- You can freely message users within 24 hours of their last message
- After 24 hours, you can only send approved template messages
- Users can always message you first

## Message Templates

For messages outside the 24-hour window, you need approved templates:

1. Go to **"Message Templates"** in WhatsApp Manager
2. Click **"Create Template"**
3. Design your template
4. Submit for approval
5. Once approved, use template messages:

```typescript
await whatsappService.sendTemplateMessage(
  userPhoneNumber,
  'template_name',
  [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: 'John' }
      ]
    }
  ]
)
```

## Production Checklist

Before going to production:

- [ ] Permanent access token configured
- [ ] Production phone number added and verified
- [ ] Webhook signature verification enabled
- [ ] HTTPS enabled on webhook endpoint
- [ ] Error logging configured
- [ ] Rate limiting implemented
- [ ] Message templates approved
- [ ] Business verification completed (for higher limits)
- [ ] Backup phone number configured
- [ ] Monitoring and alerting set up

## Business Verification

For higher rate limits and features:

1. Complete business verification in Facebook Business Manager
2. Provide business documentation
3. Wait for approval (usually 1-3 business days)
4. Once verified, request higher rate limits

## Useful Links

- [WhatsApp Business API Documentation](https://developers.facebook.com/docs/whatsapp)
- [Cloud API Getting Started](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started)
- [Message Templates](https://developers.facebook.com/docs/whatsapp/message-templates)
- [Webhooks](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks)
- [Rate Limits](https://developers.facebook.com/docs/whatsapp/cloud-api/overview#throughput)

## Support

If you encounter issues:
1. Check [Facebook Developer Community](https://developers.facebook.com/community/)
2. Review [WhatsApp Cloud API Changelog](https://developers.facebook.com/docs/whatsapp/cloud-api/changelog)
3. Open an issue on [ConvoToBuild GitHub](https://github.com/Rakshakh/ConvoToBuild/issues)

---

**Note:** WhatsApp Business API policies and requirements may change. Always refer to the official WhatsApp Business API documentation for the most up-to-date information.
