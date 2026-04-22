const KEY = 'phonghoc';

export const getPhongHoc = () => {
  return JSON.parse(localStorage.getItem(KEY) || '[]');
};

export const savePhongHoc = (data: any[]) => {
  localStorage.setItem(KEY, JSON.stringify(data));
};