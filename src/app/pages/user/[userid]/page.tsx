'use client'
import React from 'react'
import './userid.css'
import Link from 'next/link';
import { useParams } from 'next/navigation'



const ProfilePage = () => {
    const { userid } = useParams()
    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, '0'); // Cộng thêm 1 vì getMonth() trả về từ 0 - 11
        const day = `${date.getDate()}`.padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const [bookings, setBookings] = React.useState<any>(null)
    const [user, setUser] = React.useState<any>(null)

    const getBookings = async () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/getuserbookings`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'

        })
            .then((res) => res.json())
            .then((data) => {
                if (data.ok) {
                    console.log(data)
                    setBookings(data.data)
                }
                else {
                    console.log(data)
                }
            }
            )
    }

    const getUserData = async () => {

        // router.get('/getuser', authTokenHandler, async (req, res) => {
        //     const user = await User.findOne({ _id: req.userId });

        //     if (!user) {
        //         return res.status(400).json(createResponse(false, 'Invalid credentials'));
        //     }
        //     else {
        //         return res.status(200).json(createResponse(true, 'User found', user));
        //     }
        // })


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
                    console.log(data)
                    setUser(data.data)

                    // {
                    //     "_id": "651c19f156b991c66296fb73",
                    //     "name": "Harshal Jain",
                    //     "password": "$2b$08$17hG5iNfG7PbSX7BpGNRNe2m7uCB56F2Oy5hOhF113z5PT8pUUCM.",
                    //     "email": "virajj014@gmail.com",
                    //     "bookings": [
                    //         "651d70e7c54f60ba058333d2",
                    //         "651d7171559a5aaef26eba47"
                    //     ],
                    //     "createdAt": "2023-10-03T13:41:05.175Z",
                    //     "updatedAt": "2023-10-04T14:06:41.729Z",
                    //     "__v": 2,
                    //     "city": "Jabalpur"
                    // }
                }
                else {
                    console.log(data)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    React.useEffect(() => {
        getBookings()
        getUserData()
    }, [])
    const handleEditProfile = () => {
        // Chuyển hướng đến trang chỉnh sửa thông tin cá nhân khi người dùng nhấn nút "Thay đổi"
    };
    return (
        <div>
            <div className='profile'>
                <h1 className='head'>Tài khoản</h1>
                <div className='user'>
                    <h2>Thông tin tài khoản</h2>
                    <div className='details'>
                        <div className='detail'>
                            <h3>Name</h3>
                            <p>{user?.name}</p>
                        </div>
                        <div className='detail'>
                            <h3>Số điện thoại</h3>
                            <p>{user?.phonenumber}</p>
                        </div>
                        <div className='detail'>
                            <h3>Email</h3>
                            <p>{user?.email}</p>
                        </div>

                    </div>
                    <div className='details'>
                        <div className='detail'>
                            <h3>Ngày sinh</h3>
                            <p>{new Date(user?.dob).toLocaleDateString()}</p>
                        </div>
                        <div className='detail'>
                            <h3>Giới tính</h3>
                            <p>{user?.gender}</p>
                        </div>
                        <Link href={`/pages/user/${userid}/editdata`}>
                            <button className='btn1'>Thay đổi</button>
                        </Link>

                    </div>

                </div>
            </div>
            <div className='k'>
                <Link href={`/pages/user/${userid}/bookingdata`}>
                    <button className='btn1'><h2>Xem lịch sử đặt vé</h2></button>
                </Link>
            </div>
        </div>
    )
}

export default ProfilePage 