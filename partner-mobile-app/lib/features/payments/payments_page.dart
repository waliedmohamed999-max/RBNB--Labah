import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../core/api/partner_repository.dart';
import '../../shared/models/partner_models.dart';
import '../../shared/widgets/async_state_view.dart';
import '../../shared/widgets/status_pill.dart';

final invoicesProvider = FutureProvider<List<PartnerInvoice>>(
  (ref) => ref.watch(partnerRepositoryProvider).invoices(),
);

class PaymentsPage extends ConsumerStatefulWidget {
  const PaymentsPage({super.key});

  @override
  ConsumerState<PaymentsPage> createState() => _PaymentsPageState();
}

class _PaymentsPageState extends ConsumerState<PaymentsPage> {
  String _status = 'all';

  @override
  Widget build(BuildContext context) {
    return AsyncStateView(
      value: ref.watch(invoicesProvider),
      data: (invoices) {
        final filtered = invoices
            .where((invoice) => _status == 'all' || invoice.status == _status)
            .toList();
        final total = filtered.fold<double>(
          0,
          (sum, invoice) => sum + invoice.amount,
        );

        return RefreshIndicator(
          onRefresh: () => ref.refresh(invoicesProvider.future),
          child: ListView(
            padding: const EdgeInsets.all(20),
            children: [
              Text(
                'المدفوعات والفواتير',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.w900,
                ),
              ),
              const SizedBox(height: 14),
              Card(
                child: ListTile(
                  leading: const Icon(LucideIcons.badgeDollarSign),
                  title: const Text('إجمالي الفواتير المعروضة'),
                  subtitle: Text('${total.toStringAsFixed(0)} ر.س'),
                ),
              ),
              const SizedBox(height: 10),
              SegmentedButton<String>(
                selected: {_status},
                onSelectionChanged: (value) =>
                    setState(() => _status = value.first),
                segments: const [
                  ButtonSegment(value: 'all', label: Text('الكل')),
                  ButtonSegment(value: 'paid', label: Text('مدفوعة')),
                  ButtonSegment(value: 'unpaid', label: Text('غير مدفوعة')),
                  ButtonSegment(value: 'overdue', label: Text('متأخرة')),
                ],
              ),
              const SizedBox(height: 14),
              if (filtered.isEmpty)
                const Card(
                  child: ListTile(
                    leading: Icon(LucideIcons.inbox),
                    title: Text('لا توجد فواتير مطابقة'),
                    subtitle: Text('غيّر الفلتر أو اسحب للتحديث.'),
                  ),
                ),
              for (final invoice in filtered)
                Card(
                  child: ListTile(
                    leading: const Icon(LucideIcons.receipt),
                    title: Text(
                      invoice.number,
                      style: const TextStyle(fontWeight: FontWeight.w900),
                    ),
                    subtitle: Text('${invoice.amount.toStringAsFixed(0)} ر.س'),
                    trailing: StatusPill(invoice.status),
                    onTap: () => _showInvoiceDocument(context, invoice),
                  ),
                ),
            ],
          ),
        );
      },
    );
  }

  Future<void> _showInvoiceDocument(
    BuildContext context,
    PartnerInvoice invoice,
  ) async {
    final messenger = ScaffoldMessenger.of(context);
    try {
      final document = await ref
          .read(partnerRepositoryProvider)
          .invoiceDocument(invoice.id);
      if (!context.mounted) return;
      await showModalBottomSheet<void>(
        context: context,
        builder: (context) => Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'مستند الفاتورة',
                style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18),
              ),
              const SizedBox(height: 12),
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: const Icon(LucideIcons.fileText),
                title: Text(document.invoice.number),
                subtitle: Text('${document.format} - ${document.downloadUrl}'),
              ),
              FilledButton.icon(
                onPressed: () async {
                  await Clipboard.setData(
                    ClipboardData(text: document.downloadUrl),
                  );
                  if (context.mounted) Navigator.pop(context);
                  messenger.showSnackBar(
                    const SnackBar(content: Text('تم نسخ رابط الفاتورة')),
                  );
                },
                icon: const Icon(LucideIcons.copy),
                label: const Text('نسخ الرابط'),
              ),
            ],
          ),
        ),
      );
    } catch (error) {
      messenger.showSnackBar(
        SnackBar(content: Text('تعذر تحميل مستند الفاتورة: $error')),
      );
    }
  }
}
