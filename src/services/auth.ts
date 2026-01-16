// Authentication Service
// Quản lý authentication với Firebase Auth

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import { getUser, setUser } from './firestore';

/**
 * Đăng ký với email/password
 */
export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<FirebaseUser> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Cập nhật display name
  await updateProfile(user, { displayName });

  // Lưu thông tin user vào Firestore
  try {
    await setUser(user.uid, {
      uid: user.uid,
      email: user.email || '',
      displayName: displayName,
      photoURL: user.photoURL || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      preferences: {
        theme: 'dark',
        language: 'vi',
      },
    });
  } catch (firestoreError: any) {
    console.warn('Không thể lưu user vào Firestore:', firestoreError.message);
  }

  return user;
}

/**
 * Đăng nhập với email/password
 */
export async function loginWithEmail(email: string, password: string): Promise<FirebaseUser> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

/**
 * Đăng nhập với Google (sử dụng popup)
 */
export async function loginWithGoogle(): Promise<FirebaseUser> {
  try {
    const provider = new GoogleAuthProvider();

    // Set custom parameters
    provider.setCustomParameters({
      prompt: 'select_account',
    });

    let userCredential;

    try {
      // Thử dùng popup trước
      userCredential = await signInWithPopup(auth, provider);
    } catch (popupError: any) {
      // Nếu popup bị chặn hoặc lỗi, thử dùng redirect
      if (
        popupError.code === 'auth/popup-blocked' ||
        popupError.code === 'auth/popup-closed-by-user' ||
        popupError.code === 'auth/unauthorized-domain'
      ) {
        console.log('Popup failed, trying redirect...');
        await signInWithRedirect(auth, provider);
        // Redirect sẽ chuyển trang, nên không cần return ở đây
        throw new Error('Đang chuyển hướng để đăng nhập...');
      }
      throw popupError;
    }

    const user = userCredential.user;

    // Kiểm tra xem user đã tồn tại trên Firebase chưa
    try {
      const existingUser = await getUser(user.uid);

      if (!existingUser) {
        // User chưa tồn tại → tạo mới
        console.log('Tạo user mới trên Firebase...');
        await setUser(user.uid, {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
          preferences: {
            theme: 'dark',
            language: 'vi',
          },
        });
      } else {
        // User đã tồn tại → chỉ cập nhật updatedAt
        console.log('User đã tồn tại, cập nhật thông tin...');
        await setUser(user.uid, {
          updatedAt: new Date(),
        });
      }
    } catch (firestoreError: any) {
      console.warn('Không thể lưu user vào Firestore:', firestoreError.message);
      console.warn('User vẫn đăng nhập thành công, nhưng dữ liệu chưa được lưu vào database');
    }

    return user;
  } catch (error: any) {
    console.error('Google login error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);

    // Xử lý các lỗi cụ thể từ Firebase
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Bạn đã đóng cửa sổ đăng nhập');
    }

    if (error.code === 'auth/popup-blocked') {
      throw new Error('Cửa sổ popup bị chặn. Vui lòng cho phép popup và thử lại');
    }

    if (error.code === 'auth/unauthorized-domain') {
      throw new Error(
        'Domain chưa được cấu hình. Vào Firebase Console > Authentication > Settings > Authorized domains và thêm domain của bạn'
      );
    }

    if (error.code === 'auth/operation-not-allowed') {
      throw new Error(
        'Google Authentication chưa được bật. Vào Firebase Console > Authentication > Sign-in method và bật Google'
      );
    }

    if (error.code === 'auth/configuration-not-found') {
      throw new Error(
        'OAuth chưa được cấu hình. Vào Firebase Console > Authentication > Sign-in method và bật Google, sau đó chọn Project support email'
      );
    }

    // Lỗi khác - hiển thị message gốc từ Firebase
    throw error;
  }
}

/**
 * Xử lý kết quả redirect sau khi đăng nhập Google
 * Gọi function này khi app load để kiểm tra xem có redirect result không
 */
export async function handleGoogleRedirect(): Promise<FirebaseUser | null> {
  try {
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      const user = result.user;

      // Kiểm tra xem user đã tồn tại trên Firebase chưa
      try {
        const existingUser = await getUser(user.uid);

        if (!existingUser) {
          // User chưa tồn tại → tạo mới
          console.log('Tạo user mới trên Firebase...');
          await setUser(user.uid, {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            photoURL: user.photoURL || undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
            preferences: {
              theme: 'dark',
              language: 'vi',
            },
          });
        } else {
          // User đã tồn tại → chỉ cập nhật updatedAt
          console.log('User đã tồn tại, cập nhật thông tin...');
          await setUser(user.uid, {
            updatedAt: new Date(),
          });
        }
      } catch (firestoreError: any) {
        console.warn('Không thể lưu user vào Firestore:', firestoreError.message);
      }

      return user;
    }
    return null;
  } catch (error: any) {
    console.error('Google redirect error:', error);
    throw error;
  }
}

/**
 * Đăng xuất
 */
export async function logout(): Promise<void> {
  await signOut(auth);
}

/**
 * Gửi email reset password
 */
export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

/**
 * Cập nhật profile
 */
export async function updateUserProfile(
  displayName?: string,
  photoURL?: string
): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  await updateProfile(user, {
    displayName,
    photoURL,
  });

  // Cập nhật trong Firestore
  await setUser(user.uid, {
    displayName: displayName || user.displayName || '',
    photoURL: photoURL || user.photoURL || undefined,
  });
}
