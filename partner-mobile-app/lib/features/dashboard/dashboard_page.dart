import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../core/api/partner_repository.dart';
import '../../shared/models/partner_models.dart';
import '../../shared/widgets/async_state_view.dart';

final dashboardProvider = FutureProvider<DashboardSummary>(
  (ref) => ref.watch(partnerRepositoryProvider).dashboard(),
);

class DashboardPage extends ConsumerWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return AsyncStateView(
      value: ref.watch(dashboardProvider),
      data: (summary) => RefreshIndicator(
        onRefresh: () => ref.refresh(dashboardProvider.future),
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            Text(
              'مرحبًا، ${summary.companyName}',
              style: Theme.of(
                context,
              ).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w900),
            ),
            const SizedBox(height: 6),
            const Text('نظرة تشغيلية مختصرة على أداء الشريك اليوم'),
            const SizedBox(height: 20),
            GridView.count(
              crossAxisCount: 2,
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              childAspectRatio: 1.25,
              children: [
                _Metric(
                  icon: LucideIcons.calendarCheck,
                  label: 'الحجوزات',
                  value: '${summary.bookingTotal}',
                ),
                _Metric(
                  icon: LucideIcons.badgeDollarSign,
                  label: 'الأرباح',
                  value: '${summary.balance.toStringAsFixed(0)} ر.س',
                ),
                _Metric(
                  icon: LucideIcons.home,
                  label: 'الخدمات',
                  value: '${summary.servicesTotal}',
                ),
                _Metric(
                  icon: LucideIcons.fileText,
                  label: 'الفواتير',
                  value: '${summary.invoicesTotal.toStringAsFixed(0)} ر.س',
                ),
              ],
            ),
            const SizedBox(height: 20),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(18),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Latest Activity',
                      style: TextStyle(
                        fontWeight: FontWeight.w900,
                        fontSize: 18,
                      ),
                    ),
                    const SizedBox(height: 12),
                    _Activity('حجوزات نشطة', '${summary.bookingActive}'),
                    _Activity('حجوزات مكتملة', '${summary.bookingCompleted}'),
                    _Activity('خدمات منشورة', '${summary.servicesPublished}'),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Metric extends StatelessWidget {
  const _Metric({required this.icon, required this.label, required this.value});
  final IconData icon;
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: Theme.of(context).colorScheme.primary),
            const Spacer(),
            Text(label, style: Theme.of(context).textTheme.labelLarge),
            Text(
              value,
              style: Theme.of(
                context,
              ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w900),
            ),
          ],
        ),
      ),
    );
  }
}

class _Activity extends StatelessWidget {
  const _Activity(this.label, this.value);
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: EdgeInsets.zero,
      title: Text(label),
      trailing: Text(
        value,
        style: const TextStyle(fontWeight: FontWeight.w900),
      ),
    );
  }
}
