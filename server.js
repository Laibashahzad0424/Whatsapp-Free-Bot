// WhatsApp Rule-Based Bot (100% FREE - koi paid AI service nahi chahiye)
// -----------------------------------------------------------------------
// Yeh server WhatsApp Cloud API se aane wale messages receive karta hai
// aur pehle se likhe hue fixed rules ke hisaab se jawab deta hai.

require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// ---- Environment variables (Render.com par set karne honge) ----
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// =====================================================
// 1) WEBHOOK VERIFICATION (Meta yeh call karta hai setup ke waqt)
// =====================================================
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified successfully!");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// =====================================================
// 2) INCOMING MESSAGES (jab customer WhatsApp par kuch bhejta hai)
// =====================================================
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (!message) {
      return res.sendStatus(200); // status update hai (delivered/read) - ignore karein
    }

    const from = message.from;
    const text = (message.text?.body || "").toLowerCase().trim();

    console.log(`Message from ${from}: ${text}`);

    const replyText = getReply(text);
    await sendWhatsAppMessage(from, replyText);

    res.sendStatus(200);
  } catch (err) {
    console.error("Error handling webhook:", err.response?.data || err.message);
    res.sendStatus(200); // Meta ko hamesha 200 bhejein warna wo retry karta rahega
  }
});

// =====================================================
// 3) RULES / FIXED REPLIES
// -----------------------------------------------------
// Yahan apni marzi ke jitne chahein rules add kar sakte hain.
// Format: agar message mein yeh keyword ho, to yeh jawab do.
// =====================================================
function getReply(text) {
  const rules = [
    {
      keywords: ["hi", "hello", "salam", "assalam o alaikum", "asalam o alaikum"],
      reply:
        "Assalam o Alaikum! 👋 Welcome. Neeche diye gaye options mein se number likh kar bhejein:\n\n" +
        "1️⃣ Hamare products/services\n" +
        "2️⃣ Pricing\n" +
        "3️⃣ Order status\n" +
        "4️⃣ Kisi insaan se baat karni hai\n\n" +
        "Sirf number type kar ke bhej dein (jaise: 1)",
    },
    {
      keywords: ["1"],
      reply:
        "📦 Hamari services:\n- Service A\n- Service B\n- Service C\n\nMore info ke liye humari website dekhein ya '4' likh kar humari team se baat karein.",
    },
    {
      keywords: ["2"],
      reply: "💰 Pricing:\n- Package A: Rs. XXXX\n- Package B: Rs. XXXX\n\nCustom quote chahiye to '4' likhein.",
    },
    {
      keywords: ["3"],
      reply: "📍 Order status check karne ke liye apna Order ID bhejein (jaise: ORD12345).",
    },
    {
      keywords: ["4"],
      reply: "🙋 Theek hai! Hamari team jaldi aapse raabta karegi. Iss dauran, apna naam aur query yahan likh dein.",
    },
    {
      keywords: ["thanks", "shukriya", "thank you"],
      reply: "Aapka shukriya! 😊 Kisi aur madad ke liye 'hi' likh kar menu dobara dekh sakte hain.",
    },
  ];

  for (const rule of rules) {
    if (rule.keywords.some((k) => text.includes(k))) {
      return rule.reply;
    }
  }

  // ---- Koi rule match na ho to yeh default jawab ----
  return (
    "Maazrat, mujhe yeh samajh nahi aaya. 🙏\n" +
    "Menu dekhne ke liye 'hi' likh kar bhejein."
  );
}

// =====================================================
// 4) WHATSAPP PAR MESSAGE BHEJNA
// =====================================================
async function sendWhatsAppMessage(to, text) {
  await axios.post(
    `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: to,
      type: "text",
      text: { body: text },
    },
    {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
}

// =====================================================
// SERVER START
// =====================================================
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => res.send("WhatsApp bot is running ✅"));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
