# Labayh Partner API

Backend مستقل لإدارة شركاء الخدمات داخل المنصة: إقامات، فنادق، فعاليات، مؤتمرات، حفلات، وتجارب. التصميم مبني على Express + PostgreSQL + JWT مع RBAC وعزل بيانات كل شريك.

## التشغيل

```bash
cd partner-api
cp .env.example .env
npm install
npm run dev
```

نفذ `db/schema.sql` على قاعدة PostgreSQL قبل التشغيل.

لإنشاء أول حساب أدمن:

```bash
ADMIN_EMAIL=admin@labayh.local ADMIN_PASSWORD=<strong-password> npm run seed:admin
```

على Windows PowerShell:

```powershell
$env:ADMIN_EMAIL="admin@labayh.local"
$env:ADMIN_PASSWORD="<strong-password>"
npm run seed:admin
```


> ملاحظة: `<strong-password>` في الأمثلة مجرد placeholder عند إنشاء أدمن للـ Partner API. في نسخة Vercel الحالية يمكن دخول لوحة الموقع من `/auth/login` باستخدام: `admin@labayh.local` / `password` إلى أن يتم ربط Laravel/قاعدة البيانات الإنتاجية.
## أهم المسارات

- `POST /auth/register-partner`
  - ينشئ مستخدم بدور `partner` وحالة `pending`.
  - يدعم رفع `commercialRecord` و `identityDocument` كملفات اختيارية.
- `POST /auth/login`
  - يمنع دخول الشريك إذا لم تكن حالته `approved`.
  - يرجع `token` و `refreshToken` و `role`.
- `POST /auth/refresh`
  - يجدد الجلسة باستخدام `refreshToken`.
- `POST /auth/logout`
  - إنهاء جلسة العميل.
- `GET /partner/dashboard`
  - ملخص الحجوزات والخدمات والفواتير والرصيد للشريك الحالي فقط.
- `GET /bookings`
  - يتطلب `view_bookings`.
- `POST /bookings`
  - إنشاء حجز داخلي للشريك.
- `GET /services`
  - يتطلب `manage_services`.
- `POST /services`
  - يتطلب `create_service`.
- `GET /invoices`
  - يتطلب `view_invoices`.
- `GET /admin/partners`
  - للأدمن فقط.
- `PATCH /admin/partners/:id/status`
  - موافقة، رفض، إيقاف، أو تفعيل.
- `GET /admin/packages`
  - عرض باقات الشركاء وما تحتويه من صلاحيات ومزايا.
- `POST /admin/packages`
  - إنشاء أو تحديث باقة سعرية وصلاحياتها وأقسام الخدمات المفتوحة.
- `PUT /admin/partners/:id/package`
  - ربط الشريك بباقة، ونسخ صلاحيات الباقة وإعداداتها للشريك.
- `PUT /admin/partners/:id/permissions`
  - تحديث صلاحيات الشريك، المدن، أنواع الخدمات، وقواعد العمولة.

## الأمان

- JWT مع `Authorization: Bearer <token>`.
- Refresh token مخصص لتطبيقات الموبايل مع منع استخدامه كـ Bearer access token.
- تحقق Zod لكل مدخلات JSON.
- رفع ملفات محدود بالحجم والنوع: PDF/JPG/PNG/WEBP بحد 5MB.
- كل استعلامات الشريك مربوطة بـ `partner_id` من التوكن.
- كلمات المرور مخزنة بـ bcrypt.
- Helmet و CORS بإعداد مصدر واجهة محدد.

## ملاحظات الربط

الواجهة الحالية تحتوي صفحات جاهزة:

- `/partners/register`
- `/partner-dashboard`
- `/partner-dashboard/bookings`
- `/partner-dashboard/services`
- `/partner-dashboard/ads`
- `/partner-dashboard/invoices`
- `/partner-dashboard/account`
- `/dashboard/partners`

يمكن ربطها مباشرة بهذا الـ API عبر `PARTNER_API_URL`.
