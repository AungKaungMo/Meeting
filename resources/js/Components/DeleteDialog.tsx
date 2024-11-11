import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import React from 'react';
import { Button } from '@mui/material';
import AlertTriangle from "@/icons/AlertTriangle";

// Define the type for the component props
interface WarningDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

const DeleteDialog = ({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  title = "Warning!",
  description = "You will lose all of your data by deleting this. This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
}: WarningDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={() => onOpenChange?.(false)}
      disableEnforceFocus
      disableAutoFocus
    >
      <DialogContent className="max-w-[400px] p-0">
        <div className=" flex gap-4 items-start">
          {/* <DialogTitle className="flex flex-row items-start gap-4"> */}
            <div className="rounded-full bg-muted p-2">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="gap-1.5">
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="text-base text-muted-foreground">{description}</p>
            </div>
          {/* </DialogTitle> */}
        </div>
      </DialogContent>
      <DialogActions className="flex items-center justify-end gap-2 bg-muted/50 p-3">
        <Button
          variant="outlined"
          onClick={() => {
            onCancel?.();
            onOpenChange?.(false);
          }}
        >
          {cancelText}
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            onConfirm?.();
            onOpenChange?.(false);
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDialog;
