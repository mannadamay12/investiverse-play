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

interface Message {
  content: string;
  type: "sent" | "received";
}

export function PageChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSend = () => {
    if (!inputMessage.trim()) return;
    
    setMessages([...messages, { content: inputMessage, type: "sent" }]);
    setInputMessage("");
    
    // Simulate AI response - replace with actual API call
    setTimeout(() => {
      setMessages(prev => [...prev, {
        content: "This is a simulated response. Replace with actual AI response.",
        type: "received"
      }]);
    }, 1000);
  };

  return (
    <ExpandableChat>
      <ExpandableChatHeader>
        <div className="flex items-center gap-2">
          <ChatBubbleAvatar />
          <div>
            <h3 className="font-semibold">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">Always here to help</p>
          </div>
        </div>
      </ExpandableChatHeader>
      
      <ExpandableChatBody className="p-4">
        {messages.map((message, index) => (
          <ChatBubble key={index} variant={message.type}>
            {message.type === "received" && <ChatBubbleAvatar />}
            <ChatBubbleMessage variant={message.type}>
              {message.content}
            </ChatBubbleMessage>
          </ChatBubble>
        ))}
      </ExpandableChatBody>

      <ExpandableChatFooter>
        <div className="flex gap-2">
          <ChatInput
            placeholder="Type a message..."
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
