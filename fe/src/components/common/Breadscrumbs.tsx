
export interface BreadcrumbsProps{
    items : string[]
    className?: string;
    onSelect?: (item: string) => void;
    separator?: string;
}

export default function Breadcrumbs({items, className, onSelect, separator = "/"}: BreadcrumbsProps){
    return(
        <div className={`flex items-center gap-1 ${className}`}>
            {items.map((item, index) => (
                <>
                <button
                key={index}
                onClick={() => onSelect?.(item)}
                className="text-sm text-gray-500 hover:text-gray-700"
                >
                {item}
                </button>
                {index < items.length - 1 && <span>{separator}</span>}
                </>
            ))}
        </div>
    )
}
