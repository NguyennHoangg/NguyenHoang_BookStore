
export interface CategoryFilterProps {
    categories: Array<{
        id: string;
        slug: string;
        name: string;
        quantity: number;
    }>;
    selectedCategory: string;
    onCategoryChange: (slug: string) => void;
}

export default function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
     const hasBooks = categories.filter(c => c.quantity > 0).sort((a, b) => b.quantity - a.quantity);
    return (
        <div className="grid mt-8 gap-2 border-none align-items-end">
            <h3 className=" text-2xl font-serif italic text-[#153328]">Thể loại</h3>
            
            {hasBooks.map((category) => {

                return (
                    <button
                        key={category.id}
                        onClick={() => onCategoryChange(category.slug)}
                        className={`${selectedCategory === category.slug ? "bg-gray-200" : "hover:bg-gray-100 hover:rounded-md"} border-none outline-none flex items-center justify-between focus:rounded-md p-0.5 `}
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