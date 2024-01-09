'use client'
import React from 'react'
import './BookingDataPage.css'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const ProfilePage = () => {
    const { userid } = useParams()
    const [bookings, setBookings] = React.useState<any>(null)
    const [user, setUser] = React.useState<any>(null)

    const getBookings = async () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/admin/getuserbookingsbyid/${userid}`, {
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


                    // {
                    //     "_id": "651d70e7c54f60ba058333d2",
                    //     "showTime": "20:27",
                    //     "showDate": "2023-10-04T19:34:14.000Z",
                    //     "movieId": "65101a2acc5b257e6f2816a5",
                    //     "screenId": "65101370556fed70cb10ca1d",
                    //     "seats": [
                    //         {
                    //             "row": "E",
                    //             "col": 0,
                    //             "seat_id": "10",
                    //             "price": 300,
                    //             "_id": "651d70e7c54f60ba058333d3"
                    //         },
                    //         {
                    //             "row": "E",
                    //             "col": 0,
                    //             "seat_id": "9",
                    //             "price": 300,
                    //             "_id": "651d70e7c54f60ba058333d4"
                    //         },
                    //         {
                    //             "row": "E",
                    //             "col": 1,
                    //             "seat_id": "1",
                    //             "price": 300,
                    //             "_id": "651d70e7c54f60ba058333d5"
                    //         },
                    //         {
                    //             "row": "E",
                    //             "col": 1,
                    //             "seat_id": "2",
                    //             "price": 300,
                    //             "_id": "651d70e7c54f60ba058333d6"
                    //         }
                    //     ],
                    //     "totalPrice": 1200,
                    //     "paymentId": "123456789",
                    //     "paymentType": "online",
                    //     "userId": "651c19f156b991c66296fb73",
                    //     "__v": 0
                    // }
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
    const calculateTotalSpending = () => {
        if (bookings) {
            const totalSpending = bookings.reduce((accumulator: any, currentBooking: any) => {
                return accumulator + (currentBooking.totalPrice ? currentBooking.totalPrice : 0);
            }, 0);
            return totalSpending;
        }
        return 0;
    };
    return (
        <div className='profile'>
            <a href={`/pages/user/${userid}`}>
                <button className='btn1'><h2>Quay lại</h2></button>
            </a><h1 className='head'>Lịch sử đặt vé</h1>
            <div className='user'>
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



            </div>
            <h2 className='s'> Tổng chi tiêu:  {calculateTotalSpending()} đ</h2>

            <div className='bookings'>

                <h2>Vé đã đặt</h2>
                <div className='details'>
                    {
                        bookings
                            ?.slice()
                            .reverse()
                            .map((booking: any) => {
                                return (
                                    <div className='booking' key={booking && booking._id}>
                                        <div className='detail'>
                                            <h3>Phim</h3>
                                            <p>{booking ? booking.moviename : 'No movie selected'}</p>
                                        </div>


                                        <div className='detail'>
                                            <h3>Phòng chiếu</h3>
                                            <p>{booking ? booking.screenname : 'No screen selected'}</p>
                                        </div>


                                        <div className='detail'>
                                            <h3>Ghế</h3>
                                            <p>
                                                {booking && booking.seats
                                                    ? booking.seats.map((seat: any, index: any) => (
                                                        <span key={index}>{seat.rowname}{seat.seat_id}{" "} </span>
                                                    ))
                                                    : 'No seats selected'}
                                            </p>
                                        </div>

                                        <div className='detail'>
                                            <h3>Tổng thanh toán</h3>
                                            <p>{booking ? booking.totalPrice : 'N/A'} đ</p>
                                        </div>
                                        <div className='detail'>
                                            <h3>Ngày chiếu</h3>
                                            <p>{booking ? new Date(booking.showDate).toLocaleDateString() : 'N/A'}</p>
                                        </div>

                                        <div className='detail'>
                                            <h3>Giờ chiếu</h3>
                                            <p>{booking ? booking.showTime : 'N/A'}</p>
                                        </div>
                                        <div className='detail'>
                                            <h3>Ngày đặt vé</h3>
                                            <p>{booking ? new Date(booking.bookDate).toLocaleString() : 'N/A'}</p>
                                        </div>
                                        <div className='detail'>
                                            <h3>Bỏng, nước</h3>
                                            <p>{booking ? booking.cornquantity : 'N/A'} bỏng ngô - {booking ? booking.waterquantity : 'N/A'} nước</p>
                                        </div>
                                        <div className='detail'>
                                            <h3>Mã hóa đơn</h3>
                                            <p>{booking ? booking._id : 'N/A'}</p>
                                        </div>

                                    </div>
                                )
                            })
                    }
                </div>
            </div>

        </div >
    )
}

export default ProfilePage 