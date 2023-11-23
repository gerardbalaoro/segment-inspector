import { Button } from '@components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@components/ui/dropdown-menu';
import useTheme from '@root/src/shared/hooks/useTheme';
import { BanIcon, MoonIcon, RotateCwIcon, SunIcon } from 'lucide-react';
import { Else, If, Then } from 'react-if';
import browser from 'webextension-polyfill';

type Props = {
  onClearEvents: () => void;
};

export default function ActionBar({ onClearEvents }: Props) {
  const theme = useTheme();
  const refresh = () => browser.devtools.inspectedWindow.reload();

  return (
    <div className="flex gap-0.5 xs:gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild={true}>
          <Button variant="ghost" size="icon" title="Change Theme" className="w-8 h-8">
            <span className="w-4 h-4">
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
