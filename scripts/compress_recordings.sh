#!/bin/bash
# ==============================================================================
# Call Center Audio Compressor (WAV -> MP3)
# 80 GB diskni to'lib qolishdan asrash va 90% joyni tejash skripti
# ==============================================================================

RECORDINGS_DIR="/var/spool/asterisk/recordings"

# Kerakli dasturlarni tekshirish
if ! command -v ffmpeg &> /dev/null; then
    echo "[INFO] ffmpeg o'rnatilmoqda..."
    apt-get update -y && apt-get install -y ffmpeg
fi

if [ ! -d "$RECORDINGS_DIR" ]; then
    echo "[XATO] $RECORDINGS_DIR papkasi topilmadi."
    exit 1
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Audio siqish jarayoni boshlandi..."

# Oxirgi 10 daqiqadan eski barcha .wav fayllarni topib, mp3 ga aylantiramiz
# (Hozir yozilayotgan qo'ng'iroqlarga tegmaslik uchun -mmin +10)
find "$RECORDINGS_DIR" -type f -name "*.wav" -mmin +10 | while read -r wav_file; do
    mp3_file="${wav_file%.wav}.mp3"
    
    # Agar mp3 fayl hali mavjud bo'lmasa, konvertatsiya qilamiz
    if [ ! -f "$mp3_file" ]; then
        # 32k mono telefonyaga to'liq yetadi va 1 daqiqa qo'ng'iroq ~150 KB bo'ladi (WAV esa ~1 MB)
        ffmpeg -y -i "$wav_file" -codec:a libmp3lame -b:a 32k -ac 1 "$mp3_file" -loglevel error
        
        if [ -f "$mp3_file" ] && [ -s "$mp3_file" ]; then
            # Muvaffaqiyatli bo'lsa, asl katta .wav faylni o'chiramiz
            rm -f "$wav_file"
            echo "[SIQILDI] $(basename "$wav_file") -> $(basename "$mp3_file")"
        fi
    else
        # Agar mp3 allaqachon mavjud bo'lsa, ortiqcha wav ni tozalaymiz
        rm -f "$wav_file"
    fi
done

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Siqish yakunlandi."
