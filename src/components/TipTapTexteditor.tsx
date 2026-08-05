import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Strikethrough,
  Code,
  Quote,
  Undo,
  Redo,
  AlignCenter,
} from "lucide-react";
import View from "@/components/view";
import Input from "./input";
import TextAlign from "@tiptap/extension-text-align";

// Define props interface
interface RichTextEditorProps {
  name: string;
  value?: string;
  onChange?: (value: string, name: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  areaHeight?: string;
  required?: boolean;
}

// Simple button component for toolbar
const ToolbarButton = ({
  icon,
  isActive = false,
  onClick,
  disabled = false,
  title,
}: {
  icon: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
  disabled?: boolean;
  title: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-2 rounded-md transition-colors ${
      isActive
        ? "bg-primary-50 text-primary"
        : "text-gray-600 hover:bg-gray-100"
    } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
  >
    {icon}
  </button>
);

// Divider component for toolbar
const Divider = () => <div className="w-px h-6 bg-neutral-300 mx-1" />;

const TipTapTextEditor: React.FC<RichTextEditorProps> = ({
  name,
  value = "",
  onChange,
  placeholder = "Start typing...",
  className = "",
  disabled = false,
  error,
  label,
  areaHeight = "min-h-[200px]",
  required = false,
}) => {
  // Initialize the editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: { keepMarks: true, keepAttributes: true },
        orderedList: { keepMarks: true, keepAttributes: true },
        paragraph: {
          HTMLAttributes: {
            class: "text-left", // default alignment
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"], // enable alignment on these nodes
      }),
    ],
    content: value,
    editable: !disabled,
    editorProps: {
      attributes: {
        class: "p-4 focus:outline-none min-h-[200px] prose max-w-none",
        placeholder,
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) {
        const html = editor.getHTML();
        onChange(html, name);
      }
    },
  });

  // Update content when value prop changes
  useEffect(() => {
    if (editor && value !== undefined && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  // Update editable state when disabled prop changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [disabled, editor]);

  if (!editor) {
    return null;
  }

  // Toolbar button helpers
  const formatText = (format: string) => {
    switch (format) {
      case "bold":
        return editor.chain().focus().toggleBold().run();
      case "italic":
        return editor.chain().focus().toggleItalic().run();
      case "strike":
        return editor.chain().focus().toggleStrike().run();
      case "code":
        return editor.chain().focus().toggleCode().run();
      case "blockquote":
        return editor.chain().focus().toggleBlockquote().run();
      case "center":
        // @ts-ignore
        return editor.chain().focus().setTextAlign("center").run();
      default:
        return;
    }
  };

  const toggleHeading = (level: 1 | 2 | 3) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  const toggleList = (type: "bullet" | "ordered") => {
    if (type === "bullet") {
      editor.chain().focus().toggleBulletList().run();
    } else {
      editor.chain().focus().toggleOrderedList().run();
    }
  };

  return (
    <View className={`rich-text-editor ${className}`}>
      {/* Label */}
      {label && (
        <label className="block  text-text-DEFAULT mb-1 dark:text-white">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}

      <Input type="hidden" name={name} value={editor.getHTML()}></Input>

      {/* Editor Container */}
      <View className="border border-border rounded-md overflow-hidden">
        {/* Toolbar */}
        <View className="flex flex-wrap items-center gap-1 p-2 border-b border-neutral-200 bg-neutral-50 dark:bg-background dark:border-border">
          {/* Text Formatting */}
          <ToolbarButton
            icon={<Bold size={16} />}
            isActive={editor.isActive("bold")}
            onClick={() => formatText("bold")}
            title="Bold"
          />
          <ToolbarButton
            icon={<AlignCenter size={16} />} // use an icon or text
            isActive={editor.isActive("center")}
            onClick={() => formatText("center")}
            title="Align Center"
          />

          <ToolbarButton
            icon={<Italic size={16} />}
            isActive={editor.isActive("italic")}
            onClick={() => formatText("italic")}
            title="Italic"
          />

          <ToolbarButton
            icon={<Strikethrough size={16} />}
            isActive={editor.isActive("strike")}
            onClick={() => formatText("strike")}
            title="Strikethrough"
          />

          <ToolbarButton
            icon={<Code size={16} />}
            isActive={editor.isActive("code")}
            onClick={() => formatText("code")}
            title="Code"
          />

          <Divider />

          {/* Headings */}
          <ToolbarButton
            icon={<Heading1 size={16} />}
            isActive={editor.isActive("heading", { level: 1 })}
            onClick={() => toggleHeading(1)}
            title="Heading 1"
          />

          <ToolbarButton
            icon={<Heading2 size={16} />}
            isActive={editor.isActive("heading", { level: 2 })}
            onClick={() => toggleHeading(2)}
            title="Heading 2"
          />

          <ToolbarButton
            icon={<Heading3 size={16} />}
            isActive={editor.isActive("heading", { level: 3 })}
            onClick={() => toggleHeading(3)}
            title="Heading 3"
          />

          <Divider />

          {/* Lists */}
          <ToolbarButton
            icon={<List size={16} />}
            isActive={editor.isActive("bulletList")}
            onClick={() => toggleList("bullet")}
            title="Bullet List"
          />

          <ToolbarButton
            icon={<ListOrdered size={16} />}
            isActive={editor.isActive("orderedList")}
            onClick={() => toggleList("ordered")}
            title="Ordered List"
          />

          <Divider />

          {/* Blockquote */}
          <ToolbarButton
            icon={<Quote size={16} />}
            isActive={editor.isActive("blockquote")}
            onClick={() => formatText("blockquote")}
            title="Blockquote"
          />

          <Divider />

          {/* Undo/Redo */}
          <ToolbarButton
            icon={<Undo size={16} />}
            disabled={!editor.can().chain().focus().undo().run()}
            onClick={() => editor.chain().focus().undo().run()}
            title="Undo"
          />

          <ToolbarButton
            icon={<Redo size={16} />}
            disabled={!editor.can().chain().focus().redo().run()}
            onClick={() => editor.chain().focus().redo().run()}
            title="Redo"
          />
        </View>

        {/* Editor Content */}
        <View
          className={`editor-container ${
            disabled ? "bg-gray-50 opacity-75" : ""
          }`}
        >
          <EditorContent
            editor={editor}
            name={name}
            className={`w-full ${error ? "border-red-500" : ""} ${areaHeight}`}
          />
        </View>
      </View>

      {/* Error message */}
      {error && <p className="text-danger text-sm mt-1">{error}</p>}

      {/* Add custom CSS for TipTap styling */}
      {/* <style jsx global> */}
      <style>{`
        /* Editor base styles */
        .ProseMirror {
          outline: none;
        }

        /* Heading styles */
        .ProseMirror h1 {
          font-size: 2em;
          font-weight: bold;
          margin-top: 0.67em;
          margin-bottom: 0.67em;
        }

        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 0.83em;
          margin-bottom: 0.83em;
        }

        .ProseMirror h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 1em;
        }

        /* List styles */
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 2rem;
          margin: 1em 0;
        }

        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 2rem;
          margin: 1em 0;
        }

        .ProseMirror li {
          margin-bottom: 0.5em;
        }

        /* Blockquote styles */
        .ProseMirror blockquote {
          border-left: 4px solid #e2e8f0;
          padding-left: 1rem;
          margin-left: 0;
          margin-right: 0;
          font-style: italic;
          color: rgb(189, 190, 193);
        }

        /* Code styles */
        .ProseMirror code {
          background-color: #f7fafc;
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-family: monospace;
          font-size: 0.9em;
        }

        /* Bold styles */
        .ProseMirror strong {
          font-weight: bold;
        }

        /* Italic styles */
        .ProseMirror em {
          font-style: italic;
        }

        /* Strike styles */
        .ProseMirror s {
          text-decoration: line-through;
        }

        /* Placeholder text */
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </View>
  );
};

export default TipTapTextEditor;
