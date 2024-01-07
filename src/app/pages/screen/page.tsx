'use client'
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';


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

    const handleRowPriceChange = (rowIndex: number, value: string) => {
        const price = parseFloat(value);
        const updatedRows = [...screen.rows];
        updatedRows[rowIndex].price = isNaN(price) ? 0 : price;
        setScreen({ ...screen, rows: updatedRows });
    };

    const addRow = () => {
        // Assuming you have an input for the number of seats, let's call it numSeatsInput
        const numSeats = parseInt(prompt('Enter the number of seats for this row:') || '0', 10);
        const rowPrice = parseFloat(prompt('Enter the price for this row:') || '0');


        if (numSeats > 0) {
            const newSeats: Seat[] = Array.from({ length: numSeats }, (_, index) => ({
                seat_id: (index + 1).toString(),
                row: "",
                isWalkway: false,
            }));

            const newRow: Row = {
                rowname: '',
                cols: [{ seats: newSeats }],
                price: rowPrice, // Set the price for this row
            };

            setScreen((prevScreen) => ({
                ...prevScreen,
                rows: [...prevScreen.rows, newRow],
            }));
        } else {
            // Handle invalid input or cancellation
            console.log('Invalid input or cancelled.');
        }
    };

    const handleSeatChange = (rowIndex: number, colIndex: number, seatIndex: number, isWalkway: boolean) => {
        setScreen((prevScreen) => {
            const updatedRows = [...prevScreen.rows];
            const updatedSeat = { ...updatedRows[rowIndex].cols[colIndex].seats[seatIndex], isWalkway };
            updatedRows[rowIndex].cols[colIndex].seats[seatIndex] = updatedSeat;
            return { ...prevScreen, rows: updatedRows };
        });
    };

    const handleRowNameChange = (rowIndex: number, value: string) => {
        setScreen((prevScreen) => {
            const updatedRows = [...prevScreen.rows];
            updatedRows[rowIndex].rowname = value;
            // Update rowname for all seats in the row
            updatedRows[rowIndex].cols.forEach((col) => {
                col.seats.forEach((seat) => {
                    seat.row = value;
                });
            });
            return { ...prevScreen, rows: updatedRows };
        });
    };


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setScreen({ ...screen, [name]: value });
    };
    const handleScreenTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setScreen({ ...screen, screenType: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (
                screen.name === '' ||
                screen.screenType === '' ||
                screen.rows.length === 0
            ) {
                toast.error('Please fill all the fields', {
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

                toast.success('Screen Created Successfully', {
                    position: toast.POSITION.TOP_CENTER,
                });
            } else {
                console.error('Screen creation failed', response.statusText);
                toast.error('Screen Creation Failed', {
                    position: toast.POSITION.TOP_CENTER,
                });
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="formpage">
            <input
                type="text"
                name="name"
                placeholder="Name"
                value={screen.name}
                onChange={handleInputChange}
            />
            <br />

            <br />

            <br />
            <div>
                Screen Type:
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
            <button onClick={addRow}>Add Row</button>
            {screen.rows.map((row, rowIndex) => (
                <div key={rowIndex}>
                    <input
                        type="text"
                        placeholder={`Row ${rowIndex + 1} Name`}
                        value={row.rowname}
                        onChange={(e) => handleRowNameChange(rowIndex, e.target.value)}
                    />

                    {row.cols.map((col, colIndex) => (
                        <div key={colIndex}>
                            {col.seats.map((seat, seatIndex) => (
                                <label key={seatIndex}>
                                    <input
                                        type="checkbox"
                                        checked={seat.isWalkway}
                                        onChange={(e) => handleSeatChange(rowIndex, colIndex, seatIndex, e.target.checked)}
                                    />
                                    Seat {seat.seat_id}
                                </label>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
            <button onClick={handleSubmit}>Create Screen</button>
        </div>
    );
};

export default CreateScreenPage;
