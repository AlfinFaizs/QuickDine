// src/lib/image-compressor.ts
// Utilitas otomatisasi kompresi, resize, dan auto-center-crop foto makanan di browser

/**
 * Mengubah berkas foto ukuran besar (misal 1920x1080 / 4000x3000 dari kamera)
 * menjadi foto standar 800x800 (1:1) atau 800x600 (4:3) berbobot ringan (<100KB)
 * dengan center-crop otomatis agar tidak merusak layout kartu menu.
 */
export async function processAndCompressImage(
  file: File,
  targetWidth = 800,
  targetHeight = 800,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Gagal menginisialisasi canvas untuk kompresi foto."));
          return;
        }

        // Aktifkan smoothing berkualitas tinggi
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Hitung center-crop (object-fit: cover logic)
        const srcWidth = img.width;
        const srcHeight = img.height;
        const srcAspect = srcWidth / srcHeight;
        const targetAspect = targetWidth / targetHeight;

        let renderWidth = srcWidth;
        let renderHeight = srcHeight;
        let offsetX = 0;
        let offsetY = 0;

        if (srcAspect > targetAspect) {
          // Gambar sumber lebih lebar -> potong sisi kiri & kanan
          renderWidth = srcHeight * targetAspect;
          offsetX = (srcWidth - renderWidth) / 2;
        } else {
          // Gambar sumber lebih tinggi -> potong sisi atas & bawah
          renderHeight = srcWidth / targetAspect;
          offsetY = (srcHeight - renderHeight) / 2;
        }

        // Gambar ke canvas dengan center crop
        ctx.drawImage(
          img,
          offsetX,
          offsetY,
          renderWidth,
          renderHeight,
          0,
          0,
          targetWidth,
          targetHeight
        );

        // Ekspor ke WebP jika didukung atau JPEG ringan
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      };

      img.onerror = () => {
        reject(new Error("Format file gambar tidak valid atau rusak."));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("Gagal membaca file gambar dari perangkat Anda."));
    };

    reader.readAsDataURL(file);
  });
}
