"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit, TextStyle, FontFamily],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "min-h-[160px] border border-t-0 rounded-b-md p-3 focus:outline-none prose max-w-none",
      },
    },
  });

  if (!editor) return null;

  const btn = (active: boolean) =>
    `px-2 py-1 text-sm rounded ${active ? "bg-gray-800 text-white" : "bg-gray-100"}`;

  return (
    <div>
      <div className="flex flex-wrap gap-1 border rounded-t-md p-2 bg-gray-50">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive("bold"))}>Bold</button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive("italic"))}>Italic</button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive("bulletList"))}>• List</button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive("orderedList"))}>1. List</button>
        <select
          onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
          className="text-sm border rounded px-1"
          defaultValue=""
        >
          <option value="">Font</option>
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
          <option value="'Courier New'">Courier New</option>
          <option value="'Times New Roman'">Times New Roman</option>
        </select>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}