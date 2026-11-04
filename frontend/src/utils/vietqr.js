// Danh sách các ngân hàng hỗ trợ VietQR Napas247 phổ biến nhất tại Việt Nam
export const VIETQR_BANKS = [
  { code: 'MB', name: 'MBBank (Quân Đội)', bin: '970422', shortName: 'MB' },
  { code: 'VCB', name: 'Vietcombank (Ngoại Thương)', bin: '970436', shortName: 'Vietcombank' },
  { code: 'TCB', name: 'Techcombank (Kỹ Thương)', bin: '970407', shortName: 'Techcombank' },
  { code: 'BIDV', name: 'BIDV (Đầu Tư & Phát Triển)', bin: '970418', shortName: 'BIDV' },
  { code: 'ICB', name: 'VietinBank (Công Thương)', bin: '970415', shortName: 'VietinBank' },
  { code: 'ACB', name: 'ACB (Á Châu)', bin: '970416', shortName: 'ACB' },
  { code: 'VPB', name: 'VPBank (Việt Nam Thịnh Vượng)', bin: '970432', shortName: 'VPBank' },
  { code: 'TPB', name: 'TPBank (Tiên Phong)', bin: '970423', shortName: 'TPBank' },
  { code: 'STB', name: 'Sacombank (Sài Gòn Thương Tín)', bin: '970403', shortName: 'Sacombank' },
  { code: 'HDB', name: 'HDBank (Phát Triển TP.HCM)', bin: '970437', shortName: 'HDBank' },
  { code: 'VIB', name: 'VIB (Quốc Tế)', bin: '970441', shortName: 'VIB' },
  { code: 'OCB', name: 'OCB (Phương Đông)', bin: '970448', shortName: 'OCB' },
  { code: 'MSB', name: 'MSB (Hàng Hải)', bin: '970426', shortName: 'MSB' },
  { code: 'SHB', name: 'SHB (Sài Gòn - Hà Nội)', bin: '970443', shortName: 'SHB' },
  { code: 'VBA', name: 'Agribank (Nông Nghiệp)', bin: '970405', shortName: 'Agribank' },
];

/**
 * Tạo link ảnh mã VietQR Napas247 chuẩn quốc gia, quét được bằng 100% app ngân hàng tại Việt Nam.
 * Sử dụng dịch vụ VietQR QuickLink chuẩn:
 * https://img.vietqr.io/image/<BANK_ID>-<ACCOUNT_NO>-<TEMPLATE>.png?amount=<AMOUNT>&addInfo=<CONTENT>&accountName=<ACCOUNT_NAME>
 */
export const getVietQrUrl = ({ bankId, bankAccount, amount, orderCode, accountName }) => {
  const cleanBank = (bankId || 'MB').trim();
  const cleanAcc = (bankAccount || '0983124567').replace(/\s+/g, '');
  const cleanAmount = Math.max(0, parseInt(amount, 10) || 0);
  const cleanDes = encodeURIComponent(orderCode || 'THANH TOAN NGAN HA');
  const cleanName = encodeURIComponent((accountName || 'TIEM THAO MOC NGAN HA').toUpperCase());

  // Template compact2: Hiển thị đầy đủ logo Napas247, logo ngân hàng, số tiền và nội dung
  return `https://img.vietqr.io/image/${cleanBank}-${cleanAcc}-compact2.png?amount=${cleanAmount}&addInfo=${cleanDes}&accountName=${cleanName}`;
};

