import { cn } from '@src/shared/utils/ui';
import JsonView from '@uiw/react-json-view';
import { ChevronDownIcon, CopyIcon } from 'lucide-react';
import { SegmentEvent } from '../../../shared/segment';

import useTheme from '@root/src/shared/hooks/useTheme';
import { get } from 'radash';

const lightColors: Record<string, string> = {
  '--w-rjv-color': '#6f42c1',
  '--w-rjv-key-string': '#6f42c1',
  '--w-rjv-background-color': '#ffffff',
  '--w-rjv-line-color': '#ddd',
  '--w-rjv-arrow-color': '#6e7781',
  '--w-rjv-edit-color': 'var(--w-rjv-color)',
  '--w-rjv-info-color': '#0000004d',
  '--w-rjv-update-color': '#ebcb8b',
  '--w-rjv-copied-color': '#002b36',
  '--w-rjv-copied-success-color': '#28a745',
  '--w-rjv-curlybraces-color': '#6a737d',
  '--w-rjv-colon-color': '#24292e',
  '--w-rjv-brackets-color': '#6a737d',
  '--w-rjv-quotes-color': 'var(--w-rjv-key-string)',
  '--w-rjv-quotes-string-color': 'var(--w-rjv-type-string-color)',
  '--w-rjv-type-string-color': '#032f62',
  '--w-rjv-type-int-color': '#005cc5',
  '--w-rjv-type-float-color': '#005cc5',
  '--w-rjv-type-bigint-color': '#005cc5',
  '--w-rjv-type-boolean-color': '#d73a49',
  '--w-rjv-type-date-color': '#005cc5',
  '--w-rjv-type-url-color': '#0969da',
  '--w-rjv-type-null-color': '#d73a49',
  '--w-rjv-type-nan-color': '#859900',
  '--w-rjv-type-undefined-color': '#005cc5',
};

const darkColors: Record<string, string> = {
  '--w-rjv-color': '#79c0ff',
  '--w-rjv-key-string': '#79c0ff',
  '--w-rjv-background-color': 'inherit',
  '--w-rjv-line-color': '#94949480',
  '--w-rjv-arrow-color': '#ccc',
  '--w-rjv-edit-color': 'var(--w-rjv-color)',
  '--w-rjv-info-color': '#7b7b7b',
  '--w-rjv-update-color': '#ebcb8b',
  '--w-rjv-copied-color': '#79c0ff',
  '--w-rjv-copied-success-color': '#28a745',
  '--w-rjv-curlybraces-color': '#8b949e',
  '--w-rjv-colon-color': '#c9d1d9',
  '--w-rjv-brackets-color': '#8b949e',
  '--w-rjv-quotes-color': 'var(--w-rjv-key-string)',
  '--w-rjv-quotes-string-color': 'var(--w-rjv-type-string-color)',
  '--w-rjv-type-string-color': '#a5d6ff',
  '--w-rjv-type-int-color': '#79c0ff',
  '--w-rjv-type-float-color': '#79c0ff',
  '--w-rjv-type-bigint-color': '#79c0ff',
  '--w-rjv-type-boolean-color': '#ffab70',
  '--w-rjv-type-date-color': '#79c0ff',
  '--w-rjv-type-url-color': '#4facff',
  '--w-rjv-type-null-color': '#ff7b72',
  '--w-rjv-type-nan-color': '#859900',
  '--w-rjv-type-undefined-color': '#79c0ff',
};

export default function EventViewJson({ event }: { event: SegmentEvent }) {
  const { isDarkMode } = useTheme();

  const copy = value => {
    if (typeof document === 'undefined') return;
    const textarea = document.createElement('textarea');
    textarea.textContent = JSON.stringify(value);
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  };

  return (
    <JsonView
      id="json-viewer"
      className="h-full w-full overflow-auto p-4 !font-mono !text-xs !leading-4"
      style={isDarkMode ? darkColors : lightColors}
      indentWidth={12}
      value={event.data}
      objectSortKeys={true}
      displayDataTypes={false}
      displayObjectSize={false}
    >
      <JsonView.Arrow>
        <ChevronDownIcon className="h-4 w-4" />
      </JsonView.Arrow>
      <JsonView.Copied
        render={({ className, ...props }, { value }) => {
          const click: React.MouseEventHandler = e => {
            e.stopPropagation();
            copy(value);
          };
          return (
            <button onClick={click}>
              <CopyIcon
                className={cn(
                  'mx-2 inline h-3 w-3 cursor-pointer text-slate-400',
                  !!get(props, 'data-copied', false) && 'text-primary-300',
                  className,
                )}
              />
            </button>
          );
        }}
      />
    </JsonView>
  );
}
