import { useState } from "react";
import { Send } from "lucide-react";
import {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
} from "@/components/ui/expandable-chat";
import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/ui/chat-input";
import {
  ChatBubble,
  ChatBubbleMessage,
  ChatBubbleAvatar,
} from "@/components/ui/chat-bubble";
import DOMPurify from "dompurify";

interface Message {
  content: string;
  type: "sent" | "received";
}

export function PageChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    setMessages((prev) => [...prev, { content: inputMessage, type: "sent" }]);
    setInputMessage("");

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          'Cookie': '__cf_bm=OiYdqdxdC1F2sVGQSoll6MKDfjzyLVVe4L0qH3.s0xs-1739088058-1.0.1.1-dvrD6LIOyaHl0YtmzVemdx4ea6qSalgKWMd6z5f7BffBUY2gB_GNRXdALXsN59KJRPg2DADtw8_BIwtoeeDUjQ'
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `
                You are a helpful AI assistant integrated into the “InvestiVerse” app — a platform focusing on micro-investing, financial education, and gamified lessons. Your goal is to provide interactive, engaging, and informative responses about personal finance, investing strategies, and how users can get the most out of InvestiVerse.

                When you respond, please:
                - Use valid HTML, with tags such as <strong>, <ul>, <li>, <p>, etc. for formatting and emphasis.
                - Provide clear, concise information while keeping an approachable, friendly tone.
                - Reference features or sections of the InvestiVerse app where relevant (e.g., lessons, quizzes, investment hub, leaderboard).
                - Encourage users to learn more through InvestiVerse’s educational modules or features, but avoid over-promising or giving overly specific financial advice.
                - Maintain a respectful, helpful style that caters to both beginners and intermediate investors.

                Remember:
                - You are not a financial advisor. Offer information and examples but do not provide personalized financial advice.
                - Use <strong> tags to emphasize key points. Utilize lists (<ul>, <li>) and short paragraphs for clarity.
                - Keep the conversation interactive: ask follow-up questions or prompt users to explore relevant InvestiVerse features.

                In summary, be an engaging, enthusiastic guide that reflects InvestiVerse’s commitment to fun, accessible, and responsible investing education. Return all answers in valid HTML.
              `
            },
            {
              role: "user",
              content: inputMessage
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI response');
      }

      const data = await response.json();
      const aiMessage = data.choices?.[0]?.message?.content || "No response";
      // Sanitize the AI response using DOMPurify
      const sanitizedMessage = DOMPurify.sanitize(aiMessage);

      setMessages(prev => [...prev, { content: sanitizedMessage, type: "received" }]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setMessages(prev => [...prev, { content: 'Error fetching AI response', type: "received" }]);
    }
  };

  return (
    <ExpandableChat>
      <ExpandableChatHeader>
        <div className="flex items-center gap-2">
          <ChatBubbleAvatar />
          <div>
            <h3 className="font-semibold">Your Investment buddy</h3>
            <p className="text-xs text-muted-foreground">Always here to help you and your portfolio grow!</p>
          </div>
        </div>
      </ExpandableChatHeader>
      
      <ExpandableChatBody className="p-4">
        {messages.map((message, index) => (
          <ChatBubble key={index} variant={message.type}>
            {message.type === "received" && <ChatBubbleAvatar />}
            <ChatBubbleMessage variant={message.type}>
              <div dangerouslySetInnerHTML={{ __html: message.content }} />
            </ChatBubbleMessage>
          </ChatBubble>
        ))}
      </ExpandableChatBody>

      <ExpandableChatFooter>
        <div className="flex gap-2">
          <ChatInput
            placeholder="What's on your mind, trading buddy?"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button size="icon" onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </ExpandableChatFooter>
    </ExpandableChat>
  );
}