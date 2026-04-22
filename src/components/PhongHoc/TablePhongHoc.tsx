import { Table, Button, Space } from 'antd';
import { PhongHoc } from '@/pages/QuanLyPhongHoc/types';

interface Props {
  data: PhongHoc[];
  onEdit: (record: PhongHoc) => void;
  onDelete: (record: PhongHoc) => void;
}

const TablePhongHoc: React.FC<Props> = ({ data, onEdit, onDelete }) => {
  const columns = [
    {
      title: 'Mã phòng',
      dataIndex: 'maPhong',
    },
    {
      title: 'Tên phòng',
      dataIndex: 'tenPhong',
    },
    {
      title: 'Số chỗ',
      dataIndex: 'soCho',
      sorter: (a: PhongHoc, b: PhongHoc) => a.soCho - b.soCho,
    },
    {
      title: 'Loại phòng',
      dataIndex: 'loaiPhong',
      render: (text: string) => {
        switch (text) {
          case 'LyThuyet':
            return 'Lý thuyết';
          case 'ThucHanh':
            return 'Thực hành';
          case 'HoiTruong':
            return 'Hội trường';
          default:
            return text;
        }
      },
    },
    {
      title: 'Người phụ trách',
      dataIndex: 'nguoiPhuTrach',
    },
    {
      title: 'Hành động',
      render: (_: any, record: PhongHoc) => (
        <Space>
          <Button onClick={() => onEdit(record)}>Sửa</Button>
          <Button danger onClick={() => onDelete(record)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="maPhong"
      pagination={{ pageSize: 5 }}
    />
  );
};

export default TablePhongHoc;