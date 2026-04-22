import { useState } from "react"; // Import hook useState để lưu trạng thái
import "./index.less"; // Import file CSS giao diện

// Kiểu dữ liệu lựa chọn (chỉ cho phép 3 giá trị)
type Choice = "Búa" | "Kéo" | "Bao";

// Kiểu dữ liệu cho 1 trận đấu trong lịch sử
interface HistoryItem {
  player: Choice;     // Người chơi chọn gì
  computer: Choice;   // Máy chọn gì
  result: string;     // Kết quả trận
}

// Danh sách các lựa chọn
const choices: Choice[] = ["Búa", "Kéo", "Bao"];

export default function RockPaperScissors() {

  // ===== STATE =====

  const [history, setHistory] = useState<HistoryItem[]>([]);
  // Lưu lịch sử các trận đấu (ban đầu rỗng)

  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  // Lưu lựa chọn của người chơi

  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  // Lưu lựa chọn của máy

  const [result, setResult] = useState("");
  // Lưu kết quả trận đấu


  // ===== MÁY CHỌN NGẪU NHIÊN =====
  const getComputerChoice = (): Choice => {
    const randomIndex = Math.floor(Math.random() * 3);
    // random số từ 0 -> 2

    return choices[randomIndex];
    // trả về Búa / Kéo / Bao
  };


  // ===== SO SÁNH KẾT QUẢ =====
  const getResult = (player: Choice, computer: Choice) => {

    if (player === computer)
      return "Hòa"; // nếu giống nhau → hòa

    // Các trường hợp người chơi thắng
    if (
      (player === "Búa" && computer === "Kéo") ||
      (player === "Kéo" && computer === "Bao") ||
      (player === "Bao" && computer === "Búa")
    ) {
      return "Bạn thắng";
    }

    return "Bạn thua"; // còn lại là thua
  };


  // ===== HÀM CHƠI GAME =====
  const playGame = (choice: Choice) => {

    const computer = getComputerChoice();
    // Máy chọn random

    const gameResult = getResult(choice, computer);
    // Tính kết quả

    setPlayerChoice(choice);
    // cập nhật lựa chọn người chơi

    setComputerChoice(computer);
    // cập nhật lựa chọn máy

    setResult(gameResult);
    // cập nhật kết quả

    // Thêm trận mới vào lịch sử
    setHistory([
      {
        player: choice,
        computer,
        result: gameResult,
      },
      ...history, // giữ lại lịch sử cũ
    ]);
  };


  // ===== GIAO DIỆN =====
  return (
    <div className="game">

      <h1>Oẳn Tù Tì</h1>

      {/* ===== NÚT CHỌN ===== */}
      <div className="buttons">
        {choices.map((item) => (
          <button
            key={item}
            onClick={() => playGame(item)} // click → chơi game
          >
            {item}
          </button>
        ))}
      </div>


      {/* ===== HIỂN THỊ KẾT QUẢ ===== */}
      {playerChoice && (
        <div className="result">
          <p>Bạn chọn: {playerChoice}</p>
          <p>Máy chọn: {computerChoice}</p>
          <h2>{result}</h2>
        </div>
      )}


      {/* ===== LỊCH SỬ TRẬN ===== */}
      <h3>Lịch sử trận đấu</h3>

      <ul className="history">
        {history.map((item, index) => (
          <li key={index}>
            Bạn: {item.player} | Máy: {item.computer} -- {item.result}
          </li>
        ))}
      </ul>

    </div>
  );
}