import { ref } from 'vue'
import type { User, StudentProfile } from '../model/types'

export const mockUsers = ref<User[]>([
  {
    id: '1',
    name: 'Sarah Wilson',
    email: 'sarah.w@eduteach.com',
    avatar: 'https://i.pravatar.cc/150?u=1',
    role: 'Teacher',
    department: 'Mathematics',
    subDepartment: 'Faculty of Science',
    status: 'Active'
  },
  {
    id: '2',
    name: 'James Rodriguez',
    email: 'j.rodriguez@student.edu',
    avatar: 'https://i.pravatar.cc/150?u=2',
    role: 'Student',
    department: 'Computer Science',
    subDepartment: 'Engineering',
    status: 'Active'
  },
  {
    id: '3',
    name: 'Emily Chen',
    email: 'emily.chen@admin.edu',
    avatar: 'https://i.pravatar.cc/150?u=3',
    role: 'Admin',
    department: 'IT Department',
    subDepartment: 'Administration',
    status: 'Offline'
  },
  {
    id: '4',
    name: 'Michael Brown',
    email: 'mike.b@student.edu',
    avatar: 'https://i.pravatar.cc/150?u=4',
    role: 'Student',
    department: 'Physics',
    subDepartment: 'Faculty of Science',
    status: 'Blocked'
  },
  {
    id: '5',
    name: 'Dr. Alice Wong',
    email: 'a.wong@eduteach.com',
    avatar: 'https://i.pravatar.cc/150?u=5',
    role: 'Moderator',
    department: 'Student Affairs',
    subDepartment: 'Administration',
    status: 'Active'
  },
  {
    id: '6',
    name: 'John Doe',
    email: 'john.d@student.edu',
    avatar: 'https://i.pravatar.cc/150?u=6',
    role: 'Student',
    department: 'History',
    subDepartment: 'Faculty of Arts',
    status: 'Active'
  },
  {
    id: '7',
    name: 'Jane Smith',
    email: 'jane.s@eduteach.com',
    avatar: 'https://i.pravatar.cc/150?u=7',
    role: 'Teacher',
    department: 'Literature',
    subDepartment: 'Faculty of Arts',
    status: 'Offline'
  }
])

export const mockStudentProfile: StudentProfile = {
  id: '1',
  name: 'Marcus Johnson',
  email: 'marcus.j@university.edu',
  avatar: '',
  role: 'Student',
  department: 'Computer Science',
  subDepartment: 'Engineering',
  status: 'Active',
  studentId: 'STU-2023-8492',
  lastLogin: '2 hours ago',
  username: 'mjohnson23',
  cohort: 'CS-2024 (Computer Science)',
  notes: 'Internal notes about this account...'
}
