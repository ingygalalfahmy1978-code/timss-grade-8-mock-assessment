# TIMSS Grade 8 Mock Assessment Platform - TODO

## Phase 1: Database Schema
- [x] Design and create all database tables (schema.ts)
- [x] Run migrations and apply SQL
- [x] Seed sample data: admin, teachers, students, classes, questions (Mock 1), exams

## Phase 2: Authentication
- [x] Custom username/password login (not OAuth) for admin/teacher/student
- [x] JWT session management with role-based access
- [x] Protect routes by role (admin, teacher, student)
- [x] Login page with clean blue/white design

## Phase 3: Admin Panel
- [x] Admin dashboard with stats overview
- [x] Manage students (add, edit, delete, generate credentials)
- [x] Manage teachers (add, edit, delete)
- [x] Manage classes (create, assign teachers and students)
- [x] Question bank management (add, edit, delete, tag questions)
- [x] Exam management (create 6 mock exams, assign questions)

## Phase 4: Teacher Dashboard
- [x] Teacher login and dashboard
- [x] View assigned classes
- [x] Activate/deactivate exams for a class
- [x] View student progress and scores
- [x] Download class reports as HTML (printable PDF)
- [x] Download individual student reports

## Phase 5: Student Exam Interface
- [x] Student login and dashboard showing available exams
- [x] Exam instructions screen before starting
- [x] One question per screen interface
- [x] Next / Previous / Flag for review / Review all / Submit buttons
- [x] Countdown timer
- [x] Multiple choice question rendering
- [x] Short answer question rendering
- [x] Prevent answer visibility before submission
- [x] Completion message after submission

## Phase 6: Scoring and Reports
- [x] Automatic scoring for multiple choice questions
- [x] Store: answers, total score, time spent, question-level performance
- [x] Generate detailed per-student report with all required fields
- [x] Admin/Teacher: download individual student report as HTML
- [x] Admin/Teacher: download full class report as HTML

## Phase 7: UI Polish
- [x] Professional blue/white theme throughout
- [x] Accessible typography (readable fonts, high contrast)
- [x] Responsive design
- [x] Write vitest tests (16 tests passing)
