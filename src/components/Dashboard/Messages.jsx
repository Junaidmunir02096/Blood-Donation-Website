import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPenToSquare,
  faPhone,
  faVideo,
  faEllipsisVertical,
  faFaceSmile,
  faPaperclip,
  faImage,
  faPaperPlane,
  faDownload,
  faFilePdf,
  faCheck,
  faCheckDouble,
  faCircleInfo,
  faDroplet,
} from '@fortawesome/free-solid-svg-icons';
import './Messages.scss';

// ── Seed Data ─────────────────────────────────────────────────────────────────
const initConversations = [
  {
    id: 'conv-1',
    name: 'Dr. Sarah Chen',
    role: 'Hematology Specialist',
    initials: 'SC',
    avatarColor: '#c0392b',
    online: true,
    urgent: true,
    lastMessage: 'Your AB+ request is being processed...',
    timestamp: '10:46 AM',
    messages: [
      {
        id: 'm1', from: 'them', type: 'text',
        text: "Hello! I'm reviewing the emergency request for AB+ blood for the city hospital. Are you currently available to donate?",
        time: '10:42 AM', read: true, date: 'TODAY',
      },
      {
        id: 'm2', from: 'me', type: 'text',
        text: "Yes, Dr. Chen. I am available. I can be at the hospital in about 45 minutes. Is there anything specific I should prepare?",
        time: '10:44 AM', read: true,
      },
      {
        id: 'm3', from: 'them', type: 'text',
        text: "That's wonderful news. We have the requisition ready. Please bring your donor ID card.",
        time: '10:45 AM', read: true,
      },
      {
        id: 'm4', from: 'them', type: 'file',
        fileName: 'Emergency_Requisition_AB.pdf',
        fileSize: '1.2 MB',
        time: '10:45 AM', read: true,
      },
      {
        id: 'm5', from: 'them', type: 'text',
        text: 'Your AB+ request is being processed and your slot is reserved for 11:30 AM.',
        time: '10:46 AM', read: true, divider: 'NEW MESSAGES',
      },
    ],
  },
  {
    id: 'conv-2',
    name: 'Marcus Miller',
    role: 'Blood Donor • O+',
    initials: 'MM',
    avatarColor: '#2c3e50',
    online: false,
    urgent: false,
    lastMessage: 'Thanks for the donor reference!',
    timestamp: 'Yesterday',
    messages: [
      {
        id: 'm1', from: 'them', type: 'text',
        text: 'Hi! I saw your blood request for O+ type. I can help.',
        time: '9:10 AM', read: true, date: 'YESTERDAY',
      },
      {
        id: 'm2', from: 'me', type: 'text',
        text: 'That would be amazing, Marcus. We urgently need it for Metro Hospital.',
        time: '9:15 AM', read: true,
      },
      {
        id: 'm3', from: 'them', type: 'text',
        text: 'Thanks for the donor reference! I will head there first thing in the morning.',
        time: '9:22 AM', read: true,
      },
    ],
  },
  {
    id: 'conv-3',
    name: 'Hospital Central Blood Bank',
    role: 'Blood Bank Coordinator',
    initials: 'HB',
    avatarColor: '#8e44ad',
    online: true,
    urgent: false,
    lastMessage: 'Confirmation of your appointment...',
    timestamp: 'Mon',
    messages: [
      {
        id: 'm1', from: 'them', type: 'text',
        text: 'Good afternoon. This is a confirmation of your appointment scheduled for Monday at 2:00 PM.',
        time: '2:30 PM', read: true, date: 'MONDAY',
      },
      {
        id: 'm2', from: 'me', type: 'text',
        text: 'Thank you! I will be there on time.',
        time: '2:35 PM', read: true,
      },
    ],
  },
  {
    id: 'conv-4',
    name: 'Volunteer Group #42',
    role: 'Group • 8 members',
    initials: 'VG',
    avatarColor: '#16a085',
    online: false,
    isGroup: true,
    urgent: false,
    lastMessage: "Elena: I'll be there by noon.",
    timestamp: 'Oct 12',
    messages: [
      {
        id: 'm1', from: 'them', sender: 'Elena R.', type: 'text',
        text: "Everyone confirmed for Saturday's blood drive at Westside Community Center?",
        time: '10:00 AM', read: true, date: 'OCT 12',
      },
      {
        id: 'm2', from: 'me', type: 'text',
        text: "Yes, I'll be there!",
        time: '10:05 AM', read: true,
      },
      {
        id: 'm3', from: 'them', sender: 'Elena R.', type: 'text',
        text: "I'll be there by noon.",
        time: '10:08 AM', read: true,
      },
    ],
  },
];

// Auto-replies per conversation
const autoReplies = {
  'conv-1': ["Got it! We'll see you at 11:30 AM sharp.", "Please don't eat anything heavy before your appointment."],
  'conv-2': ["Sure, happy to help anytime!", "Let me know if you need any other references."],
  'conv-3': ["Your records have been updated.", "See you on Monday!"],
  'conv-4': ["Great! See you all Saturday 🩸", "Reminder: bring your donor ID cards."],
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatPreview = (msg) =>
  msg.type === 'file' ? `📎 ${msg.fileName}` : msg.text;

// ── Sub-components ────────────────────────────────────────────────────────────
const Avatar = ({ conv, size = 44 }) => (
  <div
    className="msg-avatar"
    style={{ width: size, height: size, background: conv.avatarColor }}
    aria-hidden="true"
  >
    {conv.isGroup
      ? <FontAwesomeIcon icon={faDroplet} style={{ fontSize: size * 0.4 }} />
      : conv.initials}
    {conv.online && <span className="msg-avatar__dot" />}
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const Messages = () => {
  const [conversations, setConversations] = useState(initConversations);
  const [activeId, setActiveId]           = useState('conv-1');
  const [inputText, setInputText]         = useState('');
  const [isTyping, setIsTyping]           = useState(false);
  const [searchQuery, setSearchQuery]     = useState('');
  const messagesEndRef  = useRef(null);
  const inputRef        = useRef(null);
  const typingTimerRef  = useRef(null);

  const activeConv = conversations.find((c) => c.id === activeId);

  // Scroll to bottom whenever messages change or typing changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeId, activeConv?.messages.length, isTyping]);

  // Auto-focus input when switching chats
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeId]);

  const filteredConvs = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg = {
      id: `m${Date.now()}`,
      from: 'me',
      type: 'text',
      text,
      time: timeStr,
      read: false,
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, messages: [...c.messages, newMsg], lastMessage: text, timestamp: timeStr }
          : c
      )
    );
    setInputText('');

    // Typing indicator + auto-reply
    clearTimeout(typingTimerRef.current);
    setIsTyping(true);
    typingTimerRef.current = setTimeout(() => {
      setIsTyping(false);
      const replies = autoReplies[activeId] || ["Thanks for reaching out!"];
      const reply   = replies[Math.floor(Math.random() * replies.length)];
      const replyMsg = {
        id: `m${Date.now() + 1}`,
        from: 'them',
        type: 'text',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: true,
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? { ...c, messages: [...c.messages, replyMsg], lastMessage: reply }
            : c
        )
      );
    }, 1800);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="messages-screen">

      {/* ══ LEFT PANEL ══════════════════════════════════════════════════════ */}
      <aside className="msg-sidebar" aria-label="Recent chats">

        <div className="msg-sidebar__header">
          <h2 className="msg-sidebar__title">Recent Chats</h2>
          <button className="msg-sidebar__compose" type="button" aria-label="New chat">
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </div>

        <div className="msg-sidebar__search-wrap">
          <input
            className="msg-sidebar__search"
            type="search"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search conversations"
          />
        </div>

        <ul className="msg-conv-list" role="list">
          {filteredConvs.map((conv) => (
            <li key={conv.id}>
              <button
                type="button"
                className={`msg-conv-item${activeId === conv.id ? ' msg-conv-item--active' : ''}`}
                onClick={() => setActiveId(conv.id)}
                aria-current={activeId === conv.id ? 'true' : undefined}
              >
                <Avatar conv={conv} size={46} />
                <div className="msg-conv-item__body">
                  <div className="msg-conv-item__top">
                    <span className="msg-conv-item__name">{conv.name}</span>
                    <span className="msg-conv-item__time">{conv.timestamp}</span>
                  </div>
                  <div className="msg-conv-item__bottom">
                    <span className="msg-conv-item__preview">
                      {formatPreview(conv.messages.at(-1))}
                    </span>
                    {conv.urgent && (
                      <span className="msg-conv-item__urgent">URGENT</span>
                    )}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* ══ RIGHT PANEL ═════════════════════════════════════════════════════ */}
      <div className="msg-chat">

        {/* Chat Header */}
        <header className="msg-chat__header">
          <div className="msg-chat__header-info">
            <Avatar conv={activeConv} size={42} />
            <div>
              <p className="msg-chat__name">{activeConv.name}</p>
              <p className="msg-chat__role">
                {activeConv.online && (
                  <span className="msg-chat__online-dot" aria-hidden="true" />
                )}
                {activeConv.online ? 'Online' : 'Offline'}
                {activeConv.role && <span> &bull; {activeConv.role}</span>}
              </p>
            </div>
          </div>
          <div className="msg-chat__header-actions">
            <button type="button" className="msg-chat__icon-btn" aria-label="Voice call">
              <FontAwesomeIcon icon={faPhone} />
            </button>
            <button type="button" className="msg-chat__icon-btn" aria-label="Video call">
              <FontAwesomeIcon icon={faVideo} />
            </button>
            <button type="button" className="msg-chat__icon-btn" aria-label="More options">
              <FontAwesomeIcon icon={faEllipsisVertical} />
            </button>
          </div>
        </header>

        {/* Messages Body */}
        <div className="msg-chat__body" role="log" aria-label="Conversation messages" aria-live="polite">
          {activeConv.messages.map((msg, idx) => (
            <React.Fragment key={msg.id}>
              {/* Date divider */}
              {msg.date && (
                <div className="msg-divider msg-divider--date" role="separator">
                  <span>{msg.date}</span>
                </div>
              )}
              {/* New messages divider */}
              {msg.divider && (
                <div className="msg-divider msg-divider--new" role="separator">
                  <span>{msg.divider}</span>
                </div>
              )}

              <div className={`msg-bubble-row msg-bubble-row--${msg.from}`}>
                {/* Them avatar */}
                {msg.from === 'them' && (
                  <Avatar conv={activeConv} size={32} />
                )}

                <div className={`msg-bubble msg-bubble--${msg.from}`}>
                  {/* Group sender name */}
                  {activeConv.isGroup && msg.from === 'them' && msg.sender && (
                    <p className="msg-bubble__sender">{msg.sender}</p>
                  )}

                  {msg.type === 'text' && (
                    <p className="msg-bubble__text">{msg.text}</p>
                  )}

                  {msg.type === 'file' && (
                    <div className="msg-file">
                      <div className="msg-file__icon">
                        <FontAwesomeIcon icon={faFilePdf} />
                      </div>
                      <div className="msg-file__info">
                        <p className="msg-file__name">{msg.fileName}</p>
                        <p className="msg-file__meta">{msg.fileSize} &bull; Ready to download</p>
                      </div>
                      <button type="button" className="msg-file__download" aria-label={`Download ${msg.fileName}`}>
                        <FontAwesomeIcon icon={faDownload} />
                      </button>
                    </div>
                  )}

                  <div className="msg-bubble__footer">
                    <span className="msg-bubble__time">{msg.time}</span>
                    {msg.from === 'me' && (
                      <span className="msg-bubble__status" aria-label={msg.read ? 'Read' : 'Sent'}>
                        {msg.read
                          ? <><FontAwesomeIcon icon={faCheckDouble} /> Read</>
                          : <FontAwesomeIcon icon={faCheck} />}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="msg-bubble-row msg-bubble-row--them">
              <Avatar conv={activeConv} size={32} />
              <div className="msg-typing" aria-label={`${activeConv.name} is typing`}>
                <span /><span /><span />
                <p className="msg-typing__label">{activeConv.name} is typing...</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Encryption notice */}
        <p className="msg-chat__encrypt">
          <FontAwesomeIcon icon={faCircleInfo} aria-hidden="true" />
          Messages are encrypted for your privacy and security.
        </p>

        {/* Input Bar */}
        <div className="msg-chat__input-bar">
          <button type="button" className="msg-input-icon" aria-label="Add attachment">
            <FontAwesomeIcon icon={faPaperclip} />
          </button>
          <button type="button" className="msg-input-icon" aria-label="Send image">
            <FontAwesomeIcon icon={faImage} />
          </button>

          <div className="msg-input-wrap">
            <textarea
              ref={inputRef}
              className="msg-input"
              rows={1}
              placeholder={`Type a message to ${activeConv.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Message input"
            />
            <button type="button" className="msg-input-icon msg-input-icon--emoji" aria-label="Emoji">
              <FontAwesomeIcon icon={faFaceSmile} />
            </button>
          </div>

          <button
            type="button"
            className="msg-send-btn"
            onClick={handleSend}
            disabled={!inputText.trim()}
            aria-label="Send message"
            id="btn-send-message"
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Messages;
