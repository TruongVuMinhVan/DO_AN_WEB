// IndexPage.jsx - Trang giới thiệu đầy đủ "Sống Khỏe" (Nâng cấp tối ưu, slide hiện đại, tự chuyển + chuyển tay, hiển thị chỉ số, lấp đầy phần slide)
// Cần cài: npm install react-icons aos

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaAppleAlt, FaChartLine, FaHeartbeat, FaRegQuestionCircle, FaQuoteLeft } from 'react-icons/fa';
import 'aos/dist/aos.css';
import AOS from 'aos';

const slideImages = [
    process.env.PUBLIC_URL + '/images/anhslide1.jpg',
    process.env.PUBLIC_URL + '/images/anhslide2.jpg',
    process.env.PUBLIC_URL + '/images/anhslide3.jpg',
];

const partnerLogos = [
    '/images/partner1.png',
    '/images/partner2.png',
    '/images/partner3.png',
    '/images/partner4.png',
];

const testimonials = [
    {
        name: "Nguyễn Văn A",
        feedback: "Nhờ Sống Khỏe, tôi hiểu rõ hơn về dinh dưỡng và kiểm soát cân nặng hiệu quả.",
        avatar: "/images/user1.jpg",
    },
    {
        name: "Lê Thị B",
        feedback: "Các biểu đồ trực quan giúp tôi bám sát mục tiêu sức khỏe mỗi ngày.",
        avatar: "/images/user2.jpg",
    },
    {
        name: "Trần Văn C",
        feedback: "Tính năng phân tích thành phần bữa ăn thật sự rất hữu ích và dễ sử dụng.",
        avatar: "/images/user3.jpg",
    },
];

const faqs = [
    {
        question: "Sống Khỏe có miễn phí không?",
        answer: "Bạn có thể sử dụng miễn phí với các tính năng cơ bản. Các tính năng nâng cao sẽ có gói Premium.",
    },
    {
        question: "Tôi có thể theo dõi dinh dưỡng cho nhiều người không?",
        answer: "Mỗi tài khoản cá nhân hóa theo từng người. Bạn có thể tạo nhiều tài khoản cho các thành viên trong gia đình.",
    },
    {
        question: "Dữ liệu cá nhân của tôi có được bảo mật không?",
        answer: "Sống Khỏe cam kết bảo mật tuyệt đối thông tin cá nhân của bạn theo quy định pháp luật hiện hành.",
    },
];

const IndexPage = () => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [faqOpen, setFaqOpen] = useState(null);

    useEffect(() => {
        AOS.init({ duration: 900, once: true });
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slideImages.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    // Chuyển slide thủ công
    const goToSlide = idx => setCurrentSlide(idx);
    const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slideImages.length - 1 : prev - 1));
    const nextSlide = () => setCurrentSlide((prev) => (prev === slideImages.length - 1 ? 0 : prev + 1));

    return (
        <div className="font-sans bg-white text-gray-800">
            {/* Header */}
            <header className="bg-white shadow p-4 flex justify-between items-center max-w-7xl mx-auto sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <img
                        src={process.env.PUBLIC_URL + '/images/LOGO.jpg'}
                        alt="Logo Sống Khỏe"
                        className="w-14 h-14 rounded-full border-2 border-green-600"
                    />
                    <span className="text-2xl font-bold text-green-700 ml-2 tracking-tight">Sống Khỏe</span>
                </div>
                <nav className="hidden md:flex gap-7 text-base font-medium">
                    <a href="#features" className="hover:text-green-600">Tính năng</a>
                    <a href="#blog" className="hover:text-green-600">Bài viết</a>
                    <a href="#faq" className="hover:text-green-600">Hỏi đáp</a>
                    <a href="#contact" className="hover:text-green-600">Liên hệ</a>
                </nav>
                <div>
                    <button
                        onClick={() => navigate('/login')}
                        className="mr-4 px-5 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
                    >
                        Đăng nhập
                    </button>
                    <button
                        onClick={() => navigate('/signUpPage')}
                        className="px-5 py-2 border border-green-600 text-green-600 rounded-full hover:bg-green-50 transition"
                    >
                        Đăng ký
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-green-100 to-green-50 py-16 px-6 text-center relative">
                <h1 className="text-5xl md:text-6xl font-extrabold text-green-700 mb-4 tracking-tight drop-shadow-lg" data-aos="fade-down">
                    Sống Khỏe - Khởi nguồn sống lành mạnh
                </h1>
                <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto" data-aos="fade-up">
                    Theo dõi dinh dưỡng toàn diện, phân tích thành phần bữa ăn, lập kế hoạch sức khoẻ cá nhân hóa.
                </p>
                <button
                    onClick={() => navigate('/signUpPage')}
                    className="bg-green-600 text-white px-10 py-4 text-lg rounded-full hover:bg-green-700 shadow-lg transition"
                >
                    Bắt đầu ngay
                </button>
                <div className="absolute right-12 top-10 hidden md:block animate-bounce">
                    <FaHeartbeat className="text-green-300 text-7xl opacity-60" />
                </div>
            </section>

            {/* Slide Show */}
            <section className="py-12 relative bg-gray-50">
                <div className="max-w-7xl mx-auto rounded-2xl shadow-2xl overflow-hidden border-4 border-green-100 relative group">
                    <img
                        src={slideImages[currentSlide]}
                        alt={`Slide ${currentSlide + 1}`}
                        className="w-full h-[60vw] max-h-[600px] object-cover transition duration-1000"
                    />
                    {/* Nút điều hướng trái phải */}
                    <button
                        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-green-200 text-3xl p-2 rounded-full shadow transition z-10"
                        onClick={prevSlide}
                        aria-label="Ảnh trước"
                        tabIndex={0}
                    >
                        &#8592;
                    </button>
                    <button
                        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-green-200 text-3xl p-2 rounded-full shadow transition z-10"
                        onClick={nextSlide}
                        aria-label="Ảnh sau"
                        tabIndex={0}
                    >
                        &#8594;
                    </button>
                    {/* Chỉ số slide */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm font-semibold shadow">
                        {currentSlide + 1} / {slideImages.length}
                    </div>
                    {/* Dots chọn nhanh */}
                    <div className="absolute bottom-4 right-6 flex gap-2">
                        {slideImages.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => goToSlide(idx)}
                                className={`w-3 h-3 rounded-full border border-white ${currentSlide === idx ? 'bg-green-600' : 'bg-green-200'} transition`}
                                aria-label={`Chọn slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Partner Logos */}
            <section className="py-8 bg-white">
                <div className="max-w-4xl mx-auto flex flex-wrap justify-center items-center gap-8 opacity-80">
                    {partnerLogos.map((src, idx) => (
                        <img key={idx} src={src} alt="Đối tác" className="h-10 md:h-14 mix-blend-multiply grayscale hover:grayscale-0 transition" />
                    ))}
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-14 bg-gray-50">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-green-700 mb-12" data-aos="fade-up">Tính năng nổi bật</h2>
                    <div className="grid md:grid-cols-3 gap-10">
                        <div className="bg-white p-8 rounded-xl shadow-lg border hover:scale-105 transition" data-aos="fade-up" data-aos-delay="100">
                            <FaAppleAlt className="text-4xl text-green-600 mb-4 mx-auto" />
                            <h4 className="text-xl font-semibold text-green-700 mb-2">Phân tích dưỡng chất</h4>
                            <p>Theo dõi chi tiết calo, protein, carb, fat cho từng bữa ăn, tích hợp AI nhận diện món ăn qua ảnh.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-lg border hover:scale-105 transition" data-aos="fade-up" data-aos-delay="200">
                            <FaChartLine className="text-4xl text-green-600 mb-4 mx-auto" />
                            <h4 className="text-xl font-semibold text-green-700 mb-2">Theo dõi mục tiêu</h4>
                            <p>Lập kế hoạch dinh dưỡng cá nhân, gợi ý thực đơn phù hợp thể trạng, báo cáo tiến độ hàng tuần.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-lg border hover:scale-105 transition" data-aos="fade-up" data-aos-delay="300">
                            <FaHeartbeat className="text-4xl text-green-600 mb-4 mx-auto" />
                            <h4 className="text-xl font-semibold text-green-700 mb-2">Biểu đồ trực quan</h4>
                            <p>Phân tích xu hướng dinh dưỡng, hiển thị biểu đồ dễ hiểu, cảnh báo vượt ngưỡng sức khỏe.</p>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-10 mt-10">
                        <div className="bg-white p-7 rounded-xl shadow border" data-aos="fade-up" data-aos-delay="400">
                            <FaRegQuestionCircle className="text-3xl text-green-600 mb-2 mx-auto" />
                            <h4 className="text-lg font-medium mb-1">Cộng đồng hỏi đáp</h4>
                            <p>Chia sẻ kinh nghiệm, hỏi chuyên gia, kết nối người dùng cùng mục tiêu.</p>
                        </div>
                        <div className="bg-white p-7 rounded-xl shadow border" data-aos="fade-up" data-aos-delay="500">
                            <FaQuoteLeft className="text-3xl text-green-600 mb-2 mx-auto" />
                            <h4 className="text-lg font-medium mb-1">Chứng nhận chuyên gia</h4>
                            <p>Thông tin được kiểm duyệt bởi chuyên gia dinh dưỡng hàng đầu Việt Nam.</p>
                        </div>
                        <div className="bg-white p-7 rounded-xl shadow border" data-aos="fade-up" data-aos-delay="600">
                            <FaHeartbeat className="text-3xl text-green-600 mb-2 mx-auto" />
                            <h4 className="text-lg font-medium mb-1">Đa nền tảng</h4>
                            <p>Ứng dụng web, mobile, đồng bộ dữ liệu và trải nghiệm mượt mà trên mọi thiết bị.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="bg-gradient-to-br from-green-50 to-white py-14">
                <div className="max-w-5xl mx-auto">
                    <h3 className="text-3xl font-bold text-center mb-10 text-green-700" data-aos="fade-up">Cảm nhận người dùng</h3>
                    <div className="grid md:grid-cols-3 gap-7">
                        {testimonials.map((t, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-xl shadow-lg border flex flex-col items-center text-center" data-aos="fade-up" data-aos-delay={idx * 100}>
                                <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full mb-3 border-2 border-green-400 object-cover" />
                                <p className="italic text-gray-700 mb-2">&quot;{t.feedback}&quot;</p>
                                <span className="text-green-700 font-semibold">{t.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Blog Section */}
            <section id="blog" className="py-12 bg-gray-100">
                <div className="max-w-6xl mx-auto">
                    <h3 className="text-3xl font-bold text-center mb-10 text-green-700" data-aos="fade-up">Bài viết mới nhất</h3>
                    <div className="grid md:grid-cols-3 gap-7">
                        <a href="https://hellobacsi.com/dinh-duong/thuc-pham-va-loi-ich/5-loai-thuc-pham-giau-chat-xo/" target="_blank" rel="noopener noreferrer" className="bg-white p-6 rounded-xl shadow hover:shadow-xl block border hover:scale-105 transition" data-aos="fade-up" data-aos-delay="100">
                            <h4 className="font-semibold text-lg mb-2">5 loại thực phẩm giàu xơ</h4>
                            <p className="text-sm">Tổng hợp những món ăn hỗ trợ hệ tiêu hóa</p>
                        </a>
                        <a href="https://vinmec.com/vi/tin-tuc/thong-tin-suc-khoe/dinh-duong/loi-ich-cua-protein-doi-voi-co-the/" target="_blank" rel="noopener noreferrer" className="bg-white p-6 rounded-xl shadow hover:shadow-xl block border hover:scale-105 transition" data-aos="fade-up" data-aos-delay="200">
                            <h4 className="font-semibold text-lg mb-2">Lợi ích của protein</h4>
                            <p className="text-sm">Tác dụng và vai trò của protein trong thực đơn</p>
                        </a>
                        <a href="https://www.bachhoaxanh.com/kinh-nghiem-hay/nhung-cach-giu-can-lau-dai-an-toan-va-hieu-qua-1504207" target="_blank" rel="noopener noreferrer" className="bg-white p-6 rounded-xl shadow hover:shadow-xl block border hover:scale-105 transition" data-aos="fade-up" data-aos-delay="300">
                            <h4 className="font-semibold text-lg mb-2">Bí quyết giữ cân lâu dài</h4>
                            <p className="text-sm">Cách thiết lập chế độ ăn uống lâu bền</p>
                        </a>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="py-14 bg-white">
                <div className="max-w-3xl mx-auto">
                    <h3 className="text-3xl font-bold text-center mb-10 text-green-700" data-aos="fade-up">Câu hỏi thường gặp</h3>
                    <div className="space-y-4">
                        {faqs.map((item, idx) => (
                            <div key={idx} className="border rounded-lg overflow-hidden" data-aos="fade-up" data-aos-delay={idx * 120}>
                                <button
                                    className="flex w-full justify-between items-center px-5 py-4 bg-green-50 hover:bg-green-100 transition group"
                                    onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                                    aria-expanded={faqOpen === idx}
                                    aria-controls={`faq-content-${idx}`}
                                >
                                    <span className="font-medium text-lg text-green-700 flex items-center gap-2">
                                        <FaRegQuestionCircle className="text-xl" /> {item.question}
                                    </span>
                                    <span className={`ml-3 transform transition-transform ${faqOpen === idx ? 'rotate-180' : ''}`}>▼</span>
                                </button>
                                <div
                                    id={`faq-content-${idx}`}
                                    className={`px-5 pb-4 text-gray-700 bg-white transition-all duration-300 ease-in-out ${faqOpen === idx ? 'block' : 'hidden'}`}
                                >
                                    {item.answer}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact & Footer */}
            <footer id="contact" className="bg-green-700 text-white text-center py-8 mt-10">
                <div className="max-w-4xl mx-auto mb-4">
                    <h4 className="text-xl font-semibold mb-2">Liên hệ với chúng tôi</h4>
                    <p className="mb-2">Email: <a href="mailto:support@songkhoe.vn" className="underline hover:text-green-200">support@songkhoe.vn</a></p>
                    <p className="mb-2">Hotline: <a href="tel:18001234" className="underline hover:text-green-200">1800 1234</a> (8:00 - 21:00)</p>
                    <p className="mb-2">Địa chỉ: 123 Nguyễn Văn Cừ, Quận 5, TP. HCM</p>
                </div>
                <div className="border-t border-green-500 pt-3">
                    <p>&copy; {new Date().getFullYear()} Sống Khỏe. All rights reserved.</p>
                    <p className="text-sm">Powered by <a href="https://github.com/vominhtam1704" className="underline hover:text-green-200">vominhtam1704</a></p>
                </div>
            </footer>
        </div>
    );
};

export default IndexPage;