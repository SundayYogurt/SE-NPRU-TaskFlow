# คู่มือการใช้งาน (User Manual) และโครงสร้างระบบ SE NPRU TaskFlow Mini

เอกสารประกอบการสอบปลายภาค (Lab Exam) 2/2568 
วิชา: 7153310 การพัฒนาโปรแกรมสำหรับอุปกรณ์เคลื่อนที่ & 7153311 การพัฒนาซอฟต์แวร์เชิงคอมโพเนนต์

---

## 🔗 URL สำหรับเข้าใช้งานระบบ (Deployed)
- **Frontend URL (Vercel):** `[👉 วางลิงก์ Vercel ของคุณตรงนี้]`
- **Backend API URL (Render):** `[👉 วางลิงก์ Render ของคุณตรงนี้]`
- **GitHub Repository:** `https://github.com/SundayYogurt/SE-NPRU-TaskFlow`

*(หมายเหตุ: แนะนำให้ใส่ภาพ Capture หน้าจอการทำงานของระบบ เช่น หน้า Login, หน้า Dashboard และหน้า Modal ลงในพื้นที่นี้ตามข้อกำหนดของโจทย์)*

---

## 🛠️ โครงสร้างและการจัดการ Global State (คะแนนส่วน C - 25 คะแนน)

ระบบ TaskFlow Mini เลือกใช้ **Zustand** ในการทำ Global State Management แทน Context API และ Redux ด้วยเหตุผลทางสถาปัตยกรรม (Architecture) ดังนี้:

### 1. เหตุผลการเลือกใช้ Zustand
- **ลด Boilerplate:** Zustand ไม่ต้องการโค้ดตั้งต้นที่ซับซ้อน (เช่น Action Types, Reducers, หรือ Context Providers ที่หุ้ม Component Tree ไว้ตื้นจนถึงลึก) ทำให้โครงสร้างแอปเบาและโหลดไวขึ้น
- **การแยกความรับผิดชอบ (Separation of Concerns):** สามารถดึง Logic การเรียก API ต่างๆ ออกไปจากไฟล์ Component (UI) ได้เลย 100% ทำให้ไฟล์ UI เช่น `Dashboard.jsx` สนใจแค่การนำข้อมูลมาแสดงผลเท่านั้น
- **ความง่ายในการจัดการ Async State:** สามารถใช้งานคำสั่ง `async / await` คู่กับ API `axios` ของ Backend ภายใน Zustand Store ได้โดยตรง พร้อมจัดการค่า `isLoading` และ `error` ครบจบในตัวเดียว

### 2. โครงสร้าง State กลางที่ออกแบบไว้ (2 Stores หลัก)
ระบบได้แบ่งโครงสร้างการจัดการออกเป็นฝั่งอย่างเป็นระเบียบ ดังนี้:

**A. `useAuthStore` (จัดการสิทธิ์และผู้ใช้)**
- **State กลาง:** `user` (เก็บข้อมูลผู้พัก), `token` (เก็บ JWT), `isAuthenticated` (เช็กสถานะ), `isLoading`, `error`
- **Actions:** 
  - `register / login:` เรียกใช้ฟังก์ชันและส่งต่อคำขอไปยัง Backend หากสำเร็จจะทำการบันทึก `token` ลงใน `localStorage`
  - `logout:` สั่งลบ `token` ในระบบ
  - `getMe:` ดึงข้อมูลผู้ใช้งานอัปเดตใหม่ทุกครั้งเมื่อโหลดแอป (Persistent Auth)

**B. `useTaskStore` (จัดการระบบงานทั้งหมด)**
- **State กลาง:** `tasks` (เก็บ Array ของงาน), `isLoading`, `error`
- **Actions:**
  - `fetchTasks:` ดึงรายการงาน (GET)
  - `addTask:` สร้างงานใหม่พร้อมรับค่า Priority (POST)
  - `updateTask:` อัปเดตข้อมูลหรือเปลี่ยน Status (PUT)
  - `deleteTask:` ลบข้อมูลออกจากฐานข้อมูล (DELETE)

การออกแบบนี้ทำให้ UI สามารถดึงฟังก์ชัน `addTask` จากหน้า Modal ตรงเข้า Global State ได้เลยโดยไม่ต้องโยน Props กลับไปกลับมา (Prop drilling)

---

## 🚀 คู่มือการติดตั้งและรันระบบเบื้องต้น (แบบ Local)

หากต้องการรันโปรเจกต์นี้บนเครื่องคอมพิวเตอร์ของคุณเอง ให้ทำตามขั้นตอนต่อไปนี้:

### 1. การติดตั้งฝั่ง Backend
1. เปิด Terminal หรือ Command Line และเข้าไปที่โฟลเดอร์รหัสผ่าน: `cd backend`
2. ติดตั้งแพ็กเกจด้วยคำสั่ง:
   ```bash
   npm install
   ```
3. คัดลอกรูปแบบไฟล์ตัวแปรสภาพแวดล้อม: (หรือสร้างไฟล์ชื่อ `.env`)
   ไปดูตัวอย่างหน้าตาของไฟล์ที่ `backend/.env.example`
   ```env
   PORT=5001
   BASE_URL=http://localhost:5001
   DB_URL=mongodb+srv://<user>:<password>@cluster0.../taskflow?appName=Cluster0
   JWT_SECRET=supersecret123
   JWT_EXPIRES=7d
   ```
4. กดบันทึกและรันเซิร์ฟเวอร์ด้วยคำสั่ง:
   ```bash
   npm start
   ```

### 2. การติดตั้งฝั่ง Frontend
1. เปิด Terminal ใหม่แล้วเข้าไปที่โฟลเดอร์: `cd frontend`
2. ติดตั้งแพ็กเกจ:
   ```bash
   npm install
   ```
3. คัดลอกรูปแบบไฟล์ตัวแปรสภาพแวดล้อม: (หรือสร้างไฟล์ชื่อ `.env`)
   ดูจาก `frontend/.env.example` เพื่อเชื่อมตัวแปร URL:
   ```env
   VITE_API_URL=http://localhost:5001/api/v1
   ```
4. กดบันทึกและเริ่มตัวทำงาน (React Vite):
   ```bash
   npm run dev
   ```

---

## 🤖 ข้อตกลงการใช้ AI ในการช่วยเขียนโค้ด
*(เขียนกำกับไว้เพื่อความโปร่งใสตามเงื่อนไขข้อ 7 ของการใช้ทรัพยากร)*
โปรเจกต์นี้ได้รับการช่วยเหลือจาก AI ในลักษณะ:
1. การร่างตัวโครงสร้างสถาปัตยกรรม Zustand ให้แยก `AuthStore` กับ `TaskStore` คลีนๆ
2. การให้ AI ช่วยจัดการทำ Style `index.css` แบบ Minimal & Glassmorphism รวมไปถึง Animation การโหลดข้อมูลเพื่อความสวยงามโดยใช้เวลาสร้างได้อย่างรวดเร็ว
3. การช่วยวิเคราะห์ Error การเชื่อมต่อ CORS (Cross-Origin) และการจัดการ Network Whitelist ของ MongoDB Atlas เพื่อประสิทธิภาพที่ถูกต้องตามกระบวนการ DevOps
