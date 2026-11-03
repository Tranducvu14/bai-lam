# Quản lý điểm sinh viên
## Chạy chương trình
1. Mở thư mục `quan_ly_sinh_vien_debug` bằng VS Code.
2. Cài extension **Live Server** nếu chưa có.
3. Nhấn chuột phải `index.html` → **Open with Live Server**. Không mở trực tiếp bằng `file://` vì trình duyệt chặn fetch JSON.
4. Trang `statistics.html` là trang thống kê; từ trang chính có liên kết điều hướng.
## Chức năng
- Đọc dữ liệu 30 sinh viên, 5 môn, bảng điểm từ JSON.
- Công thức môn: 0.1 chuyên cần + 0.4 giữa kỳ + 0.5 cuối kỳ.
- Tính trung bình học kỳ, xếp loại.
- Sắp xếp theo tên gọi (tên cuối trong họ tên) rồi họ và tên đệm; tìm kiếm.
- Phân bổ quỹ học bổng 100.000.000 VNĐ theo Top 10%, 30%, 50%; thứ hạng phụ theo mã SV; phần chia làm tròn 1.000 đồng và bảo đảm đủ quỹ.
- Sửa 3 điểm thành phần cho từng môn. Dữ liệu sửa lưu trong localStorage trình duyệt; nút/tuỳ chọn xóa dữ liệu trang (clear localStorage key `gradeManagerGrades`) để về điểm gốc.
- So sánh điểm 5 môn và trung bình học kỳ giữa 2 sinh viên.
- Trang thống kê: điểm TB cao nhất, phân bố xếp loại, sinh viên có môn dưới 5, TB/min/max từng môn.
