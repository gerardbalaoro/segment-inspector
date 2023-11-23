import type { CoreSegmentEvent, SegmentEventType } from '@segment/analytics-core';
import dayjs from 'dayjs';
import localizeFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizeFormat);

export { CoreSegmentEvent as SegmentEventData, SegmentEventType };

export class SegmentEvent {
  constructor(public data: CoreSegmentEvent) {}

  static validate(data: unknown) {
    if (typeof data === 'object') {
      return 'messageId' in data && 'context' in data && 'anonymousId' in data && 'timestamp' in data && 'type' in data;
    }

    return false;
  }

  get id() {
    return this.data.messageId;
  }

  get type() {
    return this.data.type;
  }

  get timestamp() {
    return dayjs(this.data.sentAt);
  }

  get name(): string {
    switch (this.type) {
      case 'alias':
      case 'identify':
        return this.data.userId;
      case 'track':
        return this.data.event;
      case 'page':
        return this.data.name || this.data.properties.title || this.data.context.page.path;
      case 'screen':
        return this.data.name || 'UNNAMED_SCREEN';
    }

    return '';
  }

  get userId() {
    return this.data.userId;
  }

  get anonymousId() {
    return this.data.anonymousId;
  }

  get context() {
    return this.data.context;
  }

  get properties() {
    return this.data.properties;
  }
}
