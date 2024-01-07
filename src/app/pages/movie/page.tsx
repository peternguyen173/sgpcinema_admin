import React from "react";
import Link from "next/link";

const ManagementPage = () => {
    return (
        <div className="management-page">
            <h1>Quản lý phim</h1>
            <div className="buttons">
                <Link href="/pages/movie/createmovie">
                    <button>Tạo phim mới</button>
                </Link>
                <Link href="/pages/movie/editmovie">
                    <button>Sửa thông tin phim</button>
                </Link>
                <Link href="/pages/movie/deletemovie">
                    <button>Xóa phim</button>
                </Link>
            </div>
        </div>
    );
};

export default ManagementPage;
