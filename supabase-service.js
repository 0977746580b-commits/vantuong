/**
 * VẠN TƯỢNG - SUPABASE CLOUD & AUTH MANAGER
 * Quản lý định danh Lữ Khách, Đồng bộ Mây (Cloud Save), Manh Mối & Hồi Kết
 * Tích hợp Supabase JS v2 với cơ chế LocalStorage Fallback tự động
 */

class SupabaseService {
  constructor() {
    // Cấu hình mặc định hoặc tải từ LocalStorage
    this.storageKey = 'VT_SUPABASE_CONFIG';
    this.sessionKey = 'VT_AUTH_SESSION';
    this.guestKey = 'VT_GUEST_PROFILE';
    this.saveKey = 'VT_CLOUD_SAVE_FALLBACK';

    const savedConfig = this.loadStoredConfig();
    this.url = savedConfig.url || 'https://jhelfkonsofctmgpoocu.supabase.co';
    this.anonKey = savedConfig.anonKey || 'sb_publishable_3Znh_753KpHqpaPyJAP66g_gXMnMXNK';

    this.client = null;
    this.currentUser = null;
    this.profile = null;
    this.isGuest = false;
    this.isConnected = false;

    this.initClient();
    this.restoreSession();
  }

  loadStoredConfig() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {};
  }

  saveConfig(url, anonKey) {
    this.url = (url || '').trim();
    this.anonKey = (anonKey || '').trim();
    localStorage.setItem(this.storageKey, JSON.stringify({ url: this.url, anonKey: this.anonKey }));
    this.initClient();
  }

  initClient() {
    if (window.supabase && this.url && this.anonKey && this.anonKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key_for_offline_fallback') {
      try {
        this.client = window.supabase.createClient(this.url, this.anonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true
          }
        });
        this.isConnected = true;
      } catch (err) {
        console.warn('[Vạn Tượng] Không thể khởi tạo Supabase client trực tiếp:', err);
        this.client = null;
        this.isConnected = false;
      }
    } else {
      this.client = null;
      this.isConnected = false;
    }
  }

  // Khôi phục phiên làm việc trước đó
  restoreSession() {
    // 1. Thử từ Supabase thật nếu có client
    if (this.client) {
      this.client.auth.getSession().then(({ data: { session } }) => {
        if (session && session.user) {
          this.currentUser = session.user;
          this.isGuest = false;
          this.fetchUserProfile(session.user.id);
          this.triggerAuthChange();
          return;
        }
      }).catch(() => {});
    }

    // 2. Thử khôi phục tài khoản mô phỏng hoặc tài khoản đã lưu
    try {
      const savedAuth = localStorage.getItem(this.sessionKey);
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        this.currentUser = parsed.user;
        this.profile = parsed.profile;
        this.isGuest = false;
        this.triggerAuthChange();
        return;
      }

      // 3. Thử khôi phục phiên Lữ Khách Tự Do (Guest)
      const guest = localStorage.getItem(this.guestKey);
      if (guest) {
        const parsedGuest = JSON.parse(guest);
        this.currentUser = { id: 'guest_' + parsedGuest.id, email: null };
        this.profile = parsedGuest;
        this.isGuest = true;
        this.triggerAuthChange();
      }
    } catch (e) {}
  }

  // ĐĂNG NHẬP BẰNG TÀI KHOẢN SUPABASE
  async signIn(email, password) {
    if (!email || !password) {
      return { success: false, message: 'Vui lòng nhập đầy đủ Email và Mật khẩu Lữ Khách!' };
    }

    // 1. Thử qua Supabase Cloud Client thật nếu có
    if (this.client && this.isConnected) {
      try {
        const { data, error } = await this.client.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data && data.user) {
          this.currentUser = data.user;
          this.isGuest = false;
          await this.fetchUserProfile(data.user.id);
          this.triggerAuthChange();
          return { success: true, user: this.currentUser, profile: this.profile, source: 'supabase' };
        }
      } catch (err) {
        console.warn('[Vạn Tượng] Supabase Cloud login failed, kiểm tra tài khoản cục bộ:', err);
      }
    }

    // 2. Chế độ tài khoản cục bộ / Demo accounts
    try {
      const storedUsers = JSON.parse(localStorage.getItem('VT_REGISTERED_USERS') || '[]');
      const matched = storedUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

      if (matched) {
        this.currentUser = { id: matched.id, email: matched.email };
        this.profile = {
          displayName: matched.displayName,
          seal: matched.seal || '象',
          title: matched.title || 'Lữ Khách Mực Tàu',
          role: 'lu_khach'
        };
        this.isGuest = false;
        localStorage.setItem(this.sessionKey, JSON.stringify({ user: this.currentUser, profile: this.profile }));
        this.triggerAuthChange();
        return { success: true, user: this.currentUser, profile: this.profile, source: 'local' };
      }

      // Tài khoản Demo tích hợp sẵn cho hội đồng triển lãm & người thử nghiệm
      if (email.toLowerCase() === 'admin@vantuong.vn' && password === 'vantuong2026') {
        this.currentUser = { id: 'usr_admin_01', email: 'admin@vantuong.vn' };
        this.profile = {
          displayName: 'Quan Thư Họa Lão Nhân',
          seal: '象',
          title: 'Đại Trưởng Môn Vạn Tượng',
          role: 'admin'
        };
        this.isGuest = false;
        localStorage.setItem(this.sessionKey, JSON.stringify({ user: this.currentUser, profile: this.profile }));
        this.triggerAuthChange();
        return { success: true, user: this.currentUser, profile: this.profile, source: 'demo' };
      }

      return { success: false, message: 'Sai thông tin đăng nhập hoặc tài khoản chưa khai danh mộc bản!' };
    } catch (e) {
      return { success: false, message: 'Lỗi xử lý xác thực: ' + e.message };
    }
  }

  // ĐĂNG KÝ LỮ KHÁCH MỚI (KHAI DANH BẢNG MỘC)
  async signUp(email, password, displayName, seal = '象') {
    if (!email || !password || !displayName) {
      return { success: false, message: 'Vui lòng điền đầy đủ Email, Mật khẩu và Tên Lữ Khách!' };
    }

    // 1. Nếu có Supabase Client thật
    if (this.client && this.isConnected) {
      try {
        const { data, error } = await this.client.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName,
              avatar_seal: seal,
              title: 'Tân Lữ Khách Cõi Mực'
            }
          }
        });
        if (error) throw error;
        if (data && data.user) {
          this.currentUser = data.user;
          this.isGuest = false;
          this.profile = {
            displayName,
            seal,
            title: 'Tân Lữ Khách Cõi Mực',
            role: 'lu_khach'
          };
          await this.saveProfileToSupabase(data.user.id, this.profile);
          this.triggerAuthChange();
          return { success: true, user: this.currentUser, profile: this.profile, source: 'supabase' };
        }
      } catch (err) {
        console.warn('[Vạn Tượng] Supabase Cloud signup failed, lưu cục bộ mộc bản:', err);
      }
    }

    // 2. Lưu vào CSDL Mộc Bản Cục Bộ
    try {
      const storedUsers = JSON.parse(localStorage.getItem('VT_REGISTERED_USERS') || '[]');
      if (storedUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, message: 'Email này đã được khai danh trên bảng mộc! Hãy đăng nhập.' };
      }

      const newUser = {
        id: 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        email,
        password,
        displayName,
        seal,
        title: 'Tân Lữ Khách Cõi Mực',
        createdAt: new Date().toISOString()
      };

      storedUsers.push(newUser);
      localStorage.setItem('VT_REGISTERED_USERS', JSON.stringify(storedUsers));

      this.currentUser = { id: newUser.id, email: newUser.email };
      this.profile = {
        displayName: newUser.displayName,
        seal: newUser.seal,
        title: newUser.title,
        role: 'lu_khach'
      };
      this.isGuest = false;
      localStorage.setItem(this.sessionKey, JSON.stringify({ user: this.currentUser, profile: this.profile }));
      this.triggerAuthChange();

      return { success: true, user: this.currentUser, profile: this.profile, source: 'local' };
    } catch (e) {
      return { success: false, message: 'Không thể ghi danh vào bảng mộc: ' + e.message };
    }
  }

  // ĐĂNG NHẬP ẨN DANH / LỮ KHÁCH TỰ DO
  playAsGuest(guestName = 'Lữ Khách Ẩn Danh', seal = '墨') {
    const id = 'g_' + Math.random().toString(36).substr(2, 8);
    const guestProfile = {
      id,
      displayName: guestName.trim() || 'Lữ Khách Ẩn Danh',
      seal: seal || '墨',
      title: 'Hành Giả Tự Do',
      isGuest: true,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(this.guestKey, JSON.stringify(guestProfile));
    localStorage.removeItem(this.sessionKey);

    this.currentUser = { id: 'guest_' + id, email: null };
    this.profile = guestProfile;
    this.isGuest = true;
    this.triggerAuthChange();

    return { success: true, profile: this.profile };
  }

  // ĐĂNG XUẤT
  async signOut() {
    if (this.client && this.isConnected) {
      try {
        await this.client.auth.signOut();
      } catch (e) {}
    }
    localStorage.removeItem(this.sessionKey);
    localStorage.removeItem(this.guestKey);
    this.currentUser = null;
    this.profile = null;
    this.isGuest = false;
    this.triggerAuthChange();
    return { success: true };
  }

  // LƯU TIẾN TRÌNH GAME LÊN SUPABASE HOẶC LOCAL
  async saveGameProgress(gameState) {
    if (!gameState) return { success: false, message: 'Dữ liệu game không hợp lệ' };

    const savePayload = {
      userId: this.currentUser ? this.currentUser.id : 'anonymous',
      profileName: this.profile ? this.profile.displayName : 'Ẩn Danh',
      seal: this.profile ? this.profile.seal : '象',
      sanity: gameState.sanity,
      currentScene: gameState.currentScene,
      inventory: gameState.inventory || [],
      clues: gameState.clues || [],
      solvedChambers: gameState.solvedChambers || [],
      history: gameState.history || [],
      savedAt: new Date().toISOString()
    };

    // 1. Luôn lưu vào LocalStorage để đảm bảo an toàn tuyệt đối
    try {
      localStorage.setItem(this.saveKey, JSON.stringify(savePayload));
      // Lưu save theo user ID nếu có
      if (this.currentUser) {
        localStorage.setItem(`VT_SAVE_${this.currentUser.id}`, JSON.stringify(savePayload));
      }
    } catch (e) {}

    // 2. Đồng bộ lên Supabase nếu có kết nối
    if (this.client && this.isConnected && this.currentUser && !this.isGuest) {
      try {
        const { error } = await this.client
          .from('vt_game_saves')
          .upsert({
            user_id: this.currentUser.id,
            scene_id: gameState.currentScene,
            sanity: gameState.sanity,
            inventory: gameState.inventory,
            clues: gameState.clues,
            solved_chambers: gameState.solvedChambers,
            history_log: gameState.history,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });

        if (!error) {
          return { success: true, cloud: true, message: 'Đã đồng bộ lên Cõi Mây Supabase!' };
        }
      } catch (err) {
        console.warn('[Vạn Tượng] Không thể ghi CSDL Supabase, đã lưu an toàn cục bộ:', err);
      }
    }

    return { success: true, cloud: false, message: 'Đã lưu an toàn vào thư tịch cục bộ!' };
  }

  // TẢI LẠI TIẾN TRÌNH GAME
  async loadGameProgress() {
    // 1. Thử lấy từ Supabase nếu online
    if (this.client && this.isConnected && this.currentUser && !this.isGuest) {
      try {
        const { data, error } = await this.client
          .from('vt_game_saves')
          .select('*')
          .eq('user_id', this.currentUser.id)
          .single();

        if (!error && data) {
          return {
            success: true,
            source: 'supabase',
            save: {
              sanity: data.sanity,
              currentScene: data.scene_id,
              inventory: data.inventory || [],
              clues: data.clues || [],
              solvedChambers: data.solved_chambers || [],
              history: data.history_log || [],
              savedAt: data.updated_at
            }
          };
        }
      } catch (e) {}
    }

    // 2. Lấy từ LocalStorage
    try {
      let raw = null;
      if (this.currentUser) {
        raw = localStorage.getItem(`VT_SAVE_${this.currentUser.id}`);
      }
      if (!raw) {
        raw = localStorage.getItem(this.saveKey);
      }
      if (raw) {
        const parsed = JSON.parse(raw);
        return { success: true, source: 'local', save: parsed };
      }
    } catch (e) {}

    return { success: false, message: 'Chưa có bản lưu nào được ghi nhận.' };
  }

  // Lưu hồ sơ người dùng vào Supabase
  async saveProfileToSupabase(userId, profile) {
    if (!this.client || !this.isConnected) return;
    try {
      await this.client.from('vt_profiles').upsert({
        user_id: userId,
        display_name: profile.displayName,
        avatar_seal: profile.seal,
        title: profile.title,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
    } catch (e) {}
  }

  // Tải hồ sơ người dùng từ Supabase
  async fetchUserProfile(userId) {
    if (!this.client || !this.isConnected) return;
    try {
      const { data } = await this.client
        .from('vt_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (data) {
        this.profile = {
          displayName: data.display_name,
          seal: data.avatar_seal || '象',
          title: data.title || 'Lữ Khách Cõi Mực',
          role: 'lu_khach'
        };
      }
    } catch (e) {}
  }

  // Kích hoạt sự kiện đổi trạng thái đăng nhập
  triggerAuthChange() {
    window.dispatchEvent(new CustomEvent('vantuong:auth-change', {
      detail: {
        user: this.currentUser,
        profile: this.profile,
        isGuest: this.isGuest,
        isConnected: this.isConnected
      }
    }));
  }
}

// Khởi tạo Singleton
window.vtSupabase = new SupabaseService();
