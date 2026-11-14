export type GameStage =
  | 'PROLOGUE'              // Mở đầu tự sự & tiếng guốc mộc phố cổ
  | 'INSPECT_TIGER'         // Khám phá 5 Thần Hổ trên Tranh Ngũ Hổ Bản Chính
  | 'OLD_QUARTER_MAP'       // Bản đồ 10 địa điểm Thăng Long xưa
  | 'RETURN_SAFEZONE'       // Tự động quay về Khu Mở Đầu (Safezone) ngay khi hoàn thành địa điểm
  | 'LOCATION_PUZZLE'       // Giải đố tại 1 trong 5 địa điểm thật
  | 'DECOY_LOCATION'        // Thăm địa điểm đánh lạc hướng
  | 'PRINTING_WORKSHOP'     // 5 bước mô phỏng in tranh Hàng Trống
  | 'POEM_CIPHER'           // Giải mã bài thơ cổ & la bàn 4 hướng
  | 'EPILOGUE';             // Mở khóa Lý Ngư Vọng Nguyệt & chiến thắng

export type ElementType = 'Mộc' | 'Hỏa' | 'Kim' | 'Thủy' | 'Thổ';

export type RelicId = 'giay_do' | 'muc_tau' | 'van_khac' | 'pham_mau' | 'but_long';

export interface RelicItem {
  id: RelicId;
  name: string;
  element: ElementType;
  tiger: string;
  tigerColor: string;
  locationName: string;
  description: string;
  historicalNote: string;
}

export interface TigerAnomaly {
  id: number;
  tigerName: string;
  colorName: string;
  colorCode: string;
  direction: string;
  element: ElementType;
  anomalyTitle: string;
  anomalyDesc: string;
  deductionHint: string;
  targetLocation: string;
  relicName: string;
  xPercent: number;
  yPercent: number;
}

export interface LocationData {
  id: string;
  name: string;
  role: 'hint' | 'decoy';
  element?: ElementType;
  relicId?: RelicId;
  relicName?: string;
  atmosphere: string;
  description: string;
  historyText: string;
  dialogue: string[];
}
