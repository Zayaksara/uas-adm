"use server";

import { revalidatePath } from "next/cache";
import { AuthError } from "next-auth";
import { auth, signIn, signOut } from "@/auth";
import { execute } from "@/lib/db";

export type ActionResult = { ok: boolean; message: string } | null;

/** Guard: throw if the caller is not an authenticated admin. */
async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Sesi berakhir. Silakan login ulang.");
}

function refresh() {
  revalidatePath("/admin");
  revalidatePath("/");
}

const s = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const n = (fd: FormData, k: string) => {
  const v = String(fd.get(k) ?? "").trim();
  return v === "" ? null : Number(v);
};

/** Wrap a mutation so it always returns a friendly result for the modal. */
async function run(message: string, fn: () => Promise<void>): Promise<ActionResult> {
  try {
    await requireAdmin();
    await fn();
    refresh();
    return { ok: true, message };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Gagal menyimpan." };
  }
}

const MAX_PHOTO = 5 * 1024 * 1024; // 5 MB

/* ------------------------------ AUTH ------------------------------ */
export async function loginAction(_prev: string | undefined, fd: FormData) {
  try {
    await signIn("credentials", {
      username: s(fd, "username"),
      password: s(fd, "password"),
      redirectTo: "/admin",
    });
  } catch (err) {
    if (err instanceof AuthError) return "Username atau password salah.";
    throw err; // re-throw redirect
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/admin/login" });
}

/* ----------------------------- PROFILE ---------------------------- */
export async function saveProfile(
  _prev: ActionResult,
  fd: FormData,
): Promise<ActionResult> {
  return run("Profil berhasil disimpan!", async () => {
    const id = Number(fd.get("id"));
    const base = [
      s(fd, "full_name"), s(fd, "headline"), s(fd, "tagline"), s(fd, "bio"),
      s(fd, "location"), s(fd, "email"), s(fd, "phone"),
      s(fd, "github_url"), s(fd, "linkedin_url"),
    ];

    // Optional photo upload — stored as a base64 data URL in the DB.
    const file = fd.get("photo") as File | null;
    if (file && file.size > 0) {
      if (file.size > MAX_PHOTO) {
        throw new Error("Ukuran foto maksimal 5 MB.");
      }
      if (!file.type.startsWith("image/")) {
        throw new Error("File harus berupa gambar.");
      }
      const buf = Buffer.from(await file.arrayBuffer());
      const dataUrl = `data:${file.type};base64,${buf.toString("base64")}`;
      await execute(
        `UPDATE profile SET full_name=?, headline=?, tagline=?, bio=?, location=?,
          email=?, phone=?, github_url=?, linkedin_url=?, photo_url=? WHERE id=?`,
        [...base, dataUrl, id],
      );
    } else {
      // No new photo — keep the existing one.
      await execute(
        `UPDATE profile SET full_name=?, headline=?, tagline=?, bio=?, location=?,
          email=?, phone=?, github_url=?, linkedin_url=? WHERE id=?`,
        [...base, id],
      );
    }
  });
}

/* ---------------------------- EDUCATION --------------------------- */
export async function addEducation(_p: ActionResult, fd: FormData) {
  return run("Pendidikan ditambahkan!", async () => {
    await execute(
      `INSERT INTO education (institution, degree, field, start_year, end_year, description)
       VALUES (?,?,?,?,?,?)`,
      [s(fd, "institution"), s(fd, "degree"), s(fd, "field"),
       n(fd, "start_year"), n(fd, "end_year"), s(fd, "description")],
    );
  });
}
export async function updateEducation(_p: ActionResult, fd: FormData) {
  return run("Pendidikan diperbarui!", async () => {
    await execute(
      `UPDATE education SET institution=?, degree=?, field=?, start_year=?,
        end_year=?, description=? WHERE id=?`,
      [s(fd, "institution"), s(fd, "degree"), s(fd, "field"),
       n(fd, "start_year"), n(fd, "end_year"), s(fd, "description"),
       Number(fd.get("id"))],
    );
  });
}

/* ------------------------------ SKILLS ---------------------------- */
export async function addSkill(_p: ActionResult, fd: FormData) {
  return run("Skill ditambahkan!", async () => {
    await execute("INSERT INTO skills (name, category, level) VALUES (?,?,?)", [
      s(fd, "name"), s(fd, "category"), n(fd, "level") ?? 50,
    ]);
  });
}
export async function updateSkill(_p: ActionResult, fd: FormData) {
  return run("Skill diperbarui!", async () => {
    await execute("UPDATE skills SET name=?, category=?, level=? WHERE id=?", [
      s(fd, "name"), s(fd, "category"), n(fd, "level") ?? 50, Number(fd.get("id")),
    ]);
  });
}

/* --------------------------- ACHIEVEMENTS ------------------------- */
export async function addAchievement(_p: ActionResult, fd: FormData) {
  return run("Prestasi ditambahkan!", async () => {
    await execute(
      "INSERT INTO achievements (title, issuer, year, description) VALUES (?,?,?,?)",
      [s(fd, "title"), s(fd, "issuer"), n(fd, "year"), s(fd, "description")],
    );
  });
}
export async function updateAchievement(_p: ActionResult, fd: FormData) {
  return run("Prestasi diperbarui!", async () => {
    await execute(
      "UPDATE achievements SET title=?, issuer=?, year=?, description=? WHERE id=?",
      [s(fd, "title"), s(fd, "issuer"), n(fd, "year"), s(fd, "description"),
       Number(fd.get("id"))],
    );
  });
}

/* ------------------------------ HOBBIES --------------------------- */
export async function addHobby(_p: ActionResult, fd: FormData) {
  return run("Hobi ditambahkan!", async () => {
    await execute("INSERT INTO hobbies (name, emoji, description) VALUES (?,?,?)", [
      s(fd, "name"), s(fd, "emoji") || "⭐", s(fd, "description"),
    ]);
  });
}
export async function updateHobby(_p: ActionResult, fd: FormData) {
  return run("Hobi diperbarui!", async () => {
    await execute("UPDATE hobbies SET name=?, emoji=?, description=? WHERE id=?", [
      s(fd, "name"), s(fd, "emoji") || "⭐", s(fd, "description"), Number(fd.get("id")),
    ]);
  });
}

/* ------------------------------ PROJECTS -------------------------- */
async function projectImage(fd: FormData): Promise<string | null> {
  const file = fd.get("image") as File | null;
  if (!file || file.size === 0) return null;
  if (file.size > MAX_PHOTO) throw new Error("Ukuran gambar maksimal 5 MB.");
  if (!file.type.startsWith("image/")) throw new Error("File harus berupa gambar.");
  const buf = Buffer.from(await file.arrayBuffer());
  return `data:${file.type};base64,${buf.toString("base64")}`;
}

export async function addProject(_p: ActionResult, fd: FormData) {
  return run("Project ditambahkan!", async () => {
    const img = await projectImage(fd);
    await execute(
      `INSERT INTO projects (title, description, image_url, status, demo_url, repo_url, sort_order)
       VALUES (?,?,?,?,?,?,?)`,
      [s(fd, "title"), s(fd, "description"), img, s(fd, "status") || "completed",
       s(fd, "demo_url"), s(fd, "repo_url"), n(fd, "sort_order") ?? 0],
    );
  });
}
export async function updateProject(_p: ActionResult, fd: FormData) {
  return run("Project diperbarui!", async () => {
    const img = await projectImage(fd);
    const id = Number(fd.get("id"));
    if (img) {
      await execute(
        `UPDATE projects SET title=?, description=?, status=?, demo_url=?, repo_url=?,
          sort_order=?, image_url=? WHERE id=?`,
        [s(fd, "title"), s(fd, "description"), s(fd, "status") || "completed",
         s(fd, "demo_url"), s(fd, "repo_url"), n(fd, "sort_order") ?? 0, img, id],
      );
    } else {
      await execute(
        `UPDATE projects SET title=?, description=?, status=?, demo_url=?, repo_url=?,
          sort_order=? WHERE id=?`,
        [s(fd, "title"), s(fd, "description"), s(fd, "status") || "completed",
         s(fd, "demo_url"), s(fd, "repo_url"), n(fd, "sort_order") ?? 0, id],
      );
    }
  });
}

/* ----------------------- GENERIC DELETE --------------------------- */
const TABLES = ["education", "skills", "achievements", "hobbies", "projects"] as const;
export async function deleteRow(_p: ActionResult, fd: FormData) {
  return run("Data dihapus!", async () => {
    const table = String(fd.get("table"));
    const id = Number(fd.get("id"));
    if (!TABLES.includes(table as (typeof TABLES)[number])) {
      throw new Error("Tabel tidak valid.");
    }
    await execute(`DELETE FROM \`${table}\` WHERE id=?`, [id]);
  });
}
