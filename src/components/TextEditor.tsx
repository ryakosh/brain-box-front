interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TextEditor({ value, onChange }: TextEditorProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="..."
      className="w-full h-full text-fg font-medium bg-bg-hard shadow-md rounded-md placeholder:text-fg-muted text-xl resize-none p-2 focus:outline-none"
    />
  );
}
