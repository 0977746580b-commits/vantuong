/**
 * VẠN TƯỢNG - KỲ ÁN NÉT MỰC THẤT TRUYỀN
 * Dữ Liệu Cốt Truyện Rẽ Nhánh, Cổ Vật, Manh Mối, Điểm Nhãn Không Gian & Đa Kết Cục
 */

const GAME_DATA = {
  artifacts: {
    // Nhánh Mặt Nạ
    mask_loyal: {
      name: 'Mặt Nạ Trung Thần',
      icon: '🎭',
      desc: 'Mặt nạ gỗ mít đã được minh oan, ánh vàng kim ấm áp, tỏa ra khí phách kiên trung bảo vệ tâm trí.'
    },
    mask_demon: {
      name: 'Mặt Nạ Huyết Quỷ',
      icon: '👺',
      desc: 'Mặt nạ đỏ sẫm nuốt trọn oán khí của sự phản bội, nắm giữ sức mạnh bạo liệt tàn phá ma trận cõi mực.'
    },
    mask_ash: {
      name: 'Tàn Tro Gỗ Mít',
      icon: '🏺',
      desc: 'Tàn tro khi giải thoát linh hồn về cõi hư vô, có khả năng hóa giải mọi ảo ảnh.'
    },

    // Nhánh Gốm Bát Tràng
    ceramic_jade: {
      name: 'Bình Men Ngọc Bát Tràng',
      icon: '🏺',
      desc: 'Gốm men rạn nung từ tro trấu nếp hoa vàng và phù sa sông Hồng, khắc chìm sơ đồ kinh mạch giấy dó.'
    },
    ceramic_blade: {
      name: 'Mảnh Sành Sắc Bén',
      icon: '🗡️',
      desc: 'Mảnh gốm nổ vỡ từ ngọn lửa cực đại, sắc như lưỡi đao, có thể cắt rách ranh giới bức tranh ma.'
    },
    ceramic_black: {
      name: 'Gốm Đen Hắc Thạch',
      icon: '🪨',
      desc: 'Gốm bị sốc nhiệt mực tàu, cứng như kim cương và có khả năng hấp thụ đòn tấn công tâm linh.'
    },

    // Nhánh Mục Đồng
    flute_pure: {
      name: 'Tiêu Trúc Đồng Dao',
      icon: '🪈',
      desc: 'Tiêu trúc phát ra khúc đồng dao thanh bình của làng quê Việt, xua tan ma chướng.'
    },
    flute_soul: {
      name: 'Mảnh Trúc Đoạt Hồn',
      icon: '🪄',
      desc: 'Mảnh trúc gãy nhuốm ảo ảnh, có thể cưỡng chế điều khiển nét vẽ của ma quái.'
    },
    flute_mad: {
      name: 'Bức Họa Cuồng Tiếu',
      icon: '📜',
      desc: 'Nét vẽ điên loạn của nụ cười ngoác rộng, mở ra giác quan tâm linh dị thường.'
    },

    // Nhánh Án Thư
    brush_heritage: {
      name: 'Bút Lông Đuôi Chồn & Mực Chu Sa',
      icon: '🖌️',
      desc: 'Bút thần truyền thừa từ cụ nghệ nhân tiền nhân, dùng để định đoạt kiệt tác chân chính.'
    },
    brush_bone: {
      name: 'Bút Khắc Xương Trắng',
      icon: '🦴',
      desc: 'Cây bút giấu bí thuật trường sinh cấm kỵ, có thể đoạt lấy quyền năng của cõi mực.'
    },
    brush_relic: {
      name: 'Hạt Xá Lợi Trầm Hương',
      icon: '📿',
      desc: 'Bảo vật sinh ra từ tro tàn bí tịch bị thiêu hủy, mang lại sự miễn nhiễm hoàn toàn trước bão mực.'
    }
  },

  scenes: {
    // =================================================================
    // LỜI DẪN MỞ ĐẦU (CONTEXT 1, 2, 3 NGUYÊN VĂN BẢN VĂN HỌC)
    // =================================================================
    'prologue_context1': {
      id: 'prologue_context1',
      phase: 'LỜI DẪN • PHẦN 1',
      location: 'TRIỂN LÃM VẠN TƯỢNG • HÀ NỘI',
      date: 'Chiều Muộn Mùa Đông',
      image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1200&q=80',
      svgType: 'hall',
      quote: '“Bối cảnh mở đầu: Triển lãm của những tác phẩm thất truyền.”',
      fx: 'ink',
      text: `
        <p class="drop-cap"><strong>Triển lãm Vạn Tượng</strong> được tổ chức tại một không gian nghệ thuật lâu đời ở trung tâm Hà Nội, thu hút sự chú ý của đông đảo công chúng, giới sưu tầm và các nhà nghiên cứu mỹ thuật. Đây là lần đầu tiên một bộ sưu tập tranh dân gian Việt Nam đặc biệt, với nhiều tác phẩm được cho là đã thất truyền qua hàng trăm năm, được giới thiệu rộng rãi đến công chúng.</p>
        <p>Người đứng sau triển lãm là một nhà sưu tầm kín tiếng, người đã dành gần như cả cuộc đời để lần theo dấu vết của những dòng tranh cổ. Tuy nhiên, nguồn gốc của một số hiện vật vẫn chưa được xác minh rõ ràng. Đặc biệt, chiếc mặt nạ được đặt trang trọng trong tủ kính lại gắn liền với những câu chuyện hoàn toàn trái ngược nhau: khi là biểu tượng của một vị trung thần, khi lại bị xem là hình tượng của kẻ phản diện trong một vở tuồng cổ.</p>
      `,
      hotspots: [
        {
          id: 'collector',
          icon: '💬',
          label: 'Nhà Sưu Tầm Kín Tiếng',
          dynasty: 'Ký Ức Đương Đại',
          dynastyClass: 'ly',
          x: 24,
          y: 65,
          dialogue: '“Cậu đang chăm chú nhìn bức tranh ấy ư? Nửa đời tôi bôn ba khắp các phế tích Bắc Bộ... Những bảo vật ở đây không đơn thuần là đồ cổ, chúng đang tìm kiếm một linh hồn có cơ duyên thấu thị nét mực.”',
          actions: [
            { text: 'Hỏi về những bất thường trên mặt nạ tuồng', next: 'prologue_context2', sound: 'paper' },
            { text: 'Hỏi về lai lịch bình men rạn Bát Tràng', next: 'prologue_context2', sound: 'paper' }
          ]
        },
        {
          id: 'mask_glass',
          icon: '🎭',
          label: 'Tủ Kính Mặt Nạ Tuồng',
          dynasty: 'Án Tích Thời Lê',
          dynastyClass: 'tran',
          x: 52,
          y: 36,
          dialogue: 'Chiếc mặt nạ gỗ mít ba màu sắc sảo nằm im sau lớp kính cường lực. Hồ sơ ghi nhận 3 xuất xứ mâu thuẫn: trung thần xả thân, phản tướng lưu đày, và vai bi kịch gánh hát Đặng Gia.',
          actions: [
            { text: 'Soi kỹ các vết mực chu sa rỉ trên thớ gỗ', next: 'prologue_context2', sound: 'paper' }
          ]
        },
        {
          id: 'ceramic_display',
          icon: '🏺',
          label: 'Bình Men Rạn Vũ Đỗ',
          dynasty: 'Thời Mạc • XVI',
          dynastyClass: 'le-mac',
          x: 82,
          y: 62,
          dialogue: 'Bình gốm men rạn Bát Tràng với tro trấu nếp hoa vàng và phù sa sông Hồng. Dưới ánh đèn vàng, các vết rạn như đang cử động, phác họa sơ đồ một dòng sông u hoài.',
          actions: [
            { text: 'Ghi chép hình thù kỳ lạ vào sổ tay', next: 'prologue_context2', sound: 'paper' }
          ]
        }
      ],
      choices: [
        {
          text: 'Bước tiếp vào sâu bên trong quan sát không gian triển lãm...',
          next: 'prologue_context2',
          sound: 'paper'
        }
      ]
    },

    'prologue_context2': {
      id: 'prologue_context2',
      phase: 'LỜI DẪN • PHẦN 2',
      location: 'BỨC TƯỜNG TRUNG TÂM PHÒNG TRIỂN LÃM',
      date: 'Chiều Muộn Mùa Đông',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
      svgType: 'centerpiece',
      quote: '“Tác phẩm trung tâm. Tạm thời chưa công bố.”',
      fx: 'ink',
      text: `
        <p class="drop-cap">Cậu bước qua cánh cửa phòng triển lãm. Những bước chân nối tiếp nhau trên nền đá, tiếng máy ảnh xen lẫn những lời trầm trồ và bàn luận về các tác phẩm. Dọc theo những bức tường phủ màu trầm là hàng loạt tranh cổ, hiện vật và những dấu tích của các dòng nghệ thuật dân gian Việt Nam.</p>
        <p>Ở cuối phòng triển lãm, một khung tranh lớn được đặt chính giữa bức tường. Khung gỗ đã ngả màu theo thời gian, phần nền bên trong được phủ một lớp giấy dó nhạt màu, nhưng hoàn toàn không có hình vẽ. Bên dưới chỉ có một tấm biển nhỏ với dòng chữ:</p>
        <div class="quote-scroll"><strong style="color:var(--gold-bright);">“Tác phẩm trung tâm. Tạm thời chưa công bố.”</strong></div>
        <p>Không ai biết tác phẩm thực sự có tồn tại hay không. Nhưng đôi khi, khi quan sát từ những góc độ khác nhau, trên nền giấy tưởng chừng trống rỗng ấy lại xuất hiện những đường nét mờ nhạt. Chúng lấp ló trong khoảnh khắc, giống như những nét mực đã phai màu, rồi biến mất ngay khi người xem tiến lại gần.</p>
      `,
      hotspots: [
        {
          id: 'empty_canvas',
          icon: '📜',
          label: 'Khung Tranh Trung Tâm Trống Rỗng',
          dynasty: 'Cổ Đồ Thất Truyền',
          dynastyClass: 'ly',
          x: 50,
          y: 38,
          dialogue: 'Khung gỗ ngả màu bao bọc mặt giấy Dó phẳng lặng. Nhưng khi quan sát ở các góc độ khác nhau, dường như có một bàn tay vô hình đang tiếp tục phóng bút từ phía bên kia mặt giấy!',
          actions: [
            { text: 'Tiến sát lại để nhìn thấu bóng tối sau mặt giấy', next: 'prologue_context3', sound: 'paper' }
          ]
        },
        {
          id: 'placard_label',
          icon: '🏷️',
          label: 'Tấm Biển: Tạm Thời Chưa Công Bố',
          dynasty: 'Ban Tổ Chức',
          dynastyClass: 'tran',
          x: 32,
          y: 78,
          dialogue: 'Tấm biển đồng nhỏ rỉ sét: “Tác phẩm trung tâm. Tạm thời chưa công bố vì lý do xác minh niên đại di sản.” Nhưng tại sao lại trưng bày một khung tranh trống rỗng ngay vị trí danh dự nhất?',
          actions: [
            { text: 'Sờ vào dòng chữ khắc trên biển đồng', next: 'prologue_context3', sound: 'paper' }
          ]
        },
        {
          id: 'ghost_stroke',
          icon: '✨',
          label: 'Nét Mực Thoắt Ẩn Thoắt Hiện',
          dynasty: 'Cõi Mực Vạn Tượng',
          dynastyClass: 'le-mac',
          x: 72,
          y: 32,
          dialogue: 'Một vệt mực chu sa mảnh như sợi tơ lướt qua mặt kính rồi biến mất trong chớp mắt. Không khí quanh khung tranh bỗng nhiên lạnh toát như sương sông Đuống.',
          actions: [
            { text: 'Áp lòng bàn tay lên mặt kính lạnh buốt', next: 'prologue_context3', sound: 'paper' }
          ]
        }
      ],
      choices: [
        {
          text: 'Tiến sát lại khung tranh để nhìn thấu bí ẩn phía bên kia mặt giấy...',
          next: 'prologue_context3',
          sound: 'paper'
        }
      ]
    },

    'prologue_context3': {
      id: 'prologue_context3',
      phase: 'LỜI DẪN • PHẦN 3',
      location: 'KHOẢNH KHẮC MẮC KẸT VÀ TIẾNG TRỐNG TRẬN',
      date: 'Thời Khắc Đóng Băng',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
      svgType: 'distortion',
      quote: '“Muốn tìm thấy lối ra, hãy lật lại những điều bị bỏ lại trong từng nét vẽ.”',
      fx: 'shake',
      text: `
        <p class="drop-cap">Buổi triển lãm đông đến mức ngay cả những người đứng ngoài sảnh cũng có thể nghe thấy tiếng trò chuyện vọng ra từ bên trong. Nhân vật chính ban đầu chỉ định ghé qua như một khách tham quan bình thường. Nhưng khi bước qua cánh cửa dẫn vào phòng trưng bày, cậu bất giác có cảm giác mình vừa đi qua <strong>một ranh giới vô hình</strong>.</p>
        <p>Tạp âm trong căn phòng nhỏ dần. Những bóng người lướt qua cậu trở nên nhạt màu. Khuôn mặt họ mất đi đường nét, rồi tan vào thứ ánh sáng vàng nhợt nhạt phủ khắp căn phòng.</p>
        <p>Một người phụ nữ vừa đứng trước bức tranh bên cạnh còn đang giơ máy ảnh lên.</p>
        <p>Cậu quay đầu nhìn lại thì chẳng còn bóng dáng người phụ nữ ấy đâu nữa, chỉ còn bức tranh với những mảng đỏ, vàng, xanh đậm đến kỳ lạ. Màu sắc của chúng không giống màu trên giấy cũ. Nhìn chúng rực rỡ và tươi mới đến mức khó có thể tin rằng các tác phẩm ấy đã trải qua đến hàng trăm năm yên mình nơi góc tối như lời của những người quản lý sự kiện.</p>
        <p>Mọi thứ vẫn hiện diện ở đó: ánh đèn vàng nhạt, những bức tường phủ màu trầm, các tác phẩm được đóng khung cẩn thận. Thế nhưng, tiếng nói chuyện xung quanh bắt đầu nhỏ dần. Những bóng người di chuyển giữa các gian phòng dần mất đi đường nét, rồi tan biến hoàn toàn.</p>
        <p><strong>Không gian rộng lớn bỗng trở nên tĩnh lặng đến khó tin.</strong></p>
        <p>Chỉ còn cậu và những tác phẩm. Như thể những bóng người đông nghịt từ đầu vốn chưa bao giờ tồn tại, và chỉ đơn thuần là một ảo ảnh đã cố tình được dàn dựng lên. Từ giây phút cậu tiến vào bên trong cánh cửa phòng trưng bày nghệ thuật, cậu đã chính thức mắc kẹt tại đây.</p>
        <p>Cậu tiến lại gần một tác phẩm. Trong khoảnh khắc ánh mắt cậu chạm vào hình ảnh một nhân vật ở góc tranh, cậu nhận ra: <strong>tư thế của người ấy đã thay đổi!</strong></p>
        <p>Đầu nhân vật hơi nghiêng sang một bên, đôi mắt dường như đang hướng thẳng về phía cậu. Cậu dụi mắt, nhưng khi nhìn lại, đứa trẻ vẫn đứng nguyên tại chỗ, chỉ có <em>nụ cười trên môi là rộng hơn một chút</em>.</p>
        <p>Một cơn đau nhói bất chợt xuyên qua thái dương. Những đường nét trước mắt bắt đầu nhòe đi, chồng chéo lên nhau thành những vệt mực đen đặc. Cậu đưa tay vịn lấy khung tranh, nhưng đầu ngón tay vừa chạm vào mặt gỗ, một tiếng trống trầm đục đã vang lên ngay sát bên tai. Khi cậu ngẩng đầu, cả căn phòng triển lãm đã biến mất, mở ra một không gian mới mang màu sắc của chính bức tranh mà cậu vừa đưa tay chạm vào.</p>
        <p>Trên nền trời đỏ sẫm, một dòng chữ hiện lên, giống như được viết bằng mực trên giấy dó:</p>
        <div class="sam-banner-text">“Muốn tìm thấy lối ra, hãy lật lại những điều bị bỏ lại trong từng nét vẽ.”</div>
      `,
      hotspots: [
        {
          id: 'painted_boy',
          icon: '💬',
          label: 'Đứa Trẻ Trong Tranh',
          dynasty: 'Cổ Họa Biến Ảo',
          dynastyClass: 'tran',
          x: 48,
          y: 42,
          dialogue: 'Đầu nhân vật trong tranh hơi nghiêng sang một bên, đôi mắt đờ đẫn đang hướng thẳng về phía bạn. Nụ cười trên khóe môi đứa trẻ dần ngoác rộng ra một cách ma quái!',
          actions: [
            { text: 'Tiến sát để nghe lời thì thầm của đứa trẻ', next: 'hub_central', sound: 'paper', sanityEffect: -5 },
            { text: 'Lùi lại giữ bình tĩnh trước hiện tượng ma quái', next: 'hub_central', sound: 'drum', sanityEffect: -5 }
          ]
        },
        {
          id: 'antique_frame',
          icon: '🔍',
          label: 'Khung Gỗ Triển Lãm',
          dynasty: 'Gỗ Lim Trăm Năm',
          dynastyClass: 'ly',
          x: 26,
          y: 65,
          dialogue: 'Đầu ngón tay bạn vừa chạm vào khung gỗ lim nứt nẻ, một tiếng trống trầm đục đã vang lên dội thẳng vào màng nhĩ, khiến không gian phòng tranh rung chuyển dữ dội!',
          actions: [
            { text: 'Vịn chặt khung gỗ, bước qua ranh giới cõi mực ➔', next: 'hub_central', sound: 'drum', sanityEffect: -10 }
          ]
        },
        {
          id: 'ink_prophecy',
          icon: '📜',
          label: 'Nét Mực Dó Cổ',
          dynasty: 'Sấm Ngôn Thất Truyền',
          dynastyClass: 'le-mac',
          x: 76,
          y: 35,
          dialogue: 'Trên nền trời đỏ sẫm, một dòng chữ hiện lên bằng mực chu sa trên giấy Dó: “Muốn tìm thấy lối ra, hãy lật lại những điều bị bỏ lại trong từng nét vẽ.”',
          actions: [
            { text: 'Khắc ghi sấm ngôn, tiến vào Gian Phòng 4 Cổ Vật ➔', next: 'hub_central', sound: 'drum', sanityEffect: -10 }
          ]
        }
      ],
      choices: [
        {
          text: 'Bước tiếp qua ranh giới cõi mực vào Gian Phòng 4 Cổ Vật ➔',
          next: 'hub_central',
          sound: 'drum',
          sanityEffect: -10
        }
      ]
    },

    // =================================================================
    // SẢNH TRUNG TÂM • PHÒNG TRƯNG BÀY 4 CỔ VẬT THẤT TRUYỀN
    // =================================================================
    'hub_central': {
      id: 'hub_central',
      phase: 'PHÒNG TRƯNG BÀY • 4 CỔ VẬT THẤT TRUYỀN',
      location: 'GIAN ĐIỆN BỐN BẢO VẬT CÕI MỰC',
      date: 'Thời Khắc Giải Mã',
      image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
      svgType: 'hub',
      quote: '“Mỗi cổ vật là một chứng nhân lịch sử. Chạm vào từng bảo vật để lắng nghe thanh âm cổ linh và mở ra từng cõi mật thất!”',
      fx: 'ink',
      isHub: true,
      text: `
        <p class="drop-cap">Cậu bước qua ranh giới cõi mực, đứng sững trước <strong>Gian Phòng Trưng Bày 4 Cổ Vật Thất Truyền</strong>. Bốn chiếc bệ gỗ lim khắc mộc trầm mặc tỏa sáng huyền ảo trong làn khói trầm hương ngai ngái.</p>
        <p>Mỗi món di vật trấn giữ một phương hướng của cõi giấy dó, mang trong mình một linh hồn oan khiên và một bí thuật truyền đời. <strong>Hãy chạm vào từng cổ vật</strong> để lắng nghe thanh âm cổ xưa và bước vào mật thất giải mã:</p>
      `,
      hotspots: [
        {
          id: 'hub_relic_mask',
          icon: '🎭',
          label: 'Mặt Nạ Tuồng Tam Diện',
          dynasty: 'Thời Lê Trung Hưng',
          dynastyClass: 'tran',
          x: 24,
          y: 45,
          dialogue: 'Mặt nạ tạc từ rễ mít già trăm tuổi, ba khuôn mặt chồng lấn mang ba số phận bi hùng của Tiết độ sứ Đặng Vũ Khiêm. Tiếng kèn tuồng nỉ non như than khóc oan khiên.',
          actions: [
            { text: 'Bước vào Cõi Tuồng Cổ Đặng Gia ➔', next: 'chamber_mask_intro', sound: 'tuong' }
          ]
        },
        {
          id: 'hub_relic_ceramic',
          icon: '🏺',
          label: 'Bình Men Rạn Vũ Đỗ',
          dynasty: 'Thời Mạc • XVI',
          dynastyClass: 'le-mac',
          x: 44,
          y: 55,
          dialogue: 'Bình gốm trác tuyệt của nghệ nhân Vũ Đỗ với xương đất sét phù sa sông Hồng và men tro trấu nếp hoa vàng. Tiếng rên rỉ lách tách như tiếng thở dài từ lòng đất mẹ.',
          actions: [
            { text: 'Bước vào Lò Bầu Bát Tràng Thế Kỷ XVI ➔', next: 'chamber_ceramic_intro', sound: 'ceramic' }
          ]
        },
        {
          id: 'hub_relic_flute',
          icon: '🎋',
          label: 'Tiêu Trúc Mục Đồng',
          dynasty: 'Tranh Đông Hồ',
          dynastyClass: 'ly',
          x: 64,
          y: 42,
          dialogue: 'Ống tiêu trúc bảy lỗ của chú bé mục đồng cưỡi trâu trong tranh dân gian Đông Hồ. Tiếng sáo nỉ non oán hận đang kêu cứu giữa cõi sương mù sông Đuống.',
          actions: [
            { text: 'Bước vào Bến Sông Đuống Kinh Bắc ➔', next: 'chamber_flute_intro', sound: 'flute' }
          ]
        },
        {
          id: 'hub_relic_brush',
          icon: '🖌️',
          label: 'Bút Lông & Mực Chu Sa',
          dynasty: 'Cội Nguồn Nét Vẽ',
          dynastyClass: 'ly',
          x: 82,
          y: 58,
          dialogue: 'Ngọn bút lông chắp từ đuôi ngựa chiến và nghiên đá chu sa ngàn năm. Đây là chìa khóa khởi nguyên nắm giữ sinh mệnh của toàn bộ cõi tranh Vạn Tượng.',
          actions: [
            { text: 'Bước vào Gian Điện Thờ Tiền Nhân ➔', next: 'chamber_brush_intro', sound: 'brush' }
          ]
        }
      ],
      choices: []
    },

    // =================================================================
    // MÀN 1: GIAN PHÒNG MẶT NẠ TUỒNG TAM DIỆN (3 NHÁNH RẼ THỰC SỰ)
    // =================================================================
    'chamber_mask_intro': {
      id: 'chamber_mask_intro',
      phase: 'MÀN 1 • ÁN TÍCH TUỒNG CỔ',
      location: 'RẠP HÁT LƯU THỦY • VÙNG ĐẤT MỘC TỬ',
      date: 'Ba Trăm Năm Trầm Luân',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
      svgType: 'mask',
      quote: '“Một đời trung liệt gánh oan khiên... Lớp sơn son rỉ máu qua ngàn độ trăng rằm.”',
      fx: 'ink',
      text: `
        <p class="drop-cap">Bạn bước lên sàn gỗ lim kẽo kẹt của rạp hát tuồng cổ bỏ hoang. Khói trầm hương ngai ngái quẩn quanh những tấm màn nhung mục nát rách tươm. Tiếng kèn bóp, tiếng đàn nhị cất lên từng hồi nỉ non xé ruột xé gan giữa sương lạnh.</p>
        <p>Trước mặt bạn, lơ lửng giữa không trung là <strong>Mặt Nạ Tuồng Tam Diện</strong> tạc từ rễ mít già trăm tuổi. Ba khuôn mặt chồng lấn xoay vần ma quái: <em>Mặt trắng thanh liêm</em> với hàng chân mày nhíu chặt bi thương; <em>Mặt đỏ rực trung dũng</em> bị vấy những vệt mực đen bẩn thỉu; và <em>Mặt kép hát xanh xao</em> méo mó vì ngàn lời đàm tiếu nơi hí trường.</p>
        <p>Từ sâu trong hốc mắt mặt nạ, hai giọt huyết lệ bằng mực chu sa đặc quánh rỉ xuống. Giọng nói của <strong>Tiết độ sứ Đặng Vũ Khiêm</strong> vang vọng như sấm sét giữa đêm đông:</p>
        <div class="quote-scroll">
          “Năm ấy thành lũy nguy nan, lương thảo cạn kiệt. Ta vì muốn bảo toàn sinh mạng cho ba vạn bách tính mà giả vờ quy hàng, đang đêm dẫn cảm tử quân phóng hỏa thiêu rụi toàn bộ doanh trại và kho tên giặc thù. Giặc tan, nhưng ta thác nơi chiến trường không lời thanh minh. Sử quan chép ta là nghịch tặc phản quốc; người đời bôi nhọ gọt đẽo mặt nạ ta làm vai hề xảo trá trên chiếu tuồng! Ba trăm năm qua, linh hồn ta bị trói buộc trong nỗi hận này... Ngươi bước đến đây, ngươi lấy tư cách gì để phán xét một tấm lòng son?”
        </div>
        <p>Không khí xung quanh ngột ngạt như muốn bóp nghẹt lồng ngực. Định lực của bạn dao động dữ dội. Ba ngã rẽ định mệnh bày ra trước mắt:</p>
      `,
      hotspots: [
        {
          id: 'tam_dien_mask',
          icon: '💬',
          label: 'Tiết Độ Sứ Đặng Vũ Khiêm',
          dynasty: 'Thời Lê Trung Hưng',
          dynastyClass: 'tran',
          x: 50,
          y: 40,
          dialogue: '“Ba trăm năm chịu ngàn lời sỉ nhục, mặt nạ ta bị gọt đẽo làm vai hề xảo trá! Ngươi tới đây để tiếp tục phỉ báng hay rửa sạch oan khiên cho ba vạn bách tính?”',
          actions: [
            { text: 'Cắt máu đầu ngón tay điểm ấn son minh oan', next: 'mask_branch_loyal', sound: 'tuong', sanityEffect: 15 },
            { text: 'Lên án cay độc, nuốt trọn oán khí đoạt bảo', next: 'mask_branch_demon', sound: 'drum', sanityEffect: -20 }
          ]
        },
        {
          id: 'dang_gia_scroll',
          icon: '📜',
          label: 'Gia Phả Hí Phường Đặng Gia',
          dynasty: 'Mộc Bản Cổ',
          dynastyClass: 'ly',
          x: 26,
          y: 68,
          dialogue: 'Tập mộc bản ố vàng ghi lại đêm định mệnh: Tiết độ sứ Đặng Vũ Khiêm bí mật dẫn 500 cảm tử quân tập kích trại giặc, hy sinh thân mình cứu dân nhưng bị sử quan gian thần gạt bỏ công lao.',
          actions: [
            { text: 'Đọc bài tế văn xót thương tướng sĩ', next: 'mask_branch_loyal', sound: 'paper', sanityEffect: 5 }
          ]
        },
        {
          id: 'incense_censer',
          icon: '🕯️',
          label: 'Lư Hương Trầm Oan',
          dynasty: 'Lê - Mạc',
          dynastyClass: 'le-mac',
          x: 78,
          y: 62,
          dialogue: 'Khói trầm quẩn quanh chân bệ gỗ. Mùi hương ngai ngái làm dịu đi oán khí cuồn cuộn của chiếc mặt nạ gỗ mít già.',
          actions: [
            { text: 'Rải tàn tro thiêng hóa giải chấp niệm', next: 'mask_branch_ash', sound: 'paper', sanityEffect: 5 }
          ]
        }
      ],
      choices: [
        {
          text: 'Cắt máu đầu ngón tay điểm ấn son minh oan: “Đại nghĩa vị quốc vong thân, xin gánh vác rửa sạch nỗi oan ba thế kỷ!”',
          next: 'mask_branch_loyal',
          sound: 'bell',
          sanityEffect: 15
        },
        {
          text: 'Lên án cay độc: “Phản bội triều đình thì muôn đời là kẻ phản nghịch!”, nuốt trọn oán khí đoạt lấy hung khí hủy diệt',
          next: 'mask_branch_demon',
          sound: 'drum',
          sanityEffect: -20
        },
        {
          text: 'Vung đao gỗ đập tan phong ấn: “Đúng sai đã gửi lại dòng thời gian, ta hỏa thiêu mặt nạ đưa linh hồn người về cõi vĩnh hằng!”',
          next: 'mask_branch_ash',
          sound: 'bell',
          sanityEffect: 5
        }
      ]
    },

    'mask_branch_loyal': {
      id: 'mask_branch_loyal',
      phase: 'MÀN 1 • MINH OAN TRUNG NGHĨA',
      location: 'SÂN KHẤU TUỒNG HOÀNG KIM',
      date: 'Hóa Giải Ba Trăm Năm Oan Khuất',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
      svgType: 'mask',
      quote: '“Máu son nhỏ xuống mắt tượng... Thấu suốt lòng dạ trung trinh giữa vạn kiếp phù du.”',
      fx: 'ink',
      text: `
        <p class="drop-cap">Bạn không chút ngần ngại dùng mảnh gỗ bén chích nhẹ đầu ngón tay. Giọt máu tươi hòa cùng mực chu sa đỏ thắm nhỏ thẳng vào giữa trán của chiếc mặt nạ gỗ mít!</p>
        <p>Một tiếng nổ trầm hùng vang lên như tiếng trống lệnh xuất quân. Lớp sơn xanh tà mị và những vệt bùn nhơ bôi nhọ nứt toác, vỡ vụn thành trăm mảnh rơi lả tả xuống sàn gỗ. Khuôn mặt tuồng cổ bừng lên ánh sáng vàng kim thuần khiết, lộ rõ thần thái oai nghiêm, lẫm liệt của bậc anh hùng trung dũng.</p>
        <p>Vị tướng khẽ cúi đầu tạ từ, hóa thành một đạo kim quang ngưng tụ lại thành <strong>[Mặt Nạ Trung Thần Bạch Diện]</strong> trôi êm ái vào lòng bàn tay bạn. Một làn gió ấm áp thổi bừng định lực (+15%), bảo hộ tâm trí bạn trước mọi tà niệm ma quái.</p>
        <div class="sam-banner-text">Thu thập: [Mặt Nạ Trung Thần Bạch Diện] & Manh Mối: [Bản Án Minh Oan Ba Trăm Năm]</div>
      `,
      solveChamber: 'mask',
      addArtifact: 'mask_loyal',
      addClue: 'Vị trung thần hy sinh thanh danh vì bách tính — Chân lý lịch sử không bao giờ bị chôn vùi dưới lớp mực bôi nhọ.',
      choices: [
        {
          text: 'Cầm chặt bảo vật trung thần, bước trở lại Sảnh Trung Tâm Vạn Tượng',
          next: 'hub_central',
          sound: 'paper'
        }
      ]
    },

    'mask_branch_demon': {
      id: 'mask_branch_demon',
      phase: 'MÀN 1 • HUYẾT QUỶ THỐN TÂM',
      location: 'RẠP HÁT BỐC LỬA OÁN KHÍ',
      date: 'Khai Mở Con Đường Bạo Liệt',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
      svgType: 'mask',
      quote: '“Ngươi đã chọn sức mạnh của hận thù... Hãy nếm trải nỗi đau của sự phản bội!”',
      fx: 'shake',
      text: `
        <p class="drop-cap">Lời phán xét lạnh lùng của bạn như nhát kiếm đâm xuyên qua vết thương ba thế kỷ! Linh hồn vị tướng rú lên một tiếng thê lương đến rợn gáy. Ngọn lửa màu đỏ máu bùng lên bao trùm toàn bộ rạp hát.</p>
        <p>Chiếc mặt nạ gỗ mít co giật dữ dội, mọc ra hai chiếc nanh nhọn hoắt, đôi mắt đỏ ngầu mở trừng trừng phun ra khí đen ngùn ngụt. Bạn không lùi bước, giơ tay túm chặt lấy chiếc mặt nạ quỷ. Oán khí nghìn năm thâm nhập thẳng vào kinh mạch, khiến da thịt bạn bỏng rát, định lực sụt giảm nghiêm trọng (-20%).</p>
        <p>Nhưng đổi lại, trong tay bạn giờ là một hung khí hủy diệt mang sức mạnh kinh hoàng: <strong>[Mặt Nạ Huyết Quỷ]</strong> — có thể nghiền nát bất kỳ bức tường ma trận nào ngăn trở bước chân bạn!</p>
        <div class="sam-banner-text">Thu thập: [Mặt Nạ Huyết Quỷ] & Manh Mối: [Oán Hận Xé Rách Cõi Tranh]</div>
      `,
      solveChamber: 'mask',
      addArtifact: 'mask_demon',
      addClue: 'Chiếc mặt nạ huyết quỷ chứa oán hận 300 năm có khả năng bẻ gãy mọi kết giới phòng thủ của bức tranh trung tâm.',
      choices: [
        {
          text: 'Mang theo hung khí bạo liệt, quay trở lại Sảnh Trung Tâm Vạn Tượng',
          next: 'hub_central',
          sound: 'paper'
        }
      ]
    },

    'mask_branch_ash': {
      id: 'mask_branch_ash',
      phase: 'MÀN 1 • ĐOẠN TUYỆT HƯ VÔ',
      location: 'RẠP HÁT THANH TỊNH HÓA VÔ',
      date: 'Giải Thoát Vĩnh Hằng',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
      svgType: 'mask',
      quote: '“Cát bụi lại trở về cát bụi... Không phán xét, không oán cừu, chỉ còn sự tự do.”',
      fx: 'ink',
      text: `
        <p class="drop-cap">Bạn vung đao gỗ giáng thẳng vào đài phong ấn. Tiếng gỗ vỡ vụn giòn tan phá tan gông cùm tâm linh. Bạn châm ngọn lửa thanh tịnh hỏa thiêu chiếc mặt nạ gỗ mít trong làn khói trầm thơm ngát.</p>
        <p>Bóng ma vị tướng khẽ buông tiếng thở dài nhẹ nhõm như vừa trút bỏ được gánh nặng non sông ba trăm năm, rồi tan biến thành muôn ngàn đốm sáng bay về trời cao. Dưới sàn gỗ chỉ còn lại một nắm <strong>[Tàn Tro Gỗ Mít Bách Niên]</strong> mát rượi.</p>
        <p>Bạn gói tàn tro vào lớp lụa mỏng. Vật phẩm này ẩn chứa năng lực thanh lọc tuyệt đối, có thể hóa giải mọi bùa chú và độc tố ảo ảnh trong cõi mực.</p>
        <div class="sam-banner-text">Thu thập: [Tàn Tro Gỗ Mít Bách Niên] & Manh Mối: [Giải Thoát Hư Vô]</div>
      `,
      solveChamber: 'mask',
      addArtifact: 'mask_ash',
      addClue: 'Tàn tro gỗ mít là bảo vật thanh tịnh, có thể phá vỡ ảo giác và phong ấn ma quái.',
      choices: [
        {
          text: 'Thu nhận tàn tro thanh khiết, quay trở lại Sảnh Trung Tâm Vạn Tượng',
          next: 'hub_central',
          sound: 'paper'
        }
      ]
    },

    // =================================================================
    // MÀN 2: MẬT THẤT GỐM CỔ BÁT TRÀNG (3 NHÁNH RẼ THỰC SỰ)
    // =================================================================
    'chamber_ceramic_intro': {
      id: 'chamber_ceramic_intro',
      phase: 'MÀN 2 • HỎA LÒ THẤT TRUYỀN',
      location: 'LÒ BẦU CỔ BÁT TRÀNG • THẾ KỶ XVI',
      date: 'Bí Thuật Nung Men Rạn',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
      svgType: 'ceramic',
      quote: '“Đất sét trắng sông Hồng, tro trấu nếp hoa vàng và ngọn lửa ngàn ba trăm độ...”',
      fx: 'ink',
      text: `
        <p class="drop-cap">Một luồng khí nóng hừng hực phả vào mặt khi bạn bước qua vòm gạch cổ của lò bầu Bát Tràng. Không khí nồng đượm mùi đất sét sông Hồng phơi sương, mùi củi nhãn cháy đượm và mùi tro trấu nếp cái hoa vàng thơm ngọt ngào.</p>
        <p>Giữa tâm lò nung, trên đài kê bằng đất sa mốt, một chiếc <strong>Bình Men Rạn Thất Truyền</strong> đang xoay tròn chầm chậm giữa biển lửa lam ngọc. Những đường nứt men rạn không hề ngẫu nhiên mà đang cựa quậy, tạo thành những họa tiết xoắn ốc uốn lượn hệt như sơ đồ kinh mạch của bức tranh giấy dó trung tâm!</p>
        <p>Tiếng linh hồn của <strong>Nghệ nhân Vũ Đỗ</strong> thời nhà Mạc vọng ra từ vách lò:</p>
        <div class="quote-scroll">
          “Năm xưa kẻ sưu tầm dùng tà niệm tráo đổi bí thức, ép ta phải phong ấn linh hồn đất mẹ vào trong lò nung để biến gốm thành ngục tù giam giữ cõi mực. Muốn cứu vớt tinh hoa làng gốm, ngươi phải thấu hiểu quy luật Âm Dương Ngũ Hành của Đất - Nước - Tro - Lửa!”
        </div>
        <p>Ngọn lửa bốc cao ngùn ngụt, chiếc bình bắt đầu phát ra những tiếng rên rỉ lách tách. Bạn phải quyết định cách thức can thiệp ngay lúc này:</p>
      `,
      hotspots: [
        {
          id: 'ceramic_vase_hot',
          icon: '💬',
          label: 'Nghệ Nhân Vũ Đỗ',
          dynasty: 'Thời Mạc • Vũ Đỗ',
          dynastyClass: 'le-mac',
          x: 50,
          y: 40,
          dialogue: '“Nghệ nhân Vũ Đỗ đây! Chiếc bình men rạn này chứa đựng kinh mạch bức tranh Vạn Tượng. Ngươi có thấu hiểu bí pháp hòa quyện Đất mẹ sông Hồng và tro trấu nếp cái hoa vàng?”',
          actions: [
            { text: 'Hòa tro trấu nếp hoa vàng & nước sông Hồng', next: 'ceramic_branch_jade', sound: 'ceramic', sanityEffect: 10 },
            { text: 'Thổi bễ nung cực đại phá vỡ bình gốm', next: 'ceramic_branch_blade', sound: 'drum', sanityEffect: -15 }
          ]
        },
        {
          id: 'furnace_arch',
          icon: '🔥',
          label: 'Cửa Lò Bầu Rực Lửa',
          dynasty: 'Gốm Cổ Bát Tràng',
          dynastyClass: 'tran',
          x: 80,
          y: 35,
          dialogue: 'Củi nhãn cháy đượm tỏa nhiệt lượng ngàn ba trăm độ. Lửa lam ngọc bốc lên soi rọi vách gạch sa mốt đã nhuộm màu thời gian hàng trăm năm.',
          actions: [
            { text: 'Hắt gáo mực tàu pha phèn đen gây sốc nhiệt', next: 'ceramic_branch_black', sound: 'drum', sanityEffect: -5 }
          ]
        },
        {
          id: 'ash_sack',
          icon: '🌾',
          label: 'Bao Tro Trấu Nếp Cái',
          dynasty: 'Bí Thuật Dân Gian',
          dynastyClass: 'ly',
          x: 22,
          y: 72,
          dialogue: 'Tro trấu nếp cái hoa vàng nguyên chất - thành phần bí truyền làm nên sắc men rạn trác tuyệt của gốm Việt cổ đại.',
          actions: [
            { text: 'Kế thừa bí truyền tôi luyện men ngọc', next: 'ceramic_branch_jade', sound: 'ceramic', sanityEffect: 10 }
          ]
        }
      ],
      choices: [
        {
          text: 'Kế thừa bí truyền: Rải tro trấu nếp cái hoa vàng hòa nước phù sa sông Hồng vào tâm lò để tôi luyện men ngọc',
          next: 'ceramic_branch_jade',
          sound: 'bell',
          sanityEffect: 10
        },
        {
          text: 'Dùng bễ công nghiệp cưỡng chế tăng nhiệt độ lên mức cực đại để phá vỡ bình gốm đoạt lấy mảnh sắc nhọn',
          next: 'ceramic_branch_blade',
          sound: 'drum',
          sanityEffect: -15
        },
        {
          text: 'Hắt gáo mực tàu pha phèn đen ngâm nước giếng sâu vào lò gây sốc nhiệt đột ngột',
          next: 'ceramic_branch_black',
          sound: 'drum',
          sanityEffect: -5
        }
      ]
    },

    'ceramic_branch_jade': {
      id: 'ceramic_branch_jade',
      phase: 'MÀN 2 • MEN NGỌC TỎA QUANG',
      location: 'LÒ NUNG KHAI HOA',
      date: 'Khai Thông Kinh Mạch Đất Mẹ',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
      svgType: 'ceramic',
      quote: '“Men rạn ngàn năm... Nét đẹp tinh hoa của đất mẹ sông Hồng.”',
      fx: 'ink',
      text: `
        <p class="drop-cap">Bạn rải nắm tro trấu nếp cái hoa vàng hòa cùng dòng nước phù sa đỏ quạch vào giữa ngọn lửa. Một làn khói thơm dịu như hương lúa mùa gặt tỏa ra ngào ngạt.</p>
        <p>Ngọn lửa bạo tàn lập tức chuyển sang sắc lam ngọc dịu dàng. Bề mặt chiếc bình gốm phát ra những tiếng nổ giòn tan như tiếng chuông khánh vỡ, tạo nên những đường rạn ngũ sắc kỳ ảo như dải ngân hà.</p>
        <p>Bạn ôm lấy chiếc <strong>[Bình Men Ngọc Bát Tràng]</strong> nguyên vẹn. Trên thân bình, sơ đồ kinh mạch giấy dó phát ra ánh sáng lam ngọc soi rọi đường đi nước bước trong cõi mực.</p>
        <div class="sam-banner-text">Thu thập: [Bình Men Ngọc Bát Tràng] & Manh Mối: [Kinh Mạch Dó Giấy]</div>
      `,
      solveChamber: 'ceramic',
      addArtifact: 'ceramic_jade',
      addClue: 'Bức Tranh Trung Tâm có một tâm nhĩ vô hình — cần dòng mực thanh tịnh điểm nhãn mới có thể giải phóng.',
      choices: [
        {
          text: 'Ôm bình men ngọc trong tay, quay trở lại Sảnh Trung Tâm Vạn Tượng',
          next: 'hub_central',
          sound: 'paper'
        }
      ]
    },

    'ceramic_branch_blade': {
      id: 'ceramic_branch_blade',
      phase: 'MÀN 2 • HUNG KHÍ TÀN PHÁ',
      location: 'LÒ NUNG NỔ TUNG VỠ VỤN',
      date: 'Đoạt Lấy Sát Khí',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
      svgType: 'ceramic',
      quote: '“Ngọn lửa bạo ngược phá hủy kiệt tác, sinh ra mảnh sành đẫm máu!”',
      fx: 'shake',
      text: `
        <p class="drop-cap">Tiếng bễ thổi gầm rít kinh hoàng khiến nhiệt độ trong lò vượt ngưỡng 1500 độ C. Chiếc bình gốm không chịu nổi nhiệt áp bỗng nổ tung với tiếng sét đinh tai nhức óc!</p>
        <p>Khói đen mịt mù, ngàn mảnh gốm đỏ rực bắn ra như mưa tên làm rách toạc da thịt bạn (-15% Định lực). Bạn cúi xuống nhặt mảnh gốm lớn nhất lên: Nó đen óng, sắc bén hơn cả dao cạo và tỏa ra luồng sát khí hung tợn — <strong>[Mảnh Sành Sắc Bén]</strong>!</p>
        <div class="sam-banner-text">Thu thập: [Mảnh Sành Sắc Bén] & Manh Mối: [Lưỡi Đao Cắt Tranh]</div>
      `,
      solveChamber: 'ceramic',
      addArtifact: 'ceramic_blade',
      addClue: 'Mảnh sành sắc bén có thể chém rách bất kỳ nét vẽ ma trận nào của bức tranh trung tâm.',
      choices: [
        {
          text: 'Nắm chặt mảnh hung khí trong tay, quay trở lại Sảnh Trung Tâm Vạn Tượng',
          next: 'hub_central',
          sound: 'paper'
        }
      ]
    },

    'ceramic_branch_black': {
      id: 'ceramic_branch_black',
      phase: 'MÀN 2 • HẮC THẠCH NGƯNG BĂNG',
      location: 'LÒ NUNG BỐC KHÓI ĐEN KỴ',
      date: 'Ngưng Tụ Hắc Thạch Hộ Thể',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
      svgType: 'ceramic',
      quote: '“Mực tàu gặp lửa thiêng... Hóa thành khối đá đen vô cảm.”',
      fx: 'ink',
      text: `
        <p class="drop-cap">Gáo mực ngâm phèn đen lạnh ngắt dội ụp vào tâm lò lửa khiến hơi nước bốc lên mù mịt xì xèo. Chiếc bình gốm co rút lại tức thì, bề mặt đen bóng như thiên thạch không tì vết.</p>
        <p>Bạn nhấc khối <strong>[Gốm Đen Hắc Thạch]</strong> ra khỏi lò nung. Vật thể này lạnh buốt thấu xương và có khả năng hấp thụ mọi chấn động ảo ảnh và xung kích tâm linh ma quái.</p>
        <div class="sam-banner-text">Thu thập: [Gốm Đen Hắc Thạch] & Manh Mối: [Tấm Chắn Tâm Linh]</div>
      `,
      solveChamber: 'ceramic',
      addArtifact: 'ceramic_black',
      addClue: 'Gốm Đen Hắc Thạch có thể chống lại các đòn xâm thực tâm trí của bóng ma nhà sưu tầm.',
      choices: [
        {
          text: 'Mang theo hắc thạch kiên cố, quay trở lại Sảnh Trung Tâm Vạn Tượng',
          next: 'hub_central',
          sound: 'paper'
        }
      ]
    },

    // =================================================================
    // MÀN 3: VỰC THẲM MỤC ĐỒNG ĐÔNG HỒ (3 NHÁNH RẼ THỰC SỰ)
    // =================================================================
    'chamber_flute_intro': {
      id: 'chamber_flute_intro',
      phase: 'MÀN 3 • DIỆN MẠO BIẾN TÍNH',
      location: 'BỜ ĐÊ SÔNG ĐUỐNG • TRANH ĐÔNG HỒ',
      date: 'Tiếng Tiêu Lạc Điệu Giữa Hoàng Hôn',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      svgType: 'flute',
      quote: '“Bột điệp lấp lánh như vảy rồng... Nụ cười mục đồng ngoác rộng nuốt trọn tuổi thơ.”',
      fx: 'shake',
      text: `
        <p class="drop-cap">Bạn bước qua một nếp gấp giấy dó nhăn nhúm và rơi thẳng vào bức tranh dân gian <em>“Mục Đồng Thổi Tiêu Cưỡi Trâu”</em> nổi tiếng của dòng tranh Đông Hồ ven bờ sông Đuống. Nhưng nơi đây hoàn toàn không có vẻ thanh bình thôn dã như trong thi ca!</p>
        <p>Bầu trời giấy điệp vốn óng ánh sắc trắng vỏ sò điệp nghiền mịn nay bị một đám mây đen mực than tre nuốt chửng. Con trâu mộng bằng mực đen đặc quánh đang thở phì phò từng luồng khí độc cay xè, bốn vó cào xới rách toạc nền giấy. Trên lưng trâu, đứa trẻ mục đồng gầy guộc nghiêng đầu nhìn bạn chằm chằm. Khóe miệng nó rách toác tận mang tai thành một nụ cười quái đản, để lộ hàm răng đen nhánh kỳ dị.</p>
        <p>Đứa trẻ đưa ống sáo trúc lên môi, cất lên một khúc đồng dao cổ bị đảo ngược giai điệu rùng rợn, từng âm vực ma quái xoáy sâu vào màng nhĩ làm tê liệt định lực:</p>
        <div class="quote-scroll">
          “...Bay lả bay la... Cỏ khô nước đục... Kẻ tham giam giữ... Mực ma đoạt hồn... Ai đem tiếng sáo chôn dưới mồ sâu...?”
        </div>
        <p>Tiếng sáo trúc quỷ quyệt đang dần biến bạn thành nét vẽ thế thân. Bạn phải quyết định phản ứng ngay lập tức:</p>
      `,
      hotspots: [
        {
          id: 'flute_boy',
          icon: '💬',
          label: 'Mục Đồng Kinh Bắc',
          dynasty: 'Tranh Đông Hồ',
          dynastyClass: 'tran',
          x: 52,
          y: 42,
          dialogue: '“Nụ cười của ta đẹp không? Kẻ sưu tầm đã chôn tiếng sáo ngây thơ của ta xuống bùn lầy, biến nó thành điệu kèn gọi hồn ma quỷ!”',
          actions: [
            { text: 'Thổi lên khúc đồng dao thanh bình hóa giải', next: 'flute_branch_pure', sound: 'flute', sanityEffect: 15 },
            { text: 'Lao tới bẻ gãy ống tiêu cắt đứt trói buộc', next: 'flute_branch_soul', sound: 'drum', sanityEffect: -10 }
          ]
        },
        {
          id: 'water_buffalo',
          icon: '🐃',
          label: 'Trâu Mộng Mực Than Tre',
          dynasty: 'Kinh Bắc',
          dynastyClass: 'ly',
          x: 78,
          y: 58,
          dialogue: 'Con trâu mộng vẽ bằng mực than tre thuần túy. Bốn vó cào rách nền giấy điệp, mắt đỏ sực thở ra khói độc cay xè.',
          actions: [
            { text: 'Vung cọ vẽ thêm nét cười cuồng loạn', next: 'flute_branch_mad', sound: 'drum', sanityEffect: -25 }
          ]
        },
        {
          id: 'diep_paper_sky',
          icon: '✨',
          label: 'Nền Giấy Điệp Vảy Sò',
          dynasty: 'Dân Gian Đông Hồ',
          dynastyClass: 'le-mac',
          x: 26,
          y: 35,
          dialogue: 'Lớp bột điệp nghiền mịn từ vỏ sò điệp lấp lánh như vảy rồng dưới hoàng hôn, đang cố gắng chống cự lại sự xâm thực của mây đen mực tàu.',
          actions: [
            { text: 'Ngồi xuống bờ cỏ định tâm tụ khí', next: 'flute_branch_pure', sound: 'bell', sanityEffect: 10 }
          ]
        }
      ],
      choices: [
        {
          text: 'Ngồi xuống bờ cỏ, lấy hết định lực thổi lên khúc đồng dao thanh bình nguyên bản để hóa giải nụ cười ma quái',
          next: 'flute_branch_pure',
          sound: 'bell',
          sanityEffect: 15
        },
        {
          text: 'Lao tới giật phăng ống tiêu và bẻ gãy làm đôi để cắt đứt liên kết thao túng linh hồn của kẻ sưu tầm',
          next: 'flute_branch_soul',
          sound: 'drum',
          sanityEffect: -10
        },
        {
          text: 'Vung cọ chấm mực than tre vẽ thêm nét cười cuồng loạn cho cả bầu trời, đồng hóa cùng sự điên loạn của bức tranh',
          next: 'flute_branch_mad',
          sound: 'drum',
          sanityEffect: -25
        }
      ]
    },

    'flute_branch_pure': {
      id: 'flute_branch_pure',
      phase: 'MÀN 3 • KHÚC CA ĐỒNG DAO HỒN NHIÊN',
      location: 'ĐỒNG CỎ LÀNG HỒ THANH BÌNH',
      date: 'Thanh Tẩy Ma Trận Bằng Âm Nhạc',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      svgType: 'flute',
      quote: '“Tiếng trúc thanh tao xua tan mây đen... Nụ cười trở lại nét trong trẻo của trẻ thơ đất Việt.”',
      fx: 'ink',
      text: `
        <p class="drop-cap">Bạn nhắm nghiền hai mắt, nhớ về những buổi chiều êm ả nơi đồng quê xứ Bắc. Hơi thở từ lồng ngực bạn hòa vào giai điệu trong vắt của khúc hát <em>“Bắc kim thang, cà lang bí rợ”</em>, ngân nga từng nốt trầm bổng thanh sạch.</p>
        <p>Tiếng tiêu thuần khiết vang vọng làm tan biến đám mây mực độc. Nụ cười ngoác rộng ma mị trên môi đứa trẻ co lại, đôi mắt đen lóe lên ánh sáng ấm áp của linh hồn được giải thoát. Đứa trẻ cười khúc khích hồn nhiên, cúi đầu trao vào tay bạn cây <strong>[Tiêu Trúc Đồng Dao]</strong>.</p>
        <p>Khúc nhạc thanh tao này tỏa ra ánh sáng điệp óng ánh, lập tức phục hồi +15% Định lực và bảo bọc tâm hồn bạn.</p>
        <div class="sam-banner-text">Thu thập: [Tiêu Trúc Đồng Dao] & Manh Mối: [Âm Thanh Thanh Tẩy]</div>
      `,
      solveChamber: 'flute',
      addArtifact: 'flute_pure',
      addClue: 'Tiếng tiêu trúc đồng dao có thể hóa giải bão tố và làm tan biến ảo ảnh ma trận.',
      choices: [
        {
          text: 'Cất tiếng tiêu thanh tịnh, bước trở lại Sảnh Trung Tâm Vạn Tượng',
          next: 'hub_central',
          sound: 'paper'
        }
      ]
    },

    'flute_branch_soul': {
      id: 'flute_branch_soul',
      phase: 'MÀN 3 • ĐOẠT LẤY ẢO ẢNH',
      location: 'CÁNH ĐỒNG VỠ VỤN',
      date: 'Bẻ Khóa Bùa Chú Kẻ Sưu Tầm',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      svgType: 'flute',
      quote: '“Cắt đứt liên kết... Ảo ảnh hóa thành công cụ trong tay bạn.”',
      fx: 'shake',
      text: `
        <p class="drop-cap">Không do dự một giây, bạn lao thẳng tới giật phăng ống sáo trúc từ miệng mục đồng và bẻ gãy làm đôi! Tiếng trúc gãy giòn tan như sấm nổ. Một làn khói tím phụt ra làm đứa trẻ tan biến vào hư vô.</p>
        <p>Trong tay bạn là <strong>[Mảnh Trúc Đoạt Hồn]</strong> còn vương vấn ma thuật thao túng. Định lực bạn giảm nhẹ (-10%) do khí độc, nhưng món đồ này cho phép bạn thôi miên và cưỡng chế các nét vẽ trong cõi mực theo ý muốn!</p>
        <div class="sam-banner-text">Thu thập: [Mảnh Trúc Đoạt Hồn] & Manh Mối: [Quyền Năng Thao Túng]</div>
      `,
      solveChamber: 'flute',
      addArtifact: 'flute_soul',
      addClue: 'Mảnh trúc gãy có thể dùng để cưỡng chế điều khiển nét vẽ của bóng ma nhà sưu tầm.',
      choices: [
        {
          text: 'Nắm chặt mảnh trúc ma thuật, quay trở lại Sảnh Trung Tâm Vạn Tượng',
          next: 'hub_central',
          sound: 'paper'
        }
      ]
    },

    'flute_branch_mad': {
      id: 'flute_branch_mad',
      phase: 'MÀN 3 • ĐẠI HỌA CUỒNG TIẾU',
      location: 'VỰC THẲM CƯỜI ĐIÊN LOẠN',
      date: 'Đồng Hóa Cùng Sự Điên Loạn',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      svgType: 'flute',
      quote: '“Khi ngươi cười cùng sự điên loạn, cõi mực cũng sẽ phải khuất phục trước ngươi.”',
      fx: 'shake',
      text: `
        <p class="drop-cap">Bạn bật cười thành tiếng — một tràng cười sảng khoái đến gai người! Bạn vung cọ vẽ nụ cười ngoác rộng khắp cả bầu trời mây điệp. Không gian rúng động dữ dội, con trâu đen gục ngã, đứa trẻ cười nắc nẻ trước sự táo tợn của bạn.</p>
        <p>Định lực của bạn sụt giảm nghiêm trọng (-25%), nhưng tâm trí bạn mở ra một tầng nhận thức dị thường. Toàn bộ bức tranh cuộn tròn lại thành <strong>[Bức Họa Cuồng Tiếu]</strong>, tỏa ra năng lượng ma mị vô song!</p>
        <div class="sam-banner-text">Thu thập: [Bức Họa Cuồng Tiếu] & Manh Mối: [Tâm Thức Hỗn Loạn]</div>
      `,
      solveChamber: 'flute',
      addArtifact: 'flute_mad',
      addClue: 'Bức họa cuồng tiếu có thể bẻ cong thực tại của Bức Tranh Trung Tâm bằng sự hỗn loạn.',
      choices: [
        {
          text: 'Mang theo bức họa ma mị, quay trở lại Sảnh Trung Tâm Vạn Tượng',
          next: 'hub_central',
          sound: 'paper'
        }
      ]
    },

    // =================================================================
    // MÀN 4: ĐIỆN THỜ NGHỆ NHÂN TIỀN NHÂN (3 NHÁNH RẼ THỰC SỰ)
    // =================================================================
    'chamber_brush_intro': {
      id: 'chamber_brush_intro',
      phase: 'MÀN 4 • ÁN THƯ TIỀN NHÂN',
      location: 'ĐIỆN THỜ NGHỆ NHÂN DÂN GIAN',
      date: 'Nơi Cội Nguồn Nét Bút',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      svgType: 'brush',
      quote: '“Người cầm bút không phải để khoe tài, mà để giữ hồn thiêng non sông.”',
      fx: 'ink',
      text: `
        <p class="drop-cap">Bạn bước vào ngôi đền cổ uy nghiêm lợp ngói mũi hài rêu phong. Khói trầm hương thoang thoảng xua tan tử khí lạnh lẽo. Trên bàn án thư bằng gỗ mun thế kỷ XVIII, một nghiên mực đá đen bóng đang tỏa hương thơm ngát.</p>
        <p>Bóng dáng <strong>Cụ Tổ Nghề Vẽ Tranh</strong> đầu bạc phơ, râu dài như cước hiện ra. Cụ đang mài thỏi mực chu sa đỏ thắm trên nghiên đá. Xung quanh cụ, bóng đen của Nhà Sưu Tầm đang lởn vởn toan cướp đoạt bản mộc thất truyền.</p>
        <p>Cụ nghệ nhân ngước nhìn bạn với ánh mắt quắc thước:</p>
        <div class="quote-scroll">
          “Kẻ sưu tầm dùng cõi mực này để hút sinh khí người xem nhằm đạt được sự trường sinh bất tử. Nay ta trao cho ngươi cơ hội, ngươi định kế thừa nét bút của cha ông bằng tấm lòng chân thật, hay muốn chiếm đoạt bí thuật bất tử của ma quái?”
        </div>
        <p>Ba ngã rẽ nhân tâm bày ra trước án thư:</p>
      `,
      hotspots: [
        {
          id: 'ancestor_artist',
          icon: '💬',
          label: 'Cụ Tổ Nghề Tranh',
          dynasty: 'Tiền Nhân Đại Việt',
          dynastyClass: 'ly',
          x: 48,
          y: 42,
          dialogue: '“Người cầm bút không phải để mưu cầu danh lợi hay trường sinh bất tử, mà là để tạc giữ hồn cốt non sông cho vạn đời sau. Ngươi có dám nhận trọng trách này chăng?”',
          actions: [
            { text: 'Quỳ gối nhận y bát bảo tồn nét vẽ', next: 'brush_branch_heritage', sound: 'brush', sanityEffect: 20 },
            { text: 'Truy vấn cụ già về bí thuật trường sinh', next: 'brush_branch_bone', sound: 'drum', sanityEffect: -15 }
          ]
        },
        {
          id: 'cinnabar_inkstone',
          icon: '🔴',
          label: 'Nghiên Mực Đá Chu Sa Thần',
          dynasty: 'Bảo Vật Tiền Nhân',
          dynastyClass: 'tran',
          x: 28,
          y: 68,
          dialogue: 'Nghiên mực tạc từ đá núi thiêng, ngập tràn mực chu sa nguyên chất đỏ thắm. Nét mực viết ra có thể điểm nhãn khai quang mọi tà ma.',
          actions: [
            { text: 'Chấm đầu ngón tay cảm nhận chân khí chu sa', next: 'brush_branch_heritage', sound: 'bell', sanityEffect: 10 }
          ]
        },
        {
          id: 'holy_scripture',
          icon: '📜',
          label: 'Bản Mộc Bí Tịch Tranh Cổ',
          dynasty: 'Thế Kỷ XVIII',
          dynastyClass: 'le-mac',
          x: 76,
          y: 62,
          dialogue: 'Tập bí tịch giấy bản ghi chép toàn bộ phương pháp tạo hình và bí quyết hòa sắc khoáng thạch cổ truyền, kẻ sưu tầm đang thèm khát chiếm đoạt.',
          actions: [
            { text: 'Ném bí tịch vào lò hương hóa giải mầm họa', next: 'brush_branch_relic', sound: 'bell', sanityEffect: 10 }
          ]
        }
      ],
      choices: [
        {
          text: 'Quỳ gối nhận y bát: “Con xin đem trọn tâm can bảo tồn nét vẽ thiêng liêng của cha ông!”',
          next: 'brush_branch_heritage',
          sound: 'bell',
          sanityEffect: 20
        },
        {
          text: 'Truy vấn cụ già: “Nếu bí thuật này có thể trường sinh bất tử, tại sao con không thể đoạt lấy nó?”',
          next: 'brush_branch_bone',
          sound: 'drum',
          sanityEffect: -15
        },
        {
          text: 'Vung lửa ném tập bí tịch vào lò hương: “Bí thuật gây tai họa cho đời thì phải thiêu hủy vĩnh viễn!”',
          next: 'brush_branch_relic',
          sound: 'bell',
          sanityEffect: 10
        }
      ]
    },

    'brush_branch_heritage': {
      id: 'brush_branch_heritage',
      phase: 'MÀN 4 • TIẾP NHẬN Y BÁT',
      location: 'ĐIỆN THỜ HÀO QUANG RỰC RỠ',
      date: 'Kế Thừa Di Sản Chân Tâm',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      svgType: 'brush',
      quote: '“Bút lông đuôi chồn và mực chu sa... Ngọn lửa ngàn năm nay đã có người tiếp bước.”',
      fx: 'ink',
      text: `
        <p class="drop-cap">Cụ nghệ nhân mỉm cười hiền từ gật đầu. Cụ trao vào tay bạn ngọn <strong>[Bút Lông Đuôi Chồn & Mực Chu Sa]</strong>. Một dòng năng lượng ấm áp tuôn trào khắp kinh mạch, hồi phục mạnh mẽ +20% Định lực.</p>
        <p>Đầu bút lông óng ả chưa từng khô mực qua hàng trăm năm, sẵn sàng để bạn vẽ nên nét vẽ cứu rỗi cuối cùng!</p>
        <div class="sam-banner-text">Thu thập: [Bút Lông Đuôi Chồn & Mực Chu Sa] & Manh Mối: [Ngọn Bút Chân Tâm]</div>
      `,
      solveChamber: 'brush',
      addArtifact: 'brush_heritage',
      addClue: 'Chỉ có ngọn bút chân tâm mới có thể vẽ nên nét vẽ cứu rỗi và hoàn thiện bức tranh trung tâm.',
      choices: [
        {
          text: 'Cầm bảo vật chân tâm, trở về Sảnh Trung Tâm Vạn Tượng',
          next: 'hub_central',
          sound: 'paper'
        }
      ]
    },

    'brush_branch_bone': {
      id: 'brush_branch_bone',
      phase: 'MÀN 4 • BÚT KHẮC CẤM KỴ',
      location: 'ĐIỆN THỜ PHỦ BÓNG TỐI',
      date: 'Chiếm Đoạt Bí Thuật Trường Sinh',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      svgType: 'brush',
      quote: '“Ngươi muốn bước vào con đường của kẻ sưu tầm tà niệm sao? Hãy cầm lấy!”',
      fx: 'shake',
      text: `
        <p class="drop-cap">Cụ nghệ nhân thở dài ngao ngán rồi tan biến vào hư không. Trên bàn án thư, một cây <strong>[Bút Khắc Xương Trắng]</strong> lạnh buốt hiện ra.</p>
        <p>Cầm ngọn bút này, bạn cảm thấy định lực bị thiêu đốt (-15%), nhưng bạn sở hữu quyền năng cưỡng ép cướp đoạt cõi mực, biến bạn thành chúa tể mới của thế giới tranh!</p>
        <div class="sam-banner-text">Thu thập: [Bút Khắc Xương Trắng] & Manh Mối: [Bí Thuật Chiếm Đoạt]</div>
      `,
      solveChamber: 'brush',
      addArtifact: 'brush_bone',
      addClue: 'Bút Khắc Xương Trắng có thể dùng để tiêu diệt nhà sưu tầm và chiếm lấy cõi giấy dó.',
      choices: [
        {
          text: 'Cầm hung khí cấm kỵ, quay trở lại Sảnh Trung Tâm Vạn Tượng',
          next: 'hub_central',
          sound: 'paper'
        }
      ]
    },

    'brush_branch_relic': {
      id: 'brush_branch_relic',
      phase: 'MÀN 4 • TRO TÀN BÍ THUẬT',
      location: 'LÒ HƯƠNG TỎA KHÓI TRẦM',
      date: 'Đoạn Tuyệt Tà Khí Ma Trận',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      svgType: 'brush',
      quote: '“Hành động quyết liệt! Khi không còn tham vọng, tà thuật sẽ tự diệt vong.”',
      fx: 'bell',
      text: `
        <p class="drop-cap">Bạn ném cuộn bí kíp vào lư hương đồng. Ngọn lửa thiêng bùng lên thiêu rụi toàn bộ tà thuật thành tro tàn. Bóng ma nhà sưu tầm thét lên đau đớn rồi tan biến!</p>
        <p>Từ đống tro tàn, một viên <strong>[Hạt Xá Lợi Trầm Hương]</strong> phát sáng rực rỡ hiện ra, ban cho bạn sự miễn nhiễm hoàn toàn trước mọi ma trận (+10% Định lực).</p>
        <div class="sam-banner-text">Thu thập: [Hạt Xá Lợi Trầm Hương] & Manh Mối: [Thân Thể Kim Cương]</div>
      `,
      solveChamber: 'brush',
      addArtifact: 'brush_relic',
      addClue: 'Hạt xá lợi trầm hương bảo vệ bạn an toàn tuyệt đối trước mọi đòn tấn công của Bức Tranh Trung Tâm.',
      choices: [
        {
          text: 'Nắm chắc xá lợi trầm hương, trở về Sảnh Trung Tâm Vạn Tượng',
          next: 'hub_central',
          sound: 'paper'
        }
      ]
    },

    // =================================================================
    // MÀN CUỐI: ĐỐI MẶT BỨC TRANH TRUNG TÂM
    // =================================================================
    'chamber_final_boss': {
      id: 'chamber_final_boss',
      phase: 'HỒI CUỐI • ĐỊNH ĐOẠT MỆNH MỰC',
      location: 'TRƯỚC BỨC TRANH TRUNG TÂM GIẤY DÓ KHỔNG LỒ',
      date: 'Thời Khắc Giải Mã Cuối Cùng',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
      svgType: 'final',
      quote: '“Tác phẩm trung tâm. Nay đã đến lúc công bố!”',
      fx: 'shake',
      text: `
        <p class="drop-cap">Cậu đứng trước khung tranh khổng lồ sừng sững chọc trời. Tấm giấy dó nhạt màu giờ đây đang cuộn xoáy như một cơn lốc bão mực đen gầm thét dữ dội!</p>
        <p>Bóng ma của <strong>Nhà Sưu Tầm Bí Ẩn</strong> hiện lên với nụ cười ngạo nghễ trong tâm bão mực:</p>
        <div class="quote-scroll">
          “Ngươi đã mang đủ các di vật từ bốn gian phòng đến đây rồi sao? Dù ngươi chọn con đường nào, toàn bộ cõi mực này hôm nay sẽ định đoạt số phận của ngươi!”
        </div>
        <p>Túi hành trang của bạn rung lên bần bật. Hãy đưa ra quyết định hành động cuối cùng:</p>
      `,
      choices: [
        {
          text: 'Nâng ngọn bút và cổ vật trong tay, hướng thẳng vào tâm giấy dó để hoàn thành nét vẽ đại nghĩa...',
          next: 'ending_destiny',
          sound: 'bell'
        },
        {
          text: 'Phóng thích oán khí và hung khí đoạt được, quyết chiến sinh tử để thôn tính bóng ma kẻ sưu tầm...',
          next: 'ending_usurp',
          sound: 'drum'
        },
        {
          text: 'Kích hỏa thiêu rụi toàn bộ khung tranh và ranh giới cõi giấy dó để mở đường thoát cho muôn người...',
          next: 'ending_fire',
          sound: 'drum'
        },
        {
          text: 'Ngồi xuống tĩnh tọa, dùng thanh âm và tàn tro đưa toàn bộ các linh hồn trở về cõi luân hồi hư không...',
          next: 'ending_void',
          sound: 'bell'
        }
      ]
    },

    // =================================================================
    // CÁC HỒI KẾT BÍ MẬT
    // =================================================================
    'ending_destiny': {
      id: 'ending_destiny',
      phase: 'HỒI KẾT • ĐẠI VIÊN MÃN',
      location: 'HÀ NỘI • MÙA ĐÔNG TƯƠI SÁNG',
      date: 'Bình Minh Thức Tỉnh',
      image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
      svgType: 'victory',
      quote: '“Nét bút định mệnh nở hoa trên giấy dó...”',
      fx: 'ink',
      text: `
        <div class="ending-reveal-card">
          <h2 class="ending-title-banner">HỒI KẾT: THÁI BÌNH THỊNH THẾ</h2>
          <p>Bằng tất cả lòng tôn kính cội nguồn văn hóa, bạn vung bút vẽ nên một nét vẽ kỳ vĩ nối liền trời đất! Nét mực son đi tới đâu, bão táp bóng ma bị xua tan tới đó.</p>
          <p>Toàn bộ tờ giấy dó bừng sáng rực rỡ, hiện ra bức đại họa dân gian <strong>“Vạn Tượng Thái Bình”</strong> với muôn sắc hoa, tiếng cười trẻ thơ và non sông gấm vóc rạng ngời.</p>
          <p>Bạn chớp mắt tỉnh lại giữa căn phòng triển lãm đông đúc ở Hà Nội. Tiếng chuông Nhà Thờ Lớn ngân vang điểm 5 giờ chiều. Bức tranh trung tâm nay đã hiển hiện trọn vẹn trước sự ngỡ ngàng thán phục của toàn thể công chúng.</p>
          <p>Trong túi áo khoác, ngọn bút lông cổ vẫn còn ấm nóng. Bạn đã chính thức trở thành người gìn giữ chân chính của di sản ngàn năm.</p>
        </div>
      `,
      choices: [
        {
          text: 'Trở về Trang Chủ',
          next: 'home_screen',
          sound: 'paper'
        }
      ]
    },

    'ending_usurp': {
      id: 'ending_usurp',
      phase: 'HỒI KẾT • THÔN TÍNH',
      location: 'NGAI VÀNG CÕI MỰC HUYẾT SẮC',
      date: 'Bá Chủ Mới Ra Đời',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
      svgType: 'mask',
      quote: '“Khi ngươi đánh bại ma vương, ngươi đã khoác lên mình chiếc áo ma vương mới.”',
      fx: 'shake',
      text: `
        <div class="ending-reveal-card">
          <h2 class="ending-title-banner">HỒI KẾT: MA HỌA CHỦ NHÂN</h2>
          <p>Sức mạnh bạo liệt từ các cổ vật hắc ám trong tay bạn bùng nổ, nuốt chửng bóng ma của nhà sưu tầm. Nhưng thay vì phá hủy cõi mực, bạn đã chọn hấp thụ toàn bộ quyền năng vô biên này.</p>
          <p>Bạn bước lên ngai vàng được dệt bằng giấy dó nghìn năm, trở thành Chủ Nhân mới của cõi Vạn Tượng. Từ nay, mọi bức tranh dân gian thất truyền đều nằm dưới sự cai trị của bạn...</p>
        </div>
      `,
      choices: [
        {
          text: 'Trở về Trang Chủ',
          next: 'home_screen',
          sound: 'paper'
        }
      ]
    },

    'ending_fire': {
      id: 'ending_fire',
      phase: 'HỒI KẾT • TRO TÀN',
      location: 'HIỆN TRƯỜNG VỤ HỎA HOẠN BÍ ẨN',
      date: 'Giải Thoát Quyết Liệt',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
      svgType: 'ceramic',
      quote: '“Lửa thiêng thiêu rụi ảo mộng... Trả lại sự thanh thản cho cõi trần.”',
      fx: 'shake',
      text: `
        <div class="ending-reveal-card">
          <h2 class="ending-title-banner">HỒI KẾT: TRO TÀN & TỰ DO</h2>
          <p>Ngọn lửa bùng cháy dữ dội, thiêu rụi toàn bộ khung tranh ma quái và toàn bộ cõi mực. Bạn cứu thoát được tất cả các linh hồn vô tội đang bị giam cầm.</p>
          <p>Bạn giật mình tỉnh dậy ngoài sân tòa nhà triển lãm giữa tiếng còi cứu hỏa inh ỏi. Căn phòng trung tâm đã hóa thành tro bụi. Dù bí mật vĩnh viễn bị chôn vùi, bạn và mọi người đã được tự do.</p>
        </div>
      `,
      choices: [
        {
          text: 'Trở về Trang Chủ',
          next: 'home_screen',
          sound: 'paper'
        }
      ]
    },

    'ending_void': {
      id: 'ending_void',
      phase: 'HỒI KẾT • HƯ KHÔNG',
      location: 'CÕI THIỀN THANH TỊNH',
      date: 'Vô Ưu Vô Ngã',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      svgType: 'brush',
      quote: '“Nét mực vẽ nên vạn vật, rồi cũng tan về với cõi hư không.”',
      fx: 'bell',
      text: `
        <div class="ending-reveal-card">
          <h2 class="ending-title-banner">HỒI KẾT: CÕI MỘNG HƯ KHÔNG</h2>
          <p>Bạn tĩnh tâm buông bỏ mọi chấp niệm. Toàn bộ nét mực của bức tranh tan biến như làn sương sớm. Không còn hận thù, không còn tranh đoạt.</p>
          <p>Bạn mở mắt thấy mình đang ngồi thưởng trà trong một góc phố cổ Hà Nội yên bình, như thể vừa trải qua một giấc chiêm bao nghìn năm giữa cõi đời nhân thế.</p>
        </div>
      `,
      choices: [
        {
          text: 'Trở về Trang Chủ',
          next: 'home_screen',
          sound: 'paper'
        }
      ]
    },

    'ending_ink_trap': {
      id: 'ending_ink_trap',
      phase: 'HỒI KẾT • THẾ THÂN',
      location: 'SÂU TRONG THỚ GIẤY DÓ CỔ',
      date: 'Vĩnh Viễn Bị Giam Cầm',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
      svgType: 'distortion',
      quote: '“Khi định lực cạn kiệt, người xem sẽ trở thành người trong tranh...”',
      fx: 'shake',
      text: `
        <div class="ending-reveal-card">
          <h2 class="ending-title-banner">HỒI KẾT: NÉT MỰC THIÊN THU</h2>
          <p>Định lực của bạn đã rơi về 0%. Nỗi khiếp sợ làm tê liệt ý chí. Bạn bị sóng thần mực đen nuốt trọn, thân xác hòa tan thành những sợi mực sẫm màu thấm sâu vào thớ giấy dó.</p>
          <p>Hôm sau tại triển lãm, bức tranh trung tâm mở rèm: Trong góc tranh, một bóng hình bàng hoàng đang đưa tay cầu cứu... Vĩnh viễn không ai biết đó chính là bạn.</p>
        </div>
      `,
      choices: [
        {
          text: 'Thử lại từ đầu',
          next: 'home_screen',
          sound: 'paper'
        }
      ]
    }
  }
};

window.GAME_DATA = GAME_DATA;
window.STORY_DATA = GAME_DATA; // Hỗ trợ tương thích ngược toàn dự án

if (typeof module !== 'undefined' && module.exports) {
  module.exports = GAME_DATA;
}
