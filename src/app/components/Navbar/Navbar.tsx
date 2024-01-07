'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './Navbar.css';
import logo from './logo.png';

const Navbar = () => {
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const checkAdminAuthentication = async () => {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/admin/checklogin', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'

            });
            if (response.ok) {
                // Admin is authenticated
                setIsAdminAuthenticated(true);
            } else {
                // Admin is not authenticated
                setIsAdminAuthenticated(false);

            }
        }
        catch (error) {
            console.error('An error occurred during admin authentication check', error);
            setIsAdminAuthenticated(false);

        }
    }

    useEffect(() => {
        checkAdminAuthentication();
    }, []);
    const handleLogout = async () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/admin/logout`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
            .then((res) => {
                return res.json();
            })
            .then((response) => {
                console.log(response)
                if (response.ok) {
                    if (typeof window !== 'undefined') {
                        window.location.href = "/"
                    }
                }

            })
            .catch((error) => {
                console.log(error)
                if (typeof window !== 'undefined') {
                    window.location.href = "/admin/signin"
                }
            })
    }
    return (
        <div className='navbar'>
            <Image src={logo} alt="Logo" width={100} className='logo' />


            <div className='adminlinks'>
                {/* Hiển thị các liên kết cho admin đã đăng nhập */}
                {isAdminAuthenticated ? (
                    <>
                        <Link href='/pages/user/'>Tài khoản người dùng</Link>
                        <Link href='/pages/movie/'>Phim</Link>
                        <Link href='/pages/screen'>Phòng chiếu</Link>
                        <Link href='/pages/schedule'>Lịch chiếu</Link>
                        <Link href='/pages/promotion'>Khuyến mãi</Link>
                        <Link href='/pages/banner'>Banner</Link>
                        {/* Nút để đăng xuất */}
                        <button onClick={handleLogout}>Đăng xuất</button>
                    </>
                ) : (
                    <>
                        {/* Hiển thị liên kết đăng nhập/đăng ký nếu admin chưa đăng nhập */}
                        <Link href='/pages/auth/signin'>Đăng nhập</Link>
                        <Link href='/pages/auth/signup'>Đăng ký</Link>
                    </>
                )}
            </div>
        </div>
    )
}

export default Navbar;