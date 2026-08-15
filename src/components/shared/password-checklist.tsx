import { Check, X } from "lucide-react";

interface PasswordChecklistProps {
  hasMinLength: boolean;
  hasLetterAndNumber: boolean;
  isPasswordMatch: boolean;
  confirmPasswordLength: number;
}

export function PasswordChecklist({
  hasMinLength,
  hasLetterAndNumber,
  isPasswordMatch,
  confirmPasswordLength,
}: PasswordChecklistProps) {
  return (
    <div className="rounded-xl bg-[#faf8ff] p-3 border border-[#bccac0]/30 space-y-1.5 text-[11px]">
      <div
        className={`flex items-center gap-1.5 ${
          hasMinLength ? "text-emerald-700 font-medium" : "text-[#6d7a72]"
        }`}
      >
        {hasMinLength ? (
          <Check className="h-3.5 w-3.5 text-emerald-600" />
        ) : (
          <X className="h-3.5 w-3.5 text-slate-400" />
        )}
        <span>Minimal 8 karakter</span>
      </div>

      <div
        className={`flex items-center gap-1.5 ${
          hasLetterAndNumber ? "text-emerald-700 font-medium" : "text-[#6d7a72]"
        }`}
      >
        {hasLetterAndNumber ? (
          <Check className="h-3.5 w-3.5 text-emerald-600" />
        ) : (
          <X className="h-3.5 w-3.5 text-slate-400" />
        )}
        <span>Kombinasi huruf dan angka</span>
      </div>

      {confirmPasswordLength > 0 && (
        <div
          className={`flex items-center gap-1.5 ${
            isPasswordMatch ? "text-emerald-700 font-medium" : "text-red-600"
          }`}
        >
          {isPasswordMatch ? (
            <Check className="h-3.5 w-3.5 text-emerald-600" />
          ) : (
            <X className="h-3.5 w-3.5 text-red-500" />
          )}
          <span>
            {isPasswordMatch
              ? "Konfirmasi kata sandi cocok"
              : "Kata sandi belum sama"}
          </span>
        </div>
      )}
    </div>
  );
}
