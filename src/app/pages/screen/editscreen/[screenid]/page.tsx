"use client"
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './editscreenid.css'
interface Seat {
    seat_id: string;
    row: string;
    isWalkway: boolean;
}

interface Col {
    seats: Seat[];
}

interface Row {
    rowname: string;
    cols: Col[];
    price: number; // Add the price field for each row

}

interface Screen {
    _id: string;
    name: string;
    rows: Row[];
    screenType: string;
}


const ViewScreenPage: React.FC = () => {
    const { screenid } = useParams()
    const [screen, setScreen] = useState<Screen>({ _id: '', name: '', rows: [], screenType: '' });
    const [rowName, setRowName] = useState<string>('');
    const [numSeats, setNumSeats] = useState<number>(0);
    const [rowPrice, setRowPrice] = useState<number>(0);
    const [editScreenName, setEditScreenName] = useState<string>('');
    const [editScreenType, setEditScreenType] = useState<string>('');
    const [isEditingName, setIsEditingName] = useState(false);




    useEffect(() => {
        const fetchScreen = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/getscreenbyid/${screenid}`);
                if (response.ok) {
                    const data = await response.json();
                    setScreen(data.data);
                    setEditScreenType(data.data.screenType); // Cập nhật editScreenType khi dữ liệu được tải về

                    console.log(data.data);
                } else {
                    console.error('Failed to fetch screen');
                    toast.error('Failed to fetch screen');
                }
            } catch (error) {
                console.error('Error fetching screen', error);
            }
        };

        fetchScreen();
    }, [screenid]);

    const handleEditNameClick = () => {
        setIsEditingName(true);
    };

    const handleEditScreenNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditScreenName(event.target.value);
    };

    const handleNameEditDone = () => {
        setScreen(prevScreen => ({
            ...prevScreen,
            name: editScreenName, // Cập nhật tên màn hình mới
        }));
        setIsEditingName(false); // Đóng khung nhập tên
    };

    const handleEditScreenTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditScreenType(event.target.value);
    };


    const handleRowNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowName(event.target.value);
    };

    const handleNumSeatsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        setNumSeats(isNaN(value) ? 0 : value);
    };

    const handleRowPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(event.target.value);
        setRowPrice(isNaN(value) ? 0 : value);
    };
    const addRow = () => {

        if (rowName !== '' && numSeats > 0 && rowPrice > 0) {
            const newSeats: Seat[] = Array.from({ length: numSeats }, (_, index) => ({
                seat_id: (index + 1).toString(),
                row: rowName, // Tên hàng ghế từ input
                isWalkway: false,
            }));

            const newRow: Row = {
                rowname: rowName,
                cols: [{ seats: newSeats }],
                price: rowPrice, // Giá từ input
            };

            setScreen((prevScreen) => ({
                ...prevScreen,
                rows: [...prevScreen.rows, newRow],
            }));

            // Reset các giá trị sau khi thêm hàng mới
            setRowName('');
            setNumSeats(0);
            setRowPrice(0);
        } else {
            toast.error('Hãy điền đầy đủ các trường thông tin', {
                position: toast.POSITION.TOP_CENTER,
            });
        }
    };

    const updateSeat = async (updatedSeat: Seat) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/updateseat`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedSeat), // Gửi thông tin ghế cần cập nhật
            });

            if (response.ok) {
                toast.success('Cập nhật ghế thành công');
            } else {
                toast.error('Lỗi khi cập nhật ghế');
            }
        } catch (error) {
            console.error('Error updating seat', error);
            toast.error('Lỗi khi cập nhật ghế');
        }
    };
    const deleteRow = (rowIndex: number) => {
        setScreen(prevScreen => {
            const updatedRows = [...prevScreen.rows];
            updatedRows.splice(rowIndex, 1); // Xóa hàng ở vị trí rowIndex
            return { ...prevScreen, rows: updatedRows };
        });
    };

    const selectdeselectseat = (seat: Seat) => {

        setScreen((prevScreen) => {
            const updatedRows = [...prevScreen.rows];
            const { row, seat_id, isWalkway } = seat;

            // Find the index of the selected seat
            let rowIndex = -1;
            let colIndex = -1;
            let seatIndex = -1;

            updatedRows.forEach((row, i) => {
                row.cols.forEach((col, j) => {
                    col.seats.forEach((s, k) => {
                        if (s.row === seat.row && s.seat_id === seat_id) {
                            rowIndex = i;
                            colIndex = j;
                            seatIndex = k;
                        }
                    });
                });
            });

            if (rowIndex !== -1 && colIndex !== -1 && seatIndex !== -1) {
                // Toggle isWalkway value for the selected seat
                updatedRows[rowIndex].cols[0].seats[seatIndex].isWalkway = true;


                // If the selected seat becomes isWalkway, decrement seat_id of subsequent seats in the row
                if (!isWalkway) {
                    for (let i = seatIndex + 1; i < updatedRows[rowIndex].cols[colIndex].seats.length; i++) {
                        updatedRows[rowIndex].cols[colIndex].seats[i].seat_id = (parseInt(updatedRows[rowIndex].cols[colIndex].seats[i].seat_id) - 1).toString();
                    }
                } updatedRows[rowIndex].cols[colIndex].seats[seatIndex].seat_id = "";

                // Update state of the row to trigger re-render of the row
                updatedRows[rowIndex] = { ...updatedRows[rowIndex] };
            }
            console.log(prevScreen)
            return { ...prevScreen, rows: [...updatedRows] };
        });
    };


    const handleSaveChanges = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/updatescreen/${screenid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }, credentials: 'include',

                body: JSON.stringify(screen), // Gửi thông tin màn hình cần cập nhật
            });

            if (response.ok) {
                toast.success('Cập nhật thành công');
            } else {
                toast.error('Lỗi khi cập nhật');
            }
        } catch (error) {
            console.error('Error updating screen', error);
            toast.error('Lỗi khi cập nhật');
        }
    };


    return (
        <div className='formpage1'>
            <br></br>
            <h1>Chỉnh sửa phòng chiếu</h1>
            <br></br>
            <p>ID phòng chiếu: {screen._id}</p>

            <div>
                <label>Tên phòng chiếu: {screen.name}</label>
                {!isEditingName ? (
                    <button onClick={handleEditNameClick}>Sửa</button>
                ) : (
                    <div>
                        <label>Nhập tên phòng chiếu mới</label>
                        <input
                            type="text"
                            placeholder={"Tên phòng chiếu"}
                            value={editScreenName}
                            onChange={handleEditScreenNameChange}
                        />
                        <button onClick={handleNameEditDone}>Xong</button>
                    </div>
                )}

            </div>
            <div>
                <label>Loại màn hình:</label>
                <label>
                    <input
                        type="radio"
                        value="3D"
                        checked={editScreenType === '3D'}
                        onChange={handleEditScreenTypeChange}
                    />
                    3D
                </label>
                <label>
                    <input
                        type="radio"
                        value="2D"
                        checked={editScreenType === '2D'}
                        onChange={handleEditScreenTypeChange}
                    />
                    2D
                </label>
                <label>
                    <input
                        type="radio"
                        value="4D"
                        checked={editScreenType === '4D'}
                        onChange={handleEditScreenTypeChange}
                    />
                    4D
                </label>
                <label>
                    <input
                        type="radio"
                        value="IMAX"
                        checked={editScreenType === 'IMAX'}
                        onChange={handleEditScreenTypeChange}
                    />
                    IMAX
                </label>
            </div>


            <p className="screen-text">Màn hình</p>
            <div className="row-container">
                <label>Tên hàng:</label>
                <input
                    type="text"
                    placeholder="Nhập tên hàng"
                    value={rowName}
                    onChange={handleRowNameChange}
                /><label>Số ghế:</label>
                <input
                    type="text"
                    placeholder="Số ghế"
                    value={numSeats}
                    onChange={handleNumSeatsChange}
                />
                <label>Giá vé:</label>
                <input
                    type="text"
                    placeholder="Giá vé"
                    value={rowPrice}
                    onChange={handleRowPriceChange}
                />
                <button onClick={addRow}>Thêm hàng</button>
                <br></br>
                <br></br>
                <br></br>

                <p className="screen-text">Màn hình</p><div className="curve-line"></div>
            </div>
            {screen ? (
                <div>

                    {screen.rows.map((row: any, rowIndex: any) => (
                        <div className="seat-row" key={rowIndex}>
                            <div className="seat-cols">
                                {console.log(row.rowname)}

                                {row.cols[0].seats.map((seat: any, seatIndex: any) => {
                                    seat.seatId = `${row.rowname}${seatIndex + 1}`;
                                    seat.price = row.price;
                                    seat.rowname = row.rowname;

                                    return (

                                        <div key={seatIndex}>
                                            {seat.isWalkway ? (
                                                <span className='seat-iswalkway'>
                                                    <div className='q'>{row.rowname}{seat.seat_id}</div>
                                                </span>
                                            ) : (
                                                <span
                                                    className={'seat-available'}
                                                    onClick={() => selectdeselectseat(seat)}
                                                >
                                                    <div className='q'>{row.rowname}{seat.seat_id}</div>
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                                <button className='btnx' onClick={() => deleteRow(rowIndex)}>Xóa hàng</button>

                            </div>
                        </div>
                    ))}
                    <br></br>
                    <button className='a' onClick={handleSaveChanges}>Lưu thay đổi</button>
                    <a href="/pages/screen/editscreen"><button className='a1' >Quay lại</button></a>
                </div>

            ) : (
                <p>Loading...</p>
            )
            }
            <ToastContainer />
        </div >
    );
};

export default ViewScreenPage;
