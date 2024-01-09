'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './Navbar.css';
import logo from './logo.png';
import { useRouter } from 'next/navigation';

const Navbar = () => {
    const router = useRouter();

    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [showMenu, setShowMenu] = useState({
        movie: false,
        screen: false,
        schedule: false,
        promotion: false,
        banner: false,
    });

    const handleMouse = (menu: any, isEnter: Boolean) => {
        setShowMenu({ ...showMenu, [menu]: isEnter });
    };

    const handleRedirect = (path: any) => {
        router.push(path); // Chuyển hướng đến đường dẫn đã xác định khi click
    };

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
                        <div className="link" onMouseEnter={() => handleMouse('movie', true)} onMouseLeave={() => handleMouse('movie', false)}>
                            <Link href='/pages/movie'>Phim</Link>
                            {/* Menu thêm/xóa phim */}
                            {showMenu.movie && (
                                <div className='menu'>
                                    <button onClick={() => handleRedirect('/pages/movie/createmovie')}>Thêm phim</button>
                                    <button onClick={() => handleRedirect('/pages/movie/deletemovie')}>Xóa phim</button>
                                </div>
                            )}
                        </div>

                        <div className="link" onMouseEnter={() => handleMouse('screen', true)} onMouseLeave={() => handleMouse('screen', false)}>
                            <Link href='/pages/screen'>Phòng chiếu</Link>
                            {showMenu.screen && (
                                <div className='menu'>
                                    <button onClick={() => handleRedirect('/pages/screen/createscreen')}>Thêm phòng chiếu</button>
                                    <button onClick={() => handleRedirect('/pages/screen/editscreen')}>Sửa phòng chiếu</button>
                                    <button onClick={() => handleRedirect('/pages/screen/deletescreen')}>Xóa phòng chiếu</button>
                                </div>
                            )}
                        </div>

                        <div className="link" onMouseEnter={() => handleMouse('schedule', true)} onMouseLeave={() => handleMouse('schedule', false)}>
                            <Link href='/pages/schedule'>Lịch chiếu</Link>
                            {showMenu.schedule && (
                                <div className='menu'>
                                    <button onClick={() => handleRedirect('/pages/schedule/createschedule')}>Thêm lịch chiếu</button>
                                    <button onClick={() => handleRedirect('/pages/schedule/deleteschedule')}>Xóa lịch chiếu</button>

                                </div>
                            )}
                        </div>
                        <div className="link" onMouseEnter={() => handleMouse('promotion', true)} onMouseLeave={() => handleMouse('promotion', false)}>
                            <Link href='/pages/promotion'>Khuyến mãi</Link>
                            {showMenu.promotion && (
                                <div className='menu'>
                                    <button onClick={() => handleRedirect('/promotion/createpromotion')}>Thêm khuyến mãi</button>
                                    <button onClick={() => handleRedirect('/promotion/deletepromotion')}>Xóa khuyến mãi</button>
                                </div>
                            )}
                        </div>

                        <div className="link" onMouseEnter={() => handleMouse('banner', true)} onMouseLeave={() => handleMouse('banner', false)}>
                            <Link href='/pages/banner'>Banner</Link>
                            {showMenu.banner && (
                                <div className='menu'>
                                    <button onClick={() => handleRedirect('/pages/banner')}>Thêm/ xóa Banner</button>
                                </div>
                            )}
                        </div>                        {/* Nút để đăng xuất */}
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
        </div >
    )
}

export default Navbar;