import 'package:flutter/material.dart';

class StatusPill extends StatelessWidget {
  const StatusPill(this.status, {super.key});
  final String status;

  @override
  Widget build(BuildContext context) {
    final color = switch (status) {
      'published' || 'confirmed' || 'paid' || 'completed' => Colors.green,
      'pending' || 'draft' || 'unpaid' => Colors.orange,
      'paused' || 'overdue' || 'cancelled' => Colors.red,
      _ => Colors.blueGrey,
    };
    return DecoratedBox(
      decoration: BoxDecoration(
        color: color.withOpacity(.12),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        child: Text(
          status,
          style: TextStyle(
            color: color.shade700,
            fontSize: 12,
            fontWeight: FontWeight.w800,
          ),
        ),
      ),
    );
  }
}
