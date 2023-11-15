import { Button } from '@components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@components/ui/dropdown-menu';
import useEventStore from '@root/src/shared/hooks/useEventStore';
import useTheme from '@root/src/shared/hooks/useTheme';
import { BanIcon, MoonIcon, RotateCwIcon, SunIcon } from 'lucide-react';
import { Else, If, Then } from 'react-if';

export default function ActionBar() {
  const theme = useTheme();
  const { clear } = useEventStore();

  const refresh = () => {
    const tab = chrome?.devtools?.inspectedWindow?.tabId;

    if (typeof tab === 'undefined') {
      return;
    }

    chrome.tabs.reload(tab);
  };

  return (
    <div className="flex gap-0.5 xs:gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild={true}>
          <Button variant="ghost" size="icon" title="Change Theme" className="h-8 w-8 xs:h-10 xs:w-10">
            <span className="h-4 w-4 xs:h-5 xs:w-5">
              <If condition={theme.isDarkMode}>
                <Then>
                  <MoonIcon />
                </Then>
                <Else>
                  <SunIcon />
                </Else>
              </If>
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => theme.setLight()}>Light</DropdownMenuItem>
          <DropdownMenuItem onClick={() => theme.setDark()}>Dark</DropdownMenuItem>
          <DropdownMenuItem onClick={() => theme.setAuto()}>System</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="ghost" size="icon" title="Clear Events" className="h-8 w-8 xs:h-10 xs:w-10" onClick={clear}>
        <span className="h-4 w-4 xs:h-5 xs:w-5">
          <BanIcon />
        </span>
      </Button>
      <Button variant="ghost" size="icon" title="Reload Page" className="h-8 w-8 xs:h-10 xs:w-10" onClick={refresh}>
        <span className="h-4 w-4 xs:h-5 xs:w-5">
          <RotateCwIcon />
        </span>
      </Button>
    </div>
  );
}
