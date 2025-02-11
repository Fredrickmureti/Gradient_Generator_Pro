import React from 'react';

interface CodeOutputProps {
  code: string;
}

export function CodeOutput({ code }: CodeOutputProps) {
  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <pre className="text-gray-100 font-mono text-sm overflow-x-auto">
        {code}
      </pre>
    </div>
  );
}