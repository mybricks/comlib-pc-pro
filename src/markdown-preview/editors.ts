
export default {
  '@init'({ style }) {
    style.width = 300;
    style.height = 300;
  },
  '@resize': {
    options: ['width', 'height']
  },
  ':root': {
    items: ({ }, cate1, cate2) => {
      cate1.title = 'Markdown';
      cate1.items = [
        {
          title: '初始内容',
          type: 'textarea',
          description: '初始时的markdown内容',
          options: {
            style:{
              height: 400
            }
          },
          value: {
            get({ data }) {
              return data.content
            },
            set({ data }, value) {
              data.content = value
            }
          }
        }
      ];
    }
  }
};
