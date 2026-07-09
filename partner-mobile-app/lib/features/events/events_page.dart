import '../../shared/widgets/gap_module_page.dart';

class EventsPage extends GapModulePage {
  const EventsPage({super.key})
    : super(
        title: 'التجارب والفعاليات',
        items: const [
          'إضافة تجربة',
          'إضافة فعالية',
          'إضافة مؤتمر',
          'صور وأسعار ومواعيد',
        ],
      );
}
