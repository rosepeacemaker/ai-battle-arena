import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

export default function ArenaResponse({ solution1, solution2, judge }) {
  useEffect(() => {
    hljs.highlightAll();
  }, [solution1, solution2]);

  return (
    <div className="flex flex-col gap-8 my-8 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Solution 1 */}
        <div className="bg-white dark:bg-[#32273C] border border-[#EADDF0] dark:border-[#463654] rounded-3xl p-8 shadow-sm flex flex-col transition-all hover:shadow-md hover:border-emerald-500/40">
          <h3 className="text-xs font-semibold tracking-wider uppercase text-[#7E6C8B] dark:text-[#CBBACC] mb-6 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50"></span> Agent 1 Solution
          </h3>
          <div className="text-[#271F2E] dark:text-[#F3ECF8] max-h-[500px] overflow-y-auto no-scrollbar pr-2">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-6 mb-4 text-[#271F2E] dark:text-white" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-5 mb-3 text-[#271F2E] dark:text-white" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-4 mb-2 text-[#271F2E] dark:text-white" {...props} />,
                p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-[#3B2D46] dark:text-[#E8DCF0]" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 text-[#3B2D46] dark:text-[#E8DCF0] space-y-1" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 text-[#3B2D46] dark:text-[#E8DCF0] space-y-1" {...props} />,
                a: ({node, ...props}) => <a className="text-[#8B5CF6] dark:text-[#C084FC] hover:underline font-medium" {...props} />,
                code: ({node, inline, className, children, ...props}) => {
                  return !inline ? (
                    <div className="rounded-2xl overflow-hidden my-5 border border-[#E4D5EC] dark:border-[#4A3959] shadow-sm">
                       <pre className="p-5 bg-[#1B1521] overflow-x-auto no-scrollbar text-sm text-[#F3ECF8] font-mono">
                         <code className={className} {...props}>
                           {children}
                         </code>
                       </pre>
                    </div>
                  ) : (
                    <code className="bg-[#F2EAFA] dark:bg-[#433451] text-[#271F2E] dark:text-[#F3ECF8] px-2 py-0.5 rounded-md text-sm font-mono border border-[#E2D2EB]/60 dark:border-[#524063]" {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            >{solution1}</ReactMarkdown>
          </div>
        </div>

        {/* Solution 2 */}
        <div className="bg-white dark:bg-[#32273C] border border-[#EADDF0] dark:border-[#463654] rounded-3xl p-8 shadow-sm flex flex-col transition-all hover:shadow-md hover:border-violet-500/40">
          <h3 className="text-xs font-semibold tracking-wider uppercase text-[#7E6C8B] dark:text-[#CBBACC] mb-6 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-500 shadow-xs shadow-violet-500/50"></span> Agent 2 Solution
          </h3>
          <div className="text-[#271F2E] dark:text-[#F3ECF8] max-h-[500px] overflow-y-auto no-scrollbar pr-2">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-6 mb-4 text-[#271F2E] dark:text-white" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-5 mb-3 text-[#271F2E] dark:text-white" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-4 mb-2 text-[#271F2E] dark:text-white" {...props} />,
                p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-[#3B2D46] dark:text-[#E8DCF0]" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 text-[#3B2D46] dark:text-[#E8DCF0] space-y-1" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 text-[#3B2D46] dark:text-[#E8DCF0] space-y-1" {...props} />,
                a: ({node, ...props}) => <a className="text-[#8B5CF6] dark:text-[#C084FC] hover:underline font-medium" {...props} />,
                code: ({node, inline, className, children, ...props}) => {
                  return !inline ? (
                    <div className="rounded-2xl overflow-hidden my-5 border border-[#E4D5EC] dark:border-[#4A3959] shadow-sm">
                       <pre className="p-5 bg-[#1B1521] overflow-x-auto no-scrollbar text-sm text-[#F3ECF8] font-mono">
                         <code className={className} {...props}>
                           {children}
                         </code>
                       </pre>
                    </div>
                  ) : (
                    <code className="bg-[#F2EAFA] dark:bg-[#433451] text-[#271F2E] dark:text-[#F3ECF8] px-2 py-0.5 rounded-md text-sm font-mono border border-[#E2D2EB]/60 dark:border-[#524063]" {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            >{solution2}</ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Judge Panel */}
      {judge && (
        <div className="mt-2 bg-[#F4EFF8]/80 dark:bg-[#2B2134]/90 border border-[#EADDF0] dark:border-[#42344F] rounded-3xl p-8 backdrop-blur-sm shadow-sm">
          <h3 className="text-base font-medium text-[#271F2E] dark:text-white flex items-center gap-2.5 mb-6">
            <span>⚖️</span> Agent Judge Verdict & Ratings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3.5">
              <div className="flex justify-between items-center bg-white dark:bg-[#372A43] px-5 py-3.5 rounded-2xl border border-[#E4D5EC] dark:border-[#4C3B5B] shadow-2xs">
                <span className="font-semibold text-xs tracking-wider uppercase text-[#7E6C8B] dark:text-[#D4C5E2]">Agent 1 Score</span>
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{judge.solution_1_score}/10</span>
              </div>
              <p className="text-[#554363] dark:text-[#D4C5E2] text-sm leading-relaxed px-1">
                {judge.solution_1_reasoning}
              </p>
            </div>
            <div className="space-y-3.5">
               <div className="flex justify-between items-center bg-white dark:bg-[#372A43] px-5 py-3.5 rounded-2xl border border-[#E4D5EC] dark:border-[#4C3B5B] shadow-2xs">
                <span className="font-semibold text-xs tracking-wider uppercase text-[#7E6C8B] dark:text-[#D4C5E2]">Agent 2 Score</span>
                <span className="text-2xl font-bold text-violet-600 dark:text-violet-400">{judge.solution_2_score}/10</span>
              </div>
              <p className="text-[#554363] dark:text-[#D4C5E2] text-sm leading-relaxed px-1">
                {judge.solution_2_reasoning}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
