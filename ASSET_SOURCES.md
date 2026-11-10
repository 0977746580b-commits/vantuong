# TÀI LIỆU NGUỒN GỐC & BẢN QUYỀN HÌNH ẢNH — VẠN TƯỢNG (ASSET SOURCES)

Tài liệu này ghi nhận toàn bộ nguồn gốc, bối cảnh văn hóa, tình trạng pháp lý và phương thức xử lý mỹ thuật cho hệ thống tư liệu hình ảnh được tuyển chọn và tích hợp vào không gian triển lãm nghệ thuật trực tuyến **VẠN TƯỢNG**.

---

## 1. NGUYÊN TẮC GIÁM TUYỂN & ĐỊNH HƯỚNG MỸ THUẬT (ART DIRECTION)

- **Vai trò của bộ ảnh tham khảo (`van_tuong_10_images.zip`)**: Toàn bộ tư liệu hình ảnh trong tệp zip đóng vai trò là **tư liệu tham khảo mỹ thuật (visual references / style guides)** dùng để định hình ngôn ngữ thị giác, chất liệu (texture giấy dó, gốm men rạn, sơn mài), ánh sáng (Chiaroscuro phương Đông) và hòa sắc chung của website; không sử dụng để cắt rời thành các ô catalog/thư viện trưng bày vụn vặt.
- **Hòa sắc chung (Atmospheric Palette Continuum)**: Toàn bộ website được chuẩn hóa qua 8 mã màu nhận diện di sản:
  - `--vt-vermilion: #A94435` (Đỏ son chủ đạo)
  - `--vt-deep-crimson: #842F31` (Đỏ trầm sơn mài)
  - `--vt-muted-terracotta: #B86C59` (Đỏ đất nung)
  - `--vt-warm-ivory: #F2E5CF` (Trắng ngà giấy dó)
  - `--vt-antique-gold: #C2A064` (Vàng kim cổ)
  - `--vt-dusty-rose: #C9958B` (Hồng đất ráng chiều)
  - `--vt-muted-teal: #657F79` (Xanh ngọc trầm)
  - `--vt-dark-plum: #3D2E36` (Tím mận Chiaroscuro)
- **Kỹ thuật hiển thị & Tính liền mạch**:
  - Lớp phủ texture giấy Dó tự nhiên chạy cố định xuyên suốt toàn trang qua `#viewHome::after` (`mix-blend-mode: multiply`, `opacity: 0.85`).
  - Khung tranh đơn nhất tôn vinh nghệ thuật hội họa truyền thống kết hợp lối bố cục báo chí văn nghệ (Editorial Asymmetric Storytelling) và chữ hoa đầu dòng (Drop Cap) mạ vàng.
  - Chú thích giám tuyển (Curatorial Marginalia) thuần túy bằng typography trang nhã, không dùng khung ảnh thẻ con phân mảnh bố cục.

---

## 2. DANH MỤC TƯ LIỆU HÌNH ẢNH (CURATED ASSETS INVENTORY)

### I. Phân Loại: `hero/` (Không Gian Mở Màn & Thủy Mặc)

| Tên Tệp | Mô Tả & Bối Cảnh Lịch Sử | Vị Trí Sử Dụng | Bản Quyền / Nguồn Gốc |
| :--- | :--- | :--- | :--- |
| `hero_moon_pagoda.png` | Cảnh sắc trăng rằm vằng vặc trên nền trời đỏ son, đỉnh tháp Bút Tháp (Chùa Bút Tháp, Bắc Ninh) và rặng núi ngọc trùng điệp. Biểu tượng cho sự trường tồn của văn hóa phương Đông. | **Section 01** (Hero Cinematic Backdrop & 3D Layer) | Trích xuất từ bộ tư liệu người dùng cung cấp (`van_tuong_10_images.zip`). Bản quyền sử dụng tự do cho dự án Vạn Tượng. |
| `ink_wash_mountains_boat.png` | Thuyền nan lướt nhẹ trên dòng sông sương mờ giữa hai triền núi đá vôi, phong cách tranh thủy mặc mực tàu Việt Nam truyền thống. Gợi mở hành trình đi tìm di sản thất truyền. | **Section 01 - 02** (Vignette chuyển cảnh & Parallax) | Trích xuất từ bộ tư liệu người dùng cung cấp (`van_tuong_10_images.zip`). |

---

### II. Phân Loại: `folk-art/` (Mỹ Thuật Dân Gian: Đông Hồ & Hàng Trống)

| Tên Tệp | Mô Tả & Bối Cảnh Lịch Sử | Vị Trí Sử Dụng | Bản Quyền / Nguồn Gốc |
| :--- | :--- | :--- | :--- |
| `folk_tiger_hang_trong.png` | Hình tượng Ngũ Hổ tướng / Mãnh hổ dân gian Hàng Trống với sắc thái uy phong, nét vẽ đanh thép, màu phẩm tự nhiên trên nền giấy dó quét điệp. | **Section 02** (Bộ sưu tập thất truyền - The Lost Collection) | Trích xuất từ bộ tư liệu người dùng (`van_tuong_10_images.zip`). |
| `hang_trong_white_tiger_authentic.png` | Tác phẩm tranh Hàng Trống "Bạch Hổ Tướng Quân" nguyên bản từ Bảo tàng Mỹ thuật Việt Nam. Thể hiện linh vật trấn giữ phương Tây theo thuyết ngũ hành. | **Section 02** (Thẻ hiện vật khảo cứu - Curatorial Artifact) | Nguồn: Bảo tàng Mỹ thuật Việt Nam / Wikimedia Commons (`File:White tiger Hang Trong.jpg`). Thuộc phạm vi Công cộng (Public Domain). |
| `child_carp_dong_ho.png` | Tranh dân gian Đông Hồ "Em bé ôm cá chép" (Hữu dư phú quý), biểu trưng cho sự viên mãn, ấm no và tinh thần hồn nhiên của văn hóa làng xã Bắc Bộ. | **Section 02** (Tư liệu tương tác văn hóa) | Trích xuất từ bộ tư liệu người dùng (`van_tuong_10_images.zip`). |
| `dong_ho_dai_cat_authentic.png` | Bản khắc gỗ mộc bản tranh Đông Hồ "Đại Cát" (Gà trống ngậm hoa hồng), in bằng màu tự nhiên từ sò điệp biển, hoa hòe, than rơm nếp. | **Section 02 - 03** (Hiện vật đối sánh di sản) | Nguồn: Wikimedia Commons (`File:Dong Ho painting - Dai cat.jpg`). Thuộc phạm vi Công cộng (Public Domain). |
| `hang_trong_tu_binh_authentic.png` | Bộ tranh Tứ Bình Tố Nữ Hàng Trống (Cầm, Kỳ, Thi, Họa), đỉnh cao nghệ thuật vẽ vờn màu bút lông (đậm nhạt huyền ảo) của các nghệ nhân phố Hàng Trống thế kỷ 19-20. | **Section 03** (Không gian trưng bày - The Exhibition) | Nguồn: Wikimedia Commons (`File:Tu binh.JPG`). Thuộc phạm vi Công cộng (Public Domain). |

---

### III. Phân Loại: `artifacts/` (Di Vật & Cổ Vật Quý)

| Tên Tệp | Mô Tả & Bối Cảnh Lịch Sử | Vị Trí Sử Dụng | Bản Quyền / Nguồn Gốc |
| :--- | :--- | :--- | :--- |
| `tuong_mask_lacquer.png` | Mặt nạ tuồng cổ chế tác bằng kỹ thuật sơn mài đắp nổi, khắc họa thần thái uy nghiêm pha lẫn bí ẩn của nhân vật lịch sử trong nghệ thuật diễn xướng cung đình và dân gian. | **Section 02 - 04** (The Mystery Vignette) | Trích xuất từ bộ tư liệu người dùng (`van_tuong_10_images.zip`). |
| `bat_trang_ceramic_vase.png` | Bình gốm hoa lam men rạn hoa văn rồng mây Bát Tràng thế kỷ 17-18, nét bút phóng khoáng mang đậm dấu ấn mỹ cảm thời Hậu Lê - Nguyễn. | **Section 02 - 03** (Tiêu điểm cổ vật không gian triển lãm) | Trích xuất từ bộ tư liệu người dùng (`van_tuong_10_images.zip`). |
| `gom_bat_trang_18th_authentic.png` | Nghê gốm / Sư tử Long Mã Bát Tràng men rạn thế kỷ 18, hiện vật trưng bày tại Bảo tàng Lịch sử Quốc gia Việt Nam. Men rạn ngà độc bản kết hợp sắc lam cô ban trầm mặc. | **Section 03** (Hiện vật trung tâm phòng triển lãm) | Nguồn: Bảo tàng Lịch sử Quốc gia / Wikimedia Commons (`File:Gom Bat Trang Su tu long ma the ky 18.jpg`). Thuộc phạm vi Công cộng (Public Domain). |

---

### IV. Phân Loại: `architecture/` (Kiến Trúc Cổ Truyền)

| Tên Tệp | Mô Tả & Bối Cảnh Lịch Sử | Vị Trí Sử Dụng | Bản Quyền / Nguồn Gốc |
| :--- | :--- | :--- | :--- |
| `ancient_pagoda_roof.png` | Mái đao cong vút của đình làng cổ Bắc Bộ, vì kèo chạm khắc rồng phượng, ngói mũi hài rêu phong dưới tán cây cổ thụ. | **Section 03 - 04** (Bối cảnh không gian di tích) | Trích xuất từ bộ tư liệu người dùng (`van_tuong_10_images.zip`). |

---

### V. Phân Loại: `textures/` & `decorative/` (Hoa Văn & Vân Nền)

| Tên Tệp | Mô Tả & Bối Cảnh Lịch Sử | Vị Trí Sử Dụng | Bản Quyền / Nguồn Gốc |
| :--- | :--- | :--- | :--- |
| `golden_clouds_paper.png` | Dải mây ngũ sắc viền vàng kim trên nền giấy đỏ son, lấy cảm hứng từ yếm hoa và hoành phi câu đối hoàng gia Thăng Long. | **Toàn bộ trang** (Dải liên kết xuyên suốt các section) | Trích xuất từ bộ tư liệu người dùng (`van_tuong_10_images.zip`). |
| `flying_cranes_sky.png` | Đôi bạch hạc tiên giang cánh bay trên nền trời ửng ráng chiều, biểu trưng cho sự thanh cao, trường thọ và linh hồn di sản bay về cội nguồn. | **Section 01 - 02 - 05** (Motif dẫn dắt thị giác) | Trích xuất từ bộ tư liệu người dùng (`van_tuong_10_images.zip`). |
| `floral_ornament_gold.png` | Hoa văn cúc dây và hoa sen dát vàng cung đình thời Lý - Trần, tượng trưng cho sự thuần khiết và vương giả. | **Header, Divider & CTA** (Họa tiết điểm xuyết) | Trích xuất từ bộ tư liệu người dùng (`van_tuong_10_images.zip`). |

---

## 3. PHƯƠNG ÁN XỬ LÝ KỸ THUẬT VÀ TÍCH HỢP TRÊN CODEBASE

1. **Hiệu ứng làm mềm viền (Soft Edge Vignette)**:
   ```css
   .vt-curated-img {
     mask-image: radial-gradient(circle at center, black 55%, transparent 100%);
     -webkit-mask-image: radial-gradient(circle at center, black 55%, transparent 100%);
     mix-blend-mode: multiply;
     filter: sepia(0.08) contrast(1.05);
   }
   ```
2. **Seamless Atmosphere**:
   - Sử dụng `golden_clouds_paper.png` và các dải mây SVG đa tầng đặt tại các vị trí ranh giới giữa Section 1 → 2, Section 2 → 3, Section 3 → 4, Section 4 → 5.
   - Nền hoa văn giấy dó lặp vô tận (`background-repeat: repeat`) với độ mờ tinh tế tạo chiều sâu thực tế của bề mặt xơ dó.
