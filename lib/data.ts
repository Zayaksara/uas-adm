import type { RowDataPacket } from "mysql2";
import { query } from "./db";

/* ---------------------------------- Types --------------------------------- */
export interface Profile {
  id: number;
  full_name: string;
  headline: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  photo_url: string;
  github_url: string;
  linkedin_url: string;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field: string;
  start_year: number;
  end_year: number | null;
  description: string;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  level: number; // 0-100
}

export interface Achievement {
  id: number;
  title: string;
  issuer: string;
  year: number;
  description: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  status: "ongoing" | "completed";
  demo_url: string;
  repo_url: string;
}

export interface Hobby {
  id: number;
  name: string;
  emoji: string;
  description: string;
}

type Row<T> = T & RowDataPacket;

/* ----------------------------- Fallback content ---------------------------- */
/* Used when the database is unreachable (e.g. during `next build` in CI),
   so the app never crashes — it just renders placeholder content.            */
const FALLBACK_PROFILE: Profile = {
  id: 0,
  full_name: "Nama Kamu",
  headline: "Mahasiswa & Calon Developer",
  tagline: "Membangun hal-hal keren dengan kode.",
  bio: "indonesia",
  location: "Indonesia",
  email: "email@contoh.com",
  phone: "-",
  photo_url: "",
  github_url: "#",
  linkedin_url: "#",
};

/* ------------------------------- Data fetchers ----------------------------- */
export async function getProfile(): Promise<Profile> {
  try {
    const rows = await query<Row<Profile>>(
      "SELECT * FROM profile ORDER BY id ASC LIMIT 1",
    );
    return rows[0] ?? FALLBACK_PROFILE;
  } catch {
    return FALLBACK_PROFILE;
  }
}

export async function getEducation(): Promise<Education[]> {
  try {
    return await query<Row<Education>>(
      "SELECT * FROM education ORDER BY start_year DESC, id DESC",
    );
  } catch {
    return [];
  }
}

export async function getSkills(): Promise<Skill[]> {
  try {
    return await query<Row<Skill>>(
      "SELECT * FROM skills ORDER BY category ASC, level DESC, id ASC",
    );
  } catch {
    return [];
  }
}

export async function getAchievements(): Promise<Achievement[]> {
  try {
    return await query<Row<Achievement>>(
      "SELECT * FROM achievements ORDER BY year DESC, id DESC",
    );
  } catch {
    return [];
  }
}

export async function getProjects(): Promise<Project[]> {
  try {
    return await query<Row<Project>>(
      "SELECT * FROM projects ORDER BY sort_order ASC, id DESC",
    );
  } catch {
    return [];
  }
}

export async function getHobbies(): Promise<Hobby[]> {
  try {
    return await query<Row<Hobby>>("SELECT * FROM hobbies ORDER BY id ASC");
  } catch {
    return [];
  }
}
