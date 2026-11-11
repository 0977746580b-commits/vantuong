-- ===================================================================
-- VẠN TƯỢNG (VAN TUONG) — SUPABASE DATABASE SCHEMA & RLS POLICIES
-- Dự án: jhelfkonsofctmgpoocu
-- Sử dụng: Copy toàn bộ nội dung này dán vào SQL Editor của Supabase và bấm RUN
-- ===================================================================

-- 1. BẢNG HỒ SƠ LỮ KHÁCH (vt_profiles)
-- Tự động lưu thông tin hiển thị, ấn triện, danh hiệu của người chơi
CREATE TABLE IF NOT EXISTS public.vt_profiles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT NOT NULL DEFAULT 'Lữ Khách Ẩn Danh',
  avatar_seal TEXT NOT NULL DEFAULT '象',
  title TEXT NOT NULL DEFAULT 'Tân Lữ Khách Cõi Mực',
  role TEXT NOT NULL DEFAULT 'lu_khach',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Kích hoạt Row Level Security (Bảo mật theo từng người dùng)
ALTER TABLE public.vt_profiles ENABLE ROW LEVEL SECURITY;

-- Chính sách RLS cho vt_profiles:
-- Bất kỳ ai cũng có thể xem hồ sơ công khai (để xem bảng xếp hạng hoặc tên người chơi)
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.vt_profiles FOR SELECT
  USING (true);

-- Người dùng chỉ có thể sửa hoặc thêm hồ sơ của chính mình
CREATE POLICY "Users can insert their own profile"
  ON public.vt_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.vt_profiles FOR UPDATE
  USING (auth.uid() = user_id);


-- 2. TỰ ĐỘNG TẠO HỒ SƠ KHI NGƯỜI DÙNG ĐĂNG KÝ MỚI (Trigger tự động)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.vt_profiles (user_id, display_name, avatar_seal, title)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'Tân Lữ Khách'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_seal', '象'),
    COALESCE(NEW.raw_user_meta_data->>'title', 'Tân Lữ Khách Cõi Mực')
  )
  ON CONFLICT (user_id) DO UPDATE SET
    display_name = COALESCE(EXCLUDED.display_name, public.vt_profiles.display_name),
    avatar_seal = COALESCE(EXCLUDED.avatar_seal, public.vt_profiles.avatar_seal),
    title = COALESCE(EXCLUDED.title, public.vt_profiles.title),
    updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Gắn trigger vào bảng auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 3. BẢNG LƯU TRỮ TIẾN TRÌNH GAME TRÊN MÂY (vt_game_saves)
-- Lưu lại máu, manh mối, cổ vật, ải đã giải mã xuyên suốt thiết bị
CREATE TABLE IF NOT EXISTS public.vt_game_saves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  scene_id TEXT DEFAULT 'hub_central',
  sanity INTEGER DEFAULT 100,
  inventory JSONB DEFAULT '[]'::jsonb,
  clues JSONB DEFAULT '[]'::jsonb,
  solved_chambers JSONB DEFAULT '[]'::jsonb,
  history_log JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.vt_game_saves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own game save"
  ON public.vt_game_saves FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own game save"
  ON public.vt_game_saves FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own game save"
  ON public.vt_game_saves FOR UPDATE
  USING (auth.uid() = user_id);


-- 4. BẢNG MỞ KHÓA GÓI MỞ RỘNG (vt_unlocked_packs)
-- Quản lý ai đã mua gói lẻ 39k, ai mua gói trọn bộ 59k
CREATE TABLE IF NOT EXISTS public.vt_unlocked_packs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pack_type TEXT NOT NULL, -- 'ceramic' (Ải II), 'flute' (Ải III), 'combo_all' (Trọn bộ)
  amount NUMERIC DEFAULT 0,
  payment_method TEXT DEFAULT 'bank_transfer',
  payment_ref TEXT, -- Mã giao dịch ngân hàng / SePay
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, pack_type)
);

ALTER TABLE public.vt_unlocked_packs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own unlocked packs"
  ON public.vt_unlocked_packs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert/unlock their own packs"
  ON public.vt_unlocked_packs FOR INSERT
  WITH CHECK (auth.uid() = user_id);


-- 5. BẢNG ĐƠN HÀNG & GIAO DỊCH SEPAY (vt_orders)
-- Chuẩn bị sẵn sàng để đón Webhook tự động từ SePay khi người dùng quét mã VietQR
CREATE TABLE IF NOT EXISTS public.vt_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_code TEXT NOT NULL UNIQUE, -- Ví dụ: VT68291
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  pack_type TEXT NOT NULL, -- 'ceramic', 'flute', 'combo_all'
  amount NUMERIC NOT NULL, -- 39000 hoặc 59000
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' (chờ thanh toán), 'paid' (đã thanh toán), 'failed'
  payment_ref TEXT,
  sepay_transaction_id TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.vt_orders ENABLE ROW LEVEL SECURITY;

-- Người dùng có thể kiểm tra trạng thái đơn hàng của mình
CREATE POLICY "Users can view their own orders"
  ON public.vt_orders FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() IS NULL);

-- Cho phép tạo đơn hàng
CREATE POLICY "Anyone can create order"
  ON public.vt_orders FOR INSERT
  WITH CHECK (true);

-- Index tối ưu tốc độ tra cứu
CREATE INDEX IF NOT EXISTS idx_vt_orders_code ON public.vt_orders(order_code);
CREATE INDEX IF NOT EXISTS idx_vt_unlocked_user ON public.vt_unlocked_packs(user_id);
CREATE INDEX IF NOT EXISTS idx_vt_saves_user ON public.vt_game_saves(user_id);
