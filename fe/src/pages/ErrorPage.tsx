import { useNavigate } from "react-router-dom";
import Button from "../components/button/button";

export default function ErrorPage() {
	const navigate = useNavigate();

	const handleRetry = () => {
		window.location.reload();
	};

	return (
		<>
			<style>{`
				@keyframes fadeUp {
					from { transform: translateY(18px); opacity: 0; }
					to { transform: translateY(0); opacity: 1; }
				}

				@keyframes drift {
					0%, 100% { transform: translateY(0px) translateX(0px); }
					50% { transform: translateY(-14px) translateX(6px); }
				}

				@keyframes glowPulse {
					0%, 100% { opacity: 0.22; transform: scale(1); }
					50% { opacity: 0.42; transform: scale(1.08); }
				}

				.fade-up-1 { animation: fadeUp 0.45s ease 0.05s both; }
				.fade-up-2 { animation: fadeUp 0.45s ease 0.12s both; }
				.fade-up-3 { animation: fadeUp 0.45s ease 0.18s both; }
				.drift { animation: drift 4.8s ease-in-out infinite; }
				.glow-pulse { animation: glowPulse 3.5s ease-in-out infinite; }
			`}</style>

			<div className="relative min-h-screen overflow-hidden bg-surface text-on-surface">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(21,51,40,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(112,90,73,0.12),transparent_30%)]" />

				<div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-12 lg:px-12">
					<div className="grid w-full items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
						<section className="max-w-2xl">
							<p className="fade-up-1 mb-4 font-sans text-label-md uppercase tracking-[0.28em] text-on-surface-variant">
								Sự cố hệ thống
							</p>

							<div className="fade-up-2 mb-6 flex items-end gap-4">
								<h1 className="font-serif text-[clamp(4rem,14vw,8rem)] font-bold leading-none text-primary">
									500
								</h1>
								<span className="mb-2 h-px flex-1 bg-outline-variant" />
							</div>

							<div className="fade-up-2 mb-8 space-y-4">
								<h2 className="max-w-xl font-serif text-headline-md text-on-surface lg:text-headline-lg">
									Trang này tạm thời không thể hiển thị.
								</h2>
								<p className="max-w-xl font-sans text-body-md leading-relaxed text-on-surface-variant">
									Hệ thống đã gặp lỗi khi xử lý yêu cầu của bạn. Bạn có thể thử lại,
									quay về trang chủ, hoặc quay lại trang trước để tiếp tục.
								</p>
							</div>

							<div className="fade-up-3 flex flex-col gap-3 sm:flex-row">
								<Button type="button" variant="primary" onClick={() => navigate("/")}>
									Về trang chủ
								</Button>
								<Button type="button" variant="secondary" onClick={handleRetry}>
									Tải lại trang
								</Button>
								<Button
									type="button"
									variant="ghost"
									onClick={() => navigate(-1)}
									className="px-0 sm:px-4"
								>
									Quay lại
								</Button>
							</div>

							<div className="fade-up-3 mt-10 grid gap-4 sm:grid-cols-3">
								<div className="bg-surface-container-low p-5 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
									<p className="font-sans text-label-sm uppercase tracking-[0.2em] text-on-surface-variant">
										Trạng thái
									</p>
									<p className="mt-2 font-serif text-2xl text-on-surface">Tạm lỗi</p>
								</div>
								<div className="bg-surface-container-low p-5 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
									<p className="font-sans text-label-sm uppercase tracking-[0.2em] text-on-surface-variant">
										Hành động
									</p>
									<p className="mt-2 font-serif text-2xl text-on-surface">Thử lại</p>
								</div>
								<div className="bg-surface-container-low p-5 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
									<p className="font-sans text-label-sm uppercase tracking-[0.2em] text-on-surface-variant">
										Hướng dẫn
									</p>
									<p className="mt-2 font-serif text-2xl text-on-surface">Hồi phục</p>
								</div>
							</div>
						</section>

						<aside className="relative flex min-h-[360px] items-center justify-center lg:min-h-[520px]">
							<div className="absolute h-72 w-72 rounded-full bg-primary-container/20 blur-3xl glow-pulse" />
							<div className="absolute h-48 w-48 rounded-full border border-outline-variant/60 bg-surface-container-low/75 shadow-[0_24px_70px_rgba(0,0,0,0.08)] drift" />

							<div className="relative z-10 w-full max-w-sm bg-surface-container p-8 shadow-[0_30px_90px_rgba(0,0,0,0.08)]">
								<div className="mb-6 flex items-center justify-between">
									<span className="font-sans text-label-md uppercase tracking-[0.24em] text-on-surface-variant">
										System note
									</span>
									<span className="font-serif text-3xl text-primary">!</span>
								</div>

								<div className="space-y-4">
									<div className="h-1 w-3/4 bg-primary-container/40" />
									<div className="h-1 w-1/2 bg-outline-variant/60" />
									<div className="h-1 w-5/6 bg-primary-container/25" />
									<div className="h-1 w-2/3 bg-outline-variant/50" />
								</div>

								<div className="mt-8 border-t border-outline-variant/40 pt-6">
									<p className="font-sans text-label-sm uppercase tracking-[0.2em] text-on-surface-variant">
										Gợi ý
									</p>
									<p className="mt-2 font-serif text-xl text-on-surface leading-snug">
										Lỗi này thường chỉ là tạm thời. Thử lại sau vài giây.
									</p>
								</div>
							</div>
						</aside>
					</div>
				</div>
			</div>
		</>
	);
}
