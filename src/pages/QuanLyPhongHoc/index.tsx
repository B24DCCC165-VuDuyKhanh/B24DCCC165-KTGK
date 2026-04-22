import React, { useEffect, useState } from 'react';
import { Button, Input, Form, Modal, message, Select, Tooltip } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import TablePhongHoc from '@/components/PhongHoc/TablePhongHoc';
import ModalPhongHoc from '@/components/PhongHoc/ModalPhongHoc';
import { PhongHoc } from './types';
import { getPhongHoc, savePhongHoc } from '@/services/phonghoc';

const { Option } = Select;

const QuanLyPhongHoc = () => {
  const [data, setData] = useState<PhongHoc[]>([]);
  const [filteredData, setFilteredData] = useState<PhongHoc[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PhongHoc | null>(null);

  const [form] = Form.useForm();

  const [searchText, setSearchText] = useState('');
  const [filterLoai, setFilterLoai] = useState<string | null>(null);
  const [filterNguoi, setFilterNguoi] = useState<string | null>(null);

  const nguoiList = ['Vũ Duy Khánh', 'Khánh Vũ Duy', 'Duy Khánh Vũ'];

  useEffect(() => {
    const stored = getPhongHoc();
    setData(stored);
  }, []);

  useEffect(() => {
    let result = [...data];

    if (searchText) {
      result = result.filter(
        (i) =>
          i.maPhong.toLowerCase().includes(searchText.toLowerCase()) ||
          i.tenPhong.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (filterLoai) {
      result = result.filter((i) => i.loaiPhong === filterLoai);
    }

    if (filterNguoi) {
      result = result.filter((i) => i.nguoiPhuTrach === filterNguoi);
    }

    setFilteredData(result);
  }, [searchText, filterLoai, filterNguoi, data]);

  const handleDelete = (record: PhongHoc) => {
    if (record.soCho >= 30) {
      message.error('Chỉ được xóa phòng dưới 30 chỗ');
      return;
    }

    Modal.confirm({
      title: 'Bạn chắc chắn muốn xóa?',
      onOk: () => {
        const newData = data.filter((i) => i.maPhong !== record.maPhong);
        setData(newData);
        savePhongHoc(newData);
        message.success('Xóa thành công');
      },
    });
  };

  return (
    <>
      <h2>Quản lý phòng học</h2>

      <Input
        placeholder="Tìm mã hoặc tên phòng"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: 300 }}
      />

      <Select
        placeholder="Lọc loại phòng"
        allowClear
        style={{ width: 200, marginLeft: 10 }}
        onChange={(value) => setFilterLoai(value || null)}
      >
        <Option value="LyThuyet">Lý thuyết</Option>
        <Option value="ThucHanh">Thực hành</Option>
        <Option value="HoiTruong">Hội trường</Option>
      </Select>

      <Select
        placeholder="Lọc người phụ trách"
        allowClear
        style={{ width: 200, marginLeft: 10 }}
        onChange={(value) => setFilterNguoi(value || null)}
      >
        {nguoiList.map((item) => (
          <Option key={item} value={item}>
            {item}
          </Option>
        ))}
      </Select>


      <Tooltip title="Reset bộ lọc">
        <Button
          icon={<ReloadOutlined />}
          style={{ marginLeft: 10 }}
          onClick={() => {
            setSearchText('');
            setFilterLoai(null);
            setFilterNguoi(null);
          }}
        />
      </Tooltip>

      <Button
        type="primary"
        style={{ marginLeft: 10 }}
        onClick={() => {
          setEditing(null);
          form.resetFields();
          setOpen(true);
        }}
      >
        Thêm phòng
      </Button>

      <TablePhongHoc
        data={filteredData}
        onEdit={(r) => {
          setEditing(r);
          form.setFieldsValue(r);
          setOpen(true);
        }}
        onDelete={handleDelete}
      />

      <ModalPhongHoc
        open={open}
        form={form}
        editing={editing}
        nguoiList={nguoiList}
        data={data}
        onOk={() => {
          form.validateFields().then((values: PhongHoc) => {
            const exist = data.find(
              (i) =>
                i.maPhong === values.maPhong ||
                i.tenPhong === values.tenPhong
            );

            if (!editing && exist) {
              message.error('Trùng mã hoặc tên phòng');
              return;
            }

            const newData = editing
              ? data.map((i) =>
                  i.maPhong === editing.maPhong ? values : i
                )
              : [...data, values];

            setData(newData);
            savePhongHoc(newData);
            setOpen(false);

            message.success(
              editing ? 'Cập nhật thành công' : 'Thêm thành công'
            );
          });
        }}
        onCancel={() => setOpen(false)}
      />
    </>
  );
};

export default QuanLyPhongHoc;