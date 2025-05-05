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
import { useUser } from "@/contexts/UserContext";
import { fetchAdvice } from "@/lib/api";

interface Message {
  content: string;
  type: "sent" | "received";
}

export function PageChat() {
  const { userId } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (isLoading) return;
    if (!inputMessage.trim()) return;
    if (!userId) {
      setMessages((prev) => [
        ...prev,
        { content: "⚠️ Error: No user ID found. Please log in.", type: "received" },
      ]);
      return;
    }

    // Add the user's message to the chat
    setMessages((prev) => [...prev, { content: inputMessage, type: "sent" }]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Fetch the AI-generated advice via your API helper
      const { response: aiMessage } = await fetchAdvice(userId, inputMessage);
      // Sanitize before displaying
      const sanitizedMessage = DOMPurify.sanitize(aiMessage);
      setMessages((prev) => [...prev, { content: sanitizedMessage, type: "received" }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [
        ...prev,
        { content: "Error fetching AI response", type: "received" },
      ]);
    } finally {
      setIsLoading(false);
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
        {isLoading && (
          <ChatBubble variant="received">
            <ChatBubbleAvatar />
            <ChatBubbleMessage variant="received">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></span>
              </div>
            </ChatBubbleMessage>
          </ChatBubble>
        )}
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
            disabled={isLoading}
          />
          <Button size="icon" onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </ExpandableChatFooter>
    </ExpandableChat>
  );
}