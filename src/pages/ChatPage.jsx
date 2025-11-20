import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../css/modules/ChatPage.module.css';
import Spinner from '../components/Spinner';
import { usePageLoader } from '../hooks/usePageLoader';
const backArrowImg = '/img/Rectangle 42215.svg';
const settingIconImg = '/img/setting_icon.svg';
const sendButtonImg = '/img/send-button.png';

// Конфигурация webhook'ов для каждого агента
const WEBHOOKS = {
  lida: 'https://n8n-assistant-ivanostapchuk.amvera.io/webhook/lida',
  mark: 'https://n8n-assistant-ivanostapchuk.amvera.io/webhook/mark',
  nick: 'https://n8n-assistant-ivanostapchuk.amvera.io/webhook/nick',
  sergey: 'https://n8n-assistant-ivanostapchuk.amvera.io/webhook/sergey'
};

function ChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const textareaRef = useRef(null);
  const chatRef = useRef(null);
  
  // Получаем информацию об агенте из location state или используем значения по умолчанию
  const agentInfo = location.state || { agent: 'sergey', agentName: 'СЕРГЕЙ' };
  const { agent, agentName } = agentInfo;
  
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const isPageLoading = usePageLoader(500);

  useEffect(() => {
    const textarea = textareaRef.current;
    const chat = chatRef.current;

    if (!textarea || !chat) return;

    const scrollToBottom = () => {
      chat.scrollTop = chat.scrollHeight;
    };

    const adjustHeight = () => {
      textarea.style.height = 'auto';
      const newHeight = textarea.scrollHeight;

      if (newHeight > 140) {
        textarea.style.overflowY = 'auto';
        textarea.style.height = '140px';
      } else {
        textarea.style.overflowY = 'hidden';
        textarea.style.height = newHeight + 'px';
      }
    };

    // Event listeners
    window.addEventListener('load', scrollToBottom);
    textarea.addEventListener('input', adjustHeight);
    textarea.addEventListener('focus', scrollToBottom);

    // MutationObserver for new messages
    const observer = new MutationObserver(scrollToBottom);
    observer.observe(chat, {
      childList: true,
      subtree: true
    });

    // Initial adjustments
    adjustHeight();
    scrollToBottom();

    return () => {
      window.removeEventListener('load', scrollToBottom);
      textarea.removeEventListener('input', adjustHeight);
      textarea.removeEventListener('focus', scrollToBottom);
      observer.disconnect();
    };
  }, []);

  // Автопрокрутка при добавлении новых сообщений
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleBackClick = (e) => {
    e.preventDefault();
    navigate('/agents_list');
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    navigate('/profile');
  };

  const formatTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const sendMessage = async () => {
    const messageText = inputValue.trim();
    if (!messageText || isLoading) return;

    const userMessage = {
      text: messageText,
      type: 'outgoing',
      time: formatTime()
    };

    // Добавляем сообщение пользователя
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Очищаем textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Показываем индикатор загрузки
    setIsLoading(true);

    try {
      const webhookUrl = WEBHOOKS[agent];
      if (!webhookUrl) {
        throw new Error('Неизвестный агент');
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText
        })
      });

      if (!response.ok) {
        throw new Error('Ошибка при отправке сообщения');
      }

      const data = await response.json();
      const aiResponse = {
        text: data.output || 'Извините, не удалось получить ответ',
        type: 'incoming',
        time: formatTime()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
      const errorMessage = {
        text: 'Извините, произошла ошибка при отправке сообщения. Попробуйте еще раз.',
        type: 'incoming',
        time: formatTime()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendClick = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  if (isPageLoading) {
    return <Spinner />;
  }

  return (
    <div className={`${styles.body} ${styles.chatPage}`}>
      <nav className={styles.navbar}>
        <div className="container-fluid d-flex justify-content-between px-0 align-items-center">
          <a className={styles.prev} href="#" onClick={handleBackClick}>
            <img src={backArrowImg} alt="назад" />
          </a>
          <div style={{ fontWeight: 500, color: '#BEBEBE', fontSize: '16px' }}>{agentName}</div>
          <a className={styles.navbarAccount} href="#" onClick={handleProfileClick}>
            <div className={styles.accountIcon}>
              <img src={settingIconImg} alt="настройки" />
            </div>
          </a>
        </div>
      </nav>

      <div className={styles.glow}></div>

      <main id="chat" ref={chatRef}>
        {messages.length === 0 && (
          <div className={`${styles.message} ${styles.incoming}`}>
            Добрый день! Готов помочь вам. С чем хотите поработать сегодня? 😊
            <div className={styles.messageTime}>{formatTime()}</div>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div key={index} className={`${styles.message} ${message.type === 'incoming' ? styles.incoming : styles.outgoing}`}>
            {message.text}
            <div className={styles.messageTime}>{message.time}</div>
          </div>
        ))}

        {isLoading && (
          <div className={`${styles.message} ${styles.incoming}`}>
            <div className={styles.typingIndicator}>
              <span className={styles.dots}>
                <span></span><span></span><span></span>
              </span>
              печатает
            </div>
          </div>
        )}
      </main>

      <div className={styles.glowBottom}></div>

      <div className={styles.formBlock}>
        <div className={styles.blockQuestionField}>
          <textarea 
            className={styles.questionField} 
            placeholder="Задайте свой вопрос..." 
            rows="1" 
            ref={textareaRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          ></textarea>
        </div>
        <div className={styles.blockButtonSend} onClick={handleSendClick}>
          <img src={sendButtonImg} alt="Отправить" />
        </div>
      </div>
    </div>
  );
}

export default ChatPage;

