# 🏗️ คู่มือการพัฒนา (Developer Guide) ขั้นตอนการสร้างระบบ SE NPRU TaskFlow Mini

เอกสารฉบับนี้จัดทำขึ้นเพื่ออธิบาย "ขั้นตอนการสร้างและพัฒนา" (How-to Build) ระบบ TaskFlow Mini ตั้งแต่เริ่มต้นจนจบกระบวนการ ทั้งฝั่ง Backend และ Frontend เพื่อความเข้าใจในการพัฒนาแบบ Fullstack

---

## 🛠️ ส่วนที่ 1: การพัฒนา Backend (Node.js + Express)

### 1. การตั้งค่าโปรเจกต์และติดตั้ง Library
เริ่มต้นสร้างโฟลเดอร์สำหรับทำ API และพิมพ์คำสั่งเพื่อสร้างฟังก์ชันพื้นฐาน:
```bash
mkdir backend && cd backend
npm init -y
npm install express mongoose cors dotenv jsonwebtoken bcrypt
```
- **express:** ใช้สร้าง Web Server และจัดการการ Request/Response
- **mongoose:** ใช้เชื่อมต่อและเขียนรับส่งข้อมูลกับ MongoDB
- **cors:** จัดการสิทธิ์ข้ามโดเมน (เพื่อให้ Frontend ต่างพอร์ตสามารถคุยกับ Backend ได้)
- **jsonwebtoken & bcrypt:** ใช้ทำระบบล็อกอิน (Login) สร้าง Token และเข้ารหัสรหัสผ่าน (Hash)

### 2. โครงสร้างไฟล์ Backend
แบ่งโฟลเดอร์ให้ชัดเจนตามรูปแบบ MVC (Model, View, Controller):
- `index.js`: ไฟล์หลักในการรันเซิร์ฟเวอร์
- `models/`: เก็บ Schema โครงสร้างตาราง (User, Task)
- `router/`: จัดการเส้นทาง URL (เช่น `/api/v1/auth`, `/api/v1/tasks`)
- `controller/`: ซ่อน Logic การตรวจสอบและจัดการหน้าบ้าน
- `middleware/`: ใช้ตรวจเช็กสิทธิ์ (เช่น `permission.middleware.js` ที่ทำหน้าที่ล้วงเอา JWT Token มาหาตัวตนผู้ใช้งาน)

### 3. การทำระบบล็อกอิน (Auth)
- **Register:** รับ Username/Password > เช็กอีเมลซ้ำซ้อนใน MongoDB > นำ Password ไปสับให้เละ (Hash) ด้วย `bcrypt` > บันทึก
- **Login:** ดึงอีเมลมาหาในฐานข้อมูล > หากตรงกัน ให้นำข้อมูล ID ผู้ใช้มาสร้างเหรียญตั๋ว (JWT Token) > ส่งกลับให้ Frontend

### 4. การจัดการงาน (Task CRUD)
ที่โฟลเดอร์ `controller/task.controller.js` ประกอบไปด้วย 4 ฟังก์ชันหลัก:
- `createTask:` สร้างงานใหม่พร้อมแนบ ID ผู้ใช้งาน ว่าใครเป็นเจ้าของ
- `getTasks:` ค้นหางานทั้งหมด แต่ฟิลเตอร์หาเฉพาะ `userId` ของคนที่กำลังขอเข้ามา
- `updateTask:` ค้นหางาน และเปลี่ยนข้อมูล จากนั้น `.save()`
- `deleteTask:` สั่งตระกูล `findByIdAndDelete`

---

## 🎨 ส่วนที่ 2: การพัฒนา Frontend (React + Vite)

### 1. การตั้งค่าโปรเจกต์ React
ใช้เครื่องมือ Vite ในการสร้างโฟลเดอร์ Frontend เพื่อความรวดเร็วในการคอมไพล์:
```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install react-router-dom axios zustand lucide-react react-hot-toast
```
- **react-router-dom:** ใช้สร้างตัวจัดการเปลี่ยนหน้า (Navigate)
- **axios:** ใช้ในการยิง API แทน `fetch` ธรรมดา เพราะง่ายในการแนบ Token
- **zustand:** พระเอกของสถาปัตยกรรมระบบ จัดการ Global State 
- **react-hot-toast:** ทำระบบแจ้งเตือนแบนเนอร์ข้อผิดพลาด (Error & Success UI)

### 2. โครงสร้างสถาปัตยกรรม (Architecture) ของ Frontend
- `src/main.jsx` และ `App.jsx`: เป็นด่านแรกของระบบ ใช้สำหรับวาง `BrowserRouter` หุ้มไว้ เพื่อคุม Route
- `src/pages/`: เก็บหน้าจอใหญ่ๆ (Login, Register, Dashboard) 
- `src/components/`: เก็บชิ้นส่วน UI เช่น กล่อง `TaskModal` ที่แยกออกมาจากหน้าหลัก

### 3. การจัดการ State กลางด้วย Zustand
(ตามโจทย์ของการออกแบบคอมโพเนนต์) ระบบได้สร้างโฟลเดอร์ `src/stores/` สำหรับจัดการข้อมูล:
- **`authStore.js`**: เอาไว้เก็บว่า User เชื่อมต่อเข้ามาหรือยัง มี Token ไหม และทำฟังก์ชันยิง API Login/Register ข้อมูลจะถูกเก็บให้เรียกใช้ได้ทุกหน้า
- **`taskStore.js`**: เอาไว้บันทึก Array ของงานทั้งหมด พร้อมฟังก์ชันดึงของ เพิ่ม และลบ หากทำสำเร็จจะแสดง UI Toasts ไปด้วยในตัว

### 4. การจัดการ UI และดีไซน์ (macOS x Material)
ผมปรับเปลี่ยนรูปแบบการแสดงผลแบบไม่มีใครเหมือน โค้ดถูกวางในไฟล์ `index.css`:
- ใช้ CSS แบบผสม **macOS Window Card**: สร้างกรอบหน้าต่างพร้อมปุ่มไฟจราจร 3 สีที่มุมซ้ายบน
- ใส่โครงสร้างของ **Google Material Design**: โดยเขียน CSS ดักการ :focus ของช่อง `<input>` เมื่อคลิกไป ข้อความ (Label) จะลอยเด้งขึ้นด้านบน
- ไม่ใช้ Tailwind แต่ใช้ Pure CSS ในไฟล์ `index.css` เพื่อโชว์ศักยภาพการสร้างเอกลักษณ์ Custom Style

---

## 📦 ส่วนที่ 3: การเชื่อมต่อระบบและการขึ้นเครื่องบิน (Deployment)

1. **เชื่อม Backend และ Frontend:** นำ Token ที่ได้จากการ Login จากฝั่ง React ฝังลงใน HTTP Header ที่ชื่อ `Authorization: Bearer <token>` ในส่วนของ Axios config `frontend/src/axios.js` 
2. **การ Deploy Backend:** อัปโหลดขึ้น Render.com พร้อมตั้งค่า Environment Variable สำหรับ `DB_URL` ไปหา MongoDB Atlas
3. **การ Deploy Frontend:** อัปโหลดขึ้น Vercel และตั้งค่าตัวแปร `VITE_API_URL` ให้ยิงมาที่โดเมนของ Render ที่เพิ่งสร้างเสร็จ (ต้องมี `/api/v1` ห้อยท้าย)
