import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/modules/ChatPage.module.css';
const backArrowImg = '/img/Rectangle 42215.svg';
const settingIconImg = '/img/setting_icon.svg';
const sendButtonImg = '/img/send-button.png';

function ChatPage() {
  const navigate = useNavigate();
  const textareaRef = useRef(null);
  const chatRef = useRef(null);

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

  const handleBackClick = (e) => {
    e.preventDefault();
    navigate('/agents_list');
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    navigate('/profile');
  };

  return (
    <div className={`${styles.body} ${styles.chatPage}`}>
      <nav className={styles.navbar}>
        <div className="container-fluid d-flex justify-content-between px-0 align-items-center">
          <a className={styles.prev} href="#" onClick={handleBackClick}>
            <img src={backArrowImg} alt="назад" />
          </a>
          <div style={{ fontWeight: 500, color: '#BEBEBE', fontSize: '16px' }}>СЕРГЕЙ</div>
          <a className={styles.navbarAccount} href="#" onClick={handleProfileClick}>
            <div className={styles.accountIcon}>
              <img src={settingIconImg} alt="настройки" />
            </div>
          </a>
        </div>
      </nav>

      <div className={styles.glow}></div>

      <main id="chat" ref={chatRef}>
        <div className={`${styles.message} ${styles.incoming}`}>
          Добрый день! Готов помочь вам продвинуться в развитии бизнеса. С чем хотите поработать сегодня? 😊
          <div className={styles.messageTime}>12:34</div>
        </div>

        <div className={`${styles.message} ${styles.outgoing}`}>
          Привет! Думаю над масштабированием проекта, но пока не уверен, с чего лучше начать.
          <div className={styles.messageTime}>12:36</div>
        </div>

        <div className={`${styles.message} ${styles.incoming}`}>
          Отличная цель! Давайте для начала определим, какие каналы привлечения клиентов работают у вас сейчас
          лучше
          всего.
          <div className={styles.messageTime}>12:37</div>
        </div>

        <div className={`${styles.message} ${styles.outgoing}`}>
          В основном это сарафанное радио и немного контекстной рекламы. Но хочется выйти на новый уровень.
          <div className={styles.messageTime}>12:39</div>
        </div>

        <div className={`${styles.message} ${styles.incoming}`}>
          Понимаю. Тогда предлагаю рассмотреть стратегию контент-маркетинга и усиление присутствия в социальных
          сетях.
          Это поможет привлечь более широкую аудиторию.
          <div className={styles.messageTime}>12:41</div>
        </div>

        <div className={`${styles.message} ${styles.outgoing}`}>
          Звучит интересно, но у нас нет ресурсов для создания большого количества контента.
          <div className={styles.messageTime}>12:43</div>
        </div>

        <div className={`${styles.message} ${styles.incoming}`}>
          Это распространённая ситуация. Начнем с малого: можно адаптировать уже имеющиеся у вас материалы и
          сделать
          фокус на качестве, а не на количестве.
          <div className={styles.messageTime}>12:45</div>
        </div>

        <div className={`${styles.message} ${styles.outgoing}`}>
          Хорошо, давайте попробуем. С чего посоветуете начать конкретно на этой неделе?
          <div className={styles.messageTime}>12:46</div>
        </div>

        <div className={`${styles.message} ${styles.incoming}`}>
          Составьте список часто задаваемых вопросов от ваших клиентов. Ответы на них станут отличной базой для
          первых
          полезных постов.
          <div className={styles.messageTime}>12:48</div>
        </div>

        <div className={`${styles.message} ${styles.outgoing}`}>
          Отличная идея! Так и сделаю. Спасибо за конкретный совет! 👍
          <div className={styles.messageTime}>12:50</div>
        </div>

        <div className={`${styles.message} ${styles.incoming}`}>
          <div className={styles.typingIndicator}>
            <span className={styles.dots}>
              <span></span><span></span><span></span>
            </span>
            печатает
          </div>
        </div>
      </main>

      <div className={styles.glowBottom}></div>

      <div className={styles.formBlock}>
        <div className={styles.blockQuestionField}>
          <textarea className={styles.questionField} placeholder="Задайте свой вопрос..." rows="1" ref={textareaRef}></textarea>
        </div>
        <div className={styles.blockButtonSend}>
          <img src={sendButtonImg} alt="Отправить" />
        </div>
      </div>
    </div>
  );
}

export default ChatPage;

