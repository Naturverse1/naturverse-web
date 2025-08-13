import { useState, useRef, useEffect } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
}

export default function AI() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Welcome message
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      type: 'ai',
      content:
        "🌟 Greetings, young explorer! I'm Turian, your AI assistant in The Naturverse. I'm here to help you learn about nature, answer your questions, and guide you on your magical journey. What would you like to discover today?",
      timestamp: new Date().toISOString(),
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(
      () => {
        const aiResponse = generateAIResponse(inputMessage);
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: aiResponse,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);
      },
      1000 + Math.random() * 2000,
    ); // Random delay for realism
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    // Simple keyword-based responses (TODO: Replace with actual AI integration)
    if (input.includes('plant') || input.includes('flower') || input.includes('tree')) {
      return '🌱 Plants are amazing! They create oxygen through photosynthesis, which means they use sunlight to turn carbon dioxide and water into energy. Did you know some plants can live for thousands of years? Trees are like the apartment buildings of the forest - many animals call them home!';
    }

    if (input.includes('animal') || input.includes('creature') || input.includes('wildlife')) {
      return "🦋 The animal kingdom is full of incredible creatures! From tiny insects to massive whales, each animal has special adaptations that help them survive. What's your favorite animal? I can tell you some fascinating facts about it!";
    }

    if (input.includes('ocean') || input.includes('sea') || input.includes('water')) {
      return "🌊 The ocean is like a whole other world! It covers about 71% of Earth's surface and is home to countless species. Did you know that we've only explored about 5% of our oceans? There are probably amazing creatures down there we haven't even discovered yet!";
    }

    if (input.includes('quiz') || input.includes('test') || input.includes('learn')) {
      return "🧠 Learning is an adventure! I recommend starting with our Plant Kingdom quiz if you're interested in botany, or try the Amazing Insects quiz to learn about our six-legged friends. Remember, every expert was once a beginner!";
    }

    if (input.includes('help') || input.includes('guide') || input.includes('how')) {
      return "✨ I'm here to help! You can ask me about nature facts, get study tips, learn about different animals and plants, or I can guide you to the perfect learning module for your interests. What specific topic would you like to explore?";
    }

    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return "🌟 Hello there, curious explorer! It's wonderful to meet you. I'm excited to share the wonders of nature with you. What's something about the natural world that you've always wondered about?";
    }

    // Default response
    return "🌿 That's a fascinating question! While I'm still learning about that topic, I'd love to help you explore it together. You might find some great information in our Learning Modules or by taking one of our interactive quizzes. Is there a specific aspect of nature you're most curious about?";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    'How do plants make oxygen?',
    'What animals are nocturnal?',
    'How do butterflies transform?',
    'Why are forests important?',
    'What lives in the ocean?',
  ];

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <div className="min-h-screen magic-gradient py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-fredoka text-white mb-4" data-testid="text-title">
            🤖 Turian AI Assistant
          </h1>
          <p className="text-white/90 text-lg">
            Your intelligent companion for exploring the wonders of nature!
          </p>
          <div className="flex justify-center mt-4">
            <Badge className={`${isConnected ? 'bg-nature' : 'bg-coral'} text-white`}>
              {isConnected ? '🟢 Online' : '🔴 Offline'}
            </Badge>
          </div>
        </div>

        <Card className="backdrop-blur-sm bg-white/95 border-nature/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-fredoka text-forest text-center">
              💬 Chat with Turian
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto mb-4 p-4 bg-gradient-to-br from-nature/5 to-turquoise/5 rounded-lg border border-nature/20">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  data-testid={`message-${message.id}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-nature text-white'
                        : 'bg-white border border-nature/20 text-forest'
                    }`}
                  >
                    <div className="text-sm">{message.content}</div>
                    <div
                      className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-white/70' : 'text-forest/50'
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="mb-4 flex justify-start">
                  <div className="bg-white border border-nature/20 text-forest px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-nature rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-nature rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-nature rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            <div className="mb-4">
              <p className="text-sm text-forest/70 mb-2">💡 Quick questions to get started:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="text-xs px-3 py-1 bg-turquoise/20 text-turquoise rounded-full hover:bg-turquoise/30 transition-colors duration-200"
                    data-testid={`quick-question-${index}`}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Turian about nature, animals, plants, or anything you're curious about..."
                className="flex-1 border-nature/20 focus:border-nature focus:ring-nature/20"
                disabled={isTyping}
                data-testid="input-chat-message"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-nature hover:bg-forest text-white px-6"
                data-testid="button-send-message"
              >
                {isTyping ? '⏳' : '🚀'}
              </Button>
            </div>

            {/* Help Text */}
            <div className="mt-4 text-center">
              <p className="text-xs text-forest/60">
                💡 Tip: Ask specific questions about nature topics, request learning
                recommendations, or get help with quizzes and modules!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
