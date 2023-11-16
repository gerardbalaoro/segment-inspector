import {
  AppWindowIcon,
  AtSignIcon,
  FileIcon,
  FingerprintIcon,
  GroupIcon,
  RadioIcon,
  type LucideIcon,
} from 'lucide-react';
import { SegmentEventType } from '../../../shared/segment';

const icons: Record<SegmentEventType, LucideIcon> = {
  alias: AtSignIcon,
  group: GroupIcon,
  identify: FingerprintIcon,
  page: FileIcon,
  screen: AppWindowIcon,
  track: RadioIcon,
};

type Props = React.HTMLAttributes<HTMLOrSVGElement> & {
  type: SegmentEventType;
};

export default function EventTypeIcon({ type, ...props }: Props) {
  const Icon = icons[type] || RadioIcon;

  return <Icon {...props} />;
}
