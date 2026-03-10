export const rawTreeData = [
  {
    key: 'uni-1',
    label: 'University of Tech',
    data: { type: 'university', icon: 'pi pi-building' },
    children: [
      {
        key: 'inst-1',
        label: 'Institute of Engineering',
        data: { type: 'institute', icon: 'pi pi-building' },
        children: [
          {
            key: 'dept-1',
            label: 'Computer Science Dept',
            data: { type: 'department', icon: 'pi pi-building' },
            children: [
              {
                key: 'grp-1',
                label: 'Faculty Members',
                data: { type: 'group', icon: 'pi pi-users' }
              },
              {
                key: 'grp-2',
                label: 'Research Staff',
                data: { type: 'group', icon: 'pi pi-flask' }
              },
              {
                key: 'grp-3',
                label: 'Curriculum Committee',
                data: { type: 'group', icon: 'pi pi-list' }
              }
            ]
          },
          {
            key: 'dept-2',
            label: 'Electrical Engineering',
            data: { type: 'department', icon: 'pi pi-building' }
          }
        ]
      },
      {
        key: 'inst-2',
        label: 'Institute of Business',
        data: { type: 'institute', icon: 'pi pi-building' }
      },
      {
        key: 'inst-3',
        label: 'School of Arts',
        data: { type: 'institute', icon: 'pi pi-palette' }
      }
    ]
  }
]
