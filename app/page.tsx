import Navbar from "@/components/sections/Navbar";
import Welcome from "@/components/sections/Welcome";
import Hero from "@/components/sections/Hero";
import ProjectsSection from "@/components/sections/Projects";
import EducationSection from "@/components/sections/Education";
import SkillsSection from "@/components/sections/Skills";
import AchievementsSection from "@/components/sections/Achievements";
import AboutSection from "@/components/sections/About";
import Footer from "@/components/sections/Footer";
import { Marquee } from "@/components/interactive/Marquee";
import {
  getProfile,
  getEducation,
  getSkills,
  getAchievements,
  getHobbies,
  getProjects,
} from "@/lib/data";

// Always render fresh from the database (data can change without a rebuild).
export const dynamic = "force-dynamic";

export default async function Home() {
  const [profile, education, skills, achievements, hobbies, projects] =
    await Promise.all([
      getProfile(),
      getEducation(),
      getSkills(),
      getAchievements(),
      getHobbies(),
      getProjects(),
    ]);

  return (
    <>
      <Navbar name={profile.full_name} />
      <main>
        <Welcome name={profile.full_name} />
        <Hero profile={profile} />
        <Marquee
          items={
            skills.length
              ? skills.map((s) => s.name)
              : ["Web Developer", "Next.js", "UI / UX", "Cloud", "Open to Work"]
          }
        />
        <EducationSection items={education} />
        <SkillsSection items={skills} />
        <ProjectsSection items={projects} />
        <AchievementsSection items={achievements} />
        <AboutSection profile={profile} hobbies={hobbies} />
      </main>
      <Footer profile={profile} />
    </>
  );
}
