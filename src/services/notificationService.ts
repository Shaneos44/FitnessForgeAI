import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where, updateDoc, doc, orderBy, serverTimestamp } from 'firebase/firestore';

export interface Notification {
  id?: string;
  type: 'reminder' | 'award' | 'pb' | 'motivation';
  message: string;
  timestamp: any;
  read: boolean;
  relatedWorkoutId?: string;
}

export const addNotification = async (userId: string, notification: Omit<Notification, 'id' | 'timestamp'>) => {
  const ref = collection(db, 'users', userId, 'notifications');
  await addDoc(ref, {
    ...notification,
    timestamp: serverTimestamp(),
  });
};

export const getNotifications = async (userId: string) => {
  const ref = collection(db, 'users', userId, 'notifications');
  const q = query(ref, orderBy('timestamp', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Notification[];
};

export const markNotificationRead = async (userId: string, notificationId: string) => {
  const ref = doc(db, 'users', userId, 'notifications', notificationId);
  await updateDoc(ref, { read: true });
};
