class PartnerSession {
  const PartnerSession({
    required this.token,
    required this.refreshToken,
    required this.role,
  });
  final String token;
  final String refreshToken;
  final String role;

  factory PartnerSession.fromJson(Map<String, dynamic> json) {
    return PartnerSession(
      token: json['token'] as String,
      refreshToken: json['refreshToken']?.toString() ?? '',
      role: json['role'] as String,
    );
  }
}

class PartnerProfile {
  const PartnerProfile({
    required this.id,
    required this.companyName,
    required this.managerName,
    required this.city,
    required this.balance,
    required this.enabledFeatures,
    required this.permissions,
    required this.serviceTypes,
  });

  final String id;
  final String companyName;
  final String managerName;
  final String city;
  final double balance;
  final Map<String, dynamic> enabledFeatures;
  final Map<String, bool> permissions;
  final List<String> serviceTypes;

  factory PartnerProfile.fromJson(Map<String, dynamic> json) {
    return PartnerProfile(
      id: json['id']?.toString() ?? '',
      companyName: json['company_name']?.toString() ?? '',
      managerName: json['manager_name']?.toString() ?? '',
      city: json['city']?.toString() ?? '',
      balance: double.tryParse(json['balance']?.toString() ?? '0') ?? 0,
      enabledFeatures: Map<String, dynamic>.from(
        json['enabled_features'] as Map? ?? {},
      ),
      permissions: Map<String, bool>.from(json['permissions'] as Map? ?? {}),
      serviceTypes: (json['service_types'] as List? ?? const [])
          .map((e) => e.toString())
          .toList(),
    );
  }
}

class DashboardSummary {
  const DashboardSummary({
    required this.companyName,
    required this.balance,
    required this.bookingTotal,
    required this.bookingActive,
    required this.bookingCompleted,
    required this.servicesTotal,
    required this.servicesPublished,
    required this.invoicesTotal,
  });

  final String companyName;
  final double balance;
  final int bookingTotal;
  final int bookingActive;
  final int bookingCompleted;
  final int servicesTotal;
  final int servicesPublished;
  final double invoicesTotal;

  factory DashboardSummary.fromJson(Map<String, dynamic> json) {
    final bookings = Map<String, dynamic>.from(json['bookings'] as Map? ?? {});
    final services = Map<String, dynamic>.from(json['services'] as Map? ?? {});
    return DashboardSummary(
      companyName: json['companyName']?.toString() ?? '',
      balance: (json['balance'] as num? ?? 0).toDouble(),
      bookingTotal: (bookings['total'] as num? ?? 0).toInt(),
      bookingActive: (bookings['active'] as num? ?? 0).toInt(),
      bookingCompleted: (bookings['completed'] as num? ?? 0).toInt(),
      servicesTotal: (services['total'] as num? ?? 0).toInt(),
      servicesPublished: (services['published'] as num? ?? 0).toInt(),
      invoicesTotal: (json['invoicesTotal'] as num? ?? 0).toDouble(),
    );
  }
}

class PartnerService {
  const PartnerService({
    required this.id,
    required this.title,
    required this.serviceType,
    required this.city,
    required this.basePrice,
    required this.status,
  });

  final String id;
  final String title;
  final String serviceType;
  final String city;
  final double basePrice;
  final String status;

  factory PartnerService.fromJson(Map<String, dynamic> json) {
    return PartnerService(
      id: json['id']?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      serviceType: json['service_type']?.toString() ?? '',
      city: json['city']?.toString() ?? '',
      basePrice: double.tryParse(json['base_price']?.toString() ?? '0') ?? 0,
      status: json['status']?.toString() ?? 'draft',
    );
  }
}

class PartnerBooking {
  const PartnerBooking({
    required this.id,
    required this.bookingNumber,
    required this.guestName,
    required this.guestMobile,
    required this.city,
    required this.status,
    required this.totalAmount,
    this.startsAt,
    this.serviceTitle,
  });

  final String id;
  final String bookingNumber;
  final String guestName;
  final String guestMobile;
  final String city;
  final String status;
  final double totalAmount;
  final DateTime? startsAt;
  final String? serviceTitle;

  factory PartnerBooking.fromJson(Map<String, dynamic> json) {
    return PartnerBooking(
      id: json['id']?.toString() ?? '',
      bookingNumber: json['booking_number']?.toString() ?? '',
      guestName: json['guest_name']?.toString() ?? '',
      guestMobile: json['guest_mobile']?.toString() ?? '',
      city: json['city']?.toString() ?? '',
      status: json['status']?.toString() ?? 'pending',
      totalAmount:
          double.tryParse(json['total_amount']?.toString() ?? '0') ?? 0,
      startsAt: DateTime.tryParse(json['starts_at']?.toString() ?? ''),
      serviceTitle: json['service_title']?.toString(),
    );
  }
}

class PartnerInvoice {
  const PartnerInvoice({
    required this.id,
    required this.number,
    required this.amount,
    required this.status,
    this.issuedAt,
  });
  final String id;
  final String number;
  final double amount;
  final String status;
  final DateTime? issuedAt;

  factory PartnerInvoice.fromJson(Map<String, dynamic> json) {
    return PartnerInvoice(
      id: json['id']?.toString() ?? '',
      number: json['invoice_number']?.toString() ?? '',
      amount:
          double.tryParse(
            (json['amount'] ?? json['total_amount'])?.toString() ?? '0',
          ) ??
          0,
      status: json['status']?.toString() ?? 'unpaid',
      issuedAt: DateTime.tryParse(json['issued_at']?.toString() ?? ''),
    );
  }
}

class InvoiceDocument {
  const InvoiceDocument({
    required this.invoice,
    required this.format,
    required this.downloadUrl,
  });
  final PartnerInvoice invoice;
  final String format;
  final String downloadUrl;

  factory InvoiceDocument.fromJson(Map<String, dynamic> json) {
    final pdf = Map<String, dynamic>.from(json['pdf'] as Map? ?? {});
    return InvoiceDocument(
      invoice: PartnerInvoice.fromJson(
        Map<String, dynamic>.from(json['invoice'] as Map? ?? {}),
      ),
      format: pdf['format']?.toString() ?? 'PDF',
      downloadUrl: pdf['downloadUrl']?.toString() ?? '',
    );
  }
}
