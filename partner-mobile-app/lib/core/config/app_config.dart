import 'package:flutter/foundation.dart';

class AppConfig {
  static const _partnerApiUrl = String.fromEnvironment(
    'PARTNER_API_URL',
    defaultValue: 'http://localhost:4100',
  );

  static String get partnerApiUrl {
    final uri = Uri.parse(_partnerApiUrl);
    final isLocalHost = uri.host == 'localhost' || uri.host == '127.0.0.1' || uri.host == '10.0.2.2';
    if (kReleaseMode && isLocalHost) {
      throw StateError('PARTNER_API_URL must point to a production HTTPS host in release builds.');
    }
    return _partnerApiUrl;
  }
}
