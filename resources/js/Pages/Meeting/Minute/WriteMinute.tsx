import { Box } from "@mui/material"
import Editor from "./components/Editor"
import { MeetingMinuteDataType } from "@/PageType";

const WriteMinute = ({meeting_minute} : MeetingMinuteDataType) => {

  const initialData = meeting_minute.detail ? JSON.parse(meeting_minute.detail) : {
    blocks: [
      {
        type: "paragraph",
        data: {
          text: "Type your meeting minute here.",
        },
      },
    ],
    version: "2.19.0",
  };

  return (
    <Box mt={4} sx={{
      boxShadow: '0px 0px 20px 0px rgba(76,87,125, 0.2)',
      background: '#fff',
      padding: '20px 30px',
      width: '85%',
      margin: '50px auto'
    }}>
      <Editor initialData={initialData} status={meeting_minute.status} id={meeting_minute.id}  />
    </Box>
  );
}

export default WriteMinute