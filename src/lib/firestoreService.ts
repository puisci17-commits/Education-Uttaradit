import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from './auth';
import { SchoolRow } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Loads school rows from the user's dedicated Firestore storage.
 */
export async function loadSchoolDataFromFirestore(userId: string): Promise<SchoolRow[] | null> {
  const path = `school_data/${userId}`;
  try {
    const docRef = doc(db, 'school_data', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.rows as SchoolRow[];
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

/**
 * Saves school rows into the user's dedicated Firestore storage.
 */
export async function saveSchoolDataToFirestore(userId: string, rows: SchoolRow[]): Promise<void> {
  const path = `school_data/${userId}`;
  try {
    const docRef = doc(db, 'school_data', userId);
    await setDoc(docRef, {
      rows,
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
