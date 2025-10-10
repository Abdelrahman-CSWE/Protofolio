@echo off
echo ========================================
echo   تنظيف المشروع - حذف الملفات غير المستخدمة
echo ========================================
echo.

REM حذف ملفات CSS غير المستخدمة
echo [1/4] حذف ملفات CSS غير المستخدمة...
if exist "nav-diamond-power-animations.css" del /f /q "nav-diamond-power-animations.css"
if exist "nav-hexagon-elite-animations.css" del /f /q "nav-hexagon-elite-animations.css"
if exist "nav-power-animations.css" del /f /q "nav-power-animations.css"
if exist "nav-ultimate-power.css" del /f /q "nav-ultimate-power.css"
if exist "responsive-enhanced.css" del /f /q "responsive-enhanced.css"
if exist "responsive-ultimate.css" del /f /q "responsive-ultimate.css"
if exist "spline-robot-contact.css" del /f /q "spline-robot-contact.css"
if exist "ui-ux-enhancements.css" del /f /q "ui-ux-enhancements.css"
if exist "wave-animation.css" del /f /q "wave-animation.css"

REM حذف ملفات JS غير المستخدمة
echo [2/4] حذف ملفات JavaScript غير المستخدمة...
if exist "responsive-ultimate.js" del /f /q "responsive-ultimate.js"
if exist "complete_script.js" del /f /q "complete_script.js"
if exist "script.js" del /f /q "script.js"
if exist "spline-robot-contact.js" del /f /q "spline-robot-contact.js"
if exist "nav-enhancements.js" del /f /q "nav-enhancements.js"

REM حذف مجلد code القديم
echo [3/4] حذف مجلد التطوير القديم...
if exist "code" rmdir /s /q "code"

REM حذف ملفات الوثائق (اختياري)
echo [4/4] حذف ملفات الوثائق...
if exist "DIAMOND-ANIMATIONS-README.md" del /f /q "DIAMOND-ANIMATIONS-README.md"
if exist "HEXAGON-ANIMATIONS-README.md" del /f /q "HEXAGON-ANIMATIONS-README.md"
if exist "NAV-README.md" del /f /q "NAV-README.md"
if exist "REFINED-ANIMATIONS-README.md" del /f /q "REFINED-ANIMATIONS-README.md"
if exist "RESPONSIVE-README.md" del /f /q "RESPONSIVE-README.md"
if exist "TODO.md" del /f /q "TODO.md"

echo.
echo ========================================
echo   تم التنظيف بنجاح!
echo ========================================
echo.
echo الملفات المحذوفة:
echo - 9 ملفات CSS غير مستخدمة
echo - 5 ملفات JavaScript غير مستخدمة
echo - 1 مجلد تطوير قديم (code/)
echo - 6 ملفات وثائق
echo.
echo المشروع الآن أنظف وأخف!
echo.
pause
