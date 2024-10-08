"use client"
import React, { useEffect, useState } from 'react'
import '../style/auth.css'; // Add the CSS file

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { SignInValidation } from '@/lib/validate'
import { Button } from "@/components/ui/button"
import PropagateLoader from "react-spinners/PropagateLoader"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import { setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from '../../../firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth'
import Link from 'next/link'

const login = () => {
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false)
    const form = useForm<z.infer<typeof SignInValidation>>({
        resolver: zodResolver(SignInValidation),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    // Set persistence in a client component or useEffect hook
    useEffect(() => {
        setPersistence(auth, browserLocalPersistence)
            .then(() => {
                console.log('Persistence set successfully');
            })
            .catch((error) => {
                console.error('Error setting persistence:', error);
            });
    }, []);

    async function onSubmit(values: z.infer<typeof SignInValidation>) {
        setLoading(true)
        try {
            await signInWithEmailAndPassword(auth, values.email, values.password)
        } catch (e) {
            console.error('There was an error with sign in: ', e)
        }
        router.push('/')
        setLoading(false)
    }

    return (
        <div className="auth-center-container-login">
            <Form {...form}>
                <div className="sm:w-420 flex-center flex-col py-3">
                    <h2 className="font-bold text-4xl pb-1 text-center">meatmeal</h2>
                    <h3 className="text-center">Login</h3>
                </div>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your email" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your password" type='password' {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <h3><Link href="/auth/forgotpassword" id="forgot-password">Forgot Password?</Link></h3>
                    <div className="flex justify-center">
                        {loading ? (
                            <PropagateLoader className='align-self-center' />
                        ) : (
                            <Button id="login-button" className="w-full hover:bg-blue-700" type="submit">Login</Button>
                        )}
                    </div>
                    <h3 id="new-to-meatmeal">New to meatmeal? <Link href="/auth/signup" id="join-now">Join now</Link></h3>
                </form>
            </Form>
        </div>
    )
}

export default login;
