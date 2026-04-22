import React, { useState } from 'react';
import './index.less';

// ---------- Interfaces ----------
interface KnowledgeBlock {
  id: string;
  name: string;
}

interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
}

interface Question {
  id: string;
  code: string;
  subjectId: string;
  content: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Khó' | 'Rất khó';
  knowledgeBlockId: string;
}

interface ExamStructure {
  id: string;
  name: string;
  subjectId: string;
  requirements: Requirement[];
}

interface Requirement {
  knowledgeBlockId: string;
  easy: number;
  medium: number;
  hard: number;
  veryHard: number;
}

interface Exam {
  id: string;
  name: string;
  subjectId: string;
  structureId?: string;
  questions: Question[]; // lưu toàn bộ câu hỏi đã chọn
}

// ---------- Mock Initial Data ----------
const initialKnowledgeBlocks: KnowledgeBlock[] = [
  { id: 'kb1', name: 'Tổng quan' },
  { id: 'kb2', name: 'Chuyên sâu' },
  { id: 'kb3', name: 'Thực hành' },
];

const initialSubjects: Subject[] = [
  { id: 'sub1', code: 'MATH101', name: 'Toán cao cấp', credits: 3 },
  { id: 'sub2', code: 'PROG201', name: 'Lập trình cơ bản', credits: 4 },
];

const initialQuestions: Question[] = [
  {
    id: 'q1',
    code: 'MATH101_01',
    subjectId: 'sub1',
    content: 'Trình bày định nghĩa đạo hàm?',
    difficulty: 'Dễ',
    knowledgeBlockId: 'kb1',
  },
  {
    id: 'q2',
    code: 'MATH101_02',
    subjectId: 'sub1',
    content: 'Giải thích ý nghĩa hình học của tích phân?',
    difficulty: 'Trung bình',
    knowledgeBlockId: 'kb2',
  },
  {
    id: 'q3',
    code: 'PROG201_01',
    subjectId: 'sub2',
    content: 'Viết chương trình Hello World bằng C?',
    difficulty: 'Dễ',
    knowledgeBlockId: 'kb1',
  },
  {
    id: 'q4',
    code: 'PROG201_02',
    subjectId: 'sub2',
    content: 'Giải thích con trỏ trong C?',
    difficulty: 'Khó',
    knowledgeBlockId: 'kb3',
  },
];

// ---------- Main Component ----------
const NganHangCauHoi: React.FC = () => {
  // State
  const [knowledgeBlocks, setKnowledgeBlocks] = useState<KnowledgeBlock[]>(initialKnowledgeBlocks);
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [examStructures, setExamStructures] = useState<ExamStructure[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);

  // UI state
  const [activeTab, setActiveTab] = useState<'knowledge' | 'subjects' | 'questions' | 'createExam' | 'structures' | 'exams'>('knowledge');
  const [filterSubject, setFilterSubject] = useState<string>('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('');
  const [filterKnowledgeBlock, setFilterKnowledgeBlock] = useState<string>('');

  // Form states for adding/editing (simplified)
  const [newKbName, setNewKbName] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCredits, setNewSubjectCredits] = useState(3);
  const [newQuestionCode, setNewQuestionCode] = useState('');
  const [newQuestionContent, setNewQuestionContent] = useState('');
  const [newQuestionSubject, setNewQuestionSubject] = useState('');
  const [newQuestionDifficulty, setNewQuestionDifficulty] = useState<Question['difficulty']>('Dễ');
  const [newQuestionKb, setNewQuestionKb] = useState('');

  // Exam generation state
  const [selectedSubjectForExam, setSelectedSubjectForExam] = useState('');
  const [structureName, setStructureName] = useState('');
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [generatedExam, setGeneratedExam] = useState<Question[] | null>(null);
  const [generationError, setGenerationError] = useState('');

  // Helper: generate unique id
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // ---------- Knowledge Block CRUD ----------
  const addKnowledgeBlock = () => {
    if (!newKbName.trim()) return;
    setKnowledgeBlocks([...knowledgeBlocks, { id: generateId(), name: newKbName }]);
    setNewKbName('');
  };

  const deleteKnowledgeBlock = (id: string) => {
    setKnowledgeBlocks(knowledgeBlocks.filter(kb => kb.id !== id));
    // also remove from questions? For simplicity, we don't cascade.
  };

  // ---------- Subject CRUD ----------
  const addSubject = () => {
    if (!newSubjectCode.trim() || !newSubjectName.trim()) return;
    setSubjects([...subjects, { id: generateId(), code: newSubjectCode, name: newSubjectName, credits: newSubjectCredits }]);
    setNewSubjectCode('');
    setNewSubjectName('');
    setNewSubjectCredits(3);
  };

  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  // ---------- Question CRUD ----------
  const addQuestion = () => {
    if (!newQuestionCode.trim() || !newQuestionContent.trim() || !newQuestionSubject || !newQuestionKb) return;
    setQuestions([...questions, {
      id: generateId(),
      code: newQuestionCode,
      subjectId: newQuestionSubject,
      content: newQuestionContent,
      difficulty: newQuestionDifficulty,
      knowledgeBlockId: newQuestionKb,
    }]);
    setNewQuestionCode('');
    setNewQuestionContent('');
    setNewQuestionSubject('');
    setNewQuestionDifficulty('Dễ');
    setNewQuestionKb('');
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  // Filtered questions
  const filteredQuestions = questions.filter(q => {
    return (!filterSubject || q.subjectId === filterSubject) &&
           (!filterDifficulty || q.difficulty === filterDifficulty) &&
           (!filterKnowledgeBlock || q.knowledgeBlockId === filterKnowledgeBlock);
  });

  // ---------- Exam Generation ----------
  const prepareRequirements = () => {
    // Initialize requirements for all knowledge blocks with zeros
    const reqs: Requirement[] = knowledgeBlocks.map(kb => ({
      knowledgeBlockId: kb.id,
      easy: 0,
      medium: 0,
      hard: 0,
      veryHard: 0,
    }));
    setRequirements(reqs);
  };

  const updateRequirement = (kbId: string, difficulty: keyof Omit<Requirement, 'knowledgeBlockId'>, value: number) => {
    setRequirements(reqs => reqs.map(r => r.knowledgeBlockId === kbId ? { ...r, [difficulty]: value } : r));
  };

  const generateExam = () => {
    setGenerationError('');
    if (!selectedSubjectForExam) {
      setGenerationError('Vui lòng chọn môn học.');
      return;
    }
    // Collect required counts
    const required: { kbId: string; difficulty: string; count: number }[] = [];
    requirements.forEach(r => {
      if (r.easy > 0) required.push({ kbId: r.knowledgeBlockId, difficulty: 'Dễ', count: r.easy });
      if (r.medium > 0) required.push({ kbId: r.knowledgeBlockId, difficulty: 'Trung bình', count: r.medium });
      if (r.hard > 0) required.push({ kbId: r.knowledgeBlockId, difficulty: 'Khó', count: r.hard });
      if (r.veryHard > 0) required.push({ kbId: r.knowledgeBlockId, difficulty: 'Rất khó', count: r.veryHard });
    });

    if (required.length === 0) {
      setGenerationError('Vui lòng nhập số lượng câu hỏi yêu cầu.');
      return;
    }

    // Check availability
    const selectedQuestions: Question[] = [];
    for (let req of required) {
      const pool = questions.filter(q => 
        q.subjectId === selectedSubjectForExam &&
        q.knowledgeBlockId === req.kbId &&
        q.difficulty === req.difficulty
      );
      if (pool.length < req.count) {
        const kb = knowledgeBlocks.find(k => k.id === req.kbId)?.name || req.kbId;
        setGenerationError(`Không đủ câu hỏi cho khối "${kb}", độ khó "${req.difficulty}". Yêu cầu ${req.count}, chỉ có ${pool.length}.`);
        return;
      }
      // Randomly select
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      selectedQuestions.push(...shuffled.slice(0, req.count));
    }
    setGeneratedExam(selectedQuestions);
  };

  const saveStructure = () => {
    if (!structureName.trim() || !selectedSubjectForExam) return;
    const newStructure: ExamStructure = {
      id: generateId(),
      name: structureName,
      subjectId: selectedSubjectForExam,
      requirements: requirements.map(r => ({ ...r })), // copy
    };
    setExamStructures([...examStructures, newStructure]);
    setStructureName('');
  };

  const saveExam = () => {
    if (!generatedExam || generatedExam.length === 0) return;
    const examName = prompt('Nhập tên đề thi:', `Đề thi ${new Date().toLocaleString()}`);
    if (!examName) return;
    const newExam: Exam = {
      id: generateId(),
      name: examName,
      subjectId: selectedSubjectForExam,
      questions: generatedExam,
    };
    setExams([...exams, newExam]);
    alert('Đã lưu đề thi!');
  };

  const loadStructure = (structure: ExamStructure) => {
    setSelectedSubjectForExam(structure.subjectId);
    setRequirements(structure.requirements);
    setStructureName(structure.name);
    setActiveTab('createExam');
  };

  // ---------- Render ----------
  return (
    <div className="question-bank-manager">
      <h1>Hệ thống quản lý ngân hàng câu hỏi tự luận</h1>
      <div className="tabs">
        <button className={activeTab === 'knowledge' ? 'active' : ''} onClick={() => setActiveTab('knowledge')}>Khối kiến thức</button>
        <button className={activeTab === 'subjects' ? 'active' : ''} onClick={() => setActiveTab('subjects')}>Môn học</button>
        <button className={activeTab === 'questions' ? 'active' : ''} onClick={() => setActiveTab('questions')}>Câu hỏi</button>
        <button className={activeTab === 'createExam' ? 'active' : ''} onClick={() => { setActiveTab('createExam'); prepareRequirements(); }}>Tạo đề thi</button>
        <button className={activeTab === 'structures' ? 'active' : ''} onClick={() => setActiveTab('structures')}>Cấu trúc đề</button>
        <button className={activeTab === 'exams' ? 'active' : ''} onClick={() => setActiveTab('exams')}>Đề thi đã lưu</button>
      </div>

      <div className="tab-content">
        {/* Khối kiến thức */}
        {activeTab === 'knowledge' && (
          <div className="knowledge-section">
            <h2>Quản lý khối kiến thức</h2>
            <div className="add-form">
              <input type="text" placeholder="Tên khối kiến thức" value={newKbName} onChange={e => setNewKbName(e.target.value)} />
              <button onClick={addKnowledgeBlock}>Thêm</button>
            </div>
            <ul>
              {knowledgeBlocks.map(kb => (
                <li key={kb.id}>
                  {kb.name}
                  <button onClick={() => deleteKnowledgeBlock(kb.id)}>Xóa</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Môn học */}
        {activeTab === 'subjects' && (
          <div className="subjects-section">
            <h2>Quản lý môn học</h2>
            <div className="add-form">
              <input type="text" placeholder="Mã môn" value={newSubjectCode} onChange={e => setNewSubjectCode(e.target.value)} />
              <input type="text" placeholder="Tên môn" value={newSubjectName} onChange={e => setNewSubjectName(e.target.value)} />
              <input type="number" placeholder="Số tín chỉ" value={newSubjectCredits} onChange={e => setNewSubjectCredits(parseInt(e.target.value) || 0)} />
              <button onClick={addSubject}>Thêm</button>
            </div>
            <ul>
              {subjects.map(s => (
                <li key={s.id}>
                  {s.code} - {s.name} ({s.credits} tín chỉ)
                  <button onClick={() => deleteSubject(s.id)}>Xóa</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Câu hỏi */}
        {activeTab === 'questions' && (
          <div className="questions-section">
            <h2>Quản lý câu hỏi</h2>
            <div className="filters">
              <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)}>
                <option value="">Tất cả môn</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <select value={filterDifficulty} onChange={e => setFilterDifficulty(e.target.value)}>
                <option value="">Tất cả độ khó</option>
                <option value="Dễ">Dễ</option>
                <option value="Trung bình">Trung bình</option>
                <option value="Khó">Khó</option>
                <option value="Rất khó">Rất khó</option>
              </select>
              <select value={filterKnowledgeBlock} onChange={e => setFilterKnowledgeBlock(e.target.value)}>
                <option value="">Tất cả khối</option>
                {knowledgeBlocks.map(kb => <option key={kb.id} value={kb.id}>{kb.name}</option>)}
              </select>
            </div>
            <div className="add-form">
              <input type="text" placeholder="Mã câu hỏi" value={newQuestionCode} onChange={e => setNewQuestionCode(e.target.value)} />
              <input type="text" placeholder="Nội dung" value={newQuestionContent} onChange={e => setNewQuestionContent(e.target.value)} />
              <select value={newQuestionSubject} onChange={e => setNewQuestionSubject(e.target.value)}>
                <option value="">Chọn môn</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <select value={newQuestionDifficulty} onChange={e => setNewQuestionDifficulty(e.target.value as Question['difficulty'])}>
                <option value="Dễ">Dễ</option>
                <option value="Trung bình">Trung bình</option>
                <option value="Khó">Khó</option>
                <option value="Rất khó">Rất khó</option>
              </select>
              <select value={newQuestionKb} onChange={e => setNewQuestionKb(e.target.value)}>
                <option value="">Chọn khối</option>
                {knowledgeBlocks.map(kb => <option key={kb.id} value={kb.id}>{kb.name}</option>)}
              </select>
              <button onClick={addQuestion}>Thêm</button>
            </div>
            <table className="question-table">
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Nội dung</th>
                  <th>Môn</th>
                  <th>Độ khó</th>
                  <th>Khối</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuestions.map(q => (
                  <tr key={q.id}>
                    <td>{q.code}</td>
                    <td>{q.content}</td>
                    <td>{subjects.find(s => s.id === q.subjectId)?.name}</td>
                    <td>{q.difficulty}</td>
                    <td>{knowledgeBlocks.find(k => k.id === q.knowledgeBlockId)?.name}</td>
                    <td><button onClick={() => deleteQuestion(q.id)}>Xóa</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tạo đề thi */}
        {activeTab === 'createExam' && (
          <div className="create-exam-section">
            <h2>Tạo đề thi</h2>
            <div className="exam-form">
              <label>Chọn môn học:
                <select value={selectedSubjectForExam} onChange={e => setSelectedSubjectForExam(e.target.value)}>
                  <option value="">-- Chọn môn --</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </label>
              {selectedSubjectForExam && (
                <div className="requirements-table">
                  <h3>Yêu cầu số lượng câu hỏi</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Khối kiến thức</th>
                        <th>Dễ</th>
                        <th>Trung bình</th>
                        <th>Khó</th>
                        <th>Rất khó</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requirements.map(req => {
                        const kb = knowledgeBlocks.find(k => k.id === req.knowledgeBlockId);
                        return (
                          <tr key={req.knowledgeBlockId}>
                            <td>{kb?.name}</td>
                            <td><input type="number" min="0" value={req.easy} onChange={e => updateRequirement(req.knowledgeBlockId, 'easy', parseInt(e.target.value) || 0)} /></td>
                            <td><input type="number" min="0" value={req.medium} onChange={e => updateRequirement(req.knowledgeBlockId, 'medium', parseInt(e.target.value) || 0)} /></td>
                            <td><input type="number" min="0" value={req.hard} onChange={e => updateRequirement(req.knowledgeBlockId, 'hard', parseInt(e.target.value) || 0)} /></td>
                            <td><input type="number" min="0" value={req.veryHard} onChange={e => updateRequirement(req.knowledgeBlockId, 'veryHard', parseInt(e.target.value) || 0)} /></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="actions">
                    <button onClick={generateExam}>Tạo đề thi</button>
                    <div className="save-structure">
                      <input type="text" placeholder="Tên cấu trúc" value={structureName} onChange={e => setStructureName(e.target.value)} />
                      <button onClick={saveStructure}>Lưu cấu trúc</button>
                    </div>
                  </div>
                  {generationError && <p className="error">{generationError}</p>}
                  {generatedExam && generatedExam.length > 0 && (
                    <div className="generated-exam">
                      <h4>Đề thi đã tạo:</h4>
                      <ul>
                        {generatedExam.map(q => (
                          <li key={q.id}>{q.code} - {q.content} ({q.difficulty})</li>
                        ))}
                      </ul>
                      <button onClick={saveExam}>Lưu đề thi</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cấu trúc đề thi */}
        {activeTab === 'structures' && (
          <div className="structures-section">
            <h2>Cấu trúc đề thi đã lưu</h2>
            {examStructures.length === 0 ? <p>Chưa có cấu trúc nào.</p> : (
              <ul>
                {examStructures.map(es => {
                  const subject = subjects.find(s => s.id === es.subjectId);
                  return (
                    <li key={es.id}>
                      <strong>{es.name}</strong> (Môn: {subject?.name})<br />
                      <button onClick={() => loadStructure(es)}>Sử dụng</button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {/* Đề thi đã lưu */}
        {activeTab === 'exams' && (
          <div className="exams-section">
            <h2>Đề thi đã lưu</h2>
            {exams.length === 0 ? <p>Chưa có đề thi nào.</p> : (
              <ul>
                {exams.map(ex => {
                  const subject = subjects.find(s => s.id === ex.subjectId);
                  return (
                    <li key={ex.id}>
                      <strong>{ex.name}</strong> (Môn: {subject?.name}) - {ex.questions.length} câu
                      <button onClick={() => { setGeneratedExam(ex.questions); setActiveTab('createExam'); }}>Xem</button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


export default NganHangCauHoi