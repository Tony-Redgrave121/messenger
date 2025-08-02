import { openDB } from 'idb';

const DB_NAME = 'cweb-account-1';

const MESSAGES_STORE = 'messages';
const STORES = [MESSAGES_STORE];

type CachedMedia = {
    blob: Blob;
    last_used: number;
};

const dbPromise = openDB(DB_NAME, 1, {
    upgrade(db) {
        STORES.map(store => {
            if (!db.objectStoreNames.contains(store)) {
                db.createObjectStore(store);
            }
        });
    },
});

export const getMedia = async (key: string): Promise<Blob | null> => {
    const db = await dbPromise;
    const data = await db.get(MESSAGES_STORE, key);

    if (data?.blob && data?.last_used !== undefined) {
        const tx = db.transaction(MESSAGES_STORE, 'readwrite');
        await tx.store.put({ ...data, last_used: Date.now() }, key);
        await tx.done;

        return data.blob;
    }

    return null;
};

export const saveMedia = async (blob: Blob, key: string) => {
    const db = await dbPromise;
    const tx = db.transaction(MESSAGES_STORE, 'readwrite');
    await tx.store.put({ blob, last_used: Date.now() }, key);
    await tx.done;
};

export const deleteOldMedias = async (maxTime: number) => {
    const db = await dbPromise;
    const tx = db.transaction(MESSAGES_STORE, 'readwrite');
    const store = tx.objectStore(MESSAGES_STORE);

    const now = Date.now();

    for await (const element of store) {
        const value = element.value as CachedMedia;

        if (!value.last_used || value.last_used < now - maxTime) await element.delete();
    }

    await tx.done;
};
