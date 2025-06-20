import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import './CodeRefactorPage.css';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion } from 'framer-motion';

function CodeToolPage() {
  const [code, setCode] = useState('');
  const [selectedAction, setSelectedAction] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('JavaScript');
  const [executionResult, setExecutionResult] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [copiedText, setCopiedText] = useState('');
  const [displayedText, setDisplayedText] = useState('');

  const actions = ['Refactor Code', 'Explain Logic', 'Fix Errors', 'Suggest Improvements', 'Add Comments', 'Optimize Performance'];
  const languages = ['JavaScript', 'TypeScript'];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (aiResult) {
      typeAIResult(aiResult);
    }
  }, [aiResult]);

  const typeAIResult = (text) => {
    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text[i]);
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 10); // typing speed
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 1000);
  };

  const handleGitHubLogin = () => {
    window.location.href = 'http://localhost:2020/auth/github';
  };

  const getLanguageExtension = () => {
    return language === 'TypeScript' ? javascript({ typescript: true }) : javascript();
  };

  const runCodeViaBackend = async (code, language = "javascript") => {
    const response = await axios.post('http://localhost:2020/api/code/run', {
      code,
      language,
      input: '',
    });
    return response.data.output || "No output";
  };

  const executeCode = async () => {
    setExecutionResult('⏳ Running...');
    try {
      const result = await runCodeViaBackend(code, language);
      setExecutionResult(result);
    } catch (err) {
      setExecutionResult(`❌ Error: ${err.message}`);
    }
  };

  const handleAction = async (action) => {
    setSelectedAction(action);
    setDisplayedText('⏳ Thinking...');

    try {
      const response = await axios.post('http://localhost:2020/api/gemini', {
        code,
        action,
        language,
      });

      const raw = response.data.result || 'No response from AI.';
      const final = raw.includes('```') ? raw : `\`\`\`${language.toLowerCase()}\n${raw}\n\`\`\``;

      setAiResult(final);
    } catch (error) {
      setAiResult(`❌ Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const renderAIOutput = (text) => {
    const parts = text.split(/```(?:\w+)?\n([\s\S]*?)```/g);

    return parts.map((part, index) => {
      const isCode = index % 2 === 1;

      if (isCode) {
        const trimmed = part.trim();
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'relative',
              background: '#1e1e1e',
              borderRadius: '10px',
              overflow: 'hidden',
              marginBottom: '20px',
              fontSize: '14px',
            }}
          >
            <SyntaxHighlighter
              language={language.toLowerCase()}
              style={vscDarkPlus}
              customStyle={{
                padding: '16px',
                margin: 0,
                background: '#1e1e1e',
                fontSize: '14px',
              }}
            >
              {trimmed}
            </SyntaxHighlighter>

            <button
              onClick={() => handleCopy(trimmed)}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: '#007acc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 10px',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              {copiedText === trimmed ? '✅ Copied' : '📋 Copy'}
            </button>
          </motion.div>
        );
      } else {
        return (
          <motion.p
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            style={{
              color: '#d4d4d4',
              marginBottom: '12px',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              fontSize: '15px',
            }}
          >
            {part.trim()}
          </motion.p>
        );
      }
    });
  };

  return (
    <div className="tool-container">
      <div className="top-bar">
        <div className="logo">🚀 Code Assistant</div>
        <div className="top-bar-controls">
          <button className="toggle-btn" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          <select className="language-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
            {languages.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>

          <div className="github-login" onClick={handleGitHubLogin}>
            <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" />
            Login with GitHub
          </div>
        </div>
      </div>

      <div className="horizontal-layout">
        <div className="editor-panel">
          <h3>Paste your {language} code below</h3>
          <CodeMirror
            value={code}
            height="400px"
            theme={theme}
            extensions={[getLanguageExtension()]}
            onChange={(value) => {
              setCode(value);
              if (selectedAction) setSelectedAction(null);
              setExecutionResult('');
            }}
          />

          <button className="execute-btn" onClick={executeCode}>▶️ Execute Code</button>

          {executionResult && (
            <div className="execution-result">
              <strong>Output:</strong>
              <pre>{executionResult}</pre>
            </div>
          )}
        </div>

        <div className="right-panel">
          {code.trim() && (
            <div className="action-buttons">
              <p>What would you like to do?</p>
              {actions.map((action) => (
                <button
                  key={action}
                  onClick={() => handleAction(action)}
                  className={`action ${selectedAction === action ? 'active' : ''}`}
                >
                  {action}
                </button>
              ))}
            </div>
          )}

          {selectedAction && displayedText && (
            <div className="output-box" style={{ padding: '16px', background: '#111', borderRadius: '10px', marginTop: '16px' }}>
              {renderAIOutput(displayedText)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CodeToolPage;
