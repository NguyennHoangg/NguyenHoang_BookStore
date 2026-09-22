import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";

export interface RatingFilterProps {
    currentRating: number;
    onFilterChange: (rating: number) => void;
}

export default function RatingFilter({ currentRating, onFilterChange }: RatingFilterProps) {
    return (
        <div className="my-6">
            <h3 className="text-xl font-serif italic text-[#153328] mb-3">Đánh giá</h3>
            <div className="flex flex-col gap-1.5">
                {[5, 4, 3, 2, 1].map((rating) => (
                    <button
                        key={rating}
                        onClick={() => onFilterChange(rating)}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors text-left ${
                            currentRating === rating
                                ? "bg-[#153328]/10 text-[#153328]"
                                : "hover:bg-gray-100 text-gray-600"
                        }`}
                    >
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) =>
                                star <= rating ? (
                                    <StarSolid key={star} className="h-4 w-4 text-yellow-400" />
                                ) : (
                                    <StarOutline key={star} className="h-4 w-4 text-gray-300" />
                                )
                            )}
                        </div>
                        <span className="text-xs">
                            {rating === 5 ? "5 sao" : `${rating}+ sao`}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}