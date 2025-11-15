# Tính năng Generate Quiz từ AI

## 📝 Mô tả

Tính năng cho phép giáo viên tạo quiz tự động từ file PDF bằng AI (Gemini). Giáo viên chỉ cần upload file PDF, AI sẽ phân tích và tạo ra các câu hỏi trắc nghiệm, sau đó giáo viên có thể chỉnh sửa trước khi lưu.

## 🚀 Cách sử dụng

### Bước 1: Truy cập trang Generate Quiz

- Đường dẫn: `/quizz/generate`
- Hoặc từ menu sidebar chọn "Tạo Quiz từ AI"

### Bước 2: Upload file PDF

1. Kéo thả file PDF vào vùng upload hoặc click để chọn file
2. File PDF tối đa 10MB
3. Click nút "Generate Quiz"
4. Đợi AI phân tích và tạo câu hỏi (thường mất 10-30 giây)

### Bước 3: Chỉnh sửa Quiz

Sau khi AI tạo xong, form sẽ hiển thị với các trường:

#### Thông tin Quiz:

- **Tên Quiz**: Tên của bài quiz (bắt buộc)
- **Môn học**: Chọn môn học từ danh sách (bắt buộc)
- **Mô tả Quiz**: Mô tả ngắn về bài quiz (bắt buộc)
- **Thời gian làm bài**: Thời gian tính bằng giây (mặc định 900s = 15 phút)

#### Danh sách câu hỏi:

Mỗi câu hỏi có thể chỉnh sửa:

- **Nội dung câu hỏi**: Nội dung của câu hỏi
- **Loại câu hỏi**:
  - Type 1: Một đáp án đúng
  - Type 2: Nhiều đáp án đúng
- **Độ khó**: Dễ (1), Trung bình (2), Khó (3)
- **Đáp án**:
  - Tick checkbox để đánh dấu đáp án đúng
  - Có thể thêm/xóa đáp án
  - Tối thiểu 2 đáp án

#### Actions:

- **Xóa câu hỏi**: Click icon thùng rác ở góc phải mỗi câu hỏi
- **Thêm đáp án**: Click icon + ở phần đáp án
- **Upload lại**: Click nút "Upload lại" để upload file PDF khác
- **Tạo Quiz**: Click nút "Tạo Quiz" để lưu

### Bước 4: Lưu Quiz

- Click nút "Tạo Quiz"
- Hệ thống sẽ gửi dữ liệu lên API
- Sau khi thành công, tự động chuyển về trang danh sách quiz

## 🔌 API Endpoints

### 1. Generate Quiz từ PDF

```
POST /api/v1/gemini/generate-quiz
Content-Type: multipart/form-data
Authorization: Bearer {token}

Body:
- file: File (PDF)

Response:
{
  "success": true,
  "message": "Quiz questions generated successfully",
  "data": {
    "total": 10,
    "questions": [
      {
        "content": "Câu hỏi...",
        "level": 1,
        "type": "1",
        "answers": [
          {
            "content": "Đáp án A",
            "is_true": true
          }
        ]
      }
    ]
  }
}
```

### 2. Lấy danh sách môn học

```
GET /api/v1/subjects
Authorization: Bearer {token}

Response:
{
  "data": [
    {
      "id": "uuid",
      "name": "Toán học",
      "description": "..."
    }
  ]
}
```

### 3. Tạo Quiz từ AI

```
POST /api/v1/quizzes/from-ai
Content-Type: application/json
Authorization: Bearer {token}

Body:
{
  "name_quiz": "Tên quiz",
  "des_quiz": "Mô tả quiz",
  "total_time": 900,
  "subject_id_question": "uuid",
  "questions": [...]
}

Response:
{
  "success": true,
  "message": "Quiz created successfully",
  "data": {...}
}
```

## 📁 Cấu trúc Files

```
src/
├── app/(dashboard)/(private)/quizz/generate/
│   └── page.tsx                          # Route page
├── views/quizz/
│   └── GenerateQuizView.tsx              # Main view component
├── components/quizz/generate/
│   ├── UploadPDFSection.tsx              # Upload PDF component
│   ├── GeneratedQuizForm.tsx             # Form chỉnh sửa quiz
│   └── QuestionCard.tsx                  # Card hiển thị câu hỏi
├── services/
│   └── gemini.service.ts                 # API service
└── types/
    └── gemini.ts                         # TypeScript types
```

## 🎨 UI/UX Features

- **Drag & Drop**: Kéo thả file PDF dễ dàng
- **Loading States**: Hiển thị trạng thái loading khi generate
- **Toast Notifications**: Thông báo thành công/lỗi
- **Responsive Design**: Tương thích mọi thiết bị
- **Form Validation**: Validate dữ liệu trước khi submit
- **Hover Effects**: Animation khi hover vào các card
- **Real-time Preview**: Xem trước câu hỏi ngay khi chỉnh sửa

## ⚠️ Lưu ý

1. File PDF phải có nội dung text (không phải ảnh scan)
2. Nội dung PDF nên rõ ràng, có cấu trúc
3. AI có thể tạo câu hỏi không chính xác 100%, cần review
4. Mỗi lần chỉ upload được 1 file
5. Token authentication bắt buộc

## 🐛 Troubleshooting

### Lỗi "Failed to generate quiz"

- Kiểm tra file PDF có hợp lệ không
- Kiểm tra kết nối internet
- Kiểm tra token authentication

### Lỗi "Failed to fetch subjects"

- Kiểm tra API endpoint `/api/v1/subjects`
- Kiểm tra quyền truy cập

### Lỗi "Failed to create quiz"

- Kiểm tra tất cả trường bắt buộc đã điền
- Kiểm tra ít nhất có 1 câu hỏi
- Kiểm tra mỗi câu hỏi có ít nhất 1 đáp án đúng

## 🔄 Future Improvements

- [ ] Hỗ trợ nhiều loại file (Word, PowerPoint)
- [ ] Cho phép chọn số lượng câu hỏi muốn tạo
- [ ] Cho phép chọn độ khó trung bình
- [ ] Preview PDF trước khi generate
- [ ] Lưu draft để tiếp tục sau
- [ ] Export quiz ra file
