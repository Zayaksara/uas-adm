"use client";

import { useActionState, useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import type { ActionResult } from "@/app/admin/actions";

type Action = (prev: ActionResult, fd: FormData) => Promise<ActionResult>;

/**
 * Drop-in replacement for <form> that runs a server action and shows a
 * success modal (or inline error) based on the returned result.
 */
export function ActionForm({
  action,
  children,
  className,
}: {
  action: Action;
  children: React.ReactNode;
  className?: string;
}) {
  const [state, formAction] = useActionState(action, null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (state?.ok) setShowModal(true);
  }, [state]);

  return (
    <>
      <form action={formAction} className={className}>
        {children}
        {state && !state.ok && (
          <p className="mt-1 w-full border-2 border-nb-ink bg-nb-pink px-3 py-1.5 text-sm font-bold">
            {state.message}
          </p>
        )}
      </form>

      {showModal && state?.ok && (
        <SuccessModal
          message={state.message}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

function SuccessModal({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  // Auto-dismiss after a short moment.
  useEffect(() => {
    const t = setTimeout(onClose, 1800);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="nb-card-lg w-full max-w-xs bg-white p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 flex size-14 items-center justify-center border-2 border-nb-ink bg-nb-green">
          <CheckCircle2 size={32} />
        </div>
        <p className="text-lg font-extrabold">Berhasil!</p>
        <p className="mt-1 text-sm text-zinc-700">{message}</p>
        <button onClick={onClose} className="nb-btn mt-4 w-full bg-nb-yellow">
          OK
        </button>
      </div>
    </div>
  );
}
