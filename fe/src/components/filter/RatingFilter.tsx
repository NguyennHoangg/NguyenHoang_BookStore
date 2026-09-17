import {useState} from "react";
import { StarIcon} from "@heroicons/react/24/outline";



export interface RatingFilterProps {
    currentRating: number;
    onFilterChange: (rating: number) => void;
}

export default function RatingFilter({ currentRating, onFilterChange }: RatingFilterProps) {
    const [hoverRating, setHoverRating] = useState<number>(0);

    return (
        <div className="my-6">
            <h3 className="text-xl font-serif italic text-[#153328]">Rating</h3>
            <div className="flex ">
                {[1, 2, 3, 4, 5].map((rating) => (
                    <StarIcon
                        key={rating}
                        className={`h-6 w-6 cursor-pointer ${hoverRating >= rating ? 'text-yellow-500' : 'text-gray-400'
                            }`}
                        onClick={() => {
                            onFilterChange(rating);
                            setHoverRating(rating);
                        }}
                        onMouseEnter={() => setHoverRating(rating)}
                        onMouseLeave={() => setHoverRating(0)}
                    />
                ))}
            </div>
        </div>
    );
}