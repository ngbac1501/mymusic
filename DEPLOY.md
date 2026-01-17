# Hướng dẫn Deploy lên Vercel

Dự án đã được cấu hình để deploy dễ dàng lên Vercel (Frontend + Backend trong cùng một repo).

## Chuẩn bị
1. Đăng ký tài khoản tại [Vercel](https://vercel.com).
2. Cài đặt Vercel CLI (nếu muốn deploy từ dòng lệnh): `npm i -g vercel`.
3. Đảm bảo code đã được push lên GitHub/GitLab/Bitbucket.

## Cách 1: Deploy qua GitHub (Khuyên dùng)
1. Đăng nhập vào Vercel Dashboard.
2. Chọn **"Add New..."** -> **"Project"**.
3. Chọn repo GitHub chứa code dự án này.
4. Ở phần **Build & Development Settings**, Vercel sẽ tự động nhận diện Vite framework.
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Ở phần **Environment Variables**, thêm các biến môi trường từ file `.env` (trừ `VITE_API_BASE_URL` vì đã có `.env.production` setup sẵn, nhưng bạn có thể thêm nếu muốn override):
   - `VITE_FIREBASE_API_KEY`: ...
   - `VITE_FIREBASE_AUTH_DOMAIN`: ...
   - ... (copy hết các biến `VITE_FIREBASE_*`)
6. Nhấn **Deploy**.

## Cách 2: Deploy qua CLI
1. Mở terminal tại thư mục gốc dự án.
2. Chạy lệnh:
   ```bash
   vercel
   ```
3. Làm theo hướng dẫn trên màn hình (chấp nhận các giá trị mặc định).

## Lưu ý về Backend
- Backend (API) đã được cấu hình để chạy như một **Serverless Function** trên Vercel.
- File cấu hình `vercel.json` ở root sẽ điều hướng các request `/api/*` tới backend.
- File `api/index.js` là entry point cho Vercel function.
- File `.env.production` đảm bảo Frontend gọi API qua đường dẫn tương đối `/api` thay vì `localhost`.

## Kiểm tra sau khi Deploy
- Truy cập URL dự án do Vercel cung cấp.
- Thử đăng nhập/đăng xuất để đảm bảo Firebase config đúng.

## Khắc phục lỗi: Không có dữ liệu bài hát (Vercel)
Nếu app hoạt động dưới Localhost nhưng trên Vercel không hiện dữ liệu (Home page trắng trơn, không có bài hát):
**Nguyên nhân**: Server của Vercel (thường ở Mỹ/Châu Âu) bị ZingMP3 chặn IP.
**Cách xử lý**:
1. Vào `http://zingmp3.vn`, đăng nhập tài khoản của bạn.
2. Mở Web Developer Tools (F12) -> Tab Network.
3. Reload trang, tìm request bất kỳ (ví dụ `home`).
4. Copy toàn bộ giá trị của `Cookie` trong phần **Request Headers**.
5. Vào Vercel Dashboard -> Project Settings -> Environment Variables.
6. Thêm biến mới:
   - Key: `ZING_MP3_COOKIE`
   - Value: (Dán chuỗi cookie vừa copy vào)
7. Redeploy lại dự án (Vào Deployments -> Redeploy).
