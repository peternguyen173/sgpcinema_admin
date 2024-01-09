"use client"
import React, { useEffect, useState } from 'react';
import './EditProfilePage.css';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface User {
    name: string,
    phonenumber: string,
    email: string,
    password: string,
    dob: Date,
    gender: string
}

const EditProfilePage = () => {
    const { userid } = useParams()
    const [user, setUser] = useState<User>({
        name: '',
        phonenumber: '',
        email: '',
        password: '',
        dob: new Date(),
        gender: '',
    });
    const [showPasswordInput, setShowPasswordInput] = useState(false); // State để hiển thị ô nhập mật khẩu mới
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');



    // Hàm lấy dữ liệu người dùng
    const getUserData = async () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/admin/getuserbyid/${userid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.ok) {
                    data.data.password = "";
                    setUser(data.data);
                } else {
                    console.log(data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        getUserData();
    }, []);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === 'password') { // Nếu người dùng đang nhập mật khẩu mới
            setNewPassword(value); // Cập nhật state cho newPassword
            setUser({ ...user, password: value }); // Cập nhật trường password trong user
        } else {
            setUser({ ...user, [id]: value });
        }
    };

    const handleShowPasswordInput = () => {

        setShowPasswordInput(true); // Hiển thị ô nhập mật khẩu mới khi ấn vào ô cần đổi mật khẩu\

    };
    const handleCheckboxChange = () => {
        if (!showPasswordInput) {
            setShowPasswordInput(true);
        } else {
            // Nếu đã hiển thị, ẩn đi khi checkbox được tích lần thứ 2
            setShowPasswordInput(false);

        }
    };
    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setConfirmPassword(e.target.value);
    };
    // Hàm xử lý khi người dùng nhấn nút "Lưu thông tin"

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('Mật khẩu xác nhận không khớp');
            return;
        }
        if (user.email.length === 0) {
            alert('Bạn chưa nhập vào email thay đổi');
            return;
        }
        if (user.name.length === 0) {
            alert('Bạn chưa nhập vào Name thay đổi');
            return;
        }
        if (user.phonenumber.length === 0) {
            alert('Bạn chưa nhập vào Số điện thoại thay đổi');
            return;
        }
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/admin/updateuserbyid/${userid}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(user),
            });
            console.log(user.password)
            const data = await response.json();
            if (data.ok) {
                // Xử lý thành công, có thể hiển thị thông báo, chuyển hướng trang, hoặc cập nhật local state nếu cần thiết
                console.log('Thông tin người dùng đã được cập nhật');
                alert('Thay đổi thông tin thành công!');
                window.history.back();

            } else {
                // Xử lý khi có lỗi từ server
                console.error('Có lỗi khi cập nhật thông tin người dùng:', data.message);
            }
        } catch (error) {
            // Xử lý khi có lỗi từ fetch hoặc các lỗi khác
            console.error('Đã xảy ra lỗi:', error);
        }
    };
    // Xử lý logic lưu thông tin người dùng, có thể gửi thông tin mới lên server ở đây
    // Sau khi lưu thành công, bạn có thể chuyển hướng người dùng về trang thông tin cá nhân bằng useRouter


    // Render form chỉnh sửa thông tin cá nhân
    return (
        <div className='edit-profile'>
            <h1 className='head'>Chỉnh sửa thông tin cá nhân</h1>
            <div className='user'>
                <form onSubmit={handleSave}>
                    <div className='form-field'>
                        <div className='details'>
                            <div className='detail'>
                                <h3>Name:</h3>
                                <input
                                    type='text'
                                    id='name'
                                    value={user.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className='detail'>
                                <h3>Số điện thoại:</h3>
                                <input
                                    type='text'
                                    id='phonenumber'
                                    value={user.phonenumber}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className='detail'>

                                <h3>Email:</h3>
                                <input
                                    type='email'
                                    id='email'
                                    value={user.email}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className='detail'>
                                <h3>Giới tính:</h3>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="Nam"
                                        checked={user.gender === "Nam"}
                                        onChange={() => setUser({ ...user, gender: "Nam" })}
                                    /> Nam
                                </label>
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="Nữ"
                                        checked={user.gender === "Nữ"}
                                        onChange={() => setUser({ ...user, gender: "Nữ" })}
                                    /> Nữ
                                </label>
                            </div>
                            {/* Ô chức năng đổi mật khẩu */}
                            <div className='detail'>
                                <h3>Bạn muốn đổi mật khẩu?</h3>
                                <input
                                    type='checkbox'
                                    onChange={handleCheckboxChange}
                                    checked={showPasswordInput}
                                /> Đổi mật khẩu
                                {showPasswordInput && ( // Hiển thị ô nhập mật khẩu mới nếu showPasswordInput là true
                                    <div className='detail'>
                                        <h3>Mật khẩu mới*:</h3>
                                        <input
                                            type='password'
                                            id='password'
                                            value={newPassword}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                )}
                                {showPasswordInput && (
                                    <div className='detail'>
                                        <h3>Nhập lại mật khẩu mới*:</h3>
                                        <input
                                            type='password'
                                            id='confirmPassword'
                                            value={confirmPassword}
                                            onChange={handleConfirmPasswordChange}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Các trường thông tin khác */}
                    {/* ... */}
                    <button type='submit'>
                        Lưu thông tin
                    </button>
                </form>

            </div>
        </div>
    );
};

export default EditProfilePage;
