import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../core/api/partner_repository.dart';
import '../../shared/models/partner_models.dart';
import '../../shared/widgets/async_state_view.dart';
import '../../shared/widgets/status_pill.dart';

final servicesProvider = FutureProvider<List<PartnerService>>(
  (ref) => ref.watch(partnerRepositoryProvider).services(),
);

class ChaletsPage extends ConsumerStatefulWidget {
  const ChaletsPage({super.key});

  @override
  ConsumerState<ChaletsPage> createState() => _ChaletsPageState();
}

class _ChaletsPageState extends ConsumerState<ChaletsPage> {
  final _search = TextEditingController();
  String _status = 'all';

  @override
  Widget build(BuildContext context) {
    return AsyncStateView(
      value: ref.watch(servicesProvider),
      data: (services) {
        final query = _search.text.trim();
        final filtered = services.where((service) {
          final matchesSearch =
              query.isEmpty ||
              '${service.title} ${service.city} ${service.serviceType}'
                  .contains(query);
          final matchesStatus = _status == 'all' || service.status == _status;
          return matchesSearch && matchesStatus;
        }).toList();

        return RefreshIndicator(
          onRefresh: () => ref.refresh(servicesProvider.future),
          child: ListView(
            padding: const EdgeInsets.all(20),
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      'الشاليهات والخدمات',
                      style: Theme.of(context).textTheme.headlineSmall
                          ?.copyWith(fontWeight: FontWeight.w900),
                    ),
                  ),
                  IconButton.filled(
                    onPressed: () => _showCreateService(context, ref),
                    icon: const Icon(LucideIcons.plus),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              TextField(
                controller: _search,
                onChanged: (_) => setState(() {}),
                decoration: const InputDecoration(
                  prefixIcon: Icon(LucideIcons.search),
                  labelText: 'ابحث بالاسم أو المدينة أو النوع',
                ),
              ),
              const SizedBox(height: 10),
              SegmentedButton<String>(
                selected: {_status},
                onSelectionChanged: (value) =>
                    setState(() => _status = value.first),
                segments: const [
                  ButtonSegment(value: 'all', label: Text('الكل')),
                  ButtonSegment(value: 'published', label: Text('منشور')),
                  ButtonSegment(value: 'draft', label: Text('مسودة')),
                  ButtonSegment(value: 'paused', label: Text('متوقف')),
                ],
              ),
              const SizedBox(height: 14),
              if (filtered.isEmpty)
                const Card(
                  child: ListTile(
                    leading: Icon(LucideIcons.inbox),
                    title: Text('لا توجد خدمات مطابقة'),
                    subtitle: Text('جرّب تغيير البحث أو أضف خدمة جديدة.'),
                  ),
                ),
              for (final service in filtered)
                Card(
                  child: ListTile(
                    leading: const Icon(LucideIcons.home),
                    title: Text(
                      service.title,
                      style: const TextStyle(fontWeight: FontWeight.w800),
                    ),
                    subtitle: Text(
                      '${service.serviceType} · ${service.city} · ${service.basePrice.toStringAsFixed(0)} ر.س',
                    ),
                    trailing: StatusPill(service.status),
                  ),
                ),
            ],
          ),
        );
      },
    );
  }

  @override
  void dispose() {
    _search.dispose();
    super.dispose();
  }

  Future<void> _showCreateService(BuildContext context, WidgetRef ref) async {
    final title = TextEditingController();
    final city = TextEditingController();
    final price = TextEditingController(text: '0');
    String type = 'homes';
    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      builder: (context) => Padding(
        padding: EdgeInsets.fromLTRB(
          20,
          20,
          20,
          MediaQuery.of(context).viewInsets.bottom + 20,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'إضافة خدمة',
              style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: title,
              decoration: const InputDecoration(labelText: 'الاسم'),
            ),
            const SizedBox(height: 10),
            DropdownButtonFormField(
              value: type,
              decoration: const InputDecoration(labelText: 'النوع'),
              items: const [
                DropdownMenuItem(value: 'homes', child: Text('شاليهات وفلل')),
                DropdownMenuItem(value: 'hotels', child: Text('فنادق')),
                DropdownMenuItem(value: 'events', child: Text('فعاليات')),
                DropdownMenuItem(value: 'conferences', child: Text('مؤتمرات')),
                DropdownMenuItem(value: 'parties', child: Text('حفلات')),
                DropdownMenuItem(value: 'experiences', child: Text('تجارب')),
              ],
              onChanged: (value) => type = value ?? 'homes',
            ),
            const SizedBox(height: 10),
            TextField(
              controller: city,
              decoration: const InputDecoration(labelText: 'المدينة'),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: price,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'السعر الأساسي'),
            ),
            const SizedBox(height: 16),
            FilledButton(
              onPressed: () async {
                await ref.read(partnerRepositoryProvider).createService({
                  'title': title.text,
                  'serviceType': type,
                  'city': city.text,
                  'basePrice': double.tryParse(price.text) ?? 0,
                  'status': 'draft',
                });
                ref.invalidate(servicesProvider);
                if (context.mounted) Navigator.pop(context);
              },
              child: const Text('حفظ'),
            ),
          ],
        ),
      ),
    );
  }
}
