import { Highlight, themes } from 'prism-react-renderer';
import { useTheme } from '../contexts/ThemeContext';

interface CodeOutputProps {
  code: string;
  language?: string;
}

export function CodeOutput({ code, language = 'css' }: CodeOutputProps) {
  const { theme } = useTheme();

  return (
    <div className="bg-muted/50 rounded-lg overflow-hidden border border-border">
      <Highlight
        theme={theme === 'dark' ? themes.vsDark : themes.vsLight}
        code={code}
        language={language}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`${className} p-4 overflow-x-auto text-sm`} style={style}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}