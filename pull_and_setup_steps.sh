#!/bin/bash

echo "=== Serverga Yangi Scriptlarni Yuklab Olish ==="
echo ""

# Project root directory
PROJECT_ROOT="/var/www/call-center"

cd "$PROJECT_ROOT" || exit 1

echo "1. Git Pull Qilish:"
echo "------------------"
git pull origin main || {
    echo "❌ Git pull xatolik!"
    echo "Iltimos, manual ravishda git pull qiling:"
    echo "cd $PROJECT_ROOT && git pull origin main"
    exit 1
}

echo "✅ Git pull muvaffaqiyatli!"

echo ""
echo "2. Scriptlarni Executable Qilish:"
echo "---------------------------------"
chmod +x step1_check_incoming.sh
chmod +x step2_check_stasis.sh
chmod +x step3_check_ari.sh
chmod +x step4_check_database.sh

echo "✅ Scriptlar executable qilindi!"

echo ""
echo "3. Scriptlar Mavjudligini Tekshirish:"
echo "-------------------------------------"
ls -lh step*.sh 2>/dev/null || echo "⚠️  Scriptlar topilmadi!"

echo ""
echo "=== TAYYOR! ==="
echo ""
echo "Endi quyidagi scriptlarni ishlatishingiz mumkin:"
echo "  ./step1_check_incoming.sh  - Qo'ng'iroq Asterisk ga kelayotganini tekshirish"
echo "  ./step2_check_stasis.sh    - Dialplan da Stasis application tekshirish"
echo "  ./step3_check_ari.sh        - ARI eventlar tekshirish"
echo "  ./step4_check_database.sh   - Database da call loglar tekshirish"
echo ""
echo "Yoki batafsil ma'lumot uchun:"
echo "  cat STEP_BY_STEP_DEBUG.md"

