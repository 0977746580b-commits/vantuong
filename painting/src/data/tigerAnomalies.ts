import { TigerAnomaly } from '../types/game';

// Dữ liệu 5 Thần Hổ trên Bức Tranh Ngũ Hổ Hàng Trống (Bản Chính Nguyên Bản)
export const TIGER_ANOMALIES: TigerAnomaly[] = [
  {
    id: 1,
    tigerName: 'Thanh Hổ',
    colorName: 'Xanh lục',
    colorCode: '#059669',
    direction: 'Phương Đông',
    element: 'Mộc',
    anomalyTitle: 'Thanh Hổ • Phương Đông',
    anomalyDesc: 'Thanh Hổ ngự phía Đông, sắc xanh biếc của rừng ngàn sinh sôi, móng vuốt vững chãi trên thềm đá ngọc.',
    deductionHint: 'Hành Mộc gắn liền với tre trúc, dăm bào và nghề chuốt nan kết quạt giấy cổ truyền. Nơi nào trong phố cổ có tiếng cạo nan tre lách cách bên hiên đình xưa?',
    targetLocation: 'Đình Xuân Phiến Thị',
    relicName: 'Giấy Dó',
    xPercent: 75,
    yPercent: 74
  },
  {
    id: 2,
    tigerName: 'Xích Hổ',
    colorName: 'Đỏ son',
    colorCode: '#dc2626',
    direction: 'Phương Nam',
    element: 'Hỏa',
    anomalyTitle: 'Xích Hổ • Phương Nam',
    anomalyDesc: 'Xích Hổ ngự phía Nam, rực rỡ sắc đỏ son của ngọn lửa thiêng, ánh mắt sáng rực uy nghiêm.',
    deductionHint: 'Hành Hỏa rực sáng tựa ánh đèn sân khấu tuồng cổ, phất phới cờ ngũ sắc và râu tóc nhân vật hí kịch. Phố phường nào lưu giữ kỹ nghệ làm phục trang, mũ mãng và đuôi ngựa sân khấu?',
    targetLocation: 'Hiệu phục sức Mã Vĩ',
    relicName: 'Mực Tàu',
    xPercent: 24,
    yPercent: 74
  },
  {
    id: 3,
    tigerName: 'Bạch Hổ',
    colorName: 'Trắng bạc',
    colorCode: '#e2e8f0',
    direction: 'Phương Tây',
    element: 'Kim',
    anomalyTitle: 'Bạch Hổ • Phương Tây',
    anomalyDesc: 'Bạch Hổ ngự trên áng mây bạc phía Tây, thân hình sắc nét uy vũ như lưỡi gươm báu sáng lòa.',
    deductionHint: 'Hành Kim sắc lạnh như lưỡi đục thép và bàn tay nghệ nhân mộc bản. Tìm nơi nào giữa phố cổ vang lên nhịp búa gõ ván gỗ và mùi mực đen in tranh truyền đời?',
    targetLocation: 'Xưởng tranh Hàng Trống',
    relicName: 'Ván Khắc Gỗ',
    xPercent: 28,
    yPercent: 22
  },
  {
    id: 4,
    tigerName: 'Hắc Hổ',
    colorName: 'Đen tuyền',
    colorCode: '#18181b',
    direction: 'Phương Bắc',
    element: 'Thủy',
    anomalyTitle: 'Hắc Hổ • Phương Bắc',
    anomalyDesc: 'Hắc Hổ cưỡi tầng mây đen phía Bắc, dáng hình mềm mại uyển chuyển tựa dòng nước cuộn.',
    deductionHint: 'Hành Thủy uốn lượn như dòng nước ngâm nhuộm tơ tằm và hòa tan sắc màu tự nhiên. Con phố nào nức tiếng kinh kỳ với những khúc lụa óng ả và thùng hãm sắc màu ngũ hành?',
    targetLocation: 'Hiệu tơ lụa Hàng Gai',
    relicName: 'Phẩm Màu',
    xPercent: 74,
    yPercent: 22
  },
  {
    id: 5,
    tigerName: 'Hoàng Hổ',
    colorName: 'Vàng kim',
    colorCode: '#d97706',
    direction: 'Trung Tâm',
    element: 'Thổ',
    anomalyTitle: 'Hoàng Hổ • Trung Tâm',
    anomalyDesc: 'Hoàng Hổ ngự chính giữa trên bệ đá sấm sét, lưng tựa cờ ngũ sắc và lệnh tiễn, trấn giữ linh khí đất trời.',
    deductionHint: 'Hành Thổ trung tâm vững chãi như thềm đá đình làng cổ kính, nơi hội tụ linh khí đất kinh kỳ và nét bút lông vờn mây thanh tao. Hãy tìm ngôi đình cổ kính giữa lòng phố nghề.',
    targetLocation: 'Đình Đông Hương',
    relicName: 'Bút Lông Vờn Màu',
    xPercent: 50,
    yPercent: 49
  }
];
