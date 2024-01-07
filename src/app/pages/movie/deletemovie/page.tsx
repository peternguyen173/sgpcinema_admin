"use client"
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "./deletemovie.css"
interface Movie {
    _id: string; // Thêm trường id vào interface Movie

    title: string;
    description: string;
    portraitImgUrl: string;
    portraitImg: File | null,
    landscapeImgUrl: string;
    landscapeImg: File | null;
    language: string;
    director: string;
    cast: string[]; // Kiểu dữ liệu của mảng cast là string[]
    releasedate: Date;
    rated: string;
    genre: string[]; // Kiểu dữ liệu của mảng genre là string[]
    duration: number;
}
const DeleteMoviePage = () => {

    const [movies, setMovies] = useState<Movie[]>([]); // Sử dụng kiểu dữ liệu Movie[]
    const [selectedMovieId, setSelectedMovieId] = useState<string>(""); // Lưu trữ id của phim được chọn

    const [selectedMovie, setSelectedMovie] = useState<Movie>({
        _id: "",
        title: '',
        description: '',
        portraitImgUrl: '',
        portraitImg: null,
        landscapeImgUrl: '',
        landscapeImg: null,
        language: '',
        director: '',
        cast: [],
        releasedate: new Date(),
        rated: '',
        genre: [],
        duration: 0,
    });
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_API}/movie/movies`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    console.log(data)
                    setMovies(data.data);
                } else {
                    console.error("Failed to fetch movies");
                    toast.error("Failed to fetch movies", {
                        position: toast.POSITION.TOP_CENTER,
                    });
                }
            } catch (error) {
                console.error("Error fetching movies", error);
            }
        };

        fetchMovies();
    }, []);

    // Hàm này sẽ được gọi mỗi khi selectedMovieId thay đổi
    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_API}/movie/movies/${selectedMovieId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setSelectedMovie(data.data); // Cập nhật selectedMovie với thông tin chi tiết của phim
                    console.log(selectedMovie)
                } else {
                    console.error("Failed to fetch movie details");
                    toast.error("Failed to fetch movie details", {
                        position: toast.POSITION.TOP_CENTER,
                    });
                }
            } catch (error) {
                console.error("Error fetching movie details", error);
            }
        };

        if (selectedMovieId) {
            fetchMovieDetails();
        }
    }, [selectedMovieId]);

    const handleDeleteMovie = async (movieId: string) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API}/movie/deletemovie/${movieId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                }
            );

            if (response.ok) {
                // Xóa phim khỏi danh sách movies hiển thị
                setMovies(movies.filter((movie) => movie._id !== movieId));
                toast.success("Movie deleted successfully", {
                    position: toast.POSITION.TOP_CENTER,
                });
            } else {
                console.error("Failed to delete movie");
                toast.error("Failed to delete movie", {
                    position: toast.POSITION.TOP_CENTER,
                });
            }
        } catch (error) {
            console.error("Error deleting movie", error);
        }
    };





    return (
        <div className="edit-movie-page">
            <br></br>
            <h2>Danh sách các phim:</h2>
            <br></br>

            {movies.length > 0 && movies.map((movie) => (
                <div key={movie._id}>
                    <span>{movie.title}</span>
                    <button onClick={() => handleDeleteMovie(movie._id)}>Xóa</button>
                </div>
            ))}


            <ToastContainer />
        </div>
    );
};

export default DeleteMoviePage;
