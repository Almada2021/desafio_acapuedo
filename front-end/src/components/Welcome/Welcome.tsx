import { Box, Typography } from "@mui/material";
interface IWelcomeComponent {
    greetings: string;
}
export default function Welcome({ greetings }: IWelcomeComponent) {
  return (
    <Box 
        component="section"
        minHeight={200}
        textAlign="center"
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{ p: 2, border: "1px dashed grey" }}
    >
        <Typography variant="h4" gutterBottom>

            Bienvenido, {greetings}
        </Typography>
    </Box>
  );
}
