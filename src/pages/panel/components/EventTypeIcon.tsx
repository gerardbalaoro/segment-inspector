import {
  AppWindowIcon,
  AtSignIcon,
  CheckCircle2Icon,
  FingerprintIcon,
  GanttChartSquareIcon,
  GroupIcon,
  type LucideIcon,
} from 'lucide-react';
import { SegmentEventType } from '../../../shared/segment';

const icons: Record<SegmentEventType, LucideIcon> = {
  alias: AtSignIcon,
  group: GroupIcon,
  identify: FingerprintIcon,
  page: GanttChartSquareIcon,
  screen: AppWindowIcon,
  track: CheckCircle2Icon,
};

type Props = React.HTMLAttributes<HTMLOrSVGElement> & {
  type: SegmentEventType;
};

export default function EventTypeIcon({ type, ...props }: Props) {
  const Icon = icons[type] || CheckCircle2Icon;

  return <Icon {...props} />;
}
