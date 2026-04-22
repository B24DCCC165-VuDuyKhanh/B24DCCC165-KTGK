import { Modal, Form, Input, InputNumber, Select } from 'antd';
import { PhongHoc } from '@/pages/QuanLyPhongHoc/types';

const { Option } = Select;

interface Props {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
  form: any;
  editing: PhongHoc | null;
  nguoiList: string[];
  data: PhongHoc[];
}

const ModalPhongHoc: React.FC<Props> = ({
  open,
  onOk,
  onCancel,
  form,
  editing,
  nguoiList,
  data,
}) => {
  return (
    <Modal
      title={editing ? 'Sửa phòng' : 'Thêm phòng'}
      visible={open}
      onOk={onOk}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical" validateTrigger="onChange">
        
        {/* MÃ PHÒNG */}
        <Form.Item
          name="maPhong"
          label="Mã phòng"
          rules={[
            { required: true, message: 'Không được để trống' },
            { max: 10, message: 'Tối đa 10 ký tự' },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();

                const isDuplicate = data.some(
                  (item) =>
                    item.maPhong === value &&
                    (!editing || item.maPhong !== editing.maPhong)
                );

                if (isDuplicate) {
                  return Promise.reject('Mã phòng đã tồn tại');
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* TÊN PHÒNG */}
        <Form.Item
          name="tenPhong"
          label="Tên phòng"
          rules={[
            { required: true, message: 'Không được để trống' },
            { max: 50, message: 'Tối đa 50 ký tự' },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();

                const isDuplicate = data.some(
                  (item) =>
                    item.tenPhong.toLowerCase() === value.toLowerCase() &&
                    (!editing || item.maPhong !== editing.maPhong)
                );

                if (isDuplicate) {
                  return Promise.reject('Tên phòng đã tồn tại');
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* SỐ CHỖ */}
        <Form.Item
          name="soCho"
          label="Số chỗ"
          rules={[
            { required: true, message: 'Không được để trống' },
            { type: 'number', min: 10, message: 'Tối thiểu 10 chỗ' },
            { type: 'number', max: 200, message: 'Tối đa 200 chỗ' },
          ]}
        >
          <InputNumber min={10} max={200} style={{ width: '100%' }} />
        </Form.Item>

        {/* LOẠI PHÒNG */}
        <Form.Item
          name="loaiPhong"
          label="Loại phòng"
          rules={[{ required: true, message: 'Chọn loại phòng' }]}
        >
          <Select>
            <Option value="LyThuyet">Lý thuyết</Option>
            <Option value="ThucHanh">Thực hành</Option>
            <Option value="HoiTruong">Hội trường</Option>
          </Select>
        </Form.Item>

        {/* NGƯỜI PHỤ TRÁCH */}
        <Form.Item
          name="nguoiPhuTrach"
          label="Người phụ trách"
          rules={[{ required: true, message: 'Chọn người phụ trách' }]}
        >
          <Select>
            {nguoiList.map((item) => (
              <Option key={item} value={item}>
                {item}
              </Option>
            ))}
          </Select>
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default ModalPhongHoc;