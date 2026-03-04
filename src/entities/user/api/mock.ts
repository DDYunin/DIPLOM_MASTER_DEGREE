import type { User } from '../model/types'

export const mockUsers: User[] = [
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
  }
]
