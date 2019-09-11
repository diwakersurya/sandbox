import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-dark.css';
import '../styles/highlight-overrides.scss';

export default function DefaultEditor({
    value,
    onChange,
    style,
    name,
    ...restProps
}) {
    const handleValueChange = code => {
        onChange && onChange(name, code);
    };
    return (
        <Editor
            value={value}
            onValueChange={handleValueChange}
            highlight={code => highlight(code, languages.js)}
            padding={10}
            style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
                ...style
            }}
            {...restProps}
        />
    );
}
