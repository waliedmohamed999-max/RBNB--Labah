import {
  BadgeCheck,
  Banknote,
  BedDouble,
  Building2,
  CalendarCheck2,
  CalendarPlus,
  FileCheck2,
  FileText,
  LockKeyhole,
  MapPin,
  PartyPopper,
  ReceiptText,
  Sparkles,
  TicketCheck,
  UserCog,
  UsersRound,
} from "lucide-react";

export const partnerPermissions = [
  {
    key: "create_service",
    label: "إضافة الخدمات",
    description: "السماح بإضافة شاليهات، فنادق، فعاليات، مؤتمرات، حفلات، وتجارب.",
    icon: CalendarPlus,
  },
  {
    key: "view_bookings",
    label: "عرض الحجوزات",
    description: "إظهار الحجوزات، الضيوف، المواعيد، وحالات الطلبات.",
    icon: CalendarCheck2,
  },
  {
    key: "view_invoices",
    label: "عرض الفواتير",
    description: "إظهار الفواتير وحالة الدفع والتحميل.",
    icon: ReceiptText,
  },
  {
    key: "manage_services",
    label: "إدارة المحتوى",
    description: "تعديل الصور والأسعار والتوفر وسياسات الخدمة.",
    icon: Sparkles,
  },
  {
    key: "manage_account",
    label: "إدارة الحساب",
    description: "السماح بتعديل بيانات الحساب وتغيير كلمة المرور.",
    icon: UserCog,
  },
] as const;

export const partnerStats = [
  { label: "كل الحجوزات", value: "1,248", hint: "منذ بداية الشهر", icon: TicketCheck },
  { label: "حجوزات جارية", value: "186", hint: "قيد التأكيد والتنفيذ", icon: CalendarCheck2 },
  { label: "الخدمات المنشورة", value: "74", hint: "شاليهات وفنادق وتجارب", icon: BedDouble },
  { label: "إجمالي الفواتير", value: "82,450 ر.س", hint: "قبل الضريبة", icon: FileText },
  { label: "الرصيد", value: "18,900 ر.س", hint: "متاح للسداد", icon: Banknote },
];

export const partnerBookings = [
  {
    id: "BK-24091",
    guest: "عبدالله السالم",
    service: "قاعة مؤتمرات النخبة",
    category: "فعاليات ومؤتمرات",
    city: "الرياض",
    status: "confirmed",
    amount: "2,450 ر.س",
  },
  {
    id: "BK-24090",
    guest: "شركة المدار",
    service: "تنسيق حفل خاص",
    category: "حفلات",
    city: "جدة",
    status: "pending",
    amount: "6,800 ر.س",
  },
  {
    id: "BK-24089",
    guest: "نورة القحطاني",
    service: "تجربة هايكنج جبلية",
    category: "تجارب مثيرة",
    city: "أبها",
    status: "completed",
    amount: "420 ر.س",
  },
  {
    id: "BK-24088",
    guest: "محمد الحربي",
    service: "جناح فندقي مطل",
    category: "فنادق",
    city: "الخبر",
    status: "checked_in",
    amount: "980 ر.س",
  },
];

export const partnerServices = [
  {
    id: "srv-001",
    title: "فيلا روز بمسبح خاص",
    type: "شاليهات وفلل",
    city: "الرياض",
    price: "1,250 ر.س",
    status: "published",
    bookings: 84,
  },
  {
    id: "srv-002",
    title: "جناح فندقي مطل",
    type: "فنادق",
    city: "الخبر",
    price: "980 ر.س",
    status: "published",
    bookings: 56,
  },
  {
    id: "srv-003",
    title: "قاعة مؤتمرات النخبة",
    type: "فعاليات ومؤتمرات",
    city: "الرياض",
    price: "2,450 ر.س",
    status: "published",
    bookings: 42,
  },
  {
    id: "srv-004",
    title: "تنسيق حفل خاص",
    type: "حفلات",
    city: "جدة",
    price: "6,800 ر.س",
    status: "review",
    bookings: 18,
  },
  {
    id: "srv-005",
    title: "تجربة هايكنج جبلية",
    type: "تجارب مثيرة",
    city: "أبها",
    price: "420 ر.س",
    status: "published",
    bookings: 121,
  },
];

export const partnerAds = [
  {
    id: "ad-001",
    title: "إعلان واجهة البحث",
    placement: "الصفحة الرئيسية",
    status: "active",
    clicks: 2840,
    budget: "3,500 ر.س",
  },
  {
    id: "ad-002",
    title: "تمييز خدمات المؤتمرات",
    placement: "نتائج الفعاليات",
    status: "scheduled",
    clicks: 0,
    budget: "1,200 ر.س",
  },
];

export const partnerInvoices = [
  { id: "INV-1044", period: "أبريل 2026", total: "42,800 ر.س", status: "paid" },
  { id: "INV-1043", period: "مارس 2026", total: "39,650 ر.س", status: "pending" },
  { id: "INV-1042", period: "فبراير 2026", total: "31,200 ر.س", status: "overdue" },
];

export const demoPartners = [
  {
    id: "ptr-001",
    slug: "montaja-rawafed",
    company: "منتجع روافد",
    manager: "سارة العتيبي",
    city: "الرياض",
    activity: "إقامات وفعاليات",
    status: "approved",
    monthlyBookings: 900,
    serviceTypes: ["شاليهات وفلل", "فعاليات ومؤتمرات"],
    cities: ["الرياض", "جدة", "الدمام"],
    logo: "ر",
    permissions: ["create_service", "view_bookings", "view_invoices", "manage_services", "manage_account"],
    packageId: "pro",
    approvalChecklist: ["identity_verified", "documents_verified", "package_assigned", "permissions_provisioned"],
  },
  {
    id: "ptr-002",
    slug: "madar-experiences",
    company: "مدار التجارب",
    manager: "محمد الحربي",
    city: "جدة",
    activity: "تجارب وحفلات",
    status: "pending",
    monthlyBookings: 450,
    serviceTypes: ["تجارب مثيرة", "حفلات"],
    cities: ["جدة", "مكة"],
    logo: "م",
    permissions: ["view_bookings", "manage_account"],
    packageId: "starter",
    approvalChecklist: ["identity_verified"],
  },
  {
    id: "ptr-003",
    slug: "buyoot-aldiyafa",
    company: "بيوت الضيافة",
    manager: "نورة القحطاني",
    city: "الخبر",
    activity: "فنادق وإقامات",
    status: "suspended",
    monthlyBookings: 120,
    serviceTypes: ["فنادق", "شاليهات وفلل"],
    cities: ["الخبر", "الدمام"],
    logo: "ب",
    permissions: ["view_bookings", "view_invoices", "manage_account"],
    packageId: "starter",
    approvalChecklist: ["identity_verified", "documents_verified"],
  },
];

export const partnerRequests = [
  {
    id: "req-101",
    company: "روابي الضيافة",
    manager: "عبدالعزيز المطيري",
    city: "الرياض",
    activity: "شاليهات وفلل",
    status: "pending",
    requestedPackageId: "growth",
    expectedBookings: 320,
    documents: ["سجل تجاري", "هوية المسؤول"],
    risk: "low",
    submittedAt: "2026-04-28",
  },
  {
    id: "req-102",
    company: "صناع اللحظة",
    manager: "هند الشمري",
    city: "جدة",
    activity: "حفلات وفعاليات",
    status: "pending",
    requestedPackageId: "pro",
    expectedBookings: 760,
    documents: ["سجل تجاري"],
    risk: "medium",
    submittedAt: "2026-04-30",
  },
  {
    id: "req-103",
    company: "مسارات المغامرة",
    manager: "فيصل القحطاني",
    city: "أبها",
    activity: "تجارب مثيرة",
    status: "info_requested",
    requestedPackageId: "starter",
    expectedBookings: 140,
    documents: ["هوية المسؤول"],
    risk: "low",
    submittedAt: "2026-05-01",
  },
];

export const partnerPackages = [
  {
    id: "starter",
    name: "الانطلاقة",
    price: "299 ر.س / شهر",
    commission: "14%",
    serviceLimit: 5,
    bookingLimit: 150,
    serviceTypes: ["شاليهات وفلل", "فنادق"],
    permissions: ["view_bookings", "view_invoices", "manage_account"],
    features: {
      ads: false,
      featuredPlacement: false,
      analytics: "basic",
      support: "standard",
    },
  },
  {
    id: "growth",
    name: "النمو",
    price: "699 ر.س / شهر",
    commission: "11%",
    serviceLimit: 25,
    bookingLimit: 700,
    serviceTypes: ["شاليهات وفلل", "فنادق", "فعاليات ومؤتمرات", "حفلات"],
    permissions: ["create_service", "view_bookings", "view_invoices", "manage_services", "manage_account"],
    features: {
      ads: true,
      featuredPlacement: true,
      analytics: "advanced",
      support: "priority",
    },
  },
  {
    id: "pro",
    name: "الاحتراف",
    price: "1,499 ر.س / شهر",
    commission: "8%",
    serviceLimit: 100,
    bookingLimit: 3000,
    serviceTypes: ["شاليهات وفلل", "فنادق", "فعاليات ومؤتمرات", "حفلات", "تجارب مثيرة"],
    permissions: ["create_service", "view_bookings", "view_invoices", "manage_services", "manage_account"],
    features: {
      ads: true,
      featuredPlacement: true,
      analytics: "enterprise",
      support: "dedicated",
    },
  },
];

export const provisioningSteps = [
  "تحويل الطلب إلى شريك",
  "ربط الباقة والصلاحيات",
  "فتح أقسام الخدمات المسموحة",
  "تفعيل الفواتير والرصيد",
  "إرسال رسالة الترحيب",
];

export const registrationSteps = [
  { label: "بيانات المنشأة", icon: Building2 },
  { label: "معلومات المسؤول", icon: UserCog },
  { label: "المستندات", icon: FileCheck2 },
  { label: "مراجعة الأدمن", icon: LockKeyhole },
];

export const availableCities = ["الرياض", "جدة", "الدمام", "الخبر", "مكة", "المدينة", "أبها"];
export const availableServiceTypes = ["شاليهات وفلل", "فنادق", "فعاليات ومؤتمرات", "حفلات", "تجارب مثيرة"];

export const partnerFeatureCards = [
  { label: "تسجيل بحالة Pending", icon: BadgeCheck },
  { label: "عزل بيانات الشركاء", icon: LockKeyhole },
  { label: "مدن وخدمات مخصصة", icon: MapPin },
  { label: "حجوزات وفواتير وتقارير", icon: UsersRound },
  { label: "فعاليات وتجارب وإقامات", icon: PartyPopper },
];
