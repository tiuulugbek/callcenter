#!/bin/bash

echo "=== Git Pull Conflict ni Hal Qilish ==="
echo ""

PROJECT_ROOT="/var/www/call-center"
cd "$PROJECT_ROOT" || exit 1

echo "1. Conflict qilayotgan faylni ko'chirish:"
echo "----------------------------------------"
if [ -f "check_call_logs.sh" ]; then
    mv check_call_logs.sh check_call_logs.sh.backup
    echo "✅ check_call_logs.sh -> check_call_logs.sh.backup ga ko'chirildi"
else
    echo "⚠️  check_call_logs.sh topilmadi"
fi

echo ""
echo "2. Git Pull Qilish:"
echo "------------------"
git pull origin main || {
    echo "❌ Git pull xatolik!"
    exit 1
}

echo "✅ Git pull muvaffaqiyatli!"

echo ""
echo "3. Scriptlarni Executable Qilish:"
echo "---------------------------------"
chmod +x step1_check_incoming.sh 2>/dev/null && echo "✅ step1_check_incoming.sh" || echo "❌ step1_check_incoming.sh topilmadi"
chmod +x step2_check_stasis.sh 2>/dev/null && echo "✅ step2_check_stasis.sh" || echo "❌ step2_check_stasis.sh topilmadi"
chmod +x step3_check_ari.sh 2>/dev/null && echo "✅ step3_check_ari.sh" || echo "❌ step3_check_ari.sh topilmadi"
chmod +x step4_check_database.sh 2>/dev/null && echo "✅ step4_check_database.sh" || echo "❌ step4_check_database.sh topilmadi"
chmod +x pull_and_setup_steps.sh 2>/dev/null && echo "✅ pull_and_setup_steps.sh" || echo "❌ pull_and_setup_steps.sh topilmadi"

echo ""
echo "4. Scriptlar Mavjudligini Tekshirish:"
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

