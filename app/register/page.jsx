"use client";
import React from 'react';
import Link from 'next/link';

const Register = () => {

    const handleRegister = (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value;
        const photo = form.photo.value;
        const email = form.email.value;
        const password = form.password.value;
        console.log({ name, photo, email, password });
    }

    return (
        <div className='flex justify-center min-h-screen items-center'>
            <div className="card py-5 bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                <h2 className='font-semibold text-2xl text-center'>Register your account</h2>
                <form onSubmit={handleRegister} className="card-body">
                    <fieldset className="fieldset">

                        <label className="label">Name</label>
                        <input 
                            name='name' 
                            type="text" 
                            className="input" 
                            placeholder="Name" 
                            required
                        />

                        <label className="label">Photo URL</label>
                        <input 
                            name='photo' 
                            type="text" 
                            className="input" 
                            placeholder="Photo url" 
                            required
                        />

                        <label className="label">Email</label>
                        <input 
                            name='email' 
                            type="email" 
                            className="input" 
                            placeholder="Email" 
                            required
                        />

                        <label className="label">Password</label>
                        <input 
                            name='password' 
                            type="password" 
                            className="input" 
                            placeholder="Password" 
                            required
                        />

                        <button type='submit' className="btn btn-neutral mt-4">Register</button>

                        {/* to='/auth/login' বদলে href='/login' করা হয়েছে */}
                        <p className='font-semibold text-center pt-5'>
                            Already Have An Account ? <Link className='text-secondary' href='/login'>Login</Link>
                        </p>

                    </fieldset>
                </form>
            </div>
        </div>
    );
};

export default Register;