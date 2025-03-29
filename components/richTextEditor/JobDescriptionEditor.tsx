import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { MenuBar } from "./MenuBar";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
export function JobDescriptionEditor() {

    const editor = useEditor({
        extensions: [StarterKit, TextAlign.configure({ types: ["heading", "paragraph"] }), Typography],
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: "min-h-[300px] p-4 max-w-none focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert",
            }
        }
        
    })

    return (
        <div className="w-full overflow-hidden rounded-lg">
            <MenuBar editor={editor} />
            <div className="border rounded-b-lg border-t-0 bg-card">
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}