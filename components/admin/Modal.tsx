"use client";

export function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-box p-8">{children}</div>
    </div>
  );
}

export function ConfirmModal({
  open,
  title,
  body,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  body: React.ReactNode;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="modal-box p-8 max-w-sm">
        <div className="mb-8">
          <p className="text-clay text-[10px] font-light tracking-[0.25em] uppercase mb-3">
            Confirm
          </p>
          <h2 className="font-display text-2xl font-semibold tracking-tight-display text-ink mb-3">
            {title}
          </h2>
          <div className="font-body text-sm font-light text-ash leading-relaxed">
            {body}
          </div>
        </div>
        <div className="border-t border-rule pt-6 flex gap-4">
          <button
            onClick={onConfirm}
            className="bg-clay text-paper text-sm font-light px-6 py-3 hover:bg-ink transition-colors duration-300"
          >
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="border border-rule text-sm font-light px-6 py-3 text-ash hover:border-ash transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export function ModalHeader({
  eyebrow,
  title,
  onClose,
}: {
  eyebrow: string;
  title: string;
  onClose: () => void;
}) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <p className="text-clay text-[10px] font-light tracking-[0.25em] uppercase mb-1">
          {eyebrow}
        </p>
        <h2 className="font-display text-2xl font-semibold tracking-tight-display">
          {title}
        </h2>
      </div>
      <button
        onClick={onClose}
        className="text-ash hover:text-ink transition-colors text-sm font-light"
      >
        ✕
      </button>
    </div>
  );
}

export const inputClass =
  "w-full bg-transparent border border-rule px-4 py-3 text-sm font-light font-body text-ink transition-colors";
export const selectClass =
  "w-full bg-paper border border-rule px-4 py-3 text-sm font-light font-body text-ash appearance-none cursor-pointer";
export const labelClass =
  "text-[10px] font-light tracking-[0.2em] uppercase text-ash block";
