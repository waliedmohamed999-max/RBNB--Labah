import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../api/partner_repository.dart';
import 'session_store.dart';

final authControllerProvider = AsyncNotifierProvider<AuthController, bool>(
  AuthController.new,
);

class AuthController extends AsyncNotifier<bool> {
  @override
  Future<bool> build() async {
    final token = await ref.watch(sessionStoreProvider).readToken();
    return token != null && token.isNotEmpty;
  }

  Future<void> login(String email, String password) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final session = await ref
          .read(partnerRepositoryProvider)
          .login(email, password);
      await ref
          .read(sessionStoreProvider)
          .save(
            token: session.token,
            refreshToken: session.refreshToken,
            role: session.role,
          );
      return true;
    });
  }

  Future<void> logout() async {
    await ref.read(sessionStoreProvider).clear();
    state = const AsyncData(false);
  }
}
