import React, { useRef, useEffect } from "react";
import EditorJS from "@editorjs/editorjs";
import { Box } from "@mui/material";
import { Editor_Tools } from "./Tool";
import { router, useForm } from "@inertiajs/react";
import { useSnackbar } from "@/Context/SnackbarProvider";
import { LoadingButton } from "@mui/lab";
import LoadingCircle from "@/icons/LoadingCircle";

interface EditorProps {
    initialData?: any;
    id: number;
    status: number
}

const Editor: React.FC<EditorProps> = ({ initialData, id , status }) => {
    const { data, setData, put, processing, errors } = useForm<any>({
        detail: "",
        status: status ? status : 0,
    });

    const editorRef = useRef<EditorJS | null>(null);
    const { showSnackbar } = useSnackbar();

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if(editorRef.current ) {

          const outputData: any = await editorRef?.current?.save();


          if (!outputData || Object.keys(outputData).length === 0) {
            return showSnackbar("Editor content is empty. Please add some content.", "error");
        }

          const formData = new FormData();
          formData.append('detail', JSON.stringify(outputData));
          formData.append('status', data.status);
          formData.append("_method", "PUT");
  
          router.post(`/meeting-minutes/${id}`, formData, {
            onSuccess: () => {
                showSnackbar('Meeting Minute updated successfully.')
            },
            onError: (error: any) => {
              if (error.error) {
                return showSnackbar(
                    error.error || "Failed to create meeting minute.",
                    "error"
                );
            } else if (
                error &&
                typeof error === "object" &&
                !Array.isArray(error)
            ) {
                const errorKeys = Object.keys(error);
                if (errorKeys.length > 0) {
                    return;
                }
            }
            showSnackbar("Failed to update meeting minute.", "error");
            }
        });
        }
    };

    // useEffect(() => {
    //   if (editorRef.current) {
    //     const setDetail = async () => {
    //       const outputData: any = await editorRef?.current?.save();
    //       setData({ detail: outputData });
    //     }
        
    //     setDetail();
    //   }
    // }, [editorRef])

    useEffect(() => {
        editorRef.current = new EditorJS({
            holder: "editor-container",
            readOnly: status === 1,
            autofocus: true,
            tools: Editor_Tools,
            data: initialData,
        });

        return () => {
            if (editorRef.current && editorRef.current.destroy) {
                editorRef.current.destroy();
            }
        };
    }, []);

    return (
        <Box className="editor-container" component='form' onSubmit={handleSave}>
            <Box
                id="editor-container"
                sx={{
                    background: "#f8f8f8",
                    padding: "20px 30px",
                    minHeight: "500px",
                }}
            ></Box>
            <Box width="100%" display="flex" gap={5} justifyContent="center" sx={{
              visibility: status === 1 ? "hidden" : "visible"
            }}>
                {/* <Button
                    variant="contained"
                    sx={{
                        mt: 3,
                        mx: "auto",
                        textAlign: "center",
                    }}
                    onClick={handleSave}
                >
                    Save
                </Button> */}

                <LoadingButton
                    onClick={() => setData("status", 2)}
                    loading={processing}
                    type="submit"
                    loadingPosition="start"
                    startIcon={
                        data.status === 2 && processing ? (
                            <LoadingCircle />
                        ) : (
                            <span />
                        )
                    }
                    sx={{ mt: 3, mb: 2, bgcolor: "gray" }}
                    variant="contained"
                >
                    Draft
                </LoadingButton>
                <LoadingButton
                    onClick={() => setData("status", 1)}
                    loading={processing}
                    type="submit"
                    loadingPosition="start"
                    startIcon={
                        data.status === 1 && processing ? (
                            <LoadingCircle />
                        ) : (
                            <span />
                        )
                    }
                    sx={{ mt: 3, mb: 2 }}
                    variant="contained"
                >
                    Confirm
                </LoadingButton>
            </Box>
        </Box>
    );
};

export default Editor;
