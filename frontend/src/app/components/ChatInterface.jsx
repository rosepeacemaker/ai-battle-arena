import React, { useState, useRef, useEffect } from 'react';
import UserMessage from './UserMessage';
import ArenaResponse from './ArenaResponse';
import axios from "axios";

const MOCK_RESPONSE = {
  solution_1: "Here is a clean Python solution using modern syntax:\n\n```python\ndef fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n```\n\nThis approach has O(n) time complexity and O(1) space.",
  solution_2: "A recursive solution can be elegant but less efficient:\n\n```python\ndef fib(n):\n    if n <= 1:\n        return n\n    return fib(n-1) + fib(n-2)\n```\n\nNote: this has O(2^n) time complexity.",
  judge: {
    solution_1_score: 10,
    solution_2_score: 5,
    solution_1_reasoning: "Excellent, optimal solution. Space complexity is O(1) which is perfect for this problem.",
    solution_2_reasoning: "The recursive approach without memoization is extremely slow for large inputs."
  }
};

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const parseApiResponse = (responseData) => {
    if (!responseData) return MOCK_RESPONSE;

    // Check if result is wrapped under result, output, or at top level
    let target = responseData.result !== undefined
      ? responseData.result
      : (responseData.output !== undefined ? responseData.output : responseData);

    // Parse stringified JSON if needed
    if (typeof target === 'string') {
      try {
        target = JSON.parse(target);
      } catch {
        return {
          solution_1: target,
          solution_2: target,
          judge: null
        };
      }
    }

    if (typeof target === 'object' && target !== null) {
      const solution_1 = target.solution_1 || target.solution1 || target.solution_A || target.solutionA || target.sol1 || "";
      const solution_2 = target.solution_2 || target.solution2 || target.solution_B || target.solutionB || target.sol2 || "";
      const judge = target.judge || target.evaluation || target.judgment || null;

      if (solution_1 || solution_2) {
        return { solution_1, solution_2, judge };
      }
    }

    return target;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userQuery = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/invoke", {
        input: userQuery
      });

      console.log("Backend response:", response.data);

      const parsedData = parseApiResponse(response.data);

      const newMessage = {
        id: Date.now(),
        problem: userQuery,
        solution_1: parsedData.solution_1 || "No solution 1 returned from backend.",
        solution_2: parsedData.solution_2 || "No solution 2 returned from backend.",
        judge: parsedData.judge || null
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
    } catch (error) {
      console.error("Error invoking AI backend:", error);

      const errorMessage = {
        id: Date.now(),
        problem: userQuery,
        solution_1: `⚠️ **Connection Error**\n\nCould not reach the AI backend at \`http://localhost:3000/invoke\`.\n\n*Details:* ${error.message || "Network Error"}\n\nPlease check if your backend server (e.g. Express / LangGraph server) is running on port 3000.`,
        solution_2: `⚠️ **Server Status**\n\nEnsure backend server is running and CORS is enabled if requesting cross-origin.`,
        judge: {
          solution_1_score: 0,
          solution_2_score: 0,
          solution_1_reasoning: "Backend server connection failed.",
          solution_2_reasoning: "Backend server connection failed."
        }
      };

      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex flex-col h-screen bg-[#F8F5FB] dark:bg-[#271F2E] font-sans text-[#271F2E] dark:text-[#F3ECF8] antialiased selection:bg-[#9333EA]/20 selection:text-[#9333EA]">
      <header className="py-4 px-8 border-b border-[#EADDF0] dark:border-[#3E304A] bg-white/75 dark:bg-[#271F2E]/75 backdrop-blur-xl sticky top-0 z-20 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <h1 className="text-lg font-semibold tracking-tight text-[#271F2E] dark:text-white">TrioAI Agents</h1>
        </div>
        <div className="text-xs font-medium text-[#7E6C8B] dark:text-[#D4C5E2] bg-[#F2EAFA] dark:bg-[#352A3F] px-3.5 py-1 rounded-full border border-[#E4D5EC] dark:border-[#493957]">
          Dual Model + Judge System
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar px-6 md:px-12 py-10 w-full max-w-5xl mx-auto flex flex-col">
        {messages.length === 0 && !isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center my-auto py-16 animate-in fade-in duration-700">
            <div className="w-16 h-16 rounded-3xl bg-[#271F2E]/5 dark:bg-[#A855F7]/15 border border-[#271F2E]/10 dark:border-[#A855F7]/30 flex items-center justify-center mb-6 text-[#7E22CE] dark:text-[#C084FC] text-2xl shadow-sm">
              ⚡
            </div>
            <h2 className="text-3xl font-normal tracking-tight mb-3 text-[#271F2E] dark:text-zinc-100">
              Welcome to <span className="font-semibold text-[#8B5CF6] dark:text-[#C084FC]">TrioAI Agents</span>
            </h2>
            <p className="text-[#6E5C7D] dark:text-[#CBBACC] max-w-md text-base leading-relaxed">
              Ask any coding question to watch two AI models craft solutions head-to-head while an expert judge evaluates the winner.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {messages.map((msg) => (
              <div key={msg.id} className="animate-in fade-in slide-in-from-bottom-6 duration-500 ease-out">
                <UserMessage message={msg.problem} />
                <ArenaResponse
                  solution1={msg.solution_1}
                  solution2={msg.solution_2}
                  judge={msg.judge}
                />
              </div>
            ))}

            {isLoading && (
              <div className="py-8 animate-pulse">
                <div className="flex justify-center items-center gap-3 text-[#7E6C8B] dark:text-[#CBBACC]">
                  <div className="w-2.5 h-2.5 bg-[#8B5CF6] dark:bg-[#C084FC] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2.5 h-2.5 bg-[#8B5CF6] dark:bg-[#C084FC] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2.5 h-2.5 bg-[#8B5CF6] dark:bg-[#C084FC] rounded-full animate-bounce"></div>
                  <span className="ml-2 text-sm font-medium tracking-wide">TrioAI Agents are thinking and evaluating solutions...</span>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </main>

      <div className="py-6 px-6 md:px-12 bg-white/80 dark:bg-[#271F2E]/80 backdrop-blur-xl border-t border-[#EADDF0] dark:border-[#3E304A]">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask TrioAI Agents a coding problem..."
              disabled={isLoading}
              className="w-full bg-[#F2EAFA]/70 dark:bg-[#34283F]/80 text-[#271F2E] dark:text-[#F3ECF8] border border-[#E2D2EB] dark:border-[#4B3B59] rounded-full py-4 pl-7 pr-16 focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] focus:outline-none placeholder-[#A08EB0] dark:placeholder-[#9C89AC] transition-all shadow-sm hover:shadow text-base disabled:opacity-60"
            />
            <button
              type="submit"
              className="absolute right-2.5 bg-[#271F2E] hover:bg-[#3B2D46] dark:bg-[#8B5CF6] dark:hover:bg-[#7C3AED] active:scale-95 text-white p-3 rounded-full transition-all flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-[#271F2E]/10 dark:shadow-purple-950/50"
              disabled={!inputValue.trim() || isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
