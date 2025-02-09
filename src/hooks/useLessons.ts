import { useState, useEffect } from 'react';
import lessonsData from '@/assets/lessons.json';
import { ApiCategory, Category } from "@/types/lesson";

export function useLessons() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const transformedCategories: Category[] = (lessonsData as ApiCategory[]).map(cat => ({
        id: cat.id,
        title: cat.title,
        description: cat.description,
        lessons: cat.lessons.map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          description: lesson.shortDescription,
          completed: lesson.status === 'completed',
          locked: lesson.locked,
          xp: lesson.xp
        }))
      }));
      setCategories(transformedCategories);
      setLoading(false);
    } catch (err) {
      setError('Failed to load lessons');
      setLoading(false);
    }
  }, []);

  const getCategoryProgress = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return 0;
    
    const completed = category.lessons.filter(l => l.completed).length;
    return Math.round((completed / category.lessons.length) * 100);
  };

  const getCategoryStatus = (categoryId: string): "completed" | "in-progress" | "locked" => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return 'locked';

    if (category.lessons.every(l => l.completed)) return 'completed';
    if (category.lessons.some(l => l.completed)) return 'in-progress';
    return 'locked';
  };

  return {
    categories,
    loading,
    error,
    getCategoryProgress,
    getCategoryStatus
  };
}
