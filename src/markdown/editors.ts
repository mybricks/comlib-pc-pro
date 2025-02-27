
export default {
  '@init'({ style }) {
    style.width = 300;
    style.height = 300;
  },
  '@resize': {
    options: ['width', 'height']
  },
  ':root': {
    items: ({}, cate1, cate2) => {
      cate1.title = 'Markdown';
      cate1.items = [
        {
          title: '隐藏工具条',
          type: 'Switch',
          description: '是否显示工具条',
          value: {
            get({ data }) {
              return data.hideToolbar
            },
            set({ data }, value) {
              data.hideToolbar = value
            }
          }
        }
      ];
    }
  }
};
