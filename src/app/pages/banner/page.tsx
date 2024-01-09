'use client'
import "./banner.css"
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';
import Image from 'next/image';

interface Banner {
    _id: string;
    imageUrl: string;
    // Các trường thông tin khác liên quan đến banner
}
const bannerPage = () => {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        };

        // Kiểm tra nếu window tồn tại trước khi thêm event listener
        if (typeof window !== 'undefined') {
            // Set giá trị ban đầu
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);

            // Thêm event listener để xử lý việc resize
            window.addEventListener('resize', handleResize);

            // Xóa event listener khi component unmount
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, []); // Chạy effect này chỉ một lần sau khi render ban đầu

    // Rest của component code dùng width và height
    useEffect(() => {
        getBanners(); // Gọi hàm getBanners khi component được render
    }, []);
    const [image, setImage] = useState<File | null>(null);
    const [banners, setBanners] = useState<Banner[]>([]);
    const [banners1, setBanners1] = useState<Banner[]>([]);

    const getBanners = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API}/banner/getbanners`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: 'include'

                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log("Banners fetched successfully:", data);
                setBanners1(data.banners); // Cập nhật danh sách banners từ server
            } else {
                console.error("Failed to fetch banners.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };
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
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setImage(event.target.files[0]);

        }
    };
    const handleUpload = async () => {
        if (image) {
            const imageUrl = await uploadImage(image);
            if (imageUrl) {
                setBanners([...banners, imageUrl]); // Thêm URL mới vào mảng banners
                toast.success("Tạo banner thành công", {
                    position: toast.POSITION.TOP_CENTER,
                });
            } else {
                toast.error("Failed to upload the image.", {
                    position: toast.POSITION.TOP_CENTER,
                });
            }
        } else {
            toast.error("Please select an image to upload.", {
                position: toast.POSITION.TOP_CENTER,
            });
        }
    };

    const saveBanners = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API}/banner/save`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ banners }), // Gửi danh sách banners lên server
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log("Banners saved successfully:", data);
                toast.success("Lưu banner thành công", {
                    position: toast.POSITION.TOP_CENTER,
                });
            } else {
                console.error("Failed to save banners.");
                toast.error("Lưu banner thất bại", {
                    position: toast.POSITION.TOP_CENTER,
                });
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("An error occurred while saving banners", {
                position: toast.POSITION.TOP_CENTER,
            });
        }
    };

    const removeBanner = async (bannerId: string) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API}/banner/banners/${bannerId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                }
            );

            if (response.ok) {
                setBanners1((prevBanners) =>
                    prevBanners.filter((banner) => banner.imageUrl !== bannerId)
                );
                toast.success('Banner removed successfully', {
                    position: toast.POSITION.TOP_CENTER,
                });
            } else {
                const data = await response.json();
                console.error(`Failed to remove banner: ${data.error}`);
                toast.error('Failed to remove the banner', {
                    position: toast.POSITION.TOP_CENTER,
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred while removing the banner', {
                position: toast.POSITION.TOP_CENTER,
            });
        }
    };



    return (
        <div className="banner">
            <br></br><br></br>

            <h3>Chọn ảnh Banner</h3>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
            />
            <button onClick={handleUpload}>Tạo banner</button>
            <a href="/pages/banner">
                <button onClick={saveBanners}>Lưu banner</button></a>

            <ToastContainer />
            {/* Hiển thị danh sách các URL ảnh */}
            <div>
                <h2>Danh sách banner</h2>

            </div>
            <div className="s">
                <Swiper
                    cssMode={true}
                    navigation={true}
                    pagination={true}
                    mousewheel={true}
                    keyboard={true}
                    modules={[Navigation, Pagination, Mousewheel, Keyboard]}
                    className="mySwiper"
                >
                    {
                        banners1.map((banner, index) => {
                            return (
                                <SwiperSlide key={index}>
                                    <Image src={banner.imageUrl} alt="" width={width} height={height}
                                        style={{
                                            objectFit: "cover"
                                        }} />
                                    <a href="/pages/banner">
                                        <button onClick={() => removeBanner(banner._id)}>
                                            Remove Banner
                                        </button></a>
                                </SwiperSlide>
                            )
                        })
                    }
                </Swiper>
            </div>
        </div>
    )
}
export default bannerPage