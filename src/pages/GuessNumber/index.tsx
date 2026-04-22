import { useState } from 'react';
import './index.less';
const MAX_TURN = 10;// Số lượt đoán tối đa

export default function GuessNumber() {
  const [target] = useState<number>(
    () => Math.floor(Math.random() * 100) + 1
  );// Sinh ra số ngẫu nhiên từ 1 đến 100
  const [guess, setGuess] = useState<string>('');// Giá trị người chơi nhập

  const [message, setMessage] = useState<string>(
    'Hãy đoán một số từ 1 đến 100'
  );// Thông báo hiển thị cho người chơi

  const [status, setStatus] = useState<'idle' | 'wrong' | 'correct'>('idle'); // Trạng thái của lần đoán

  const [turn, setTurn] = useState<number>(0);  // Số lượt đã đoán

  const [gameOver, setGameOver] = useState<boolean>(false);  // Trạng thái kết thúc game

  const handleGuess = () => {
    // Nếu game đã kết thúc thì không cho đoán tiếp
    if (gameOver) return;

    // Chuyển giá trị nhập sang số
    const num = Number(guess);

    if (isNaN(num) || num < 1 || num > 100) {
      setMessage('Vui lòng nhập số hợp lệ (1–100)');
      setStatus('idle');
      return;
    }    // Kiểm tra dữ liệu nhập vào có hợp lệ không

    const nextTurn = turn + 1;
    setTurn(nextTurn);    // Tăng số lượt đoán

    if (num < target) {
      setMessage(`Bạn đã đoán: ${num} Quá thấp!`);
      setStatus('wrong');
    } else if (num > target) {
      setMessage(`Bạn đã đoán: ${num} Quá cao!`);
      setStatus('wrong');
    } else {
      // Trường hợp đoán đúng
      setMessage(`Chúc mừng! Bạn đã đoán đúng: ${num}`);
      setStatus('correct');
      setGameOver(true);
      return;
    }    // So sánh số người chơi đoán với số ngẫu nhiên


    if (nextTurn >= MAX_TURN) {
      setMessage(`Hết lượt! Số đúng là ${target}`);
      setStatus('wrong');
      setGameOver(true);
    }    // Nếu đã dùng hết số lượt cho phép

    setGuess('');
  };    // Xóa ô input sau mỗi lần đoán

  return (
    <div className="guess-number">
      <h2>Trò chơi đoán số</h2>

      {/* Hiển thị kết quả đoán (nền đỏ / xanh) */}
      {status !== 'idle' && (
        <div className={`guess-result ${status}`}>
          {message}
        </div>
      )}

      {/* Trạng thái ban đầu */}
      {status === 'idle' && <p>{message}</p>}

      {/* Ô nhập số và nút đoán */}
      <div>
        <input
          type="number"
          value={guess}
          disabled={gameOver}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Nhập số (1–100)"
        />
        <button onClick={handleGuess} disabled={gameOver}>
          Đoán
        </button>
      </div>

      {/* Hiển thị số lượt đã dùng */}
      <div className="attempt">
        Lượt đã dùng: {turn}/{MAX_TURN}
      </div>
    </div>
  );
}
