import { FileText } from 'lucide-react';

import { downloadTemplate } from '@/lib/excelUtils';

import { Button } from '../ui/button';

interface TemplateButtonProps {
  className?: string;
  showLabel?: boolean;
}

export function TemplateButton({ className, showLabel }: TemplateButtonProps) {
  return (
    <Button
      variant="outline"
      size={showLabel ? 'default' : 'icon'}
      onClick={downloadTemplate}
      className={className}
    >
      <FileText size={16} />
      {showLabel && <span className="hidden lg:inline ml-2 text-sm">Template</span>}
    </Button>
  );
}
