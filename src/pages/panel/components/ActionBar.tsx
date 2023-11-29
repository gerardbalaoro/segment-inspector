import { Button } from '@components/ui/button';
import { BanIcon, RotateCwIcon } from 'lucide-react';
import browser from 'webextension-polyfill';

type Props = {
  onClearEvents: () => void;
};

export default function ActionBar({ onClearEvents }: Props) {
  const refresh = () => browser.devtools.inspectedWindow.reload();

  return (
    <div className="flex gap-0.5 xs:gap-1">
      <Button variant="ghost" size="icon" title="Clear Events" className="w-8 h-8" onClick={onClearEvents}>
        <span className="w-4 h-4">
          <BanIcon />
        </span>
      </Button>
      <Button variant="ghost" size="icon" title="Reload Page" className="w-8 h-8" onClick={refresh}>
        <span className="w-4 h-4">
          <RotateCwIcon />
        </span>
      </Button>
    </div>
  );
}
