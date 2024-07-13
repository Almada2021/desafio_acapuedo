import { CircularProgress, Box } from "@mui/material";
import { styled } from "@mui/system";

const Overlay = styled(Box)({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
});

const LoadingOverlay = () => (
  <Overlay >
    <CircularProgress size={60} />
  </Overlay>
);

export default LoadingOverlay;