import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../core/api/partner_repository.dart';
import '../../shared/models/partner_models.dart';
import '../../shared/widgets/async_state_view.dart';
import '../../shared/widgets/status_pill.dart';
import '../chalets/chalets_page.dart';
import '../dashboard/dashboard_page.dart';

final bookingsProvider = FutureProvider<List<PartnerBooking>>(
  (ref) => ref.watch(partnerRepositoryProvider).bookings(),
);

class BookingsPage extends ConsumerStatefulWidget {
  const BookingsPage({super.key});

  @override
  ConsumerState<BookingsPage> createState() => _BookingsPageState();
}

class _BookingsPageState extends ConsumerState<BookingsPage> {
  final _search = TextEditingController();
  String _status = 'all';

  @override
  Widget build(BuildContext context) {
    return AsyncStateView(
      value: ref.watch(bookingsProvider),
      data: (bookings) {
        final query = _search.text.trim();
        final filtered = bookings.where((booking) {
          final text =
              '${booking.bookingNumber} ${booking.guestName} ${booking.guestMobile} ${booking.city}';
          final matchesSearch = query.isEmpty || text.contains(query);
          final matchesStatus = _status == 'all' || booking.status == _status;
          return matchesSearch && matchesStatus;
        }).toList();

        return RefreshIndicator(
          onRefresh: () => ref.refresh(bookingsProvider.future),
          child: ListView(
            padding: const EdgeInsets.all(20),
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      'الحجوزات',
                      style: Theme.of(context).textTheme.headlineSmall
                          ?.copyWith(fontWeight: FontWeight.w900),
                    ),
                  ),
                  IconButton.filled(
                    onPressed: () => _showCreateBooking(context),
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
                  labelText: 'ابحث برقم الحجز أو الضيف أو الجوال',
                ),
              ),
              const SizedBox(height: 10),
              SegmentedButton<String>(
                selected: {_status},
                onSelectionChanged: (value) =>
                    setState(() => _status = value.first),
                segments: const [
                  ButtonSegment(value: 'all', label: Text('الكل')),
                  ButtonSegment(value: 'pending', label: Text('معلق')),
                  ButtonSegment(value: 'confirmed', label: Text('مؤكد')),
                  ButtonSegment(value: 'completed', label: Text('مكتمل')),
                ],
              ),
              const SizedBox(height: 14),
              if (filtered.isEmpty)
                const Card(
                  child: ListTile(
                    leading: Icon(LucideIcons.inbox),
                    title: Text('لا توجد حجوزات مطابقة'),
                    subtitle: Text('أضف حجزا داخليا أو عدل الفلاتر.'),
                  ),
                ),
              for (final booking in filtered)
                Card(
                  child: ListTile(
                    leading: const Icon(LucideIcons.calendarCheck),
                    title: Text(
                      booking.bookingNumber,
                      style: const TextStyle(fontWeight: FontWeight.w900),
                    ),
                    subtitle: Text(
                      '${booking.guestName} - ${booking.serviceTitle ?? 'بدون خدمة'} - ${booking.city}',
                    ),
                    trailing: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        StatusPill(booking.status),
                        const SizedBox(height: 4),
                        Text('${booking.totalAmount.toStringAsFixed(0)} ر.س'),
                      ],
                    ),
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

  Future<void> _showCreateBooking(BuildContext context) async {
    final guestName = TextEditingController();
    final guestMobile = TextEditingController();
    final city = TextEditingController();
    final amount = TextEditingController(text: '0');
    String? serviceId;

    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      builder: (context) {
        final services =
            ref.watch(servicesProvider).valueOrNull ?? const <PartnerService>[];
        return Padding(
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
                'إضافة حجز داخلي',
                style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18),
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<String?>(
                value: serviceId,
                decoration: const InputDecoration(labelText: 'الخدمة'),
                items: [
                  const DropdownMenuItem<String?>(
                    value: null,
                    child: Text('بدون خدمة محددة'),
                  ),
                  for (final service in services)
                    DropdownMenuItem<String?>(
                      value: service.id,
                      child: Text(service.title),
                    ),
                ],
                onChanged: (value) => serviceId = value,
              ),
              const SizedBox(height: 10),
              TextField(
                controller: guestName,
                decoration: const InputDecoration(labelText: 'اسم الضيف'),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: guestMobile,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(labelText: 'جوال الضيف'),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: city,
                decoration: const InputDecoration(labelText: 'المدينة'),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: amount,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: 'الإجمالي'),
              ),
              const SizedBox(height: 16),
              FilledButton(
                onPressed: () async {
                  await ref.read(partnerRepositoryProvider).createBooking({
                    if (serviceId != null) 'serviceId': serviceId,
                    'guestName': guestName.text,
                    'guestMobile': guestMobile.text,
                    'city': city.text,
                    'totalAmount': double.tryParse(amount.text) ?? 0,
                  });
                  ref.invalidate(bookingsProvider);
                  ref.invalidate(dashboardProvider);
                  if (context.mounted) Navigator.pop(context);
                },
                child: const Text('حفظ الحجز'),
              ),
            ],
          ),
        );
      },
    );
  }
}
