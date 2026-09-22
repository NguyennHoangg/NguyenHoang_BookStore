export interface BreadcrumbsProps {
    items: (string | undefined)[];
    className?: string;
    onSelect?: (item: string) => void;
    separator?: string;
}

export default function Breadcrumbs({ items, className, onSelect, separator = "/" }: BreadcrumbsProps) {
    const validItems = items.filter(Boolean) as string[];

    return (
        <nav aria-label="Breadcrumb" className={`flex items-center flex-wrap gap-1 ${className ?? ""}`}>
            {validItems.map((item, index) => {
                const isLast = index === validItems.length - 1;
                return (
                    <span key={index} className="flex items-center gap-1">
                        {isLast ? (
                            <span className="text-sm text-gray-800 font-medium truncate max-w-[200px]" aria-current="page">
                                {item}
                            </span>
                        ) : (
                            <button
                                onClick={() => onSelect?.(item)}
                                className="text-sm text-gray-400 hover:text-gray-700 transition-colors truncate max-w-[150px]"
                            >
                                {item}
                            </button>
                        )}
                        {!isLast && (
                            <span className="text-gray-300 text-xs select-none">{separator}</span>
                        )}
                    </span>
                );
            })}
        </nav>
    );
}
