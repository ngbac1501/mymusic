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
- Thử nghe nhạc, tìm kiếm để đảm bảo API hoạt động.
- Thử đăng nhập/đăng xuất để đảm bảo Firebase config đúng.
