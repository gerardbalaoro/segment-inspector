import { createStorage, StorageType } from '@src/shared/storages/base';
import { SegmentEventData } from '../segment';

type EventRecord = Record<string, SegmentEventData[]>;

const storage = createStorage<EventRecord>(
  'events',
  {},
  {
    storageType: StorageType.Session,
  },
);

export default {
  async get(key: string) {
    const records = (await storage.get()) || {};
    const data = records[key];

    return Array.isArray(data) ? data : [];
  },
  async set(key: string, data: SegmentEventData[]) {
    const records = (await storage.get()) || {};

    records[key] = data;

    storage.set(records);
  },
};
