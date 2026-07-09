import '../../shared/widgets/gap_module_page.dart';

class OffersPage extends GapModulePage {
  const OffersPage({super.key})
    : super(
        title: 'العروض والكوبونات',
        items: const [
          'إنشاء كوبون',
          'عروض آخر لحظة',
          'نسب الخصم',
          'تواريخ الصلاحية',
        ],
      );
}
