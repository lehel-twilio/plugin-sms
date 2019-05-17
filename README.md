Set your accountSid and serviceBaseURL in /public/appConfig.js

To build, run npm run build.

To deploy:

1. Ensure "Include Account Sid & Auth Token" is checked under Functions Configuration
2. Add CHAT_SERVICE_SID and FLEX_FLOW_SID (the sms FlexFlow Sid) to your Twilio Functions Environment Variables
3. Deploy the Twilio Function from src/functions with route /create-new-sms
4. Copy /build/plugin-sms.js to your Twilio Assets directory


