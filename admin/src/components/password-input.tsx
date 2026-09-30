"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

/** Password field with a show/hide toggle. */
export function PasswordInput(props: Omit<React.ComponentProps<"input">, "type" | "className">) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input {...props} type={visible ? "text" : "password"} className="field pr-12" />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 grid w-12 place-items-center rounded-r-xl text-muted transition-colors hover:text-ink focus-visible:text-ink focus-visible:outline-none"
      >
        {visible ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
      </button>
    </div>
  );
}
