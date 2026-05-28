import { CATEGORY_COLORS, CATEGORY_LIGHT_COLORS } from '@/lib/configMap';
import { cn } from '@/lib/utils';
import { Category } from '@/types/todo';
import { Badge } from '../ui/badge';

interface CategoryBadgeProps {
  category: Category;
  size?: 'sm' | 'md';
}

export function CategoryBadge({ category, size }: CategoryBadgeProps) {
  return (
    <Badge
      style={{
        backgroundColor: CATEGORY_LIGHT_COLORS[category],
        color: CATEGORY_COLORS[category],
      }}
      className={cn(size === 'sm' && 'text-2xs px-1.5 py-0')}
    >
      {category}
    </Badge>
  );
}
