import cors from "cors";
import express from "express";
import helmet from "helmet";
import { config } from "./config.js";
import { errorHandler } from "./http.js";
import { logger } from "./logger.js";
import { adminRouter } from "./modules/admin.routes.js";
import { authRouter } from "./modules/auth.routes.js";
import { bookingsRouter } from "./modules/bookings.routes.js";
import { invoicesRouter } from "./modules/invoices.routes.js";
import { partnerRouter } from "./modules/partner.routes.js";
import { servicesRouter } from "./modules/services.routes.js";

const app = express();

app.use(helmet());
app.use(cors({
  origin: (requestOrigin, callback) => {
    if (typeof requestOrigin !== 'string') {
      callback(null, true);
      return;
    }

    const isLocalhost = /^https?:\/\/localhost(:\d+)?$/.test(requestOrigin);
    if (isLocalhost || requestOrigin === config.frontendOrigin) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: "256kb" }));
app.use(express.urlencoded({ extended: false }));

app.get("/", (_request, response) => {
  response.type("html").send(`<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Partner API</title>
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: #f7f8fb;
        color: #0f172a;
        font-family: "Segoe UI", Tahoma, Arial, sans-serif;
      }
      main {
        width: min(680px, calc(100% - 32px));
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        background: #fff;
        padding: 28px;
        box-shadow: 0 24px 70px -48px rgba(15, 23, 42, 0.55);
      }
      h1 { margin: 0 0 10px; font-size: 28px; }
      p { margin: 0 0 18px; color: #64748b; line-height: 1.8; }
      a {
        display: inline-flex;
        margin: 6px 0 0 8px;
        border-radius: 8px;
        background: #ff385c;
        color: #fff;
        padding: 10px 14px;
        text-decoration: none;
        font-weight: 700;
      }
      code {
        display: block;
        border-radius: 8px;
        background: #0f172a;
        color: #fff;
        padding: 12px;
        direction: ltr;
        text-align: left;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Partner API يعمل بنجاح</h1>
      <p>هذا السيرفر خاص بالـ API فقط. واجهة النظام تعمل من خلال Next.js على المنفذ 3000.</p>
      <a href="http://localhost:3000/partners/register">تسجيل الشركاء</a>
      <a href="http://localhost:3000/partner-dashboard">داشبورد الشريك</a>
      <p style="margin-top:18px">فحص الخدمة:</p>
      <code>GET http://localhost:4100/health</code>
    </main>
  </body>
</html>`);
});

app.get("/health", (_request, response) => {
  response.json({ ok: true, service: "partner-api" });
});

app.use("/auth", authRouter);
app.use("/partner", partnerRouter);
app.use("/bookings", bookingsRouter);
app.use("/services", servicesRouter);
app.use("/invoices", invoicesRouter);
app.use("/admin", adminRouter);
app.use(errorHandler);

app.listen(config.port, () => {
  logger.info("Partner API listening", { url: `http://localhost:${config.port}` });
});

