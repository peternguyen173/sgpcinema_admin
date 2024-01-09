'use client'
import React from 'react'
import './createschedule.css'
import { ToastContainer, toast } from "react-toastify";



interface schedule {
    screenId: string,
    movieId: string,
    showTime: string,
    showDate: string
}
interface Screen {
    _id: string;
    name: string;
    rows: any[]; // Change the type to an array of numbers
    screenType: string;
    movieSchedules: any[];
}

interface Movie {
    _id: string;
    title: string;
    description: string;
    portraitImgUrl: string;
    portraitImg: File | null;
    landscapeImgUrl: string;
    landscapeImg: File | null;
    rating: number;
    genre: string[];
    duration: number;
}

const page = () => {
    const [schedule, setSchedule] = React.useState<schedule>({
        screenId: '',
        movieId: '',
        showTime: '',
        showDate: ''
    })

    const [city, setCity] = React.useState('')
    const [screens, setScreens] = React.useState<Screen[]>([])
    const [movies, setMovies] = React.useState<Movie[]>([])
    const [showMovieList, setShowMovieList] = React.useState(false);


    const getMovies = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/movies`)
        const data = await res.json()
        setMovies(data.data)
        console.log(data.data)
    }

    React.useEffect(() => {
        getMovies()
    }, [])


    const getScreens = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/getscreens`)
        const data = await res.json()
        setScreens(data.data)
        console.log(data.data)
    }

    const createSchedule = async () => {
        if (!schedule.screenId || !schedule.movieId || !schedule.showTime || !schedule.showDate) {
            toast.error("Please fill all the fields");
            return
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/addmoviescheduletoscreen`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(schedule)
        })


        const data = await res.json()
        console.log(data)
        if (data.ok) {
            toast.success("Schedule created successfully");
        } else {
            toast.error("Schedule creation failed");
        }

    }
    return (
        <div className="formpage">

            <button
                onClick={() => getScreens()}
            ><h2>Hiển thị các phòng chiếu</h2></button>

            <div className='items'>
                {
                    screens?.map((screen, index) => (
                        <div className={
                            schedule.screenId === screen._id ? 'item selected' : 'item'
                        } key={index}
                            onClick={() => {
                                setSchedule({ ...schedule, screenId: screen._id })
                            }}
                        >
                            <p>{screen.name}</p>
                            <p>{screen.screenType}</p>
                        </div>
                    ))}
            </div>

            <button onClick={() => setShowMovieList(!showMovieList)}>
                <h2>Hiển thị danh sách phim</h2>
            </button>

            <div className='items' style={{ display: showMovieList ? '' : 'none' }}>
                {
                    movies?.map((movie, index) => (
                        <div className={
                            schedule.movieId === movie._id ? 'item selected' : 'item'
                        } key={index}
                            onClick={() => {
                                setSchedule({ ...schedule, movieId: movie._id })
                            }}
                        >
                            <p>{movie.title}</p>
                        </div>
                    ))}
            </div>


            <input type="time" name="showTime" id="showTime"
                onChange={(e) => setSchedule({ ...schedule, showTime: e.target.value })}
            />
            <input type="date" name="showDate" id="showDate"
                onChange={(e) => setSchedule({ ...schedule, showDate: e.target.value })}
            />

            <button
                onClick={() => {
                    createSchedule()
                }}
            >Save</button>
        </div>
    )
}

export default page