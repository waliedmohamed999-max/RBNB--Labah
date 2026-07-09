import '../../shared/widgets/gap_module_page.dart';

class NotificationsPage extends GapModulePage {
  const NotificationsPage({super.key})
    : super(
        title: 'الإشعارات',
        items: const [
          'Push Notifications',
          'إشعارات الحجوزات',
          'إشعارات الدفع',
          'إشعارات الإدارة',
        ],
      );
}
