# Teacher Quiz UI

Một ứng dụng web quản lý câu hỏi và bài quiz dành cho giáo viên, được xây dựng với Next.js và Material-UI.

## 🌟 Tính năng chính

- **Quản lý câu hỏi**: Tạo, chỉnh sửa, xóa và tìm kiếm câu hỏi
- **Quản lý bài quiz**: Tổ chức các câu hỏi thành bài quiz
- **Quản lý lớp học**: Quản lý thông tin lớp học và học sinh
- **Xác thực người dùng**: Đăng nhập/đăng xuất với NextAuth.js
- **Giao diện responsive**: Tương thích với mọi thiết bị
- **Phân trang và tìm kiếm**: Hỗ trợ phân trang và tìm kiếm nâng cao

## 🛠️ Công nghệ sử dụng

### Frontend

- **Next.js 15.1.2** - React framework với App Router
- **React 18.3.1** - Thư viện UI
- **TypeScript** - Ngôn ngữ lập trình
- **Material-UI 6.2.1** - Component library
- **Tailwind CSS** - CSS framework
- **Redux Toolkit** - State management

### UI/UX

- **Iconsax React** - Icon library
- **React Hook Form** - Form management
- **React Toastify** - Notification
- **ApexCharts** - Biểu đồ thống kê

## 📋 Yêu cầu hệ thống

- Node.js >= 18.0.0
- pnpm >= 8.0.0

## 🚀 Cài đặt và chạy dự án

### 1. Clone repository

```bash
git clone https://github.com/DB59s/teacher-quizz-ui.git
cd teacher-quizz-ui
```

### 2. Cài đặt dependencies

```bash
pnpm install --frozen-lockfile
```

### 3. Cấu hình môi trường

Tạo file `.env.local` từ `.env.example`:

```bash
cp .env.example .env.local
```

Cập nhật các biến môi trường trong `.env.local`:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# API
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 4. Chạy ứng dụng

#### Development mode:

```bash
pnpm dev
```

#### Production mode:

```bash
pnpm build
pnpm start
```

Ứng dụng sẽ chạy tại: `http://localhost:3000`

## 📁 Cấu trúc thư mục

```
src/
├── @core/              # Core components và utilities
├── @layouts/           # Layout components
├── @menu/              # Menu components và config
├── app/                # Next.js App Router
│   ├── (dashboard)/    # Dashboard routes
│   ├── api/           # API routes
│   └── globals.css    # Global styles
├── components/         # Shared components
├── contexts/          # React contexts
├── hooks/             # Custom hooks
├── libs/              # Third-party libraries setup
├── prisma/            # Database schema và migrations
├── redux-store/       # Redux store setup
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── views/             # Page components
    ├── question/      # Question management pages
    ├── quizz/         # Quiz management pages
    └── class/         # Class management pages
```

## 🎯 Tính năng chính

### 1. Quản lý câu hỏi (`/question`)

- Danh sách câu hỏi với phân trang
- Tạo câu hỏi mới
- Chỉnh sửa câu hỏi
- Xóa câu hỏi
- Tìm kiếm và lọc câu hỏi

### 2. Quản lý bài quiz (`/quizz`)

- Tạo bài quiz từ các câu hỏi có sẵn
- Quản lý thời gian làm bài
- Phân công bài quiz cho lớp học

### 3. Quản lý lớp học (`/class`)

- Thêm/sửa/xóa lớp học
- Quản lý danh sách học sinh
- Theo dõi kết quả học tập

## 🔧 Scripts có sẵn

```bash
# Development
pnpm dev                # Chạy development server với Turbopack
pnpm build             # Build production
pnpm start             # Chạy production server
pnpm lint              # Kiểm tra linting
pnpm lint:fix          # Sửa lỗi linting tự động
pnpm format            # Format code với Prettier

# Database
pnpm migrate           # Chạy Prisma migrations

# Build utilities
pnpm build:icons       # Build iconify icons
pnpm removeI18n        # Remove internationalization
```

## 🎨 Customization

### Thay đổi theme

Cấu hình theme trong `src/configs/themeConfig.ts`

### Thêm màu sắc

Cập nhật `src/configs/primaryColorConfig.ts`

### Cấu hình menu

Chỉnh sửa `src/@menu/defaultConfigs.ts`

## 📚 API Documentation

### Question API

- `GET /api/v1/questions` - Lấy danh sách câu hỏi
- `POST /api/v1/questions` - Tạo câu hỏi mới
- `PUT /api/v1/questions/:id` - Cập nhật câu hỏi
- `DELETE /api/v1/questions/:id` - Xóa câu hỏi

### Quiz API

- `GET /api/v1/quizzes` - Lấy danh sách bài quiz
- `POST /api/v1/quizzes` - Tạo bài quiz mới

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Dự án này sử dụng Commercial License.

## 👨‍💻 Tác giả

- **DB59s** - [GitHub](https://github.com/DB59s)

## 📞 Hỗ trợ

Nếu bạn gặp vấn đề hoặc có câu hỏi, vui lòng:

- Tạo issue trên GitHub
- Liên hệ qua email: [your-email@example.com]

## 🔄 Changelog

### v4.0.0

- Nâng cấp lên Next.js 15
- Thêm tính năng quản lý câu hỏi
- Cải thiện UI/UX
- Tích hợp Prisma ORM

---

**Lưu ý**: Đây là dự án giáo dục, vui lòng tuân thủ các quy định về bản quyền khi sử dụng.
