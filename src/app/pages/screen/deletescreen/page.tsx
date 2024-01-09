"use client"
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './deletescreen.css';

const DeleteScreenPage = () => {
    const [screens, setScreens] = useState<any[]>([]);// State để lưu danh sách màn hình
    const [selectedScreenId, setSelectedScreenId] = useState<string | null>(null); // State để lưu màn hình được chọn

    useEffect(() => {
        fetchScreens();
    }, []);

    const fetchScreens = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/getscreens`);
            if (response.ok) {
                const data = await response.json();
                setScreens(data.data);
            } else {
                console.error('Failed to fetch screens');
                toast.error('Failed to fetch screens');
            }
        } catch (error) {
            console.error('Error fetching screens', error);
            toast.error('Error fetching screens');
        }
    };

    const handleScreenClick = async (screenId: string) => {
        if (selectedScreenId === screenId) {
            setSelectedScreenId(null); // Deselect the screen
        } else {
            setSelectedScreenId(screenId);
        }
    };

    const handleDeleteScreen = async (screenId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/deletescreen/${screenId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success('Xóa phòng chiếu thành công');
                const updatedScreens = screens.filter(screen => screen._id !== screenId);
                setScreens(updatedScreens);
            } else {
                toast.error('Xóa phòng chiếu thất bại');
                const data = await response.json();
                console.error('Failed to delete screen:', data.message);
            }
        } catch (error) {
            console.error('Error deleting screen:', error);
            toast.error('Error deleting screen');
        }
    };

    return (
        <div className="delete-screen-page">
            <h2>Danh sách các phòng chiếu:</h2>
            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên Phòng Chiếu</th>
                        <th>Xóa</th>
                    </tr>
                </thead>
                <tbody>
                    {screens && screens.map((screen, index) => (
                        <tr key={screen._id}>
                            <td>{index + 1}</td>
                            <td>{screen.name}</td>
                            <td>
                                <button className='delete-button' onClick={() => handleDeleteScreen(screen._id)}>
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ToastContainer />
        </div>
    );
};

export default DeleteScreenPage;
