"use client"
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './deleteschedule.css'

const DeleteSchedulePage = () => {
    const [screens, setScreens] = useState<any[]>([]);// State để lưu danh sách màn hình
    const [selectedScreenId, setSelectedScreenId] = useState<string | null>(null); // State để lưu màn hình được chọn
    const [schedules, setSchedules] = useState<any[]>([]); // State để lưu danh sách lịch chiếu
    const [screenClicked, setScreenClicked] = useState<boolean>(false); // State để kiểm soát việc màn hình được chọn
    const [movieTitles, setMovieTitles] = useState<Record<string, string>>({}); // State để lưu tên các phim

    const fetchScreens = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/getscreens`);
            if (response.ok) {
                const data = await response.json();
                setScreens(data.data); // Cập nhật state với danh sách màn hình từ API
            } else {
                console.error('Failed to fetch screens');
                toast.error('Failed to fetch screens');
            }
        } catch (error) {
            console.error('Error fetching screens', error);
        }
    };

    const fetchMovieTitle = async (movieId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/movies/${movieId}`);
            if (response.ok) {
                const data = await response.json();
                const title = data.data.title;
                console.log(title);
                return title;

            } else {
                console.error('Failed to fetch movie title');
                return ''; // Return an empty string on failure
            }
        } catch (error) {
            console.error('Error fetching movie title', error);
            return ''; // Return an empty string on error
        }
    };
    useEffect(() => {
        // Lấy tên các phim từ API và cập nhật state movieTitles
        const fetchMovieTitles = async () => {
            const updatedMovieTitles: Record<string, string> = {};
            for (const screen of screens) {
                for (const schedule of screen.movieSchedules) {
                    if (!movieTitles[schedule.movieId]) {
                        // Nếu tên phim chưa được lưu, thực hiện lấy từ API
                        const title = await fetchMovieTitle(schedule.movieId);
                        updatedMovieTitles[schedule.movieId] = title;

                    }
                }
            }
            setMovieTitles((prevTitles) => ({ ...prevTitles, ...updatedMovieTitles }));
        };

        fetchMovieTitles();
    }, [screens]);

    console.log(movieTitles)
    useEffect(() => {
        fetchScreens();
    }, []); // Khi component được render, gọi hàm fetchScreens


    const handleScreenClick = async (screenId: string) => {
        if (selectedScreenId === screenId) {
            setSelectedScreenId(null); // Deselect the screen
            setSchedules([]); // Clear schedules
            setScreenClicked(false); // Set screenClicked to false
        } else {
            setSelectedScreenId(screenId);
            setScreenClicked(true);
        }
    };
    const handleDeleteSchedule = async (scheduleId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/deleteschedule/${scheduleId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Update schedules after deletion
                const updatedSchedules = schedules.filter(schedule => schedule._id !== scheduleId);
                setSchedules(updatedSchedules);
                toast.success('Schedule deleted successfully');
            } else {
                const data = await response.json();
                console.error('Failed to delete schedule:', data.message);
                toast.error('Failed to delete schedule');
            }
        } catch (error) {
            console.error('Error deleting schedule:', error);
            toast.error('Error deleting schedule');
        }
    };
    console.log(Array.isArray(schedules))

    return (
        <div className="delete-schedule-page">
            <h2>Danh sách các Phòng chiếu:</h2>
            <ul>
                {screens && screens.map((screen) => (
                    <li key={screen._id} onClick={() => handleScreenClick(screen._id)}>
                        {/* ^^^ Updated here to handle the click */}
                        <button
                            key={screen._id}
                            onClick={() => handleScreenClick(screen._id)}
                            className={selectedScreenId === screen._id ? 'selected' : ''}
                        >
                            {screen.name}
                        </button>                        {selectedScreenId === screen._id && ( // Render schedules for the selected screen
                            <ul>
                                {screen.movieSchedules.map((schedule: any) => (
                                    <li className='schedule' key={schedule._id}>
                                        <p>Tên phim: {movieTitles[schedule.movieId]}</p>
                                        <p>Ngày chiếu: {new Date(schedule.showDate).toLocaleDateString()}</p>
                                        <p>Giờ chiếu: {schedule.showTime}</p>
                                        <button onClick={() => handleDeleteSchedule(schedule._id)}>Xóa</button>

                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
            <ToastContainer />
        </div>
    );
};

export default DeleteSchedulePage;