# دليل نشر تطبيق Laravel (public_html) على استضافة Hostinger المشتركة

هذا الدليل موجّه لأي شخص حتى لو مش مبرمج. اتبع الخطوات بالترتيب بالظبط، من غير ما تتخطى خطوة. كل أمر مكتوب بالكامل وجاهز للنسخ.

**قبل ما تبدأ، لازم يكون عندك جاهز:**
- حساب Hostinger مفعّل، ودومين مربوط بيه (أو هتربطه لاحقًا).
- ملف الحزمة: `labayh-public_html-hostinger-deploy.zip` (~478 ميجا) — الموجود عندك على جهازك.
- صلاحية SSH/Terminal مفعّلة على حسابك (أغلب خطط Hostinger Business/Premium بتوفرها من لوحة hPanel تحت "Advanced" → "SSH Access". لو خطتك ماعندهاش الخيار ده، كلّم دعم Hostinger لتفعيله — بعض الخطوات هنا محتاجة SSH).

---

## القسم 1: رفع وفك ضغط الحزمة عبر hPanel File Manager

1. سجّل دخول لـ **hPanel** → اختر الموقع (Website) بتاعك → **File Manager**.
2. من الشجرة على اليسار، روح لمجلد **الجذر (home)** — يعني المجلد اللي **فوق** `public_html/` مباشرة (مش جواه).
3. اضغط **Upload** وارفع ملف `labayh-public_html-hostinger-deploy.zip`. الرفع هياخد وقت (~478 ميجا) — سيبه لحد ما يخلص كامل.
4. بعد ما يخلص الرفع، اعمل كليك يمين على الملف → **Extract** (فك الضغط). هيتكوّن مجلد جديد اسمه `labayh-public_html-hostinger-deploy` فيه مجلدين جواه: `laravel_app` و `public_html_docroot`.
5. **انقل** مجلد `laravel_app` من جوه `labayh-public_html-hostinger-deploy/` لبرّه، عشان يبقى **مجاور** لـ `public_html/` مباشرة (نفس المستوى، مش جواها). يعني هيبقى عندك:
   ```
   home/
   ├── laravel_app/          ← لسه هنا
   └── public_html/          ← موجود بالفعل من Hostinger
   ```
6. افتح مجلد `public_html_docroot/` (لسه جوه مجلد فك الضغط)، وحدد **كل المحتويات اللي جواه** (مش المجلد نفسه) وانقلها **جوه** `public_html/` الموجود بالفعل — هتستبدل أي ملفات افتراضية Hostinger حطّتها هناك (زي `index.html` الترحيبية).
7. بعد ما تتأكد إن النقل خلص صح، امسح مجلد `labayh-public_html-hostinger-deploy/` الفاضي وملف الـ zip نفسه (مش محتاجهم تاني).

**تأكد بعد الخطوة دي إن الشكل بقى كده بالظبط:**
```
home/
├── laravel_app/
│   ├── app/  bootstrap/  config/  database/  resources/  routes/  storage/  vendor/
│   ├── artisan  awebooking.php  composer.json  composer.lock
│   └── public/
└── public_html/
    ├── index.php   (النسخة المعدّلة، مش الافتراضية)
    ├── .htaccess
    ├── css/  js/  images/  fonts/  assets/  caching/  API/  vendor/ ...
```

---

## القسم 2: إنشاء قاعدة بيانات MySQL عبر hPanel

1. من hPanel → **Databases** → **MySQL Databases**.
2. اعمل قاعدة بيانات جديدة (هتاخد اسم تلقائي زي `u123456789_labayh`).
3. اعمل مستخدم MySQL جديد بكلمة مرور قوية (أو استخدم الافتراضي)، واربطه بالقاعدة بصلاحيات **All Privileges**.
4. **احفظ الثلاثة قيم دول جنب بعض** — هتحتاجهم في القسم الجاي:
   - اسم القاعدة (Database name)
   - اسم المستخدم (Username)
   - كلمة المرور (Password)

---

## القسم 3: تعبئة ملف `.env` الحقيقي

1. في File Manager، افتح `laravel_app/` — هتلاقي ملف اسمه `.env.production` (لو مش ظاهر، فعّل "Show Hidden Files" من إعدادات File Manager).
2. اعمل نسخة منه بنفس المكان، وسمّيها بالظبط `.env` (بدون أي امتداد بعدها).
3. افتح `.env` الجديد بالمحرر (Edit)، واملأ القيم دي **بالتحديد** (باقي القيم متسيبهاش زي ما هي):

| المتغير | تحطّ فيه |
|---|---|
| `APP_URL` | رابط موقعك الفعلي (مثال: `https://labayh.sa`) |
| `PREMIUM_FRONTEND_URL` | رابط الفرونت إند (Next.js) في بيئة الإنتاج الحقيقية — **مش** localhost ومش hogzat.vercel.app (ده staging) |
| `DB_HOST` | عادة `localhost` على Hostinger (تأكد من القيمة الصح في صفحة MySQL Databases بـ hPanel) |
| `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` | القيم اللي حفظتها في القسم 2 |
| `MAIL_HOST`, `MAIL_USERNAME`, `MAIL_PASSWORD` | بيانات SMTP حقيقية (بريد Hostinger بتاعك، أو خدمة زي SendGrid) — مش Mailtrap التجريبي |
| `TADAWL_SMS_API_KEY` | مفتاح **جديد** من TADAWL.SA (بعد ما تكون لغيت/دوّرت القديم المسرّب معاهم) |
| `LEGACY_API_JWT_SECRET` | قيمة عشوائية جديدة 32+ حرف — ولّدها بالأمر في القسم 4 خطوة 3 |

4. سيب `APP_KEY` فاضي دلوقتي — هنولده بأمر في القسم الجاي.

---

## القسم 4: الأوامر عبر SSH/Terminal

افتح Terminal من hPanel (**Advanced** → **SSH Access**، أو أي عميل SSH زي PuTTY بنفس بيانات hPanel)، وادخل على حسابك، بعدين نفّذ الأوامر دي **بالترتيب بالظبط**:

```bash
cd ~/laravel_app
```

**1) ولّد مفتاح التطبيق (`APP_KEY`):**
```bash
php artisan key:generate --force
```

**2) ولّد قيمة `LEGACY_API_JWT_SECRET` (لو لسه محطتهاش في `.env`):**
```bash
php -r "echo bin2hex(random_bytes(32));"
```
انسخ الناتج والصقه في `.env` قدام `LEGACY_API_JWT_SECRET=`.

**3) اعمل رابط تخزين الملفات (`storage` symlink):**
```bash
cd ~/public_html
rm -f storage
ln -s ../laravel_app/storage/app/public storage
cd ~/laravel_app
```

**4) صلاحيات الكتابة المطلوبة:**
```bash
chmod -R 775 storage bootstrap/cache
```

**5) قاعدة البيانات — اختار مسار واحد بس حسب حالتك:**

- **لو بتنقل الموقع الحالي بكل بياناته** (الاحتمال الأرجح، بما إن الموقع ده فيه بيانات ومستخدمين حقيقيين بالفعل): صدّر قاعدة البيانات المحلية بتاعتك (عبر phpMyAdmin → Export، أو `mysqldump`) واستوردها في قاعدة بيانات Hostinger اللي عملتها بالقسم 2 (عبر phpMyAdmin بتاع Hostinger → Import). في الحالة دي **متشغّلش** أمر `migrate` تحت، عشان البيانات والجداول أصلاً موجودة في النسخة المستوردة.
- **لو موقع جديد فاضي من غير بيانات سابقة:** شغّل:
  ```bash
  php artisan migrate --force
  ```

**6) فعّل الكاش (بعد ما `.env` يبقى فيه القيم الحقيقية):**
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## القسم 5: جدولة المهام (Cron Job)

1. من hPanel → **Advanced** → **Cron Jobs**.
2. أنشئ Cron Job جديدة بتردد **كل دقيقة** (Every Minute)، والأمر:
   ```
   /usr/bin/php /home/YOUR_USERNAME/laravel_app/artisan schedule:run >> /dev/null 2>&1
   ```
   استبدل `YOUR_USERNAME` باسم حسابك الفعلي على Hostinger (تلاقيه في أعلى لوحة hPanel، أو في مسار File Manager). لو مسار `php` مختلف عندك، هتلاقيه في نفس صفحة Cron Jobs من قائمة منسدلة.

---

## القسم 6: اختبار سريع (Smoke Test)

بعد ما تخلص كل اللي فوق، افتح المتصفح وجرّب:

1. `https://YOUR_DOMAIN/bridge/v1/products` — المفروض يرجع بيانات JSON (مش خطأ 500 أو صفحة بيضاء).
2. `https://YOUR_DOMAIN/` (بدون أي مسار بعدها) — المفروض يحوّلك تلقائيًا لرابط الفرونت إند (`PREMIUM_FRONTEND_URL`) اللي حطيته في `.env`.
3. جرّب تسجيل دخول حقيقي من الداشبورد وتتأكد إن الجلسة بتشتغل.

---

## جدول الأخطاء الشائعة

| الخطأ | السبب الأرجح | الحل |
|---|---|---|
| **500 Internal Server Error** | صلاحيات `storage/`/`bootstrap/cache/` ناقصة، أو `.env` فيه خطأ | نفّذ `chmod -R 775 storage bootstrap/cache` تاني، وراجع كل قيمة في `.env` |
| **صفحة بيضاء تمامًا (بدون أي رسالة)** | `APP_DEBUG=false` بيخفي رسالة الخطأ الحقيقية | غيّر مؤقتًا `APP_DEBUG=true` في `.env`، حدّث الصفحة، شوف الخطأ، **بعدين رجّعها `false` فورًا** |
| **"could not find driver" أو خطأ اتصال قاعدة بيانات** | بيانات `DB_HOST`/`DB_DATABASE`/`DB_USERNAME`/`DB_PASSWORD` غلط | راجعهم من صفحة MySQL Databases بـ hPanel |
| **Permission denied عند تشغيل أمر artisan** | صلاحيات الملفات | تأكد إنك داخل بنفس المستخدم اللي بيملك الملفات (حساب Hostinger بتاعك، مش root) |
| **الصور/الملفات المرفوعة مش ظاهرة (404)** | رابط `storage` symlink مش متعمول صح | راجع خطوة 3 في القسم 4، وتأكد إن `public_html/storage` رابط فعلي مش مجلد فاضي |
| **`LEGACY_API_JWT_SECRET is not configured` (خطأ 500 من تطبيق الموبايل تحديدًا)** | نسيت تحط قيمة `LEGACY_API_JWT_SECRET` في `.env` | ارجع للقسم 4 خطوة 2 |
| **صفحة "This site can't be reached"** | الدومين مش متربط صح، أو DNS لسه بيتأكد (ممكن ياخد لحد 24 ساعة) | تأكد من إعدادات DNS في hPanel |
| **كل الصفحات بترجع 404** | مسار `laravel_app/` مسمّى غلط أو في مكان غلط | راجع القسم 1 خطوة 5 — لازم يكون مجاور لـ `public_html/` بالظبط، وباسم `laravel_app` (لو سمّيته حاجة تانية، لازم تعدّل `public_html/index.php` — راجع تعليق أعلى الملف) |

---

## حاجات لازم قرارك الشخصي فيها (مش تقنية)

1. **اسم الدومين النهائي** اللي هيتربط بالموقع — محتاج تحدده وتحطه في `APP_URL` و`PREMIUM_FRONTEND_URL`.
2. **خطة Hostinger بالتحديد** (Business / Premium / Cloud) — أثرت على توفر SSH Access من عدمه؛ تأكد إن خطتك فيها الخيار ده قبل ما تبدأ القسم 4.
3. **مسار البيانات**: هل ده نقل للموقع الحالي بكل بياناته الحقيقية (الاحتمال الأرجح)، أو نسخة جديدة فاضية؟ ده بيحدد أي مسار تاخده في القسم 4 خطوة 5.
4. **خدمة SMTP للبريد** — مين المزوّد اللي هتستخدمه فعليًا في الإنتاج (بريد Hostinger نفسه، أو خدمة خارجية)؟
