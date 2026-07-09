import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/api/api_client.dart';

class AsyncStateView<T> extends StatelessWidget {
  const AsyncStateView({required this.value, required this.data, super.key});
  final AsyncValue<T> value;
  final Widget Function(T data) data;

  @override
  Widget build(BuildContext context) {
    return value.when(
      data: data,
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (error, _) => Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Text(
            'تعذر تحميل البيانات\n${apiErrorMessage(error)}',
            textAlign: TextAlign.center,
          ),
        ),
      ),
    );
  }
}
