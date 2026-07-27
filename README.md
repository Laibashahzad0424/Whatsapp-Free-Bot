# WhatsApp Free Rule-Based Bot — Deploy Guide (Roman Urdu)

## Yeh kya hai?
Ek chota server jo WhatsApp par customer ke message ke keyword check karta hai
aur pehle se likha hua fixed jawab bhej deta hai. Koi paid AI service nahi chahiye — bilkul FREE.

## Files
- `server.js` — Bot ka pura code
- `package.json` — Dependencies
- `.env.example` — Kaunse secrets chahiye, uski list (yeh khud upload nahi karni)

## Step 1: GitHub par code upload karein
1. github.com par account banayein
2. "New repository" > naam den (jaise: whatsapp-free-bot) > Create
3. "Add file" > "Upload files" se `server.js` aur `package.json` upload kar dein
4. "Commit changes" dabayein

## Step 2: Render.com par deploy karein
1. render.com par account banayein (GitHub se sign in kar sakte hain — aasan hai)
2. Dashboard mein "New +" > "Web Service"
3. Apna GitHub repo (whatsapp-free-bot) select karein
4. Settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
5. "Environment Variables" mein yeh 3 add karein:
   - `VERIFY_TOKEN` = koi bhi apna banaya lafz (jaise: mySecret123)
   - `WHATSAPP_TOKEN` = Meta dashboard se mila access token
   - `PHONE_NUMBER_ID` = Meta dashboard se mila Phone Number ID
6. "Create Web Service" dabayein — 2-3 minute mein live ho jayega
7. Aapko URL milega jaisa: `https://whatsapp-free-bot-xyz.onrender.com`

## Step 3: Meta Dashboard mein Webhook set karein
1. developers.facebook.com > apna app > WhatsApp > Configuration
2. **Callback URL**: `https://whatsapp-free-bot-xyz.onrender.com/webhook`
3. **Verify token**: wahi jo Render mein VERIFY_TOKEN rakha tha
4. "Verify and save" dabayein
5. "Webhook fields" mein "messages" subscribe karein

## Step 4: Test karein
WhatsApp se test number par "hi" likh kar bhejein — bot menu ke saath reply karega!

## Bot ke jawab customize karna
`server.js` mein "RULES" wale section mein jaayein — wahan `keywords` aur `reply`
change kar ke apni marzi ke jawab set kar sakte hain. Jitne chahein rules add kar sakte hain.

## Note
- Access token (Meta dashboard wala temporary) sirf 24 ghante chalta hai. Permanent token
  chahiye ho to "System User" banana hoga Meta Business Settings mein.
- Free Render plan par server "so jata hai" agar 15 min tak koi request na aaye —
  pehla message us waqt 10-15 second late aa sakta hai, phir normal speed.
