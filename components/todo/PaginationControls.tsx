import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Fragment } from 'react';

import { ITEMS_PER_PAGE_OPTIONS } from '@/lib/configMap';
import { PaginationState } from '@/types/todo';

import { Dropdown } from '../shared/Dropdown';
import { Button } from '../ui/button';

interface PaginationControlsProps {
  pagination: PaginationState;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

export function PaginationControls({
  pagination,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
}: PaginationControlsProps) {
  const { currentPage, itemsPerPage } = pagination;

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const visiblePages = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  );

  return (
    <div>
      <div className="flex justify-end pt-2 text-2xs text-neutral-400 text-center tabular-nums">
        Showing {startItem}-{endItem} of {totalItems} task{totalItems > 1 ? 's' : ''}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <span>Show</span>
          <Dropdown
            value={String(itemsPerPage)}
            onChange={(v) => {
              onItemsPerPageChange(Number(v));
              onPageChange(1);
            }}
            options={ITEMS_PER_PAGE_OPTIONS}
            className="w-16 h-7 text-xs"
          />
          <span>per page</span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 sm:w-7 sm:h-7"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={14} />
          </Button>

          {visiblePages.map((page, idx) => {
            const prevPage = visiblePages[idx - 1];
            const showEllipsis = prevPage && page - prevPage > 1;

            return (
              <Fragment key={page}>
                {showEllipsis && <span className="px-1 text-xs text-neutral-400">...</span>}

                <Button
                  variant={page === currentPage ? 'default' : 'ghost'}
                  size="icon"
                  className="w-8 h-8 sm:w-7 sm:h-7 text-xs"
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </Button>
              </Fragment>
            );
          })}

          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 sm:w-7 sm:h-7"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={14} />
          </Button>
        </div>

        <div className="text-xs text-neutral-500 font-medium tabular-nums select-none">
          Page <span>{currentPage}</span> of <span>{totalPages}</span>
        </div>
      </div>
    </div>
  );
}
