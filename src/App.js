import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import React, { useState } from "react";
import { WebSocketServer } from "ws";

const useStyles = (theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

function App({ classes }) {
  const [filledForm, setFilledForm] = useState(false);
  const [messages, setMessages] = useState("");
  const [value, setValue] = useState("");
  const [name, setName] = useState("");
  const [room, setRoom] = useState("test");

  const url = "ws://127.0.0.1:8000/ws/" + room + "/";
  const ws = new WebSocketServer(url, {
    perMessageDeflate: false,
  });

  ws.on("open", () => {
    console.log("open");
  });
  ws.on("close", () => {
    console.log("close");
  });

  ws.on("message", (message) => {
    const dataFromServer = JSON.parse(message.data);
    if (dataFromServer) {
      setMessages((oldMessages) => [
        ...oldMessages,
        {
          msg: dataFromServer.text,
          name: dataFromServer.sender,
        },
      ]);
    }
  });

  function onButtonClicked(e) {
    ws.send(
      JSON.stringify({
        type: "message",
        text: this.state.value,
        sender: this.state.name,
      })
    );
    setValue("");
    e.preventDefault();
  }

  return (
    <Container component="main" maxWidth="xs">
      {filledForm ? (
        <div style={{ marginTop: 50 }}>
          Room Name: {room}
          <Paper
            style={{
              height: 500,
              maxHeight: 500,
              overflow: "auto",
              boxShadow: "none",
            }}
          >
            {messages.map((message) => (
              <>
                <Card className={classes.root}>
                  <CardHeader title={message.name} subheader={message.msg} />
                </Card>
              </>
            ))}
          </Paper>
          <form
            className={classes.form}
            noValidate
            onSubmit={() => onButtonClicked()}
          >
            <TextField
              id="outlined-helperText"
              label="Write text"
              defaultValue="Default Value"
              variant="outlined"
              value={value}
              fullWidth
              onChange={(e) => {
                setValue(e.target.value);
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Send Message
            </Button>
          </form>
        </div>
      ) : (
        <div>
          <CssBaseline />
          <div className={classes.paper}>
            <form
              className={classes.form}
              noValidate
              onSubmit={() => setFilledForm(true)}
            >
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Room name"
                name="Room name"
                autoFocus
                value={room}
                onChange={(e) => {
                  setRoom(e.target.value);
                  setValue(room);
                }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="sender"
                label="sender"
                type="sender"
                id="sender"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setValue(name);
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Submit
              </Button>
            </form>
          </div>
        </div>
      )}
    </Container>
  );
}

export default withStyles(useStyles)(App);
