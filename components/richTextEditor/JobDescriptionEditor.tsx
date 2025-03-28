
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { MenuBar } from "./MenuBar";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
export function JobDescriptionEditor() {

    const editor = useEditor({
        extensions: [StarterKit, TextAlign.configure({ types: ["heading", "paragraph"] }), Typography],
        immediatelyRender: false,
        
    })

    return (
        <div className="w-full overflow-hidden rounded-lg bg-card">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}