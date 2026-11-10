# TRIỂN LÃM VẠN TƯỢNG - NÉT MỰC THẤT TRUYỀN
### *Trò chơi Web Tương Tác Theo Cốt Truyện Dân Gian Việt Nam (Interactive Folk-Art Storytelling)*
*(Tôn vinh tinh hoa mỹ thuật Tranh Dân Gian, Gốm Cổ Bát Tràng, Nghệ Thuật Tuồng & Văn Hóa Đông Sơn)*

---

## 🌟 1. Cấu Trúc Toàn Diện 5 Tầng Trải Nghiệm

Trò chơi được xây dựng theo đúng cấu trúc chuẩn xác và tuần tự theo yêu cầu của bạn:

### 🏠 Tầng 1: Trang Chủ Cuộn Toàn Diện (Scrollable Landing Page)
- **Thanh Navbar Cố Định (Sticky Glassmorphic Nav)**: Ấn triện son "象", tựa đề VẠN TƯỢNG, liên kết điều hướng cuộn mượt (*Tổng quan, Tính năng, Di sản, Sáng lập*) cùng nút thao tác nhanh *Hướng Dẫn* và *Chơi Ngay*.
- **Hero Banner Nghệ Thuật**: Ấn triện bừng sáng, tựa đề thếp vàng, trích dẫn triết lý cõi mực và 2 nút hành động lớn (Bắt đầu hành trình $\rightarrow$ vào thẳng Lời dẫn; Hướng dẫn & Cơ chế $\rightarrow$ mở modal tại chỗ).
- **Tóm Tắt Dự Án (Product Overview)**: Giới thiệu tiền đề cốt truyện, bối cảnh triển lãm Hà Nội, bức tranh trung tâm tự vẽ nét mực và 4 chỉ số thống kê nổi bật (4 dòng di sản, 12+ cổ vật, 5 hồi kết ẩn, 100% tự chứa).
- **Tính Năng Gameplay Đột Phá (Core Features)**: Trình bày chi tiết 4 cơ chế then chốt: *Cốt truyện phân nhánh tự do*, *Chỉ số định lực tâm trí (Sanity)*, *Hệ thống cổ vật & manh mối*, và *Đa kết cục bí ẩn*.
- **Tinh Hoa Mỹ Thuật Dân Gian**: Bốn trụ cột văn hóa: Tranh Đông Hồ & Hàng Trống, Gốm Men Rạn Bát Tràng, Nghệ Thuật Tuồng Cổ và Văn Hóa Trống Đồng Đông Sơn.
- **Đội Ngũ Sáng Lập & Khát Vọng (Founder & Cultural Vision)**: Tuyên ngôn sứ mệnh số hóa di sản, đưa mỹ thuật cổ truyền vào không gian tương tác số sống động.
- **Lời Kêu Gọi Hành Động (Grand CTA) & Footer**: Kêu gọi dấn thân vào hành trình và tri ân các nghệ nhân làng nghề truyền thống Việt Nam.

---

### 🌊 Tầng 1.5: Hệ Thống Chuyển Cảnh Siêu Mượt (Smooth Transitions Engine)
- **Ink Bleed Transition Overlay**: Màn che loang mực đen toàn màn hình chuyển tiếp êm dịu giữa Trang Chủ và Gameplay với tiếng trống trận bập bùng.
- **Stage Scene Crossfade**: Khi chuyển cảnh hoặc đưa ra lựa chọn rẽ nhánh, khung tranh và khối chữ có hiệu ứng tan mờ & trượt nhẹ nhàng (`stage-fade-active`).
- **Scroll Reveal Animations**: Phát hiện vị trí cuộn trang bằng `IntersectionObserver`, làm nổi bật các thẻ tính năng và thông tin với nhịp trễ tự nhiên (stagger delay).
- **Smooth Container Scrolling**: Điều hướng chính xác tới các mục trên trang chủ mà không bị thanh navbar che khuất (`scroll-margin-top: 75px`).

---

### 📖 Tầng 2: Hướng Dẫn & Cơ Chế Sinh Tồn (Guide View)
- **☯ Định Lực (Tâm Trí)**: Đo lường độ tỉnh táo của người chơi từ 100% xuống 0%. Mỗi phán xét sai lầm hoặc hoảng loạn trước ảo ảnh sẽ trừ định lực. Về 0% sẽ bị mực nuốt chửng vĩnh viễn!
- **📜 Cổ Vật & Manh Mối**: Khám phá 4 màn chơi ở Sảnh Trung Tâm để tìm đủ 4 cổ vật và 4 mảnh ghép sự thật.
- **⚠️ Quyết Định Bất Khả Hoán**: Những hành vi then chốt trong từng màn (như gánh vác định mệnh minh oan, bẻ khóa men ngọc, dùng tro trấu nếp cái hoa vàng) sẽ khắc sâu vào thớ giấy và không thể thay đổi.
- **🔮 Hồi Kết Ẩn Bí**: Mọi nhãn dán tiết lộ kết cục (như [Good End], [Bad End]) đều được ẩn giấu hoàn toàn để người chơi lựa chọn bằng chính lương tri và trực giác.

---

### 📜 Tầng 3: Lời Dẫn Mở Đầu (Prologue - Nguyên văn 3 Bối cảnh)
1. **Bối cảnh 1 (Context 1) - Triển lãm của những tác phẩm thất truyền**: Giới thiệu về Triển lãm Vạn Tượng tại Hà Nội, nhà sưu tầm kín tiếng, chiếc Mặt Nạ Tuồng 3 hồ sơ mâu thuẫn và gốm Bát Tràng hoa văn lạ.
2. **Bối cảnh 2 (Context 2) - Không gian triển lãm & Tác phẩm trung tâm**: Khung tranh giấy dó trống rỗng với tấm biển: *"Tác phẩm trung tâm. Tạm thời chưa công bố"*. Những nét mực mờ nhạt lấp ló từ phía bên kia mặt giấy mà không ai nhận thấy.
3. **Bối cảnh 3 (Context 3) - Ranh giới vô hình & Tiếng trống trận**: Dòng người tan biến, cậu bé trong tranh nghiêng đầu cười ngoác rộng, tiếng trống trận bập bùng vang rền và rơi vào cõi giấy dó với câu sấm:
   > *“Muốn tìm thấy lối ra, hãy lật lại những điều bị bỏ lại trong từng nét vẽ.”*

---

### 🏛️ Tầng 4: Sảnh Trung Tâm Cõi Mực & 4 Màn Chơi Chuyên Sâu
Người chơi tự do lựa chọn 4 căn phòng để điều tra:
1. **Màn 1: Gian Phòng Mặt Nạ Tuồng Tam Diện**: Đối chất với linh hồn vị trung thần chịu nỗi oan 300 năm, bóc tách 3 tầng mặt nạ $\rightarrow$ Quyết định gánh vác minh oan $\rightarrow$ Thu thập **[Mặt Nạ Tuồng Tam Diện]** & **Manh Mối 1**.
2. **Màn 2: Mật Thất Gốm Cổ Bát Tràng**: Giải câu đố tro vỏ trấu nếp hoa vàng hòa phù sa sông Hồng để kích hoạt men ngọc $\rightarrow$ Khai thông kinh mạch giấy dó $\rightarrow$ Thu thập **[Mảnh Men Ngọc Bát Tràng]** & **Manh Mối 2**.
3. **Màn 3: Vực Thẳm Mục Đồng Biến Dạng**: Đối mặt với nụ cười ma quái của đứa trẻ cưỡi trâu tranh Đông Hồ bị tà thuật bóp méo $\rightarrow$ Khôi phục tiếng tiêu trúc thanh bình $\rightarrow$ Thu thập **[Tiêu Trúc Mục Đồng]** & **Manh Mối 3**.
4. **Màn 4: Điện Thờ Nghệ Nhân Tiền Nhân**: Lật tẩy âm mưu của nhà sưu tầm tà niệm, đón nhận sứ mệnh bảo tồn di sản $\rightarrow$ Thu thập **[Bút Lông Đuôi Chồn & Mực Chu Sa]** & **Manh Mối 4**.

---

### 🔮 Tầng 5: Hồi Cuối & Đa Kết Cục Ẩn Danh
Khi hoàn thành đủ 4 màn, cánh cổng dẫn tới **Bức Tranh Trung Tâm Khổng Lồ** mở ra. Người chơi đưa ra hành động quyết định mà **không hề có nhãn báo trước**:
- 🌟 **Hồi Kết: Nét Vẽ Định Mệnh**: Điểm nhãn bút lông chu sa, hoàn thiện đại họa "Vạn Tượng Thái Bình", trở thành truyền nhân bảo tồn di sản.
- 🕊️ **Hồi Kết: Nỗi Oan Ba Trăm Năm**: Dâng Mặt Nạ Tam Diện giải tỏa hận thù, cứu rỗi một linh hồn trung nghĩa của lịch sử.
- 🔥 **Hồi Kết: Tro Tàn & Ngọn Lửa**: Kích hoạt ngọn lửa men ngọc thiêu rụi toàn bộ cõi tranh ma quái.
- 🌌 **Hồi Kết: Cõi Mộng Hư Không**: Buông bỏ chấp niệm trần thế, hòa mình vào sự vô vi thanh tịnh giữa phố cổ Hà Nội.
- 💀 **Hồi Kết: Vết Mực Trên Giấy Dó (Thế Thân)**: Cạn kiệt định lực về 0% $\rightarrow$ Biến thành một vệt mực thế thân vĩnh viễn bị giam cầm trong tranh.

---

## ☁️ 2. Hệ Thống Quản Lý Dữ Liệu & Xác Thực Supabase (`supabase-service.js`)
Trò chơi tích hợp thư viện chính thức `@supabase/supabase-js` v2 với kiến trúc Hybrid Resilience (Đám mây kết hợp bản mộc ngoại tuyến):
1. **Xác Thực Người Dùng Toàn Diện**:
   - **Đăng Nhập & Đăng Ký**: Quản lý tài khoản lữ khách qua email, mật khẩu an toàn.
   - **Ấn Triện Bản Mệnh**: Lựa chọn 4 linh vật triện son (`象` Vạn Tượng, `鳳` Phượng Vũ, `龍` Bạch Long, `墨` Hắc Mặc) làm avatar độc bản.
   - **Chơi Ẩn Danh (Guest Mode)**: Vào trải nghiệm ngay tức thì không cần đăng ký.
   - **Tài Khoản Mẫu Tiện Lợi**: Nút đăng nhập 1-chạm với tài khoản *Trưởng Môn* (`admin@vantuong.vn`).
2. **Đồng Bộ Dữ Liệu Lên Supabase Cloud**:
   - Lưu trữ tự động và thủ công tiến trình game: Định lực (Sanity), Cổ vật trong túi, Manh mối đã thu thập, Màn chơi đã hoàn thành, Lịch sử hành trình.
   - Tương thích trực tiếp với các bảng `vt_profiles` và `vt_game_saves` trên Supabase.
3. **Cơ Chế Dự Phòng Ngoại Tuyến (Zero-Config Fallback)**:
   - Khi chưa điền Supabase Project URL hoặc mất mạng, hệ thống tự động lưu vào LocalStorage với cùng cấu trúc dữ liệu, không bao giờ làm gián đoạn trải nghiệm người chơi.
   - Tab **Cổng Supabase** trong Modal cho phép người dùng nhập trực tiếp URL & Anon Key của dự án cá nhân bất kỳ lúc nào.

---

## 🎨 3. Phong Cách Mỹ Thuật Dân Gian Thủ Công ("Bớt Chất AI")
- **Thớ Giấy Dó & Bản Khắc Mộc**: Nền giấy dó hữu cơ với lớp sợi vân giấy đan xen tự nhiên, viền khung chạm khắc gỗ mun Đông Hồ và ánh kim thếp vàng Bát Tràng.
- **Sắc Mực Tự Nhiên**: Tông màu chu sa, than tre ngâm phèn, men lam ngọc Bát Tràng thay thế hoàn toàn cho các dải màu neon kỹ thuật số rập khuôn.
- **Văn Học Dân Gian Sâu Sắc**: Lời thoại được trau chuốt theo phong vị tuồng cổ, văn khấn nghệ nhân tiền nhân và làn điệu đồng dao Kinh Bắc.

---

## 🛠️ 2. Khắc Phục Lỗi Hiển Thị & Chạy Mượt Mà Mọi Nơi
1. **Tất cả trong một file duy nhất (`index.html`)**:
   - Tích hợp 100% CSS, JavaScript, Web Audio Synthesizer, SVG và dữ liệu kịch bản vào file `index.html`.
   - **Nhấp đúp chuột là chạy ngay** trên Windows, không lo lỗi đường dẫn tiếng Việt hay lỗi trắng trang giao thức `file://`.
2. **Font chữ chuẩn 100% tiếng Việt không bị vỡ**:
   - Sử dụng font stack serif cổ điển: `'Cinzel', 'Playfair Display', 'Merriweather', 'Lora', 'Segoe UI', Georgia, serif`.
3. **Hình ảnh đa dạng & SVG dự phòng**:
   - Sử dụng hình ảnh chất lượng cao phù hợp từng gian phòng và tự động bật hệ thống tranh vẽ vector SVG khi không có mạng.
