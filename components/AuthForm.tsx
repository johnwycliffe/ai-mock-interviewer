"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import FormField from "./FormField"
import { Label } from "@radix-ui/react-label"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase/client"
import { signIn, signUp } from "@/lib/actions/auth.action"

const authFormSchema = (type: FormType) => {
    return z.object({
        name: type === 'sign-up' ? z.string().min(3, "Name must be at least 3 characters") : z.string().optional(),
        email: z.string().email("Please enter a valid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
    })
}

const AuthForm = ({ type }: { type: FormType }) => {
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    const formSchema = authFormSchema(type);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })

    useEffect(() => {
        setIsMounted(true);
    }, []);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (type === 'sign-up') {
                const { name, email, password } = values;
                
                const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
                
                const result = await signUp({
                    uid: userCredentials.user.uid,
                    name: name!,
                    email,
                    password,
                })

                if (!result?.success) {
                    toast.error(result?.message || "Failed to create account");
                    return;
                }
                
                toast.success('Account created successfully. Please sign in.');
                router.push('/sign-in')
            } else {
                const { email, password } = values;
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const idToken = await userCredential.user.getIdToken();

                if (!idToken) {
                    toast.error('Sign in failed: No ID token received')
                    return;
                }

                const result = await signIn({
                    email,
                    idToken
                });

                if (!result?.success) {
                    toast.error(result?.message || 'Sign in failed');
                    return;
                }

                toast.success('Signed in successfully.');
                router.push('/');
            }
        } catch (error: any) {
            console.error('Authentication error:', error);
            
            if (error.code) {
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        toast.error('This email is already registered. Please sign in instead.');
                        break;
                    case 'auth/weak-password':
                        toast.error('Password is too weak. Please use a stronger password.');
                        break;
                    case 'auth/invalid-email':
                        toast.error('Please enter a valid email address.');
                        break;
                    case 'auth/operation-not-allowed':
                        toast.error('Email/password accounts are not enabled.');
                        break;
                    case 'auth/user-not-found':
                    case 'auth/wrong-password':
                        toast.error('Invalid email or password.');
                        break;
                    default:
                        toast.error(`Authentication error: ${error.message}`);
                }
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
        }
    }
    
    const isSignIn = type === 'sign-in';

    if (!isMounted) {
        return null;
    }

    return (
        <div className="card-border lg:min-w-[566px]"> 
            <div className="flex flex-col gap-6 card py-14 px-10">
                <div className="flex flex-row gap-2 justify-center">
                    <Image 
                        src="/logo.svg"  
                        alt="logo" 
                        height={32} 
                        width={38}
                    />
                    <h2 className="text-primary-100">Prep Wiser</h2>
                </div>
                <h3>Practice job interview with AI</h3>
                
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} 
                        className="w-full space-y-6 mt-4 form">
                        {!isSignIn && (
                            <FormField 
                                control={form.control}
                                name="name"
                                label="Name"
                                placeholder="Your Name"
                            />
                        )}
                        <FormField 
                            control={form.control}
                            name="email"
                            label="Email"
                            placeholder="Your email address"
                            type="email"
                        />
                        <FormField 
                            control={form.control}
                            name="password"
                            label="Password"
                            placeholder="Enter your password"
                            type="password"
                        />
                        
                        <Button className="btn" type="submit">
                            {isSignIn ? 'Sign in' : 'Create an Account'}
                        </Button>
                    </form>
                </Form>
                <p className="text-center">
                    {isSignIn ? 'No account yet? ' : "Have an account already?"}
                    <Link 
                        href={!isSignIn ? '/sign-in' : '/sign-up'} 
                        className="font-bold text-user-primary ml-1"
                    >
                        {!isSignIn ? "Sign in" : "Sign up"}
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default AuthForm;



