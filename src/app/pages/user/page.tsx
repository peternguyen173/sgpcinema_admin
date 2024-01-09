"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import "./user.css";
interface User {
    _id: string;
    name: string;
    email: string;
    // other properties if there are any
}
const UserSearchPage: React.FC = () => {
    // const router = useRouter();
    // const [email, setEmail] = useState('');
    // const [userId, setUserId] = useState('');
    // const [userName, setUserName] = useState('');

    const router = useRouter();
    const [userName, setUserName] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [notification, setNotification] = useState<string>(''); // New state for the notification

    const handleSearch = async () => {
        if (userName.trim() !== '') {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/admin/getuserbyemail/${userName}`);
                const data = await response.json();

                if (data.ok) {
                    setUsers(data.data);
                    setNotification(''); // Reset the notification if there are users found
                } else {
                    setUsers([]);
                    setNotification('User not found');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setUsers([]);
                setNotification('Error fetching data');
            }
        }
    };

    const handleViewInfo = (userId: string) => {
        window.location.href = `/pages/user/${userId}`;
    };

    return (

        <div className='page'>
            <h1>Tìm kiếm người dùng</h1>
            <input
                type="text"
                placeholder="Nhập vào email người dùng"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            />
            <button onClick={handleSearch}>Tìm kiếm</button>

            <div className="user-list">
                {users.length !== 0 ? (
                    <ul className="list-grid">
                        {users.map((user, index) => (
                            user.email && (
                                <li key={index}>
                                    <p>{user.email}</p>
                                    <button className="view-info" onClick={() => handleViewInfo(user._id)}>
                                        Xem thông tin chi tiết
                                    </button>
                                </li>
                            )
                        ))}
                    </ul>
                ) : (
                    <p>{notification}</p>
                )}
            </div>
        </div>

    );
};

export default UserSearchPage;
