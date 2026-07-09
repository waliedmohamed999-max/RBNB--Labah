import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../shared/models/partner_models.dart';
import 'api_client.dart';

final partnerRepositoryProvider = Provider<PartnerRepository>((ref) {
  return PartnerRepository(ref.watch(dioProvider));
});

class PartnerRepository {
  PartnerRepository(this._dio);
  final Dio _dio;

  Future<PartnerSession> login(String email, String password) async {
    final response = await _dio.post(
      '/auth/login',
      data: {'email': email, 'password': password},
    );
    return PartnerSession.fromJson(
      Map<String, dynamic>.from(response.data['data'] as Map),
    );
  }

  Future<PartnerSession> refresh(String refreshToken) async {
    final response = await _dio.post(
      '/auth/refresh',
      data: {'refreshToken': refreshToken},
    );
    return PartnerSession.fromJson(
      Map<String, dynamic>.from(response.data['data'] as Map),
    );
  }

  Future<DashboardSummary> dashboard() async {
    final response = await _dio.get('/partner/dashboard');
    return DashboardSummary.fromJson(
      Map<String, dynamic>.from(response.data['data'] as Map),
    );
  }

  Future<PartnerProfile> me() async {
    final response = await _dio.get('/partner/me');
    return PartnerProfile.fromJson(
      Map<String, dynamic>.from(response.data['data'] as Map),
    );
  }

  Future<List<PartnerService>> services() async {
    final response = await _dio.get('/services');
    return (response.data['data'] as List)
        .map(
          (e) => PartnerService.fromJson(Map<String, dynamic>.from(e as Map)),
        )
        .toList();
  }

  Future<PartnerService> createService(Map<String, dynamic> payload) async {
    final response = await _dio.post('/services', data: payload);
    return PartnerService.fromJson(
      Map<String, dynamic>.from(response.data['data'] as Map),
    );
  }

  Future<List<PartnerBooking>> bookings() async {
    final response = await _dio.get('/bookings');
    return (response.data['data'] as List)
        .map(
          (e) => PartnerBooking.fromJson(Map<String, dynamic>.from(e as Map)),
        )
        .toList();
  }

  Future<PartnerBooking> createBooking(Map<String, dynamic> payload) async {
    final response = await _dio.post('/bookings', data: payload);
    return PartnerBooking.fromJson(
      Map<String, dynamic>.from(response.data['data'] as Map),
    );
  }

  Future<List<PartnerInvoice>> invoices() async {
    final response = await _dio.get('/invoices');
    return (response.data['data'] as List)
        .map(
          (e) => PartnerInvoice.fromJson(Map<String, dynamic>.from(e as Map)),
        )
        .toList();
  }

  Future<InvoiceDocument> invoiceDocument(String id) async {
    final response = await _dio.get('/invoices/$id/pdf');
    return InvoiceDocument.fromJson(
      Map<String, dynamic>.from(response.data['data'] as Map),
    );
  }
}
