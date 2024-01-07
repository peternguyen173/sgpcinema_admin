"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import "./user.css"
const UserSearchPage: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');


    const handleSearch = async () => {
        if (email.trim() !== '') {
            try {
                // Gửi yêu cầu đến server để lấy ID từ email
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/admin/getuserbyemail/${email}`);
                const data = await response.json();

                if (data.ok) {
                    // Nếu server trả về dữ liệu OK, cập nhật state với ID tìm được
                    setUserId(data.data._id);
                    setUserName(data.data.name);
                } else {
                    // Xử lý khi không tìm thấy user
                    setUserId('User not found');
                    setUserName('User not found');

                }
            } catch (error) {
                // Xử lý lỗi trong quá trình gửi yêu cầu
                console.error('Error fetching data:', error);
                setUserId('Error fetching data');
                setUserName('Error fetching data');

            }
        }
    };

    const handleViewInfo = () => {
        // Chuyển hướng đến `/user/${userId}` khi nhấn nút Xem thông tin
        window.location.href = `/user/${userId}`;

    };

    return (
        <div className='page'>
            <h1>User Search</h1>
            <input
                type="email"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleSearch}>Tìm kiếm</button>
            <p>Tên người dùng: {userName} {userName && ( // Hiển thị nút Xem thông tin nếu userName không rỗng
                <button onClick={() => router.push(`/pages/user/${userId}`)}>Xem thông tin</button>
            )}</p>

        </div >
    );
};

export default UserSearchPage;