import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-dark.css";
import "../styles/highlight-overrides.scss";
import "../styles/overrides.scss";

export default function DefaultEditor({
  value,
  onChange,
  style,
  path,
  ...restProps
}) {
  const handleValueChange = code => {
    onChange && onChange(path, code);
  };
  return (
    // Inline style can be removed
    <div className="highlight file" style={{ height: "24vh" }}>
      <pre className="language-jsx">
        <Editor
          value={value}
          onValueChange={handleValueChange}
          highlight={code => highlight(code, languages.js)}
          {...restProps}
        />
      </pre>
    </div>
  );
}
