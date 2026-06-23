import { useEffect, useState } from 'react';
import { courseApi } from '../api/courseApi';
import { enrollmentApi } from '../api/enrollmentApi';
import { Course } from '../types/course';
import { StatsByCategory, CategoryStat } from '../data/roadmaps';

const unwrapCourses = (d: any): Course[] => d?.data?.courses ?? d?.courses ?? [];
const unwrapEnrollments = (d: any): any[] => d?.data?.enrollments ?? d?.enrollments ?? [];

/**
 * Roadmap bosqichlari uchun kategoriya statistikasini hisoblaydi.
 * Redux'dagi state.course.courses'ni KLOBBER qilmaslik uchun bu yerda mustaqil
 * (lokal) fetch qilamiz — CoursesScreen filtriga xalaqit bermaydi.
 */
export const useRoadmapProgress = () => {
  const [statsByCat, setStatsByCat] = useState<StatsByCategory>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [cRes, eRes] = await Promise.all([
          courseApi.getCourses({}),
          enrollmentApi.getMyEnrollments(),
        ]);
        const courses = unwrapCourses(cRes.data);
        const enrollments = unwrapEnrollments(eRes.data);

        const catByCourse: Record<string, string> = {};
        const stats: StatsByCategory = {};
        const bump = (cat: string): CategoryStat =>
          (stats[cat] ??= { total: 0, completed: 0, started: 0 });

        for (const c of courses) {
          if (!c.category) continue;
          catByCourse[c._id] = c.category;
          bump(c.category).total++;
        }
        for (const e of enrollments) {
          const cat = catByCourse[e.courseId];
          if (!cat) continue;
          const s = bump(cat);
          const done = (e.progress ?? 0) >= 100 || !!e.completedAt;
          if (done) s.completed++;
          else if ((e.progress ?? 0) > 0) s.started++;
        }
        if (alive) setStatsByCat(stats);
      } catch {
        // Offline / xatolik — bo'sh stats bilan 0% ko'rsatamiz.
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return { statsByCat, loading };
};
