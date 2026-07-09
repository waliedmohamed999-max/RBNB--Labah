import '../../shared/widgets/gap_module_page.dart';

class SettingsPage extends GapModulePage {
  const SettingsPage({super.key})
    : super(
        title: 'الإعدادات والمحتوى',
        items: const [
          'اللغات والترجمة',
          'مكتبة الوسائط',
          'SEO',
          'المدن والوجهات',
          'المستخدمين والصلاحيات',
        ],
      );
}
