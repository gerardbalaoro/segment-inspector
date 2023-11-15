import type { CoreSegmentEvent, SegmentEventType } from '@segment/analytics-core';
import dayjs from 'dayjs';
import localizeFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizeFormat);

export { SegmentEventType };

export class SegmentEvent {
  constructor(public data: CoreSegmentEvent) {}

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
        return this.data.name ?? this.data.properties.path ?? this.data.context.page.path;
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
