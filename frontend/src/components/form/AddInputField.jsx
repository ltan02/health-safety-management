import {
  FormControl,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { VARIANT_TYPES } from "./form_data";

function AddInputField({
  onTitleChange,
  onDescriptionChange,
  onPlaceHolderChange,
  onRequiredChange,
  initialTitle,
  initialDescription,
  initialPlaceHolder,
  initialRequired,
}) {
  return (
    <FormControl fullWidth margin="normal" sx={{gap: 1}}>
      <TextField
        onChange={onTitleChange}
        variant={VARIANT_TYPES.STANDARD}
        placeholder="Title"
        required
        margin="dense"
        fullWidth
        label="Title"
        defaultValue={initialTitle}
      />
      <TextField
        onChange={onDescriptionChange}
        variant={VARIANT_TYPES.STANDARD}
        placeholder="Description (optional)"
        margin="dense"
        fullWidth
        label="Description (optional)"
        defaultValue={initialDescription}
      />
      <TextField
        onChange={onPlaceHolderChange}
        variant={VARIANT_TYPES.STANDARD}
        placeholder="Placeholder (optional)"
        margin="dense"
        fullWidth
        label="Placeholder (optional)"
        defaultValue={initialPlaceHolder}
      />
      <Select
        fullWidth
        variant={VARIANT_TYPES.STANDARD}
        onChange={onRequiredChange}
        label="Required"
        defaultValue={true}
        sx={{marginTop: 2}}
      >
        <MenuItem value={true}>Required</MenuItem>
        <MenuItem value={false}>Optional</MenuItem>
      </Select>
    </FormControl>
  );
}

export default AddInputField;
