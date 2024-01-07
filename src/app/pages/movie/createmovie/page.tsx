'use client'
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

interface Movie {
    title: string;
    description: string;
    portraitImgUrl: string;
    portraitImg: File | null;
    landscapeImgUrl: String;
    landscapeImg: File | null;
    language: string;
    director: string;
    cast: string[];
    releasedate: Date;
    rated: string;
    genre: string[];
    duration: number;
}
const CreateMoviePage = () => {
    const [movie, setMovie] = useState<Movie>({
        title: "",
        description: "",
        portraitImgUrl: "",
        portraitImg: null,
        landscapeImgUrl: "",
        landscapeImg: null,
        language: "",
        director: "",
        cast: [],
        rated: "",
        releasedate: new Date(),
        genre: [],
        duration: 0,
    });
    const genres = [
        "Hành động",
        "Hài kịch",
        "Chính kịch",
        "Kỳ ảo",
        "Kinh dị",
        "Khoa học viễn tưởng",
        "Giật gân",
        "Âm nhạc",
    ];
    const handleGenreChange = (genre: string) => {
        if (movie.genre.includes(genre)) {
            setMovie({
                ...movie,
                genre: movie.genre.filter((selectedGenre) => selectedGenre !== genre),
            });
        }
        else {
            setMovie({ ...movie, genre: [...movie.genre, genre] });

        }
    }
    const [actorName, setActorName] = useState<string>(""); // Thêm state mới để lưu trữ tên diễn viên mới
    const [releaseDate, setReleaseDate] = useState<string>(""); // Tạo state mới cho ngày phát hành


    const handleCastChange = () => {
        const updatedCast = [...movie.cast, actorName]; // Thêm tên diễn viên mới vào danh sách cast
        setMovie({ ...movie, cast: updatedCast });
        setActorName(""); // Reset giá trị của tên diễn viên sau khi thêm vào danh sách
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setMovie({ ...movie, [name]: value });
    };
    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setReleaseDate(value);
        setMovie({ ...movie, releasedate: new Date(value) });
    }
    const uploadImage = async (image: File) => {
        try {
            const formData = new FormData();
            formData.append("myimage", image);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API}/image/uploadimage`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log("Image uploaded successfully:", data);
                return data.imageUrl;
            } else {
                console.error("Failed to upload the image.");
                return null;
            }
        }
        catch (error) {
            console.error("Error:", error);
            return null;
        }
    }
    const handleCreateMovie = async () => {
        try {
            if (
                movie.title === "" ||
                movie.description === "" ||
                movie.genre.length === 0 ||
                movie.duration === 0 ||
                movie.language === ""
            ) {
                toast.error("Please fill all the fields", {
                    position: toast.POSITION.TOP_CENTER,
                });
                return;
            }

            let portraitImgUrl = movie.portraitImgUrl;
            let landscapeImgUrl = movie.landscapeImgUrl;

            if (movie.portraitImg) {
                portraitImgUrl = await uploadImage(movie.portraitImg);
                if (!portraitImgUrl) {
                    toast.error("Portrait Image upload failed", {
                        position: toast.POSITION.TOP_CENTER,
                    });
                    return;
                }
            }
            if (movie.landscapeImg) {
                landscapeImgUrl = await uploadImage(movie.landscapeImg);
                if (!landscapeImgUrl) {
                    toast.error("Landscape Image upload failed", {
                        position: toast.POSITION.TOP_CENTER,
                    });
                    return;
                }
            }

            const newMovie = { ...movie, portraitImgUrl, landscapeImgUrl };

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API}/movie/createmovie`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newMovie),
                    credentials: "include",
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log("Movie creation successful", data);

                toast.success("Movie Created Successfully", {
                    position: toast.POSITION.TOP_CENTER,
                });
            } else {
                console.error("Movie creation failed", response.statusText);
                toast.error("Movie Creation Failed", {
                    position: toast.POSITION.TOP_CENTER,
                });
            }
        }
        catch (error) {
            console.error("An error occurred during movie creation", error);
        }
    }

    return (
        <div className="formpage">
            <input
                type="text"
                name="title"
                placeholder="Title"
                value={movie.title}
                onChange={handleInputChange}
            />
            <div>
                <input
                    type="text"
                    placeholder="Director"
                    name="director"
                    value={movie.director}
                    onChange={handleInputChange} // Sử dụng handleInputChange cho trường đạo diễn
                />
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Language"
                    name="language"
                    value={movie.language}
                    onChange={handleInputChange}
                />
            </div>

            <div>
                <input
                    type="date"
                    placeholder="Release Date"
                    name="releasedate"
                    value={releaseDate}
                    onChange={handleDateChange}
                />
            </div>
            <input
                type="text"
                name="description"
                placeholder="Description"
                value={movie.description}
                onChange={handleInputChange}
            />
            <br />

            <label>Portrait Image</label>
            <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                    if (event.target.files && event.target.files.length > 0) {
                        setMovie({ ...movie, portraitImg: event.target.files[0] })
                    }
                }}
            />
            <br />
            <label>Landscape Image</label>
            <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                    if (event.target.files && event.target.files.length > 0) {
                        setMovie({ ...movie, landscapeImg: event.target.files[0] })
                    }
                }}
            />
            <br />

            <label>Rated</label>
            <input
                type="text"
                name="rated"
                placeholder="Rated"
                value={movie.rated}
                onChange={handleInputChange}
            />
            <br />
            <div>
                <p>Chọn thể loại:</p>
                {genres.map((genre) => (
                    <label key={genre}>
                        <input
                            type="checkbox"
                            name="genre"
                            checked={movie.genre.includes(genre)}
                            onChange={() => handleGenreChange(genre)}
                        />
                        {genre}
                    </label>
                ))}
            </div>


            <br />

            <label>Thời lượng</label>
            <input
                type="number"
                name="duration"
                placeholder="Duration"
                value={movie.duration}
                onChange={handleInputChange}
            />
            <br />
            <div>
                <input
                    type="text"
                    placeholder="Tên diễn viên"
                    onChange={(e) => setActorName(e.target.value)}
                    value={actorName}
                />
                <button onClick={handleCastChange}>Thêm diễn viên</button>
            </div>
            <div>
                <p>{movie.cast.join(", ")}</p>
            </div>
            <button onClick={handleCreateMovie}>Create Movie</button>

        </div>

    )
}
export default CreateMoviePage;