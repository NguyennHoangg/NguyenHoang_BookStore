
export interface CategoryFilterProps {
    categories: Array<{
        id: string;
        name: string;
        quantity: number;
    }>;
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
     const hasBooks = categories.filter(c => c.quantity > 0).sort((a, b) => b.quantity - a.quantity);
    return (
        <div className="grid gap-2 border-none align-items-end">
            <h3 className="py-4 text-lg font-semibold text-gray-600">Thể loại</h3>
            {hasBooks.map((category) => {

                return (
                    <button
                        key={category.id}
                        onClick={() => onCategoryChange(category.id)}
                        className={`${selectedCategory === category.id ? "bg-gray-200" : "hover:bg-gray-100 hover:rounded-md"} border-none outline-none flex items-center justify-between`}
                    >
                        <span
                            className={`flex items-center justify-between ${
                                !hasBooks
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "focus:text-[#153328] focus:border-[#153328]"
                            }`}
                        >
                            {category.name}
                        </span>
                        
                        {hasBooks && (
                            <span className="bg-gray-100 px-2 py-1 rounded-full">
                                {category.quantity}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}