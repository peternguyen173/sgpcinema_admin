"use client"
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './editscreen.css';
import Link from 'next/link';

const EditScreenPage = () => {
    const [screens, setScreens] = useState<any[]>([]); // State để lưu danh sách màn hình
    const [selectedScreenId, setSelectedScreenId] = useState<string | null>(null); // State để lưu màn hình được chọn
    const [screenName, setScreenName] = useState<string>(''); // State để lưu tên mới của màn hình

    // Fetch screens from API
    const fetchScreens = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/getscreens`);
            if (response.ok) {
                const data = await response.json();
                setScreens(data.data); // Update state with screens from the API
            } else {
                console.error('Failed to fetch screens');
                toast.error('Failed to fetch screens');
            }
        } catch (error) {
            console.error('Error fetching screens', error);
        }
    };

    // Function to handle screen selection
    const handleScreenClick = (screenId: string) => {
        setSelectedScreenId(screenId);
        const selectedScreen = screens.find((screen) => screen._id === screenId);
        if (selectedScreen) {
            setScreenName(selectedScreen.name);
        }
    };

    // Function to handle screen name change
    const handleScreenNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setScreenName(event.target.value);
    };

    // Function to update screen name
    const handleUpdateScreen = async () => {
        try {
            if (!selectedScreenId) {
                toast.error('Vui lòng chọn một phòng chiếu');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/editscreen/${selectedScreenId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: screenName }),
            });

            if (response.ok) {
                toast.success('Cập nhật thông tin phòng chiếu thành công');
                fetchScreens(); // Re-fetch screens after update
            } else {
                toast.error('Cập nhật thông tin phòng chiếu thất bại');
                const data = await response.json();
                console.error('Failed to update screen:', data.message);
            }
        } catch (error) {
            console.error('Error updating screen:', error);
            toast.error('Error updating screen');
        }
    };

    useEffect(() => {
        fetchScreens();
    }, []); // Fetch screens on initial render

    return (
        <div className="edit-screen-page">
            <h2> Danh sách các phòng chiếu:</h2>
            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên Phòng Chiếu</th>
                        <th>Chỉnh sửa</th>
                    </tr>
                </thead>
                <tbody>
                    {screens && screens.map((screen, index) => (
                        <tr key={screen._id}>
                            <td>{index + 1}</td>
                            <td>{screen.name}</td>
                            <td>
                                <Link href={`editscreen/${screen._id}`}><button >Chỉnh sửa</button></Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ToastContainer />
        </div>
    );
};

export default EditScreenPage;
