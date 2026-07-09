# Labayh Partner Mobile App

تطبيق Flutter احترافي لإدارة الشركاء، مربوط مباشرة مع `partner-api` الحالي.

## التشغيل

```bash
cd partner-mobile-app
flutter pub get
flutter run --dart-define=PARTNER_API_URL=http://10.0.2.2:4100
```

على جهاز حقيقي داخل نفس الشبكة استخدم IP جهاز السيرفر بدل `10.0.2.2`.

## ما تم تجهيزه

- Clean modular structure مطابق للطلب.
- Riverpod لإدارة الحالة.
- Dio مع Bearer token interceptor.
- Secure Storage لحفظ الجلسة.
- واجهة عربية RTL مع دعم إنجليزي مهيأ.
- Bottom navigation و drawer ديناميكيان حسب الصلاحيات.
- شاشات مرتبطة بالـ API الحالي: login, dashboard, services, bookings, invoices/profile.
- شاشة gaps واضحة للأقسام التي تحتاج endpoints جديدة.

## ملاحظات مهمة

الـ Backend الحالي لا يوفّر refresh token ولا CRUD كامل للوحدات والحجوزات والعروض والمحتوى. التطبيق بني بحيث يعمل مع المتاح الآن، ويوثق النواقص في `docs/partner-api-documentation.md`.
