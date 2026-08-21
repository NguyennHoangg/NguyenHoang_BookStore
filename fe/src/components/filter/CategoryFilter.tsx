
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
    return (
        <div className="grid gap-2 border-none align-items-end">
            <h3 className="py-4 text-lg font-sans text-gray-600">Thể loại</h3>
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => onCategoryChange(category.id)}
                    className={`${selectedCategory === category.id ? "bg-gray-200" : "hover:bg-gray-100 hover:rounded-md"} border-none outline-none flex items-center justify-between`}
                >
                    <span className="flex items-center justify-between focus:text-[#153328] focus:border-[#153328]">{category.name}</span>
                    <span className="bg-gray-100 px-2 py-1 rounded-full">{category.quantity}</span>
                </button>
            ))}
        </div>
    );
}