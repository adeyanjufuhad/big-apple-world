export const HONEYPOT_FIELD = "hp_ba_7f3q";

/**
 * Invisible to people (and screen readers); bots that fill every field reveal themselves.
 * The name and label are deliberately meaningless so browser autofill and password
 * managers never recognise it (a field called "company" gets autofilled by Chrome).
 */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Leave this empty
        <input
          type="text"
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
          data-1p-ignore
          data-lpignore="true"
          data-bwignore
        />
      </label>
    </div>
  );
}
