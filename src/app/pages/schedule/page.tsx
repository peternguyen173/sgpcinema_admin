'use client'
import React from 'react'
import './schedule.css'
import { ToastContainer, toast } from "react-toastify";
import Link from 'next/link';

const page = () => {
    return (
        <div className="management-page">
            <h1>Quản lý phim</h1>
            <div className="buttons">
                <Link href="/pages/schedule/createschedule">
                    <button>Thêm lịch chiếu</button>
                </Link>
                <Link href="/pages/schedule/deleteschedule">
                    <button>Xóa lịch chiếu</button>
                </Link>
            </div>
        </div>
    );
}


export default page