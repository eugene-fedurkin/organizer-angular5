export const userMock = {
  email: 'eugene.fedurkin199999999@gmail.com',
  lists: [
    {
      id: 1,
      title: 'Category 1',
      items: [
        {
          id: 1,
          title: 'item 1',
          description: 'string',
          completed: false,
          dueDate: '2018-06-03',
          listId: 1,
        },
        {
          id: 2,
          title: 'item 2',
          description: 'string',
          completed: true,
          dueDate: '2018-06-03',
          listId: 1,
        },
        {
          id: 3,
          title: 'item 3',
          description: 'string',
          completed: false,
          dueDate: '2018-06-03',
          listId: 1,
          marker: {
            address: '2132 Lacsa Ct, San Jose, CA 95116, США',
            coordinates: { lat: 37.360809955200835, lng: -121.85150972698364 }
          }
        },
        {
          id: 4,
          title: 'item 4',
          description: 'string',
          completed: true,
          dueDate: '2018-06-03',
          listId: 1,
        },
      ]
    },
    {
      id: 2,
      title: 'Category 2',
      items: [
        {
          id: 5,
          title: 'item 5',
          description: 'string',
          completed: false,
          dueDate: '2018-06-03',
          listId: 2,
        },
        {
          id: 6,
          title: 'item 6',
          description: 'string',
          completed: true,
          dueDate: '2018-06-03',
          listId: 2,
        },
        {
          id: 7,
          title: 'item 7',
          description: 'string',
          completed: false,
          dueDate: '2018-06-03',
          listId: 2,
        },
        {
          id: 8,
          title: 'item 8',
          description: 'string',
          completed: true,
          dueDate: '2018-06-03',
          listId: 2,
        },
      ]
    },
  ],
};
