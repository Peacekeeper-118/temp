
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

// Regex patterns to block (Backend Source of Truth)
const PATTERNS = {
  PHONE: /(\b\d{10}\b|\b\d{3}[-.]?\d{3}[-.]?\d{4}\b)/,
  EMAIL: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
  SOCIAL: /(@[a-zA-Z0-9_.]+)/, 
  URL: /(https?:\/\/[^\s]+)|(www\.[^\s]+)/,
  PAYMENT: /\b(upi|paytm|gpay|phonepe|cash|google pay)\b/i
};

// Cloud Function: moderateText
exports.moderateText = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
  }

  const { text, type } = data;
  let cleanedText = text;
  let flagged = false;

  // Masking Logic
  if (PATTERNS.PHONE.test(text)) {
      cleanedText = cleanedText.replace(PATTERNS.PHONE, '[contact removed]');
      flagged = true;
  }
  if (PATTERNS.EMAIL.test(text)) {
      cleanedText = cleanedText.replace(PATTERNS.EMAIL, '[contact removed]');
      flagged = true;
  }
  if (PATTERNS.SOCIAL.test(text)) {
      cleanedText = cleanedText.replace(PATTERNS.SOCIAL, '[contact removed]');
      flagged = true;
  }
  if (PATTERNS.URL.test(text)) {
      cleanedText = cleanedText.replace(PATTERNS.URL, '[link removed]');
      flagged = true;
  }
  if (PATTERNS.PAYMENT.test(text)) {
      cleanedText = cleanedText.replace(PATTERNS.PAYMENT, '[payment info removed]');
      flagged = true;
  }

  // Log Violation if Flagged
  if (flagged) {
    await db.collection('moderation').add({
      userId: context.auth.uid,
      originalText: text,
      cleanedText: cleanedText,
      type: type || 'unknown',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      reviewed: false
    });
  }

  return { flagged, cleanedText };
});

// Cloud Function: removeBackground
// Simulates AI background removal processing
exports.removeBackground = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
    }

    const { imageBase64 } = data;
    
    // 1. Rate Limiting Check (Mock)
    // In production: await rateLimiter.check(context.auth.uid);

    // 2. Validate Image
    if (!imageBase64 || typeof imageBase64 !== 'string') {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid image data');
    }

    // 3. Simulate Processing Delay (AI Model Inference)
    // In production: Call external API (e.g., remove.bg, Cloud Vision, or custom Python service)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 4. Return "Cleaned" Image
    // For this mock, we return the same image but flag it as processed.
    // In production: return the actual PNG buffer with alpha channel.
    
    return {
        success: true,
        cleanedImageBase64: imageBase64, // Mock: echoing back
        metadata: {
            method: 'server',
            model: 'u2net_v4',
            confidence: 0.98,
            processingTimeMs: 2000,
            originalSize: '1024x1024', // Mock
            crop: { x: 10, y: 10, width: 1000, height: 1000 } // Mock crop box
        }
    };
});

// Cloud Function: qnaRelay
// Acts as a middleman between Buyer -> Seller to prevent direct contact leakage
exports.qnaRelay = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
  }

  const { postId, questionText, questionTag } = data;
  
  // 1. Moderate the question first
  let cleanedText = questionText;
  let flagged = false;
  
  // (Reuse moderation logic or call internal helper)
  if (PATTERNS.PHONE.test(questionText) || PATTERNS.EMAIL.test(questionText)) {
      cleanedText = "Message blocked due to safety policy violation.";
      flagged = true;
  }

  // 2. Fetch Post to get Seller ID
  const postDoc = await db.collection('posts').doc(postId).get();
  if (!postDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Post not found.');
  }
  const post = postDoc.data();

  // 3. Create Q&A Document
  const qnaRef = await db.collection('qna').add({
      postId: postId,
      itemTitle: post.description,
      itemImage: post.imageUrl,
      buyerId: context.auth.uid,
      sellerId: post.userId,
      question: cleanedText,
      questionTag: questionTag,
      isAnswered: false,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      moderationStatus: flagged ? 'REJECTED' : 'PENDING'
  });

  return { success: true, qnaId: qnaRef.id, flagged };
});

// Cloud Function: createOrder
exports.createOrder = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
    }

    const { postId } = data;
    const postRef = db.collection('posts').doc(postId);
    const postDoc = await postRef.get();

    if (!postDoc.exists) throw new functions.https.HttpsError('not-found', 'Item not found');
    const post = postDoc.data();
    if (post.isSold) throw new functions.https.HttpsError('failed-precondition', 'Item already sold');

    // Calculate Fees
    const settingsDoc = await db.collection('admin').doc('settings').get();
    const settings = settingsDoc.data() || { commissionRate: 0.1, refreshedFee: 50, deliveryFeeBase: 40 };

    const itemPrice = post.price;
    const commission = itemPrice * settings.commissionRate;
    const totalAmount = itemPrice + settings.refreshedFee + settings.deliveryFeeBase;

    // Create Order
    const orderRef = await db.collection('orders').add({
        itemId: postId,
        buyerId: context.auth.uid,
        sellerId: post.userId,
        price: itemPrice,
        fees: {
            commission,
            refreshed: settings.refreshedFee,
            delivery: settings.deliveryFeeBase
        },
        totalAmount,
        status: 'created', // pending payment
        payoutStatus: 'pending',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { orderId: orderRef.id, totalAmount, currency: 'INR' };
});
