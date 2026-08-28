"use client";

import React from 'react';
import Link from 'next/link';

const Login = () => {
  const handleLogin = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    console.log({ email, password });
  };

  return (
    <div className='flex justify-center min-h-screen items-center'>
      <div className="card py-5 bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
        <h2 className='font-semibold text-2xl text-center'>Login your account</h2>
        <form onSubmit={handleLogin} className="card-body">
          <fieldset className="fieldset">
            <label className="label">Email</label>
            <input 
              name="email" 
              type="email" 
              className="input" 
              placeholder="Email" 
              required 
            />

            <label className="label">Password</label>
            <input 
              name="password" 
              type="password" 
              className="input" 
              placeholder="Password" 
              required 
            />
            
            <button type="submit" className="btn btn-neutral mt-4">Login</button>
            
            <p className='font-semibold text-center pt-5'>
              Don't Have An Account ? {' '}
              <Link className='text-secondary' href='/register'>
                Register
              </Link>
            </p>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default Login;