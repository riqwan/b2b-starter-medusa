"use server" // Mark server actions if needed, but local storage access is client-side

import { cookies } from "next/headers" // Use cookies for server-side persistence if preferred

// --- Local Storage Implementation (Client-Side) ---
// Note: These functions should ideally be called from client components or useEffect hooks.
// If called in Server Components/Actions, they won't work as expected.

// export const setGuestIdLocalStorage = (guestId: string): void => {
//   if (typeof window !== 'undefined') {
//     localStorage.setItem('_medusa_guest_id', guestId);
//   }
// };

// export const getGuestIdLocalStorage = (): string | null => {
//   if (typeof window !== 'undefined') {
//     return localStorage.getItem('_medusa_guest_id');
//   }
//   return null;
// };

// export const removeGuestIdLocalStorage = (): void => {
//   if (typeof window !== 'undefined') {
//     localStorage.removeItem('_medusa_guest_id');
//   }
// };


// --- Cookie Implementation (Server & Client Accessible) ---
// Preferred for Next.js App Router to work across Server/Client boundaries

export const setGuestId = async (guestId: string): Promise<void> => {
  const cookieStore = cookies()
  cookieStore.set('_medusa_guest_id', guestId, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days expiry
    httpOnly: true, // Recommended for security
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })
};

export const getGuestId = async (): Promise<string | undefined> => {
  const cookieStore = cookies()
  return cookieStore.get('_medusa_guest_id')?.value;
};

export const removeGuestId = async (): Promise<void> => {
  const cookieStore = cookies()
  cookieStore.set('_medusa_guest_id', '', {
      path: '/',
      maxAge: -1, // Expire the cookie
  })
};
