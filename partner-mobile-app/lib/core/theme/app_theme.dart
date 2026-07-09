import 'package:flutter/material.dart';

class AppTheme {
  static const rose = Color(0xFFFF385C);
  static const ink = Color(0xFF111827);
  static const sand = Color(0xFFF7F8FB);

  static ThemeData light() {
    final scheme = ColorScheme.fromSeed(
      seedColor: rose,
      brightness: Brightness.light,
    );
    return ThemeData(
      useMaterial3: true,
      colorScheme: scheme.copyWith(primary: rose, surface: Colors.white),
      scaffoldBackgroundColor: sand,
      fontFamily: 'Roboto',
      cardTheme: const CardThemeData(
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(8)),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }

  static ThemeData dark() {
    final scheme = ColorScheme.fromSeed(
      seedColor: rose,
      brightness: Brightness.dark,
    );
    return ThemeData(
      useMaterial3: true,
      colorScheme: scheme.copyWith(
        primary: rose,
        surface: const Color(0xFF161B22),
      ),
      scaffoldBackgroundColor: const Color(0xFF0D1117),
      fontFamily: 'Roboto',
      cardTheme: const CardThemeData(
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(8)),
        ),
      ),
    );
  }
}
