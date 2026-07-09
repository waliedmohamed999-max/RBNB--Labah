import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../core/auth/auth_controller.dart';
import '../../core/auth/permission_controller.dart';
import '../../core/theme/app_theme.dart';

class AppShell extends ConsumerWidget {
  const AppShell({required this.child, super.key});
  final Widget child;

  static const _items = [
    _NavItem('الرئيسية', '/dashboard', LucideIcons.layoutDashboard, 'home'),
    _NavItem('الوحدات', '/chalets', LucideIcons.home, 'services'),
    _NavItem('الحجوزات', '/bookings', LucideIcons.calendarCheck, 'bookings'),
    _NavItem('المدفوعات', '/payments', LucideIcons.wallet, 'payments'),
    _NavItem('الحساب', '/profile', LucideIcons.user, 'profile'),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final location = GoRouterState.of(context).matchedLocation;
    final allowed = ref.watch(partnerPermissionsProvider).valueOrNull;
    final visibleItems = _items
        .where((item) => allowed == null || allowed.contains(item.permission))
        .toList();
    final index = visibleItems.indexWhere((item) => location == item.path);

    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(
          title: const Text(
            'بوابة الشريك',
            style: TextStyle(fontWeight: FontWeight.w800),
          ),
          actions: [
            IconButton(
              tooltip: 'الإشعارات',
              onPressed: () => context.go('/notifications'),
              icon: const Icon(LucideIcons.bell),
            ),
          ],
        ),
        drawer: Drawer(
          child: SafeArea(
            child: Column(
              children: [
                const ListTile(
                  leading: CircleAvatar(
                    backgroundColor: AppTheme.rose,
                    child: Text('L'),
                  ),
                  title: Text(
                    'Labayh Partner',
                    style: TextStyle(fontWeight: FontWeight.w900),
                  ),
                  subtitle: Text('إدارة الشريك من الهاتف'),
                ),
                const Divider(),
                _DrawerLink(
                  label: 'العروض والكوبونات',
                  path: '/offers',
                  icon: LucideIcons.ticket,
                ),
                _DrawerLink(
                  label: 'التجارب والفعاليات',
                  path: '/events',
                  icon: LucideIcons.sparkles,
                ),
                _DrawerLink(
                  label: 'الإعدادات',
                  path: '/settings',
                  icon: LucideIcons.settings,
                ),
                const Spacer(),
                ListTile(
                  leading: const Icon(LucideIcons.logOut),
                  title: const Text('تسجيل الخروج'),
                  onTap: () =>
                      ref.read(authControllerProvider.notifier).logout(),
                ),
              ],
            ),
          ),
        ),
        body: SafeArea(child: child),
        bottomNavigationBar: NavigationBar(
          selectedIndex: index < 0 ? 0 : index,
          onDestinationSelected: (value) =>
              context.go(visibleItems[value].path),
          destinations: [
            for (final item in visibleItems)
              NavigationDestination(icon: Icon(item.icon), label: item.label),
          ],
        ),
      ),
    );
  }
}

class _DrawerLink extends StatelessWidget {
  const _DrawerLink({
    required this.label,
    required this.path,
    required this.icon,
  });
  final String label;
  final String path;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon),
      title: Text(label),
      onTap: () => context.go(path),
    );
  }
}

class _NavItem {
  const _NavItem(this.label, this.path, this.icon, this.permission);
  final String label;
  final String path;
  final IconData icon;
  final String permission;
}
