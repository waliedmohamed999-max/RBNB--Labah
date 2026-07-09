import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/auth/permission_controller.dart';
import '../../shared/widgets/async_state_view.dart';

class ProfilePage extends ConsumerWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return AsyncStateView(
      value: ref.watch(partnerProfileProvider),
      data: (profile) => ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text(
            'الملف الشخصي',
            style: Theme.of(
              context,
            ).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w900),
          ),
          const SizedBox(height: 20),
          Card(
            child: ListTile(
              title: const Text('اسم المنشأة'),
              subtitle: Text(profile.companyName),
            ),
          ),
          Card(
            child: ListTile(
              title: const Text('المسؤول'),
              subtitle: Text(profile.managerName),
            ),
          ),
          Card(
            child: ListTile(
              title: const Text('المدينة'),
              subtitle: Text(profile.city),
            ),
          ),
          Card(
            child: ListTile(
              title: const Text('الرصيد'),
              subtitle: Text('${profile.balance.toStringAsFixed(0)} ر.س'),
            ),
          ),
          Card(
            child: ListTile(
              title: const Text('أنواع الخدمات'),
              subtitle: Text(
                profile.serviceTypes.isEmpty
                    ? 'غير محدد'
                    : profile.serviceTypes.join(', '),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
