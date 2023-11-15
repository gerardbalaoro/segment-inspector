import {
  AppWindowIcon,
  AtSignIcon,
  FileIcon,
  RadioIcon,
  UserCircleIcon,
  UsersIcon,
  type LucideIcon,
} from 'lucide-react';
import { SegmentEventType } from '../../../shared/segment';

const icons: Record<SegmentEventType, LucideIcon> = {
  alias: AtSignIcon,
  group: UsersIcon,
  identify: UserCircleIcon,
  page: FileIcon,
  screen: AppWindowIcon,
  track: RadioIcon,
};

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  type: SegmentEventType;
};

export default function EventTypeIcon({ type, ...props }: Props) {
  const Icon = icons[type] || RadioIcon;

  return (
    <div {...props}>
      <Icon />
    </div>
  );
}
