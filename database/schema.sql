-- ==============================================================================
-- DATABASE SCHEMA: HERBAL SHOP (WEBSITE BÁN SẢN PHẨM THẢO MỘC THIÊN NHIÊN)
-- Engine: InnoDB | Charset: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `herbal_shop`
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE `herbal_shop`;

-- ------------------------------------------------------------------------------
-- 1. BẢNG CATEGORIES (Danh mục sản phẩm thảo mộc)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `payment_webhook_events`;
DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `order_details`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `product_images`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `categories`;

CREATE TABLE `categories` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL COMMENT 'Tên danh mục',
    `slug` VARCHAR(160) NOT NULL COMMENT 'Đường dẫn SEO duy nhất',
    `description` TEXT NULL COMMENT 'Mô tả danh mục',
    `sort_order` INT NOT NULL DEFAULT 0 COMMENT 'Thứ tự ưu tiên hiển thị',
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Bật/tắt hiển thị',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_categories_slug` (`slug`),
    KEY `idx_categories_active_sort` (`is_active`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh mục sản phẩm thảo dược';

-- ------------------------------------------------------------------------------
-- 2. BẢNG PRODUCTS (Sản phẩm thảo mộc thiên nhiên)
-- ------------------------------------------------------------------------------
CREATE TABLE `products` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `category_id` INT UNSIGNED NOT NULL COMMENT 'Khóa ngoại liên kết categories.id',
    `name` VARCHAR(255) NOT NULL COMMENT 'Tên sản phẩm thảo mộc',
    `slug` VARCHAR(255) NOT NULL COMMENT 'Đường dẫn URL SEO duy nhất',
    `sku` VARCHAR(60) NOT NULL COMMENT 'Mã phân loại kho hàng duy nhất',
    `summary` VARCHAR(500) NULL COMMENT 'Tóm tắt ngắn gọn',
    `description` TEXT NOT NULL COMMENT 'Mô tả chi tiết thành phần và nguồn gốc',
    `usage_instructions` TEXT NULL COMMENT 'Cách đun nấu, xông tắm hoặc ngâm',
    `ingredients` TEXT NULL COMMENT 'Các loại thảo mộc thành phần',
    `price` DECIMAL(12,2) NOT NULL COMMENT 'Giá bán hiện hành (VND)',
    `original_price` DECIMAL(12,2) NULL COMMENT 'Giá gốc niêm yết (nếu có)',
    `stock_quantity` INT NOT NULL DEFAULT 0 COMMENT 'Số lượng tồn kho khả dụng',
    `unit` VARCHAR(50) NOT NULL DEFAULT 'Gói' COMMENT 'Đơn vị bán lẻ',
    `is_featured` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Sản phẩm tiêu biểu trang chủ',
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Trạng thái kinh doanh',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_products_slug` (`slug`),
    UNIQUE KEY `uk_products_sku` (`sku`),
    KEY `idx_products_category` (`category_id`),
    KEY `idx_products_active_created` (`is_active`, `created_at` DESC),
    KEY `idx_products_price` (`price`),
    CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) 
        REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Sản phẩm thảo mộc';

-- ------------------------------------------------------------------------------
-- 3. BẢNG PRODUCT_IMAGES (Hình ảnh bộ sưu tập sản phẩm)
-- ------------------------------------------------------------------------------
CREATE TABLE `product_images` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `product_id` INT UNSIGNED NOT NULL COMMENT 'Khóa ngoại liên kết products.id',
    `image_url` VARCHAR(500) NOT NULL COMMENT 'Đường dẫn ảnh',
    `alt_text` VARCHAR(255) NULL COMMENT 'Mô tả ảnh cho SEO',
    `is_thumbnail` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Ảnh đại diện chính',
    `sort_order` INT NOT NULL DEFAULT 0 COMMENT 'Thứ tự hiển thị',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_product_images_product` (`product_id`),
    CONSTRAINT `fk_product_images_product` FOREIGN KEY (`product_id`) 
        REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Ảnh chi tiết sản phẩm';

-- ------------------------------------------------------------------------------
-- 4. BẢNG ORDERS (Đơn hàng và Thông tin người nhận)
-- ------------------------------------------------------------------------------
CREATE TABLE `orders` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `order_code` VARCHAR(30) NOT NULL COMMENT 'Mã đơn hàng hiển thị (VD: DH100234)',
    `access_token` VARCHAR(64) NOT NULL COMMENT 'Mã bảo mật xem đơn hàng (Chống đoán ID)',
    `customer_name` VARCHAR(150) NOT NULL COMMENT 'Họ và tên người nhận',
    `customer_phone` VARCHAR(20) NOT NULL COMMENT 'Số điện thoại nhận hàng',
    `customer_email` VARCHAR(150) NULL COMMENT 'Email người mua (tùy chọn)',
    `customer_address` VARCHAR(500) NOT NULL COMMENT 'Địa chỉ giao hàng chi tiết',
    `customer_note` TEXT NULL COMMENT 'Ghi chú của khách hàng',
    `subtotal_amount` DECIMAL(12,2) NOT NULL COMMENT 'Tổng tiền hàng',
    `shipping_fee` DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT 'Phí vận chuyển',
    `total_amount` DECIMAL(12,2) NOT NULL COMMENT 'Tổng số tiền khách phải thanh toán',
    `payment_method` VARCHAR(50) NOT NULL DEFAULT 'BANK_TRANSFER_QR' COMMENT 'Hình thức thanh toán',
    `payment_status` VARCHAR(30) NOT NULL DEFAULT 'PENDING' COMMENT 'PENDING, PAID, FAILED, UNDERPAID, CANCELLED',
    `order_status` VARCHAR(30) NOT NULL DEFAULT 'PENDING_PAYMENT' COMMENT 'PENDING_PAYMENT, PROCESSING, SHIPPED, COMPLETED, CANCELLED',
    `is_admin_notified` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Đã gửi email thông báo chủ shop chưa',
    `admin_notified_at` DATETIME NULL COMMENT 'Thời điểm gửi email thành công',
    `admin_notification_error` TEXT NULL COMMENT 'Nhật ký lỗi nếu gửi mail thất bại',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_orders_code` (`order_code`),
    KEY `idx_orders_access_token` (`access_token`),
    KEY `idx_orders_payment_status` (`payment_status`),
    KEY `idx_orders_order_status` (`order_status`),
    KEY `idx_orders_customer_phone` (`customer_phone`),
    KEY `idx_orders_created` (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Đơn đặt hàng khách hàng';

-- ------------------------------------------------------------------------------
-- 5. BẢNG ORDER_DETAILS (Chi tiết mặt hàng trong đơn - Snapshot)
-- ------------------------------------------------------------------------------
CREATE TABLE `order_details` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `order_id` INT UNSIGNED NOT NULL COMMENT 'Khóa ngoại liên kết orders.id',
    `product_id` INT UNSIGNED NULL COMMENT 'Khóa ngoại tham chiếu products.id (có thể NULL nếu sau này sản phẩm bị xóa)',
    `product_name` VARCHAR(255) NOT NULL COMMENT 'Snapshot tên sản phẩm tại thời điểm mua',
    `product_sku` VARCHAR(60) NOT NULL COMMENT 'Snapshot mã SKU tại thời điểm mua',
    `unit_price` DECIMAL(12,2) NOT NULL COMMENT 'Snapshot đơn giá tại thời điểm mua',
    `quantity` INT NOT NULL COMMENT 'Số lượng đặt mua',
    `line_total` DECIMAL(12,2) NOT NULL COMMENT 'Thành tiền (unit_price * quantity)',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_order_details_order` (`order_id`),
    KEY `idx_order_details_product` (`product_id`),
    CONSTRAINT `fk_order_details_order` FOREIGN KEY (`order_id`) 
        REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_order_details_product` FOREIGN KEY (`product_id`) 
        REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Chi tiết mặt hàng theo đơn';

-- ------------------------------------------------------------------------------
-- 6. BẢNG PAYMENTS (Thông tin lệnh thanh toán và đối soát SePay)
-- ------------------------------------------------------------------------------
CREATE TABLE `payments` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `order_id` INT UNSIGNED NOT NULL COMMENT 'Khóa ngoại liên kết 1:1 với orders.id',
    `payment_method` VARCHAR(50) NOT NULL DEFAULT 'BANK_TRANSFER_QR',
    `amount` DECIMAL(12,2) NOT NULL COMMENT 'Số tiền cần thanh toán chính xác',
    `payment_status` VARCHAR(30) NOT NULL DEFAULT 'PENDING' COMMENT 'PENDING, PAID, FAILED, UNDERPAID',
    `transfer_content` VARCHAR(50) NOT NULL COMMENT 'Nội dung chuyển khoản duy nhất (VD: DH100234)',
    `bank_code` VARCHAR(30) NOT NULL COMMENT 'Mã ngân hàng nhận (VCB, MB...)',
    `bank_account` VARCHAR(50) NOT NULL COMMENT 'Số tài khoản nhận tiền',
    `sepay_transaction_id` BIGINT NULL COMMENT 'ID giao dịch từ SePay sau khi khớp thành công',
    `paid_at` DATETIME NULL COMMENT 'Thời điểm thanh toán thành công',
    `note` TEXT NULL COMMENT 'Ghi chú đối soát hoặc thông báo lỗi',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_payments_order` (`order_id`),
    UNIQUE KEY `uk_payments_transfer_content` (`transfer_content`),
    KEY `idx_payments_sepay_tx` (`sepay_transaction_id`),
    KEY `idx_payments_status` (`payment_status`),
    CONSTRAINT `fk_payments_order` FOREIGN KEY (`order_id`) 
        REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý thông tin thanh toán chuyển khoản';

-- ------------------------------------------------------------------------------
-- 7. BẢNG PAYMENT_WEBHOOK_EVENTS (Nhật ký sự kiện SePay - Chống lặp)
-- ------------------------------------------------------------------------------
CREATE TABLE `payment_webhook_events` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `sepay_transaction_id` BIGINT NOT NULL COMMENT 'ID giao dịch SePay (Khóa chống lặp duy nhất)',
    `gateway` VARCHAR(50) NOT NULL COMMENT 'Tên ngân hàng phát sinh giao dịch',
    `transaction_date` DATETIME NOT NULL COMMENT 'Thời gian giao dịch theo ngân hàng',
    `account_number` VARCHAR(50) NOT NULL COMMENT 'Số tài khoản nhận tiền',
    `sub_account` VARCHAR(50) NULL COMMENT 'Tài khoản phụ / Virtual Account',
    `code` VARCHAR(50) NULL COMMENT 'Mã thanh toán do SePay trích xuất',
    `content` VARCHAR(500) NOT NULL COMMENT 'Toàn bộ nội dung chuyển khoản',
    `transfer_type` VARCHAR(10) NOT NULL COMMENT 'in (tiền vào) hoặc out (tiền ra)',
    `description` VARCHAR(500) NULL COMMENT 'Mô tả giao dịch đã chuẩn hóa',
    `transfer_amount` DECIMAL(12,2) NOT NULL COMMENT 'Số tiền thực tế nhận được (VND)',
    `accumulated` DECIMAL(15,2) NULL COMMENT 'Số dư tài khoản sau giao dịch',
    `reference_code` VARCHAR(100) NULL COMMENT 'Mã tham chiếu ngân hàng (FT number)',
    `raw_payload` JSON NOT NULL COMMENT 'Toàn văn JSON gửi từ SePay',
    `processing_status` VARCHAR(30) NOT NULL DEFAULT 'PROCESSED' COMMENT 'PROCESSED, DUPLICATE, UNDERPAID, UNMATCHED, ERROR',
    `error_message` TEXT NULL COMMENT 'Chi tiết lý do nếu gặp lỗi xử lý',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm tiếp nhận webhook',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_webhook_sepay_tx` (`sepay_transaction_id`),
    KEY `idx_webhook_code` (`code`),
    KEY `idx_webhook_account` (`account_number`),
    KEY `idx_webhook_status` (`processing_status`),
    KEY `idx_webhook_created` (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Nhật ký sự kiện Webhook từ SePay';

