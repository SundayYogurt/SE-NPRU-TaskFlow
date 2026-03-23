# SE NPRU TaskFlow Mini

นี่คือโปรเจกต์ระบบจัดการงานส่วนบุคคล (TaskFlow Mini) สำหรับการสอบปลายภาค (Lab Exam) 2/2568 
วิชา 7153310 และ 7153311 

## โครงสร้างโปรเจกต์
โปรเจกต์ถูกแบ่งออกเป็น 2 ส่วนอย่างชัดเจน:
1. `frontend/` - พัฒนาด้วย React (Vite), Zustand, ควบคู่กับการดีไซน์ UI ด้วย CSS Glassmorphism
2. `backend/` - พัฒนาด้วย Node.js, Express, MongoDB และควบคุมสิทธิ์ด้วย JWT

## โครงสร้างและการจัดการ Global State (25 คะแนน)
ในโปรเจกต์นี้เลือกใช้ **Zustand** ในการจัดการ Global State ด้วยเหตุผลดังต่อไปนี้:
1. **ลด Boilerplate และความซับซ้อน**: Zustand มีโครงสร้างที่ตรงไปตรงมา ไม่ต้องสร้าง Reducers, Actions, หรือ Context Provider มาหุ้ม (Wrap) ตัวแอปพลิเคชันให้ยุ่งยากเหมือน Redux ทำให้โค้ดอ่านง่ายและ Clean กว่ามาก
2. **การจัดการ Async Functions ที่มีประสิทธิภาพ**: Zustand รองรับการเรียกใช้ API (Axios) และการทำ Try/Catch ภายใน Store ได้โดยตรง ทำให้สามารถจัดการสถานะ Loading และ Error ของทั้งการอัปเดตงานและการล็อกอินจบในที่เดียว 
3. **การแยกความรับผิดชอบ (Separation of Concerns)**: ในโปรเจกต์ได้แยก Store ออกเป็น `authStore.js` (จัดการผู้ใช้งานและ Token) และ `taskStore.js` (จัดการงาน 100%) อย่างชัดเจน ซึ่ง Components ฝั่ง UI จะทำหน้าที่แค่รับค่า (State) ไปแสดงผลเท่านั้น

## URL ของระบบที่ Deploy แล้ว (15 คะแนน)
- **Frontend (Vercel)**: `[รอใส่ลิงก์ Vercel ของคุณ]`
- **Backend (Render)**: `[รอใส่ลิงก์ Render ของคุณ]`

*(กรุณาแนบภาพ Capture การทำงานของระบบใน Repository นี้ตามข้อกำหนด)*

---

## คู่มือการติดตั้งและรันระบบเบื้องต้น (การรันแบบ Local)

### 1. การติดตั้ง Backend
1. เปิด Terminal แล้วเข้าไปที่โฟลเดอร์ Backend: `cd backend`
2. รันคำสั่ง `npm install` เพื่อติดตั้ง Package ต่างๆ
3. คัดลอกไฟล์ `.env.example` เป็น `.env` และตั้งค่า Database (MongoDB):
   ```env
   PORT=5001
   BASE_URL=http://localhost:5001
   DB_URL=mongodb://127.0.0.1:27017/se-npru-taskflow-mini
   JWT_SECRET=supersecret123
   JWT_EXPIRES=7d
   ```
4. รัน Server ด้วยคำสั่ง `npm start` (Backend จะรันที่ `localhost:5001`)

### 2. การติดตั้ง Frontend
1. เปิดอีก Terminal แล้วเข้าไปที่โฟลเดอร์ Frontend: `cd frontend`
2. รันคำสั่ง `npm install` เพื่อติดตั้ง Package
3. คัดลอกไฟล์ `.env.example` เป็น `.env` และเช็ก API URL ให้ตรงกับ Backend:
   ```env
   VITE_API_URL=http://localhost:5001/api/v1
   ```
4. รันระบบด้วยคำสั่ง `npm run dev` 

## AI Usage Disclaimer
*โปรเจกต์นี้มีการใช้เครื่องมือ AI เป็นผู้ช่วยในการเขียนโค้ดเพื่อการวางโครงสร้างโปรเจกต์, การจัดรูปแบบ CSS Animation (Glassmorphism), และการแนะนำเรื่องการออกแบบ Logic Zustand Store ให้แยกเป็นสัดส่วน (Clean Architecture) อย่างเหมาะสมตรงตาม Rubric*
