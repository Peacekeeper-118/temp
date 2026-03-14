// services/migrationService.ts
import { db } from './firebase';
import { collection, getDocs, addDoc, setDoc, doc, query, limit, getDoc } from 'firebase/firestore';
import { MOCK_POSTS, MOCK_ORDERS, MOCK_USER } from '../constants';

/**
 * Seed initial data to Firestore if collections are empty
 * This preserves the design without disrupting the UI
 */
export const seedFirebaseData = async () => {
  try {
    // Check if data already exists
    const postsRef = collection(db, 'posts');
    const usersRef = collection(db, 'users');
    const ordersRef = collection(db, 'orders');

    const postsSnapshot = await getDocs(query(postsRef, limit(1)));
    const usersSnapshot = await getDocs(query(usersRef, limit(1)));
    const ordersSnapshot = await getDocs(query(ordersRef, limit(1)));

    // If data already exists, skip seeding
    if (!postsSnapshot.empty || !usersSnapshot.empty) {
      console.log('Data already exists in Firestore, skipping seed');
      return;
    }

    console.log('Seeding Firestore with initial data...');

    // Seed user
    if (MOCK_USER) {
      await setDoc(doc(usersRef, MOCK_USER.id), MOCK_USER);
      console.log('Seeded user:', MOCK_USER.id);
    }

    // Seed posts
    for (const post of MOCK_POSTS) {
      await setDoc(doc(postsRef, post.id), post);
      console.log('Seeded post:', post.id);
    }

    // Seed orders
    for (const order of MOCK_ORDERS) {
      await setDoc(doc(ordersRef, order.id), order);
      console.log('Seeded order:', order.id);
    }

    console.log('✅ Firestore seeding completed successfully');
  } catch (error) {
    console.error('❌ Error seeding Firestore:', error);
    throw error;
  }
};

/**
 * Fetch all posts from Firestore
 */
export const fetchPostsFromFirebase = async () => {
  try {
    const postsRef = collection(db, 'posts');
    const snapshot = await getDocs(postsRef);
    const posts = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));
    console.log(`Fetched ${posts.length} posts from Firestore`);
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

/**
 * Fetch all orders from Firestore
 */
export const fetchOrdersFromFirebase = async () => {
  try {
    const ordersRef = collection(db, 'orders');
    const snapshot = await getDocs(ordersRef);
    const orders = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));
    console.log(`Fetched ${orders.length} orders from Firestore`);
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

/**
 * Fetch user by ID from Firestore
 */
export const fetchUserFromFirebase = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const snapshot = await getDoc(userRef);
    
    if (snapshot.exists()) {
      console.log(`Fetched user from Firestore`);
      return snapshot.data() as any;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

/**
 * Add a new post to Firestore
 */
export const addPostToFirebase = async (post: any) => {
  try {
    const postsRef = collection(db, 'posts');
    const docRef = await addDoc(postsRef, {
      ...post,
      createdAt: new Date().toISOString()
    });
    console.log('Post added to Firestore:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding post:', error);
    throw error;
  }
};
