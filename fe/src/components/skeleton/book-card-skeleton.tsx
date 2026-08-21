/**
 * BookCardSkeleton — bắt chước layout của BookCard với hiệu ứng pulse mờ mờ khi đang tải.
 */
export default function BookCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-sm bg-surface-container animate-pulse">
      {/* Ảnh bìa sách — tỉ lệ 2/3 giống BookCard */}
      <div className="relative aspect-[2/3] bg-surface-container-high">
        {/* Badge placeholder góc trên trái */}
        <div className="absolute left-4 top-4">
          <div className="h-5 w-16 rounded-sm bg-outline-variant/40" />
        </div>

        {/* Author + button placeholder ở đáy ảnh */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-2.5 w-10 rounded-sm bg-white/20" />
            <div className="h-5 w-3/4 rounded-sm bg-white/30" />
          </div>
          <div className="h-8 w-16 shrink-0 rounded-sm bg-white/20" />
        </div>
      </div>

      {/* Phần text bên dưới */}
      <div className="flex flex-1 flex-col p-5">
        <div className="space-y-3">
          {/* Tiêu đề — 2 dòng, cao cố định như BookCard */}
          <div className="h-[4rem] space-y-2">
            <div className="h-5 w-full rounded-sm bg-outline-variant/50" />
            <div className="h-5 w-4/5 rounded-sm bg-outline-variant/50" />
          </div>
          {/* Mô tả — 2 dòng */}
          <div className="h-10 space-y-2">
            <div className="h-3.5 w-full rounded-sm bg-outline-variant/30" />
            <div className="h-3.5 w-2/3 rounded-sm bg-outline-variant/30" />
          </div>
        </div>

        {/* Giá + nhà xuất bản */}
        <div className="mt-auto flex items-end justify-between gap-4 border-t border-outline-variant/40 pt-5">
          <div className="space-y-2">
            <div className="h-2.5 w-10 rounded-sm bg-outline-variant/30" />
            <div className="h-7 w-28 rounded-sm bg-outline-variant/50" />
          </div>
          <div className="space-y-2 text-right">
            <div className="h-2.5 w-16 rounded-sm bg-outline-variant/30" />
            <div className="h-3.5 w-20 rounded-sm bg-outline-variant/30" />
          </div>
        </div>
      </div>
    </div>
  );
}
