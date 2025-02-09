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
import { useUser } from "@/contexts/UserContext"; // ✅ Import UserContext

interface Message {
  content: string;
  type: "sent" | "received";
}

export function PageChat() {
  const { userId } = useUser(); // ✅ Get `user_id` from context
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!inputMessage.trim()) return;
    if (!userId) {
      setMessages((prev) => [
        ...prev,
        { content: "⚠️ Error: No user ID found. Please log in.", type: "received" },
      ]);
      return;
    }

    // ✅ Add user message to chat
    setMessages((prev) => [...prev, { content: inputMessage, type: "sent" }]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // ✅ API URL with dynamic `userId`
      const apiUrl = `https://fastapi-project-production-fc1c.up.railway.app/advice/${userId}`;

      // ✅ API Request (Matching Your `curl` Command)
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer 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",
        },
        body: JSON.stringify({ question: inputMessage }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          { content: DOMPurify.sanitize(data.response), type: "received" },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { content: `⚠️ API Error: ${data.detail || "Unable to fetch response"}`, type: "received" },
        ]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { content: "⚠️ An error occurred while fetching data.", type: "received" },
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
            <h3 className="font-semibold">Your Investment Buddy</h3>
            <p className="text-xs text-muted-foreground">
              Always here to help you and your portfolio grow!
            </p>
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
            disabled={isLoading}
          />
          <Button size="icon" onClick={handleSend} disabled={isLoading}>
            {isLoading ? "⏳" : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </ExpandableChatFooter>
    </ExpandableChat>
  );
}