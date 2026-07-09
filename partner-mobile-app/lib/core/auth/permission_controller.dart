import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../shared/models/partner_models.dart';
import '../api/partner_repository.dart';

final partnerProfileProvider = FutureProvider<PartnerProfile>((ref) {
  return ref.watch(partnerRepositoryProvider).me();
});

final partnerPermissionsProvider = FutureProvider<Set<String>>((ref) async {
  final profile = await ref.watch(partnerProfileProvider.future);
  final features = profile.enabledFeatures;
  final permissions = <String>{'home'};
  if (profile.permissions['view_bookings'] == true) permissions.add('bookings');
  if (profile.permissions['manage_services'] == true)
    permissions.add('services');
  if (profile.permissions['view_invoices'] == true) permissions.add('payments');
  if (profile.permissions['manage_account'] == true) permissions.add('profile');
  if (features['ads'] == true) permissions.add('ads');
  return permissions;
});
