-- ==============================================================================
-- DATABASE SEED DATA: HERBAL SHOP (DỮ LIỆU MẪU SẢN PHẨM THẢO MỘC THIÊN NHIÊN)
-- Tuân thủ: Mô tả công dụng thư giãn, chăm sóc cơ thể tự nhiên; không cam kết chữa bệnh y tế.
-- ==============================================================================

USE `herbal_shop`;

-- 1. XÓA DỮ LIỆU CŨ NẾU CÓ THEO THỨ TỰ RÀNG BUỘC
DELETE FROM `payment_webhook_events`;
DELETE FROM `payments`;
DELETE FROM `order_details`;
DELETE FROM `orders`;
DELETE FROM `product_images`;
DELETE FROM `products`;
DELETE FROM `categories`;

-- Reset Auto Increment
ALTER TABLE `categories` AUTO_INCREMENT = 1;
ALTER TABLE `products` AUTO_INCREMENT = 1;
ALTER TABLE `product_images` AUTO_INCREMENT = 1;
ALTER TABLE `orders` AUTO_INCREMENT = 1;
ALTER TABLE `order_details` AUTO_INCREMENT = 1;
ALTER TABLE `payments` AUTO_INCREMENT = 1;
ALTER TABLE `payment_webhook_events` AUTO_INCREMENT = 1;

-- 2. CHÈN DANH MỤC SẢN PHẨM (CATEGORIES)
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `sort_order`, `is_active`) VALUES
(1, 'Thảo Mộc Xông Tắm', 'thao-moc-xong-tam', 'Các loại thảo mộc khô tự nhiên dùng để xông hơi, nấu nước tắm giúp thư giãn tinh thần và làm sạch làn da.', 1, TRUE),
(2, 'Muối Ngâm Chân Dược Liệu', 'muoi-ngam-chan-duoc-lieu', 'Muối khoáng kết hợp thảo mộc sấy lạnh giúp thư giãn đôi bàn chân, mang lại cảm giác dễ chịu trước giấc ngủ.', 2, TRUE),
(3, 'Chăm Sóc Tóc Tự Nhiên', 'cham-soc-toc-tu-nhien', 'Nước gội bồ kết cô đặc và tinh dầu dưỡng tóc chiết xuất từ cỏ cây truyền thống Việt Nam.', 3, TRUE),
(4, 'Xà Bông Sinh Dược', 'xa-bong-sinh-duoc', 'Xà bông thủ công làm từ phôi dầu dừa, dầu cọ kết hợp thảo dược lành tính cho làn da nhạy cảm.', 4, TRUE);

-- 3. CHÈN SẢN PHẨM (PRODUCTS)
INSERT INTO `products` 
(`id`, `category_id`, `name`, `slug`, `sku`, `summary`, `description`, `usage_instructions`, `ingredients`, `price`, `original_price`, `stock_quantity`, `unit`, `is_featured`, `is_active`) 
VALUES
(
    1, 1, 
    'Túi Thảo Mộc Tắm Sau Sinh Cổ Truyền (10 túi lọc)', 
    'tui-thao-moc-tam-sau-sinh-co-truyen-10-tui-loc', 
    'TM-TAMSINH-10', 
    'Công thức thảo mộc vùng cao giúp làm ấm cơ thể, thư giãn các cơ và hỗ trợ làn da phụ nữ sau sinh sạch sẽ, sảng khoái.', 
    'Sản phẩm được thu hái từ các loại thảo dược bản địa sấy khô tự nhiên. Túi lọc tiện lợi giúp mẹ bầu sau sinh có thể nấu nước tắm gội mà không lo cặn lá. Hương thơm thảo mộc ấm nồng tạo cảm giác bình an, xoa dịu mệt mỏi.', 
    'Cho 1 túi lọc vào nồi chứa 3-5 lít nước sôi, ủ trong 10-15 phút để thảo mộc ra hết tinh chất. Pha thêm nước ấm đến nhiệt độ vừa phải và dùng để lau người, tắm hoặc gội đầu.', 
    'Lá bưởi, sả chanh, hương nhu tía, ngải cứu, gừng gió, kinh giới, quế chi, hoa hồi.', 
    185000.00, 220000.00, 50, 'Hộp 10 túi lọc', TRUE, TRUE
),
(
    2, 1, 
    'Lá Xông Hơi Giải Cảm Thư Giãn Dân Gian (5 gói)', 
    'la-xong-hoi-giai-cam-thu-gian-dan-gian-5-goi', 
    'TM-XONGHOI-05', 
    'Hương thơm tinh dầu tự nhiên bốc hơi giúp thông thoáng đường thở, toát mồ hôi tự nhiên và nhẹ nhõm cơ thể.', 
    'Bộ lá xông sấy khô theo phương pháp thủ công giữ trọn tinh dầu thực vật. Phù hợp cho những ngày thời tiết giao mùa, người hay làm việc trong phòng máy lạnh cảm thấy uể oải, nặng nề.', 
    'Cho 1 gói vào nồi nước khoảng 2-3 lít, đun sôi 5 phút. Trùm chăn hoặc lều xông kín, mở hé vung để hơi nước bốc lên từ từ. Xông trong 10-15 phút, sau đó lau khô người.', 
    'Lá tre, lá sả, lá chanh, lá tía tô, lá trút, lá hương nhu, bạc hà tự nhiên.', 
    95000.00, 115000.00, 80, 'Gói 5 túi', TRUE, TRUE
),
(
    3, 2, 
    'Muối Khoáng Ngâm Chân Thảo Mộc Hoa Hồi & Quế Chi (500g)', 
    'muoi-khoang-ngam-chan-thao-moc-hoa-hoi-que-chi-500g', 
    'NC-HOI-QUE-500', 
    'Muối hạt hầm kết hợp quế hồi giúp làm ấm bàn chân, thư thái gân cốt sau ngày dài di chuyển nhiều.', 
    'Muối khoáng tự nhiên được sao vàng hạ thổ cùng bột thảo mộc quế khâu và hoa hồi thơm nồng. Giúp khử mùi hôi chân tự nhiên, kích thích các huyệt đạo ở lòng bàn chân.', 
    'Hòa tan 2-3 muỗng canh muối thảo mộc vào chậu nước ấm khoảng 40-45 độ C. Ngâm chân ngập mắt cá trong 15-20 phút vào mỗi buổi tối trước khi đi ngủ.', 
    'Muối khoáng hầm, bột quế chi, hoa hồi, địa liền, gừng sẻ khô, tinh dầu tràm gió.', 
    120000.00, 140000.00, 100, 'Hũ thủy tinh 500g', TRUE, TRUE
),
(
    4, 2, 
    'Muối Ngâm Chân Thảo Dược Gừng Gió & Ngải Cứu (500g)', 
    'muoi-ngam-chan-thao-duoc-gung-gio-ngai-cuu-500g', 
    'NC-GUNG-NGAI-500', 
    'Sự kết hợp giữa gừng sẻ cay ấm và ngải cứu giúp xua tan cảm giác lạnh cóng chân tay, dễ đi vào giấc ngủ ngon.', 
    'Được làm từ muối biển sạch ninh thuận ướp cùng nước cốt ngải cứu và gừng sẻ ta. Rất thích hợp cho người lớn tuổi, phụ nữ sau sinh và dân văn phòng ít vận động.', 
    'Pha 30g muối với 2 lít nước ấm (40-42 độ C). Ngâm chân từ 15 đến 20 phút, sau đó lau khô bằng khăn mềm, không cần rửa lại với nước lạnh.', 
    'Muối biển thô, gừng gió sấy, lá ngải cứu sao thơm, ngải hoa vàng, tinh dầu sả chanh.', 
    125000.00, 150000.00, 75, 'Hũ thủy tinh 500g', FALSE, TRUE
),
(
    5, 3, 
    'Cao Bồ Kết Cô Đặc Gội Đầu Cỏ Nhọ Nồi & Vỏ Bưởi (300ml)', 
    'cao-bo-ket-co-dac-goi-dau-co-nho-noi-vo-buoi-300ml', 
    'TC-BOKET-300', 
    'Nấu cô đặc theo cách truyền thống suốt 18 tiếng, giúp làm sạch da đầu dịu nhẹ, giữ tóc mềm mượt và bóng khỏe.', 
    'Không sử dụng chất tạo bọt công nghiệp (SLS/SLES) và silicone. Sản phẩm tạo bọt dịu nhẹ từ hoạt chất saponin tự nhiên trong trái bồ kết, giúp mái tóc sạch lâu và tơi phồng tự nhiên.', 
    'Lấy 20-30ml cao bồ kết hòa vào 1-1.5 lít nước ấm, tạo bọt nhẹ. Dội từ từ lên tóc, mát-xa da đầu trong 5-7 phút rồi xả lại bằng nước sạch.', 
    'Bồ kết nướng than hoa, cỏ mần trầu, nhọ nồi, vỏ bưởi da xanh, sả, chanh, hương nhu, hà thủ ô đỏ.', 
    190000.00, 225000.00, 60, 'Chai vòi nhấn 300ml', TRUE, TRUE
),
(
    6, 3, 
    'Xịt Dưỡng Tóc Tinh Chất Vỏ Bưởi & Hoa Nhài (150ml)', 
    'xit-duong-toc-tinh-chat-vo-buoi-hoa-nhai-150ml', 
    'TC-XITBUOI-150', 
    'Nước cất vỏ bưởi nguyên chất kết hợp tinh dầu hoa nhài giúp tóc suôn mềm, không bết dính và lưu hương thanh khiết.', 
    'Phương pháp chưng cất hơi nước khép kín lưu giữ toàn bộ vitamin và tinh dầu quý trong vỏ bưởi. Dạng xịt phun sương tiện dụng hàng ngày sau khi sấy khô tóc.', 
    'Lắc đều chai trước khi dùng. Xịt trực tiếp vào chân tóc và thân tóc khi tóc còn hơi ẩm hoặc trước khi ra ngoài. Mát-xa nhẹ nhàng cho dưỡng chất thấm sâu.', 
    'Nước cất vỏ bưởi tự nhiên, hydrosol hoa nhài, dầu argan ép lạnh, vitamin B5 (Panthenol).', 
    135000.00, 160000.00, 90, 'Chai xịt 150ml', FALSE, TRUE
),
(
    7, 4, 
    'Xà Bông Thảo Dược Nghệ Mật Ong Rừng (100g)', 
    'xa-bong-thao-duoc-nghe-mat-ong-rung-100g', 
    'XB-NGHE-100', 
    'Bánh xà bông thủ công dịu nhẹ, giúp làm sạch da tự nhiên, dưỡng ẩm và làm sáng màu da nhẹ nhàng.', 
    'Sản xuất theo mẻ nhỏ bằng phương pháp xà phòng hóa lạnh (Cold Process) từ dầu thực vật và bột nghệ đỏ Hưng Yên. Giàu glycerin tự nhiên giúp da không bị khô căng sau khi tắm.', 
    'Làm ướt cơ thể, tạo bọt xà bông với bông tắm hoặc xoa trực tiếp lên da. Mát-xa nhẹ nhàng toàn thân và tắm lại bằng nước sạch.', 
    'Dầu dừa nguyên chất, dầu cám gạo, bột nghệ nếp đỏ, mật ong rừng hoa nhãn, tinh dầu cam ngọt.', 
    65000.00, 80000.00, 120, 'Bánh 100g', TRUE, TRUE
),
(
    8, 4, 
    'Xà Bông Mướp Đắng & Tràm Trà Kháng Khuẩn Tự Nhiên (100g)', 
    'xa-bong-muop-dang-tram-tra-100g', 
    'XB-MUOPDANG-100', 
    'Chiết xuất mướp đắng mát lành kết hợp tràm trà giúp làm sạch thoáng lỗ chân lông, hỗ trợ làm dịu làn da mẩn ngứa.', 
    'Bánh xà bông thiên nhiên màu xanh diệp lục bắt mắt từ dịch ép khổ qua tươi. Mùi hương tràm gió thoang thoảng mang lại cảm giác thanh sạch, sảng khoái.', 
    'Dùng để tắm toàn thân hoặc rửa mặt hằng ngày. Để xà bông nơi khô ráo sau khi sử dụng để tránh bị mềm nhão.', 
    'Dầu cọ, dầu olive, dịch ép mướp đắng hữu cơ, tinh dầu tràm trà Úc, tinh dầu bạc hà.', 
    70000.00, 85000.00, 110, 'Bánh 100g', FALSE, TRUE
);

-- 4. CHÈN BỘ ẢNH MINH HỌA SẢN PHẨM (PRODUCT_IMAGES)
INSERT INTO `product_images` 
(`id`, `product_id`, `image_url`, `alt_text`, `is_thumbnail`, `sort_order`) 
VALUES
(1, 1, '/images/products/tam-sau-sinh-thumb.jpg', 'Hộp thảo mộc xông tắm sau sinh 10 túi lọc', TRUE, 1),
(2, 1, '/images/products/tam-sau-sinh-detail.jpg', 'Túi lọc thảo mộc sấy khô nguyên chất', FALSE, 2),
(3, 2, '/images/products/la-xong-cam-thumb.jpg', 'Gói lá xông giải cảm thảo dược dân gian', TRUE, 1),
(4, 2, '/images/products/la-xong-cam-pot.jpg', 'Nồi nước xông lá bốc hơi thảo mộc tự nhiên', FALSE, 2),
(5, 3, '/images/products/muoi-ngam-chan-hoi-que-thumb.jpg', 'Hũ muối khoáng ngâm chân thảo mộc quế hồi', TRUE, 1),
(6, 4, '/images/products/muoi-ngam-chan-gung-ngai-thumb.jpg', 'Muối ngâm chân gừng ngải cứu thư giãn', TRUE, 1),
(7, 5, '/images/products/cao-bo-ket-thumb.jpg', 'Chai cao bồ kết cô đặc nguyên chất 300ml', TRUE, 1),
(8, 6, '/images/products/xit-toc-buoi-thumb.jpg', 'Chai xịt dưỡng tóc vỏ bưởi hoa nhài 150ml', TRUE, 1),
(9, 7, '/images/products/xa-bong-nghe-thumb.jpg', 'Bánh xà bông nghệ mật ong rừng thiên nhiên', TRUE, 1),
(10, 8, '/images/products/xa-bong-muop-dang-thumb.jpg', 'Bánh xà bông mướp đắng tràm trà thơm mát', TRUE, 1);

