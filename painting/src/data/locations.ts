import { LocationData } from '../types/game';

export const LOCATIONS_DATA: LocationData[] = [
  {
    id: 'hang_trong',
    name: 'Xưởng tranh Hàng Trống',
    role: 'hint',
    element: 'Kim',
    relicId: 'van_khac',
    relicName: 'Ván khắc gỗ',
    atmosphere: 'Nghệ thuật & Mộc bản',
    description: 'Gian nhà ngổn ngang những chồng mộc bản khắc gỗ rậm rịch tiếng đục chạm và mùi mùn cưa thông ngai ngái.',
    historyText: 'Phố Hàng Trống nổi tiếng Thăng Long với nghề làm tranh thờ, tranh Tết nửa in nửa vẽ tinh tế tuyệt luân.',
    dialogue: [
      'Bác thợ khắc cúi sát tấm ván mộc, chăm chú soi từng thớ gỗ...',
      '"Lạ thật... ta đã khắc đủ năm hình, vậy mà vẫn thiếu một nét cuối cùng. Hay là có người đã sửa lại bản gốc?"'
    ]
  },
  {
    id: 'dong_huong',
    name: 'Đình Đông Hương',
    role: 'hint',
    element: 'Thổ',
    relicId: 'but_long',
    relicName: 'Bút lông',
    atmosphere: 'Tâm linh & Cổ kính',
    description: 'Ngôi đình cổ tĩnh mịch thờ thần linh, khói trầm lan tỏa qua những hàng cột lim thếp vàng.',
    historyText: 'Đình Đông Hương nằm ở phố Hàng Trống, nơi hội tụ không gian tín ngưỡng tâm linh của phố nghề cổ truyền.',
    dialogue: [
      'Không gian thờ tự tĩnh mịch, ánh hoàng hôn phủ lên bệ thờ cổ một màu vàng u hoài.',
      'Năm tấm thẻ gỗ cổ khắc dấu ấn Ngũ hành đang chờ được đặt vào đúng vị trí linh thiêng.'
    ]
  },
  {
    id: 'nam_huong',
    name: 'Đình Nam Hương',
    role: 'decoy',
    atmosphere: 'Đình cổ bên hồ',
    description: 'Ngôi đình nhìn ra hồ Hoàn Kiếm, cây bàng cổ thụ tỏa bóng mát trước hiên.',
    historyText: 'Đình Nam Hương thờ vua Lê Thái Tổ cùng các danh tướng, là chứng tích lịch sử Thăng Long.',
    dialogue: [
      'Một cụ già đang ngồi uống trà dưới gốc bàng già, nhìn sóng nước dập dềnh.',
      '"Nơi đây thờ bậc anh hùng xã tắc, không thấy có dấu vết gì của Ngũ Hổ thần linh..."',
      'Có lẽ bạn đã đi nhầm địa điểm. Hãy quan sát kỹ lại chi tiết trên tranh Ngũ Hổ.'
    ]
  },
  {
    id: 'hang_gai',
    name: 'Hiệu tơ lụa Hàng Gai',
    role: 'hint',
    element: 'Thủy',
    relicId: 'pham_mau',
    relicName: 'Phẩm màu',
    atmosphere: 'Thương mại & Quý phái',
    description: 'Những sấp lụa Hà Đông, tơ tằm óng ả xếp tầng lớp, hương thơm vải mới vương vấn khắp gian phòng.',
    historyText: 'Phố Hàng Gai nức tiếng với nghề dệt và kinh doanh lụa là gấm vóc phục vụ chốn kinh kỳ hoa lệ.',
    dialogue: [
      'Gian hiệu im ắng, chỉ có tiếng gió lùa qua khe cửa và tiếng những cuộn lụa khẽ cọ vào nhau.',
      'Trên bàn là một cuốn sổ cổ ghi công thức pha chế phẩm màu truyền thống từ lá chàm, củ nâu, hoa hòe.'
    ]
  },
  {
    id: 'xuan_phien_thi',
    name: 'Đình Xuân Phiến Thị',
    role: 'hint',
    element: 'Mộc',
    relicId: 'giay_do',
    relicName: 'Giấy dó',
    atmosphere: 'Nghề thủ công & Mộc mạc',
    description: 'Đình chợ quạt Thăng Long xưa, khoảng sân rải đầy nan tre chuốt nhẵn và quạt giấy rực rỡ sắc màu.',
    historyText: 'Xuân Phiến Thị là ngôi đình cổ của làng nghề làm quạt truyền thống trên đất phố Hàng Quạt.',
    dialogue: [
      'Bác thợ già đang cặm cụi chuốt nan tre bên bàn gỗ, không hề ngẩng đầu khi bạn bước vào.',
      '"Nan tre phải đều, giấy phải phẳng. Năm chiếc quạt này bị xáo trộn, đường nét chẳng thể liền nhau..."'
    ]
  },
  {
    id: 'ha_vi',
    name: 'Đình Hà Vĩ',
    role: 'decoy',
    atmosphere: 'Phố nghề sơn thiếp',
    description: 'Ngôi đình của dân làng nghề sơn son thếp vàng di cư từ Thường Tín lên phố Hàng Hòm.',
    historyText: 'Đình Hà Vĩ thờ ông tổ nghề sơn mài truyền thống Việt Nam.',
    dialogue: [
      'Mùi dầu trẩu và sơn ta ngai ngái bốc lên từ những chiếc tráp sơn son đang phơi ngoài nắng.',
      '"Nơi đây thợ sơn đang miết then vàng, chẳng hề có bóng dáng đạo cụ in ấn nào."',
      'Đây là địa điểm đánh lạc hướng. Hãy kiểm tra lại biểu tượng trên bản đồ.'
    ]
  },
  {
    id: 'hang_quat',
    name: 'Hiệu quạt Hàng Quạt',
    role: 'decoy',
    atmosphere: 'Cửa hàng phố xá',
    description: 'Hiệu buôn bày bán các loại quạt giấy bồi, quạt lụa thêu hoa phục vụ khách thập phương.',
    historyText: 'Cửa hiệu tấp nập khách mua quạt giấy che nắng và làm duyên ngày hội hè.',
    dialogue: [
      'Chủ hiệu mải miết tính sổ sách bằng bàn tính gảy tí tách.',
      '"Quạt nhà tôi bán cho khách đi trẩy hội, không giữ manh mối kỳ bí nào của dòng tranh Hàng Trống cả!"',
      'Bạn nhận ra chiếc quạt thật sự mang bí ẩn nằm ở ngôi đình tổ nghề Xuân Phiến Thị, không phải hiệu buôn này.'
    ]
  },
  {
    id: 'hang_hom',
    name: 'Hiệu đồ sơn Hàng Hòm',
    role: 'decoy',
    atmosphere: 'Xưởng gỗ phố nghề',
    description: 'Cửa hiệu mộc đóng các loại rương, hòm da, hộp đựng tài liệu sơn cánh gián sáng loáng.',
    historyText: 'Phố Hàng Hòm chuyên sản xuất các loại hòm gỗ, rương đựng quần áo cho người dân Thăng Long.',
    dialogue: [
      'Tiếng cưa xẻ gỗ vang lên rầm rập, bụi gỗ bay mù mịt dưới ánh nắng chiều.',
      '"Ở đây chỉ đóng rương hòm để đựng của cải y phục, không có cổ vật Ngũ Hổ đâu người lạ ơi!"'
    ]
  },
  {
    id: 'ma_vi',
    name: 'Hiệu phục sức Mã Vĩ',
    role: 'hint',
    element: 'Hỏa',
    relicId: 'muc_tau',
    relicName: 'Mực Tàu',
    atmosphere: 'Sân khấu & Huyễn hoặc',
    description: 'Phòng thử đồ tuồng chèo treo đầy giáp trụ, cờ lệnh ngũ sắc, mũ cánh chuồn và râu tóc giả.',
    historyText: 'Ngõ Mã Vĩ xưa chuyên làm râu giả, đuôi ngựa và trang phục lộng lẫy cho các đoàn hát tuồng.',
    dialogue: [
      'Sau tấm bình phong, tiếng người phụ nữ lật giở sổ sách đầy bối rối...',
      '"Không thể nào... vai trung thần rõ ràng uy dũng, sao trong sổ lại ghi nhầm sang phản tướng thế này?"'
    ]
  },
  {
    id: 'quan_tra',
    name: 'Quán trà gốc đa',
    role: 'decoy',
    atmosphere: 'Nhàn tản phố thị',
    description: 'Quán nước chè mạn dưới bóng cây đa cổ thụ râm mát, khói trà sen bảng lảng bên ấm tích và đĩa kẹo lạc vàng ươm.',
    historyText: 'Nét văn hóa ẩm thực tao nhã của người Tràng An, nơi đàm đạo nhân tình thế thái bên gốc đa cổ kính.',
    dialogue: [
      'Những người khách bộ hành và thương nhân đang nhấp ngụm chè đắng, chuyện trò rôm rả.',
      '"Uống chén trà cho ấm lòng rồi hẵng đi tìm manh mối tiếp, bạn trẻ à! Ở đây chỉ có nước chè mạn, kẹo lạc với khói điếu cày thôi."',
      'Quán trà là nơi dừng chân nghỉ ngơi của khách qua đường, không cất giấu đạo cụ Ngũ Hổ.'
    ]
  }
];
