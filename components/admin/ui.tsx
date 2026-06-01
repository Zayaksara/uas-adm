import { deleteRow } from "@/app/admin/actions";
import { ActionForm } from "./ActionForm";

const inputCls =
  "w-full border-2 border-nb-ink px-2 py-1.5 text-sm outline-none focus:bg-nb-yellow/40";

export function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-bold uppercase text-zinc-600">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue ?? ""}
        className={inputCls}
      />
    </label>
  );
}

export function TextArea({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-bold uppercase text-zinc-600">{label}</span>
      <textarea
        name={name}
        rows={3}
        defaultValue={defaultValue ?? ""}
        className={inputCls}
      />
    </label>
  );
}

export function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-bold uppercase text-zinc-600">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="w-full border-2 border-nb-ink bg-white px-2 py-1.5 text-sm font-bold outline-none focus:bg-nb-yellow/40"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function SectionCard({
  title,
  color,
  children,
}: {
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <section className="nb-card bg-white">
      <h2
        className={`border-b-2 border-nb-ink px-5 py-3 text-xl font-extrabold ${color}`}
      >
        {title}
      </h2>
      <div className="space-y-5 p-5">{children}</div>
    </section>
  );
}

/** File input styled like the rest of the admin form. */
export function FileField({
  label,
  name,
  hint,
}: {
  label: string;
  name: string;
  hint?: string;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-bold uppercase text-zinc-600">{label}</span>
      <input
        name={name}
        type="file"
        accept="image/*"
        className="w-full border-2 border-nb-ink bg-white px-2 py-1.5 text-sm file:mr-3 file:border-2 file:border-nb-ink file:bg-nb-yellow file:px-2 file:py-1 file:text-xs file:font-bold"
      />
      {hint && <span className="block text-xs text-zinc-500">{hint}</span>}
    </label>
  );
}

/** Delete button bound to the generic deleteRow action. */
export function DeleteButton({ table, id }: { table: string; id: number }) {
  return (
    <ActionForm action={deleteRow}>
      <input type="hidden" name="table" value={table} />
      <input type="hidden" name="id" value={id} />
      <button className="nb-btn bg-nb-pink px-3 py-1.5 text-sm">Hapus</button>
    </ActionForm>
  );
}
