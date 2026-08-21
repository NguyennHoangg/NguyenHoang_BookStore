import BookCardSkeleton from "./book-card-skeleton"

export default function PageSkeleton({type, lines} : {type: string, lines: number}) {
   if(type === "text"){
    return (
        <div className=" mx-auto container px-4 lg:px-20 pt-48">
            {Array.from({length: lines}).map((_, i) => (
                <div key={i} className="h-6 bg-gray-200 rounded w-full mb-4 animate-pulse"></div>
            ))}
        </div>
    )
   }
   if(type === "product"){
    return (
        <BookCardSkeleton />
    )
   }
}
 