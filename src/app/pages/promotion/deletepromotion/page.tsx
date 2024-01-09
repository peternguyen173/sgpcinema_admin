"use client"
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './promotion.css';

interface Promotion {
    _id: string;
    title: string;
    type: string;
    description: string;
    discount: number;
    startDate: string;
    expiryDate: string;
}

const PromotionListPage: React.FC = () => {
    const [promotions, setPromotions] = useState<Promotion[]>([]);

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/getpromotions`);
                if (response.ok) {
                    const data = await response.json();
                    setPromotions(data.data);
                } else {
                    console.error('Failed to fetch promotions');
                    toast.error('Failed to fetch promotions');
                }
            } catch (error) {
                console.error('Error fetching promotions', error);
                toast.error('Error fetching promotions');
            }
        };

        fetchPromotions();
    }, []);

    const handleDeletePromotion = async (id: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/deletepromotion/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                const updatedPromotions = promotions.filter(promotion => promotion._id !== id);
                setPromotions(updatedPromotions);
                toast.success('Promotion Deleted Successfully', {
                    position: toast.POSITION.TOP_CENTER,
                });
            } else {
                console.error('Promotion deletion failed', response.statusText);
                toast.error('Promotion Deletion Failed', {
                    position: toast.POSITION.TOP_CENTER,
                });
            }
        } catch (error) {
            console.error('Error deleting promotion', error);
            toast.error('Error deleting promotion');
        }
    };

    return (
        <div className="promotion-list">
            <h1>Danh sách các khuyến mãi</h1>
            <table className="promotions-table">
                <thead>
                    <tr>
                        <th>Tên</th>
                        <th>Mô tả</th>
                        <th>Giảm giá</th>
                        <th>Loại giảm giá</th>
                        <th>Ngày bắt đầu</th>
                        <th>Ngày kết thúc</th>
                    </tr>
                </thead>
                <tbody>
                    {promotions.map((promotion) => (
                        <tr key={promotion._id}>
                            <td>{promotion.title}</td>
                            <td>{promotion.description}</td>
                            <td>{promotion.discount}{promotion.type === "fixed" ? "đ" : "%"}
                            </td>
                            <td>{promotion.type === "fixed" ? "Cố định" : "Theo phần trăm"}</td>
                            <td>{promotion.startDate}</td>
                            <td>{promotion.expiryDate}</td>
                            <td>
                                <button onClick={() => handleDeletePromotion(promotion._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ToastContainer />
        </div>
    );
};

export default PromotionListPage;
