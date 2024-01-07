'use client'
import React, { useState } from 'react';
import '../auth.css';
import { ToastContainer, toast } from 'react-toastify';


const SigninPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignin = async () => {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                // Handle successful signup, e.g., show a success message
                console.log('Admin login successful', data);

                toast.success('Admin Login Successful', {
                    position: toast.POSITION.TOP_CENTER,
                });
                window.location.href = '/'; // Điều hướng đến trang chủ


            } else {
                // Handle signup error
                console.error('Admin login failed', response.statusText);
                toast.error('Admin Login Failed', {
                    position: toast.POSITION.TOP_CENTER,
                });
            }
        }

        catch (error) {
            toast.error('An error occured while signing in');
            console.error('An error occured while signing in', error);

        }
    }



    return (
        <div className='formpage'>
            <div className='tdn'>
                <label>Tên đăng nhập</label>
                <input
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label>Mật khẩu</label>
                <input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <button onClick={handleSignin}>Sign in</button>
        </div>
    )
}

export default SigninPage