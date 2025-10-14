'use client'

import { useEffect } from 'react'

import Divider from '@mui/material/Divider'

import type { Editor } from '@tiptap/core'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
import { Underline } from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'

import '@/libs/styles/tiptapEditor.css'
import CustomIconButton from '@core/components/mui/IconButton'

const EditorToolbar = ({
  editor,
  disabled
}: {
  editor: Editor | null
  disabled: boolean
}) => {
  if (!editor) {
    return null
  }

  return (
    <div className='flex flex-wrap gap-x-3 gap-y-1 p-6'>
      <CustomIconButton
        {...(editor.isActive('bold') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={disabled}
      >
        <i className='tabler-bold' />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('underline') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={disabled}
      >
        <i className='tabler-underline' />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('italic') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={disabled}
      >
        <i className='tabler-italic' />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('strike') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={disabled}
      >
        <i className='tabler-strikethrough' />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'left' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        disabled={disabled}
      >
        <i className='tabler-align-left' />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'center' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        disabled={disabled}
      >
        <i className='tabler-align-center' />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'right' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        disabled={disabled}
      >
        <i className='tabler-align-right' />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'justify' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        disabled={disabled}
      >
        <i className='tabler-align-justified' />
      </CustomIconButton>
    </div>
  )
}

const EditorBasic = ({
  content,
  onChange,
  disabled = false,
  editorClassName,
  placeholder
}: {
  content?: string
  disabled?: boolean
  onChange?: (content: string) => void
  editorClassName?: string
  placeholder?: string
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || 'Nhập nội dung...',
        emptyEditorClass: 'is-editor-empty',
        showOnlyWhenEditable: true,
        showOnlyCurrent: true 
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Underline,
    ],
    content: content ?? '',
    immediatelyRender: false,
    editable: !disabled,
    editorProps: {
      attributes: {
        class:
          editorClassName ||
          'tiptap ProseMirror min-h-[200px] max-h-[240px] overflow-y-auto py-3 px-8 focus:outline-none prose prose-sm max-w-none'
      }
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()

      onChange?.(html)
    }
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content ?? '', false)
    }
  }, [content, editor])

  return (
    <div className='border rounded-md'>
      <EditorToolbar
        editor={editor}
        disabled={disabled}
      />
      <Divider />
      <EditorContent
        editor={editor}
        disabled={disabled}
        className='overflow-y-auto !border-0 shadow-none ProseMirror-no-border'
      />
    </div>
  )
}

export default EditorBasic
