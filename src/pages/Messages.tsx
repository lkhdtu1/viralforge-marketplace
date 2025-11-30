import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Send,
  Check,
  CheckCheck,
  User as UserIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { messagesApi, usersApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender: {
    id: string;
    displayName?: string;
    avatar?: string;
  };
  receiver: {
    id: string;
    displayName?: string;
    avatar?: string;
  };
}

interface Conversation {
  userId: string;
  userName: string;
  userAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export default function Messages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
    const userIdParam = searchParams.get('userId');
    if (userIdParam) {
      setSelectedUserId(userIdParam);
      setSearchParams({});
    }
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      loadMessages(selectedUserId);
      const interval = setInterval(() => loadMessages(selectedUserId), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }
      try {
        const results = await usersApi.search(searchQuery);
        setSearchResults(results.filter((u: any) => u.id !== user?.id));
      } catch (error) {
        console.error('Search failed:', error);
      }
    };
    const debounce = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, user]);

  const loadConversations = async () => {
    try {
      const data = await messagesApi.getConversations();
      setConversations(data);
      if (data.length > 0 && !selectedUserId) {
        setSelectedUserId(data[0].userId);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (userId: string) => {
    try {
      const [data, userData] = await Promise.all([
        messagesApi.getMessages(userId),
        usersApi.getById(userId)
      ]);
      setMessages(data);
      setSelectedUser(userData);
      
      const unreadIds = data.filter((m: Message) => !m.isRead && m.receiverId === user?.id).map((m: Message) => m.id);
      if (unreadIds.length > 0) {
        await messagesApi.markAsRead(unreadIds);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId || !user) return;

    setIsSending(true);
    try {
      await messagesApi.send({
        receiverId: selectedUserId,
        content: newMessage.trim(),
      });
      
      setNewMessage('');
      await Promise.all([
        loadMessages(selectedUserId),
        loadConversations()
      ]);
    } catch (error: any) {
      toast({
        title: 'Failed to send message',
        description: error.response?.data?.message || 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  const startConversation = (userId: string) => {
    setSelectedUserId(userId);
    setSearchQuery('');
    setSearchResults([]);
  };

  const selectedConversation = conversations.find(c => c.userId === selectedUserId);
  const otherUser = selectedUser || (messages.length > 0 
    ? (messages[0].senderId === user?.id ? messages[0].receiver : messages[0].sender)
    : selectedConversation);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pt-16">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-[350px_1fr] gap-6 h-[calc(100vh-200px)]">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-350px)]">
                {searchResults.length > 0 && (
                  <div className="p-2 border-b">
                    <p className="text-xs text-muted-foreground px-2 mb-2">Search Results</p>
                    {searchResults.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => startConversation(result.id)}
                        className="w-full p-3 hover:bg-muted rounded-lg transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={result.avatar} />
                            <AvatarFallback>{result.displayName?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{result.displayName || 'User'}</p>
                            <p className="text-xs text-muted-foreground">{result.role}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {conversations.length === 0 && searchResults.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <UserIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No conversations yet</p>
                    <p className="text-sm mt-2">Search for users to start chatting</p>
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <button
                      key={conversation.userId}
                      onClick={() => setSelectedUserId(conversation.userId)}
                      className={cn(
                        'w-full p-4 hover:bg-muted transition-colors text-left border-b',
                        selectedUserId === conversation.userId && 'bg-muted'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarImage src={conversation.userAvatar} />
                          <AvatarFallback>{conversation.userName?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium truncate">{conversation.userName}</p>
                            <span className="text-xs text-muted-foreground">
                              {new Date(conversation.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <Badge className="ml-2">{conversation.unreadCount}</Badge>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            {selectedUserId && otherUser ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={otherUser.avatar || otherUser.userAvatar} />
                      <AvatarFallback>{(otherUser.displayName || otherUser.userName)?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <p className="font-semibold">{otherUser.displayName || otherUser.userName || 'User'}</p>
                  </div>
                </CardHeader>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isOwn = message.senderId === user?.id;
                      return (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}
                        >
                          <div className={cn(
                            'max-w-[70%] rounded-lg p-3',
                            isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted'
                          )}>
                            <p className="text-sm">{message.content}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-xs opacity-70">
                                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {isOwn && (message.isRead ? <CheckCheck className="w-3 h-3 opacity-70" /> : <Check className="w-3 h-3 opacity-70" />)}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <form onSubmit={handleSendMessage} className="border-t p-4">
                  <div className="flex gap-2">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="resize-none"
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                    />
                    <Button type="submit" disabled={!newMessage.trim() || isSending}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <UserIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Select a conversation or search for users to start chatting</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
