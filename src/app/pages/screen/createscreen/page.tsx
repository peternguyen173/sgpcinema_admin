
'use client'
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "./createscreen.css"

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
    name: string;
    rows: Row[];
    screenType: string;
}


const CreateScreenPage: React.FC = () => {


    const [screen, setScreen] = useState<Screen>({
        name: '',
        rows: [],
        screenType: '',
    });
    const [rowName, setRowName] = useState<string>('');
    const [numSeats, setNumSeats] = useState<number>(0);
    const [rowPrice, setRowPrice] = useState<number>(0);
    const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]); // Thêm state cho selectedSeats

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


    // const handleRowPriceChange = (rowIndex: number, value: string) => {
    //     const price = parseFloat(value);
    //     const updatedRows = [...screen.rows];
    //     updatedRows[rowIndex].price = isNaN(price) ? 0 : price;
    //     setScreen({ ...screen, rows: updatedRows });
    // };

    // const addRow = () => {
    //     // Assuming you have an input for the number of seats, let's call it numSeatsInput
    //     const numSeats = parseInt(prompt('Enter the number of seats for this row:') || '0', 10);
    //     const rowPrice = parseFloat(prompt('Enter the price for this row:') || '0');


    //     if (numSeats > 0) {
    //         const newSeats: Seat[] = Array.from({ length: numSeats }, (_, index) => ({
    //             seat_id: (index + 1).toString(),
    //             row: "",
    //             isWalkway: false,
    //         }));

    //         const newRow: Row = {
    //             rowname: '',
    //             cols: [{ seats: newSeats }],
    //             price: rowPrice, // Set the price for this row
    //         };

    //         setScreen((prevScreen) => ({
    //             ...prevScreen,
    //             rows: [...prevScreen.rows, newRow],
    //         }));
    //     } else {
    //         // Handle invalid input or cancellation
    //         console.log('Invalid input or cancelled.');
    //     }
    // };

    // const handleSeatChange = (rowIndex: number, colIndex: number, seatIndex: number, isWalkway: boolean) => {
    //     setScreen((prevScreen) => {
    //         const updatedRows = [...prevScreen.rows];
    //         const updatedSeat = { ...updatedRows[rowIndex].cols[colIndex].seats[seatIndex], isWalkway };
    //         updatedRows[rowIndex].cols[colIndex].seats[seatIndex] = updatedSeat;

    //         const seatToModify = updatedSeat;
    //         const selectedSeatIndex = selectedSeats.findIndex(
    //             (s) => s.row === seatToModify.row && s.seat_id === seatToModify.seat_id
    //         );

    //         if (selectedSeatIndex > -1) {
    //             // If the seat is already selected, remove it
    //             setSelectedSeats((prevSelectedSeats) =>
    //                 prevSelectedSeats.filter(
    //                     (s) => !(s.row === seatToModify.row && s.seat_id === seatToModify.seat_id)
    //                 )
    //             );
    //         } else {
    //             // If the seat is not selected, add it to the selectedSeats array
    //             setSelectedSeats((prevSelectedSeats) => [...prevSelectedSeats, seatToModify]);
    //         }

    //         return { ...prevScreen, rows: updatedRows };
    //     });
    // };
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



    // const handleRowNameChange = (rowIndex: number, value: string) => {
    //     setScreen((prevScreen) => {
    //         const updatedRows = [...prevScreen.rows];
    //         updatedRows[rowIndex].rowname = value;
    //         // Update rowname for all seats in the row
    //         updatedRows[rowIndex].cols.forEach((col) => {
    //             col.seats.forEach((seat) => {
    //                 seat.row = value;
    //             });
    //         });
    //         return { ...prevScreen, rows: updatedRows };
    //     });
    // };


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setScreen({ ...screen, [name]: value });
    };
    const handleScreenTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setScreen({ ...screen, screenType: value });
    };

    // const generateSeatLayout = () => {
    //     if (screen && selectedTime) {
    //         const currentSchedule = movieSchedulesforDate.find(
    //             (schedule: any) => schedule.showTime === selectedTime.showTime
    //         );
    //         if (currentSchedule) {
    //             const notAvailableSeats = currentSchedule.notAvailableSeats;

    //             return (
    //                 <div>
    //                     {screen.rows.map((row: any, rowIndex: any) => (
    //                         <div className="seat-row" key={rowIndex}>
    //                             <p className="rowname">{row.rowname}</p>
    //                             <div className="seat-cols">
    //                                 {row.cols[0].seats.map((seat: any, seatIndex: any) => {
    //                                     seat.seatId = `${row.rowname}${seatIndex + 1}`;
    //                                     seat.price = row.price;
    //                                     seat.rowname = row.rowname;
    //                                     let isNotAvailable = notAvailableSeats.some(
    //                                         (notAvailableSeat: any) => (
    //                                             notAvailableSeat.rowname === seat.rowname &&
    //                                             notAvailableSeat.seat_id === seat.seat_id
    //                                         )
    //                                     );
    //                                     return (
    //                                         <div key={seatIndex}>
    //                                             {seat.isWalkway ? (
    //                                                 <span className='seat-iswalkway'>
    //                                                     {seatIndex + 1}
    //                                                 </span>
    //                                             ) : (
    //                                                 <span
    //                                                     className={
    //                                                         isNotAvailable
    //                                                             ? 'seat-unavailable'
    //                                                             : selectedSeats.find(
    //                                                                 (s: any) =>
    //                                                                     s.rowname === seat.rowname &&
    //                                                                     s.seat_id === seat.seat_id
    //                                                             )
    //                                                                 ? 'seat-selected'
    //                                                                 : 'seat-available'
    //                                                     }
    //                                                     onClick={() => selectdeselectseat(seat)}
    //                                                 >
    //                                                     {seatIndex + 1}
    //                                                 </span>
    //                                             )}
    //                                         </div>
    //                                     );
    //                                 })}
    //                             </div>
    //                         </div>
    //                     ))}
    //                 </div>
    //             );
    //         }
    //     }
    //     return null;
    // };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (
                screen.name === '' ||
                screen.screenType === '' ||
                screen.rows.length === 0
            ) {
                toast.error('Hãy điền đầy đủ các trường thông tin', {
                    position: toast.POSITION.TOP_CENTER,
                });
                return;
            }


            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/createscreen`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(screen),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Screen creation successful', data);

                toast.success('Thêm màn hình thành công', {
                    position: toast.POSITION.TOP_CENTER,
                });
            } else {
                console.error('Screen creation failed', response.statusText);
                toast.error('Thêm màn hình thất bại', {
                    position: toast.POSITION.TOP_CENTER,
                });
            }
        }
        catch (error) {
            console.log(error);
        }
    }


    return (
        <div className="formpage1">
            <div className='stay'>
                <br />
                <h1>Thêm phòng chiếu mới</h1>
                <br />

                <div className="input-row">
                    <label>Tên phòng chiếu:</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={screen.name}
                        onChange={handleInputChange}
                    />
                </div>


                <br />
                <div>
                    Loại phòng chiếu:
                    <label>
                        <input
                            type="radio"
                            name="screenType"
                            value="3D"
                            checked={screen.screenType === '3D'}
                            onChange={handleScreenTypeChange}
                        />
                        3D
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="screenType"
                            value="2D"
                            checked={screen.screenType === '2D'}
                            onChange={handleScreenTypeChange}
                        />
                        2D
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="screenType"
                            value="4D"
                            checked={screen.screenType === '4D'}
                            onChange={handleScreenTypeChange}
                        />
                        4D
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="screenType"
                            value="IMAX"
                            checked={screen.screenType === 'IMAX'}
                            onChange={handleScreenTypeChange}
                        />
                        IMAX
                    </label>
                </div>
                <br />
            </div>
            <h2>Thêm các hàng ghế</h2>
            <br />
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

                <p className="screen-text">Màn hình</p>
                <br></br><br>
                </br><br>
                </br>
                <div className="curve-line"></div>
            </div>

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
                                            <div className='f'>{row.rowname}{seatIndex + 1}</div>
                                        </span>
                                    ) : (
                                        <span
                                            className={'seat-available'}
                                            onClick={() => selectdeselectseat(seat)}
                                        >
                                            <div className='f'>{row.rowname}{seatIndex + 1}</div>
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
            <button onClick={handleSubmit}>Thêm màn hình</button>
        </div>
    );
};

export default CreateScreenPage;