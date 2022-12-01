import { LinearProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";

export default function LinearProgressWithLabel({label,...props}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">
					{`${label}`}
				</Typography>
      </Box>
    </Box>
  );
}