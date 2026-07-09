import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';

class GapModulePage extends StatelessWidget {
  const GapModulePage({required this.title, required this.items, super.key});
  final String title;
  final List<String> items;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Text(
          title,
          style: Theme.of(
            context,
          ).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w900),
        ),
        const SizedBox(height: 10),
        Text(
          'هذا القسم جاهز في بنية التطبيق، لكنه يحتاج endpoints إضافية في partner-api حتى يعمل كنسخة كاملة من الداش بورد.',
          style: Theme.of(context).textTheme.bodyMedium,
        ),
        const SizedBox(height: 20),
        for (final item in items)
          Card(
            child: ListTile(
              leading: const Icon(LucideIcons.badgeCheck),
              title: Text(
                item,
                style: const TextStyle(fontWeight: FontWeight.w700),
              ),
            ),
          ),
      ],
    );
  }
}
