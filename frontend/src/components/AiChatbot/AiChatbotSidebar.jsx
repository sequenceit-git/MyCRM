import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, Tag, Tooltip, Avatar, Spin, message, Drawer } from 'antd';
import {
  SendOutlined,
  CloseOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  ClearOutlined,
  CopyOutlined,
  PieChartOutlined,
  ContainerOutlined,
  FilterOutlined,
  CustomerServiceOutlined,
  FileSyncOutlined,
  WalletOutlined,
  ShoppingCartOutlined,
  TagOutlined,
  CheckOutlined,
  UserOutlined,
  ShopOutlined,
  CreditCardOutlined,
  ThunderboltOutlined,
  FileOutlined,
  TagsOutlined,
  ScheduleOutlined,
  LeftOutlined,
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useSelector } from 'react-redux';
import { selectAiSettings } from '@/redux/settings/selectors';
import logoIcon from '@/style/images/logo-icon.svg';
import { request } from '@/request';
import { useAppContext } from '@/context/appContext';
import useResponsive from '@/hooks/useResponsive';

const STORAGE_KEY = 'mycrm_ai_chat_state_v2';

// Icon Map translating Unicode emoji/tokens to crisp SVG Ant Design Icons
const ICON_MAP = {
  '📊': <PieChartOutlined style={{ color: '#1677ff', marginRight: '6px', fontSize: '15px' }} />,
  '📄': <ContainerOutlined style={{ color: '#13c2c2', marginRight: '6px', fontSize: '15px' }} />,
  '🎯': <FilterOutlined style={{ color: '#fa8c16', marginRight: '6px', fontSize: '15px' }} />,
  '👥': <CustomerServiceOutlined style={{ color: '#722ed1', marginRight: '6px', fontSize: '15px' }} />,
  '👤': <UserOutlined style={{ color: '#1677ff', marginRight: '6px', fontSize: '15px' }} />,
  '🏢': <ShopOutlined style={{ color: '#1890ff', marginRight: '6px', fontSize: '15px' }} />,
  '🏛️': <ShopOutlined style={{ color: '#52c41a', marginRight: '6px', fontSize: '15px' }} />,
  '📝': <FileSyncOutlined style={{ color: '#2f54eb', marginRight: '6px', fontSize: '15px' }} />,
  '💸': <WalletOutlined style={{ color: '#eb2f96', marginRight: '6px', fontSize: '15px' }} />,
  '💳': <CreditCardOutlined style={{ color: '#52c41a', marginRight: '6px', fontSize: '15px' }} />,
  '🛒': <ShoppingCartOutlined style={{ color: '#fa541c', marginRight: '6px', fontSize: '15px' }} />,
  '🏷️': <TagOutlined style={{ color: '#faad14', marginRight: '6px', fontSize: '15px' }} />,
  '📦': <TagsOutlined style={{ color: '#722ed1', marginRight: '6px', fontSize: '15px' }} />,
  '📋': <FileOutlined style={{ color: '#13c2c2', marginRight: '6px', fontSize: '15px' }} />,
  '📑': <ScheduleOutlined style={{ color: '#eb2f96', marginRight: '6px', fontSize: '15px' }} />,
  '📈': <PieChartOutlined style={{ color: '#52c41a', marginRight: '6px', fontSize: '15px' }} />,
  '🔴': <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#ff4d4f', marginRight: '6px' }} />,
  '🟢': <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#52c41a', marginRight: '6px' }} />,
  '⚡': <ThunderboltOutlined style={{ color: '#faad14', marginRight: '6px', fontSize: '14px' }} />,
};

// Helper: Replace emojis in strings with React SVG icon elements
function renderWithAppIcons(children) {
  if (typeof children === 'string') {
    const keys = Object.keys(ICON_MAP);
    const regex = new RegExp(`(${keys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');
    const parts = children.split(regex);

    if (parts.length === 1) return children;

    return parts.map((part, index) => {
      if (ICON_MAP[part]) {
        return <React.Fragment key={index}>{ICON_MAP[part]}</React.Fragment>;
      }
      return part;
    });
  }

  if (Array.isArray(children)) {
    return children.map((child, i) => (
      <React.Fragment key={i}>{renderWithAppIcons(child)}</React.Fragment>
    ));
  }

  return children;
}

const defaultWelcomeMessage = {
  id: 'welcome',
  role: 'assistant',
  content: `**Welcome to MyCRM AI Copilot!**\n\nI have real-time access to your CRM/ERP data. You can ask me to:\n- 📊 "Show financial summary & revenue"\n- 📄 "List all unpaid invoices"\n- 🎯 "Show active leads pipeline"\n- 👥 "List our clients and contacts"\n- 📝 "Show recent quotes"\n- 💸 "List operating expenses"`,
  actions: [],
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

export default function AiChatbotSidebar() {
  const { state: stateApp, appContextAction } = useAppContext();
  const isOpen = stateApp?.isAiSidebarOpen ?? false;
  const { isMobile } = useResponsive();
  const aiSettings = useSelector(selectAiSettings);

  const localModel = localStorage.getItem('mycrm_local_ai_model');
  const localCustomModel = localStorage.getItem('mycrm_local_custom_ai_model');
  const isGuestMode = sessionStorage.getItem('isGuestMode') === 'true';

  const activeModel = isGuestMode && localModel
    ? (localModel === 'custom' ? localCustomModel || 'Custom' : localModel)
    : (aiSettings?.ai_model === 'custom'
        ? (aiSettings?.custom_ai_model || 'Custom')
        : (aiSettings?.ai_model || localModel || 'GPT-4o Mini'));

  const getInitialMessages = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.messages?.length) return parsed.messages;
      }
    } catch (e) {
      console.warn('Could not read AI chat messages from localStorage:', e);
    }
    return [defaultWelcomeMessage];
  };

  const getInitialWidth = () => {
    try {
      const saved = localStorage.getItem('mycrm_ai_sidebar_width');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 340 && parsed <= 1200) {
          return parsed;
        }
      }
    } catch (e) {}
    return 400;
  };

  const [customWidth, setCustomWidth] = useState(getInitialWidth);
  const [isDragging, setIsDragging] = useState(false);
  const isResizingRef = useRef(false);

  const [messages, setMessages] = useState(getInitialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const messagesEndRef = useRef(null);

  // Mouse Drag to Resize from Left Edge
  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    isResizingRef.current = true;
    setIsDragging(true);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizingRef.current) return;
      const newWidth = window.innerWidth - e.clientX;
      const minWidth = 340;
      const maxWidth = Math.max(minWidth, Math.min(window.innerWidth - 60, 1100));
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setCustomWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      if (isResizingRef.current) {
        isResizingRef.current = false;
        setIsDragging(false);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
        setCustomWidth((curr) => {
          localStorage.setItem('mycrm_ai_sidebar_width', curr.toString());
          return curr;
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, []);

  // Persist messages to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages: messages.slice(-25) }));
    } catch (e) {
      console.warn('Could not save AI chat state:', e);
    }
  }, [messages]);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  const handleClose = () => {
    appContextAction.aiSidebar.close();
  };

  const handleToggle = () => {
    appContextAction.aiSidebar.toggle();
  };

  // Send Message
  const handleSendMessage = async (customText) => {
    const queryText = (customText || inputValue).trim();
    if (!queryText || isLoading) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: queryText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const history = messages.slice(-5).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const localApiKey = localStorage.getItem('mycrm_local_openai_key');
      const localModelChoice = localStorage.getItem('mycrm_local_ai_model');
      const localCustomModelChoice = localStorage.getItem('mycrm_local_custom_ai_model');

      const res = await request.post({
        entity: 'ai/chat',
        jsonData: {
          message: queryText,
          conversationHistory: history,
          clientApiKey: localApiKey || undefined,
          clientModel: localModelChoice || undefined,
          clientCustomModel: localCustomModelChoice || undefined,
        },
      });

      if (res?.success) {
        const assistantMsg = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: res.reply || 'Action completed.',
          actions: res.actionsTaken || [],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `⚠️ ${res?.message || 'Failed to process request.'}`,
            actions: [],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `❌ **Error**: ${err?.response?.data?.message || err.message}`,
          actions: [],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyMessage = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    message.success('Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: '💬 Chat history cleared. What would you like to explore in your CRM/ERP?',
        actions: [],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Quick Action Prompts with App Icons
  const quickPrompts = [
    { label: 'Financial Summary', icon: <PieChartOutlined style={{ color: '#1677ff' }} />, prompt: 'Show financial summary & revenue metrics' },
    { label: 'Unpaid Invoices', icon: <ContainerOutlined style={{ color: '#13c2c2' }} />, prompt: 'List all unpaid invoices' },
    { label: 'Leads Pipeline', icon: <FilterOutlined style={{ color: '#fa8c16' }} />, prompt: 'Show active leads pipeline' },
    { label: 'Clients Directory', icon: <CustomerServiceOutlined style={{ color: '#722ed1' }} />, prompt: 'List our clients' },
    { label: 'Recent Quotes', icon: <FileSyncOutlined style={{ color: '#2f54eb' }} />, prompt: 'Show recent quotes' },
    { label: 'Expenses', icon: <WalletOutlined style={{ color: '#eb2f96' }} />, prompt: 'List operating expenses' },
  ];

  // Inner Chat Body (Shared between Desktop & Mobile)
  const ChatContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#ffffff',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Draggable Left Resize Handle (Desktop Only) */}
      {!isMobile && (
        <div
          onMouseDown={handleMouseDown}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '10px',
            cursor: 'col-resize',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isDragging ? 'rgba(22, 119, 255, 0.2)' : 'transparent',
            transition: isDragging ? 'none' : 'background 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (!isDragging) e.currentTarget.style.background = 'rgba(22, 119, 255, 0.12)';
          }}
          onMouseLeave={(e) => {
            if (!isDragging) e.currentTarget.style.background = 'transparent';
          }}
          title="Drag left/right to resize AI sidebar"
        >
          <div
            style={{
              width: '4px',
              height: '44px',
              borderRadius: '2px',
              background: isDragging ? '#1677ff' : '#cbd5e1',
              boxShadow: '0 0 3px rgba(0,0,0,0.18)',
            }}
          />
        </div>
      )}

      {/* 1. Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1677ff 0%, #722ed1 100%)',
          padding: '14px 16px',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          userSelect: 'none',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={logoIcon} alt="MyCRM Logo" style={{ width: '22px', height: '22px' }} />
          <span style={{ fontWeight: '700', fontSize: '15px', letterSpacing: '-0.2px' }}>
            MyCRM AI Copilot
          </span>
          <Tag
            color="cyan"
            style={{
              margin: 0,
              fontSize: '10px',
              padding: '0 6px',
              borderRadius: '8px',
              fontWeight: '700',
              border: 'none',
              background: 'rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
            }}
          >
            {activeModel}
          </Tag>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Tooltip title="Clear Chat History">
            <Button
              type="text"
              size="small"
              icon={<ClearOutlined style={{ color: '#ffffff' }} />}
              onClick={clearChat}
            />
          </Tooltip>

          {!isMobile && (
            <Tooltip title={customWidth > 450 ? 'Default Width (400px)' : 'Expand Width (620px)'}>
              <Button
                type="text"
                size="small"
                icon={
                  customWidth > 450 ? (
                    <FullscreenExitOutlined style={{ color: '#ffffff' }} />
                  ) : (
                    <FullscreenOutlined style={{ color: '#ffffff' }} />
                  )
                }
                onClick={() => {
                  const nextWidth = customWidth > 450 ? 400 : 620;
                  setCustomWidth(nextWidth);
                  localStorage.setItem('mycrm_ai_sidebar_width', nextWidth.toString());
                }}
              />
            </Tooltip>
          )}

          <Tooltip title="Close Sidebar">
            <Button
              type="text"
              size="small"
              icon={<CloseOutlined style={{ color: '#ffffff' }} />}
              onClick={handleClose}
            />
          </Tooltip>
        </div>
      </div>

      {/* 2. Messages List */}
      <div
        style={{
          flex: 1,
          padding: '16px',
          overflowY: 'auto',
          background: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '100%',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  maxWidth: '94%',
                  flexDirection: isUser ? 'row-reverse' : 'row',
                }}
              >
                {isUser ? (
                  <Avatar
                    size={28}
                    style={{
                      backgroundColor: '#1677ff',
                      flexShrink: 0,
                      marginTop: '2px',
                      fontSize: '12px',
                      fontWeight: '700',
                    }}
                  >
                    U
                  </Avatar>
                ) : (
                  <Avatar
                    size={28}
                    src={logoIcon}
                    style={{
                      backgroundColor: '#ffffff',
                      padding: '3px',
                      border: '1px solid #e2e8f0',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  />
                )}

                <div
                  style={{
                    background: isUser ? '#1677ff' : '#ffffff',
                    color: isUser ? '#ffffff' : '#1e293b',
                    padding: '10px 14px',
                    borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                    boxShadow: isUser
                      ? '0 2px 8px rgba(22, 119, 255, 0.25)'
                      : '0 2px 8px rgba(0, 0, 0, 0.04)',
                    border: isUser ? 'none' : '1px solid #e2e8f0',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    wordBreak: 'break-word',
                  }}
                >
                  {/* Tool Action Badges */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div style={{ marginBottom: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {msg.actions.map((act, i) => (
                        <Tag
                          key={i}
                          color="geekblue"
                          style={{
                            fontSize: '11px',
                            margin: 0,
                            padding: '1px 6px',
                            borderRadius: '6px',
                          }}
                        >
                          <ThunderboltOutlined style={{ marginRight: '4px' }} />
                          {act}
                        </Tag>
                      ))}
                    </div>
                  )}

                  {/* Markdown Content with SVG App Icons */}
                  <div className={`markdown-body ${isUser ? 'user-bubble' : 'bot-bubble'}`}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ node, children, ...props }) => (
                          <p style={{ margin: '0 0 8px' }} {...props}>
                            {renderWithAppIcons(children)}
                          </p>
                        ),
                        h3: ({ node, children, ...props }) => (
                          <h3
                            style={{
                              fontSize: '15px',
                              fontWeight: '700',
                              color: '#0f172a',
                              margin: '12px 0 8px',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                            {...props}
                          >
                            {renderWithAppIcons(children)}
                          </h3>
                        ),
                        h4: ({ node, children, ...props }) => (
                          <h4
                            style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#1e293b',
                              margin: '10px 0 6px',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                            {...props}
                          >
                            {renderWithAppIcons(children)}
                          </h4>
                        ),
                        li: ({ node, children, ...props }) => {
                          const textStr = String(children?.[0] || '');
                          const matchPrompt = textStr.match(/"([^"]+)"/);
                          const promptText = matchPrompt ? matchPrompt[1] : null;

                          return (
                            <li
                              style={{
                                margin: '4px 0',
                                listStyleType: 'disc',
                                display: 'list-item',
                              }}
                              {...props}
                            >
                              {promptText && !isUser ? (
                                <span
                                  onClick={() => handleSendMessage(promptText)}
                                  style={{
                                    cursor: 'pointer',
                                    color: '#1677ff',
                                    fontWeight: '600',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    transition: 'opacity 0.2s',
                                  }}
                                  onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                                >
                                  {renderWithAppIcons(children)}
                                </span>
                              ) : (
                                <span>{renderWithAppIcons(children)}</span>
                              )}
                            </li>
                          );
                        },
                        table: ({ node, ...props }) => (
                          <div style={{ overflowX: 'auto', margin: '10px 0' }}>
                            <table
                              style={{
                                borderCollapse: 'collapse',
                                width: '100%',
                                fontSize: '12px',
                                borderRadius: '6px',
                                overflow: 'hidden',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                              }}
                              {...props}
                            />
                          </div>
                        ),
                        th: ({ node, children, ...props }) => (
                          <th
                            style={{
                              background: '#f1f5f9',
                              padding: '8px 10px',
                              border: '1px solid #cbd5e1',
                              fontWeight: '700',
                              color: '#0f172a',
                              textAlign: 'left',
                            }}
                            {...props}
                          >
                            {renderWithAppIcons(children)}
                          </th>
                        ),
                        td: ({ node, children, ...props }) => (
                          <td
                            style={{
                              padding: '6px 10px',
                              border: '1px solid #e2e8f0',
                              color: '#334155',
                            }}
                            {...props}
                          >
                            {renderWithAppIcons(children)}
                          </td>
                        ),
                        code: ({ node, ...props }) => (
                          <code
                            style={{
                              background: isUser ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                              color: isUser ? '#ffffff' : '#0f172a',
                              padding: '2px 5px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontFamily: 'monospace',
                            }}
                            {...props}
                          />
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>

                  {/* Timestamp & Copy Button */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '6px',
                      fontSize: '10px',
                      color: isUser ? 'rgba(255,255,255,0.7)' : '#94a3b8',
                    }}
                  >
                    <span>{msg.time}</span>
                    {!isUser && (
                      <Button
                        type="text"
                        size="small"
                        icon={
                          copiedId === msg.id ? (
                            <CheckOutlined style={{ fontSize: '11px', color: '#52c41a' }} />
                          ) : (
                            <CopyOutlined style={{ fontSize: '11px', color: '#94a3b8' }} />
                          )
                        }
                        onClick={() => copyMessage(msg.content, msg.id)}
                        style={{ height: '18px', padding: '0 4px' }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Spinner */}
        {isLoading && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Avatar
              size={28}
              src={logoIcon}
              style={{
                backgroundColor: '#ffffff',
                padding: '3px',
                border: '1px solid #e2e8f0',
              }}
            />
            <div
              style={{
                background: '#ffffff',
                padding: '8px 14px',
                borderRadius: '4px 16px 16px 16px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                color: '#64748b',
              }}
            >
              <Spin size="small" />
              <span>Thinking & querying CRM database...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Quick Action Chips */}
      <div
        style={{
          padding: '8px 12px',
          background: '#ffffff',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
        }}
      >
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(qp.prompt)}
            disabled={isLoading}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: '600',
              color: '#475569',
              cursor: 'pointer',
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#1677ff';
              e.currentTarget.style.color = '#1677ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.color = '#475569';
            }}
          >
            {qp.icon}
            <span>{qp.label}</span>
          </button>
        ))}
      </div>

      {/* 4. Input Box */}
      <div
        style={{
          padding: '12px 14px',
          background: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        <Input
          placeholder="Ask AI anything (e.g. 'Show unpaid invoices')..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onPressEnter={() => handleSendMessage()}
          disabled={isLoading}
          style={{
            borderRadius: '8px',
            fontSize: '13px',
          }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={() => handleSendMessage()}
          loading={isLoading}
          style={{
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #1677ff 0%, #722ed1 100%)',
            border: 'none',
          }}
        />
      </div>
    </div>
  );

  const sidebarWidth = isMobile ? '100%' : customWidth;

  return (
    <>
      {/* 1. Mobile Floating Button when closed */}
      {!isOpen && isMobile && (
        <div
          onClick={handleToggle}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 999,
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #1677ff 0%, #722ed1 100%)',
              borderRadius: '50px',
              padding: '10px 16px',
              color: '#ffffff',
              boxShadow: '0 8px 24px rgba(22, 119, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '700',
              fontSize: '13px',
            }}
          >
            <img src={logoIcon} alt="MyCRM Logo" style={{ width: '20px', height: '20px' }} />
            <span>AI Copilot</span>
          </div>
        </div>
      )}

      {/* 2. Desktop Floating Expand Tab when sidebar is closed */}
      {!isOpen && !isMobile && (
        <div
          onClick={handleToggle}
          style={{
            position: 'fixed',
            top: '50%',
            right: 0,
            transform: 'translateY(-50%)',
            zIndex: 999,
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #1677ff 0%, #722ed1 100%)',
            color: '#ffffff',
            padding: '12px 8px 12px 10px',
            borderRadius: '12px 0 0 12px',
            boxShadow: '-4px 4px 16px rgba(22, 119, 255, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            userSelect: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.paddingRight = '12px';
            e.currentTarget.style.boxShadow = '-6px 6px 20px rgba(114, 46, 209, 0.45)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.paddingRight = '8px';
            e.currentTarget.style.boxShadow = '-4px 4px 16px rgba(22, 119, 255, 0.35)';
          }}
          title="Open AI Copilot"
        >
          <LeftOutlined style={{ fontSize: '12px' }} />
          <img src={logoIcon} alt="AI" style={{ width: '20px', height: '20px' }} />
          <span
            style={{
              writingMode: 'vertical-rl',
              fontSize: '12px',
              fontWeight: '700',
              letterSpacing: '1px',
            }}
          >
            AI COPILOT
          </span>
        </div>
      )}

      {/* 3. Non-Intrusive Floating Overlay Drawer (Does NOT take up layout space) */}
      <Drawer
        placement="right"
        width={sidebarWidth}
        closable={false}
        onClose={handleClose}
        open={isOpen}
        mask={isMobile} // On desktop: no background mask so CRM records remain fully clickable & viewable
        styles={{
          body: { padding: 0, height: '100%', overflow: 'hidden' },
          content: {
            boxShadow: '-6px 0 28px rgba(0, 0, 0, 0.14)',
            borderLeft: '1px solid #edf2f7',
          },
          wrapper: isDragging ? { transition: 'none' } : undefined,
        }}
      >
        {ChatContent}
      </Drawer>
    </>
  );
}
