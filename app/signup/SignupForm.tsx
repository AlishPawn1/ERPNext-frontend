"use client";
import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/api/auth';

type FormValues = {
  name?: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignupForm() {
  const router = useRouter();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    if (values.password !== values.confirmPassword) {
      // Client-side validation fallback
      alert('Passwords do not match');
      return;
    }

    try {
      await signUp({ name: values.name, email: values.email, password: values.password });
      router.push('/dashboard');
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || String(err);
      alert('Signup failed: ' + message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{display: 'grid', gap: 8}}>
      <label>
        <div>Name (optional)</div>
        <input {...register('name')} style={{width: '100%', padding: 8}} />
      </label>

      <label>
        <div>Email</div>
        <input {...register('email', { required: 'Email is required' })} type="email" style={{width: '100%', padding: 8}} />
        {errors.email && <div style={{color: 'red'}}>{errors.email.message}</div>}
      </label>

      <label>
        <div>Password</div>
        <input {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password too short' } })} type="password" style={{width: '100%', padding: 8}} />
        {errors.password && <div style={{color: 'red'}}>{errors.password.message}</div>}
      </label>

      <label>
        <div>Confirm password</div>
        <input {...register('confirmPassword', { required: 'Confirm your password' })} type="password" style={{width: '100%', padding: 8}} />
        {errors.confirmPassword && <div style={{color: 'red'}}>{errors.confirmPassword.message}</div>}
      </label>

      <div>
        <button type="submit" disabled={isSubmitting} style={{padding: '8px 16px'}}>
          {isSubmitting ? 'Creating account…' : 'Sign up'}
        </button>
      </div>
    </form>
  );
}
