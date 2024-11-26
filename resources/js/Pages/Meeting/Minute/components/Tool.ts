import Header from "@editorjs/header";
import CheckList from "@editorjs/checklist";
import List from "@editorjs/list";
import Raw from "@editorjs/raw";
import ImageTool from "@editorjs/image";
import Quote from "@editorjs/quote";
import Embeds from "@editorjs/embed";

export const Editor_Tools: any = {
    header: {
        class: Header,
        inlineToolbar: ["link"],
    },
    list: {
        class: List,
        inlineToolbar: true,
    },
    checklist: {
        class: CheckList,
        inlineToolbar: true,
    },
    image: {
        class: ImageTool,
        config: {
            endpoints: {
                byFile: `${window.location.origin}/meeting-image-upload`,
                byUrl: `${window.location.origin}/meeting-image-upload`,
            },
            additionalRequestHeaders: {
                "X-CSRF-TOKEN": document
                    ?.querySelector('meta[name="csrf-token"]')
                    ?.getAttribute("content"),
            },
        },
    },
    raw: Raw,
    quote: Quote,
    embed: Embeds,
};
