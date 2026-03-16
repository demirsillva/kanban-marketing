'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  List, 
  ListOrdered, 
  CheckSquare, 
  Heading1, 
  Heading2 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface RichTextEditorProps {
  description: string;
  onChange: (html: string) => void;
  className?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border-b border-slate-200 rounded-t-xl">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={cn("p-1.5 rounded-md text-slate-500 hover:bg-slate-200 transition-colors", editor.isActive('bold') && "bg-slate-200 text-slate-900 font-bold")}
        title="Negrito"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={cn("p-1.5 rounded-md text-slate-500 hover:bg-slate-200 transition-colors", editor.isActive('italic') && "bg-slate-200 text-slate-900")}
        title="Itálico"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={cn("p-1.5 rounded-md text-slate-500 hover:bg-slate-200 transition-colors", editor.isActive('strike') && "bg-slate-200 text-slate-900")}
        title="Taxado"
      >
        <Strikethrough className="w-4 h-4" />
      </button>

      <div className="w-px h-4 bg-slate-300 mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={cn("p-1.5 rounded-md text-slate-500 hover:bg-slate-200 transition-colors", editor.isActive('heading', { level: 1 }) && "bg-slate-200 text-slate-900")}
        title="Título 1"
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cn("p-1.5 rounded-md text-slate-500 hover:bg-slate-200 transition-colors", editor.isActive('heading', { level: 2 }) && "bg-slate-200 text-slate-900")}
        title="Título 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>

      <div className="w-px h-4 bg-slate-300 mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn("p-1.5 rounded-md text-slate-500 hover:bg-slate-200 transition-colors", editor.isActive('bulletList') && "bg-slate-200 text-slate-900")}
        title="Lista com Marcadores"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn("p-1.5 rounded-md text-slate-500 hover:bg-slate-200 transition-colors", editor.isActive('orderedList') && "bg-slate-200 text-slate-900")}
        title="Lista Numerada"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={cn("p-1.5 rounded-md text-slate-500 hover:bg-slate-200 transition-colors", editor.isActive('taskList') && "bg-slate-200 text-slate-900")}
        title="Checklist"
      >
        <CheckSquare className="w-4 h-4" />
      </button>
    </div>
  );
};

export function RichTextEditor({ description, onChange, className }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskList.configure({ HTMLAttributes: { class: 'not-prose pl-2 my-2' } }),
      TaskItem.configure({ 
        nested: true,
        HTMLAttributes: { class: 'flex items-start gap-2 my-1' },
      }),
    ],
    content: description,
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm prose-slate max-w-none focus:outline-none min-h-[120px] p-4 bg-white rounded-b-xl',
          '[&_ul[data-type="taskList"]]:list-none [&_ul[data-type="taskList"]]:p-0',
          '[&_li[data-type="taskItem"]>label>input]:mt-1 [&_li[data-type="taskItem"]>label>input]:w-4 [&_li[data-type="taskItem"]>label>input]:h-4 [&_li[data-type="taskItem"]>label>input]:text-indigo-600 [&_li[data-type="taskItem"]>label>input]:rounded [&_li[data-type="taskItem"]>label>input]:border-slate-300 [&_li[data-type="taskItem"]>label>input]:ring-indigo-500',
          '[&_li[data-type="taskItem"]>div]:flex-1',
          className
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Keep editor content in sync if the external prop changes heavily (e.g. switching cards)
  useEffect(() => {
    if (editor && description !== editor.getHTML()) {
      editor.commands.setContent(description, false);
    }
  }, [description, editor]);

  return (
    <div className="border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-400 focus-within:shadow-md transition-all">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="flex-1 cursor-text" />
    </div>
  );
}
