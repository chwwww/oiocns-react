//组件映射关系：https://1.xrender.fun/form-render/api/inner-widget
export const loadWidgetsOpts = (valueType: string = '描述型') => {
  switch (valueType) {
    case '用户型':
      return [
        {
          label: '输入框',
          value: 'string',
        },
        {
          label: '输入框',
          value: '',
        },
      ];
    case '数字输入框':
      return [
        {
          label: '数字',
          value: 'number',
        },
        {
          label: '金额',
          value: '',
        },
      ];
    case '选择型':
    case '分类型':
      return [
        {
          label: '下拉单选',
          value: 'select',
        },
        {
          label: '下拉单选',
          value: 'select',
        },
      ];
    case '日期型':
      return [
        {
          label: '日期组件',
          value: 'string',
        },
        {
          label: '日期',
          value: 'dateTime',
        },
      ];
    case '时间型':
      return [
        {
          label: '时间型',
          value: 'string',
        },
        {
          label: '日期',
          value: 'dateTime',
        },
      ];
    case '附件型':
      return [
        {
          label: '文件',
          value: 'string',
        },
        {
          label: '文件',
          value: 'upload',
        },
      ];
    case '数值型':
      return [
        {
          label: '数字输入框',
          value: 'number',
        },
        {
          label: '数字输入框',
          value: '',
        },
      ];
    default:
      return [
        {
          label: '文本',
          value: 'string',
        },
        {
          label: '多行文本',
          value: 'string',
        },
        {
          label: '多行文本',
          value: 'string',
        },
      ];
  }
};

export const loadRegexpOpts = (valueType: string = '描述型') => {
  switch (valueType) {
    case '描述型':
      return [
        {
          label: '固定电话号码',
          value: '(\\d{4}-|\\d{3}-)?(\\d{8}|\\d{7})',
        },
        {
          label: '手机号码',
          value: '1\\d{10}',
        },
        {
          label: '邮政编码',
          value: '[1-9]\\d{5}',
        },
        {
          label: '角色证号(15位或18位)',
          value: '\\d{15}(\\d\\d[0-9xX])?',
        },
        { label: '网址', value: '[a-zA-z]+://[^s]*' },
        {
          label: 'IP地址',
          value: '((2[0-4]d|25[0-5]|[01]?dd?).){3}(2[0-4]d|25[0-5]|[01]?dd?)',
        },
        {
          label: '邮箱地址',
          value: '\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*',
        },
        {
          label: 'QQ号码',
          value: '[1-9]\\d{4,}',
        },
        {
          label: 'HTML标记',
          value: '<(.*)(.*)>.*<\\/\\1>|<(.*) \\/>',
        },
        {
          label: '汉字(字符)',
          value: '[\\u4e00-\\u9fa5]',
        },
        {
          label: '中文及全角标点符号(字符)',
          value:
            '[\\u3000-\\u301e\\ufe10-\\ufe19\\ufe30-\\ufe44\\ufe50-\\ufe6b\\uff01-\\uffee]',
        },
      ];
    case '数值型':
      return [
        {
          label: '非负整数(正整数或零)',
          value: '\\d+',
        },
        {
          label: '正整数',
          value: '[0-9]*[1-9][0-9]*',
        },
        {
          label: '负整数',
          value: '-[0-9]*[1-9][0-9]*',
        },
        {
          label: '整数',
          value: '-?\\d+',
        },
        {
          label: '小数',
          value: '(-?\\d+)(\\.\\d+)?',
        },
      ];
    default:
      return [];
  }
};
//获取类型
