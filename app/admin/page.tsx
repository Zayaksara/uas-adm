import {
  getProfile,
  getEducation,
  getSkills,
  getAchievements,
  getHobbies,
  getProjects,
} from "@/lib/data";
import {
  saveProfile,
  addEducation,
  updateEducation,
  addSkill,
  updateSkill,
  addAchievement,
  updateAchievement,
  addHobby,
  updateHobby,
  addProject,
  updateProject,
} from "./actions";
import {
  Field,
  TextArea,
  SectionCard,
  DeleteButton,
  FileField,
  SelectField,
} from "@/components/admin/ui";
import { ActionForm } from "@/components/admin/ActionForm";
import { PhotoCropField } from "@/components/admin/PhotoCropField";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [profile, education, skills, achievements, hobbies, projects] =
    await Promise.all([
      getProfile(),
      getEducation(),
      getSkills(),
      getAchievements(),
      getHobbies(),
      getProjects(),
    ]);

  const statusOptions = [
    { value: "ongoing", label: "Sedang Berjalan" },
    { value: "completed", label: "Selesai" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold">Kelola Portofolio</h1>
        <p className="text-zinc-600">
          Semua perubahan langsung tersimpan ke database dan tampil di situs.
        </p>
      </div>

      {/* ---------------------------- PROFIL ---------------------------- */}
      <SectionCard title="Profil / Home" color="bg-nb-blue">
        <ActionForm action={saveProfile} className="grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="id" value={profile.id} />
          <Field label="Nama Lengkap" name="full_name" defaultValue={profile.full_name} required />
          <Field label="Headline" name="headline" defaultValue={profile.headline} />
          <div className="sm:col-span-2">
            <Field label="Tagline" name="tagline" defaultValue={profile.tagline} />
          </div>
          <div className="sm:col-span-2">
            <TextArea label="Bio" name="bio" defaultValue={profile.bio} />
          </div>
          <Field label="Lokasi" name="location" defaultValue={profile.location} />
          <Field label="Email" name="email" defaultValue={profile.email} />
          <Field label="Telepon" name="phone" defaultValue={profile.phone} />
          {/* Upload foto (disimpan ke database). Kosongkan jika tak ingin mengganti. */}
          <div className="flex items-end gap-3">
            {profile.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.photo_url}
                alt="Foto saat ini"
                className="size-16 shrink-0 border-2 border-nb-ink object-cover"
              />
            ) : (
              <div className="flex size-16 shrink-0 items-center justify-center border-2 border-nb-ink bg-nb-blue text-xs font-bold">
                No foto
              </div>
            )}
            <div className="flex-1">
              <PhotoCropField name="photo" hint="Maks 5 MB · geser & zoom untuk fokus ke profil." />
            </div>
          </div>
          <Field label="GitHub URL" name="github_url" defaultValue={profile.github_url} />
          <Field label="LinkedIn URL" name="linkedin_url" defaultValue={profile.linkedin_url} />
          <div className="sm:col-span-2">
            <button className="nb-btn bg-nb-green">Simpan Profil</button>
          </div>
        </ActionForm>
      </SectionCard>

      {/* -------------------------- PENDIDIKAN -------------------------- */}
      <SectionCard title="Riwayat Pendidikan" color="bg-nb-purple">
        {education.map((e) => (
          <div key={e.id} className="border-2 border-nb-ink p-4">
            <ActionForm action={updateEducation} className="grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="id" value={e.id} />
              <Field label="Institusi" name="institution" defaultValue={e.institution} required />
              <Field label="Jenjang" name="degree" defaultValue={e.degree} />
              <Field label="Bidang" name="field" defaultValue={e.field} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Tahun Mulai" name="start_year" type="number" defaultValue={e.start_year} />
                <Field label="Tahun Selesai" name="end_year" type="number" defaultValue={e.end_year} placeholder="kosong = sekarang" />
              </div>
              <div className="sm:col-span-2">
                <TextArea label="Deskripsi" name="description" defaultValue={e.description} />
              </div>
              <button className="nb-btn bg-nb-green w-fit">Update</button>
            </ActionForm>
            <div className="mt-2"><DeleteButton table="education" id={e.id} /></div>
          </div>
        ))}
        <ActionForm action={addEducation} className="grid gap-3 border-2 border-dashed border-nb-ink bg-nb-cream p-4 sm:grid-cols-2">
          <p className="font-bold sm:col-span-2">+ Tambah Pendidikan</p>
          <Field label="Institusi" name="institution" required />
          <Field label="Jenjang" name="degree" />
          <Field label="Bidang" name="field" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tahun Mulai" name="start_year" type="number" />
            <Field label="Tahun Selesai" name="end_year" type="number" />
          </div>
          <div className="sm:col-span-2"><TextArea label="Deskripsi" name="description" /></div>
          <button className="nb-btn bg-nb-yellow w-fit">Tambah</button>
        </ActionForm>
      </SectionCard>

      {/* ----------------------------- SKILLS --------------------------- */}
      <SectionCard title="Skills" color="bg-nb-green">
        {skills.map((sk) => (
          <div key={sk.id} className="flex flex-wrap items-end gap-3 border-2 border-nb-ink p-4">
            <ActionForm action={updateSkill} className="flex flex-1 flex-wrap items-end gap-3">
              <input type="hidden" name="id" value={sk.id} />
              <div className="min-w-40 flex-1"><Field label="Nama" name="name" defaultValue={sk.name} required /></div>
              <div className="min-w-32 flex-1"><Field label="Kategori" name="category" defaultValue={sk.category} /></div>
              <div className="w-24"><Field label="Level %" name="level" type="number" defaultValue={sk.level} /></div>
              <button className="nb-btn bg-nb-green w-fit">Update</button>
            </ActionForm>
            <DeleteButton table="skills" id={sk.id} />
          </div>
        ))}
        <ActionForm action={addSkill} className="flex flex-wrap items-end gap-3 border-2 border-dashed border-nb-ink bg-nb-cream p-4">
          <p className="w-full font-bold">+ Tambah Skill</p>
          <div className="min-w-40 flex-1"><Field label="Nama" name="name" required /></div>
          <div className="min-w-32 flex-1"><Field label="Kategori" name="category" placeholder="Frontend / Backend / DevOps" /></div>
          <div className="w-24"><Field label="Level %" name="level" type="number" placeholder="50" /></div>
          <button className="nb-btn bg-nb-yellow w-fit">Tambah</button>
        </ActionForm>
      </SectionCard>

      {/* ----------------------------- PROJECTS --------------------------- */}
      <SectionCard title="Project" color="bg-nb-orange">
        {projects.map((p) => (
          <div key={p.id} className="border-2 border-nb-ink p-4">
            <ActionForm action={updateProject} className="grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="id" value={p.id} />
              <Field label="Judul" name="title" defaultValue={p.title} required />
              <SelectField label="Status" name="status" defaultValue={p.status} options={statusOptions} />
              <div className="sm:col-span-2">
                <TextArea label="Deskripsi" name="description" defaultValue={p.description} />
              </div>
              <Field label="Demo URL" name="demo_url" defaultValue={p.demo_url} />
              <Field label="Repo URL" name="repo_url" defaultValue={p.repo_url} />
              <Field label="Urutan" name="sort_order" type="number" defaultValue={0} />
              <div className="flex items-end gap-3">
                {p.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image_url} alt="Gambar project" className="size-16 shrink-0 border-2 border-nb-ink object-cover" />
                ) : (
                  <div className="flex size-16 shrink-0 items-center justify-center border-2 border-nb-ink bg-nb-cream text-xs font-bold">No gbr</div>
                )}
                <div className="flex-1"><FileField label="Gambar (upload)" name="image" hint="Maks 5 MB · kosongkan jika tetap" /></div>
              </div>
              <button className="nb-btn bg-nb-green w-fit sm:col-span-2">Update</button>
            </ActionForm>
            <div className="mt-2"><DeleteButton table="projects" id={p.id} /></div>
          </div>
        ))}
        <ActionForm action={addProject} className="grid gap-3 border-2 border-dashed border-nb-ink bg-nb-cream p-4 sm:grid-cols-2">
          <p className="font-bold sm:col-span-2">+ Tambah Project</p>
          <Field label="Judul" name="title" required />
          <SelectField label="Status" name="status" defaultValue="completed" options={statusOptions} />
          <div className="sm:col-span-2"><TextArea label="Deskripsi" name="description" /></div>
          <Field label="Demo URL" name="demo_url" />
          <Field label="Repo URL" name="repo_url" />
          <Field label="Urutan" name="sort_order" type="number" placeholder="0" />
          <FileField label="Gambar (upload)" name="image" hint="Maks 5 MB · jpg/png" />
          <button className="nb-btn bg-nb-yellow w-fit sm:col-span-2">Tambah</button>
        </ActionForm>
      </SectionCard>

      {/* --------------------------- PRESTASI --------------------------- */}
      <SectionCard title="Prestasi" color="bg-nb-orange">
        {achievements.map((a) => (
          <div key={a.id} className="border-2 border-nb-ink p-4">
            <ActionForm action={updateAchievement} className="grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="id" value={a.id} />
              <Field label="Judul" name="title" defaultValue={a.title} required />
              <Field label="Penyelenggara" name="issuer" defaultValue={a.issuer} />
              <Field label="Tahun" name="year" type="number" defaultValue={a.year} />
              <div className="sm:col-span-2"><TextArea label="Deskripsi" name="description" defaultValue={a.description} /></div>
              <button className="nb-btn bg-nb-green w-fit">Update</button>
            </ActionForm>
            <div className="mt-2"><DeleteButton table="achievements" id={a.id} /></div>
          </div>
        ))}
        <ActionForm action={addAchievement} className="grid gap-3 border-2 border-dashed border-nb-ink bg-nb-cream p-4 sm:grid-cols-2">
          <p className="font-bold sm:col-span-2">+ Tambah Prestasi</p>
          <Field label="Judul" name="title" required />
          <Field label="Penyelenggara" name="issuer" />
          <Field label="Tahun" name="year" type="number" />
          <div className="sm:col-span-2"><TextArea label="Deskripsi" name="description" /></div>
          <button className="nb-btn bg-nb-yellow w-fit">Tambah</button>
        </ActionForm>
      </SectionCard>

      {/* ----------------------------- HOBI ----------------------------- */}
      <SectionCard title="Hobi & Minat" color="bg-nb-pink">
        {hobbies.map((h) => (
          <div key={h.id} className="flex flex-wrap items-end gap-3 border-2 border-nb-ink p-4">
            <ActionForm action={updateHobby} className="flex flex-1 flex-wrap items-end gap-3">
              <input type="hidden" name="id" value={h.id} />
              <div className="w-20"><Field label="Emoji" name="emoji" defaultValue={h.emoji} /></div>
              <div className="min-w-32 flex-1"><Field label="Nama" name="name" defaultValue={h.name} required /></div>
              <div className="min-w-48 flex-[2]"><Field label="Deskripsi" name="description" defaultValue={h.description} /></div>
              <button className="nb-btn bg-nb-green w-fit">Update</button>
            </ActionForm>
            <DeleteButton table="hobbies" id={h.id} />
          </div>
        ))}
        <ActionForm action={addHobby} className="flex flex-wrap items-end gap-3 border-2 border-dashed border-nb-ink bg-nb-cream p-4">
          <p className="w-full font-bold">+ Tambah Hobi</p>
          <div className="w-20"><Field label="Emoji" name="emoji" placeholder="🎮" /></div>
          <div className="min-w-32 flex-1"><Field label="Nama" name="name" required /></div>
          <div className="min-w-48 flex-[2]"><Field label="Deskripsi" name="description" /></div>
          <button className="nb-btn bg-nb-yellow w-fit">Tambah</button>
        </ActionForm>
      </SectionCard>
    </div>
  );
}
