"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const SESSION_DURATION = 60 * 60 * 24 * 7; // 1 week

export async function setSessionCookie(idToken: string) {
  try {
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION * 1000,
    });

    (await cookies()).set({
      name: "session",
      value: sessionCookie,
      maxAge: SESSION_DURATION,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
  } catch (error) {
    console.error("Error setting session cookie:", error);
    throw new Error("Failed to set session cookie");
  }
}

export async function signUp(params: SignUpParams) {
  try {
    const userDoc = await db.collection("users").doc(params.uid).get();
    
    if (userDoc.exists) {
      return {
        success: false,
        message: "User already exists. Please sign in.",
      };
    }

    await db.collection("users").doc(params.uid).set({
      name: params.name,
      email: params.email,
      createdAt: new Date().toISOString(),
    });

    revalidatePath("/");
    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: any) {
    console.error("Sign-up error:", error);

    return {
      success: false,
      message: error.code === "auth/email-already-exists" 
        ? "This email is already in use" 
        : "Failed to create account",
    };
  }
}

export async function signIn(params: SignInParams) {
  try {
    const decodedToken = await auth.verifyIdToken(params.idToken);
    if (!decodedToken) throw new Error("Invalid token");

    const userSnapshot = await db.collection("users")
      .where("email", "==", params.email)
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      return {
        success: false,
        message: "User not found. Please sign up.",
      };
    }

    await setSessionCookie(params.idToken);
    revalidatePath("/");
    
    return {
      success: true,
      message: "Successfully signed in",
      userId: decodedToken.uid,
    };
  } catch (error) {
    console.error("Sign-in error:", error);
    return {
      success: false,
      message: "Failed to authenticate",
    };
  }
}

export async function signOut() {
  try {
    (await cookies()).delete("session");
    revalidatePath("/");
    return { success: true, message: "Signed out successfully" };
  } catch (error) {
    console.error("Sign-out error:", error);
    return { success: false, message: "Failed to sign out" };
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const sessionCookie = (await cookies()).get("session")?.value;
    if (!sessionCookie) return null;

    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userDoc = await db.collection("users").doc(decodedClaims.uid).get();

    return userDoc.exists ? { 
      ...userDoc.data(), 
      id: userDoc.id 
    } as User : null;
  } catch (error) {
    console.error("Session verification failed:", error);
    return null;
  }
}

export async function isAuthenticated() {
  return (await getCurrentUser()) !== null;
}