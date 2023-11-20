import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Snackbar,
  IconButton,
} from "@mui/material";
import { green, red } from "@mui/material/colors";
import CheckIcon from "@mui/icons-material/Check";
import { ContentContainer } from "./styles";
import { invoke } from "@tauri-apps/api/tauri";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const ConnectionPage = () => {
  const [redisUrl, setRedisUrl] = React.useState<string>("127.0.0.1");
  const [redisPort, setRedisPort] = React.useState<string>("6379");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState("");

  const navigate = useNavigate();

  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      "&:hover": {
        bgcolor: green[700],
      },
    }),
    ...(error && {
      bgcolor: red[500],
      "&:hover": {
        bgcolor: red[700],
      },
    }),
  };

  const testRedisConnection = async () => {
    setLoading(true);
    setSuccess(false);

    const timeout = new Promise((resolve) => setTimeout(resolve, 1500));
    const testConnection = invoke("test_redis_connection", {
      redisUrl,
      port: redisPort,
    });

    try {
      await Promise.all([testConnection, timeout]);
      setSuccess(true);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error: any) {
      setError("Connection failed: " + error);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContentContainer>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          paddingTop: 3,
          paddingBottom: 5,
          backgroundColor: "#28292d",
        }}
      >
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 600,
            textAlign: "left",
            color: "white",
            marginLeft: 5,
            marginBottom: 2,
          }}
        >
          Easy Connection
        </Typography>
        <Grid
          container
          spacing={2}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 600,
                textAlign: "left",
                color: "white",
                ml: 5,
              }}
            >
              URL
            </Typography>
            <TextField
              hiddenLabel
              id="outlined-hidden-label-small"
              placeholder="localhost"
              variant="outlined"
              size="small"
              sx={{
                ml: 2,
                width: { xs: "80%", sm: "100%" },
                "& .MuiInputBase-input::placeholder": {
                  color: "white",
                },
                '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
              }}
              onChange={(e) => setRedisUrl(e.target.value)}
            />
          </Grid>
          <Grid
            item
            xs={6}
            sm={3}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 600,
                textAlign: "left",
                color: "white",
                ml: { xs: 5, sm: 0 },
              }}
            >
              Port
            </Typography>
            <TextField
              hiddenLabel
              id="outlined-hidden-label-small"
              placeholder="6379"
              variant="outlined"
              size="small"
              sx={{ width: "50%", ml: 2,
              "& .MuiInputBase-input::placeholder": {
                color: "white",
              },
              '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
            }}
              onChange={(e) => setRedisPort(e.target.value)}
            />
          </Grid>

          <Grid item xs={6} sm={3} sx={{ justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="primary"
              sx={{
                ...buttonSx,
                height: 30,
                mr: 1,
                ml: 3,
                position: "relative",
              }}
              disabled={loading}
              onClick={testRedisConnection}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 100,
                }}
              >
                {success ? <CheckIcon /> : "Connect"}
              </Box>
              {loading && (
                <CircularProgress
                  size={24}
                  sx={{
                    color: green[500],
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: "-12px",
                    marginLeft: "-12px",
                  }}
                />
              )}
            </Button>
          </Grid>
          <Snackbar
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={!!error}
            autoHideDuration={5000}
            onClose={() => setError("")}
            message={error}
            style={{
              maxWidth: 400,
            }}
            ContentProps={{
              style: { backgroundColor: "#f56642" },
            }}
            action={
              <React.Fragment>
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={() => setError("")}
                  style={{ color: "#fff", padding: 0 }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </React.Fragment>
            }
          />
        </Grid>
      </Box>
    </ContentContainer>
  );
};

export default ConnectionPage;
